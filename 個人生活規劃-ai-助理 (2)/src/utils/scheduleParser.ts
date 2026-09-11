import { ScheduledItem, LifeSuggestion } from '../types';

export interface ParsedScheduleResult {
  action:
    | 'create_scheduled_items'
    | 'update_scheduled_item'
    | 'cancel_scheduled_item'
    | 'reschedule_day'
    | 'create_idea_or_suggestion'
    | 'none';
  itemsToCreate?: Array<{
    title: string;
    startTime: string;
    duration?: string;
    type: string;
    description?: string;
    source: 'ai_conversation';
  }>;
  updateTarget?: {
    searchQuery: string;
    newStartTime?: string;
    newTitle?: string;
  };
  cancelTarget?: {
    searchQuery: string;
  };
  rescheduleVibe?: string;
  reschedulePrompt?: string;
  ideaOrSuggestion?: {
    title: string;
    description: string;
    categoryTag?: string;
  };
  explanationMessage?: string;
}

/**
 * Standardize natural language time expressions in Chinese to HH:mm format
 */
export function normalizeTimeTo24h(text: string): string | null {
  const trimmed = text.trim();

  // Match 18:30, 09:00, 9:30
  const colonMatch = trimmed.match(/(\d{1,2})[:：](\d{2})/);
  if (colonMatch) {
    const h = parseInt(colonMatch[1], 10);
    const m = colonMatch[2];
    return `${h.toString().padStart(2, '0')}:${m}`;
  }

  // Match Chinese time patterns like 晚上8點, 下午3點, 早上9點, 12點, 13點
  const periodMatch = trimmed.match(
    /(清晨|早上|上午|早晨|中午|下午|傍晚|晚上|深夜)?\s*(\d{1,2})\s*(點|点)(半|(\d{1,2})分)?/
  );
  if (periodMatch) {
    const period = periodMatch[1] || '';
    let hour = parseInt(periodMatch[2], 10);
    const half = periodMatch[4] === '半';
    const mins = periodMatch[5] ? parseInt(periodMatch[5], 10) : half ? 30 : 0;

    if (
      (period === '下午' || period === '傍晚' || period === '晚上') &&
      hour < 12
    ) {
      hour += 12;
    }
    if (period === '深夜' && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  // Pure periods without specific hour
  if (trimmed.includes('下午')) return '15:00';
  if (trimmed.includes('晚上')) return '20:00';
  if (trimmed.includes('中午')) return '12:00';
  if (trimmed.includes('早上') || trimmed.includes('上午')) return '09:00';
  if (trimmed.includes('傍晚')) return '18:00';

  return null;
}

function detectActivityType(text: string): string {
  if (
    text.includes('吃') ||
    text.includes('餐') ||
    text.includes('奶茶') ||
    text.includes('麵') ||
    text.includes('飯') ||
    text.includes('咖啡') ||
    text.includes('茶') ||
    text.includes('義大利麵')
  ) {
    return 'meal';
  }
  if (text.includes('書') || text.includes('閱讀') || text.includes('看雜誌')) {
    return 'reading';
  }
  if (
    text.includes('影片') ||
    text.includes('片') ||
    text.includes('youtube') ||
    text.includes('電影') ||
    text.includes('劇')
  ) {
    return 'media';
  }
  if (
    text.includes('散步') ||
    text.includes('走走') ||
    text.includes('晃晃') ||
    text.includes('跑步') ||
    text.includes('騎車')
  ) {
    return 'walk';
  }
  if (
    text.includes('工作') ||
    text.includes('公事') ||
    text.includes('開會') ||
    text.includes('整理')
  ) {
    return 'work';
  }
  if (
    text.includes('發呆') ||
    text.includes('休息') ||
    text.includes('睡') ||
    text.includes('留白')
  ) {
    return 'rest';
  }
  return 'life';
}

/**
 * Parses user input for schedule creation, modification, cancellation, or rescheduling.
 */
export function parseUserScheduleIntent(
  rawText: string,
  existingItems: ScheduledItem[] = []
): ParsedScheduleResult {
  const text = rawText.trim();

  // 1. Reschedule / Vibe changes
  if (
    text === '換一版' ||
    text.includes('換一版提案') ||
    text.includes('重新安排今天') ||
    text.includes('重新生成整天')
  ) {
    return {
      action: 'reschedule_day',
      rescheduleVibe: '悠閒',
      reschedulePrompt: text,
      explanationMessage: '已為你重新整理並生成今天的新生活版本（已保留所有既定固定行程）。'
    };
  }

  if (
    text.includes('想耍廢') ||
    text.includes('躺平') ||
    text.includes('今天很累') ||
    text.includes('不想動')
  ) {
    return {
      action: 'reschedule_day',
      rescheduleVibe: '想耍廢',
      reschedulePrompt: text,
      explanationMessage: '今天就放慢節奏耍廢吧！已為你調整為低負擔模式，保留充裕自由時間。'
    };
  }

  if (text.includes('出去玩') || text.includes('出門') || text.includes('想走走')) {
    return {
      action: 'reschedule_day',
      rescheduleVibe: '出去玩',
      reschedulePrompt: text,
      explanationMessage: '出門走走散散心！已為你規劃適合戶外慢步與生活探索的全新提案。'
    };
  }

  if (
    text.includes('有生產力') ||
    text.includes('想專注') ||
    text.includes('好好工作') ||
    text.includes('充實')
  ) {
    return {
      action: 'reschedule_day',
      rescheduleVibe: '有生產力',
      reschedulePrompt: text,
      explanationMessage: '溫和有節奏的生產力模式：聚焦在關鍵事項，同時保持呼吸與留白。'
    };
  }

  if (
    text.includes('不想安排那麼多') ||
    text.includes('不要安排那麼多') ||
    text.includes('不想安排太多') ||
    text.includes('行程太滿')
  ) {
    return {
      action: 'reschedule_day',
      rescheduleVibe: '不想安排太多',
      reschedulePrompt: text,
      explanationMessage: '已為你抽離多餘負擔，僅保留最重要的固定行程與少量舒服建議。'
    };
  }

  if (
    text.includes('什麼都不想做') ||
    text.includes('留給自己') ||
    text.includes('完全不安排')
  ) {
    return {
      action: 'reschedule_day',
      rescheduleVibe: '留給自己',
      reschedulePrompt: text,
      explanationMessage: '今天留給自己。不強迫設定行程，順應身體感受自由度過。'
    };
  }

  // 2. Schedule Modification: e.g. "把義大利麵改成13點", "12點的義大利麵改成13點", "把晚上影片移到21點", "晚餐改到18:30"
  const modifyRegex =
    /(?:把\s*)?(?:(\d{1,2}點|[早中下午晚]+)?\s*的\s*)?([^改移\s，,。]+?)\s*(?:改成|改到|移到|換到|調整到|改為)\s*([0-9]{1,2}[:：][0-9]{2}|[早中下午晚清晨傍晚\s]*\d{1,2}\s*[點点半分]+|[早中下午晚]+)/;
  const modMatch = text.match(modifyRegex);
  if (modMatch && !text.includes('取消') && !text.includes('刪除')) {
    const rawTarget = modMatch[2].replace(/把/g, '').trim();
    const rawNewTime = modMatch[3].trim();
    const normalizedTime = normalizeTimeTo24h(rawNewTime);

    if (normalizedTime && rawTarget) {
      return {
        action: 'update_scheduled_item',
        updateTarget: {
          searchQuery: rawTarget,
          newStartTime: normalizedTime
        },
        explanationMessage: `已將「${rawTarget}」的時間調整為 ${normalizedTime}。今日生活流已更新並儲存。`
      };
    }
  }

  // 3. Schedule Cancellation: e.g. "把下午看書取消", "取消晚上看影片", "不要義大利麵了"
  const cancelRegex =
    /(?:把\s*)?([^，,。]+?)\s*(?:取消|拿掉|刪除|不要了|先不要)/;
  const cancelMatch = text.match(cancelRegex);
  if (
    cancelMatch &&
    (text.includes('取消') ||
      text.includes('拿掉') ||
      text.includes('刪除') ||
      text.includes('不要了'))
  ) {
    const rawTarget = cancelMatch[1].replace(/把/g, '').trim();
    if (rawTarget.length > 0 && rawTarget.length < 20) {
      return {
        action: 'cancel_scheduled_item',
        cancelTarget: {
          searchQuery: rawTarget
        },
        explanationMessage: `已幫你取消「${rawTarget}」，為今天留出了更多自在的自由時間。`
      };
    }
  }

  // 4. Distinguish Vague Ideas: e.g. "最近好想吃義大利麵", "有空想學陶藝", "以後想去日本"
  if (
    (text.includes('最近') ||
      text.includes('以後') ||
      text.includes('改天') ||
      text.includes('有空')) &&
    !text.includes('今天') &&
    !text.includes('點') &&
    !text.includes(':')
  ) {
    const cleanIdea = text.replace(/最近|好想|想|以後|有空|突然想/g, '').trim();
    return {
      action: 'create_idea_or_suggestion',
      ideaOrSuggestion: {
        title: cleanIdea || text,
        description: '這是你最近記下的生活想法，尚未指定具體日程，隨時可在有空時排入。',
        categoryTag: '想做的事'
      },
      explanationMessage: `已將「${cleanIdea || text}」記在想法牆中，不佔用今日排程。等你想安排時隨時可以放進生活流中。`
    };
  }

  // 5. Explicit Today Scheduling:
  // e.g. "今天9點喝奶茶吃早餐，12點吃義大利麵，下午看書。"
  // e.g. "今天9點喝奶茶吃早餐"
  // e.g. "12點想吃義大利麵"
  // e.g. "下午想看書"
  // e.g. "晚上8點看某部影片"
  const isExplicitTodaySchedule =
    text.includes('今天') ||
    text.includes('點') ||
    text.includes(':') ||
    text.includes('：') ||
    text.includes('下午') ||
    text.includes('晚上') ||
    text.includes('中午') ||
    text.includes('早上');

  if (isExplicitTodaySchedule) {
    // Split sentences by comma, semicolon, newline, "，", "、", "還有"
    const clauses = text
      .split(/[,，;；\n、]|還有/)
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const itemsToCreate: Array<{
      title: string;
      startTime: string;
      duration?: string;
      type: string;
      description?: string;
      source: 'ai_conversation';
    }> = [];

    for (const clause of clauses) {
      // Find time in clause
      const parsedTime = normalizeTimeTo24h(clause);
      if (parsedTime) {
        // Remove time words from clause to get the clean title
        let cleanTitle = clause
          .replace(/今天/g, '')
          .replace(/幫我排進今天/g, '')
          .replace(/幫我排/g, '')
          .replace(/想/g, '')
          .replace(/(清晨|早上|上午|早晨|中午|下午|傍晚|晚上|深夜)/g, '')
          .replace(/(\d{1,2})[:：](\d{2})/g, '')
          .replace(/(\d{1,2})\s*(點|点)(半|(\d{1,2})分)?/g, '')
          .replace(/^[，,。、\s]+|[，,。、\s]+$/g, '');

        if (!cleanTitle) {
          cleanTitle = clause;
        }

        const type = detectActivityType(cleanTitle);
        const duration =
          type === 'meal'
            ? '60 分鐘'
            : type === 'reading'
            ? '60 分鐘'
            : type === 'walk'
            ? '45 分鐘'
            : type === 'media'
            ? '60 分鐘'
            : '45 分鐘';

        itemsToCreate.push({
          title: cleanTitle,
          startTime: parsedTime,
          duration,
          type,
          description: `自 AI 對話明確安排（${clause}）`,
          source: 'ai_conversation'
        });
      }
    }

    if (itemsToCreate.length > 0) {
      const titlesSummary = itemsToCreate
        .map((it) => `${it.startTime} ${it.title}`)
        .join('、');
      return {
        action: 'create_scheduled_items',
        itemsToCreate,
        explanationMessage: `已為你排入今日生活流：${titlesSummary}。前後保留了充裕的自由留白，不急不徐。`
      };
    }
  }

  return { action: 'none' };
}
