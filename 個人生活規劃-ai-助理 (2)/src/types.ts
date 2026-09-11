export type ItemCategoryType =
  | '必須做'   // 有期限、有責任
  | '應該做'   // 重要，但時間可以調整
  | '想做'     // 生活中自己真正想做的事情
  | '習慣'     // 日常規律微習慣
  | '靈感'     // 突然想到的點子，不用現在安排
  | '待觀察';  // 現在還不知道要不要做

export type IdeaCategory =
  | '想做'
  | '想買'
  | '想學'
  | '想去'
  | '想看'
  | '想體驗'
  | '突然想到';

export type GoalStatus =
  | '想到'
  | '想試試'
  | '準備中'
  | '進行中'
  | '暫停'
  | '重新考慮'
  | '方向改變'
  | '完成'
  | '放下';

export type DayTempo = '悠閒' | '普通' | '充實' | '還不知道';

export type RecommendationLevel = '很適合' | '可以考慮' | '先不用';

export type TimeOfDayPeriod =
  | 'early_morning' // 清晨 05:00 - 08:00
  | 'morning'       // 上午 08:00 - 11:30
  | 'noon'          // 中午 11:30 - 13:30
  | 'afternoon'     // 下午 13:30 - 17:30
  | 'dusk'          // 傍晚 17:30 - 19:30
  | 'evening'       // 晚上 19:30 - 23:00
  | 'midnight';     // 深夜 23:00 - 05:00

export type DisturbanceMode = 'free' | 'low' | 'important_only' | 'quiet';

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  timezone: string; // 'Asia/Taipei'
  city: string;     // '台北'
  lifeMotto: string;
  energyBaseline: string;
  preferredWakeTime: string;
  preferredRestTime: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  title: string;
  category: 'routine' | 'fixed' | 'task' | 'free' | 'rest' | 'meal' | 'entertainment' | 'temp';
  isFreeTime?: boolean;
  aiNote?: string;
  completed?: boolean;
  durationMinutes?: number;
  location?: string;
  sourceUrl?: string;
  sourceTitle?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  type: ItemCategoryType;
  status: 'todo' | 'completed' | 'delayed' | 'dropped';
  importance: number; // 1 - 3
  estimatedDuration: string;
  actualDuration?: string;
  deadline?: string;
  preferredTime?: string;
  energyRequired?: 'low' | 'medium' | 'high';
  source?: string;
  sourceUrl?: string;
  aiNotes?: string;
  delayCount?: number;
  subTasks?: { id: string; title: string; completed: boolean }[];
  completedAt?: string;
  userFeeling?: string;
}

export interface DailyReview {
  completedText: string;
  joyText: string;
  tiredText: string;
  tomorrowNotes: string;
  moodState: string; // '疲憊' | '平靜' | '舒適' | '愉悅' | '充實'
  isDone: boolean;
  timestamp?: string;
}

export interface PastAiSuggestion {
  id: string;
  title: string;
  reason: string;
  category?: string;
  proposedTime?: string;
  proposedDate?: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'dismissed';
  sourceInfo?: any;
}

export interface HistoricalDailyPlan {
  dateKey: string;
  dateStr: string;
  plan: DailyPlanState;
  archivedAt: string;
}

export interface DailyPlanState {
  dateKey?: string;   // e.g. "2026-09-10"
  dateStr: string;
  dateNumber: string; // e.g. "9.10"
  dayOfWeek: string;  // e.g. "Thursday"
  dailyQuote: string;
  subQuote: string;
  energy: number; // 1 to 5
  mood: number;   // 1 to 5
  tempo: DayTempo;
  timeline: TimeSlot[];
  topImportantTasks: TaskItem[];
  leisureTasks: TaskItem[];
  freeTimeHours: number;
  review?: DailyReview;
  isResetToday?: boolean;
  resetTimestamp?: string;
}

export interface WeeklyPlanState {
  weekNumber: number;
  weekRange: string;
  theme: string;
  topPriorities: string[];
  fixedEvents: { day: string; title: string; time: string }[];
  wishlist: string[];
  freeTimePercentage: number;
  aiPacingJudgement: string;
  daysSummary: {
    day: string;
    dayEn: string;
    date: string;
    routine: string;
    status: '固定' | '需要' | '想做' | '休息' | '自由';
    freeHours: number;
  }[];
  delayedTasksAnalysis: {
    taskName: string;
    delayedCount: number;
    reasons: string[];
    suggestedBreakdown: string[];
  }[];
}

export interface MonthlyPlanState {
  monthStr: string;
  monthEn: string;
  vibe: string;
  threeHighlights: { category: string; title: string; done: boolean }[];
  experiences: { title: string; status: string }[];
  shoppingList: { title: string; type: '必要' | '想買' | '先觀望'; price?: string }[];
  monthlyReview: {
    completionRate: number;
    mostRewarding: string;
    happiestEvent: string;
    mostExhausting: string;
    mostDelayed: string;
    newHabitFormed: string;
    safeToStop: string;
    nextMonthContinuance: string;
  };
}

export interface YearlyGoalItem {
  id: string;
  category: '工作與職涯' | '手作與創作' | '緩步旅行' | '生活空間' | '個人學習' | '照顧自己';
  title: string;
  commitment: '一定要完成' | '希望完成' | '有機會就做' | '純粹想體驗';
  progress: number;
  notes?: string;
}

export interface YearlyPlanState {
  year: number;
  keyword: string;
  keywordDesc: string;
  goals: YearlyGoalItem[];
}

export interface GoalItem {
  id: string;
  title: string;
  horizon: 'year' | 'month' | 'week' | 'micro';
  status: GoalStatus;
  category: string;
  description: string;
  parentGoalId?: string;
  relatedMonthGoal?: string;
  relatedWeekGoal?: string;
  microActionToday?: string;
  updatedAt: string;
  aiObservation?: string;
}

export interface GoalCascade {
  id: string;
  yearGoal: string;
  monthGoal: string;
  weekMilestone: string;
  todayAction: string;
  status: 'in_progress' | 'completed' | 'slow_burn';
  aiObservation: string;
}

export interface IdeaItem {
  id: string;
  title: string;
  description?: string;
  category: IdeaCategory | ItemCategoryType;
  urgency: 'low' | 'medium' | 'high';
  interestLevel: 'high' | 'medium' | 'low';
  preferredSeason?: string;
  preferredContext?: string;
  createdAt: string;
  lastSuggestedAt?: string;
  suggestionCount: number;
  status: 'someday' | 'scheduled' | 'archived';
  aiScore?: number;
}

export interface MemoryItem {
  id: string;
  layer: 'fact' | 'preference' | 'pattern' | 'goal';
  layerLabel: string;
  title: string;
  category: string;
  content: string;
  confidence: number; // 0.0 - 1.0 (e.g. 0.92)
  evidenceCount: number;
  evidenceNotes: string;
  status: 'active' | 'superseded' | 'observing' | 'paused';
  lastConfirmedDate: string;
  userCorrection?: string;
}

export interface BehaviorPattern {
  id: string;
  patternName: string;
  observedTrait: string;
  confidence: number;
  frequency: string;
  influenceOnPacing: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  why: string;
  suitableTime: string;
  estimatedDuration: string;
  level: RecommendationLevel;
  score: number;
  status: 'pending' | 'accepted' | 'declined' | 'dismissed_forever';
  alternativeIfReject: string;
  sourceIdeaId?: string;
  category?: string;
}

export interface RecommendationFeedback {
  id: string;
  recommendationId: string;
  action: '安排' | '看看' | '先不用' | '不再推薦';
  feedbackNotes?: string;
  timestamp: string;
}

export interface TimeCapsuleGift {
  id: string;
  dateMentioned: string;
  quote: string;
  title: string;
  message: string;
  status: 'active' | 'scheduled' | 'postponed';
}

export type ProposalScenario =
  | 'schedule_today'    // 情境 A: 適合近期安排 (有合適空檔)
  | 'schedule_future'   // 情境 B: AI 合理推測時間 (如展覽適合週末)
  | 'overload_warn'     // 情境 C: 今天不適合硬塞 (保護留白，建議放明天)
  | 'long_term_wish'    // 情境 D: 長期願望或興趣 (不強迫安排，存為想做的事)
  | 'small_chore'       // 情境 E: 事情很小 (順手或微空檔安排)
  | 'custom_time';

export interface ProposalActionOption {
  id: string;
  label: string;
  type: 'accept_today' | 'accept_future' | 'reschedule_slot' | 'save_idea' | 'dismiss';
  timeSlot?: string;
  dateStr?: string;
}

export interface UrlIdentity {
  sourceUrl: string;
  sourceDomain: string;
  sourcePath: string;
  sourceQuery?: string;
  pageTitle: string;
  pageType: 'event' | 'youtube' | 'exhibition' | 'article' | 'product' | 'workshop' | 'general';
  contentIdentifier?: string; // e.g. SId=0Q167424170114904587 or YouTube Video ID
  fetchedAt: string;
}

export interface ExtractedUrlInfo {
  title: string;
  originalTitle?: string;
  channelName?: string;
  duration?: string; // e.g. "28:35"
  durationMinutes?: number;
  thumbnailUrl?: string;
  dateText?: string;
  timeText?: string;
  locationText?: string;
  priceText?: string;
  deadlineText?: string;
  descriptionSnippet?: string;
  isReadable: boolean;
  unreadableReason?: string;
  contentFingerprint: string;
  verificationStatus: 'verified' | 'unreadable' | 'inconsistent';
}

export interface ConversationContentObject {
  id: string;
  contentType: 'url_event' | 'youtube' | 'url_article' | 'url_product' | 'workshop' | 'general';
  url: string;
  title: string;
  domain: string;
  channel?: string;
  durationMinutes?: number;
  date?: string;
  time?: string;
  location?: string;
  deadline?: string;
  price?: string;
  thumbnailUrl?: string;
  fetchedAt: string;
  summary: string;
  contentFingerprint?: string;
  userConfirmedIntent?: boolean;
}

export interface ProposalSourceProvenance {
  sourceUrl: string;
  sourceTitle: string;
  sourceDomain: string;
  contentType: 'url_event' | 'youtube' | 'url_article' | 'url_product' | 'workshop' | 'general';
  videoId?: string;
  channelName?: string;
  durationMinutes?: number;
  location?: string;
  dateText?: string;
  timeText?: string;
  deadlineText?: string;
  fetchedAt: string;
  verificationStatus?: 'verified' | 'unreadable';
  extractedInformation?: Record<string, any>;
}

export interface SchedulingProposal {
  id: string;
  scenario: ProposalScenario;
  activityTitle: string;
  category: IdeaCategory | ItemCategoryType;
  proposedTime?: string;
  proposedDate?: string;
  durationMinutes: number;
  reason: string;
  status: 'pending' | 'accepted' | 'stashed_as_idea' | 'alternative_requested' | 'dismissed';
  actionOptions: ProposalActionOption[];
  alternativeSuggestions?: { label: string; dateStr: string; timeSlot: string }[];
  sourceInfo?: ProposalSourceProvenance;
}

export interface NoteActionRecord {
  type: 'add' | 'delete';
  location: 'today_schedule' | 'today_essential' | 'today_leisure' | 'ideas_wall';
  locationLabel: string; // e.g. "今日時間軸 · SCHEDULE (15:00)" | "今日工作區 · 必要事項" | "今日工作區 · 有餘裕時" | "想法牆 (Ideas)"
  targetTab: 'today' | 'ideas';
  itemTitle: string;
  itemDetails?: string;
  itemId?: string;
  previousItem?: any;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  messageTone?: 'general' | 'schedule_proposal' | 'free_time_discovery' | 'preference_memorized' | 'reminder';
  proposal?: SchedulingProposal;
  noteAction?: NoteActionRecord;
  detectedItem?: {
    title: string;
    type: ItemCategoryType;
    suggestedTime?: string;
    notes?: string;
  };
  urlCard?: {
    identity: UrlIdentity;
    extracted: ExtractedUrlInfo;
    suggestedAction?: 'ask_intent' | 'proposal' | 'info_only';
  };
  activeContentObject?: ConversationContentObject;
}

// -------------------------------------------------------------
// NOW / Threads / News / Event Clustering Data Structures
// -------------------------------------------------------------

export type ThreadsCategoryType =
  | 'news'          // 新聞型：某事件發生了什麼
  | 'social_debate' // 社群型：大家現在正在吵什麼
  | 'lifestyle'     // 生活型：哪家店、哪件商品突然爆紅
  | 'entertainment' // 娛樂型：哪位藝人/創作者成為熱門話題
  | 'culture'       // 文化型：哪個展覽/手作/作品被大量分享
  | 'meme'          // 網路型：最近大家都在玩的梗與迷因
  | 'micro_event';  // 小事件：原本很小的事突然瘋傳爆紅

export type HeatVelocity = 'HOT' | 'RISING' | 'CONTINUING' | 'BREAKING';

export interface ThreadsHotItem {
  id: string;
  rank: number; // 1, 2, 3, 4, 5...
  title: string;
  category: ThreadsCategoryType;
  categoryLabel: string;
  heatVelocity: HeatVelocity;
  heatVelocityLabel: string;
  importance: number; // 1 to 5 (重要度)
  viralness: number;  // 1 to 5 (熱門度)
  shortExplainer: string; // 這是什麼？ (1-sentence objective plain-text explainer)
  whatHappened: string;   // 發生什麼？
  whyViral: string;       // 為什麼突然紅？
  whatPeopleSay: string;  // 大家在討論什麼？
  velocityText: string;   // e.g. "剛剛兩小時內討論急遽激增"
  discussionVolume: string; // e.g. "4.8 萬討論"
  sourceBucket: 'everyone_talking' | 'rising_fast' | 'trending' | 'small_discovery' | 'for_you';
  cluster: {
    threadsDiscussions: string[]; // Threads 正在熱議 (網友大量分享現場照片、觀點)
    newsReporting?: string[];     // 新聞報導 (媒體報導整理)
    officialConfirmation?: string[]; // 官方資訊 (已確認之官方公告)
  };
  personalRelevance?: {
    isRelevant: boolean;
    reason: string; // e.g. "你最近也有在找展覽，這個可能會感興趣。"
  };
  sourceUrl?: string; // Threads 原文/搜尋網址
  searchQuery?: string; // Threads 搜尋依據關鍵字（如「爭鮮推出秋蟹季活動」）
  aiSummary?: string; // Threads 官方標記：「大家討論的話題，由 AI 整理成摘要」
  threadsPostCount?: string; // Threads 官方顯示貼文量（如「479 則貼文」、「4 千 則貼文」）
  sourceAuthorHandle?: string; // 原文作者帳號 (例如 @chifeng_scone)
  sourceAuthorName?: string;   // 原文作者名稱 (例如 赤峰司康日常)
  // Real-time metadata tracking (Section Eight & Nine)
  last_fetched_at?: string;
  first_seen_at?: string;
  last_seen_at?: string;
  trend_score?: number;
  velocity?: 'breaking' | 'rising' | 'continuing' | 'cooling';
  status_label?: '升溫' | '持續熱門' | '逐漸趨緩' | '突發';
  engagement?: number;
  source_count?: number;
  event_cluster_id?: string;
  verification_status?: 'realtime_sync' | 'recently_updated' | 'data_delayed' | 'partial_public' | 'unavailable';
  updatedAt: string;
}

export interface NewsSource {
  id: string;
  name: string;
  type: 'taiwan' | 'international' | 'culture' | 'tech' | 'city';
  reliability: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: '台灣焦點' | '國際脈動' | '文化藝文' | '城市生活' | '科技趨勢';
  summary: string;
  publishedAt: string;
  url?: string;
  isFact: true; // Distinguishes pure news fact
}

export interface ThreadsPost {
  id: string;
  authorHandle: string;
  authorName: string;
  content: string;
  likeCount: number;
  replyCount: number;
  timestamp: string;
  topicTag: string;
  url?: string;
}

export interface ThreadsTopic {
  id: string;
  topicName: string;
  postCount: number;
  trendingRank: number;
  vibe: '熱議' | '溫和' | '共鳴' | '專業觀點';
  topQuote: string;
}

export interface CurrentEventCluster {
  id: string;
  clusterTitle: string;
  clusterType: 'culture_event' | 'city_traffic' | 'weather_alert' | 'life_trend';
  newsFacts: string[];
  threadsDiscussions: string[];
  personalRelevance?: {
    isRelevant: boolean;
    reason: string; // e.g. "你明天下午 14:00 有松菸行程，此展覽將引發周邊人潮與交管。"
    suggestedAction?: string;
  };
  heatLevel: 'moderate' | 'high' | 'viral';
  updatedAt: string;
}

export interface WeatherInfo {
  city: string;
  temp: number;
  condition: string;
  conditionDescription: string;
  humidity: number;
  airQuality: string;
  wind: string;
  clothingSuggestion: string;
  sunsetTime: string;
}

// -------------------------------------------------------------
// Contextual Life Reminders (情境生活提醒模組)
// -------------------------------------------------------------

export type LifeContextStage =
  | 'HOME'      // 在家
  | 'LEAVING'   // 出門前 / 準備出門
  | 'OUTSIDE'   // 在外
  | 'RETURNING';// 返家中

export type LeavingContextScenario =
  | 'auto'          // 系統依據今天行程與天氣自動判定
  | 'short_errand'  // 附近短程外出（超商、取件）
  | 'rainy_day'     // 陰雨天外出
  | 'long_outing'   // 長時間外出（全天、超過4小時）
  | 'photo_walk';   // 散步拍照行程

export interface LeavingChecklistItem {
  id: string;
  name: string;
  checked: boolean;
  order: number;
  enabled: boolean;
  isDefault?: boolean;
  isContextual?: boolean; // 是否為情境動態增量項目（如雨傘、行動電源）
  contextReason?: string; // 為什麼這次要提醒（如：今日降雨機率 70%）
  isTemporary?: boolean;  // 是否為單次對話臨時產生（不永久污染基本清單）
}

export interface ContextScenarioRule {
  id: string;
  itemName: string;
  conditionLabel: string;
  triggerContext: 'rain' | 'hot_sun' | 'long_trip' | 'course_workshop' | 'photography';
  enabled: boolean;
}

export interface WaterReminderState {
  lastRemindedAt: number; // timestamp
  nextEligibleAt: number; // timestamp for cooldown
  sipCountToday: number;
  dateKey?: string;       // e.g. "2026-09-11"
  pausedToday: boolean;
  currentPhraseIndex: number;
}

// -------------------------------------------------------------
// Daily Life Plan & Life Suggestions (每日生活提案)
// -------------------------------------------------------------

export type LifeSuggestionType =
  | 'meal'
  | 'rest'
  | 'reading'
  | 'walk'
  | 'media'
  | 'exhibition'
  | 'habit'
  | 'craft'
  | 'ai_proposed'
  | 'free_time'
  | 'custom';

export type LifeSuggestionStatus =
  | 'suggested'
  | 'accepted'
  | 'scheduled'
  | 'rejected'
  | 'dismissed'
  | 'expired';

export type LifeSuggestionSource =
  | 'confirmed_schedule'     // 第一層：已確認的行程
  | 'explicit_wish'          // 第二層：使用者明確說過想做的事
  | 'long_term_preference'   // 第三層：長期偏好
  | 'weather_context'        // 第四層：當天環境
  | 'ai_proposed';           // 第五層：AI 自由建議（標示「AI 提案」）

export interface LifeSuggestion {
  id: string;
  type: LifeSuggestionType;
  title: string;
  description: string;
  suggestedTime: string;      // e.g. "09:00", "12:00", "15:00", "17:30", "20:30"
  duration: string;           // e.g. "45 分鐘", "1 小時"
  source: LifeSuggestionSource;
  sourceLabel?: string;       // e.g. "已確認行程", "最近想做", "生活偏好", "天氣晴朗", "AI 提案"
  preferenceScore: number;    // 內部計算 0-100，不直接生硬顯示給使用者
  status: LifeSuggestionStatus;
  isAiFreeSuggestion?: boolean;
  isFreeTimeBlock?: boolean;  // 自由時間 Bubble
  categoryTag?: string;       // 飲品、早午餐、閱讀、散步、影音等
  scheduledSlotId?: string;
}

export interface ScheduledItem {
  id: string;
  dailyPlanId?: string;
  title: string;
  description?: string;
  startTime: string;      // e.g. "09:00", "12:00", "15:00", "20:00"
  endTime?: string;        // e.g. "10:00", "13:00"
  duration?: string;       // e.g. "45 分鐘", "1 小時"
  type: string;            // 'meal' | 'reading' | 'media' | 'walk' | 'life' | 'work' | 'rest' | 'fixed' | 'routine' | 'task'
  source: 'ai_conversation' | 'user_input' | 'manual' | 'imported_url' | 'youtube' | 'fixed_event' | 'suggestion_accepted';
  sourceConversationId?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'delayed';
  createdAt: string;
  updatedAt: string;
  aiNote?: string;
  isFreeTime?: boolean;
  isFixed?: boolean;
  location?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  category?: 'routine' | 'fixed' | 'task' | 'free' | 'rest' | 'meal' | 'entertainment' | 'temp';
  time?: string;          // Compatibility alias for startTime
  completed?: boolean;    // Compatibility alias for status === 'completed'
}

export interface FreeTimeBlock {
  id: string;
  start: string;
  end: string;
  durationMinutes: number;
  note: string; // e.g. "這段時間留給你", "下午還有一點空白"
}

export interface DailyLifePlan {
  id: string;
  userId: string;
  date: string;              // e.g. "2026-09-11"
  dateKey: string;           // e.g. "2026-09-11"
  theme: string;             // e.g. "悠閒慢調的生活提案"
  vibe?: string;             // '悠閒' | '想耍廢' | '出去玩' | '療癒身心' | '有生產力' | '留給自己'
  userOpeningPrompt?: string;// e.g. "今天想怎麼過？"
  subOpeningNote?: string;   // e.g. "這只是今天的一個版本，可以隨時改。"
  planVersion: number;       // Version 1, 2, 3...
  suggestions: LifeSuggestion[];
  scheduledItems: ScheduledItem[];
  confirmedItems?: TimeSlot[];
  fixedItems: ScheduledItem[];
  freeTimeBlocks: FreeTimeBlock[];
  rejectedSuggestions: LifeSuggestion[];
  generatedAt: string;
  updatedAt: string;
}

