import React, { useState } from 'react';
import { useLife } from '../context/LifeContext';
import { TimeOfDayPeriod } from '../types';
import { ContextualReminderWidget } from './ContextualReminderWidget';

export const HomeView: React.FC = () => {
  const {
    taipeiTimeStr,
    taipeiDateStr,
    taipeiDayOfWeek,
    timeOfDay,
    timeOfDayText,
    timeAtmosphereQuote,
    simulatedPeriod,
    setSimulatedPeriod,
    weather,
    dailyPlan,
    toggleTimeSlot,
    recommendations,
    handleRecommendationFeedback,
    newsItems,
    threadsPosts,
    threadsTopics,
    eventClusters,
    threadsHotItems,
    ideas,
    memories,
    setActiveTab,
    openRescheduleModal,
    setIsNewItemModalOpen,
    scheduleIdeaToToday
  } = useLife();

  const [nowActiveTab, setNowActiveTab] = useState<'hot' | 'clusters' | 'news' | 'threads'>('hot');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedExplainerId, setExpandedExplainerId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isNowExpanded, setIsNowExpanded] = useState<boolean>(false);

  // Dynamic layout weighting based on schedule & time of day
  const isEveningOrNight = timeOfDay === 'evening' || timeOfDay === 'midnight';
  const isMorning = timeOfDay === 'early_morning' || timeOfDay === 'morning';

  // Categorize threadsHotItems according to the user's ratio guidelines
  const nationalHotList = threadsHotItems.filter(
    (i) => i.sourceBucket === 'everyone_talking' || i.heatVelocity === 'HOT' || (i.rank && i.rank <= 5) || i.isNationalHot
  );
  const risingList = threadsHotItems.filter(
    (i) => (i.sourceBucket === 'rising_fast' || i.heatVelocity === 'RISING' || i.isRising) &&
      !nationalHotList.some((n) => n.id === i.id)
  );
  const forYouList = threadsHotItems.filter(
    (i) => Boolean(i.personalRelevance?.isRelevant) || i.sourceBucket === 'for_you' || i.isForYou
  );

  const filteredItems = threadsHotItems.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'RISING') return item.sourceBucket === 'rising_fast' || item.heatVelocity === 'RISING' || item.isRising;
    if (selectedCategory === 'HOT') return item.sourceBucket === 'everyone_talking' || item.heatVelocity === 'HOT' || item.isNationalHot;
    if (selectedCategory === 'FOR_YOU') return Boolean(item.personalRelevance?.isRelevant) || item.sourceBucket === 'for_you' || item.isForYou;
    return item.category === selectedCategory;
  });

  // Next upcoming or current activity
  const upcomingSlot = dailyPlan.timeline.find((slot) => !slot.completed);

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-8 text-[#2B2826] space-y-12 animate-in fade-in duration-300">
      {/* 1. Masthead: Soft Organic Atmosphere & Taipei Time */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-utility text-[11px] tracking-widest uppercase text-[#436259] bg-[#E2ECE8] px-3 py-1 rounded-full font-medium">
                ASIA / TAIPEI
              </span>
              <span className="font-utility text-[11px] text-[#685F5B] px-3 py-1 rounded-full bg-[#EFECE2]/70">
                {timeOfDayText}時段
              </span>
              <span className="font-reading text-xs text-[#685F5B] px-3 py-1 rounded-full bg-[#EFECE2]/70">
                {weather.city} {weather.temp}°C · {weather.condition}
              </span>
              <span className="font-reading text-xs text-[#74484E] px-3.5 py-1 rounded-full bg-[#EADCD9]/70 font-medium">
                自由留白：{dailyPlan.freeTimeHours} 小時
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 pt-1">
              <span className="font-utility text-5xl sm:text-7xl font-light tracking-tight text-[#2B2826]">
                {taipeiTimeStr}
              </span>
              <div className="font-display text-lg sm:text-xl text-[#685F5B] pb-1">
                {taipeiDateStr} ｜ {taipeiDayOfWeek}
              </div>
            </div>
          </div>

          {/* Time period switcher as soft pills */}
          <div className="flex flex-col items-start lg:items-end gap-2">
            <span className="font-utility text-[10px] text-[#9E938D] uppercase tracking-wider">
              時段氛圍體驗
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(
                [
                  ['natural', '即時', null],
                  ['morning', '清晨', 'early_morning'],
                  ['noon', '午後', 'afternoon'],
                  ['evening', '夜晚', 'evening'],
                  ['midnight', '深夜', 'midnight']
                ] as const
              ).map(([key, label, val]) => (
                <button
                  key={key}
                  onClick={() => setSimulatedPeriod(val as TimeOfDayPeriod | null)}
                  className={`font-utility text-[11px] px-3 py-1 rounded-full transition-all duration-180 cursor-pointer ${
                    simulatedPeriod === val || (val === null && simulatedPeriod === null)
                      ? 'bg-[#2B2826] text-white font-medium shadow-xs'
                      : 'bg-[#FCFAF6] text-[#685F5B] border border-[#E5DFD5] hover:bg-[#F2EFE7]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Atmosphere Quote Pill Bubble */}
        <div className="p-6 rounded-[26px] bg-[#FCFAF6] border border-[#E5DFD5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200">
          <div className="space-y-1">
            <div className="font-utility text-[10px] uppercase text-[#74484E] tracking-widest font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C09D9B]" />
              PACING TONE · 當下心境
            </div>
            <p className="font-display text-base sm:text-lg text-[#2B2826] leading-relaxed">
              「{timeAtmosphereQuote}」
            </p>
          </div>

          <div className="font-reading text-xs text-[#685F5B] shrink-0 sm:border-l sm:pl-5 border-[#E5DFD5]">
            今天身心狀態：
            <span className="font-utility text-sm font-semibold text-[#2B2826] ml-1">
              節奏舒適
            </span>
            <div className="text-[11px] text-[#9E938D]">隨時保有屬於自己的自由</div>
          </div>
        </div>

        {/* Contextual Life Reminders */}
        <ContextualReminderWidget />
      </section>

      {/* 2. THE LIFE BUBBLE SPACE (生活發想泡泡) */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-utility text-xs text-[#74484E] bg-[#EADCD9]/60 px-3.5 py-1 rounded-full uppercase tracking-wider font-medium inline-block">
              LIFE BUBBLE SPACE · 生活發想空間
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#2B2826] font-normal">
              今天的生活泡泡
            </h2>
          </div>
        </div>

        {/* Organic Asymmetrical Bubble Cluster */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8 items-start">
          {/* ========================================================= */}
          {/* BUBBLE P0/P1: TODAY FOCUS & NEXT THING (7 cols, bubble-xl) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 p-7 sm:p-9 rounded-[32px] bg-[#FCFAF6] border border-[#E5DFD5] shadow-xs space-y-7 transition-all duration-200 hover:shadow-sm">
            <div className="flex items-baseline justify-between border-b border-[#EFECE5] pb-4">
              <div className="space-y-1">
                <span className="font-utility text-xs text-[#436259] bg-[#E2ECE8] px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                  TODAY FOCUS · 我的現在與下一件事
                </span>
                <h3 className="font-display text-xl sm:text-2xl text-[#2B2826] font-normal mt-1">
                  今日生活節奏
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('today')}
                className="font-utility text-xs text-[#685F5B] hover:text-[#2B2826] px-3.5 py-1.5 rounded-full bg-[#EFECE2]/60 hover:bg-[#EAE4D7] transition-all cursor-pointer"
              >
                進入完整時間軸 →
              </button>
            </div>

            {/* Next Thing / Current Highlight Card */}
            {upcomingSlot ? (
              <div className="p-5 rounded-[22px] bg-[#F7F5EE] border border-[#E5DFD5] space-y-2">
                <div className="flex items-center justify-between font-utility text-xs text-[#74484E]">
                  <span className="font-semibold uppercase tracking-wider">
                    NEXT · 下一件事
                  </span>
                  <span>{upcomingSlot.time} ({upcomingSlot.durationMinutes} 分鐘)</span>
                </div>
                <div className="font-display text-lg text-[#2B2826] font-medium">
                  {upcomingSlot.title}
                </div>
                {upcomingSlot.aiNote && (
                  <p className="font-reading text-xs text-[#685F5B] leading-relaxed">
                    {upcomingSlot.aiNote}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-5 rounded-[22px] bg-[#F7F5EE] border border-[#E5DFD5] space-y-2">
                <div className="font-utility text-xs text-[#436259] font-semibold uppercase tracking-wider">
                  PEACEFUL MOMENT · 今天留了一點空間
                </div>
                <p className="font-reading text-sm text-[#2B2826]">
                  今天目前比較空。你可以挑一件最近想做的小事，或是好好享受這段不受打擾的留白。
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setActiveTab('ideas')}
                    className="font-utility text-xs px-3.5 py-1.5 rounded-full bg-[#EADCD9] text-[#74484E] hover:bg-[#C09D9B] hover:text-[#2B2826] transition-all font-medium cursor-pointer"
                  >
                    翻翻想做的事
                  </button>
                  <button
                    onClick={() => setActiveTab('ai')}
                    className="font-utility text-xs px-3.5 py-1.5 rounded-full bg-[#FCFAF6] text-[#685F5B] border border-[#E5DFD5] hover:bg-[#F2EFE7] transition-all cursor-pointer"
                  >
                    找 77 聊聊
                  </button>
                </div>
              </div>
            )}

            {/* Today Schedule Timeline items */}
            <div className="space-y-3">
              <div className="font-utility text-xs text-[#9E938D] uppercase tracking-wider">
                今日時段流
              </div>
              {dailyPlan.timeline.slice(0, 4).map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => toggleTimeSlot(slot.id)}
                  className={`p-4 rounded-[20px] border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                    slot.completed
                      ? 'border-[#E5DFD5] bg-[#EFECE5]/60 opacity-70'
                      : slot.isFreeTime
                      ? 'border border-dashed border-[#8FA59F] bg-[#E2ECE8]/40 hover:bg-[#E2ECE8]/70'
                      : 'border border-[#E5DFD5] bg-white hover:border-[#C09D9B] shadow-2xs'
                  }`}
                >
                  <span className="font-utility text-xs text-[#685F5B] font-semibold w-12 shrink-0 pt-0.5">
                    {slot.time}
                  </span>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span
                        className={`font-reading text-sm ${
                          slot.completed
                            ? 'line-through text-[#9E938D]'
                            : slot.isFreeTime
                            ? 'text-[#436259] font-medium'
                            : 'text-[#2B2826] font-medium'
                        }`}
                      >
                        {slot.title}
                      </span>
                      {slot.durationMinutes && (
                        <span className="font-utility text-[10px] text-[#9E938D]">
                          {slot.durationMinutes}m
                        </span>
                      )}
                    </div>

                    {slot.aiNote && (
                      <p className="font-reading text-xs text-[#685F5B] leading-relaxed">
                        {slot.aiNote}
                      </p>
                    )}
                  </div>

                  <div className="pt-1">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        slot.completed
                          ? 'bg-[#9E938D]'
                          : slot.isFreeTime
                          ? 'bg-[#436259]'
                          : 'bg-[#C09D9B]'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Incomplete Task alert with Reschedule */}
            {dailyPlan.topImportantTasks.some((t) => t.status === 'todo') && (
              <div className="p-4 rounded-[20px] bg-[#F3E9DF]/70 border border-[#E6D7C8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-utility text-[10px] uppercase text-[#785642] tracking-wide font-semibold">
                    SMART RESCHEDULE · 彈性調整
                  </div>
                  <p className="font-reading text-xs text-[#5E4435]">
                    若有待辦事項今天來不及完成，不用感到負擔，隨時可延期或拆小。
                  </p>
                </div>
                <button
                  onClick={() => {
                    const target = dailyPlan.topImportantTasks.find((t) => t.status === 'todo');
                    if (target) openRescheduleModal(target);
                  }}
                  className="font-utility text-xs px-3.5 py-1.5 bg-[#785642] text-white rounded-full hover:bg-[#5E4435] transition-all shrink-0 self-start sm:self-auto cursor-pointer shadow-xs"
                >
                  調整待辦
                </button>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: AI BUBBLE & YOUTUBE / IDEAS (5 cols) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-7">
            {/* BUBBLE P2: 77 AI COMPANION BUBBLE (organic-1 shape) */}
            <div className="p-7 rounded-[30px] bg-[#EADCD9]/50 border border-[#DEC8C4] shadow-xs space-y-4 transition-all duration-200 hover:shadow-sm">
              <div className="flex items-baseline justify-between border-b border-[#DEC8C4]/70 pb-3">
                <div className="space-y-0.5">
                  <span className="font-utility text-xs text-[#74484E] uppercase tracking-wider font-semibold">
                    77 COMPANION · 溫和陪伴
                  </span>
                  <div className="font-display text-lg text-[#2B2826] font-normal">
                    陪伴推薦
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('ai')}
                  className="font-utility text-xs text-[#74484E] hover:underline cursor-pointer"
                >
                  AI 筆記 →
                </button>
              </div>

              {/* Natural friendly AI voice prompt */}
              <div className="font-reading text-sm text-[#2B2826] leading-relaxed bg-[#FCFAF6] p-4 rounded-[20px] border border-[#DEC8C4]">
                「我發現下午有一段空檔。要不要放一件你最近想做的事？」
              </div>

              {recommendations.slice(0, 1).map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-[22px] bg-white border border-[#E5DFD5] space-y-3 shadow-2xs"
                >
                  <div className="flex items-baseline justify-between font-utility text-[11px] text-[#74484E]">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EADCD9] font-medium">
                      {rec.level}
                    </span>
                    <span>適合度 {rec.score}%</span>
                  </div>

                  <h4 className="font-display text-base text-[#2B2826] font-medium">
                    {rec.title}
                  </h4>

                  <p className="font-reading text-xs text-[#685F5B] leading-relaxed">
                    {rec.why}
                  </p>

                  <div className="font-utility text-[11px] text-[#9E938D]">
                    建議時段：{rec.suitableTime} · {rec.estimatedDuration}
                  </div>

                  {/* Gentle Action Pills: [安排] [先放著] */}
                  <div className="pt-2 border-t border-[#EFECE5] flex items-center justify-between text-xs font-reading">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRecommendationFeedback(rec.id, '安排')}
                        className="font-utility text-xs px-3.5 py-1.5 bg-[#C09D9B] text-[#2B2826] rounded-full hover:bg-[#b08b89] transition-all font-medium cursor-pointer shadow-xs"
                      >
                        安排
                      </button>
                      <button
                        onClick={() => handleRecommendationFeedback(rec.id, '先不用')}
                        className="font-utility text-xs px-3.5 py-1.5 bg-[#F7F5EE] text-[#685F5B] border border-[#E5DFD5] rounded-full hover:bg-[#EDE9DE] transition-all cursor-pointer"
                      >
                        先放著
                      </button>
                    </div>

                    <button
                      onClick={() => handleRecommendationFeedback(rec.id, '不再推薦')}
                      className="font-utility text-[11px] text-[#9E938D] hover:text-[#74484E] cursor-pointer"
                    >
                      不再推薦
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* BUBBLE P4: YOUTUBE 泡泡 (Real title, channel, duration, scheduled time) */}
            <div className="p-6 rounded-[28px] bg-[#F3E9DF]/60 border border-[#E6D7C8] shadow-xs space-y-3.5 transition-all duration-200">
              <div className="flex items-baseline justify-between">
                <span className="font-utility text-xs text-[#785642] uppercase tracking-wider font-semibold">
                  YOUTUBE · 隨心影音
                </span>
                <span className="font-utility text-[11px] text-[#785642] bg-[#F3E9DF] px-2.5 py-0.5 rounded-full border border-[#E6D7C8]">
                  今晚 20:30 看
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-display text-base text-[#2B2826] font-medium leading-snug">
                  東京下北澤獨立咖啡店日常：手沖與空間紀錄
                </h4>
                <p className="font-reading text-xs text-[#685F5B] leading-relaxed">
                  頻道：慢步調日誌 · 時長約 24 分鐘 · 適合晚餐後或睡前安靜觀看
                </p>
              </div>

              <div className="pt-2 border-t border-[#E6D7C8]/70 flex items-center justify-between text-xs font-utility">
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#785642] hover:underline"
                >
                  前往 YouTube 觀看 ↗
                </a>
                <button
                  onClick={() => scheduleIdeaToToday('yt-coffee', '20:30')}
                  className="px-3 py-1 rounded-full bg-[#FCFAF6] text-[#785642] border border-[#E6D7C8] hover:bg-[#F3E9DF] transition-all cursor-pointer"
                >
                  排入今晚
                </button>
              </div>
            </div>

            {/* BUBBLE P5: IDEAS SNIPPET (想法泡泡) */}
            <div className="p-6 rounded-[28px] bg-[#FCFAF6] border border-[#E5DFD5] shadow-xs space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="font-utility text-xs text-[#74484E] uppercase tracking-wider font-semibold">
                  IDEAS · 想做的事
                </span>
                <button
                  onClick={() => setActiveTab('ideas')}
                  className="font-utility text-xs text-[#685F5B] hover:text-[#2B2826] cursor-pointer"
                >
                  全部 ({ideas.length}) →
                </button>
              </div>

              <div className="space-y-2.5">
                {ideas.slice(0, 3).map((idea) => (
                  <div
                    key={idea.id}
                    className="p-3 rounded-[16px] bg-[#F7F5EE] border border-[#E5DFD5] flex items-center justify-between gap-3 text-xs font-reading"
                  >
                    <div className="space-y-0.5 truncate">
                      <div className="font-medium text-[#2B2826] truncate">
                        {idea.title}
                      </div>
                      <div className="font-utility text-[10px] text-[#9E938D]">
                        {idea.category}
                      </div>
                    </div>
                    <button
                      onClick={() => scheduleIdeaToToday(idea.id, '16:00')}
                      className="font-utility text-[11px] text-[#74484E] hover:text-[#2B2826] px-2.5 py-1 rounded-full bg-[#EADCD9]/50 hover:bg-[#EADCD9] transition-all shrink-0 cursor-pointer"
                    >
                      排入今日
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BUBBLE P6: 全網趨勢泡泡 (預設收納成一個精緻泡泡，點擊後展開) */}
      <section className="p-7 sm:p-8 rounded-[30px] bg-[#FCFAF6] border border-[#E5DFD5] shadow-xs space-y-5 transition-all duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C09D9B] animate-pulse" />
              <span className="font-utility text-xs text-[#74484E] bg-[#EADCD9]/60 px-3 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                P6 TREND BUBBLE · 全網趨勢泡泡
              </span>
              <span className="font-utility text-[11px] text-[#9E938D] hidden sm:inline">
                全網熱門 65% · 快速升溫 20% · 為你 15%
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-[#2B2826] font-normal">
              現在大家正在聊什麼
            </h3>
            <p className="font-reading text-xs text-[#685F5B]">
              不囿於個人偏好泡泡，第一時間理解 Threads 與台灣社會正在討論的焦點。
            </p>
          </div>

          <button
            onClick={() => setIsNowExpanded(!isNowExpanded)}
            className="font-utility text-xs px-4 py-2 rounded-full bg-[#EADCD9] text-[#74484E] hover:bg-[#C09D9B] hover:text-[#2B2826] transition-all font-medium cursor-pointer self-start md:self-auto shrink-0 shadow-xs"
          >
            {isNowExpanded ? '收起趨勢泡泡 ↑' : `展開全網話題 (${threadsHotItems.length} 則焦點) ↓`}
          </button>
        </div>

        {/* Preview pills when collapsed */}
        {!isNowExpanded && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#EFECE5]">
            {threadsHotItems.slice(0, 3).map((item) => (
              <span
                key={item.id}
                onClick={() => setIsNowExpanded(true)}
                className="font-reading text-xs text-[#2B2826] bg-[#F7F5EE] border border-[#E5DFD5] px-3.5 py-1.5 rounded-full hover:border-[#C09D9B] cursor-pointer transition-all truncate max-w-xs"
              >
                #{item.title}
              </span>
            ))}
            <button
              onClick={() => setIsNowExpanded(true)}
              className="font-utility text-xs text-[#74484E] hover:underline px-2 py-1 cursor-pointer"
            >
              + 更多焦點
            </button>
          </div>
        )}

        {/* Full content when expanded */}
        {isNowExpanded && (
          <div className="space-y-6 pt-3 border-t border-[#EFECE5] animate-in fade-in duration-200">
            {/* Top Level Section Tabs as soft pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setNowActiveTab('hot')}
                className={`font-utility text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  nowActiveTab === 'hot'
                    ? 'bg-[#2B2826] text-white font-medium shadow-xs'
                    : 'bg-[#FCFAF6] text-[#685F5B] border border-[#E5DFD5] hover:bg-[#F2EFE7]'
                }`}
              >
                Threads 全網熱門 ({threadsHotItems.length})
              </button>
              <button
                onClick={() => setNowActiveTab('clusters')}
                className={`font-utility text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  nowActiveTab === 'clusters'
                    ? 'bg-[#2B2826] text-white font-medium shadow-xs'
                    : 'bg-[#FCFAF6] text-[#685F5B] border border-[#E5DFD5] hover:bg-[#F2EFE7]'
                }`}
              >
                事件聚類 ({eventClusters.length})
              </button>
              <button
                onClick={() => setNowActiveTab('news')}
                className={`font-utility text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  nowActiveTab === 'news'
                    ? 'bg-[#2B2826] text-white font-medium shadow-xs'
                    : 'bg-[#FCFAF6] text-[#685F5B] border border-[#E5DFD5] hover:bg-[#F2EFE7]'
                }`}
              >
                新聞事實 ({newsItems.length})
              </button>
              <button
                onClick={() => setNowActiveTab('threads')}
                className={`font-utility text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  nowActiveTab === 'threads'
                    ? 'bg-[#2B2826] text-white font-medium shadow-xs'
                    : 'bg-[#FCFAF6] text-[#685F5B] border border-[#E5DFD5] hover:bg-[#F2EFE7]'
                }`}
              >
                社群原聲 ({threadsPosts.length})
              </button>
            </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: THREADS HOT & VIRAL (Primary Requested Module) */}
        {/* ------------------------------------------------------------- */}
        {nowActiveTab === 'hot' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Category & Stream Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-utility">
              <span className="text-[#78694B] text-[11px] shrink-0 mr-1 font-semibold">篩選視角：</span>
              {[
                { id: 'ALL', label: '全部焦點' },
                { id: 'HOT', label: '大家都在聊' },
                { id: 'RISING', label: '快速升溫' },
                { id: 'NEWS', label: '新聞型' },
                { id: 'COMMUNITY', label: '社群爭議' },
                { id: 'LIFESTYLE', label: '生活店家' },
                { id: 'CULTURE', label: '文化展演' },
                { id: 'MEME', label: '網路迷因' },
                { id: 'MICRO_EVENT', label: '小小發現' },
                { id: 'FOR_YOU', label: '為你相關' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#1F1E1D] text-white font-semibold shadow-xs'
                      : 'bg-[#FFFFFF] text-[#544621] border border-[#D5C7A2] hover:bg-[#FAF4E4]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* If user hasn't filtered to a specific category, show the curated Editorial sections */}
            {selectedCategory === 'ALL' ? (
              <div className="space-y-10">
                {/* SECTION A: 大家現在都在聊 (Taiwan Top Heat: 60-70%) */}
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-[#D4C5A0] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-utility text-xs text-[#7A6027] tracking-wider uppercase font-bold">
                        SECTION 01 · 大家現在都在聊
                      </span>
                      <span className="text-[#C8B896]">·</span>
                      <span className="font-reading text-xs text-[#6E5D38] font-medium">
                        全台討論度最高與大量轉發之事件
                      </span>
                    </div>
                    <span className="font-utility text-[11px] text-[#8C7A53] font-medium">
                      全站熱度排序
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {nationalHotList.map((item, index) => {
                      const isExplainerOpen = expandedExplainerId === item.id;
                      return (
                        <div
                          key={item.id}
                          className="p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#D8CEB7] shadow-sm hover:shadow-md hover:border-[#8F7432] transition-all space-y-4 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-utility text-xs font-bold text-[#594416] bg-[#F8F1DC] border border-[#DCCE9E] px-2 py-0.5 rounded">
                                  0{index + 1}
                                </span>
                                <span className="font-utility text-[10px] px-2 py-0.5 rounded bg-[#F3ECD4] text-[#59481E] border border-[#DFD2AC] uppercase font-semibold">
                                  {item.categoryLabel}
                                </span>
                                {(item.velocity === 'BREAKING' || item.heatVelocity === 'BREAKING') && (
                                  <span className="font-utility text-[10px] px-1.5 py-0.5 rounded bg-[#FBEAE7] text-[#933D2D] border border-[#EACAC4] font-medium">
                                    突發變化中
                                  </span>
                                )}
                                {(item.velocity === 'HOT' || item.heatVelocity === 'HOT') && (
                                  <span className="font-utility text-[10px] px-1.5 py-0.5 rounded bg-[#FAF1DA] text-[#785915] border border-[#E7D6A9] font-medium">
                                    全網爆紅
                                  </span>
                                )}
                                {(item.velocity === 'CONTINUING' || item.heatVelocity === 'CONTINUING') && (
                                  <span className="font-utility text-[10px] px-1.5 py-0.5 rounded bg-[#EFEAE0] text-[#574E40] border border-[#DCD3C3] font-medium">
                                    持續熱議
                                  </span>
                                )}
                              </div>

                              {/* Threads 原文網址按鈕 */}
                              {item.sourceUrl && (
                                <a
                                  href={item.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181818] text-white text-[10px] font-utility font-medium hover:bg-[#383838] transition-all shadow-xs shrink-0 cursor-pointer"
                                  title="在新分頁開啟 Threads 原文"
                                >
                                  <span>Threads 原文</span>
                                  <svg className="w-3 h-3 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              )}
                            </div>

                            {/* Author Source */}
                            {item.sourceAuthorHandle && (
                              <div className="flex items-center gap-1 text-[11px] text-[#7A6A4C] pt-0.5">
                                <span className="text-[#8C7A53]">原串作者：</span>
                                <a
                                  href={item.sourceUrl || `https://www.threads.net/${item.sourceAuthorHandle}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-utility font-semibold text-[#1F1E1D] hover:underline"
                                >
                                  {item.sourceAuthorHandle}
                                </a>
                                {item.sourceAuthorName && (
                                  <span className="text-[#87785B]">({item.sourceAuthorName})</span>
                                )}
                              </div>
                            )}

                            <h3 className="font-display text-base text-[#1C1A18] font-semibold leading-snug">
                              {item.title}
                            </h3>

                            {/* Why viral snippet */}
                            <div className="p-3.5 rounded-xl bg-[#F8F5EC] border border-[#DED2BA] space-y-1.5 text-xs font-reading">
                              <div className="flex items-center justify-between">
                                <span className="font-utility text-[10px] text-[#695427] uppercase font-bold">
                                  為什麼突然紅？
                                </span>
                                <button
                                  onClick={() =>
                                    setExpandedExplainerId(
                                      isExplainerOpen ? null : item.id
                                    )
                                  }
                                  className="font-utility text-[10px] text-[#7A6027] hover:text-[#1F1E1D] underline font-medium cursor-pointer"
                                >
                                  {isExplainerOpen ? '收合脈絡 ▲' : '這是什麼？ ▼'}
                                </button>
                              </div>
                              <p className="text-[#3A3222] leading-relaxed">
                                {item.whyViral}
                              </p>
                            </div>

                            {/* Expandable "What is this?" complete explainer */}
                            {isExplainerOpen && (
                              <div className="p-4 rounded-xl bg-[#F4EEE0] border-2 border-[#D4C39B] space-y-3 text-xs font-reading animate-in fade-in">
                                <div className="space-y-1">
                                  <span className="font-utility text-[10px] text-[#695427] font-bold block">
                                    事件始末概要
                                  </span>
                                  <p className="text-[#2B2418] leading-relaxed">
                                    {item.whatHappened}
                                  </p>
                                </div>
                                <div className="space-y-1 pt-2 border-t border-[#DFD1B3]">
                                  <span className="font-utility text-[10px] text-[#695427] font-bold block">
                                    大家正在說什麼？
                                  </span>
                                  <p className="text-[#4F432E] leading-relaxed italic">
                                    "{item.whatPeopleSay || item.cluster?.threadsDiscussions?.[0] || '大家熱烈討論中'}"
                                  </p>
                                </div>

                                {item.sourceUrl && (
                                  <div className="pt-2 border-t border-[#DFD1B3] flex items-center justify-between gap-2 flex-wrap">
                                    <a
                                      href={item.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 text-xs font-utility font-bold text-[#1F1E1D] hover:text-[#7A6027] transition-colors"
                                    >
                                      <span>前往 Threads 原文討論（共 {item.discussionVolume}）↗</span>
                                    </a>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(item.sourceUrl || '');
                                        setCopiedId(item.id);
                                        setTimeout(() => setCopiedId(null), 2000);
                                      }}
                                      className="text-[11px] font-utility text-[#7A6027] hover:text-[#1F1E1D] hover:underline cursor-pointer font-medium"
                                    >
                                      {copiedId === item.id ? '✓ 已複製網址' : '複製原文網址'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Bottom metadata: Importance vs Heat & Sources */}
                          <div className="pt-3 border-t border-[#E5DAC3] flex items-center justify-between font-utility text-[10px] text-[#78663F]">
                            <div className="flex items-center gap-3 font-medium">
                              <span>熱度 {item.viralness || item.heatLevel || 5}/5</span>
                              <span>·</span>
                              <span>社會重要度 {item.importance || item.importanceLevel || 3}/5</span>
                            </div>
                            <span className="font-semibold text-[#544621]">{item.discussionVolume || `${(item.relatedPostsCount || 0).toLocaleString()} 則討論`}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION B: 正在快速升溫 (Rising: 15-20%) */}
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-[#D4C5A0] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-utility text-xs text-[#7A6027] tracking-wider uppercase font-bold">
                        SECTION 02 · 正在快速升溫
                      </span>
                      <span className="text-[#C8B896]">·</span>
                      <span className="font-reading text-xs text-[#6E5D38] font-medium">
                        近兩小時內擴散速度急遽攀升的話題
                      </span>
                    </div>
                    <span className="font-utility text-[11px] text-[#8C7A53] font-medium">
                      短時間暴量
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {risingList.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#D8CEB7] shadow-sm hover:shadow-md hover:border-[#8F7432] transition-all flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-utility text-[10px] px-2 py-0.5 rounded bg-[#F3ECD4] text-[#59481E] border border-[#DFD2AC] font-semibold">
                                {item.categoryLabel}
                              </span>
                              <span className="font-utility text-[10px] text-[#964B30] bg-[#FAECE8] border border-[#EAC6BF] px-1.5 py-0.5 rounded font-semibold">
                                {item.velocityText || '升溫速度 +85%'}
                              </span>
                            </div>

                            {item.sourceUrl && (
                              <a
                                href={item.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181818] text-white text-[10px] font-utility font-medium hover:bg-[#383838] transition-all shadow-xs shrink-0 cursor-pointer"
                                title="在新分頁開啟 Threads 原文"
                              >
                                <span>Threads 原文</span>
                                <svg className="w-3 h-3 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>

                          {item.sourceAuthorHandle && (
                            <div className="flex items-center gap-1 text-[11px] text-[#7A6A4C]">
                              <span className="text-[#8C7A53]">原串作者：</span>
                              <a
                                href={item.sourceUrl || `https://www.threads.net/${item.sourceAuthorHandle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-utility font-semibold text-[#1F1E1D] hover:underline"
                              >
                                {item.sourceAuthorHandle}
                              </a>
                              {item.sourceAuthorName && (
                                <span className="text-[#87785B]">({item.sourceAuthorName})</span>
                              )}
                            </div>
                          )}

                          <h4 className="font-display text-base text-[#1C1A18] font-semibold">
                            {item.title}
                          </h4>

                          <p className="font-reading text-xs text-[#483E2C] leading-relaxed">
                            {item.whyViral}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-[#E5DAC3] font-utility text-[10px] text-[#78663F]">
                          <span className="truncate mr-2 font-reading">社群原聲：{item.whatPeopleSay || item.cluster?.threadsDiscussions?.[0]}</span>
                          <span className="shrink-0 font-medium">{item.updatedTime || item.updatedAt || '剛更新'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION C: 為你相關 (For You: 10-15%) */}
                <div className="space-y-3 p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#D8C7B0] shadow-sm">
                  <div className="flex items-baseline justify-between border-b border-[#DFD1B8] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-utility text-xs text-[#735338] tracking-wider uppercase font-bold">
                        SECTION 03 · 為你相關
                      </span>
                      <span className="text-[#C8B896]">·</span>
                      <span className="font-reading text-xs text-[#634E39] font-medium">
                        與你的日常、手作或展覽偏好有交集的熱議內容
                      </span>
                    </div>
                    <span className="font-utility text-[10px] text-[#85725E] font-medium">
                      個人化推薦限制在 15% 內
                    </span>
                  </div>

                  <div className="space-y-3 pt-1">
                    {forYouList.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-[#FAF6EE] border border-[#DDD0B8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#BFAF94] transition-all"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-utility text-[10px] bg-[#EAE0D0] border border-[#D5C6B1] px-1.5 py-0.5 rounded text-[#4E3E2E] font-semibold">
                              {item.categoryLabel}
                            </span>
                            <span className="font-display text-sm text-[#1C1A18] font-semibold">
                              {item.title}
                            </span>
                            {item.sourceAuthorHandle && (
                              <span className="font-utility text-[11px] text-[#786950]">
                                by {item.sourceAuthorHandle}
                              </span>
                            )}
                          </div>
                          <p className="font-reading text-xs text-[#5E4F3E]">
                            {item.personalRelevance?.reason || item.forYouReason || item.whyViral}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-utility text-[11px] text-[#735338] font-semibold">
                            {item.discussionVolume || `${(item.relatedPostsCount || 0).toLocaleString()} 則討論`}
                          </span>
                          {item.sourceUrl && (
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#181818] text-white text-[10px] font-utility font-medium hover:bg-[#383838] transition-all shadow-2xs"
                            >
                              <span>Threads 原文 ↗</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Filtered View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#D8CEB7] shadow-sm hover:shadow-md space-y-3 flex flex-col justify-between transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-utility text-[10px] px-2 py-0.5 rounded bg-[#F3ECD4] text-[#59481E] border border-[#DFD2AC] font-semibold">
                          {item.categoryLabel}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-utility text-[10px] text-[#7A6A4C] font-medium">
                            熱度 {item.viralness || item.heatLevel || 5}/5
                          </span>
                          {item.sourceUrl && (
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#181818] text-white text-[9px] font-utility font-medium hover:bg-[#383838] transition-all"
                            >
                              <span>原文 ↗</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {item.sourceAuthorHandle && (
                        <div className="text-[11px] text-[#7A6A4C]">
                          <span className="text-[#8C7A53]">作者：</span>
                          <a
                            href={item.sourceUrl || `https://www.threads.net/${item.sourceAuthorHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-utility font-semibold text-[#1F1E1D] hover:underline"
                          >
                            {item.sourceAuthorHandle}
                          </a>
                        </div>
                      )}

                      <h4 className="font-display text-base text-[#1C1A18] font-semibold leading-snug">
                        {item.title}
                      </h4>

                      <div className="p-3 rounded-lg bg-[#F8F5EC] border border-[#DED2BA] space-y-1 text-xs font-reading">
                        <span className="font-utility text-[10px] text-[#695427] font-bold block">
                          為什麼爆紅
                        </span>
                        <p className="text-[#3A3222] leading-relaxed">
                          {item.whyViral}
                        </p>
                      </div>

                      <p className="font-reading text-xs text-[#524632] leading-relaxed">
                        {item.whatHappened}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#E5DAC3] flex items-center justify-between font-utility text-[10px] text-[#78663F]">
                      <span className="font-semibold text-[#544621]">{item.discussionVolume || `${(item.relatedPostsCount || 0).toLocaleString()} 則討論`}</span>
                      <span>{item.updatedTime || item.updatedAt || '剛更新'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: EVENT CLUSTERS (Fact vs Threads vs Official) */}
        {/* ------------------------------------------------------------- */}
        {nowActiveTab === 'clusters' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#D8CEB7] shadow-2xs text-xs font-reading text-[#4A3E26] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-medium">
                聚類原則：嚴格區分「客觀事實」與「社群原聲觀點」，Threads 貼文不代表已確認的報導事實。
              </span>
              <span className="font-utility text-[10px] text-[#7A6027] font-bold uppercase tracking-wider bg-[#F8F1DC] border border-[#DCCE9E] px-2 py-0.5 rounded shrink-0">
                VERIFICATION PRINCIPLE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eventClusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="p-6 rounded-2xl bg-[#FFFFFF] border-2 border-[#D8CEB7] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="font-utility text-[10px] text-[#695427] font-bold uppercase tracking-wider bg-[#F5EDD6] border border-[#DFD1AD] px-2 py-0.5 rounded">
                        EVENT CLUSTER
                      </span>
                      <span className="font-utility text-[10px] text-[#8C7A53] font-medium">
                        更新於 {cluster.updatedAt}
                      </span>
                    </div>

                    <h3 className="font-display text-lg text-[#1C1A18] font-semibold leading-snug">
                      {cluster.clusterTitle}
                    </h3>

                    {/* News fact vs Threads separation */}
                    <div className="space-y-2 pt-1 text-xs font-reading">
                      <div className="p-3.5 rounded-xl bg-[#F6EFE2] border border-[#DFD1B8] space-y-1.5">
                        <span className="font-utility text-[10px] text-[#695427] uppercase block font-bold">
                          客觀新聞事實
                        </span>
                        {cluster.newsFacts.map((fact, idx) => (
                          <p key={idx} className="text-[#322A1C] leading-relaxed">
                            · {fact}
                          </p>
                        ))}
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E8DDCA] space-y-1.5">
                        <span className="font-utility text-[10px] text-[#7A6027] uppercase block font-bold">
                          Threads 社群討論視角
                        </span>
                        {cluster.threadsDiscussions.map((th, idx) => (
                          <p key={idx} className="text-[#4F432E] leading-relaxed italic">
                            "{th}"
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Personal Relevance badge */}
                  {cluster.personalRelevance?.isRelevant && (
                    <div className="mt-3 p-3.5 rounded-xl bg-[#FFF6F3] border-2 border-[#E5CCC4] space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-utility text-[10px] font-bold text-[#8D4F3B] uppercase tracking-wide">
                          與你有關
                        </span>
                      </div>
                      <p className="font-reading text-xs text-[#523229] leading-relaxed">
                        {cluster.personalRelevance.reason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: NEWS FACTS */}
        {/* ------------------------------------------------------------- */}
        {nowActiveTab === 'news' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
            {newsItems.map((news) => (
              <div
                key={news.id}
                className="p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#D8CEB7] shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between font-utility text-[10px] text-[#7A6027]">
                    <span className="bg-[#F3ECD4] border border-[#DFD2AC] px-2 py-0.5 rounded font-semibold text-[#59481E]">{news.category}</span>
                    <span className="font-medium">{news.publishedAt}</span>
                  </div>
                  <h4 className="font-display text-base text-[#1C1A18] font-semibold leading-snug">
                    {news.title}
                  </h4>
                  <p className="font-reading text-xs text-[#4F432E] leading-relaxed">
                    {news.summary}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-[#E5DAC3] font-utility text-[10px] text-[#8C7A53] font-medium">
                  來源：{news.source}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: THREADS RAW POSTS & TOPICS */}
        {/* ------------------------------------------------------------- */}
        {nowActiveTab === 'threads' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {threadsTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] border-2 border-[#D8CEB7] shadow-2xs shrink-0 text-xs font-reading space-y-1"
                >
                  <div className="font-utility text-[11px] text-[#695427] font-bold">
                    {topic.topicName}
                  </div>
                  <div className="font-utility text-[10px] text-[#8C7A53] font-medium">
                    {topic.postCount} 則討論 · {topic.vibe}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {threadsPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#D8CEB7] shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <span className="font-reading text-xs font-bold text-[#1C1A18]">
                        {post.authorName}
                      </span>
                      <span className="font-utility text-[10px] text-[#8C7A53]">
                        {post.timestamp}
                      </span>
                    </div>
                    <p className="font-reading text-xs text-[#453A26] leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[#E5DAC3] font-utility text-[10px]">
                    <span className="bg-[#F3ECD4] border border-[#DFD2AC] px-2 py-0.5 rounded text-[#59481E] font-semibold">{post.topicTag}</span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#8C7A53] font-medium">{post.likeCount} 喜歡</span>
                      {post.url && (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#181818] text-white text-[9px] font-medium hover:bg-[#383838] transition-all"
                        >
                          <span>Threads 原文 ↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
        )}
      </section>

      {/* 4. Memory / 過去的自己 - Soft Warm Dusty Lilac Bubble */}
      <section className="p-7 sm:p-8 rounded-[30px] bg-[#FCFAF6] border border-[#E5DFD5] shadow-xs space-y-4">
        <div className="flex items-baseline justify-between border-b border-[#EFECE5] pb-3">
          <div className="space-y-0.5">
            <span className="font-utility text-xs text-[#74484E] bg-[#EADCD9]/60 px-3 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              PAST SELF & MEMORY · 過去的自己
            </span>
            <h3 className="font-display text-xl text-[#2B2826] font-medium mt-1">
              77 目前怎麼理解你
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('memory')}
            className="font-utility text-xs text-[#74484E] hover:underline font-medium cursor-pointer"
          >
            檢視所有記憶與模式 →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {memories.slice(0, 3).map((mem) => (
            <div
              key={mem.id}
              className="p-5 rounded-[22px] bg-[#F7F5EE] border border-[#E5DFD5] space-y-2 text-xs font-reading hover:border-[#C09D9B] transition-all"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-utility text-[10px] text-[#74484E] uppercase bg-[#EADCD9] px-2 py-0.5 rounded-full font-medium">
                  {mem.layerLabel}
                </span>
                <span className="font-utility text-[10px] text-[#9E938D] font-medium">
                  信心 {Math.round(mem.confidence * 100)}%
                </span>
              </div>
              <div className="font-semibold text-[#2B2826]">{mem.title}</div>
              <p className="text-[#685F5B] text-[11px] leading-relaxed line-clamp-2">
                {mem.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
