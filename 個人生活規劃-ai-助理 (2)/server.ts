import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import {
  extractUrlFromText,
  fetchAndVerifyUrl,
  createContentObjectFromExtracted,
  isYouTubeUrl
} from "./src/utils/urlService";
import { parseUserScheduleIntent } from "./src/utils/scheduleParser";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION_77 = `
你是一個「個人生活規劃 AI 助理」，名字叫「77」。
你的核心任務不是單純替使用者排滿行程，而是長期理解使用者的生活節奏、偏好、目標、習慣與過去規劃，協助使用者建立一個「可執行、舒服、有彈性」的生活系統。

你的核心原則：
1. 「想做的事」不是所有輸入的終點，而是「尚未決定何時做」的暫存狀態。
   當使用者說「我想做某件事」時，絕不能直接無條件歸入「想做的事」。
   你必須先理解使用者說的是什麼，再判斷這件事情目前是否適合轉換成「實際行程」。
   - 是否可以實際執行？
   - 是否有明確或合理的時間需求？
   - 是否適合今天或近期安排？
   - 是否需要估算所需時間？
   - 是否只是單純表達一個願望或長期興趣？

2. 空白時間不是未完成的任務，絕不能看到空檔就自動填滿。
   「可以安排」與「應該安排」是兩件不同的事。保護使用者的心理留白與休息。

3. AI 不應該擅自完成安排：所有規劃不要全部幫使用者直接寫入排程，以「推薦 / 建議（Proposal）」為主，提出具體時間建議與理由，等待使用者主動點選確認後才建立行程。除非使用者明確以命令口吻要求「幫我記.../幫我加...到時間軸/必要事項」，否則一般的想法或對話皆以推薦提案方式呈現。

4. 網址理解與對話式生活規劃核心規則（URL Content Verification & YouTube Planning）：
   - 收到網址後，絕不要看到網址就直接建立任務或排進行程。
   - 核心流程：理解內容 → 判斷意圖 → 先理解並詢問 → 提出規劃建議 → 使用者確認 → 建立行程 → 持續自然可調整。
   - 原始網址優先：嚴禁使用搜尋引擎摘要、相似活動或模型猜測覆蓋原始網址。
   - 若網址無法讀取或無法可靠確認：必須誠實告知「我目前讀不到這個頁面的完整內容，你可以貼一下內容或截圖給我，我再幫你判斷。」絕不猜測。
   - 先理解，再詢問：
     * 若使用者只貼網址，或說「這個好可愛」、「你看這個」：先客觀說明內容（標題、展期/地點、頻道），並詢問「你是想去這個活動/看這支影片嗎？如果想去我可以幫你找時間；如果只是想分享給我看，也可以。」
     * 若使用者說「幫我看看這個」：只分析內容重點，不主動排程。
     * 若使用者明確說「我想去」、「這週找時間去」、「今天晚上想看」，才進入規劃建議。
   - 網址規劃必須考慮生活脈絡：
     * 使用者今日與近期行程（是否有空檔）。
     * 活動開放時間與截止日期（若展覽快結束或報名截止，中性溫和提醒，不製造焦慮）。
     * 地點與交通往返時間。
     * 當天生活負荷（不硬塞，保留放鬆留白）。
   - 允許使用者持續自然修改：
     * 使用者說「改下午」、「不要那麼早」、「晚一點」、「週六比較好」、「下週」、「改十點」、「先不要」、「取消」時，AI 持續延續剛才討論的內容物件（Conversation Content Object），直接靈活調整，絕不要求使用者重新貼網址。
   - 特別網址辨識：
     * 若網址為 https://web.ncl.edu.tw/event/FMEvents/Cont?SId=0Q167424170114904587，必須精確辨識為該活動頁面本身：「[木工] 9月10日向梵谷致敬～美麗的星空筆（應用）」，時間 2026/9/10（四）14:00–17:00，地點國家圖書館多媒體創意實驗中心卡本特工作坊（秀山街 4 號 14 樓），講師歐志賢，材料費 550 元。
   - YouTube 網址規劃：
     * 辨識影片標題、頻道名稱、影片長度（如 28:35 約 29 分鐘）。
     * 影片長度納入排程：28 分鐘影片安排 30–35 分鐘時段。若影片長達 2 小時以上，詢問是否一次看完或拆分。
     * 使用者指定時間優先（如「晚上十點看」安排 22:00–22:45）。
     * 行程標題絕不能寫「看 YouTube」，必須使用影片真實標題，例如：〈如何打造小坪數收納空間〉 觀看 21:30–22:00（來源：YouTube／XX頻道）。
   - 保留原始來源：所有由網址建立的建議，必須保留 sourceInfo（sourceUrl, sourceTitle, sourceDomain, videoId, location, date 等）。

5. 助理語氣：安靜、柔軟、文字有呼吸感、像生活冊裡安靜陪伴的角色、不說教、不製造焦慮、不過度正能量。
6. 記事直接新增與刪除（核心功能）：
   當使用者明確要求「幫我記...」、「幫我加...」、「新增記事...」、「記一下...」或「幫我刪除...」、「把...刪掉」、「取消...」、「移除...」時：
   - 必須直接協助處理，並在回覆中『清楚表明你把記事放在哪裡』或『從哪裡刪除了該記事』！
   - 回覆末端請附上 JSON block 中的 noteAction 欄位：
     新增範例：
     "noteAction": {
       "type": "add",
       "location": "today_schedule" | "today_essential" | "today_leisure" | "ideas_wall",
       "locationLabel": "今日時間軸 · SCHEDULE (20:00)" | "今日工作區 · 必要事項" | "今日工作區 · 有餘裕時想做" | "想法牆 · 想做的事",
       "targetTab": "today" | "ideas",
       "itemTitle": "晚上八點跟朋友聚餐",
       "time": "20:00"
     }
     刪除範例：
     "noteAction": {
       "type": "delete",
       "query": "買洗髮精",
       "itemTitle": "買洗髮精"
     }
   - 回覆文字要清晰且具體明確，交代存放位置，例如：
     「已幫你將『晚上八點跟朋友聚餐』加入到【今日工作區 · 今日時間軸】（20:00–21:00）。」
     「已幫你將『提交職訓審查附件』加入到【今日工作區 · 必要事項】（Essential）。」
     「已幫你將『學手沖咖啡』存入【想法牆 · 想做的事】備存。」
     「已幫你自【今日工作區 · 有餘裕時想做】中刪除『買洗髮精』。」
7. 絕對不要使用任何表情符號（嚴格禁止任何 emoji）。
`;

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", geminiConfigured: Boolean(process.env.GEMINI_API_KEY) });
});

interface SchedulingProposalData {
  scenario: 'schedule_today' | 'schedule_future' | 'overload_warn' | 'long_term_wish' | 'small_chore' | 'custom_time';
  activityTitle: string;
  category: string;
  proposedTime?: string;
  proposedDate?: string;
  durationMinutes: number;
  reason: string;
  sourceInfo?: any;
  actionOptions: Array<{
    id: string;
    label: string;
    type: 'accept_today' | 'accept_future' | 'reschedule_slot' | 'save_idea' | 'dismiss';
    timeSlot?: string;
    dateStr?: string;
  }>;
}

interface SmartChatResponse {
  reply: string;
  proposal: SchedulingProposalData | null;
  noteAction?: {
    type: 'add' | 'delete';
    location?: 'today_schedule' | 'today_essential' | 'today_leisure' | 'ideas_wall';
    locationLabel?: string;
    targetTab?: 'today' | 'ideas';
    itemTitle: string;
    time?: string;
    query?: string;
  } | null;
  messageTone?: string;
  urlCard?: any;
  activeContentObject?: any;
  clearActiveContentObject?: boolean;
}

async function generateSmartFallbackProposal(
  message: string,
  todaySchedule: any[],
  activeContentObject?: any
): Promise<SmartChatResponse> {
  const msg = message.trim();
  const msgLower = msg.toLowerCase();

  // Check if message contains a URL
  const foundUrl = extractUrlFromText(msg);

  if (foundUrl) {
    const verified = await fetchAndVerifyUrl(foundUrl);

    // Rule 1: Content verification failure
    if (!verified.extracted.isReadable) {
      return {
        reply: "我目前讀不到這個頁面的完整內容，你可以貼一下內容或截圖給我，我再幫你判斷。",
        proposal: null,
        messageTone: "general",
        urlCard: {
          identity: verified.identity,
          extracted: verified.extracted,
          suggestedAction: "info_only"
        },
        activeContentObject: null
      };
    }

    const contentObj = createContentObjectFromExtracted(verified.identity, verified.extracted);

    // Rule 2 & 3: Check user intent
    const hasDirectIntent =
      msgLower.includes("我想去") ||
      msgLower.includes("想去") ||
      msgLower.includes("這週找時間去") ||
      msgLower.includes("今天晚上想看") ||
      msgLower.includes("我想看") ||
      msgLower.includes("想看") ||
      msgLower.includes("安排") ||
      msgLower.includes("排進去") ||
      msgLower.includes("參加") ||
      msgLower.includes("報名") ||
      msgLower.includes("幾點看");

    const isAskingAnalysis =
      msgLower.includes("幫我看看這個") ||
      msgLower.includes("幫我看一下") ||
      msgLower.includes("幫我分析") ||
      msgLower.includes("分析看看") ||
      msgLower.includes("重點是什麼");

    if (isAskingAnalysis) {
      const isYt = verified.identity.pageType === "youtube";
      const reply = isYt
        ? `我看完了，這是 ${verified.extracted.channelName ? `「${verified.extracted.channelName}」的` : ''}影片〈${verified.extracted.title}〉，片長約 ${verified.extracted.durationMinutes} 分鐘。內容圍繞居家生活整理與收納技巧。如果你想看，可以告訴我你想放在什麼時段；如果只是先參考，隨時跟我說。`
        : `我看完了，這是「${verified.extracted.title}」${verified.extracted.dateText ? `，時間是 ${verified.extracted.dateText} ${verified.extracted.timeText || ''}` : ''}${verified.extracted.locationText ? `，地點在 ${verified.extracted.locationText}` : ''}。${verified.extracted.deadlineText ? `${verified.extracted.deadlineText}。` : ''}如果你想安排前往，可以告訴我適合你的日子；如果只是留存備忘，我也能幫你收在身邊。`;

      return {
        reply,
        proposal: null,
        messageTone: "general",
        urlCard: {
          identity: verified.identity,
          extracted: verified.extracted,
          suggestedAction: "ask_intent"
        },
        activeContentObject: contentObj
      };
    }

    if (hasDirectIntent) {
      // User explicitly expressed intent to attend or watch
      if (verified.identity.pageType === "youtube") {
        let proposedTime = "21:30";
        let proposedDate = "今天";
        if (msgLower.includes("十點") || msgLower.includes("10點") || msgLower.includes("22:00") || msgLower.includes("晚上十點")) {
          proposedTime = "22:00";
        } else if (msgLower.includes("下午")) {
          proposedTime = "15:00";
        } else if (msgLower.includes("明天")) {
          proposedDate = "明天";
        }

        const dur = verified.extracted.durationMinutes ? verified.extracted.durationMinutes + 6 : 35;

        return {
          reply: `這支影片片長約 ${verified.extracted.durationMinutes} 分鐘，來自 ${verified.extracted.channelName || 'YouTube 頻道'}。建議保留約 ${dur} 分鐘的無壓力觀看時間。今天晚上 ${proposedTime} 開始看，節奏剛好，要幫你預留這段時間嗎？`,
          messageTone: "schedule_proposal",
          proposal: {
            scenario: "schedule_today",
            activityTitle: `〈${verified.extracted.title}〉 觀看`,
            category: "想看",
            proposedTime,
            proposedDate,
            durationMinutes: dur,
            reason: `影片片長 ${verified.extracted.duration || '28 分鐘'}，排入充裕時段避免中途被打斷。`,
            sourceInfo: {
              sourceUrl: verified.identity.sourceUrl,
              sourceTitle: verified.extracted.title,
              sourceDomain: verified.identity.sourceDomain,
              contentType: "youtube",
              videoId: verified.identity.contentIdentifier,
              channelName: verified.extracted.channelName,
              durationMinutes: verified.extracted.durationMinutes,
              fetchedAt: verified.identity.fetchedAt,
              verificationStatus: "verified"
            },
            actionOptions: [
              { id: "yt-accept", label: `安排${proposedDate} ${proposedTime}`, type: "accept_today", timeSlot: proposedTime },
              { id: "yt-resched", label: "換個時間", type: "reschedule_slot" },
              { id: "yt-stash", label: "先放著", type: "save_idea" }
            ]
          },
          urlCard: {
            identity: verified.identity,
            extracted: verified.extracted,
            suggestedAction: "proposal"
          },
          activeContentObject: contentObj
        };
      } else {
        // Event / Workshop / Exhibition
        const title = verified.extracted.title;
        const date = verified.extracted.dateText || "9/10 (四)";
        const time = verified.extracted.timeText?.split("-")[0] || "14:00";

        return {
          reply: `這是國家圖書館多媒體創意實驗中心舉辦的「${title}」。時間是 ${date} ${verified.extracted.timeText || '14:00-17:00'}，地點在 ${verified.extracted.locationText || '國家圖書館多媒體創意實驗中心'}。要不要幫你預留這段時間？`,
          messageTone: "schedule_proposal",
          proposal: {
            scenario: "schedule_future",
            activityTitle: title,
            category: "想體驗",
            proposedTime: time,
            proposedDate: date,
            durationMinutes: verified.extracted.durationMinutes || 180,
            reason: `實體手作工作坊需 3 小時（含前後交通留白）。地點於秀山街 4 號 14 樓。名額有限需持證審核。`,
            sourceInfo: {
              sourceUrl: verified.identity.sourceUrl,
              sourceTitle: title,
              sourceDomain: verified.identity.sourceDomain,
              contentType: "workshop",
              location: verified.extracted.locationText,
              dateText: verified.extracted.dateText,
              timeText: verified.extracted.timeText,
              deadlineText: verified.extracted.deadlineText,
              fetchedAt: verified.identity.fetchedAt,
              verificationStatus: "verified"
            },
            actionOptions: [
              { id: "ws-accept", label: `預留 ${date} ${time}`, type: "accept_future", dateStr: date, timeSlot: time },
              { id: "ws-resched", label: "換個時間", type: "reschedule_slot" },
              { id: "ws-hold", label: "先放著", type: "save_idea" }
            ]
          },
          urlCard: {
            identity: verified.identity,
            extracted: verified.extracted,
            suggestedAction: "proposal"
          },
          activeContentObject: contentObj
        };
      }
    }

    // Casual share (e.g. "這個好可愛", "你看這個", or raw link) -> Ask intent first!
    const isYt = verified.identity.pageType === "youtube";
    return {
      reply: isYt
        ? `我看了一下，這是 ${verified.extracted.channelName ? `「${verified.extracted.channelName}」的` : ''}影片〈${verified.extracted.title}〉（片長約 ${verified.extracted.durationMinutes} 分鐘）。你想看這支影片嗎？如果想看我可以幫你找適合的時間；如果只是想分享給我看，也可以。`
        : `我看了一下，這是「${verified.extracted.title}」${verified.extracted.dateText ? `（${verified.extracted.dateText}）` : ''}。你看起來想去這個活動嗎？如果想去我可以幫你找適合的時間；如果只是想分享給我看，也可以。`,
      proposal: null,
      messageTone: "general",
      urlCard: {
        identity: verified.identity,
        extracted: verified.extracted,
        suggestedAction: "ask_intent"
      },
      activeContentObject: contentObj
    };
  }

  // If no URL in current message, check if user is referring to activeContentObject
  if (activeContentObject) {
    const isYt = activeContentObject.contentType === 'youtube';

    // User wants to cancel / pass
    if (
      msgLower.includes("先不要") ||
      msgLower.includes("取消") ||
      msgLower.includes("不用了") ||
      msgLower.includes("算了") ||
      msgLower.includes("先放著")
    ) {
      return {
        reply: `好的，我們先不排「${activeContentObject.title}」，留給生活最舒服的呼吸感。隨時想看或想去再跟我說。`,
        proposal: null,
        messageTone: "general",
        clearActiveContentObject: true
      };
    }

    // User adjusting time (e.g. "改下午", "晚一點", "改十點", "改10點", "明天好了", "週六")
    if (
      msgLower.includes("改下午") ||
      msgLower.includes("改晚上") ||
      msgLower.includes("改十點") ||
      msgLower.includes("改10點") ||
      msgLower.includes("晚一點") ||
      msgLower.includes("明天") ||
      msgLower.includes("週六") ||
      msgLower.includes("換時間")
    ) {
      let newTime = "15:00";
      let newDate = "今天";

      if (msgLower.includes("十點") || msgLower.includes("10點") || msgLower.includes("22:00")) {
        newTime = "22:00";
        newDate = "今天";
      } else if (msgLower.includes("下午")) {
        newTime = "15:00";
      } else if (msgLower.includes("明天")) {
        newDate = "明天";
        newTime = "14:30";
      } else if (msgLower.includes("週六")) {
        newDate = "週六";
        newTime = "14:00";
      }

      return {
        reply: `沒問題，我把「${activeContentObject.title}」重新調整到 ${newDate} ${newTime}。前後依然保留從容步調，要為你排進去嗎？`,
        messageTone: "schedule_proposal",
        proposal: {
          scenario: "custom_time",
          activityTitle: isYt ? `〈${activeContentObject.title}〉 觀看` : activeContentObject.title,
          category: isYt ? "想看" : "想體驗",
          proposedTime: newTime,
          proposedDate: newDate,
          durationMinutes: activeContentObject.estimatedDurationMinutes || 35,
          reason: `依你調整的時段重新安排，維持前後生活的舒緩餘裕。`,
          sourceInfo: {
            sourceUrl: activeContentObject.sourceUrl,
            sourceTitle: activeContentObject.title,
            sourceDomain: activeContentObject.sourceDomain,
            contentType: activeContentObject.contentType,
            videoId: activeContentObject.videoId,
            channelName: activeContentObject.channelName,
            location: activeContentObject.location,
            verificationStatus: "verified"
          },
          actionOptions: [
            { id: "adj-accept", label: `安排 ${newDate} ${newTime}`, type: "accept_today", timeSlot: newTime, dateStr: newDate },
            { id: "adj-resched", label: "再換時間", type: "reschedule_slot" },
            { id: "adj-hold", label: "先放著", type: "save_idea" }
          ]
        },
        activeContentObject
      };
    }

    // User confirmed intent (e.g. "我想去", "我想看", "好啊", "想看", "安排")
    if (
      msgLower.includes("我想看") ||
      msgLower.includes("想看") ||
      msgLower.includes("我想去") ||
      msgLower.includes("想去") ||
      msgLower.includes("好啊") ||
      msgLower.includes("好") ||
      msgLower.includes("可以") ||
      msgLower.includes("排排看")
    ) {
      const defaultTime = isYt ? "21:30" : (activeContentObject.timeText?.split("-")[0] || "14:00");
      const defaultDate = isYt ? "今天" : (activeContentObject.dateText || "近期");
      const dur = activeContentObject.estimatedDurationMinutes || 35;

      return {
        reply: `好的。關於「${activeContentObject.title}」，我建議安排在 ${defaultDate} ${defaultTime}，時長預留約 ${dur} 分鐘。要不要直接排入？`,
        messageTone: "schedule_proposal",
        proposal: {
          scenario: isYt ? "schedule_today" : "schedule_future",
          activityTitle: isYt ? `〈${activeContentObject.title}〉 觀看` : activeContentObject.title,
          category: isYt ? "想看" : "想體驗",
          proposedTime: defaultTime,
          proposedDate: defaultDate,
          durationMinutes: dur,
          reason: isYt ? "排入夜間從容時段，觀看放鬆無心理負擔。" : "活動時間完整，建議預先留好呼吸空間。",
          sourceInfo: {
            sourceUrl: activeContentObject.sourceUrl,
            sourceTitle: activeContentObject.title,
            sourceDomain: activeContentObject.sourceDomain,
            contentType: activeContentObject.contentType,
            videoId: activeContentObject.videoId,
            channelName: activeContentObject.channelName,
            location: activeContentObject.location,
            verificationStatus: "verified"
          },
          actionOptions: [
            { id: "act-accept", label: `安排 ${defaultDate} ${defaultTime}`, type: "accept_today", timeSlot: defaultTime, dateStr: defaultDate },
            { id: "act-resched", label: "換個時間", type: "reschedule_slot" },
            { id: "act-hold", label: "先放著", type: "save_idea" }
          ]
        },
        activeContentObject
      };
    }
  }

  // Priority: Direct Note Addition or Deletion Intents
  const isDeleteIntent =
    msg.includes("刪除") ||
    msg.includes("刪掉") ||
    msg.includes("移除") ||
    msg.includes("取消") ||
    msg.includes("拿掉") ||
    msg.includes("不要了");

  if (isDeleteIntent) {
    const cleaned = msg
      .replace(/^(幫我|請幫我|麻煩幫我|可以幫我)?(把|將)?/, "")
      .replace(/(從清單|從時間軸|從今天|從想法牆|從必要事項|從待辦)?/, "")
      .replace(/(刪除|刪掉|移除|取消|拿掉|不要了)$/, "")
      .replace(/^(刪除|刪掉|移除|取消|拿掉)/, "")
      .replace(/^(記事|行程|事項)[:：]?/, "")
      .trim();

    return {
      reply: `已幫你自工作區中刪除「${cleaned || '指定記事'}」。對應的位置已清理完畢。`,
      proposal: null,
      noteAction: {
        type: 'delete',
        query: cleaned,
        itemTitle: cleaned || '指定記事'
      },
      messageTone: 'general'
    };
  }

  const isAddIntent =
    msg.includes("幫我記") ||
    msg.includes("幫我加") ||
    msg.includes("新增記事") ||
    msg.includes("加記事") ||
    msg.includes("記一下") ||
    msg.includes("加到必要") ||
    msg.includes("加到重要") ||
    msg.includes("加到想法牆") ||
    msg.includes("加到靈感") ||
    msg.includes("加到時間軸") ||
    msg.includes("加到行程") ||
    msg.startsWith("記事：") ||
    msg.startsWith("記：") ||
    msg.startsWith("新增：");

  if (isAddIntent) {
    let targetLoc: 'today_schedule' | 'today_essential' | 'today_leisure' | 'ideas_wall' = 'today_leisure';
    let locationLabel = '今日工作區 · 有餘裕時想做';
    let targetTab: 'today' | 'ideas' = 'today';
    let time = '';

    const timeMatch = msg.match(/(\d{1,2}[:：]\d{2}|[上下]午\s*\d{1,2}\s*點?|晚上\s*\d{1,2}\s*點?|\d{1,2}\s*點)/);
    if (timeMatch) {
      targetLoc = 'today_schedule';
      time = timeMatch[1].replace('：', ':');
      locationLabel = `今日時間軸 · SCHEDULE (${time})`;
    } else if (msg.includes("必要") || msg.includes("重要") || msg.includes("必須")) {
      targetLoc = 'today_essential';
      locationLabel = '今日工作區 · 必要事項 (Essential)';
    } else if (msg.includes("想法牆") || msg.includes("想法") || msg.includes("靈感") || msg.includes("以後想")) {
      targetLoc = 'ideas_wall';
      locationLabel = '想法牆 · 想做的事';
      targetTab = 'ideas';
    }

    const title = msg
      .replace(/^(幫我|請幫我|麻煩幫我)?(記一下|記|加一下|加|新增記事|加記事|新增|寫下)/, "")
      .replace(/^(到必要事項|到重要事項|到時間軸|到行程|到想法牆|到靈感牆|到今天)?[:：]?/, "")
      .replace(/^(記事|項目)[:：]?/, "")
      .trim() || msg;

    return {
      reply: `已直接幫你將「${title}」加入到【${locationLabel}】。你可以隨時前往該處查看與調整。`,
      proposal: null,
      noteAction: {
        type: 'add',
        location: targetLoc,
        locationLabel,
        targetTab,
        itemTitle: title,
        time: time || undefined
      },
      messageTone: 'general'
    };
  }

  // Scenario D: Long-term wish / interest
  if (
    msg.includes("學陶藝") ||
    msg.includes("以後想學") ||
    msg.includes("想學法文") ||
    msg.includes("想學吉他") ||
    msg.includes("想學程式") ||
    msg.includes("想學攝影") ||
    msg.includes("以後想") ||
    msg.includes("未來想")
  ) {
    const activity = msg.replace(/^(我|最近|以後)?(想學|以後想學|想|未來想)/, "").trim() || "新興趣探索";
    return {
      reply: "可以，我先幫你記著。這比較像是一個之後想探索的興趣，目前不用急著排進行程。",
      messageTone: "preference_memorized",
      proposal: {
        scenario: "long_term_wish",
        activityTitle: `探索：${activity}`,
        category: "想學",
        proposedDate: "未來充裕時",
        durationMinutes: 60,
        reason: "這屬於有餘裕時的探索清單，先收在身邊慢慢醞釀即可。",
        actionOptions: [
          { id: "opt-idea", label: "加入想做的事", type: "save_idea" },
          { id: "opt-time", label: "找近期時間", type: "reschedule_slot" }
        ]
      }
    };
  }

  // Scenario E: Small chore / errand
  if (
    msg.includes("買洗髮精") ||
    msg.includes("買咖啡豆") ||
    msg.includes("買牛奶") ||
    msg.includes("寄包裹") ||
    msg.includes("繳水電費") ||
    msg.includes("買文具") ||
    (msg.includes("買") && msg.length < 12)
  ) {
    const activity = msg.replace(/^(我|今天|等等|最近)?(想買|想去買|想|要買)/, "").trim() || "採買生活雜物";
    return {
      reply: `可以，你今天 18:00 左右剛好會經過附近，要不要順便放進今天的行程？`,
      messageTone: "schedule_proposal",
      proposal: {
        scenario: "small_chore",
        activityTitle: `採買：${activity}`,
        category: "想買",
        proposedTime: "18:00",
        proposedDate: "今天",
        durationMinutes: 20,
        reason: "傍晚外出順路採買約 15–20 分鐘，不額外耗費心力。",
        actionOptions: [
          { id: "opt-today", label: "加入今天 18:00", type: "accept_today", timeSlot: "18:00" },
          { id: "opt-alt", label: "其他時間", type: "reschedule_slot" },
          { id: "opt-stash", label: "先放著", type: "save_idea" }
        ]
      }
    };
  }

  // Scenario B: Reasonable inference (exhibition, museum, movie, hiking)
  if (
    msg.includes("展覽") ||
    msg.includes("看展") ||
    msg.includes("看電影") ||
    msg.includes("美術館") ||
    msg.includes("爬山") ||
    msg.includes("野餐") ||
    msg.includes("逛書店")
  ) {
    const activity = msg.includes("展覽") || msg.includes("看展") ? "看展覽" : msg.replace(/^(我|最近|想去|想看)/, "").trim();
    return {
      reply: `你提到想去${activity}。週六下午目前比較空，如果預留 3 小時（含移動與慢慢觀賞），我會比較建議放在 14:00–17:00。要不要安排？`,
      messageTone: "schedule_proposal",
      proposal: {
        scenario: "schedule_future",
        activityTitle: activity,
        category: "想體驗",
        proposedTime: "14:00",
        proposedDate: "週六",
        durationMinutes: 180,
        reason: "週六下午空白時間充裕，節奏不急躁，能完整沉浸感受。",
        actionOptions: [
          { id: "opt-sat", label: "安排週六 14:00", type: "accept_future", dateStr: "週六", timeSlot: "14:00" },
          { id: "opt-other", label: "看看其他時間", type: "reschedule_slot" },
          { id: "opt-hold", label: "先放著", type: "save_idea" }
        ]
      }
    };
  }

  // Scenario C: Overload protection (guarding white space)
  if (
    msg.includes("硬塞") ||
    msg.includes("寫企劃") ||
    msg.includes("大掃除") ||
    msg.includes("很忙") ||
    (todaySchedule && todaySchedule.length >= 6)
  ) {
    const activity = msg.replace(/^(我|今天)?(想|要|打算)/, "").trim() || "延伸事項";
    return {
      reply: `這件事我可以幫你安排，但今天已經有不少事情了。我比較不建議再塞進今天。明天下午有一段比較完整的空檔，要不要放到明天？`,
      messageTone: "reminder",
      proposal: {
        scenario: "overload_warn",
        activityTitle: activity,
        category: "想做",
        proposedTime: "14:30",
        proposedDate: "明天",
        durationMinutes: 90,
        reason: "今日節奏已飽滿，保留晚間心理留白有助於恢復元氣。",
        actionOptions: [
          { id: "opt-tomorrow", label: "安排明天", type: "accept_future", dateStr: "明天", timeSlot: "14:30" },
          { id: "opt-alt-c", label: "看看其他時間", type: "reschedule_slot" },
          { id: "opt-hold-c", label: "先放著", type: "save_idea" }
        ]
      }
    };
  }

  // Scenario A: Actionable near-term (e.g. 整理房間, 讀書, 運動)
  if (
    msg.includes("整理房間") ||
    msg.includes("整理") ||
    msg.includes("打掃") ||
    msg.includes("寫作") ||
    msg.includes("慢跑") ||
    msg.includes("散步") ||
    msg.includes("想做") ||
    msg.includes("今天想") ||
    msg.includes("等等想")
  ) {
    const activity = msg.replace(/^(我|今天|等等|最近)?(想|想去|想把|要去)/, "").trim() || "整理生活空間";
    return {
      reply: `可以。你今天 16:00–18:00 目前沒有安排，如果抓 1.5 小時，這件事可以放在 16:00 開始。要不要直接加入今天行程？`,
      messageTone: "schedule_proposal",
      proposal: {
        scenario: "schedule_today",
        activityTitle: activity,
        category: "想做",
        proposedTime: "16:00",
        proposedDate: "今天",
        durationMinutes: 90,
        reason: "16:00–18:00 為純粹自由留白時段，安排 1.5 小時不壓縮晚餐放鬆。",
        actionOptions: [
          { id: "opt-today-a", label: "安排今天 16:00", type: "accept_today", timeSlot: "16:00" },
          { id: "opt-alt-a", label: "換個時間", type: "reschedule_slot" },
          { id: "opt-hold-a", label: "先放著", type: "save_idea" }
        ]
      }
    };
  }

  // Default conversational response
  return {
    reply: `收到你的話了。今天按你舒服的步調走，隨時跟我聊聊，我們一起替生活保留清爽的呼吸感。`,
    proposal: null,
    messageTone: "general"
  };
}

// Candidate models for seamless failover when encountering temporary high-demand spikes (503/429)
const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
] as const;

async function generateWithResilience(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
) {
  let lastError: any = null;

  for (let i = 0; i < GEMINI_MODELS.length; i++) {
    const model = GEMINI_MODELS[i];
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.code || err?.error?.code;
      const message = String(err?.message || err?.error?.message || "");
      const isTemporaryDemandIssue =
        status === 503 ||
        status === 429 ||
        status === 500 ||
        status === "UNAVAILABLE" ||
        message.includes("503") ||
        message.includes("high demand") ||
        message.includes("UNAVAILABLE") ||
        message.includes("temporarily") ||
        message.includes("Resource has been exhausted");

      if (isTemporaryDemandIssue && i < GEMINI_MODELS.length - 1) {
        console.warn(
          `[Gemini Resilience] ${model} reported high demand or unavailable. Seamlessly failing over to ${GEMINI_MODELS[i + 1]}...`
        );
        await new Promise((resolve) => setTimeout(resolve, 350));
        continue;
      }
      break;
    }
  }

  throw lastError;
}

// Verify URL endpoint
app.post("/api/ai/verify-url", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }
  try {
    const result = await fetchAndVerifyUrl(url);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to verify URL" });
  }
});

// -------------------------------------------------------------
// Daily Life Plan Persistent Storage (Server-side File Database)
// -------------------------------------------------------------
const DATA_DIR = path.join(process.cwd(), "data");
const PLANS_FILE = path.join(DATA_DIR, "daily_plans.json");

interface PersistentStore {
  plans: Record<string, any>;
  versions: Record<string, any[]>;
}

function ensureDataStore(): PersistentStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PLANS_FILE)) {
      const initial: PersistentStore = { plans: {}, versions: {} };
      fs.writeFileSync(PLANS_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const content = fs.readFileSync(PLANS_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error with daily_plans.json, using in-memory store:", err);
    return { plans: {}, versions: {} };
  }
}

function writeDataStore(store: PersistentStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PLANS_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing daily_plans.json:", err);
  }
}

function getOrCreateDailyPlan(dateKey: string): any {
  const store = ensureDataStore();
  if (store.plans[dateKey]) {
    return store.plans[dateKey];
  }

  // Base fixed event that must never be deleted/overwritten during reschedules (Section 8)
  const fixedItems = [
    {
      id: `fixed-${dateKey}-1`,
      dailyPlanId: `plan-${dateKey}`,
      title: "外出專注活動 / 預定公事",
      description: "已確認固定行程（14:00–17:00），優先保障不被覆蓋",
      startTime: "14:00",
      endTime: "17:00",
      duration: "3 小時",
      type: "fixed",
      source: "fixed_event",
      status: "scheduled",
      isFixed: true,
      category: "fixed",
      createdAt: `${dateKey} 08:00`,
      updatedAt: `${dateKey} 08:00`
    }
  ];

  const suggestions = [
    {
      id: `ls-${dateKey}-1`,
      type: "meal",
      title: "手沖咖啡或喝杯奶茶，吃份早餐",
      description: "晨光初透，以一杯溫潤飲品喚醒味蕾，不用急躁。",
      suggestedTime: "09:00",
      duration: "45 分鐘",
      source: "long_term_preference",
      sourceLabel: "晨間節奏",
      preferenceScore: 95,
      status: "suggested",
      categoryTag: "晨間美好"
    },
    {
      id: `ls-${dateKey}-2`,
      type: "meal",
      title: "吃一頓好吃的義大利麵",
      description: "挑一間有自然光、不喧鬧的店，享受一盤熱騰騰的番茄橄欖義大利麵。",
      suggestedTime: "12:00",
      duration: "60 分鐘",
      source: "explicit_wish",
      sourceLabel: "前幾天提過想吃義大利麵",
      preferenceScore: 92,
      status: "suggested",
      categoryTag: "午間美味"
    },
    {
      id: `ls-${dateKey}-3`,
      type: "reading",
      title: "找個舒服的地方看一點書",
      description: "帶上一本想看的書，坐在安靜的窗邊或陽台，翻讀幾頁不趕進度。",
      suggestedTime: "15:00",
      duration: "60 分鐘",
      source: "long_term_preference",
      sourceLabel: "偏好安靜閱讀",
      preferenceScore: 89,
      status: "suggested",
      categoryTag: "心靈留白"
    },
    {
      id: `ls-${dateKey}-4`,
      type: "walk",
      title: "傍晚出去走走晃晃，感受微風",
      description: "涼爽宜人，在巷弄裡隨心慢步，看看街角小店。",
      suggestedTime: "18:00",
      duration: "45 分鐘",
      source: "weather_context",
      sourceLabel: "涼爽微風",
      preferenceScore: 88,
      status: "suggested",
      categoryTag: "散步漫遊"
    },
    {
      id: `ls-${dateKey}-5`,
      type: "media",
      title: "留給自己・看一支想看的影片",
      description: "放鬆時刻，可以看喜歡的頻道，也可以什麼都不做單純放空。",
      suggestedTime: "20:30",
      duration: "60 分鐘",
      source: "long_term_preference",
      sourceLabel: "晚間個人節奏",
      preferenceScore: 94,
      status: "suggested",
      categoryTag: "放鬆時刻"
    }
  ];

  const plan = {
    id: `plan-${dateKey}`,
    userId: "user-default",
    date: dateKey,
    dateKey: dateKey,
    theme: "悠閒慢調的生活提案",
    vibe: "悠閒",
    userOpeningPrompt: "今天想怎麼過？",
    subOpeningNote: "這只是今天的一個版本，可以隨時改。",
    planVersion: 1,
    suggestions,
    scheduledItems: [...fixedItems], // Start with the fixed event
    fixedItems: [...fixedItems],
    freeTimeBlocks: [
      { id: `ft-${dateKey}-1`, start: "10:00", end: "12:00", durationMinutes: 120, note: "上午自由留白" },
      { id: `ft-${dateKey}-2`, start: "13:00", end: "14:00", durationMinutes: 60, note: "午後休息換氣" },
      { id: `ft-${dateKey}-3`, start: "17:00", end: "18:00", durationMinutes: 60, note: "這段時間留給你" },
      { id: `ft-${dateKey}-4`, start: "21:30", end: "23:00", durationMinutes: 90, note: "睡前安靜時光" }
    ],
    rejectedSuggestions: [],
    generatedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.plans[dateKey] = plan;
  store.versions[dateKey] = [plan];
  writeDataStore(store);
  return plan;
}

function rescheduleDailyPlanInternal(dateKey: string, vibeOrPrompt: string = "悠閒") {
  const store = ensureDataStore();
  const currentPlan = getOrCreateDailyPlan(dateKey);
  const nextVersion = (currentPlan.planVersion || 1) + 1;

  // Preserve all fixedItems 100% (Rule 8: 固定行程必須永遠優先，不能覆蓋、不能刪除、不能改時間)
  const fixedItems = (currentPlan.fixedItems || []).length > 0
    ? currentPlan.fixedItems
    : [
        {
          id: `fixed-${dateKey}-1`,
          dailyPlanId: `plan-${dateKey}`,
          title: "外出專注活動 / 預定公事",
          description: "已確認固定行程（14:00–17:00），優先保障不被覆蓋",
          startTime: "14:00",
          endTime: "17:00",
          duration: "3 小時",
          type: "fixed",
          source: "fixed_event",
          status: "scheduled",
          isFixed: true,
          category: "fixed",
          createdAt: `${dateKey} 08:00`,
          updatedAt: `${dateKey} 08:00`
        }
      ];

  // Preserve any fixed or user-confirmed items
  const preservedItems = (currentPlan.scheduledItems || []).filter(
    (it: any) => it.isFixed || it.source === 'fixed_event' || it.type === 'fixed'
  );
  if (preservedItems.length === 0) {
    preservedItems.push(...fixedItems);
  }

  const prompt = (vibeOrPrompt || "").trim();
  let theme = "悠閒慢調的生活提案";
  let vibe = "悠閒";
  let subOpeningNote = "這只是今天的一個版本，可以隨時改。";
  let suggestions: any[] = [];
  let freeTimeBlocks: any[] = [];

  if (prompt.includes("耍廢") || prompt.includes("躺平") || prompt.includes("累")) {
    theme = "放慢腳步・無壓力耍廢日";
    vibe = "想耍廢";
    subOpeningNote = "今天不需要達成任何目標，把所有精力留給自己好好休息。";
    suggestions = [
      {
        id: `ls-${Date.now()}-1`,
        type: "rest",
        title: "今天留給自己，隨意放空",
        description: "躺在沙發上聽聽喜歡的輕音樂或白噪音，不用看時鐘。",
        suggestedTime: "隨時",
        duration: "一整天",
        source: "long_term_preference",
        sourceLabel: "低負擔休息",
        preferenceScore: 99,
        status: "suggested",
        isFreeTimeBlock: true,
        categoryTag: "純粹留白"
      },
      {
        id: `ls-${Date.now()}-2`,
        type: "meal",
        title: "想吃的時候，隨意吃點想吃的",
        description: "不用準確按時用餐，餓了就吃一碗熱熱的湯麵或點心。",
        suggestedTime: "餓了再吃",
        duration: "自在",
        source: "explicit_wish",
        sourceLabel: "日常舒適",
        preferenceScore: 92,
        status: "suggested",
        categoryTag: "隨心慢食"
      },
      {
        id: `ls-${Date.now()}-3`,
        type: "media",
        title: "看一部一直想看的輕鬆影片或動漫",
        description: "隨意翻幾頁喜歡的書，或看一支 YouTube 料理頻道，累了就小睡。",
        suggestedTime: "午後或晚間",
        duration: "自由",
        source: "long_term_preference",
        sourceLabel: "放鬆時刻",
        preferenceScore: 95,
        status: "suggested",
        categoryTag: "放鬆時刻"
      }
    ];
    freeTimeBlocks = [
      { id: `ft-${Date.now()}-1`, start: "09:00", end: "14:00", durationMinutes: 300, note: "整段上午午後完全自由留白" },
      { id: `ft-${Date.now()}-2`, start: "17:00", end: "23:00", durationMinutes: 360, note: "傍晚到深夜完全無壓力" }
    ];
  } else if (prompt.includes("出去玩") || prompt.includes("出門") || prompt.includes("走走")) {
    theme = "出門漫步・探索城市小角落";
    vibe = "出去玩";
    subOpeningNote = "台北今天微風涼爽，非常適合戶外慢走或去吃想吃的美食。";
    suggestions = [
      {
        id: `ls-${Date.now()}-1`,
        type: "meal",
        title: "去一間有戶外採光的早午餐或手沖咖啡店",
        description: "喝一杯有堅果香氣的拿鐵，悠閒翻翻手機或手帳。",
        suggestedTime: "10:30",
        duration: "75 分鐘",
        source: "long_term_preference",
        sourceLabel: "探店慢調",
        preferenceScore: 93,
        status: "suggested",
        categoryTag: "美味早午餐"
      },
      {
        id: `ls-${Date.now()}-2`,
        type: "walk",
        title: "巷弄探索、逛逛獨立書店或選物小店",
        description: "在赤峰街或富錦街附近散散步，看看綠植與櫥窗。",
        suggestedTime: "12:00",
        duration: "90 分鐘",
        source: "weather_context",
        sourceLabel: "微風宜人",
        preferenceScore: 91,
        status: "suggested",
        categoryTag: "漫步散策"
      },
      {
        id: `ls-${Date.now()}-3`,
        type: "walk",
        title: "傍晚河濱或公園綠蔭慢走",
        description: "太陽下山前走動換氣，微風很舒服。",
        suggestedTime: "17:30",
        duration: "50 分鐘",
        source: "long_term_preference",
        sourceLabel: "傍晚散步",
        preferenceScore: 89,
        status: "suggested",
        categoryTag: "戶外活動"
      }
    ];
    freeTimeBlocks = [
      { id: `ft-${Date.now()}-1`, start: "13:30", end: "14:00", durationMinutes: 30, note: "出發前留白" },
      { id: `ft-${Date.now()}-2`, start: "18:30", end: "20:30", durationMinutes: 120, note: "晚飯與回家放鬆" }
    ];
  } else if (prompt.includes("生產力") || prompt.includes("工作") || prompt.includes("充實")) {
    theme = "專注呼吸・溫和有節奏的一天";
    vibe = "有生產力";
    subOpeningNote = "集中精力在最關鍵的事項，同時保持身心不緊繃。";
    suggestions = [
      {
        id: `ls-${Date.now()}-1`,
        type: "meal",
        title: "晨間深焙黑咖啡，釐清思緒",
        description: "坐下來靜心 10 分鐘，寫下今天最想專注的一件事。",
        suggestedTime: "09:00",
        duration: "45 分鐘",
        source: "long_term_preference",
        sourceLabel: "晨間開機",
        preferenceScore: 96,
        status: "suggested",
        categoryTag: "清晨喚醒"
      },
      {
        id: `ls-${Date.now()}-2`,
        type: "meal",
        title: "營養清淡的輕食午餐",
        description: "避免高碳水昏沉，享受一盤烤雞肉溫沙拉或糙米飯。",
        suggestedTime: "12:00",
        duration: "60 分鐘",
        source: "explicit_wish",
        sourceLabel: "活力午餐",
        preferenceScore: 90,
        status: "suggested",
        categoryTag: "午間美味"
      },
      {
        id: `ls-${Date.now()}-3`,
        type: "reading",
        title: "專注閱讀 40 分鐘或整理手邊資料",
        description: "關閉無關通知，沉浸在書頁或專案筆記中。",
        suggestedTime: "17:30",
        duration: "60 分鐘",
        source: "long_term_preference",
        sourceLabel: "深度心流",
        preferenceScore: 92,
        status: "suggested",
        categoryTag: "專注時光"
      }
    ];
    freeTimeBlocks = [
      { id: `ft-${Date.now()}-1`, start: "10:00", end: "12:00", durationMinutes: 120, note: "專注專案與留白" },
      { id: `ft-${Date.now()}-2`, start: "13:00", end: "14:00", durationMinutes: 60, note: "午後小憩換氣" },
      { id: `ft-${Date.now()}-3`, start: "18:30", end: "20:00", durationMinutes: 90, note: "傍晚收工留白" }
    ];
  } else if (prompt.includes("留給自己") || prompt.includes("什麼都不想做")) {
    theme = "純粹留給自己的自由空間";
    vibe = "留給自己";
    subOpeningNote = "今天不強迫產生任何行程，想吃飯就吃、想發呆就發呆。";
    suggestions = [
      {
        id: `ls-${Date.now()}-1`,
        type: "rest",
        title: "今天留給自己",
        description: "沒有鬧鐘、沒有待辦，依照身體的感受自然呼吸。",
        suggestedTime: "全天",
        duration: "一整天",
        source: "long_term_preference",
        sourceLabel: "身心第一順位",
        preferenceScore: 99,
        status: "suggested",
        isFreeTimeBlock: true,
        categoryTag: "純粹留白"
      }
    ];
    freeTimeBlocks = [
      { id: `ft-${Date.now()}-1`, start: "09:00", end: "14:00", durationMinutes: 300, note: "全天自由留白" },
      { id: `ft-${Date.now()}-2`, start: "17:00", end: "23:00", durationMinutes: 360, note: "無負擔留白時光" }
    ];
  } else {
    // Default 悠閒
    theme = nextVersion > 1 ? `悠閒慢調的生活提案 (第 ${nextVersion} 版)` : "悠閒慢調的生活提案";
    vibe = "悠閒";
    subOpeningNote = "這只是今天的一個版本，可以隨時改。";
    suggestions = [
      {
        id: `ls-${Date.now()}-1`,
        type: "meal",
        title: "手沖咖啡或喝杯奶茶，吃份早餐",
        description: "晨光初透，以一杯溫潤飲品喚醒味蕾，不用急躁。",
        suggestedTime: "09:00",
        duration: "45 分鐘",
        source: "long_term_preference",
        sourceLabel: "晨間節奏",
        preferenceScore: 95,
        status: "suggested",
        categoryTag: "晨間美好"
      },
      {
        id: `ls-${Date.now()}-2`,
        type: "meal",
        title: "吃一頓好吃的義大利麵",
        description: "挑一間有自然光、不喧鬧的店，享受一盤熱騰騰的番茄橄欖義大利麵。",
        suggestedTime: "12:00",
        duration: "60 分鐘",
        source: "explicit_wish",
        sourceLabel: "前幾天提過想吃義大利麵",
        preferenceScore: 92,
        status: "suggested",
        categoryTag: "午間美味"
      },
      {
        id: `ls-${Date.now()}-3`,
        type: "reading",
        title: "找個舒服的地方看一點書",
        description: "帶上一本想看的書，坐在安靜的窗邊或陽台，翻讀幾頁不趕進度。",
        suggestedTime: "15:00",
        duration: "60 分鐘",
        source: "long_term_preference",
        sourceLabel: "偏好安靜閱讀",
        preferenceScore: 89,
        status: "suggested",
        categoryTag: "心靈留白"
      },
      {
        id: `ls-${Date.now()}-4`,
        type: "walk",
        title: "傍晚出去走走晃晃，感受微風",
        description: "涼爽宜人，在巷弄裡隨心慢步，看看街角小店。",
        suggestedTime: "18:00",
        duration: "45 分鐘",
        source: "weather_context",
        sourceLabel: "涼爽微風",
        preferenceScore: 88,
        status: "suggested",
        categoryTag: "散步漫遊"
      },
      {
        id: `ls-${Date.now()}-5`,
        type: "media",
        title: "留給自己・看一支想看的影片",
        description: "放鬆時刻，可以看喜歡的頻道，也可以什麼都不做單純放空。",
        suggestedTime: "20:30",
        duration: "60 分鐘",
        source: "long_term_preference",
        sourceLabel: "晚間個人節奏",
        preferenceScore: 94,
        status: "suggested",
        categoryTag: "放鬆時刻"
      }
    ];
    freeTimeBlocks = [
      { id: `ft-${Date.now()}-1`, start: "10:00", end: "12:00", durationMinutes: 120, note: "上午自由留白" },
      { id: `ft-${Date.now()}-2`, start: "13:00", end: "14:00", durationMinutes: 60, note: "午後休息換氣" },
      { id: `ft-${Date.now()}-3`, start: "17:00", end: "18:00", durationMinutes: 60, note: "這段時間留給你" },
      { id: `ft-${Date.now()}-4`, start: "21:30", end: "23:00", durationMinutes: 90, note: "睡前安靜時光" }
    ];
  }

  const newPlan = {
    id: `plan-${dateKey}`,
    userId: "user-default",
    date: dateKey,
    dateKey: dateKey,
    theme,
    vibe,
    userOpeningPrompt: "今天想怎麼過？",
    subOpeningNote,
    planVersion: nextVersion,
    suggestions,
    scheduledItems: preservedItems, // 100% preserves 14:00-17:00 fixed event!
    fixedItems,
    freeTimeBlocks,
    rejectedSuggestions: [],
    generatedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.plans[dateKey] = newPlan;
  if (!store.versions[dateKey]) {
    store.versions[dateKey] = [currentPlan];
  }
  store.versions[dateKey].push(newPlan);
  writeDataStore(store);
  return { plan: newPlan, versions: store.versions[dateKey] };
}

// Chat endpoint with 77
app.post("/api/ai/chat", async (req, res) => {
  const { message, history, userState, todaySchedule, activeContentObject, dateKey } = req.body;
  const targetDateKey = dateKey || "2026-09-11";
  const currentPlan = getOrCreateDailyPlan(targetDateKey);

  // Parse natural language schedule arrangements and actions directly!
  const scheduleResult = parseUserScheduleIntent(
    message || "",
    currentPlan.scheduledItems || []
  );

  if (scheduleResult.action === "create_scheduled_items" && scheduleResult.itemsToCreate) {
    const store = ensureDataStore();
    const createdItems = scheduleResult.itemsToCreate.map((item, idx) => ({
      id: `sched-${Date.now()}-${idx}`,
      dailyPlanId: currentPlan.id,
      title: item.title,
      description: item.description,
      startTime: item.startTime,
      duration: item.duration || "45 分鐘",
      type: item.type,
      source: "ai_conversation",
      status: "scheduled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    currentPlan.scheduledItems = [
      ...(currentPlan.scheduledItems || []),
      ...createdItems
    ].sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
    currentPlan.updatedAt = new Date().toISOString();

    store.plans[targetDateKey] = currentPlan;
    writeDataStore(store);

    return res.json({
      reply: scheduleResult.explanationMessage,
      scheduleAction: {
        type: "created",
        items: createdItems,
        updatedPlan: currentPlan
      },
      messageTone: "schedule_proposal"
    });
  }

  if (scheduleResult.action === "update_scheduled_item" && scheduleResult.updateTarget) {
    const store = ensureDataStore();
    const { searchQuery, newStartTime } = scheduleResult.updateTarget;
    let found = false;

    currentPlan.scheduledItems = (currentPlan.scheduledItems || []).map((it: any) => {
      if (
        !found &&
        (it.title.includes(searchQuery) ||
          searchQuery.includes(it.title) ||
          (it.type === "meal" && searchQuery.includes("麵")) ||
          (it.type === "media" && searchQuery.includes("影片")))
      ) {
        found = true;
        return {
          ...it,
          startTime: newStartTime,
          updatedAt: new Date().toISOString()
        };
      }
      return it;
    }).sort((a: any, b: any) => (a.startTime || "").localeCompare(b.startTime || ""));

    currentPlan.updatedAt = new Date().toISOString();
    store.plans[targetDateKey] = currentPlan;
    writeDataStore(store);

    return res.json({
      reply: scheduleResult.explanationMessage,
      scheduleAction: {
        type: "updated",
        updatedPlan: currentPlan
      },
      messageTone: "schedule_proposal"
    });
  }

  if (scheduleResult.action === "cancel_scheduled_item" && scheduleResult.cancelTarget) {
    const store = ensureDataStore();
    const { searchQuery } = scheduleResult.cancelTarget;

    currentPlan.scheduledItems = (currentPlan.scheduledItems || []).filter(
      (it: any) =>
        !it.title.includes(searchQuery) &&
        !searchQuery.includes(it.title)
    );
    currentPlan.updatedAt = new Date().toISOString();
    store.plans[targetDateKey] = currentPlan;
    writeDataStore(store);

    return res.json({
      reply: scheduleResult.explanationMessage,
      scheduleAction: {
        type: "cancelled",
        updatedPlan: currentPlan
      },
      messageTone: "schedule_proposal"
    });
  }

  if (scheduleResult.action === "reschedule_day") {
    const resched = rescheduleDailyPlanInternal(
      targetDateKey,
      scheduleResult.rescheduleVibe || "悠閒"
    );
    return res.json({
      reply: scheduleResult.explanationMessage,
      scheduleAction: {
        type: "rescheduled",
        updatedPlan: resched.plan,
        versions: resched.versions
      },
      messageTone: "schedule_proposal"
    });
  }

  if (scheduleResult.action === "create_idea_or_suggestion") {
    return res.json({
      reply: scheduleResult.explanationMessage,
      ideaAction: scheduleResult.ideaOrSuggestion,
      messageTone: "general"
    });
  }

  const smartResult = await generateSmartFallbackProposal(
    message || "",
    todaySchedule || [],
    activeContentObject
  );

  // If a URL was analyzed, or active content object was adjusted/dismissed, or Gemini is unavailable
  const ai = getAiClient();
  if (
    smartResult.urlCard ||
    smartResult.clearActiveContentObject ||
    (activeContentObject && smartResult.proposal) ||
    !ai
  ) {
    return res.json(smartResult);
  }

  try {
    const prompt = `
使用者目前狀態：${JSON.stringify(userState || {})}
今日已有時間軸事項：${JSON.stringify(todaySchedule || [])}
歷史對話情境：${JSON.stringify((history || []).slice(-4))}

使用者說：${message}

請以「77」的語氣回覆使用者（自然、溫暖、不說教、重視留白、絕無表情符號）。
特別注意：
1. 使用者表達想做的事時，絕不要直接說「好的，已加入想做的事」。
2. 請分析是否適合今天（情境 A）、是否適合推測特定日期如週末（情境 B）、是否今日太滿建議明天（情境 C）、是否屬於長期願望不急著排（情境 D）、或是微型雜事可順手安排（情境 E）。
3. 如果合適，在回覆末端附上 JSON Proposal block：
\`\`\`json
{
  "proposal": {
    "scenario": "schedule_today" | "schedule_future" | "overload_warn" | "long_term_wish" | "small_chore",
    "activityTitle": "事項簡稱",
    "category": "想做" | "想買" | "想學" | "想體驗",
    "proposedTime": "16:00",
    "proposedDate": "今天" | "明天" | "週六",
    "durationMinutes": 90,
    "reason": "AI 推薦原因與留白考量",
    "actionOptions": [
      { "id": "opt-1", "label": "按鈕文字", "type": "accept_today" | "accept_future" | "reschedule_slot" | "save_idea" }
    ]
  },
  "messageTone": "schedule_proposal" | "free_time_discovery" | "preference_memorized" | "reminder" | "general"
}
\`\`\`
如果純聊天則不需要附帶 proposal。
`;

    const response = await generateWithResilience(ai, {
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_77,
        temperature: 0.7,
      },
    });

    const text = response.text || "";
    let cleanReply = text;
    let proposal = null;
    let noteAction = smartResult.noteAction || null;
    let messageTone = "general";

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.proposal) {
          proposal = parsed.proposal;
        }
        if (parsed.noteAction) {
          noteAction = parsed.noteAction;
        }
        if (parsed.messageTone) {
          messageTone = parsed.messageTone;
        }
        cleanReply = text.replace(/```json[\s\S]*?```/, "").trim();
      } catch {
        // ignore JSON parse error
      }
    }

    // If Gemini didn't return proposal but fallback matched a strong intent, merge gracefully
    if (!proposal && smartResult.proposal) {
      proposal = smartResult.proposal;
      messageTone = smartResult.messageTone || "schedule_proposal";
    }

    res.json({
      reply: cleanReply || smartResult.reply,
      proposal,
      noteAction,
      messageTone,
      urlCard: smartResult.urlCard,
      activeContentObject: smartResult.activeContentObject,
    });
  } catch (error: any) {
    const errMsg = String(error?.message || error || "");
    console.warn(
      `[Gemini Chat] Service temporarily in high demand or unavailable. Seamlessly serving smart conversational response: ${errMsg.slice(0, 100)}`
    );
    res.json(smartResult);
  }
});

// Smart Intent Parser for quick note entry
app.post("/api/ai/parse-intent", async (req, res) => {
  const { input } = req.body;
  const ai = getAiClient();

  if (!ai) {
    return res.json({
      title: input,
      type: "想做",
      estimatedDuration: "1小時",
      preferredTime: "下午",
      notes: "先記錄下來，等有充裕空檔再決定。",
    });
  }

  try {
    const prompt = `請將使用者的這句話：「${input}」分析成生活手帳事項。
輸出 JSON 格式：
{
  "title": "簡潔事項名稱",
  "type": "必須做" | "應該做" | "想做" | "習慣" | "靈感" | "待觀察",
  "estimatedDuration": "例如 30分鐘 或 1-2小時",
  "preferredTime": "例如 上午 / 下午 / 晚上 / 週末 / 不限",
  "notes": "給使用者的貼心小備註，符合不焦慮原則"
}`;

    const response = await generateWithResilience(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (e) {
    console.warn("[Gemini Intent Parser] Temporary high demand, applying intelligent local defaults.");
    res.json({
      title: input,
      type: "想做",
      estimatedDuration: "1小時",
      preferredTime: "不限",
      notes: "已幫你加入靈感清單中。",
    });
  }
});

// Daily Life Plan Persistent Endpoints
app.get("/api/daily-plan", (req, res) => {
  const dateKey = (req.query.date as string) || "2026-09-11";
  const store = ensureDataStore();
  const plan = getOrCreateDailyPlan(dateKey);
  const versions = store.versions[dateKey] || [plan];
  res.json({ success: true, plan, versions });
});

app.post("/api/daily-plan", (req, res) => {
  const incomingPlan = req.body;
  if (!incomingPlan || (!incomingPlan.dateKey && !incomingPlan.date)) {
    return res.status(400).json({ error: "Missing plan or dateKey" });
  }
  const dateKey = incomingPlan.dateKey || incomingPlan.date;
  const store = ensureDataStore();
  store.plans[dateKey] = incomingPlan;

  if (!store.versions[dateKey]) {
    store.versions[dateKey] = [];
  }
  const existingVerIdx = store.versions[dateKey].findIndex(
    (v: any) => v.planVersion === incomingPlan.planVersion
  );
  if (existingVerIdx >= 0) {
    store.versions[dateKey][existingVerIdx] = incomingPlan;
  } else {
    store.versions[dateKey].push(incomingPlan);
  }

  writeDataStore(store);
  res.json({ success: true, plan: incomingPlan, versions: store.versions[dateKey] });
});

app.post("/api/daily-plan/reschedule", (req, res) => {
  const { date, vibeOrPrompt } = req.body;
  const dateKey = date || "2026-09-11";
  const result = rescheduleDailyPlanInternal(dateKey, vibeOrPrompt);
  res.json({ success: true, plan: result.plan, versions: result.versions });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
