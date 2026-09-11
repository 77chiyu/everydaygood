import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DailyPlanState,
  WeeklyPlanState,
  MonthlyPlanState,
  YearlyPlanState,
  GoalCascade,
  GoalItem,
  GoalStatus,
  IdeaItem,
  MemoryItem,
  AIRecommendation,
  TimeCapsuleGift,
  ChatMessage,
  DisturbanceMode,
  DayTempo,
  TimeSlot,
  TaskItem,
  DailyReview,
  UserProfile,
  WeatherInfo,
  NewsItem,
  ThreadsPost,
  ThreadsTopic,
  CurrentEventCluster,
  TimeOfDayPeriod,
  BehaviorPattern,
  LifeContextStage,
  LeavingChecklistItem,
  LeavingContextScenario,
  ContextScenarioRule,
  ThreadsHotItem,
  WaterReminderState,
  ProposalActionOption,
  SchedulingProposal,
  ConversationContentObject,
  PastAiSuggestion,
  HistoricalDailyPlan,
  NoteActionRecord,
  DailyLifePlan,
  LifeSuggestion,
  ScheduledItem,
  FreeTimeBlock
} from '../types';
import {
  getTaipeiDateKey,
  getLocalCachedPlan,
  setLocalCachedPlan,
  fetchDailyPlanFromServer,
  persistDailyPlan,
  requestReschedulePlan
} from '../utils/storageService';
import { parseUserScheduleIntent } from '../utils/scheduleParser';
import {
  INITIAL_USER_PROFILE,
  INITIAL_WEATHER,
  INITIAL_DAILY_PLAN,
  INITIAL_DAILY_LIFE_PLAN,
  INITIAL_WEEKLY_PLAN,
  INITIAL_MONTHLY_PLAN,
  INITIAL_YEARLY_PLAN,
  INITIAL_GOAL_ITEMS,
  INITIAL_GOAL_CASCADES,
  INITIAL_IDEAS,
  INITIAL_MEMORIES,
  INITIAL_BEHAVIOR_PATTERNS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_TIME_CAPSULE_GIFT,
  INITIAL_NEWS_ITEMS,
  INITIAL_THREADS_POSTS,
  INITIAL_THREADS_TOPICS,
  INITIAL_EVENT_CLUSTERS,
  INITIAL_THREADS_HOT_ITEMS,
  INITIAL_LEAVING_ITEMS,
  INITIAL_CONTEXT_SCENARIO_RULES,
  LEAVING_REMINDER_PHRASES,
  WATER_REMINDER_PHRASES
} from '../mockData';

export type NavTab =
  | 'home'
  | 'today'
  | 'week'
  | 'month'
  | 'year'
  | 'goals'
  | 'ideas'
  | 'memory'
  | 'ai';

interface LifeContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Real-time Taipei Clock & Atmosphere
  taipeiTimeStr: string;
  taipeiDateStr: string;
  taipeiDayOfWeek: string;
  timeOfDay: TimeOfDayPeriod;
  timeOfDayText: string;
  timeAtmosphereQuote: string;
  simulatedPeriod: TimeOfDayPeriod | null;
  setSimulatedPeriod: (p: TimeOfDayPeriod | null) => void;

  // Weather & Profile
  weather: WeatherInfo;
  userProfile: UserProfile;

  // Daily State
  dailyPlan: DailyPlanState;
  updateEnergy: (val: number) => void;
  updateMood: (val: number) => void;
  updateTempo: (val: DayTempo) => void;
  toggleTimeSlot: (slotId: string) => void;
  addTimeSlot: (slot: Omit<TimeSlot, 'id'>) => void;
  deleteTimeSlot: (slotId: string) => void;
  toggleTask: (taskId: string, isLeisure?: boolean) => void;
  addTask: (task: Omit<TaskItem, 'id'>, isLeisure?: boolean) => void;
  deleteTask: (taskId: string) => void;
  submitDailyReview: (review: DailyReview) => void;
  justWrapUpToday: () => void;

  // Smart Reschedule
  rescheduleTarget: TaskItem | null;
  openRescheduleModal: (task: TaskItem) => void;
  closeRescheduleModal: () => void;
  applyReschedule: (
    taskId: string,
    action: 'tomorrow' | 'other_date' | 'breakdown' | 'keep' | 'convert_to_idea' | 'cancel',
    note?: string
  ) => void;

  // Other Core Plans
  weeklyPlan: WeeklyPlanState;
  monthlyPlan: MonthlyPlanState;
  yearlyPlan: YearlyPlanState;
  goalCascades: GoalCascade[];
  goalItems: GoalItem[];
  updateGoalStatus: (id: string, status: GoalStatus) => void;

  // Ideas
  ideas: IdeaItem[];
  addIdea: (idea: Omit<IdeaItem, 'id' | 'createdAt' | 'suggestionCount' | 'status'>) => void;
  scheduleIdeaToToday: (ideaId: string, customTime?: string) => void;
  deleteIdea: (ideaId: string) => void;

  // Memory & Patterns
  memories: MemoryItem[];
  behaviorPatterns: BehaviorPattern[];
  updateMemoryStatus: (id: string, status: 'active' | 'superseded' | 'paused') => void;
  adjustMemoryConfidence: (id: string, newConfidence: number) => void;

  // Recommendations
  recommendations: AIRecommendation[];
  handleRecommendationFeedback: (
    recId: string,
    action: '安排' | '看看' | '先不用' | '不再推薦'
  ) => void;

  // Time capsule
  timeCapsule: TimeCapsuleGift | null;
  acceptTimeCapsule: () => void;
  dismissTimeCapsule: () => void;

  // NOW / News / Threads / Event Clusters
  newsItems: NewsItem[];
  threadsPosts: ThreadsPost[];
  threadsTopics: ThreadsTopic[];
  eventClusters: CurrentEventCluster[];
  threadsHotItems: ThreadsHotItem[];

  // AI Assistant Chat & Hub
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isAiLoading: boolean;
  sendChatMessage: (text: string) => Promise<void>;
  handleProposalAction: (messageId: string, option: ProposalActionOption) => void;
  undoAiNoteAction: (action: NoteActionRecord) => void;
  disturbanceMode: DisturbanceMode;
  setDisturbanceMode: (mode: DisturbanceMode) => void;

  // Modals
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  isNewItemModalOpen: boolean;
  setIsNewItemModalOpen: (open: boolean) => void;

  // Contextual Life Reminders (情境生活提醒模組)
  lifeContextStage: LifeContextStage;
  setLifeContextStage: (stage: LifeContextStage) => void;
  simulateLeaving: () => void;
  leavingContextScenario: LeavingContextScenario;
  setLeavingContextScenario: (scenario: LeavingContextScenario) => void;
  scenarioRules: ContextScenarioRule[];
  toggleScenarioRule: (ruleId: string) => void;
  activeChecklist: LeavingChecklistItem[];
  toggleActiveChecklistItem: (id: string) => void;
  confirmAllChecklist: () => void;
  addTemporaryReminder: (name: string, reason?: string) => void;
  checklistItems: LeavingChecklistItem[];
  toggleChecklistItem: (id: string) => void;
  resetChecklist: () => void;
  addChecklistItem: (name: string) => void;
  deleteChecklistItem: (id: string) => void;
  editChecklistItem: (id: string, newName: string) => void;
  toggleChecklistItemEnabled: (id: string) => void;
  leavingPhrase: string;
  cycleLeavingPhrase: () => void;
  isChecklistDismissed: boolean;
  setIsChecklistDismissed: (val: boolean) => void;
  waterReminder: WaterReminderState;
  recordWaterSip: () => void;
  pauseWaterReminderToday: () => void;
  resumeWaterReminderToday: () => void;
  leavingReminderEnabled: boolean;
  setLeavingReminderEnabled: (val: boolean) => void;
  isChecklistSettingsOpen: boolean;
  setIsChecklistSettingsOpen: (val: boolean) => void;

  // Daily Reset & Past AI Suggestions
  pastAiSuggestions: PastAiSuggestion[];
  historicalDailyPlans: HistoricalDailyPlan[];
  resetDailyWorkspace: (forceDateKey?: string) => void;
  acceptPastAiSuggestion: (id: string, targetTime?: string) => void;
  dismissPastAiSuggestion: (id: string) => void;
  taipeiDateInfo: { dateKey: string; dateStr: string; dateNumber: string; dayOfWeek: string; weekdayZh: string };

  // Daily Life Plan & Suggestions (生活提案)
  dailyLifePlan: DailyLifePlan;
  generateDailyLifePlan: (vibeOrPrompt?: string, forceRegenerate?: boolean) => void;
  acceptLifeSuggestion: (suggestionId: string, customTime?: string) => void;
  rejectLifeSuggestion: (suggestionId: string, reason?: string) => void;
  replaceLifeSuggestion: (suggestionId: string) => void;
  rescheduleLifeSuggestion: (suggestionId: string, newTime: string) => void;
  stashLifeSuggestionToIdeas: (suggestionId: string) => void;
  setDailyOpeningVibe: (vibe: string) => void;
  toggleScheduledItem: (itemId: string) => void;
  deleteScheduledItem: (itemId: string) => void;
  addScheduledItem: (item: Partial<ScheduledItem> & { title: string; startTime: string }) => void;
  updateScheduledItemTime: (itemId: string, newTime: string) => void;
}

const LifeContext = createContext<LifeContextType | undefined>(undefined);

const STORAGE_KEY = 'life_os_editorial_state_v3';

export function getTaipeiDateInfo() {
  const now = new Date();
  const dtfKey = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' });
  const dateKey = dtfKey.format(now);

  const dtfZh = new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long' });
  const parts = dtfZh.formatToParts(now);
  const year = parts.find(p => p.type === 'year')?.value || '2026';
  const month = parts.find(p => p.type === 'month')?.value || '9';
  const day = parts.find(p => p.type === 'day')?.value || '10';
  const weekday = parts.find(p => p.type === 'weekday')?.value || '星期四';

  const dayOfWeekMap: Record<string, string> = {
    '星期日': 'Sunday',
    '星期一': 'Monday',
    '星期二': 'Tuesday',
    '星期三': 'Wednesday',
    '星期四': 'Thursday',
    '星期五': 'Friday',
    '星期六': 'Saturday',
  };
  const dayOfWeek = dayOfWeekMap[weekday] || 'Thursday';

  return {
    dateKey,
    dateStr: `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`,
    dateNumber: `${month}.${day}`,
    dayOfWeek,
    weekdayZh: weekday
  };
}

const INITIAL_PAST_AI_SUGGESTIONS: PastAiSuggestion[] = [
  {
    id: 'past-sugg-1',
    title: '抽空觀看居家收納選品影片',
    reason: '昨天 77 提到你可以這週找一個晚上看這支影片，未排入今日時間軸，可依心情自由決定。',
    category: '想看',
    proposedTime: '21:30',
    proposedDate: '本週某晚',
    createdAt: '昨天午後',
    status: 'pending'
  },
  {
    id: 'past-sugg-2',
    title: '松菸當代藝術週「生活的隙縫」手作工藝展',
    reason: '本週五或週六若有空檔可考慮前往，平日午後人潮較舒適。屬於建議事項，尚未排入時間軸。',
    category: '想體驗',
    proposedTime: '14:00',
    proposedDate: '週五或週末',
    createdAt: '昨天',
    status: 'pending'
  }
];

export const LifeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [disturbanceMode, setDisturbanceMode] = useState<DisturbanceMode>('free');

  // Real-time Taipei Clock
  const [nowDate, setNowDate] = useState<Date>(new Date());
  const [simulatedPeriod, setSimulatedPeriod] = useState<TimeOfDayPeriod | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute Taipei Time details using Asia/Taipei timezone
  const taipeiFormatterTime = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const taipeiTimeStr = taipeiFormatterTime.format(nowDate);

  const taipeiFormatterDate = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const taipeiDateStr = taipeiFormatterDate.format(nowDate);

  const taipeiFormatterDay = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    weekday: 'long'
  });
  const taipeiDayOfWeek = taipeiFormatterDay.format(nowDate);

  // Extract Taipei current hour to determine natural period
  const taipeiHourStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Taipei',
    hour: 'numeric',
    hour12: false
  }).format(nowDate);
  const currentTaipeiHour = parseInt(taipeiHourStr, 10);

  // Calculate natural time of day
  let naturalTimeOfDay: TimeOfDayPeriod = 'afternoon';
  if (currentTaipeiHour >= 5 && currentTaipeiHour < 8) {
    naturalTimeOfDay = 'early_morning';
  } else if (currentTaipeiHour >= 8 && currentTaipeiHour < 11.5) {
    naturalTimeOfDay = 'morning';
  } else if (currentTaipeiHour >= 11.5 && currentTaipeiHour < 13.5) {
    naturalTimeOfDay = 'noon';
  } else if (currentTaipeiHour >= 13.5 && currentTaipeiHour < 17.5) {
    naturalTimeOfDay = 'afternoon';
  } else if (currentTaipeiHour >= 17.5 && currentTaipeiHour < 19.5) {
    naturalTimeOfDay = 'dusk';
  } else if (currentTaipeiHour >= 19.5 && currentTaipeiHour < 23) {
    naturalTimeOfDay = 'evening';
  } else {
    naturalTimeOfDay = 'midnight';
  }

  const timeOfDay = simulatedPeriod || naturalTimeOfDay;

  const timePeriodTextMap: Record<TimeOfDayPeriod, string> = {
    early_morning: '清晨',
    morning: '上午',
    noon: '中午',
    afternoon: '下午',
    dusk: '傍晚',
    evening: '晚上',
    midnight: '深夜'
  };

  const timeAtmosphereQuoteMap: Record<TimeOfDayPeriod, string> = {
    early_morning: '天光初亮。給自己泡一杯溫水，不必急著跳進待辦清單。',
    morning: '早安。只挑一兩件重要的事處理，其餘步調隨身心安放。',
    noon: '日正當中。好好享用午餐，保留一段完全不被行程干擾的留白。',
    afternoon: '午後陽光安靜。適合手作創作、看書，進入不被打擾的心流。',
    dusk: '天色轉柔。外出走動換換氣，把白日積聚的疲憊慢慢呼出。',
    evening: '今天不用再塞東西了。有做到的已經足夠，好好讓自己放鬆。',
    midnight: '夜色深沉。77 已自動降低推薦頻率，請安心安睡，明天又是新的一天。'
  };

  const timeOfDayText = timePeriodTextMap[timeOfDay];
  const timeAtmosphereQuote = timeAtmosphereQuoteMap[timeOfDay];

  // User Profile & Weather
  const [userProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [weather] = useState<WeatherInfo>(INITIAL_WEATHER);

  // Daily State
  const [dailyPlan, setDailyPlan] = useState<DailyPlanState>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_daily`);
      if (!saved) return INITIAL_DAILY_PLAN;
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_DAILY_PLAN,
        ...parsed,
        timeline: Array.isArray(parsed.timeline) ? parsed.timeline : INITIAL_DAILY_PLAN.timeline,
        topImportantTasks: Array.isArray(parsed.topImportantTasks)
          ? parsed.topImportantTasks
          : INITIAL_DAILY_PLAN.topImportantTasks,
        leisureTasks: Array.isArray(parsed.leisureTasks)
          ? parsed.leisureTasks
          : INITIAL_DAILY_PLAN.leisureTasks
      };
    } catch {
      return INITIAL_DAILY_PLAN;
    }
  });

  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlanState>(INITIAL_WEEKLY_PLAN);
  const [monthlyPlan] = useState<MonthlyPlanState>(INITIAL_MONTHLY_PLAN);
  const [yearlyPlan] = useState<YearlyPlanState>(INITIAL_YEARLY_PLAN);
  const [goalCascades] = useState<GoalCascade[]>(INITIAL_GOAL_CASCADES);
  const [goalItems, setGoalItems] = useState<GoalItem[]>(INITIAL_GOAL_ITEMS);

  const [ideas, setIdeas] = useState<IdeaItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_ideas`);
      if (!saved) return INITIAL_IDEAS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : INITIAL_IDEAS;
    } catch {
      return INITIAL_IDEAS;
    }
  });

  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_memories`);
      if (!saved) return INITIAL_MEMORIES;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : INITIAL_MEMORIES;
    } catch {
      return INITIAL_MEMORIES;
    }
  });

  const [behaviorPatterns] = useState<BehaviorPattern[]>(INITIAL_BEHAVIOR_PATTERNS);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [timeCapsule, setTimeCapsule] = useState<TimeCapsuleGift | null>(INITIAL_TIME_CAPSULE_GIFT);

  // News, Threads, Event Clusters
  const [newsItems] = useState<NewsItem[]>(INITIAL_NEWS_ITEMS);
  const [threadsPosts] = useState<ThreadsPost[]>(INITIAL_THREADS_POSTS);
  const [threadsTopics] = useState<ThreadsTopic[]>(INITIAL_THREADS_TOPICS);
  const [eventClusters] = useState<CurrentEventCluster[]>(INITIAL_EVENT_CLUSTERS);
  const [threadsHotItems] = useState<ThreadsHotItem[]>(INITIAL_THREADS_HOT_ITEMS);

  // Smart Reschedule Modal
  const [rescheduleTarget, setRescheduleTarget] = useState<TaskItem | null>(null);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: '台北午後微風 26 度。今天最重要的行政事務你已在早晨辦妥，下午有一段舒適的留白。想做點手作，或是純粹發呆喝茶都好。',
      timestamp: '07:18'
    }
  ]);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [activeContentObject, setActiveContentObject] = useState<ConversationContentObject | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState<boolean>(false);

  // Contextual Life Reminders State
  const [lifeContextStage, setLifeContextStage] = useState<LifeContextStage>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_stage`);
      return (saved as LifeContextStage) || 'HOME';
    } catch {
      return 'HOME';
    }
  });

  const [leavingContextScenario, setLeavingContextScenario] = useState<LeavingContextScenario>('auto');
  const [scenarioRules, setScenarioRules] = useState<ContextScenarioRule[]>(INITIAL_CONTEXT_SCENARIO_RULES);
  const [temporaryChecklistItems, setTemporaryChecklistItems] = useState<LeavingChecklistItem[]>([]);
  const [dynamicItemCheckedMap, setDynamicItemCheckedMap] = useState<Record<string, boolean>>({});

  const [checklistItems, setChecklistItems] = useState<LeavingChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_leaving_items`);
      if (!saved) return INITIAL_LEAVING_ITEMS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_LEAVING_ITEMS;
    } catch {
      return INITIAL_LEAVING_ITEMS;
    }
  });

  const [leavingReminderEnabled, setLeavingReminderEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_leaving_enabled`);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isChecklistDismissed, setIsChecklistDismissed] = useState<boolean>(false);
  const [leavingPhraseIndex, setLeavingPhraseIndex] = useState<number>(0);
  const [isChecklistSettingsOpen, setIsChecklistSettingsOpen] = useState<boolean>(false);

  const [waterReminder, setWaterReminder] = useState<WaterReminderState>(() => {
    const todayKey = getTaipeiDateInfo().dateKey;
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_water_reminder`);
      if (!saved) {
        return {
          lastRemindedAt: Date.now() - 3600000,
          nextEligibleAt: 0,
          sipCountToday: 0,
          dateKey: todayKey,
          pausedToday: false,
          currentPhraseIndex: 0
        };
      }
      const parsed = JSON.parse(saved);
      if (parsed.dateKey !== todayKey) {
        return {
          ...parsed,
          sipCountToday: 0,
          dateKey: todayKey,
          pausedToday: false
        };
      }
      return parsed;
    } catch {
      return {
        lastRemindedAt: Date.now() - 3600000,
        nextEligibleAt: 0,
        sipCountToday: 0,
        dateKey: todayKey,
        pausedToday: false,
        currentPhraseIndex: 0
      };
    }
  });

  // Daily Life Plan & Suggestions (生活提案)
  const [dailyLifePlan, setDailyLifePlan] = useState<DailyLifePlan>(() => {
    try {
      const todayKey = getTaipeiDateKey();
      const localCached = getLocalCachedPlan(todayKey);
      if (localCached) {
        return localCached;
      }
      return {
        ...INITIAL_DAILY_LIFE_PLAN,
        id: `plan-${todayKey}`,
        date: todayKey,
        dateKey: todayKey,
        planVersion: 1
      };
    } catch {
      return INITIAL_DAILY_LIFE_PLAN;
    }
  });

  // On mount, load from server persistence to ensure data survives refresh
  useEffect(() => {
    const todayKey = getTaipeiDateKey();
    fetchDailyPlanFromServer(todayKey).then(({ plan }) => {
      if (plan && plan.scheduledItems) {
        setDailyLifePlan(plan);
      }
    });
  }, []);

  // Sync to local cache and server whenever dailyLifePlan changes
  useEffect(() => {
    if (dailyLifePlan) {
      persistDailyPlan(dailyLifePlan);
    }
  }, [dailyLifePlan]);

  // Save Reminders to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_stage`, lifeContextStage);
  }, [lifeContextStage]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_leaving_items`, JSON.stringify(checklistItems));
  }, [checklistItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_leaving_enabled`, JSON.stringify(leavingReminderEnabled));
  }, [leavingReminderEnabled]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_water_reminder`, JSON.stringify(waterReminder));
  }, [waterReminder]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_daily`, JSON.stringify(dailyPlan));
  }, [dailyPlan]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ideas`, JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_memories`, JSON.stringify(memories));
  }, [memories]);

  // Daily Reset & Past AI Suggestions State
  const [pastAiSuggestions, setPastAiSuggestions] = useState<PastAiSuggestion[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_past_ai_suggestions`);
      if (!saved) return INITIAL_PAST_AI_SUGGESTIONS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : INITIAL_PAST_AI_SUGGESTIONS;
    } catch {
      return INITIAL_PAST_AI_SUGGESTIONS;
    }
  });

  const [historicalDailyPlans, setHistoricalDailyPlans] = useState<HistoricalDailyPlan[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_historical_plans`);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_past_ai_suggestions`, JSON.stringify(pastAiSuggestions));
  }, [pastAiSuggestions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_historical_plans`, JSON.stringify(historicalDailyPlans));
  }, [historicalDailyPlans]);

  const taipeiDateInfo = React.useMemo(() => getTaipeiDateInfo(), [nowDate]);

  // Automatic 00:00 (Asia/Taipei) Daily Workspace Reset
  const resetDailyWorkspace = (forceDateKey?: string) => {
    const taipeiInfo = getTaipeiDateInfo();
    const targetDateKey = forceDateKey || taipeiInfo.dateKey;

    // Reset daily hydration sip count to 0 for the fresh day!
    setWaterReminder((prev) => ({
      ...prev,
      sipCountToday: 0,
      dateKey: targetDateKey,
      pausedToday: false,
      lastRemindedAt: Date.now()
    }));

    setDailyPlan((prevPlan) => {
      // Archive current plan to historical plans
      const historyItem: HistoricalDailyPlan = {
        dateKey: prevPlan.dateKey || prevPlan.dateStr || 'yesterday',
        dateStr: prevPlan.dateStr,
        plan: prevPlan,
        archivedAt: new Date().toISOString()
      };
      setHistoricalDailyPlans((prevHist) => [historyItem, ...prevHist.slice(0, 29)]);

      // Keep only confirmed fixed routines and habits, reset their completion
      const preservedRoutines = prevPlan.timeline
        .filter((slot) => slot.category === 'routine' || slot.category === 'fixed' || slot.category === 'meal' || slot.isFreeTime)
        .map((slot) => ({
          ...slot,
          completed: false
        }));

      // Create new fresh day workspace: clear yesterday's unfinished tasks and review!
      const newPlan: DailyPlanState = {
        dateKey: targetDateKey,
        dateStr: taipeiInfo.dateStr,
        dateNumber: taipeiInfo.dateNumber,
        dayOfWeek: taipeiInfo.dayOfWeek,
        dailyQuote: '今天不用急著完成所有事情。',
        subQuote: '新的一天是獨立的日常工作空間，隨你的節奏自然安放。',
        energy: 4,
        mood: 4,
        tempo: '悠閒',
        freeTimeHours: 4.5,
        timeline: preservedRoutines.length > 0 ? preservedRoutines : INITIAL_DAILY_PLAN.timeline,
        topImportantTasks: [], // Cleared on new day!
        leisureTasks: [],      // Cleared on new day!
        review: undefined,     // Cleared completely on next day!
        isResetToday: true,
        resetTimestamp: new Date().toLocaleTimeString('zh-TW', { hour12: false })
      };

      localStorage.setItem(`${STORAGE_KEY}_last_taipei_date`, targetDateKey);
      localStorage.setItem(`${STORAGE_KEY}_daily`, JSON.stringify(newPlan));
      return newPlan;
    });

    // Generate fresh Daily Life Proposal for the new day
    generateDailyLifePlan('悠閒', true);
  };

  // Generate Daily Life Proposal (5-layer context priority)
  const generateDailyLifePlan = async (vibeOrPrompt?: string, forceRegenerate = false) => {
    const todayKey = getTaipeiDateKey();
    try {
      const res = await requestReschedulePlan(todayKey, vibeOrPrompt);
      if (res.plan && res.plan.scheduledItems) {
        setDailyLifePlan(res.plan);
        setLocalCachedPlan(res.plan);
        return;
      }
    } catch (e) {
      console.warn('requestReschedulePlan failed, computing fallback locally:', e);
    }

    const taipeiInfo = getTaipeiDateInfo();
    const cleanPrompt = (vibeOrPrompt || '').trim().toLowerCase();

    let selectedVibe = '悠閒';
    let themeTitle = '悠閒慢調的生活提案';
    let subNote = '這只是今天的一個版本，可以隨時改。';

    if (cleanPrompt.includes('耍廢') || cleanPrompt.includes('躺平') || cleanPrompt.includes('累')) {
      selectedVibe = '想耍廢';
      themeTitle = '放慢腳步・無壓力耍廢日';
      subNote = '今天不需要達成任何目標，把所有精力留給自己好好休息。';
    } else if (cleanPrompt.includes('生產力') || cleanPrompt.includes('工作') || cleanPrompt.includes('充實')) {
      selectedVibe = '有生產力';
      themeTitle = '專注呼吸・溫和有節奏的一天';
      subNote = '集中精力在最關鍵的 1-2 件事，同時保持身心不緊繃。';
    } else if (cleanPrompt.includes('出去玩') || cleanPrompt.includes('出門') || cleanPrompt.includes('走走')) {
      selectedVibe = '出去玩';
      themeTitle = '出門漫步・探索城市小角落';
      subNote = '台北今天微風涼爽，非常適合戶外慢走或去吃想吃的美食。';
    } else if (cleanPrompt.includes('療癒') || cleanPrompt.includes('放鬆') || cleanPrompt.includes('身心')) {
      selectedVibe = '療癒身心';
      themeTitle = '溫柔療癒・身心舒展日';
      subNote = '給自己一杯熱飲、翻翻好書、聽聽安靜音樂，給心靈補水。';
    } else if (cleanPrompt.includes('什麼都不想做') || cleanPrompt.includes('不想安排') || cleanPrompt.includes('留白') || cleanPrompt.includes('空')) {
      selectedVibe = '留給自己';
      themeTitle = '純粹留給自己的自由空間';
      subNote = '今天不強迫產生任何行程，想吃飯就吃、想發呆就發呆。';
    }

    let suggestions: LifeSuggestion[] = [];

    if (selectedVibe === '留給自己') {
      suggestions = [
        {
          id: `ls-${Date.now()}-1`,
          type: 'rest',
          title: '今天留給自己',
          description: '沒有鬧鐘、沒有待辦，依照身體的感受自然呼吸。',
          suggestedTime: '全天',
          duration: '一整天',
          source: 'long_term_preference',
          sourceLabel: '身心第一順位',
          preferenceScore: 99,
          status: 'suggested',
          isFreeTimeBlock: true,
          categoryTag: '純粹留白'
        },
        {
          id: `ls-${Date.now()}-2`,
          type: 'meal',
          title: '想吃的時候，隨意吃點喜歡的食物',
          description: '不用按照準確時間用餐，餓了就吃一碗熱熱的湯麵或點心。',
          suggestedTime: '隨時',
          duration: '自在',
          source: 'explicit_wish',
          sourceLabel: '日常舒適',
          preferenceScore: 92,
          status: 'suggested',
          categoryTag: '隨心慢食'
        },
        {
          id: `ls-${Date.now()}-3`,
          type: 'media',
          title: '看點喜歡的東西，其他都不用急',
          description: '隨意翻幾頁散文，或看喜歡的料理生活頻道，累了就睡。',
          suggestedTime: '午後或夜晚',
          duration: '放空',
          source: 'long_term_preference',
          sourceLabel: '放鬆時刻',
          preferenceScore: 95,
          status: 'suggested',
          categoryTag: '放鬆時刻'
        }
      ];
    } else if (selectedVibe === '想耍廢') {
      suggestions = [
        {
          id: `ls-${Date.now()}-1`,
          type: 'meal',
          title: '睡飽飽，09:30 喝杯奶茶慢慢吃早餐',
          description: '不設催促鬧鐘，醒來後慢火熱一壺奶茶，配酥香的厚片吐司。',
          suggestedTime: '09:30',
          duration: '60 分鐘',
          source: 'explicit_wish',
          sourceLabel: '想喝奶茶願望',
          preferenceScore: 96,
          status: 'suggested',
          categoryTag: '早餐茶食'
        },
        {
          id: `ls-${Date.now()}-2`,
          type: 'meal',
          title: '中午點一份熱騰騰的義大利麵外送',
          description: '不想出門就不用出門，點一份濃郁的番茄蒜香麵在沙發上享用。',
          suggestedTime: '12:30',
          duration: '60 分鐘',
          source: 'explicit_wish',
          sourceLabel: '想吃義大利麵',
          preferenceScore: 94,
          status: 'suggested',
          categoryTag: '美味午餐'
        },
        {
          id: `ls-${Date.now()}-3`,
          type: 'free_time',
          title: '這段時間留給你 · 沙發放空時光',
          description: '下午還有一大片空白，什麼都不用做，窩在毯子裡放空發呆。',
          suggestedTime: '14:30',
          duration: '90 分鐘',
          source: 'long_term_preference',
          sourceLabel: '自由留白',
          preferenceScore: 98,
          status: 'suggested',
          isFreeTimeBlock: true,
          categoryTag: '自由時間'
        },
        {
          id: `ls-${Date.now()}-4`,
          type: 'media',
          title: '看 YouTube 影片・東京手沖咖啡日常',
          description: '隨心挑一支舒服的生活紀錄片，搭配一杯熱茶，享受純粹自己的時光。',
          suggestedTime: '20:00',
          duration: '60 分鐘',
          source: 'explicit_wish',
          sourceLabel: '收藏影片靈感',
          preferenceScore: 92,
          status: 'suggested',
          categoryTag: '放鬆時刻'
        }
      ];
    } else if (selectedVibe === '出去玩') {
      suggestions = [
        {
          id: `ls-${Date.now()}-1`,
          type: 'meal',
          title: '09:00 晨間元氣早午餐與奶茶',
          description: '為今天的出門散步儲備滿滿好心情。',
          suggestedTime: '09:00',
          duration: '50 分鐘',
          source: 'explicit_wish',
          sourceLabel: '晨間生活願望',
          preferenceScore: 91,
          status: 'suggested',
          categoryTag: '早餐茶食'
        },
        {
          id: `ls-${Date.now()}-2`,
          type: 'meal',
          title: '12:00 去吃一頓期待已久的義大利麵',
          description: '挑一間採光舒服的義式小館，慢慢品嚐橄欖油蒜香或濃郁羅勒麵。',
          suggestedTime: '12:00',
          duration: '70 分鐘',
          source: 'explicit_wish',
          sourceLabel: '前幾天提過想吃義大利麵',
          preferenceScore: 95,
          status: 'suggested',
          categoryTag: '美味午餐'
        },
        {
          id: `ls-${Date.now()}-3`,
          type: 'exhibition',
          title: '14:30 漫步美術館看秋季插畫聯展',
          description: '避開週末人潮的平日午後，欣賞原稿手繪線條與柔和色彩。',
          suggestedTime: '14:30',
          duration: '90 分鐘',
          source: 'explicit_wish',
          sourceLabel: '想法牆心願',
          preferenceScore: 93,
          status: 'suggested',
          categoryTag: '藝文漫遊'
        },
        {
          id: `ls-${Date.now()}-4`,
          type: 'free_time',
          title: '下午還有一點空白 · 坐在樹蔭下吹風',
          description: '逛累了找張公園長椅坐坐，不急著趕往下一站。',
          suggestedTime: '16:30',
          duration: '45 分鐘',
          source: 'long_term_preference',
          sourceLabel: '自然呼吸',
          preferenceScore: 90,
          status: 'suggested',
          isFreeTimeBlock: true,
          categoryTag: '自由時間'
        },
        {
          id: `ls-${Date.now()}-5`,
          type: 'walk',
          title: '18:00 巷弄散步、逛逛二手器物選物店',
          description: '台北微風陰天（26°C），傍晚光線柔和，在小巷間隨意發現生活驚喜。',
          suggestedTime: '18:00',
          duration: '60 分鐘',
          source: 'weather_context',
          sourceLabel: '微風陰天宜出門',
          preferenceScore: 89,
          status: 'suggested',
          categoryTag: '生活探索'
        }
      ];
    } else {
      // Default: 悠閒生活提案 (與使用者偏好深度契合的生活故事)
      suggestions = [
        {
          id: `ls-${Date.now()}-1`,
          type: 'meal',
          title: '喝杯奶茶，慢慢吃早餐',
          description: '用一杯溫熱香甜的奶茶啟動一天，不需要一睜眼就面對待辦。',
          suggestedTime: '09:00',
          duration: '45 分鐘',
          source: 'explicit_wish',
          sourceLabel: '最近想喝奶茶',
          preferenceScore: 95,
          status: 'suggested',
          categoryTag: '早餐茶食'
        },
        {
          id: `ls-${Date.now()}-2`,
          type: 'meal',
          title: '吃一頓好吃的義大利麵',
          description: '中午享受一盤用心烹調的義大利麵，慢慢吃、慢慢品嚐滋味。',
          suggestedTime: '12:00',
          duration: '60 分鐘',
          source: 'explicit_wish',
          sourceLabel: '前幾天提過想吃義大利麵',
          preferenceScore: 93,
          status: 'suggested',
          categoryTag: '午間美味'
        },
        {
          id: `ls-${Date.now()}-3`,
          type: 'reading',
          title: '找個舒服的地方看一點書',
          description: '陽光柔和的角落，翻讀幾頁《器物之美》或手作生活散文，心靈自然沉靜。',
          suggestedTime: '15:00',
          duration: '60 分鐘',
          source: 'long_term_preference',
          sourceLabel: '喜歡安靜閱讀',
          preferenceScore: 89,
          status: 'suggested',
          categoryTag: '心靈留白'
        },
        {
          id: `ls-${Date.now()}-4`,
          type: 'free_time',
          title: '這段時間留給你',
          description: '下午還有一點空白，不需要一直有事情做，給自己發呆與伸懶腰的自由。',
          suggestedTime: '17:00',
          duration: '45 分鐘',
          source: 'long_term_preference',
          sourceLabel: '日常留白',
          preferenceScore: 98,
          status: 'suggested',
          isFreeTimeBlock: true,
          categoryTag: '自由時間'
        },
        {
          id: `ls-${Date.now()}-5`,
          type: 'walk',
          title: '出去走走，看看附近有沒有想逛的地方',
          description: '台北微風陰天（26°C），涼爽宜人，非常適合在綠樹巷弄間散步換氣。',
          suggestedTime: '18:00',
          duration: '45 分鐘',
          source: 'weather_context',
          sourceLabel: '微風陰天涼爽',
          preferenceScore: 88,
          status: 'suggested',
          categoryTag: '散步漫遊'
        },
        {
          id: `ls-${Date.now()}-6`,
          type: 'media',
          title: '留給自己・看一支想看的 YouTube',
          description: '可以看東京下北澤手沖咖啡日常（24分鐘），也可以放空什麼都不做。',
          suggestedTime: '20:30',
          duration: '60 分鐘',
          source: 'long_term_preference',
          sourceLabel: '晚間放鬆時刻',
          preferenceScore: 94,
          status: 'suggested',
          categoryTag: '放鬆時刻'
        }
      ];
    }

    const nextVersion = (dailyLifePlan.planVersion || 1) + 1;
    const preservedFixed = (dailyLifePlan.scheduledItems || []).filter((it) => it.isFixed);
    const initialFixed = INITIAL_DAILY_LIFE_PLAN.scheduledItems?.filter((it) => it.isFixed) || [];
    const scheduledToKeep = preservedFixed.length > 0 ? preservedFixed : initialFixed;

    const newPlan: DailyLifePlan = {
      id: `plan-${todayKey}`,
      userId: 'user-default',
      date: taipeiInfo.dateStr,
      dateKey: todayKey,
      theme: nextVersion > 1 ? `${themeTitle} (第 ${nextVersion} 版)` : themeTitle,
      vibe: selectedVibe,
      userOpeningPrompt: '今天想怎麼過？',
      subOpeningNote: subNote,
      planVersion: nextVersion,
      suggestions,
      confirmedItems: [],
      scheduledItems: scheduledToKeep,
      fixedItems: dailyLifePlan.fixedItems && dailyLifePlan.fixedItems.length > 0 ? dailyLifePlan.fixedItems : (INITIAL_DAILY_LIFE_PLAN.fixedItems || []),
      freeTimeBlocks: [
        {
          id: `ft-${Date.now()}-1`,
          start: '13:30',
          end: '14:45',
          durationMinutes: 75,
          note: '午後空白留白'
        },
        {
          id: `ft-${Date.now()}-2`,
          start: '17:00',
          end: '18:00',
          durationMinutes: 60,
          note: '這段時間留給你'
        }
      ],
      rejectedSuggestions: [],
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDailyLifePlan(newPlan);
    persistDailyPlan(newPlan);
  };

  const acceptLifeSuggestion = (suggestionId: string, customTime?: string) => {
    setDailyLifePlan((prev) => {
      const sugg = prev.suggestions.find((s) => s.id === suggestionId);
      if (!sugg) return prev;

      const scheduleTime = customTime || sugg.suggestedTime;
      const normalizedTime = scheduleTime === '全天' || scheduleTime === '隨時' ? '15:00' : scheduleTime;

      // Create new ScheduledItem in scheduledItems
      const newScheduledItem: ScheduledItem = {
        id: `sched-${Date.now()}`,
        dailyPlanId: prev.id,
        title: sugg.title,
        description: sugg.description,
        startTime: normalizedTime,
        duration: sugg.duration || '45 分鐘',
        type: sugg.type === 'meal' ? 'meal' : sugg.type === 'media' ? 'media' : sugg.isFreeTimeBlock ? 'rest' : 'task',
        source: 'suggestion_accepted',
        status: 'scheduled',
        aiNote: sugg.description,
        isFreeTime: sugg.isFreeTimeBlock,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedItems = [...(prev.scheduledItems || []), newScheduledItem].sort((a, b) =>
        (a.startTime || '').localeCompare(b.startTime || '')
      );

      // Add to timeline
      addTimeSlot({
        time: normalizedTime,
        title: sugg.title,
        category: sugg.type === 'meal' ? 'meal' : sugg.isFreeTimeBlock ? 'rest' : 'task',
        isFreeTime: sugg.isFreeTimeBlock,
        aiNote: sugg.description
      });

      const updatedPlan: DailyLifePlan = {
        ...prev,
        scheduledItems: updatedItems,
        suggestions: prev.suggestions.map((s) =>
          s.id === suggestionId ? { ...s, status: 'accepted', suggestedTime: scheduleTime } : s
        ),
        updatedAt: new Date().toISOString()
      };

      persistDailyPlan(updatedPlan);
      return updatedPlan;
    });
  };

  const toggleScheduledItem = (itemId: string) => {
    setDailyLifePlan((prev) => {
      const updatedItems = (prev.scheduledItems || []).map((it) => {
        if (it.id === itemId) {
          const newStatus = it.status === 'completed' ? 'scheduled' : 'completed';
          return {
            ...it,
            status: newStatus as any,
            updatedAt: new Date().toISOString()
          };
        }
        return it;
      });
      const updatedPlan = {
        ...prev,
        scheduledItems: updatedItems,
        updatedAt: new Date().toISOString()
      };
      persistDailyPlan(updatedPlan);
      return updatedPlan;
    });

    toggleTimeSlot(itemId);
  };

  const deleteScheduledItem = (itemId: string) => {
    setDailyLifePlan((prev) => {
      const target = (prev.scheduledItems || []).find((it) => it.id === itemId);
      // Protect fixed items from deletion!
      if (target?.isFixed) {
        return prev;
      }
      const updatedItems = (prev.scheduledItems || []).filter((it) => it.id !== itemId);
      const updatedPlan = {
        ...prev,
        scheduledItems: updatedItems,
        updatedAt: new Date().toISOString()
      };
      persistDailyPlan(updatedPlan);
      return updatedPlan;
    });
    deleteTimeSlot(itemId);
  };

  const addScheduledItem = (item: Partial<ScheduledItem> & { title: string; startTime: string }) => {
    setDailyLifePlan((prev) => {
      const newItem: ScheduledItem = {
        id: `sched-${Date.now()}`,
        dailyPlanId: prev.id,
        title: item.title,
        description: item.description,
        startTime: item.startTime,
        duration: item.duration || '45 分鐘',
        type: item.type || 'task',
        source: item.source || 'user_input',
        status: 'scheduled',
        aiNote: item.aiNote,
        isFixed: !!item.isFixed,
        isFreeTime: !!item.isFreeTime,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const updatedItems = [...(prev.scheduledItems || []), newItem].sort((a, b) =>
        (a.startTime || '').localeCompare(b.startTime || '')
      );
      const updatedPlan = {
        ...prev,
        scheduledItems: updatedItems,
        updatedAt: new Date().toISOString()
      };
      persistDailyPlan(updatedPlan);
      return updatedPlan;
    });

    addTimeSlot({
      time: item.startTime,
      title: item.title,
      category: item.type === 'meal' ? 'meal' : item.isFreeTime ? 'rest' : 'task',
      isFreeTime: item.isFreeTime,
      aiNote: item.aiNote
    });
  };

  const updateScheduledItemTime = (itemId: string, newTime: string) => {
    setDailyLifePlan((prev) => {
      const updatedItems = (prev.scheduledItems || []).map((it) => {
        if (it.id === itemId) {
          return {
            ...it,
            startTime: newTime,
            updatedAt: new Date().toISOString()
          };
        }
        return it;
      }).sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
      const updatedPlan = {
        ...prev,
        scheduledItems: updatedItems,
        updatedAt: new Date().toISOString()
      };
      persistDailyPlan(updatedPlan);
      return updatedPlan;
    });
  };

  const rejectLifeSuggestion = (suggestionId: string, reason?: string) => {
    setDailyLifePlan((prev) => {
      const sugg = prev.suggestions.find((s) => s.id === suggestionId);
      if (!sugg) return prev;

      const remaining = prev.suggestions.filter((s) => s.id !== suggestionId);
      return {
        ...prev,
        suggestions: remaining,
        rejectedSuggestions: [...prev.rejectedSuggestions, { ...sugg, status: 'rejected' }]
      };
    });
  };

  const replaceLifeSuggestion = (suggestionId: string) => {
    setDailyLifePlan((prev) => {
      const targetIndex = prev.suggestions.findIndex((s) => s.id === suggestionId);
      if (targetIndex === -1) return prev;

      const target = prev.suggestions[targetIndex];
      const alternatives: Partial<LifeSuggestion>[] = [
        {
          title: '泡一壺有桂花香氣的熱烏龍茶',
          description: '熱氣在茶盞間升起，小口啜飲，暖胃也安頓思緒。',
          categoryTag: '茶憩時光',
          source: 'long_term_preference',
          sourceLabel: '生活偏好'
        },
        {
          title: '聽一張喜歡的自然白噪音或爵士鋼琴',
          description: '背景輕柔低語，不佔據大腦，讓呼吸更均勻。',
          categoryTag: '音樂沈浸',
          source: 'long_term_preference',
          sourceLabel: '身心療癒'
        },
        {
          title: '捏捏手捏陶土或整理植物盆栽',
          description: '手掌接觸自然質地，將思緒從螢幕抽離。',
          categoryTag: '觸感創作',
          source: 'explicit_wish',
          sourceLabel: '陶藝想法沉降'
        }
      ];

      const alt = alternatives[Math.floor(Math.random() * alternatives.length)];
      const replacement: LifeSuggestion = {
        ...target,
        id: `ls-rep-${Date.now()}`,
        title: alt.title!,
        description: alt.description!,
        categoryTag: alt.categoryTag!,
        source: alt.source!,
        sourceLabel: alt.sourceLabel!,
        status: 'suggested'
      };

      const updated = [...prev.suggestions];
      updated[targetIndex] = replacement;

      return {
        ...prev,
        suggestions: updated
      };
    });
  };

  const rescheduleLifeSuggestion = (suggestionId: string, newTime: string) => {
    setDailyLifePlan((prev) => ({
      ...prev,
      suggestions: prev.suggestions.map((s) =>
        s.id === suggestionId ? { ...s, suggestedTime: newTime } : s
      )
    }));
  };

  const stashLifeSuggestionToIdeas = (suggestionId: string) => {
    const sugg = dailyLifePlan.suggestions.find((s) => s.id === suggestionId);
    if (sugg) {
      addIdea({
        title: sugg.title,
        description: sugg.description,
        category: '想做',
        urgency: 'low',
        interestLevel: 'high',
        preferredContext: '有餘裕與心情時'
      });
      rejectLifeSuggestion(suggestionId, '移至想法牆');
    }
  };

  const setDailyOpeningVibe = (vibe: string) => {
    generateDailyLifePlan(vibe);
  };

  useEffect(() => {
    const taipei = getTaipeiDateInfo();
    const lastSavedDate = localStorage.getItem(`${STORAGE_KEY}_last_taipei_date`);
    if (lastSavedDate && lastSavedDate !== taipei.dateKey) {
      resetDailyWorkspace(taipei.dateKey);
    } else {
      localStorage.setItem(`${STORAGE_KEY}_last_taipei_date`, taipei.dateKey);
    }

    // Check periodically every 30s if 00:00 rollover happened
    const interval = setInterval(() => {
      const currentTaipei = getTaipeiDateInfo();
      const recordedDate = localStorage.getItem(`${STORAGE_KEY}_last_taipei_date`);
      if (recordedDate && recordedDate !== currentTaipei.dateKey) {
        resetDailyWorkspace(currentTaipei.dateKey);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const acceptPastAiSuggestion = (id: string, targetTime = '16:00') => {
    const sugg = pastAiSuggestions.find((s) => s.id === id);
    if (!sugg) return;

    // Add to timeline
    addTimeSlot({
      time: targetTime,
      title: sugg.title,
      category: 'task',
      completed: false,
      aiNote: sugg.reason
    });

    // Mark as accepted
    setPastAiSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'accepted' } : s))
    );
  };

  const dismissPastAiSuggestion = (id: string) => {
    setPastAiSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'dismissed' } : s))
    );
  };

  // Contextual Reminders Actions
  const leavingPhrase = LEAVING_REMINDER_PHRASES[leavingPhraseIndex % LEAVING_REMINDER_PHRASES.length];

  const cycleLeavingPhrase = () => {
    setLeavingPhraseIndex((prev) => (prev + 1) % LEAVING_REMINDER_PHRASES.length);
  };

  const simulateLeaving = () => {
    setLifeContextStage('LEAVING');
    setIsChecklistDismissed(false);
    setLeavingPhraseIndex((prev) => (prev + 1) % LEAVING_REMINDER_PHRASES.length);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const resetChecklist = () => {
    setChecklistItems((prev) => prev.map((item) => ({ ...item, checked: false })));
    setIsChecklistDismissed(false);
  };

  const addChecklistItem = (name: string) => {
    if (!name.trim()) return;
    const newItem: LeavingChecklistItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      checked: false,
      order: checklistItems.length + 1,
      enabled: true,
      isDefault: false
    };
    setChecklistItems((prev) => [...prev, newItem]);
  };

  const deleteChecklistItem = (id: string) => {
    setChecklistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const editChecklistItem = (id: string, newName: string) => {
    if (!newName.trim()) return;
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName.trim() } : item))
    );
  };

  const toggleChecklistItemEnabled = (id: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const toggleScenarioRule = (ruleId: string) => {
    setScenarioRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const addTemporaryReminder = (name: string, reason?: string) => {
    if (!name.trim()) return;
    const tempItem: LeavingChecklistItem = {
      id: `temp-${Date.now()}`,
      name: name.trim(),
      checked: false,
      order: 99,
      enabled: true,
      isTemporary: true,
      isContextual: true,
      contextReason: reason || '單次情境提醒'
    };
    setTemporaryChecklistItems((prev) => [...prev, tempItem]);
  };

  // Compute active contextual checklist (strictly 1 to 5 items)
  const activeChecklist = React.useMemo<LeavingChecklistItem[]>(() => {
    // If short errand: minimal 3 items
    if (leavingContextScenario === 'short_errand') {
      const basicShort = checklistItems
        .filter((item) => ['item-phone', 'item-wallet', 'item-keys'].includes(item.id) && item.enabled)
        .map((item) => ({ ...item, checked: item.checked }));
      return basicShort;
    }

    // Standard base items
    const base = checklistItems
      .filter((item) => item.enabled)
      .map((item) => ({ ...item, checked: item.checked }));

    const contextualItems: LeavingChecklistItem[] = [];

    const isRuleActive = (trigger: 'rain' | 'hot_sun' | 'long_trip' | 'course_workshop' | 'photography') => {
      const rule = scenarioRules.find((r) => r.triggerContext === trigger);
      return rule ? rule.enabled : true;
    };

    if (leavingContextScenario === 'rainy_day' || (leavingContextScenario === 'auto' && weather.humidity > 65 && isRuleActive('rain'))) {
      contextualItems.push({
        id: 'ctx-rain-umbrella',
        name: '雨傘',
        checked: !!dynamicItemCheckedMap['ctx-rain-umbrella'],
        order: 10,
        enabled: true,
        isContextual: true,
        contextReason: '今日降雨機率較高，出門記得攜帶'
      });
    }

    if (leavingContextScenario === 'long_outing' || (leavingContextScenario === 'auto' && isRuleActive('long_trip'))) {
      contextualItems.push({
        id: 'ctx-power-bank',
        name: '行動電源與水壺',
        checked: !!dynamicItemCheckedMap['ctx-power-bank'],
        order: 11,
        enabled: true,
        isContextual: true,
        contextReason: '今天預計在外面待較長時間'
      });
    }

    if (leavingContextScenario === 'photo_walk' && isRuleActive('photography')) {
      contextualItems.push({
        id: 'ctx-camera',
        name: '相機與備用記憶卡',
        checked: !!dynamicItemCheckedMap['ctx-camera'],
        order: 13,
        enabled: true,
        isContextual: true,
        contextReason: '午後戶外光影攝影散步'
      });
    }

    // Merge temporary items
    const temps = temporaryChecklistItems.map((item) => ({
      ...item,
      checked: !!dynamicItemCheckedMap[item.id]
    }));

    // Combine and cap at 5 items strictly
    const combined = [...base, ...contextualItems, ...temps];
    return combined.slice(0, 5);
  }, [checklistItems, leavingContextScenario, scenarioRules, weather, dynamicItemCheckedMap, temporaryChecklistItems]);

  const toggleActiveChecklistItem = (id: string) => {
    if (id.startsWith('item-')) {
      toggleChecklistItem(id);
    } else {
      setDynamicItemCheckedMap((prev) => ({
        ...prev,
        [id]: !prev[id]
      }));
    }
  };

  const confirmAllChecklist = () => {
    // Mark base items checked
    setChecklistItems((prev) => prev.map((item) => ({ ...item, checked: true })));
    // Mark dynamic items checked
    const newMap: Record<string, boolean> = {};
    activeChecklist.forEach((item) => {
      newMap[item.id] = true;
    });
    setDynamicItemCheckedMap(newMap);
    // Gracefully dismiss leaving prompt
    setIsChecklistDismissed(true);
  };

  const recordWaterSip = () => {
    const now = Date.now();
    const todayKey = getTaipeiDateInfo().dateKey;
    setWaterReminder((prev) => {
      const isSameDay = prev.dateKey === todayKey;
      return {
        ...prev,
        dateKey: todayKey,
        lastRemindedAt: now,
        nextEligibleAt: now + 45 * 60 * 1000, // 45-minute calm cooldown
        sipCountToday: isSameDay ? prev.sipCountToday + 1 : 1,
        currentPhraseIndex: (prev.currentPhraseIndex + 1) % WATER_REMINDER_PHRASES.length
      };
    });
  };

  const pauseWaterReminderToday = () => {
    setWaterReminder((prev) => ({
      ...prev,
      pausedToday: true
    }));
  };

  const resumeWaterReminderToday = () => {
    setWaterReminder((prev) => ({
      ...prev,
      pausedToday: false,
      nextEligibleAt: 0
    }));
  };

  // Actions
  const updateEnergy = (val: number) => {
    setDailyPlan((prev) => ({ ...prev, energy: val }));
  };

  const updateMood = (val: number) => {
    setDailyPlan((prev) => ({ ...prev, mood: val }));
  };

  const updateTempo = (val: DayTempo) => {
    setDailyPlan((prev) => ({ ...prev, tempo: val }));
  };

  const toggleTimeSlot = (slotId: string) => {
    setDailyPlan((prev) => ({
      ...prev,
      timeline: prev.timeline.map((slot) =>
        slot.id === slotId ? { ...slot, completed: !slot.completed } : slot
      )
    }));
  };

  const addTimeSlot = (slot: Omit<TimeSlot, 'id'>) => {
    const newSlot: TimeSlot = {
      ...slot,
      id: `slot-${Date.now()}`
    };
    setDailyPlan((prev) => ({
      ...prev,
      timeline: [...prev.timeline, newSlot].sort((a, b) => a.time.localeCompare(b.time))
    }));
  };

  const deleteTimeSlot = (slotId: string) => {
    setDailyPlan((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((slot) => slot.id !== slotId)
    }));
  };

  const toggleTask = (taskId: string, isLeisure = false) => {
    if (isLeisure) {
      setDailyPlan((prev) => ({
        ...prev,
        leisureTasks: prev.leisureTasks.map((t) =>
          t.id === taskId
            ? { ...t, status: t.status === 'completed' ? 'todo' : 'completed' }
            : t
        )
      }));
    } else {
      setDailyPlan((prev) => ({
        ...prev,
        topImportantTasks: prev.topImportantTasks.map((t) =>
          t.id === taskId
            ? { ...t, status: t.status === 'completed' ? 'todo' : 'completed' }
            : t
        )
      }));
    }
  };

  const addTask = (task: Omit<TaskItem, 'id'>, isLeisure = false) => {
    const newTask: TaskItem = {
      ...task,
      id: `task-${Date.now()}`
    };
    if (isLeisure) {
      setDailyPlan((prev) => ({ ...prev, leisureTasks: [...prev.leisureTasks, newTask] }));
    } else {
      setDailyPlan((prev) => ({
        ...prev,
        topImportantTasks: [...prev.topImportantTasks, newTask]
      }));
    }
  };

  const deleteTask = (taskId: string) => {
    setDailyPlan((prev) => ({
      ...prev,
      topImportantTasks: prev.topImportantTasks.filter((t) => t.id !== taskId),
      leisureTasks: prev.leisureTasks.filter((t) => t.id !== taskId)
    }));
  };

  // Smart Reschedule
  const openRescheduleModal = (task: TaskItem) => {
    setRescheduleTarget(task);
  };

  const closeRescheduleModal = () => {
    setRescheduleTarget(null);
  };

  const applyReschedule = (
    taskId: string,
    action: 'tomorrow' | 'other_date' | 'breakdown' | 'keep' | 'convert_to_idea' | 'cancel',
    note?: string
  ) => {
    const target =
      dailyPlan.topImportantTasks.find((t) => t.id === taskId) ||
      dailyPlan.leisureTasks.find((t) => t.id === taskId);

    if (!target) {
      setRescheduleTarget(null);
      return;
    }

    if (action === 'convert_to_idea') {
      // Move to Ideas wall
      addIdea({
        title: target.title,
        description: note || '自今日未完成事項轉存的想法',
        category: '想做',
        urgency: 'low',
        interestLevel: 'high',
        preferredContext: '有充裕空檔時'
      });
      // Remove from today
      setDailyPlan((prev) => ({
        ...prev,
        topImportantTasks: prev.topImportantTasks.filter((t) => t.id !== taskId),
        leisureTasks: prev.leisureTasks.filter((t) => t.id !== taskId)
      }));
    } else if (action === 'cancel') {
      setDailyPlan((prev) => ({
        ...prev,
        topImportantTasks: prev.topImportantTasks.filter((t) => t.id !== taskId),
        leisureTasks: prev.leisureTasks.filter((t) => t.id !== taskId)
      }));
    } else if (action === 'breakdown') {
      // Split into two 15-minute micro actions
      const sub1: TaskItem = {
        ...target,
        id: `task-sub1-${Date.now()}`,
        title: `${target.title}（微步驟一：先做 10 分鐘）`,
        estimatedDuration: '10 分鐘',
        aiNotes: '拆小後心理阻力大幅降低。'
      };
      setDailyPlan((prev) => ({
        ...prev,
        topImportantTasks: prev.topImportantTasks.map((t) => (t.id === taskId ? sub1 : t)),
        leisureTasks: prev.leisureTasks.map((t) => (t.id === taskId ? sub1 : t))
      }));
    } else if (action === 'tomorrow' || action === 'other_date') {
      setDailyPlan((prev) => ({
        ...prev,
        topImportantTasks: prev.topImportantTasks.map((t) =>
          t.id === taskId ? { ...t, status: 'delayed', delayCount: (t.delayCount || 0) + 1 } : t
        ),
        leisureTasks: prev.leisureTasks.map((t) =>
          t.id === taskId ? { ...t, status: 'delayed', delayCount: (t.delayCount || 0) + 1 } : t
        )
      }));
    }

    setRescheduleTarget(null);
  };

  const submitDailyReview = (review: DailyReview) => {
    setDailyPlan((prev) => ({ ...prev, review }));
    setIsReviewModalOpen(false);

    const newMemory: MemoryItem = {
      id: `mem-${Date.now()}`,
      layer: 'fact',
      layerLabel: '事實',
      title: `${dailyPlan.dateStr} 每日生活回顧紀錄`,
      category: 'daily_review',
      content: `最開心的事：「${review.joyText || '平靜度過'}」；感受狀態：${review.moodState}。`,
      confidence: 0.95,
      evidenceCount: 1,
      evidenceNotes: '出自今日結束回顧表單。',
      status: 'active',
      lastConfirmedDate: '2026/09/10'
    };
    setMemories((prev) => [newMemory, ...prev]);
  };

  const justWrapUpToday = () => {
    submitDailyReview({
      completedText: '依循舒服步調完成了今天。',
      joyText: '保有屬於自己的空白時間。',
      tiredText: '無特別負擔。',
      tomorrowNotes: '順其自然。',
      moodState: '舒適',
      isDone: true,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
    });
  };

  const addIdea = (idea: Omit<IdeaItem, 'id' | 'createdAt' | 'suggestionCount' | 'status'>) => {
    const newIdea: IdeaItem = {
      ...idea,
      id: `idea-${Date.now()}`,
      createdAt: '2026.09.10',
      suggestionCount: 0,
      status: 'someday',
      aiScore: 80
    };
    setIdeas((prev) => [newIdea, ...prev]);
  };

  const scheduleIdeaToToday = (ideaId: string, customTime = '15:00') => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) return;

    addTask(
      {
        title: idea.title,
        type: (idea.category as any) || '想做',
        status: 'todo',
        importance: 2,
        estimatedDuration: '1 小時',
        preferredTime: customTime,
        source: `從想法牆排入（${idea.createdAt} 記錄）`,
        aiNotes: '今天下午剛好有空檔，輕鬆嘗試即可。'
      },
      true
    );

    setIdeas((prev) =>
      prev.map((i) => (i.id === ideaId ? { ...i, status: 'scheduled' } : i))
    );
    setActiveTab('today');
  };

  const deleteIdea = (ideaId: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== ideaId));
  };

  const updateGoalStatus = (id: string, status: GoalStatus) => {
    setGoalItems((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status, updatedAt: '2026.09.10' } : g))
    );
  };

  const updateMemoryStatus = (id: string, status: 'active' | 'superseded' | 'paused') => {
    setMemories((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const adjustMemoryConfidence = (id: string, newConfidence: number) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, confidence: newConfidence } : m))
    );
  };

  const handleRecommendationFeedback = (
    recId: string,
    action: '安排' | '看看' | '先不用' | '不再推薦'
  ) => {
    const targetRec = recommendations.find((r) => r.id === recId);
    if (!targetRec) return;

    if (action === '安排') {
      addTask(
        {
          title: targetRec.title,
          type: '想做',
          status: 'todo',
          importance: 2,
          estimatedDuration: targetRec.estimatedDuration,
          preferredTime: targetRec.suitableTime,
          source: '77 智慧推薦',
          aiNotes: targetRec.why
        },
        true
      );
      setRecommendations((prev) => prev.filter((r) => r.id !== recId));
      setActiveTab('today');
    } else if (action === '看看') {
      setActiveTab('ideas');
    } else if (action === '先不用') {
      setRecommendations((prev) =>
        prev.map((r) => (r.id === recId ? { ...r, status: 'declined' } : r))
      );
    } else if (action === '不再推薦') {
      setRecommendations((prev) => prev.filter((r) => r.id !== recId));
    }
  };

  const acceptTimeCapsule = () => {
    if (!timeCapsule) return;
    addIdea({
      title: timeCapsule.title,
      description: timeCapsule.quote,
      category: '想做',
      urgency: 'low',
      interestLevel: 'high',
      preferredContext: '悠閒的午後',
      aiScore: 90
    });
    setTimeCapsule(null);
    setActiveTab('ideas');
  };

  const dismissTimeCapsule = () => {
    setTimeCapsule(null);
  };

  const handleProposalAction = (messageId: string, option: ProposalActionOption) => {
    let currentProposal: SchedulingProposal | undefined;
    setChatMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId && msg.proposal) {
          currentProposal = msg.proposal;
          let newStatus: SchedulingProposal['status'] = 'accepted';
          if (option.type === 'save_idea') newStatus = 'stashed_as_idea';
          else if (option.type === 'reschedule_slot') newStatus = 'alternative_requested';
          else if (option.type === 'dismiss') newStatus = 'dismissed';
          return {
            ...msg,
            proposal: {
              ...msg.proposal,
              status: newStatus
            }
          };
        }
        return msg;
      })
    );

    if (!currentProposal) return;

    const timeStr = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });

    if (option.type === 'accept_today') {
      const slot = option.timeSlot || currentProposal.proposedTime || '16:00';
      addTask(
        {
          title: currentProposal.activityTitle,
          type: (currentProposal.category as any) || '想做',
          status: 'todo',
          importance: 2,
          estimatedDuration: `${Math.round((currentProposal.durationMinutes || 60) / 60 * 10) / 10}小時`,
          preferredTime: slot,
          source: currentProposal.sourceInfo?.sourceTitle
            ? `${currentProposal.sourceInfo.sourceTitle} (77 建議)`
            : '77 行程建議',
          sourceUrl: currentProposal.sourceInfo?.sourceUrl,
          aiNotes: currentProposal.reason
        },
        true
      );
      // Also add to timeline with source link
      addTimeSlot({
        time: slot,
        title: currentProposal.activityTitle,
        category: 'entertainment',
        completed: false,
        sourceUrl: currentProposal.sourceInfo?.sourceUrl,
        sourceTitle: currentProposal.sourceInfo?.sourceTitle
      });
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-confirm-${Date.now()}`,
          sender: 'assistant',
          messageTone: 'schedule_proposal',
          text: `已為你安排在今天 ${slot}。不用有壓力，當天隨時依你的步調調整。`,
          timestamp: timeStr
        }
      ]);
    } else if (option.type === 'accept_future') {
      const dateLabel = option.dateStr || currentProposal.proposedDate || '近期';
      const slot = option.timeSlot || currentProposal.proposedTime || '14:00';
      addTask(
        {
          title: currentProposal.activityTitle,
          type: (currentProposal.category as any) || '想做',
          status: 'todo',
          importance: 2,
          estimatedDuration: `${Math.round((currentProposal.durationMinutes || 60) / 60 * 10) / 10}小時`,
          preferredTime: `${dateLabel} ${slot}`,
          deadline: dateLabel,
          source: currentProposal.sourceInfo?.sourceTitle
            ? `${currentProposal.sourceInfo.sourceTitle} (77 預留)`
            : '77 預留時間建議',
          sourceUrl: currentProposal.sourceInfo?.sourceUrl,
          aiNotes: currentProposal.reason
        },
        false
      );
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-confirm-${Date.now()}`,
          sender: 'assistant',
          messageTone: 'schedule_proposal',
          text: `已為你預留在 ${dateLabel} ${slot}。前後留有充裕呼吸空間。`,
          timestamp: timeStr
        }
      ]);
    } else if (option.type === 'reschedule_slot') {
      const altProposal: SchedulingProposal = {
        id: `prop-alt-${Date.now()}`,
        scenario: 'custom_time',
        activityTitle: currentProposal.activityTitle,
        category: currentProposal.category,
        durationMinutes: currentProposal.durationMinutes,
        reason: '檢視了你近期的生活節奏，推薦以下兩個較從容的時段：',
        status: 'pending',
        actionOptions: [
          {
            id: 'alt-1',
            label: '安排明天 10:30',
            type: 'accept_future',
            dateStr: '明天',
            timeSlot: '10:30'
          },
          {
            id: 'alt-2',
            label: '安排週五 15:00',
            type: 'accept_future',
            dateStr: '週五',
            timeSlot: '15:00'
          },
          {
            id: 'alt-hold',
            label: '先放著',
            type: 'save_idea'
          }
        ]
      };
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-alt-${Date.now()}`,
          sender: 'assistant',
          messageTone: 'free_time_discovery',
          text: `好的，我重新找了更合適的時間。明天 10:30–12:00（上午專注）或是週五 15:00–16:30（午後慢調），你覺得哪一個比較舒服？`,
          timestamp: timeStr,
          proposal: altProposal
        }
      ]);
    } else if (option.type === 'save_idea') {
      addIdea({
        title: currentProposal.activityTitle,
        category: (currentProposal.category as any) || '想做',
        urgency: 'low',
        interestLevel: 'high',
        preferredContext: currentProposal.proposedDate || '有餘裕時',
        description: currentProposal.reason,
        aiScore: 85
      });
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-stash-${Date.now()}`,
          sender: 'assistant',
          messageTone: 'general',
          text: `好，我先幫你收在「想法牆」備存。等哪天想做、有完整餘裕時再來開啟。`,
          timestamp: timeStr
        }
      ]);
    } else if (option.type === 'dismiss') {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-dismiss-${Date.now()}`,
          sender: 'assistant',
          messageTone: 'general',
          text: `收到，我們先把它放下，專注在眼前自在的節奏。`,
          timestamp: timeStr
        }
      ]);
    }
  };

  const executeAiNoteAction = (action: NoteActionRecord) => {
    if (action.type === 'add') {
      if (action.location === 'today_schedule') {
        const slotTime = action.itemDetails || '16:00';
        addTimeSlot({
          time: slotTime,
          title: action.itemTitle,
          category: 'task',
          completed: false,
          aiNote: '77 依你的對話快速排入'
        });
      } else if (action.location === 'today_essential') {
        addTask({
          title: action.itemTitle,
          type: '必須做',
          status: 'todo',
          importance: 3,
          estimatedDuration: '30分鐘',
          source: '77 快速記下'
        }, false);
      } else if (action.location === 'ideas_wall') {
        addIdea({
          title: action.itemTitle,
          category: '想做',
          urgency: 'low',
          interestLevel: 'high',
          preferredContext: '有餘裕時',
          description: '77 為你存入想法牆備存'
        });
      } else {
        addTask({
          title: action.itemTitle,
          type: '想做',
          status: 'todo',
          importance: 1,
          estimatedDuration: '20分鐘',
          source: '77 快速記下'
        }, true);
      }
    } else if (action.type === 'delete') {
      if (action.itemId) {
        if (action.location === 'today_schedule') {
          deleteTimeSlot(action.itemId);
        } else if (action.location === 'ideas_wall') {
          deleteIdea(action.itemId);
        } else {
          deleteTask(action.itemId);
        }
      } else if (action.itemTitle) {
        const q = action.itemTitle.toLowerCase().trim();
        const matchedSlot = dailyPlan.timeline.find(s => s.title.toLowerCase().includes(q) || q.includes(s.title.toLowerCase()));
        if (matchedSlot) {
          deleteTimeSlot(matchedSlot.id);
          return;
        }
        const matchedEss = dailyPlan.topImportantTasks.find(t => t.title.toLowerCase().includes(q) || q.includes(t.title.toLowerCase()));
        if (matchedEss) {
          deleteTask(matchedEss.id);
          return;
        }
        const matchedLei = dailyPlan.leisureTasks.find(t => t.title.toLowerCase().includes(q) || q.includes(t.title.toLowerCase()));
        if (matchedLei) {
          deleteTask(matchedLei.id);
          return;
        }
        const matchedIdea = ideas.find(i => i.title.toLowerCase().includes(q) || q.includes(i.title.toLowerCase()));
        if (matchedIdea) {
          deleteIdea(matchedIdea.id);
          return;
        }
      }
    }
  };

  const undoAiNoteAction = (action: NoteActionRecord) => {
    const timeStr = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
    if (action.type === 'add') {
      const q = action.itemTitle.toLowerCase().trim();
      if (action.location === 'today_schedule') {
        const found = dailyPlan.timeline.find(s => s.title.toLowerCase().includes(q));
        if (found) deleteTimeSlot(found.id);
      } else if (action.location === 'ideas_wall') {
        const found = ideas.find(i => i.title.toLowerCase().includes(q));
        if (found) deleteIdea(found.id);
      } else {
        const found = [...dailyPlan.topImportantTasks, ...dailyPlan.leisureTasks].find(t => t.title.toLowerCase().includes(q));
        if (found) deleteTask(found.id);
      }
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-undo-${Date.now()}`,
          sender: 'assistant',
          messageTone: 'general',
          text: `已為你復原操作，從【${action.locationLabel}】中移除了「${action.itemTitle}」。`,
          timestamp: timeStr
        }
      ]);
    } else if (action.type === 'delete') {
      if (action.location === 'today_schedule') {
        addTimeSlot({
          time: action.itemDetails || '16:00',
          title: action.itemTitle,
          category: 'task',
          completed: false,
          aiNote: '已復原此項目'
        });
      } else if (action.location === 'today_essential') {
        addTask({
          title: action.itemTitle,
          type: '必須做',
          status: 'todo',
          importance: 3,
          estimatedDuration: '30分鐘',
          source: '已復原項目'
        }, false);
      } else if (action.location === 'ideas_wall') {
        addIdea({
          title: action.itemTitle,
          category: '想做',
          urgency: 'low',
          interestLevel: 'high',
          preferredContext: '有餘裕時',
          description: '已復原項目'
        });
      } else {
        addTask({
          title: action.itemTitle,
          type: '想做',
          status: 'todo',
          importance: 1,
          estimatedDuration: '20分鐘',
          source: '已復原項目'
        }, true);
      }
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-undo-${Date.now()}`,
          sender: 'assistant',
          messageTone: 'general',
          text: `已為你復原操作，已將「${action.itemTitle}」放回【${action.locationLabel}】。`,
          timestamp: timeStr
        }
      ]);
    }
  };

  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    const trimmed = text.trim();
    const isDeleteRequest =
      trimmed.includes('刪除') ||
      trimmed.includes('刪掉') ||
      trimmed.includes('移除') ||
      trimmed.includes('取消') ||
      trimmed.includes('拿掉') ||
      trimmed.includes('不要了');

    const isAddRequest =
      trimmed.includes('幫我記') ||
      trimmed.includes('幫我加') ||
      trimmed.includes('新增記事') ||
      trimmed.includes('加記事') ||
      trimmed.includes('記一下') ||
      trimmed.includes('加到必要') ||
      trimmed.includes('加到重要') ||
      trimmed.includes('加到想法牆') ||
      trimmed.includes('加到靈感') ||
      trimmed.includes('加到時間軸') ||
      trimmed.includes('加到行程') ||
      trimmed.startsWith('記事：') ||
      trimmed.startsWith('記：') ||
      trimmed.startsWith('新增：');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatMessages.map((m) => ({ sender: m.sender, text: m.text })),
          userState: {
            energy: dailyPlan.energy,
            mood: dailyPlan.mood,
            tempo: dailyPlan.tempo,
            date: dailyPlan.dateStr,
            timeOfDay
          },
          todaySchedule: dailyPlan.timeline.map((t) => `${t.time} ${t.title}`),
          activeContentObject
        })
      });

      const data = await response.json();

      if (data.activeContentObject) {
        setActiveContentObject(data.activeContentObject);
      } else if (data.clearActiveContentObject) {
        setActiveContentObject(null);
      }

      // Handle AI conversation schedule parsing & persistence
      if (data.scheduleAction) {
        if (data.scheduleAction.updatedPlan) {
          setDailyLifePlan(data.scheduleAction.updatedPlan);
          setLocalCachedPlan(data.scheduleAction.updatedPlan);
        }
        if (data.scheduleAction.items && Array.isArray(data.scheduleAction.items)) {
          data.scheduleAction.items.forEach((it: any) => {
            addTimeSlot({
              time: it.startTime || '15:00',
              title: it.title,
              category: it.type === 'meal' ? 'meal' : 'task',
              aiNote: it.description || 'AI 對話排入'
            });
          });
        }
      }

      let noteActionRecord: NoteActionRecord | undefined;

      // Check if user requested delete and execute it directly in state
      if (isDeleteRequest) {
        const query = trimmed
          .replace(/^(幫我|請幫我|麻煩幫我|可以幫我)?(把|將)?/, '')
          .replace(/(從清單|從時間軸|從今天|從想法牆|從必要事項|從待辦)?/, '')
          .replace(/(刪除|刪掉|移除|取消|拿掉|不要了)$/, '')
          .replace(/^(刪除|刪掉|移除|取消|拿掉)/, '')
          .replace(/^(記事|行程|事項)[:：]?/, '')
          .trim()
          .toLowerCase();

        // 1. Check timeline
        const foundSlot = dailyPlan.timeline.find(s => s.title.toLowerCase().includes(query) || (query && query.includes(s.title.toLowerCase())));
        if (foundSlot) {
          deleteTimeSlot(foundSlot.id);
          noteActionRecord = {
            type: 'delete',
            location: 'today_schedule',
            locationLabel: `今日時間軸 · SCHEDULE (${foundSlot.time})`,
            targetTab: 'today',
            itemTitle: foundSlot.title,
            itemDetails: foundSlot.time,
            itemId: foundSlot.id,
            previousItem: foundSlot,
            timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
          };
        } else {
          // 2. Check essential
          const foundEss = dailyPlan.topImportantTasks.find(t => t.title.toLowerCase().includes(query) || (query && query.includes(t.title.toLowerCase())));
          if (foundEss) {
            deleteTask(foundEss.id);
            noteActionRecord = {
              type: 'delete',
              location: 'today_essential',
              locationLabel: '今日工作區 · 必要事項 (Essential)',
              targetTab: 'today',
              itemTitle: foundEss.title,
              itemId: foundEss.id,
              previousItem: foundEss,
              timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
            };
          } else {
            // 3. Check leisure
            const foundLei = dailyPlan.leisureTasks.find(t => t.title.toLowerCase().includes(query) || (query && query.includes(t.title.toLowerCase())));
            if (foundLei) {
              deleteTask(foundLei.id);
              noteActionRecord = {
                type: 'delete',
                location: 'today_leisure',
                locationLabel: '今日工作區 · 有餘裕時想做',
                targetTab: 'today',
                itemTitle: foundLei.title,
                itemId: foundLei.id,
                previousItem: foundLei,
                timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
              };
            } else {
              // 4. Check ideas
              const foundIdea = ideas.find(i => i.title.toLowerCase().includes(query) || (query && query.includes(i.title.toLowerCase())));
              if (foundIdea) {
                deleteIdea(foundIdea.id);
                noteActionRecord = {
                  type: 'delete',
                  location: 'ideas_wall',
                  locationLabel: '想法牆 · 想做的事',
                  targetTab: 'ideas',
                  itemTitle: foundIdea.title,
                  itemId: foundIdea.id,
                  previousItem: foundIdea,
                  timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
                };
              }
            }
          }
        }
      } else if (isAddRequest || data.noteAction?.type === 'add') {
        // Direct addition handling
        let targetLoc: 'today_schedule' | 'today_essential' | 'today_leisure' | 'ideas_wall' = 'today_leisure';
        let locLabel = '今日工作區 · 有餘裕時想做';
        let targetTab: 'today' | 'ideas' = 'today';
        let timeSlot = '';

        const timeMatch = trimmed.match(/(\d{1,2}[:：]\d{2}|[上下]午\s*\d{1,2}\s*點?|晚上\s*\d{1,2}\s*點?|\d{1,2}\s*點)/);
        if (timeMatch) {
          targetLoc = 'today_schedule';
          timeSlot = timeMatch[1].replace('：', ':');
          locLabel = `今日時間軸 · SCHEDULE (${timeSlot})`;
        } else if (trimmed.includes('必要') || trimmed.includes('重要') || trimmed.includes('必須')) {
          targetLoc = 'today_essential';
          locLabel = '今日工作區 · 必要事項 (Essential)';
        } else if (trimmed.includes('想法牆') || trimmed.includes('想法') || trimmed.includes('靈感') || trimmed.includes('以後想')) {
          targetLoc = 'ideas_wall';
          locLabel = '想法牆 · 想做的事';
          targetTab = 'ideas';
        }

        const itemTitle = data.noteAction?.itemTitle || trimmed
          .replace(/^(幫我|請幫我|麻煩幫我)?(記一下|記|加一下|加|新增記事|加記事|新增|寫下)/, '')
          .replace(/^(到必要事項|到重要事項|到時間軸|到行程|到想法牆|到靈感牆|到今天)?[:：]?/, '')
          .replace(/^(記事|項目)[:：]?/, '')
          .trim() || trimmed;

        if (targetLoc === 'today_schedule') {
          addTimeSlot({
            time: timeSlot || '16:00',
            title: itemTitle,
            category: 'task',
            completed: false,
            aiNote: '77 快速記下'
          });
        } else if (targetLoc === 'today_essential') {
          addTask({
            title: itemTitle,
            type: '必須做',
            status: 'todo',
            importance: 3,
            estimatedDuration: '30分鐘',
            source: '77 快速記下'
          }, false);
        } else if (targetLoc === 'ideas_wall') {
          addIdea({
            title: itemTitle,
            category: '想做',
            urgency: 'low',
            interestLevel: 'high',
            preferredContext: '有餘裕時',
            description: '77 為你收在身邊備存'
          });
        } else {
          addTask({
            title: itemTitle,
            type: '想做',
            status: 'todo',
            importance: 1,
            estimatedDuration: '20分鐘',
            source: '77 快速記下'
          }, true);
        }

        noteActionRecord = {
          type: 'add',
          location: targetLoc,
          locationLabel: locLabel,
          targetTab,
          itemTitle,
          itemDetails: timeSlot || undefined,
          timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
        };
      }

      // If server returned data.noteAction and we haven't executed locally, execute it
      if (data.noteAction && !noteActionRecord) {
        executeAiNoteAction(data.noteAction);
        noteActionRecord = {
          ...data.noteAction,
          timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
        };
      }

      let replyText = data.reply;
      if (noteActionRecord) {
        if (noteActionRecord.type === 'delete') {
          replyText = `已幫你自【${noteActionRecord.locationLabel}】中刪除了「${noteActionRecord.itemTitle}」。工作區已保持清爽。`;
        } else if (noteActionRecord.type === 'add') {
          replyText = `已幫你將「${noteActionRecord.itemTitle}」加入到【${noteActionRecord.locationLabel}】。隨時可在該處查看與調整。`;
        }
      }

      const aiReplyMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText || '收到你的話了。我們一起讓今天的生活舒服一點。',
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        messageTone: data.messageTone || (data.proposal ? 'schedule_proposal' : 'general'),
        urlCard: data.urlCard,
        activeContentObject: data.activeContentObject,
        noteAction: noteActionRecord,
        proposal: data.proposal
          ? {
              ...data.proposal,
              id: `prop-${Date.now()}`,
              status: 'pending'
            }
          : undefined
      };

      setChatMessages((prev) => [...prev, aiReplyMsg]);
    } catch (err) {
      console.warn('Chat service notice: engaging smart local companion:', err);
      let reply = `收到你的話了。今天按你舒服的步調走，隨時跟我聊聊，我們一起替生活保留清爽的呼吸感。`;
      let proposal: SchedulingProposal | undefined;
      let noteActionRecord: NoteActionRecord | undefined;
      let messageTone: ChatMessage['messageTone'] = 'general';

      if (isDeleteRequest) {
        const query = trimmed
          .replace(/^(幫我|請幫我|麻煩幫我|可以幫我)?(把|將)?/, '')
          .replace(/(從清單|從時間軸|從今天|從想法牆|從必要事項|從待辦)?/, '')
          .replace(/(刪除|刪掉|移除|取消|拿掉|不要了)$/, '')
          .replace(/^(刪除|刪掉|移除|取消|拿掉)/, '')
          .replace(/^(記事|行程|事項)[:：]?/, '')
          .trim()
          .toLowerCase();

        const foundSlot = dailyPlan.timeline.find(s => s.title.toLowerCase().includes(query) || (query && query.includes(s.title.toLowerCase())));
        if (foundSlot) {
          deleteTimeSlot(foundSlot.id);
          noteActionRecord = {
            type: 'delete',
            location: 'today_schedule',
            locationLabel: `今日時間軸 · SCHEDULE (${foundSlot.time})`,
            targetTab: 'today',
            itemTitle: foundSlot.title,
            itemDetails: foundSlot.time,
            itemId: foundSlot.id,
            previousItem: foundSlot,
            timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
          };
          reply = `已幫你自【${noteActionRecord.locationLabel}】中刪除了「${foundSlot.title}」。`;
        } else {
          const foundEss = dailyPlan.topImportantTasks.find(t => t.title.toLowerCase().includes(query) || (query && query.includes(t.title.toLowerCase())));
          if (foundEss) {
            deleteTask(foundEss.id);
            noteActionRecord = {
              type: 'delete',
              location: 'today_essential',
              locationLabel: '今日工作區 · 必要事項 (Essential)',
              targetTab: 'today',
              itemTitle: foundEss.title,
              itemId: foundEss.id,
              previousItem: foundEss,
              timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
            };
            reply = `已幫你自【${noteActionRecord.locationLabel}】中刪除了「${foundEss.title}」。`;
          } else {
            const foundLei = dailyPlan.leisureTasks.find(t => t.title.toLowerCase().includes(query) || (query && query.includes(t.title.toLowerCase())));
            if (foundLei) {
              deleteTask(foundLei.id);
              noteActionRecord = {
                type: 'delete',
                location: 'today_leisure',
                locationLabel: '今日工作區 · 有餘裕時想做',
                targetTab: 'today',
                itemTitle: foundLei.title,
                itemId: foundLei.id,
                previousItem: foundLei,
                timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
              };
              reply = `已幫你自【${noteActionRecord.locationLabel}】中刪除了「${foundLei.title}」。`;
            } else {
              const foundIdea = ideas.find(i => i.title.toLowerCase().includes(query) || (query && query.includes(i.title.toLowerCase())));
              if (foundIdea) {
                deleteIdea(foundIdea.id);
                noteActionRecord = {
                  type: 'delete',
                  location: 'ideas_wall',
                  locationLabel: '想法牆 · 想做的事',
                  targetTab: 'ideas',
                  itemTitle: foundIdea.title,
                  itemId: foundIdea.id,
                  previousItem: foundIdea,
                  timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
                };
                reply = `已幫你自【${noteActionRecord.locationLabel}】中刪除了「${foundIdea.title}」。`;
              } else {
                reply = `我在今日時間軸、待辦與想法牆裡沒有找到與「${query || '指定事項'}」完全相符的記錄。你目前有這些項目：${dailyPlan.timeline.map(s => s.title).concat(dailyPlan.topImportantTasks.map(t => t.title)).slice(0, 3).join('、')}。你想刪除哪一項呢？`;
              }
            }
          }
        }
      } else if (isAddRequest) {
        let targetLoc: 'today_schedule' | 'today_essential' | 'today_leisure' | 'ideas_wall' = 'today_leisure';
        let locLabel = '今日工作區 · 有餘裕時想做';
        let targetTab: 'today' | 'ideas' = 'today';
        let timeSlot = '';

        const timeMatch = trimmed.match(/(\d{1,2}[:：]\d{2}|[上下]午\s*\d{1,2}\s*點?|晚上\s*\d{1,2}\s*點?|\d{1,2}\s*點)/);
        if (timeMatch) {
          targetLoc = 'today_schedule';
          timeSlot = timeMatch[1].replace('：', ':');
          locLabel = `今日時間軸 · SCHEDULE (${timeSlot})`;
        } else if (trimmed.includes('必要') || trimmed.includes('重要') || trimmed.includes('必須')) {
          targetLoc = 'today_essential';
          locLabel = '今日工作區 · 必要事項 (Essential)';
        } else if (trimmed.includes('想法牆') || trimmed.includes('想法') || trimmed.includes('靈感') || trimmed.includes('以後想')) {
          targetLoc = 'ideas_wall';
          locLabel = '想法牆 · 想做的事';
          targetTab = 'ideas';
        }

        const itemTitle = trimmed
          .replace(/^(幫我|請幫我|麻煩幫我)?(記一下|記|加一下|加|新增記事|加記事|新增|寫下)/, '')
          .replace(/^(到必要事項|到重要事項|到時間軸|到行程|到想法牆|到靈感牆|到今天)?[:：]?/, '')
          .replace(/^(記事|項目)[:：]?/, '')
          .trim() || trimmed;

        if (targetLoc === 'today_schedule') {
          addTimeSlot({
            time: timeSlot || '16:00',
            title: itemTitle,
            category: 'task',
            completed: false,
            aiNote: '77 快速記下'
          });
        } else if (targetLoc === 'today_essential') {
          addTask({
            title: itemTitle,
            type: '必須做',
            status: 'todo',
            importance: 3,
            estimatedDuration: '30分鐘',
            source: '77 快速記下'
          }, false);
        } else if (targetLoc === 'ideas_wall') {
          addIdea({
            title: itemTitle,
            category: '想做',
            urgency: 'low',
            interestLevel: 'high',
            preferredContext: '有餘裕時',
            description: '77 為你存入想法牆備存'
          });
        } else {
          addTask({
            title: itemTitle,
            type: '想做',
            status: 'todo',
            importance: 1,
            estimatedDuration: '20分鐘',
            source: '77 快速記下'
          }, true);
        }

        noteActionRecord = {
          type: 'add',
          location: targetLoc,
          locationLabel: locLabel,
          targetTab,
          itemTitle,
          itemDetails: timeSlot || undefined,
          timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
        };
        reply = `已幫你將「${itemTitle}」加入到【${locLabel}】。隨時可以在該處查看與調整。`;
      } else if (trimmed.includes('學陶藝') || trimmed.includes('以後想學') || trimmed.includes('想學')) {
        reply = `可以，我先幫你記著。這比較像是一個之後想探索的興趣，目前不用急著排進行程。`;
        messageTone = 'preference_memorized';
        proposal = {
          id: `prop-d-${Date.now()}`,
          scenario: 'long_term_wish',
          activityTitle: trimmed.replace(/^(我|最近|以後)?(想學|想)/, '').trim() || '新興趣探索',
          category: '想學',
          durationMinutes: 60,
          reason: '屬於有餘裕時的探索清單，先收在身邊慢慢醞釀即可。',
          status: 'pending',
          actionOptions: [
            { id: 'opt-idea', label: '加入想做的事', type: 'save_idea' },
            { id: 'opt-time', label: '找近期時間', type: 'reschedule_slot' }
          ]
        };
      } else if (trimmed.includes('買洗髮精') || trimmed.includes('買咖啡豆') || (trimmed.includes('買') && trimmed.length < 12)) {
        reply = `可以，你今天 18:00 左右剛好會經過附近，要不要順便放進今天的行程？`;
        messageTone = 'schedule_proposal';
        proposal = {
          id: `prop-e-${Date.now()}`,
          scenario: 'small_chore',
          activityTitle: trimmed.replace(/^(我|今天|等等|最近)?(想買|想去買|想|要買)/, '').trim() || '採買生活雜物',
          category: '想買',
          proposedTime: '18:00',
          proposedDate: '今天',
          durationMinutes: 20,
          reason: '傍晚外出順路採買約 15–20 分鐘，不額外耗費心力。',
          status: 'pending',
          actionOptions: [
            { id: 'opt-today', label: '加入今天 18:00', type: 'accept_today', timeSlot: '18:00' },
            { id: 'opt-alt', label: '其他時間', type: 'reschedule_slot' },
            { id: 'opt-stash', label: '先放著', type: 'save_idea' }
          ]
        };
      } else if (trimmed.includes('展覽') || trimmed.includes('看展') || trimmed.includes('看電影') || trimmed.includes('爬山')) {
        reply = `你提到想去看展覽。週六下午目前比較空，如果預留 3 小時（含移動與慢慢觀賞），我會比較建議放在 14:00–17:00。要不要安排？`;
        messageTone = 'schedule_proposal';
        proposal = {
          id: `prop-b-${Date.now()}`,
          scenario: 'schedule_future',
          activityTitle: trimmed.includes('展覽') ? '看展覽' : '外出體驗',
          category: '想體驗',
          proposedTime: '14:00',
          proposedDate: '週六',
          durationMinutes: 180,
          reason: '週六下午空白時間充裕，節奏不急躁，能完整沉浸感受。',
          status: 'pending',
          actionOptions: [
            { id: 'opt-sat', label: '安排週六 14:00', type: 'accept_future', dateStr: '週六', timeSlot: '14:00' },
            { id: 'opt-other', label: '看看其他時間', type: 'reschedule_slot' },
            { id: 'opt-hold', label: '先放著', type: 'save_idea' }
          ]
        };
      } else if (trimmed.includes('硬塞') || trimmed.includes('寫企劃') || trimmed.includes('大掃除') || dailyPlan.timeline.length >= 6) {
        reply = `這件事我可以幫你安排，但今天已經不少事情了。我比較不建議再塞進今天。明天下午有一段比較完整的空檔，要不要放到明天？`;
        messageTone = 'reminder';
        proposal = {
          id: `prop-c-${Date.now()}`,
          scenario: 'overload_warn',
          activityTitle: trimmed.replace(/^(我|今天)?(想|要|打算)/, '').trim() || '延伸事項',
          category: '想做',
          proposedTime: '14:30',
          proposedDate: '明天',
          durationMinutes: 90,
          reason: '今日節奏已飽滿，保留晚間心理留白有助於恢復元氣。',
          status: 'pending',
          actionOptions: [
            { id: 'opt-tomorrow', label: '安排明天', type: 'accept_future', dateStr: '明天', timeSlot: '14:30' },
            { id: 'opt-alt-c', label: '看看其他時間', type: 'reschedule_slot' },
            { id: 'opt-hold-c', label: '先放著', type: 'save_idea' }
          ]
        };
      } else if (trimmed.includes('整理房間') || trimmed.includes('整理') || trimmed.includes('今天想') || trimmed.includes('我想')) {
        reply = `可以。你今天 16:00–18:00 目前沒有安排，如果抓 1.5 小時，這件事可以放在 16:00 開始。要不要直接加入今天行程？`;
        messageTone = 'schedule_proposal';
        proposal = {
          id: `prop-a-${Date.now()}`,
          scenario: 'schedule_today',
          activityTitle: trimmed.replace(/^(我|今天|等等|最近)?(想|想去|想把|要去)/, '').trim() || '生活事項',
          category: '想做',
          proposedTime: '16:00',
          proposedDate: '今天',
          durationMinutes: 90,
          reason: '16:00–18:00 為純粹自由留白時段，安排 1.5 小時不壓縮晚餐放鬆。',
          status: 'pending',
          actionOptions: [
            { id: 'opt-today-a', label: '安排今天 16:00', type: 'accept_today', timeSlot: '16:00' },
            { id: 'opt-alt-a', label: '換個時間', type: 'reschedule_slot' },
            { id: 'opt-hold-a', label: '先放著', type: 'save_idea' }
          ]
        };
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          messageTone,
          proposal,
          noteAction: noteActionRecord,
          timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <LifeContext.Provider
      value={{
        activeTab,
        setActiveTab,
        taipeiTimeStr,
        taipeiDateStr,
        taipeiDayOfWeek,
        timeOfDay,
        timeOfDayText,
        timeAtmosphereQuote,
        simulatedPeriod,
        setSimulatedPeriod,
        weather,
        userProfile,
        dailyPlan,
        updateEnergy,
        updateMood,
        updateTempo,
        toggleTimeSlot,
        addTimeSlot,
        deleteTimeSlot,
        toggleTask,
        addTask,
        deleteTask,
        rescheduleTarget,
        openRescheduleModal,
        closeRescheduleModal,
        applyReschedule,
        submitDailyReview,
        justWrapUpToday,
        weeklyPlan,
        monthlyPlan,
        yearlyPlan,
        goalCascades,
        goalItems,
        updateGoalStatus,
        ideas,
        addIdea,
        scheduleIdeaToToday,
        deleteIdea,
        memories,
        behaviorPatterns,
        updateMemoryStatus,
        adjustMemoryConfidence,
        recommendations,
        handleRecommendationFeedback,
        timeCapsule,
        acceptTimeCapsule,
        dismissTimeCapsule,
        newsItems,
        threadsPosts,
        threadsTopics,
        eventClusters,
        threadsHotItems,
        chatMessages,
        isChatOpen,
        setIsChatOpen,
        isAiLoading,
        sendChatMessage,
        handleProposalAction,
        undoAiNoteAction,
        disturbanceMode,
        setDisturbanceMode,
        isReviewModalOpen,
        setIsReviewModalOpen,
        isNewItemModalOpen,
        setIsNewItemModalOpen,
        lifeContextStage,
        setLifeContextStage,
        simulateLeaving,
        leavingContextScenario,
        setLeavingContextScenario,
        scenarioRules,
        toggleScenarioRule,
        activeChecklist,
        toggleActiveChecklistItem,
        confirmAllChecklist,
        addTemporaryReminder,
        checklistItems,
        toggleChecklistItem,
        resetChecklist,
        addChecklistItem,
        deleteChecklistItem,
        editChecklistItem,
        toggleChecklistItemEnabled,
        leavingPhrase,
        cycleLeavingPhrase,
        isChecklistDismissed,
        setIsChecklistDismissed,
        waterReminder,
        recordWaterSip,
        pauseWaterReminderToday,
        resumeWaterReminderToday,
        leavingReminderEnabled,
        setLeavingReminderEnabled,
        isChecklistSettingsOpen,
        setIsChecklistSettingsOpen,
        pastAiSuggestions,
        historicalDailyPlans,
        resetDailyWorkspace,
        acceptPastAiSuggestion,
        dismissPastAiSuggestion,
        taipeiDateInfo,
        dailyLifePlan,
        generateDailyLifePlan,
        acceptLifeSuggestion,
        rejectLifeSuggestion,
        replaceLifeSuggestion,
        rescheduleLifeSuggestion,
        stashLifeSuggestionToIdeas,
        setDailyOpeningVibe,
        toggleScheduledItem,
        deleteScheduledItem,
        addScheduledItem,
        updateScheduledItemTime
      }}
    >
      {children}
    </LifeContext.Provider>
  );
};

export const useLife = () => {
  const context = useContext(LifeContext);
  if (!context) {
    throw new Error('useLife must be used within a LifeProvider');
  }
  return context;
};
