import {
  DailyPlanState,
  DailyLifePlan,
  WeeklyPlanState,
  MonthlyPlanState,
  YearlyPlanState,
  GoalCascade,
  GoalItem,
  IdeaItem,
  MemoryItem,
  AIRecommendation,
  TimeCapsuleGift,
  UserProfile,
  WeatherInfo,
  NewsItem,
  ThreadsPost,
  ThreadsTopic,
  CurrentEventCluster,
  BehaviorPattern,
  ThreadsHotItem,
  ContextScenarioRule
} from './types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-1',
  name: 'Kyu',
  handle: 'vicchiiikyu',
  timezone: 'Asia/Taipei',
  city: '台北',
  lifeMotto: '不把行程塞滿，生活品質與心靈節奏第一',
  energyBaseline: '午後 14:00 專注度最佳，早晨溫和啟動',
  preferredWakeTime: '07:30',
  preferredRestTime: '23:30'
};

export const INITIAL_WEATHER: WeatherInfo = {
  city: '台北市',
  temp: 26,
  condition: '微風陰天',
  conditionDescription: '涼爽宜人，午後偶有微光，無強烈日曬',
  humidity: 68,
  airQuality: '良好 AQI 32',
  wind: '東北微風 2 級',
  clothingSuggestion: '舒適亞麻襯衫或薄長袖，出門攜帶薄罩衫',
  sunsetTime: '18:08'
};

export const INITIAL_DAILY_PLAN: DailyPlanState = {
  dateStr: '2026.09.10',
  dateNumber: '9.10',
  dayOfWeek: 'Thursday',
  dailyQuote: '今天不用急著完成所有事情。',
  subQuote: '有幾件事情需要處理，其他時間可以留給自己。',
  energy: 4,
  mood: 4,
  tempo: '悠閒',
  freeTimeHours: 4.5,
  timeline: [
    {
      id: 't-1',
      time: '09:00',
      title: '手沖深焙咖啡，確認今日步調',
      category: 'routine',
      durationMinutes: 45,
      completed: true,
      location: '自宅廚房'
    },
    {
      id: 't-2',
      time: '10:00',
      title: '外出提報職訓審查附件',
      category: 'fixed',
      durationMinutes: 90,
      completed: true,
      aiNote: '早上精神飽滿時先處理完，午後就不會有心頭負擔。',
      location: '大安區公所'
    },
    {
      id: 't-3',
      time: '12:00',
      title: '清淡野菜溫麵',
      category: 'meal',
      durationMinutes: 60,
      completed: false,
      location: '常去的小麵店'
    },
    {
      id: 't-4',
      time: '13:00',
      title: '自由時間（保留留白）',
      category: 'free',
      isFreeTime: true,
      durationMinutes: 90,
      aiNote: '這段時間請盡量不要安排任何任務，留給自己發呆、看書或隨意散步。',
      completed: false
    },
    {
      id: 't-5',
      time: '14:30',
      title: '陶藝小盤素坯塑形（想做的事）',
      category: 'task',
      durationMinutes: 90,
      aiNote: '下午心流最順暢，不計較成品精密度，享受手作觸感即可。',
      completed: false,
      location: '工作室陽台'
    },
    {
      id: 't-6',
      time: '16:30',
      title: '傍晚巷弄散步、超商取件',
      category: 'entertainment',
      durationMinutes: 45,
      aiNote: '走動換氣，順路完成生活小雜事。',
      completed: false
    },
    {
      id: 't-7',
      time: '18:30',
      title: '晚飯與放鬆時間',
      category: 'meal',
      durationMinutes: 75,
      completed: false
    },
    {
      id: 't-8',
      time: '20:30',
      title: '自由沉澱・翻閱插畫選集',
      category: 'rest',
      isFreeTime: true,
      durationMinutes: 90,
      completed: false
    }
  ],
  topImportantTasks: [
    {
      id: 'task-1',
      title: '確認職訓申請文件已上傳完畢',
      type: '必須做',
      status: 'completed',
      importance: 3,
      estimatedDuration: '30 分鐘',
      actualDuration: '25 分鐘',
      deadline: '今日 12:00 前',
      completedAt: '10:35',
      energyRequired: 'medium',
      aiNotes: '已順利於早晨完成，今日無其他緊迫公事。'
    },
    {
      id: 'task-2',
      title: '超商取回新訂的亞麻圍裙',
      type: '應該做',
      status: 'todo',
      importance: 2,
      estimatedDuration: '15 分鐘',
      preferredTime: '傍晚散步時',
      energyRequired: 'low',
      source: '日常待辦'
    },
    {
      id: 'task-3',
      title: '回覆房東關於修繕水管的確認簡訊',
      type: '應該做',
      status: 'todo',
      importance: 2,
      estimatedDuration: '5 分鐘',
      preferredTime: '下午空檔',
      energyRequired: 'low'
    }
  ],
  leisureTasks: [
    {
      id: 'task-4',
      title: '陶瓷小盤捏塑（隨心進行）',
      type: '想做',
      status: 'todo',
      importance: 2,
      estimatedDuration: '60 分鐘',
      preferredTime: '今日午後',
      source: '年度創作心願沉降',
      aiNotes: '不趕進度，捏出形體即可。'
    },
    {
      id: 'task-5',
      title: '泡一壺帶桂花香氣的烏龍茶',
      type: '習慣',
      status: 'todo',
      importance: 1,
      estimatedDuration: '15 分鐘',
      preferredTime: '下午三點',
      source: '日常舒緩儀式'
    }
  ]
};

export const INITIAL_WEEKLY_PLAN: WeeklyPlanState = {
  weekNumber: 37,
  weekRange: '9.07 — 9.13',
  theme: '維持呼吸感與手感，不追趕進度',
  topPriorities: [
    '完成職訓前期行政手續',
    '嘗試兩次陶藝小物件塑形',
    '至少安排兩個完全空白的午後'
  ],
  fixedEvents: [
    { day: '週二', title: '牙醫半年洗牙定期檢查', time: '14:00' },
    { day: '週四', title: '職訓文件審查提報', time: '10:00' },
    { day: '週六', title: '舊書店尋找建築攝影冊', time: '15:00' }
  ],
  wishlist: [
    '去植物園散步兩圈',
    '嘗試做一次香料燉番茄',
    '把衣櫥夏季不需要的衣物捐贈整理'
  ],
  freeTimePercentage: 42,
  aiPacingJudgement: '本週固定事項僅佔 24%，自由留白充足（42%），屬於身心非常舒展的理想節奏。',
  daysSummary: [
    { day: '週一', dayEn: 'MON', date: '9.07', routine: '職訓資料草稿準備', status: '固定', freeHours: 4 },
    { day: '週二', dayEn: 'TUE', date: '9.08', routine: '牙醫檢查＋散步', status: '需要', freeHours: 3.5 },
    { day: '週三', dayEn: 'WED', date: '9.09', routine: '捏陶打底＋整理陽台', status: '想做', freeHours: 5 },
    { day: '週四', dayEn: 'THU', date: '9.10', routine: '資料提報＋午後創作', status: '需要', freeHours: 4.5 },
    { day: '週五', dayEn: 'FRI', date: '9.11', routine: '週末備料＋安靜閱讀', status: '自由', freeHours: 6 },
    { day: '週六', dayEn: 'SAT', date: '9.12', routine: '松菸慢步＋看獨立書展', status: '想做', freeHours: 4 },
    { day: '週日', dayEn: 'SUN', date: '9.13', routine: '徹底無計畫・純粹休息', status: '休息', freeHours: 7 }
  ],
  delayedTasksAnalysis: [
    {
      taskName: '整理房間雜物抽屜',
      delayedCount: 3,
      reasons: ['多安排在晚間八點後，此時體力已耗盡', '目標範圍太大，心理阻力高'],
      suggestedBreakdown: [
        '步驟一：只把抽屜裡壞掉的筆挑出來丟掉（5 分鐘）',
        '步驟二：把舊充電線捲好歸位（10 分鐘）'
      ]
    }
  ]
};

export const INITIAL_MONTHLY_PLAN: MonthlyPlanState = {
  monthStr: '九月',
  monthEn: 'SEPTEMBER 2026',
  vibe: '秋意初萌・減法生活',
  threeHighlights: [
    { category: '生活調適', title: '確認職訓進程，讓平日時間更有節奏感', done: true },
    { category: '手作體驗', title: '完成三件陶瓷茶點小皿製作', done: false },
    { category: '慢速探索', title: '挑一個平日午後獨自去海邊看浪', done: false }
  ],
  experiences: [
    { title: '手作陶藝初階技法練習', status: '進行中' },
    { title: '走訪三間未曾去過的台北獨立舊書店', status: '已完成 1/3' },
    { title: '嘗試早睡一小時，觀察晨起精神狀態', status: '適應中' }
  ],
  shoppingList: [
    { title: '亞麻工作圍裙', type: '想買', price: 'NT$ 890' },
    { title: '無印良品手作陶土素燒修整刀', type: '必要', price: 'NT$ 260' },
    { title: '二手膠卷底片相機', type: '先觀望', price: 'NT$ 3,200' }
  ],
  monthlyReview: {
    completionRate: 78,
    mostRewarding: '開始捏陶，手掌碰觸泥土時心境特別沉靜。',
    happiestEvent: '週三下午陽光灑進房間時泡茶看書的片刻。',
    mostExhausting: '處理公文繁瑣核對時的小焦慮，但已在上午提早化解。',
    mostDelayed: '整理儲藏室雜物（已決定延至十月涼爽時再做）。',
    newHabitFormed: '晨間不看手機，先喝一杯溫水。',
    safeToStop: '停止強迫自己每天讀滿五十章節書。',
    nextMonthContinuance: '持續陶藝創作，並安排一趟一日鐵道慢車小旅行。'
  }
};

export const INITIAL_YEARLY_PLAN: YearlyPlanState = {
  year: 2026,
  keyword: '探索',
  keywordDesc: '不以清單完成度考核人生，而以體驗的深度與身心舒坦為度量。給生活留下足夠的縫隙，讓光線進得來。',
  goals: [
    {
      id: 'yg-1',
      category: '工作與職涯',
      title: '找到合適自己身心步調的工作型態',
      commitment: '希望完成',
      progress: 60,
      notes: '參與職訓，並探索彈性與非高壓協作的可能。'
    },
    {
      id: 'yg-2',
      category: '手作與創作',
      title: '培養一項可以長期投入的觸覺創作技能',
      commitment: '希望完成',
      progress: 45,
      notes: '目前鎖定陶藝塑形與日常速寫。'
    },
    {
      id: 'yg-3',
      category: '緩步旅行',
      title: '安排一至兩次真正想去、不趕行程的慢旅行',
      commitment: '一定要完成',
      progress: 50,
      notes: '秋季宜蘭南方澳與花蓮慢步鐵道旅行構想中。'
    },
    {
      id: 'yg-4',
      category: '生活空間',
      title: '建立一個即使發呆也覺得安心舒服的日常角落',
      commitment: '希望完成',
      progress: 70,
      notes: '增加綠意植栽，更換為低色溫暖光源。'
    },
    {
      id: 'yg-5',
      category: '個人學習',
      title: '完成至少一個有收穫的興趣工藝課程',
      commitment: '有機會就做',
      progress: 30,
      notes: '不勉強，若累了就以生活調養為主。'
    },
    {
      id: 'yg-6',
      category: '照顧自己',
      title: '每週保留充足的自由留白，不因沒做完而焦慮',
      commitment: '純粹想體驗',
      progress: 85,
      notes: '身心狀態永遠是生活規劃的第一順位。'
    }
  ]
};

export const INITIAL_GOAL_ITEMS: GoalItem[] = [
  {
    id: 'g-1',
    title: '培養陶藝手作微習慣',
    horizon: 'month',
    status: '進行中',
    category: '手作與創作',
    description: '不追求完美工藝，而在於捏塑時的專注呼吸。',
    parentGoalId: 'yg-2',
    relatedMonthGoal: '完成三件陶瓷茶點小皿製作',
    relatedWeekGoal: '完成陶瓷小盤素坯塑形與細部刻紋',
    microActionToday: '下午捏陶塑形，只做三十分鐘即可',
    updatedAt: '2026.09.10',
    aiObservation: '已將大願景自然沉降為今日輕巧三十分鐘，毫無負擔。'
  },
  {
    id: 'g-2',
    title: '探索適合身心的自由工作節奏',
    horizon: 'year',
    status: '準備中',
    category: '工作與職涯',
    description: '以身心健康為基準線，參與職訓建立專業底氣。',
    parentGoalId: 'yg-1',
    relatedMonthGoal: '確認職訓進程',
    relatedWeekGoal: '完成職訓前期行政手續',
    microActionToday: '外出提報職訓審查附件',
    updatedAt: '2026.09.10',
    aiObservation: '今早已順利完成行政手續，本週核心進度達標。'
  },
  {
    id: 'g-3',
    title: '走訪台灣獨立工藝小鎮',
    horizon: 'month',
    status: '想試試',
    category: '緩步旅行',
    description: '挑一個沒有工作的週末，搭乘慢車前往鶯歌或南方澳。',
    parentGoalId: 'yg-3',
    updatedAt: '2026.09.05',
    aiObservation: '適合在十月秋高氣爽時再排入時間軸。'
  },
  {
    id: 'g-4',
    title: '建立極簡工作桌系統',
    horizon: 'week',
    status: '重新考慮',
    category: '生活空間',
    description: '原打算大改造，但目前桌況使用順手，先不增加購買開銷。',
    updatedAt: '2026.09.08',
    aiObservation: '77 建議先停留在觀察期，不隨意增添收納盒。'
  },
  {
    id: 'g-5',
    title: '晨間十公里跑步計畫',
    horizon: 'month',
    status: '放下',
    category: '照顧自己',
    description: '先前設定目標過高，反而造成睡眠焦慮。改為清晨輕鬆慢走散步。',
    updatedAt: '2026.08.30',
    aiObservation: '主動放下不適合現狀的目標，是高品質生活的重要智慧。'
  }
];

export const INITIAL_GOAL_CASCADES: GoalCascade[] = [
  {
    id: 'gc-1',
    yearGoal: '培養一項可以長期投入的觸覺創作技能',
    monthGoal: '完成三件陶瓷茶點小皿製作',
    weekMilestone: '完成陶瓷小盤素坯塑形與細部刻紋',
    todayAction: '下午捏陶塑形，只做三十分鐘即可',
    status: 'in_progress',
    aiObservation: '大願景已自然沉降為今日輕巧三十分鐘，毫無負擔。'
  },
  {
    id: 'gc-2',
    yearGoal: '找到比較適合自己身心步調的工作型態',
    monthGoal: '完成職訓前置申請手續',
    weekMilestone: '完成職訓資料提報與確認',
    todayAction: '確認信件並上傳身分審查附件',
    status: 'completed',
    aiObservation: '已於今早順利提報完成。本週重大進度達成。'
  }
];

export const INITIAL_IDEAS: IdeaItem[] = [
  {
    id: 'idea-1',
    title: '製作一套屬於自己的手繪植物牌卡',
    description: '繪製台灣原生植物圖樣，搭配安靜的生活感字句。',
    category: '想做',
    urgency: 'low',
    interestLevel: 'high',
    preferredSeason: '秋冬',
    preferredContext: '有連續兩小時以上安靜無事的週末午後',
    createdAt: '2026.04.17',
    lastSuggestedAt: '2026.08.10',
    suggestionCount: 2,
    status: 'someday',
    aiScore: 88
  },
  {
    id: 'idea-2',
    title: '去台北市立美術館看秋季插畫聯展',
    description: '展期至十月底，有幾位喜歡的獨立繪本作家的原作手稿展出。',
    category: '想看',
    urgency: 'medium',
    interestLevel: 'high',
    preferredSeason: '秋天',
    preferredContext: '平日午後或避開人潮的清晨',
    createdAt: '2026.08.25',
    suggestionCount: 1,
    status: 'someday',
    aiScore: 92
  },
  {
    id: 'idea-3',
    title: '替玄關換一塊粗麻編織地墊',
    description: '進門踏上自然纖維的感覺，能讓回家的心情立刻沉靜下來。',
    category: '想買',
    urgency: 'low',
    interestLevel: 'medium',
    preferredContext: '週末逛市集或二手家居選品店',
    createdAt: '2026.09.02',
    suggestionCount: 0,
    status: 'someday',
    aiScore: 74
  },
  {
    id: 'idea-4',
    title: '自製無水香料番茄咖哩',
    description: '用洋蔥慢炒出焦糖色，加入薑黃與胡荽籽慢燉。',
    category: '想體驗',
    urgency: 'low',
    interestLevel: 'high',
    preferredContext: '涼爽微雨的傍晚',
    createdAt: '2026.08.18',
    suggestionCount: 0,
    status: 'someday',
    aiScore: 82
  },
  {
    id: 'idea-5',
    title: '學習基礎木器食器修復（金繼）',
    description: '把家裡磕碰到邊緣的木碗溫柔修補起來。',
    category: '想學',
    urgency: 'low',
    interestLevel: 'high',
    preferredContext: '冬季週末手作工作坊',
    createdAt: '2026.07.12',
    suggestionCount: 1,
    status: 'someday',
    aiScore: 86
  },
  {
    id: 'idea-6',
    title: '傍晚搭捷運去淡水河堤看日落',
    description: '不帶特定目的，只是吹風看船隻經過。',
    category: '想去',
    urgency: 'low',
    interestLevel: 'high',
    preferredContext: '能見度極高的晴朗秋日',
    createdAt: '2026.08.30',
    suggestionCount: 0,
    status: 'someday',
    aiScore: 80
  },
  {
    id: 'idea-7',
    title: '試著記錄每天聽見最美的一個聲音',
    description: '風吹過樟樹葉、水壺水滾的微沸聲、遠處的火車經過聲。',
    category: '突然想到',
    urgency: 'low',
    interestLevel: 'medium',
    preferredContext: '生活任何瞬間',
    createdAt: '2026.09.08',
    suggestionCount: 0,
    status: 'someday',
    aiScore: 78
  }
];

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    layer: 'preference',
    layerLabel: '偏好',
    title: '偏好保留充裕的自由留白',
    category: 'planning_preference',
    content: '明確表達不喜歡將行程排滿，偏好每日至少保留二至三小時未經安排的空白時間。',
    confidence: 0.96,
    evidenceCount: 14,
    evidenceNotes: '過去十四次規劃中，十三次主動確認並保留自由時間段。',
    status: 'active',
    lastConfirmedDate: '2026.09.10'
  },
  {
    id: 'mem-2',
    layer: 'preference',
    layerLabel: '偏好',
    title: '午後 14:00—17:00 適合心流創作',
    category: 'time_preference',
    content: '手作、繪圖等需動手與專注的興趣，安排在午後完成度最高且心情最為平靜。',
    confidence: 0.92,
    evidenceCount: 9,
    evidenceNotes: '過去十次午後安排手作，九次反饋平靜愉悅且順暢收尾。',
    status: 'active',
    lastConfirmedDate: '2026.09.08'
  },
  {
    id: 'mem-3',
    layer: 'pattern',
    layerLabel: '模式',
    title: '晚間不宜安排超過一小時的大型家務',
    category: 'behavior_pattern',
    content: '晚間八點後若排入「整理房間」等耗體能事項，延後率高達八成。宜拆為二十分鐘日間微步驟。',
    confidence: 0.81,
    evidenceCount: 5,
    evidenceNotes: '過去五次晚間大型打掃，四次因疲累取消；因此 77 避免在晚間推薦重型任務。',
    status: 'active',
    lastConfirmedDate: '2026.09.06'
  },
  {
    id: 'mem-4',
    layer: 'fact',
    layerLabel: '事實',
    title: '手作時光帶來顯著能量平復',
    category: 'event_fact',
    content: '九月五日午後進行陶藝捏塑，回顧記載「非常安靜且感覺被療癒」。',
    confidence: 0.98,
    evidenceCount: 1,
    evidenceNotes: '出自 2026.09.05 日末回顧記敘。',
    status: 'active',
    lastConfirmedDate: '2026.09.05'
  },
  {
    id: 'mem-5',
    layer: 'goal',
    layerLabel: '目標',
    title: '2026 年度方向以「探索」為軸',
    category: 'yearly_goal',
    content: '不將年度規劃視為進度指標，更看重體驗過程與身心放鬆，避免未完成所產生的愧疚感。',
    confidence: 0.94,
    evidenceCount: 6,
    evidenceNotes: '多次提過「不要把自己逼太緊」，偏好溫和指引。',
    status: 'active',
    lastConfirmedDate: '2026.09.01'
  }
];

export const INITIAL_BEHAVIOR_PATTERNS: BehaviorPattern[] = [
  {
    id: 'bp-1',
    patternName: '雨天自然降速',
    observedTrait: '降雨時對外出行程阻力增加，偏好室內手作與熱茶陪伴',
    confidence: 0.89,
    frequency: '每次雨天均有顯著反應',
    influenceOnPacing: '雨天時 77 自動調降出門任務比重，主動增列閱讀或放鬆時間'
  },
  {
    id: 'bp-2',
    patternName: '大任務畏縮、小任務流暢',
    observedTrait: '看到「大掃除」、「寫完報告」易拖延，但拆成「收五分鐘桌面」能立即啟動',
    confidence: 0.93,
    frequency: '常態性行為模式',
    influenceOnPacing: '77 在檢測到未完成事項時，優先提供拆小建議而非催促'
  }
];

export const INITIAL_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 'rec-1',
    title: '陶藝小盤素坯塑形',
    why: '今天下午兩點半至四點有一段完整的留白時間。你目前身心指數良好，捏陶能進入安靜心流，無公事懸念。',
    suitableTime: '今日 14:30 — 16:00',
    estimatedDuration: '約 1.5 小時',
    level: '很適合',
    score: 94,
    status: 'pending',
    alternativeIfReject: '若只想安靜休息，這段時間完全留白發呆或看書也極好。',
    sourceIdeaId: 'idea-2',
    category: '創作手作'
  },
  {
    id: 'rec-2',
    title: '傍晚巷弄慢步、順路取件',
    why: '台北今日氣溫 26 度且微風涼爽，傍晚出門走動可舒展坐姿一整天的筋骨。',
    suitableTime: '今日 16:30 — 17:15',
    estimatedDuration: '45 分鐘',
    level: '可以考慮',
    score: 82,
    status: 'pending',
    alternativeIfReject: '亦可改為明晨出門時再順道取件。',
    category: '身心調和'
  },
  {
    id: 'rec-3',
    title: '市立美術館秋季插畫展（平日票）',
    why: '週末人潮眾多，若明日午後有空，是極佳的避開人群看展時機。',
    suitableTime: '週五或下週二午後',
    estimatedDuration: '約 2 小時',
    level: '先不用',
    score: 71,
    status: 'pending',
    alternativeIfReject: '暫存想法牆，等哪天心血來潮再出發。',
    sourceIdeaId: 'idea-2',
    category: '藝文靈感'
  }
];

export const INITIAL_TIME_CAPSULE_GIFT: TimeCapsuleGift = {
  id: 'gift-tarot',
  dateMentioned: '2026.04.17',
  quote: '「有一天想自己畫一套屬於自己的植物牌卡。」',
  title: '自己畫一套植物牌卡',
  message: '這件事已經四個月沒有提起了。今天下午身心很平靜，只是輕輕放在你眼前。如果現在有興趣，可以翻開看看當初的點子。',
  status: 'active'
};

// -------------------------------------------------------------
// NOW / News / Threads / Event Clusters (Taipei & World)
// -------------------------------------------------------------

export const INITIAL_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    title: '台北當代藝術週本週五於松菸及圓山同步登場',
    source: '中央社文化線',
    category: '文化藝文',
    summary: '今年以「生活的隙縫」為題，邀請多位台日獨立手作工藝家與繪本創作者展出。周邊交通週末預計將實施部分接駁管制。',
    publishedAt: '2 小時前',
    isFact: true
  },
  {
    id: 'news-2',
    title: '氣象署：初秋微弱東北季風抵達，北部高溫降至 26 度，夜晚微涼',
    source: '交通部中央氣象署',
    category: '城市生活',
    summary: '受微弱東北季風影響，大台北地區雲量偏多，體感涼爽舒適，日夜溫差約 6 度，外出建議適時添衣。',
    publishedAt: '3 小時前',
    isFact: true
  },
  {
    id: 'news-3',
    title: '台鐵推「慢行支線無座票限額」新措施，提升平溪與深澳線搭乘品質',
    source: '聯合報地方版',
    category: '城市生活',
    summary: '為避免假日人潮過度擁擠破壞小鎮安寧，下月起試行假日時段人流總量調控，鼓勵旅客平日探訪慢步。',
    publishedAt: '5 小時前',
    isFact: true
  }
];

export const INITIAL_THREADS_POSTS: ThreadsPost[] = [
  {
    id: 'th-1',
    authorHandle: '@sushilovers_tw',
    authorName: '爭鮮探店日常',
    content: '秋蟹季真的來了！剛剛去吃爭鮮點了一盤麵包蟹，蟹膏量出乎意料很多，479則貼文大家都在討論哪家門市還有貨，下午想吃真的要碰運氣。',
    likeCount: 342,
    replyCount: 28,
    timestamp: '1 小時前',
    topicTag: '#爭鮮秋蟹季',
    url: 'https://www.threads.net/search?q=%E7%88%AD%E9%AE%AE%E6%8E%A8%E5%87%BA%E7%A7%8B%E8%9F%B9%E5%AD%A3%E6%B4%BB%E5%8B%95'
  },
  {
    id: 'th-2',
    authorHandle: '@chiikawa_taipei',
    authorName: '吉伊卡哇愛好會',
    content: '日本地瓜球首間快閃店9/19就要開幕了！澀谷跟大阪巡迴，那個黃色地瓜球玩偶太治癒了，Threads 上的大家已經在揪團代購了。',
    likeCount: 890,
    replyCount: 64,
    timestamp: '2 小時前',
    topicTag: '#ちいかわ',
    url: 'https://www.threads.net/search?q=%E3%81%A1%E3%81%84%E3%81%8B%E3%82%8F'
  },
  {
    id: 'th-3',
    authorHandle: '@tech_investor_tw',
    authorName: '市場脈動筆記',
    content: '台達電8月營收創同期新高但月減，股價重挫失守1700元，Threads 上超過4千則討論都在看是不是撿便宜的好時機，長線依然很有基本面支持。',
    likeCount: 1420,
    replyCount: 95,
    timestamp: '4 小時前',
    topicTag: '#台達電',
    url: 'https://www.threads.net/search?q=%E5%8F%B0%E9%81%94%E9%9B%BB'
  }
];

export const INITIAL_THREADS_TOPICS: ThreadsTopic[] = [
  {
    id: 'tt-1',
    topicName: '爭鮮推出秋蟹季活動',
    postCount: 479,
    trendingRank: 1,
    vibe: '熱議',
    topQuote: '「秋蟹季麵包蟹品項熱賣，部分門市已售罄 · 479 則貼文」'
  },
  {
    id: 'tt-2',
    topicName: '台達電股價重挫跌逾6%',
    postCount: 4000,
    trendingRank: 2,
    vibe: '熱議',
    topQuote: '「8月營收雖創同期新高但不如7月，股價仍下跌失守1700元關卡 · 4 千 則貼文」'
  },
  {
    id: 'tt-3',
    topicName: '地瓜球日本首間快閃店開幕',
    postCount: 1000,
    trendingRank: 3,
    vibe: '共鳴',
    topQuote: '「《表情貼小傢伙》將於9月19日起在東京澀谷與大阪巡迴開設快閃店 · 1 千 則貼文」'
  },
  {
    id: 'tt-4',
    topicName: '星巴克新品掀搶購潮',
    postCount: 2000,
    trendingRank: 4,
    vibe: '熱議',
    topQuote: '「星巴克秋季聯名限定新品與特調掀起熱潮 · 2 千 則貼文」'
  }
];

export const INITIAL_EVENT_CLUSTERS: CurrentEventCluster[] = [
  {
    id: 'ec-1',
    clusterTitle: '2026 台北當代藝術週（松菸園區展場）',
    clusterType: 'culture_event',
    newsFacts: [
      '官方公告展期 9/11 至 9/20，松菸全展區開放。',
      '周邊停車場預估於週末午後客滿，市府增派接駁車。'
    ],
    threadsDiscussions: [
      'Threads 創作者討論集中在「手工陶瓷與木作展品」的工藝質地。',
      '多位逛展者回饋平日清晨或午後參觀人潮較少，體驗極佳。'
    ],
    personalRelevance: {
      isRelevant: true,
      reason: '你的週六規劃有松菸慢步行程，且你長期關注手作陶藝。建議避開週六午後人潮尖峰，或改於週五平日午後造訪。',
      suggestedAction: '可考慮微調週六時段，或提前三十鐘出門。'
    },
    heatLevel: 'high',
    updatedAt: '1 小時前'
  },
  {
    id: 'ec-2',
    clusterTitle: '初秋東北季風抵達・大台北溫涼換季',
    clusterType: 'weather_alert',
    newsFacts: [
      '氣象署觀測大台北白天氣溫 26°C，夜晚降至 21°C。',
      '近期東北風持續，午後降雨機率降至 15% 以下。'
    ],
    threadsDiscussions: [
      '社群大量討論「終於不用開冷氣」、「適合外出戶外散步喝咖啡的黃金天氣」。'
    ],
    personalRelevance: {
      isRelevant: true,
      reason: '你的體感舒適偏好為 22–26 度。今日下午是開窗自然風捏陶的最佳時機。'
    },
    heatLevel: 'moderate',
    updatedAt: '3 小時前'
  }
];

// -------------------------------------------------------------
// Contextual Life Reminders Defaults
// -------------------------------------------------------------

export const INITIAL_LEAVING_ITEMS = [
  { id: 'item-phone', name: '手機', checked: false, order: 1, enabled: true, isDefault: true },
  { id: 'item-wallet', name: '錢包', checked: false, order: 2, enabled: true, isDefault: true },
  { id: 'item-keys', name: '鑰匙', checked: false, order: 3, enabled: true, isDefault: true },
  { id: 'item-hearing-aid', name: '助聽器', checked: false, order: 4, enabled: true, isDefault: true }
];

export const LEAVING_REMINDER_PHRASES = [
  '出門前再確認一下，重要的東西都有帶嗎？',
  '要出門了，順手確認一下隨身物品。',
  '最後看一眼，東西都帶齊了嗎？'
];

export const WATER_REMINDER_PHRASES = [
  '喝口水吧。',
  '記得喝點水。',
  '去喝幾口水吧。'
];

export const INITIAL_CONTEXT_SCENARIO_RULES: ContextScenarioRule[] = [
  {
    id: 'rule-rain',
    itemName: '雨傘',
    conditionLabel: '降雨機率高於 30% 或陰雨天氣',
    triggerContext: 'rain',
    enabled: true
  },
  {
    id: 'rule-hot-sun',
    itemName: '防曬與隨身水瓶',
    conditionLabel: '室外氣溫高於 29°C 或強烈日曬',
    triggerContext: 'hot_sun',
    enabled: true
  },
  {
    id: 'rule-long-trip',
    itemName: '行動電源與水壺',
    conditionLabel: '預計外出超過 4 小時或跨區行程',
    triggerContext: 'long_trip',
    enabled: true
  },
  {
    id: 'rule-course',
    itemName: '手作圍裙與材料筆記',
    conditionLabel: '今日行程包含上課、工作坊或手作工坊',
    triggerContext: 'course_workshop',
    enabled: true
  },
  {
    id: 'rule-photo',
    itemName: '相機與備用記憶卡',
    conditionLabel: '行程標註攝影散步或旅行',
    triggerContext: 'photography',
    enabled: true
  }
];

// -------------------------------------------------------------
// Threads 搜尋熱門趨勢標籤 (依據 Threads 官方搜尋實測)
// -------------------------------------------------------------
export const THREADS_SEARCH_TRENDS = [
  { label: '早春晴朗', query: '早春晴朗' },
  { label: 'ちいかわ', query: 'ちいかわ' },
  { label: 'MLB Threads', query: 'MLB Threads' },
  { label: '沈伯洋', query: '沈伯洋' },
  { label: 'IVE', query: 'IVE' },
  { label: 'SEVENTEEN', query: 'SEVENTEEN' },
  { label: 'GPT', query: 'GPT' }
];

export const INITIAL_THREADS_HOT_ITEMS: ThreadsHotItem[] = [
  // 1. 大家現在都在聊 (最新趨勢話題 · 大家討論的話題，由 AI 整理成摘要)
  {
    id: 'hot-1',
    rank: 1,
    title: '爭鮮推出秋蟹季活動，熱銷品項傳多門市售罄',
    category: 'lifestyle',
    categoryLabel: '生活日常爆紅',
    heatVelocity: 'HOT',
    heatVelocityLabel: '全網極高熱度',
    importance: 2,
    viralness: 5,
    sourceUrl: 'https://www.threads.net/search?q=%E7%88%AD%E9%AE%AE%E6%8E%A8%E5%87%BA%E7%A7%8B%E8%9F%B9%E5%AD%A3%E6%B4%BB%E5%8B%95',
    searchQuery: '爭鮮推出秋蟹季活動',
    aiSummary: '爭鮮秋蟹季麵包蟹品項熱賣，部分門市已售罄 · 479 則貼文',
    threadsPostCount: '479 則貼文',
    sourceAuthorHandle: '@sushilovers_tw',
    sourceAuthorName: '爭鮮探店日常',
    shortExplainer: '爭鮮推出秋季限定螃蟹季，以整隻麵包蟹與多款海味料理引發大量開箱打卡，多間門市下午提早貼出完售公告。',
    whatHappened: '迴轉壽司龍頭爭鮮今日開賣「秋蟹季」限定菜單，以平價帶膏麵包蟹為號召，立刻在 Threads 掀起食客打卡熱潮與搶吃回報。',
    whyViral: '秋天吃蟹氛圍濃厚，百元級距的整隻帶膏蟹在視覺上衝擊感強，網友開始接力回報各大門市庫存情況。',
    whatPeopleSay: '「跑了兩家終於在信義店吃到麵包蟹，蟹膏量意外很有誠意」、「隔壁桌一口氣點了三隻，店員說備料快見底了」。',
    velocityText: '過去 3 小時累積近 500 篇食記串文，多區門市熱銷',
    discussionVolume: '479 則貼文',
    sourceBucket: 'everyone_talking',
    cluster: {
      threadsDiscussions: [
        '「板橋門市中午就貼出今日麵包蟹售完，想吃的人明天請早。」',
        '「蟹肉滿甜的，以平價壽司來說性價比很高，值得搶一盤。」',
        '「Threads 上大家都在分享排隊攻略，連鎖壽司很久沒這麼熱鬧了。」'
      ],
      newsReporting: [
        '多家生活美食網媒報導「爭鮮秋蟹季開跑首日湧人潮，麵包蟹掀拍照打卡熱」。'
      ],
      officialConfirmation: [
        '爭鮮官方粉絲頁公告：「各門市每日進貨限量供應，售完為止，感謝顧客熱情支持。」'
      ]
    },
    updatedAt: '10 分鐘前'
  },
  {
    id: 'hot-2',
    rank: 2,
    title: '台達電股價重挫跌逾 6%，投資人熱議逢低布局時機',
    category: 'news',
    categoryLabel: '公共焦點',
    heatVelocity: 'CONTINUING',
    heatVelocityLabel: '持續熱烈討論',
    importance: 5,
    viralness: 4,
    sourceUrl: 'https://www.threads.net/search?q=%E5%8F%B0%E9%81%94%E9%9B%BB',
    searchQuery: '台達電',
    aiSummary: '8月營收雖創同期新高但不如7月，股價仍下跌失守1700元關卡 · 4 千 則貼文',
    threadsPostCount: '4 千 則貼文',
    sourceAuthorHandle: '@tech_investor_tw',
    sourceAuthorName: '市場脈動筆記',
    shortExplainer: '台達電公佈 8 月營收創歷年同期新高，但因月減及市場預期過高，股價早盤重挫逾 6% 失守整數關卡，社群激辯多空走向。',
    whatHappened: '電源管理與 AI 電源供應龍頭台達電盤中遭遇外資與獲利了結賣壓，單日急跌引發台股權值股投資人高度關注。',
    whyViral: '作為 AI 伺服器核心供應鏈的重要指標，營收創同期新高卻伴隨大跌，觸動散戶與機構投資人熱議「市場標準到底多嚴格」。',
    whatPeopleSay: '「營收同期新高還跌成這樣，AI 股的期望值真的被拉得太滿」、「長期投資者開始評估分批進場的支撐價位」。',
    velocityText: '全網超過 4 千則財經長短評，論戰持續擴大',
    discussionVolume: '4 千 則貼文',
    sourceBucket: 'everyone_talking',
    cluster: {
      threadsDiscussions: [
        '「台達電基本面完全沒變壞，伺服器電源市佔依舊穩固，這波下跌是情緒性反應。」',
        '「月減就是不如預期，短線資金先撤退觀望是合理的操盤邏輯。」',
        '「價值投資人視角：好公司遇到市場倒貨才是長期建倉的機會。」'
      ],
      newsReporting: [
        '工商時報與經濟日報報導「台達電8月營收創同期新高，惟月減拖累股價盤中重挫」。'
      ],
      officialConfirmation: [
        '公司重申第 3 季整體營運維持穩健，全年 AI 電源與散熱解決方案成長目標不變。'
      ]
    },
    updatedAt: '25 分鐘前'
  },
  {
    id: 'hot-3',
    rank: 3,
    title: '阿贊初涉挪用公款遭逮捕，宗教與佛牌收藏圈大震盪',
    category: 'news',
    categoryLabel: '國際要聞',
    heatVelocity: 'HOT',
    heatVelocityLabel: '全網震驚擴散',
    importance: 4,
    viralness: 4,
    sourceUrl: 'https://www.threads.net/search?q=%E9%98%BF%E8%B4%87%E5%88%9D',
    searchQuery: '阿贊初',
    aiSummary: '泰國住持阿贊初涉挪用公款與女信徒性交遭逮捕 · 35 則貼文',
    threadsPostCount: '35 則貼文',
    sourceAuthorHandle: '@amulet_watcher',
    sourceAuthorName: '南洋文物考察',
    shortExplainer: '泰國著名僧侶阿贊初因涉嫌挪用廟方信眾巨額善款並違反戒律，遭泰國警方特別調查局拘捕，引發台泰佛牌收藏界熱烈議論。',
    whatHappened: '泰國肅貪與宗教犯罪調查單位展開收網行動，對阿贊初所在寺廟進行突擊搜查並依法羈押，相關案情於社群平台廣泛流傳。',
    whyViral: '阿贊初在東南亞與台灣南傳佛教、澤度金佛牌圈知名度極高，重大醜聞爆發造成藏家信任危機與哲學省思。',
    whatPeopleSay: '「佛牌界的大地震，很多收藏群組今天全面噤聲」、「信仰是修心，不要把精神寄託盲目神化在凡人身上」。',
    velocityText: '跨國信眾陸續轉發案件進度與官方通報',
    discussionVolume: '35 則貼文',
    sourceBucket: 'everyone_talking',
    cluster: {
      threadsDiscussions: [
        '「看到新聞真的很震驚，這給所有宗教信眾上了一堂深刻的除魅課。」',
        '「泰國警方這次執法動作迅速透明，支持依法徹查洗錢與金流。」'
      ],
      newsReporting: [
        '曼谷郵報及多家國際中文媒體跟進報導泰國國家警察特別調查局破獲案情始末。'
      ]
    },
    updatedAt: '35 分鐘前'
  },
  {
    id: 'hot-4',
    rank: 4,
    title: '地瓜球日本首間快閃店開幕，《表情貼小傢伙》巡迴引爆代購潮',
    category: 'culture',
    categoryLabel: '文化與萌系快閃',
    heatVelocity: 'RISING',
    heatVelocityLabel: '短時間急速升溫',
    importance: 2,
    viralness: 5,
    sourceUrl: 'https://www.threads.net/search?q=%E5%9C%B0%E7%93%9C%E7%90%83%20%E5%BF%AB%E9%96%83%E5%BA%97',
    searchQuery: '地瓜球 快閃店',
    aiSummary: '《表情貼小傢伙》將於9月19日起在東京澀谷與大阪巡迴開設快閃店 · 1 千 則貼文',
    threadsPostCount: '1 千 則貼文',
    sourceAuthorHandle: '@chiikawa_taipei',
    sourceAuthorName: '萌系日常研究所',
    shortExplainer: '超人氣角色《表情貼小傢伙》以台灣經典街邊甜點「地瓜球」為靈感推出日本巡迴快閃店，毛絨抱枕與限定周邊引發台日粉絲狂歡。',
    whatHappened: '官方發布 9 月 19 日東京澀谷 PARCO 快閃店情報，圓滾滾的金黃地瓜球玩偶與限定鑰匙圈實體照曝光，Threads 一天內破千篇貼文轉發。',
    whyViral: '台灣在地平民美食結合萌系角色 IP，精準擊中年輕世代的收藏欲與拍照打卡偏好，社群湧現大量求代購與組團預約貼文。',
    whatPeopleSay: '「地瓜球怎麼可以這麼萌，那個澎澎的手感太犯規了」、「剛好 9 月底去東京，已經把這家排進散步地圖了」。',
    velocityText: '單日破千篇代購與打卡期待串文，熱度持續攀升',
    discussionVolume: '1 千 則貼文',
    sourceBucket: 'everyone_talking',
    cluster: {
      threadsDiscussions: [
        '「有去日本的朋友拜託幫我帶一顆小地瓜球吊飾回來！」',
        '「台灣美食在海外以這種可愛的方式輸出真的很成功。」'
      ]
    },
    updatedAt: '45 分鐘前'
  },
  {
    id: 'hot-5',
    rank: 5,
    title: '星巴克秋季聯名新品掀搶購潮，限定杯款開賣首日秒殺',
    category: 'lifestyle',
    categoryLabel: '生活新品焦點',
    heatVelocity: 'HOT',
    heatVelocityLabel: '全網搶購熱搜',
    importance: 2,
    viralness: 4,
    sourceUrl: 'https://www.threads.net/search?q=%E6%98%9F%E5%B7%B4%E5%85%8B%E6%96%B0%E5%93%81',
    searchQuery: '星巴克新品',
    aiSummary: '星巴克秋季聯名限定新品與特調掀起熱潮 · 2 千 則貼文',
    threadsPostCount: '2 千 則貼文',
    sourceAuthorHandle: '@coffee_lover_tw',
    sourceAuthorName: '台北咖啡地圖',
    shortExplainer: '星巴克秋季限定的大地色系聯名隨行杯與焙茶燕麥奶新風味上市，開門即見排隊人潮，Threads 上陸續傳出多間門市限定款被掃空。',
    whatHappened: '今早連鎖咖啡門市開門前即有排隊客守候，大地暖灰色調的陶瓷馬克杯與不鏽鋼杯被評為「今年最有秋天氛圍的設計」。',
    whyViral: '極簡霧面外觀符合文青與辦公桌美學，搭配 Threads 網友實拍開箱，迅速激起群眾購買慾望。',
    whatPeopleSay: '「跑了兩家捷運門市才搶到最後一個霧灰杯」、「焙茶燕麥奶喝起來茶感滿濃，微甜很順口」。',
    velocityText: '今晨至今破兩千篇門市開箱回報，討論熱烈',
    discussionVolume: '2 千 則貼文',
    sourceBucket: 'everyone_talking',
    cluster: {
      threadsDiscussions: [
        '「大家真的別再搶了，去民生社區門市看架上已經空了一半。」',
        '「大地色的質感比照片更好看，秋天拿在手上喝熱咖啡很治癒。」'
      ]
    },
    updatedAt: '50 分鐘前'
  },

  // 2. 正在快速升溫 (Rising Fast: 15-20% ~ 2-4 個話題)
  {
    id: 'hot-6',
    rank: 6,
    title: 'ちいかわ（吉伊卡哇）秋季限定周邊開賣，粉絲集體曬出戰利品',
    category: 'meme',
    categoryLabel: '全網萌系迷因',
    heatVelocity: 'RISING',
    heatVelocityLabel: '兩小時內竄升',
    importance: 2,
    viralness: 5,
    sourceUrl: 'https://www.threads.net/search?q=%E3%81%A1%E3%81%84%E3%81%8B%E3%82%8F',
    searchQuery: 'ちいかわ',
    aiSummary: 'ちいかわ（Chiikawa）秋季一番賞發售即完售，網友熱議小八與烏薩奇最新周邊 · 1.5 萬 則貼文',
    threadsPostCount: '1.5 萬 則貼文',
    sourceAuthorHandle: '@chiikawa_life',
    sourceAuthorName: '吉伊小窩日常',
    shortExplainer: '超人氣 IP ちいかわ最新秋季限定周邊與一番賞全面發售，各大百貨櫃位排隊盛況與開箱貼文洗版 Threads。',
    whatHappened: '中午時段多位粉絲上傳抽賞開箱影片，小八貓與兔兔烏薩奇的特別造型引發萬人按讚。',
    whyViral: '跨越年齡層的超高人氣，加上盲盒與一番賞的隨機刺激感，社群即時交換與曬圖回饋極其熱絡。',
    whatPeopleSay: '「烏薩奇叫聲太魔性了，抽到 A 賞直接圓滿」、「Threads 上全部都是ちいかわ，今天根本吉伊卡哇日」。',
    velocityText: '過去 2 小時內相關標籤飆破萬則，登上搜尋前三',
    discussionVolume: '1.5 萬 則貼文',
    sourceBucket: 'rising_fast',
    cluster: {
      threadsDiscussions: [
        '「中山站快閃店排隊人龍已經繞了兩圈，大家記得自備水瓶！」',
        '「抽到重覆的小可愛想換小八，意者私訊交換。」'
      ]
    },
    updatedAt: '20 分鐘前'
  },
  {
    id: 'hot-7',
    rank: 7,
    title: 'MLB 季後賽席位生死鬥，大谷翔平全壘打與盜壘進度洗版',
    category: 'entertainment',
    categoryLabel: '運動賽事焦點',
    heatVelocity: 'RISING',
    heatVelocityLabel: '即時比分激戰',
    importance: 3,
    viralness: 5,
    sourceUrl: 'https://www.threads.net/search?q=MLB%20Threads',
    searchQuery: 'MLB Threads',
    aiSummary: '大聯盟各分區外卡生死鬥白熱化，大谷翔平全壘打與盜壘進度持續洗版 · 8 千 則貼文',
    threadsPostCount: '8 千 則貼文',
    sourceAuthorHandle: '@mlb_taiwan',
    sourceAuthorName: '大聯盟即時情報',
    shortExplainer: 'MLB 常規賽進入最白熱化階段，國聯外卡爭奪戰與大谷翔平刷新歷史的數據牽動全台球迷神經。',
    whatHappened: '今日賽事大谷再次擊出長打並完成關鍵盜壘，即時精華影片在 Threads 轉載率爆棚。',
    whyViral: '運動史上難得一見的現象級紀錄，每場比賽都可能改寫百年紀錄，引發棒球圈與一般民眾全面圍觀。',
    whatPeopleSay: '「大谷真的是漫畫走出來的人」、「今天這場逆轉全壘打看得心跳超快」。',
    velocityText: '單局激戰跳增 3,000 篇即時看球心得串文',
    discussionVolume: '8 千 則貼文',
    sourceBucket: 'rising_fast',
    cluster: {
      threadsDiscussions: [
        '「道奇這局打線串聯太神了，季後賽氣氛已經完全點燃。」',
        '「一邊上班一邊偷瞄 Threads 實況比分，太刺激了。」'
      ]
    },
    updatedAt: '30 分鐘前'
  },
  {
    id: 'hot-8',
    rank: 8,
    title: 'GPT 新模型推論能力實測，程式開發與文字工作者分享技巧',
    category: 'social_debate',
    categoryLabel: '科技趨勢激辯',
    heatVelocity: 'RISING',
    heatVelocityLabel: '科技圈熱議',
    importance: 4,
    viralness: 4,
    sourceUrl: 'https://www.threads.net/search?q=GPT',
    searchQuery: 'GPT',
    aiSummary: '最新推論模型發布引發科技社群熱烈實測，程式員與研究者分享提示詞技巧 · 3 千 則貼文',
    threadsPostCount: '3 千 則貼文',
    sourceAuthorHandle: '@ai_daily_tw',
    sourceAuthorName: 'AI 思考與實踐',
    shortExplainer: 'OpenAI 與科技圈針對新一代深度思考模型的推理能力展開大量實測，程式除錯與日常工作流整合成為 Threads 討論熱點。',
    whatHappened: '許多工程師、設計師與文字創作者在 Threads 發表「複雜數學與代碼重構測試」，展示模型自我反思機制的驚人表現。',
    whyViral: '從學術探討深入到具體每個人每天的「工作提效工具」，引發廣泛共鳴與提示詞學習潮。',
    whatPeopleSay: '「推論鏈條真的變清楚很多，不再容易出現邏輯硬拗」、「善用 AI 整理生活與代辦清單體驗非常好」。',
    velocityText: '累積超過 3 千篇實測心得與工作流教學',
    discussionVolume: '3 千 則貼文',
    sourceBucket: 'rising_fast',
    cluster: {
      threadsDiscussions: [
        '「重點不是模型多聰明，而是你怎麼把自己的真實問題拆解清楚。」',
        '「推薦拿來幫忙整理零碎的生活筆記跟靈感，脈絡變得很清楚。」'
      ]
    },
    updatedAt: '40 分鐘前'
  },

  // 3. 小小發現 (Small Discoveries ~ 趣味、冷門但真實發生的生活碎片)
  {
    id: 'hot-9',
    rank: 9,
    title: '「早春晴朗」台北初秋散步攝影展，街頭光影作品溫柔瘋傳',
    category: 'culture',
    categoryLabel: '小小發現',
    heatVelocity: 'CONTINUING',
    heatVelocityLabel: '安靜溫和流傳',
    importance: 2,
    viralness: 3,
    sourceUrl: 'https://www.threads.net/search?q=%E6%97%A9%E6%98%A5%E6%99%B4%E6%9C%97',
    searchQuery: '早春晴朗',
    aiSummary: '「早春晴朗」文藝主題攝影與微涼街拍作品引發文青群組轉發共鳴 · 1.2 千 則貼文',
    threadsPostCount: '1.2 千 則貼文',
    sourceAuthorHandle: '@taipei_streets',
    sourceAuthorName: '城市慢步觀景',
    shortExplainer: '攝影創作者捕捉台北初秋微涼天色下的自然斜射光影，溫柔舒緩的視覺氛圍成為許多人的社群避風港。',
    whatHappened: '一組拍攝於大稻埕與民生社區的膠卷街拍照在 Threads 獲得上千人收藏，乾淨純粹的視覺語言引發轉發。',
    whyViral: '在快節奏與資訊紛雜的網路環境中，柔和的光影與平靜的節奏提供了一處安靜停歇的角落。',
    whatPeopleSay: '「這組照片的色調好舒服，讓人想立刻出門散步」、「秋天的台北真的很適合放慢腳步」。',
    velocityText: '持續被喜愛散步與攝影的創作者轉發收藏中',
    discussionVolume: '1.2 千 則貼文',
    sourceBucket: 'small_discovery',
    cluster: {
      threadsDiscussions: [
        '「富錦街樹蔭灑下來的陽光配上微風，這就是生活。」'
      ]
    },
    updatedAt: '1 小時前'
  },
  {
    id: 'hot-10',
    rank: 10,
    title: 'SEVENTEEN 與 IVE 新回歸巡演動態，粉絲即時搶票戰報洗版',
    category: 'entertainment',
    categoryLabel: '小小發現',
    heatVelocity: 'CONTINUING',
    heatVelocityLabel: '粉絲社群聚焦',
    importance: 2,
    viralness: 4,
    sourceUrl: 'https://www.threads.net/search?q=SEVENTEEN',
    searchQuery: 'SEVENTEEN',
    aiSummary: 'K-POP 團體 SEVENTEEN 與 IVE 最新海外巡迴票務引發搶票熱議 · 2.5 萬 則貼文',
    threadsPostCount: '2.5 萬 則貼文',
    sourceAuthorHandle: '@kpop_pulse_tw',
    sourceAuthorName: '韓流熱訊快報',
    shortExplainer: '人氣韓團 SEVENTEEN 與 IVE 宣布新一輪巡演場次與售票時間，社群即時湧入海量搶票攻略與換票交流。',
    whatHappened: '巡演情報一出，Threads 熱門標籤瞬間被兩團席捲，歌迷熱烈交流各區選位心得。',
    whyViral: '龐大的年輕族群黏著度與現場演出的高期待感，形成跨國社群熱度。',
    whatPeopleSay: '「求求老天讓我搶到一張原價票」、「大家一起集氣搶票成功！」。',
    velocityText: '跨國討論量單日內破 2.5 萬則貼文',
    discussionVolume: '2.5 萬 則貼文',
    sourceBucket: 'small_discovery',
    cluster: {
      threadsDiscussions: [
        '「售票系統希望不要當機，請大家維持良好的讓票秩序。」'
      ]
    },
    updatedAt: '2 小時前'
  },

  // 4. 為你 (Personal Relevance ~ 10-20% 第二層，兼顧全網與個人關聯)
  {
    id: 'hot-11',
    rank: 11,
    title: '松菸當代工藝與手作陶藝展位，平日午後安靜體驗路線推薦',
    category: 'culture',
    categoryLabel: '手作與藝文體驗',
    heatVelocity: 'RISING',
    heatVelocityLabel: '手作生活推薦',
    importance: 3,
    viralness: 3,
    sourceUrl: 'https://www.threads.net/search?q=%E6%9D%BE%E8%8F%B8%20%E9%99%B6%E8%97%9D',
    searchQuery: '松菸 陶藝',
    aiSummary: '松菸台日器物陶藝現場手作釋出平日候補，手作愛好者熱烈轉傳 · 4.8 千 則貼文',
    threadsPostCount: '4.8 千 則貼文',
    sourceAuthorHandle: '@ceramic_life',
    sourceAuthorName: '松菸手作工坊',
    shortExplainer: '松菸台日器物工藝展釋出平日午後候補體驗，天然陶土拉坯與木作器物細節在 Threads 獲得手作愛好者讚譽。',
    whatHappened: '策展單位發布週五平日安靜場次的候補機會，避開人潮、能與創作者一對一對話的體驗備受推崇。',
    whyViral: '現代人追求減法生活與靜心手作，觸碰泥土與自然材質的治癒感在社群引起深度共鳴。',
    whatPeopleSay: '「平日去真的很舒服，沒有週末的推擠，可以好好靜下心摸摸陶土質地」。',
    velocityText: '手作生活圈熱烈轉發，平日時段名額即將額滿',
    discussionVolume: '4.8 千 則貼文',
    sourceBucket: 'for_you',
    cluster: {
      threadsDiscussions: [
        '「無釉柴燒的粗礪質感非常有味道，很適合放在桌上盛裝日常物件。」'
      ]
    },
    personalRelevance: {
      isRelevant: true,
      reason: '你一直有想捏陶與探索手作藝文的想法，這條避開假日人潮的平日路線與你的生活步調非常契合。'
    },
    updatedAt: '15 分鐘前'
  }
];

export const INITIAL_DAILY_LIFE_PLAN: DailyLifePlan = {
  id: 'plan-2026-09-11',
  userId: 'user-default',
  date: '2026.09.11',
  dateKey: '2026-09-11',
  theme: '悠閒慢調的生活提案',
  vibe: '悠閒',
  userOpeningPrompt: '今天想怎麼過？',
  subOpeningNote: '這只是今天的一個版本，可以隨時改。',
  planVersion: 1,
  suggestions: [
    {
      id: 'ls-1',
      type: 'meal',
      title: '喝杯奶茶，慢慢吃早餐',
      description: '給早晨留出充裕的緩衝時間，不必一醒來就急著進入待辦事項。',
      suggestedTime: '09:00',
      duration: '45 分鐘',
      source: 'explicit_wish',
      sourceLabel: '最近想喝奶茶',
      preferenceScore: 95,
      status: 'suggested',
      categoryTag: '早餐茶食'
    },
    {
      id: 'ls-2',
      type: 'meal',
      title: '吃一頓好吃的義大利麵',
      description: '挑一間有自然光、不喧鬧的店，享受一盤熱騰騰的番茄橄欖義大利麵。',
      suggestedTime: '12:00',
      duration: '60 分鐘',
      source: 'explicit_wish',
      sourceLabel: '前幾天提過想吃義大利麵',
      preferenceScore: 92,
      status: 'suggested',
      categoryTag: '午間美味'
    },
    {
      id: 'ls-3',
      type: 'reading',
      title: '找個舒服的地方看一點書',
      description: '帶上一本想看的書，坐在安靜的窗邊或陽台，翻讀幾頁不趕進度。',
      suggestedTime: '15:00',
      duration: '60 分鐘',
      source: 'long_term_preference',
      sourceLabel: '偏好安靜閱讀',
      preferenceScore: 89,
      status: 'suggested',
      categoryTag: '心靈留白'
    },
    {
      id: 'ls-4',
      type: 'free_time',
      title: '這段時間留給你',
      description: '下午還有一點空白，不需要一直有事情做，發呆或小憩都很美好。',
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
      id: 'ls-5',
      type: 'walk',
      title: '出去走走，看看附近有沒有想逛的地方',
      description: '今天台北微風陰天（26°C），涼爽宜人，非常適合在巷弄裡隨心慢步。',
      suggestedTime: '18:00',
      duration: '45 分鐘',
      source: 'weather_context',
      sourceLabel: '微風陰天涼爽',
      preferenceScore: 88,
      status: 'suggested',
      categoryTag: '散步漫遊'
    },
    {
      id: 'ls-6',
      type: 'media',
      title: '留給自己・看一支想看的 YouTube',
      description: '可以看最近收藏的東京下北澤手沖日常，也可以放空什麼都不做。',
      suggestedTime: '20:30',
      duration: '60 分鐘',
      source: 'long_term_preference',
      sourceLabel: '晚間個人節奏',
      preferenceScore: 94,
      status: 'suggested',
      categoryTag: '放鬆時刻'
    }
  ],
  scheduledItems: [
    {
      id: 'fixed-14-17',
      dailyPlanId: 'plan-2026-09-11',
      title: '固定行程：外出專注活動 / 預定公事',
      description: '已排定的固定行程（14:00–17:00），優先保留，重置時不刪除',
      startTime: '14:00',
      endTime: '17:00',
      duration: '3 小時',
      type: 'fixed',
      source: 'fixed_event',
      status: 'scheduled',
      isFixed: true,
      category: 'fixed',
      aiNote: '固定行程：重置或每日重新安排時優先保障',
      createdAt: '2026-09-11T00:00:00.000Z',
      updatedAt: '2026-09-11T00:00:00.000Z'
    }
  ],
  confirmedItems: [],
  fixedItems: [
    {
      id: 'fixed-14-17',
      dailyPlanId: 'plan-2026-09-11',
      title: '固定行程：外出專注活動 / 預定公事',
      description: '已排定的固定行程（14:00–17:00），優先保留，重置時不刪除',
      startTime: '14:00',
      endTime: '17:00',
      duration: '3 小時',
      type: 'fixed',
      source: 'fixed_event',
      status: 'scheduled',
      isFixed: true,
      category: 'fixed',
      aiNote: '固定行程：重置或每日重新安排時優先保障',
      createdAt: '2026-09-11T00:00:00.000Z',
      updatedAt: '2026-09-11T00:00:00.000Z'
    }
  ],
  freeTimeBlocks: [
    {
      id: 'ft-1',
      start: '13:00',
      end: '14:30',
      durationMinutes: 90,
      note: '午後空白留白'
    },
    {
      id: 'ft-2',
      start: '17:00',
      end: '18:00',
      durationMinutes: 60,
      note: '傍晚這段時間留給你'
    }
  ],
  rejectedSuggestions: [],
  generatedAt: '2026-09-11 08:00',
  updatedAt: '2026-09-11 08:00'
};

