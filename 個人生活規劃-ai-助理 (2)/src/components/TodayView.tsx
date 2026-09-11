import React, { useState } from 'react';
import { useLife } from '../context/LifeContext';
import { DayTempo, LifeSuggestion } from '../types';
import { ContextualReminderWidget } from './ContextualReminderWidget';
import { CuteTimePicker } from './CuteTimePicker';

export const TodayView: React.FC = () => {
  const {
    dailyPlan,
    updateEnergy,
    updateMood,
    updateTempo,
    toggleTimeSlot,
    addTimeSlot,
    deleteTimeSlot,
    toggleTask,
    addTask,
    resetDailyWorkspace,
    dailyLifePlan,
    generateDailyLifePlan,
    acceptLifeSuggestion,
    rejectLifeSuggestion,
    replaceLifeSuggestion,
    rescheduleLifeSuggestion,
    stashLifeSuggestionToIdeas,
    setDailyOpeningVibe,
    waterReminder,
    recordWaterSip,
    openRescheduleModal,
    toggleScheduledItem,
    deleteScheduledItem,
    addScheduledItem,
    updateScheduledItemTime
  } = useLife();

  // Cute Time Picker State
  const [pickerConfig, setPickerConfig] = useState<{
    isOpen: boolean;
    targetId: string;
    targetType: 'suggestion' | 'new_slot' | 'existing_slot' | 'scheduled_item';
    currentTime: string;
    title: string;
  } | null>(null);

  // New Slot State
  const [isAddingTimeSlot, setIsAddingTimeSlot] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('15:00');
  const [newSlotTitle, setNewSlotTitle] = useState('');
  const [isNewSlotFree, setIsNewSlotFree] = useState(false);

  // Custom Prompt for Daily Opening
  const [customPrompt, setCustomPrompt] = useState('');

  // Quick Task Input
  const [quickTaskText, setQuickTaskText] = useState('');
  const [quickTaskType, setQuickTaskType] = useState<'important' | 'leisure'>('important');

  const tempoOptions: DayTempo[] = ['悠閒', '普通', '充實', '還不知道'];
  const vibeOptions = [
    { label: '悠閒', icon: '🌿', hint: '慢步調生活' },
    { label: '想耍廢', icon: '🛋️', hint: '窩在家放鬆' },
    { label: '出去玩', icon: '🚲', hint: '出門探險散步' },
    { label: '療癒身心', icon: '🍵', hint: '溫暖給心補水' },
    { label: '有生產力', icon: '✍️', hint: '聚焦1-2件事' },
    { label: '留給自己', icon: '☁️', hint: '純粹自由留白' }
  ];

  const formattedDate = (dailyPlan?.dateNumber || dailyPlan?.dateStr || '9.10')
    .replace(/\s+/g, '')
    .replace(/\./g, ' / ');

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    generateDailyLifePlan(customPrompt.trim());
    setCustomPrompt('');
  };

  const handleOpenPickerForSuggestion = (suggestion: LifeSuggestion) => {
    setPickerConfig({
      isOpen: true,
      targetId: suggestion.id,
      targetType: 'suggestion',
      currentTime: suggestion.suggestedTime === '全天' || suggestion.suggestedTime === '隨時' ? '14:00' : suggestion.suggestedTime,
      title: `調整「${suggestion.title}」的時間`
    });
  };

  const handlePickerConfirm = (newTime: string) => {
    if (!pickerConfig) return;

    if (pickerConfig.targetType === 'suggestion') {
      rescheduleLifeSuggestion(pickerConfig.targetId, newTime);
    } else if (pickerConfig.targetType === 'scheduled_item') {
      updateScheduledItemTime(pickerConfig.targetId, newTime);
    } else if (pickerConfig.targetType === 'new_slot') {
      setNewSlotTime(newTime);
    }
    setPickerConfig(null);
  };

  const handleAddSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotTitle.trim()) return;

    addScheduledItem({
      startTime: newSlotTime,
      title: newSlotTitle.trim(),
      isFreeTime: isNewSlotFree,
      type: isNewSlotFree ? 'rest' : 'task',
      duration: '60 分鐘',
      source: 'user_created'
    });

    setNewSlotTitle('');
    setIsAddingTimeSlot(false);
  };

  // Unified persistent scheduled items from dailyLifePlan
  const activeScheduledItems = React.useMemo(() => {
    const list = [...(dailyLifePlan?.scheduledItems || [])];
    const existingTitles = new Set(list.map((it) => it.title.toLowerCase().trim()));

    (dailyPlan.timeline || []).forEach((slot) => {
      const norm = slot.title.toLowerCase().trim();
      if (!existingTitles.has(norm)) {
        list.push({
          id: slot.id,
          dailyPlanId: dailyLifePlan?.id || 'default',
          title: slot.title,
          startTime: slot.time,
          duration: '45 分鐘',
          type: (slot.category === 'meal' ? 'meal' : slot.category === 'rest' ? 'rest' : 'task') as any,
          source: 'user_created' as any,
          status: (slot.completed ? 'completed' : 'scheduled') as any,
          isFixed: false,
          isFreeTime: !!(slot.isFreeTime || slot.category === 'free' || slot.category === 'rest'),
          aiNote: slot.aiNote,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        existingTitles.add(norm);
      }
    });

    return list.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }, [dailyLifePlan?.scheduledItems, dailyPlan.timeline]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskText.trim()) return;

    addTask(
      {
        title: quickTaskText.trim(),
        type: quickTaskType === 'important' ? '必須做' : '想做',
        status: 'todo',
        importance: quickTaskType === 'important' ? 3 : 2,
        estimatedDuration: '30 分鐘',
        preferredTime: '今日空檔'
      },
      quickTaskType === 'leisure'
    );

    setQuickTaskText('');
  };

  const activeSuggestions = dailyLifePlan?.suggestions || [];

  return (
    <div className="max-w-4xl lg:max-w-5xl mx-auto py-8 px-4 sm:px-6 text-[#2B2927] animate-in fade-in duration-300">
      {/* 00:00 Daily Reset & Life Proposal Notification */}
      <div className="mb-6 p-4 rounded-[24px] bg-[#FCFAF6] border border-[#DEC8C4]/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-reading text-[#5A524A]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7E8B7B] shrink-0 animate-pulse" />
          <span>
            今日工作區依 <strong className="font-semibold text-[#2B2927]">Asia/Taipei</strong> 每日 00:00 自動重新生成「今日生活提案」· 昨日排程不堆疊累積
          </span>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <span className="font-utility text-[11px] text-[#8C847A]">
            今日飲水：<strong className="text-[#6D8A96]">{waterReminder.sipCountToday}</strong> 次
          </span>
          <button
            onClick={() => resetDailyWorkspace()}
            className="px-3 py-1 rounded-full bg-[#F3ECE8] hover:bg-[#EADCD9] text-[#7A5B58] text-[11px] font-utility font-medium transition-colors cursor-pointer"
          >
            重新生成今日提案
          </button>
        </div>
      </div>

      {/* 1. Spacious Editorial Header (每日開啟畫面) */}
      <section className="text-center py-4 sm:py-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF5F2] border border-[#DEC8C4]/50 mb-3 text-xs font-utility text-[#8C7A77]">
          <span>台北時間</span>
          <span className="font-medium text-[#2B2927]">{formattedDate}</span>
          <span>·</span>
          <span>{dailyPlan.dayOfWeek || 'Today'}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-normal text-[#2B2927] tracking-wide mt-1">
          {dailyLifePlan?.userOpeningPrompt || '今天，我想怎麼過？'}
        </h1>
        <p className="font-reading text-sm sm:text-base text-[#68635B] mt-2.5 leading-relaxed max-w-xl mx-auto">
          {dailyLifePlan?.subOpeningNote || '這只是今天的一個版本，可以隨時改。'}
        </p>

        {/* Vibe Selection Bubbles (氛圍泡泡) */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {vibeOptions.map((vibe) => {
            const isSelected = dailyLifePlan?.vibe === vibe.label;
            return (
              <button
                key={vibe.label}
                onClick={() => setDailyOpeningVibe(vibe.label)}
                className={`group px-3.5 py-1.5 rounded-full text-xs font-reading transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#DEC8C4] text-[#3D2C2A] font-medium shadow-xs scale-105'
                    : 'bg-[#FCFAF6] hover:bg-[#F3ECE8] text-[#5A524A] border border-[#E8E2D9]'
                }`}
                title={vibe.hint}
              >
                <span>{vibe.icon}</span>
                <span>{vibe.label}</span>
              </button>
            );
          })}
        </div>

        {/* Natural Language Prompt Input (告訴 77 今天想過怎樣的生活) */}
        <form
          onSubmit={handleCustomPromptSubmit}
          className="mt-5 max-w-lg mx-auto flex items-center gap-2 text-xs font-reading"
        >
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="告訴 77 今天想怎麼過？（例如：想吃義大利麵、去看展覽、晚上放空）"
            className="flex-1 px-4 py-2 rounded-full bg-[#FCFAF6] border border-[#DEC8C4]/80 text-[#2B2927] placeholder-[#A0988E] focus:outline-hidden focus:border-[#C09D9B] focus:bg-[#FFFFFF] shadow-2xs transition-all"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-full bg-[#2B2927] hover:bg-[#433F3B] text-[#FAF7F2] font-utility font-medium transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            換一版提案
          </button>
        </form>

        {/* State Check-in: Energy, Mood, Tempo */}
        <div className="mt-6 pt-5 border-t border-[#EAE4DC] flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {/* Energy */}
          <div className="flex items-center gap-2 font-reading text-xs">
            <span className="text-[11px] text-[#7C7871]">體力：</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={`energy-${val}`}
                  onClick={() => updateEnergy(val)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    val <= dailyPlan.energy ? 'bg-[#2B2927]' : 'bg-[#DDD8CE] hover:bg-[#B3ACA0]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className="flex items-center gap-2 font-reading text-xs">
            <span className="text-[11px] text-[#7C7871]">心情：</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={`mood-${val}`}
                  onClick={() => updateMood(val)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    val <= dailyPlan.mood ? 'bg-[#7E8B7B]' : 'bg-[#DDD8CE] hover:bg-[#B3ACA0]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Day Tempo */}
          <div className="flex items-center gap-2 font-reading text-xs">
            <span className="text-[11px] text-[#7C7871]">節奏：</span>
            <div className="flex items-center gap-2">
              {tempoOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateTempo(opt)}
                  className={`text-xs transition-colors cursor-pointer ${
                    dailyPlan.tempo === opt
                      ? 'text-[#2B2927] font-medium underline underline-offset-4'
                      : 'text-[#969085] hover:text-[#524E48]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gentle Divider */}
      <hr className="border-t border-[#EAE4DC] my-8" />

      {/* Contextual Life Reminders (出門清單與提醒) */}
      <ContextualReminderWidget />

      {/* Gentle Divider */}
      <hr className="border-t border-[#EAE4DC] my-8" />

      {/* ============================================================= */}
      {/* CORE LIFE PROPOSAL: 今日生活提案畫布 (3-6 個生活泡泡) */}
      {/* ============================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#EAE4DC] pb-3 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-utility text-xs text-[#2B2927] font-semibold tracking-wider uppercase">
                今日生活提案 · LIFE PROPOSAL
              </span>
              <span className="font-utility text-[10px] px-2.5 py-0.5 rounded-full bg-[#F5EDE8] text-[#8C6D68] border border-[#DEC8C4]/60">
                {dailyLifePlan?.theme || '悠閒慢調生活'}
              </span>
            </div>
            <p className="font-reading text-xs text-[#7C7871] mt-1">
              不是工作排程，而是 AI 在早晨替你整理出「值得期待的一天」。點擊按鈕即可隨心調整。
            </p>
          </div>
          <button
            onClick={() => generateDailyLifePlan(dailyLifePlan?.vibe || '悠閒', true)}
            className="text-xs font-reading text-[#8C6D68] hover:text-[#2B2927] hover:underline self-start sm:self-auto cursor-pointer"
          >
            換整組靈感 ↺
          </button>
        </div>

        {/* Life Proposal Bubbles Grid / Stream */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {activeSuggestions.map((sugg, idx) => {
            const isAccepted = sugg.status === 'accepted';
            const isFree = sugg.isFreeTimeBlock || sugg.type === 'free_time' || sugg.type === 'rest';

            return (
              <div
                key={sugg.id}
                className={`relative p-5 sm:p-6 rounded-[28px] border transition-all space-y-3.5 flex flex-col justify-between ${
                  isAccepted
                    ? 'bg-[#FAF7F2] border-[#D6CDBC] opacity-80'
                    : isFree
                    ? 'bg-[#FAF8F3] border-[#DCE4DA] shadow-xs hover:border-[#BFD1BC]'
                    : idx % 2 === 0
                    ? 'bg-[#FCFAF6] border-[#DEC8C4]/80 shadow-xs hover:border-[#C09D9B] hover:shadow-sm'
                    : 'bg-[#FAF7F2] border-[#E2DDD3] shadow-xs hover:border-[#D0C7B8] hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Top Bar: Suggested Time + Source Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenPickerForSuggestion(sugg)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAF5F0] hover:bg-[#F0E6DE] text-[#4A3C38] border border-[#DEC8C4]/60 text-xs font-utility font-semibold transition-colors cursor-pointer group"
                        title="點擊以可愛時間選擇器改時間"
                      >
                        <span>🕒</span>
                        <span>{sugg.suggestedTime}</span>
                        <span className="text-[10px] text-[#8C7A77] group-hover:text-[#2B2927]">✎</span>
                      </button>

                      {sugg.categoryTag && (
                        <span className="font-reading text-[11px] text-[#7A6E6A] px-2 py-0.5 rounded-full bg-[#F4EFE9]">
                          {sugg.categoryTag}
                        </span>
                      )}
                    </div>

                    <span className="font-reading text-[11px] text-[#8C7A77] bg-[#FFFFFF]/80 px-2.5 py-0.5 rounded-full border border-[#EAE4DC]">
                      {sugg.sourceLabel}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="mt-3">
                    <h3
                      className={`font-display text-lg sm:text-xl font-normal leading-snug ${
                        isAccepted ? 'text-[#8A847A] line-through' : 'text-[#2B2927]'
                      }`}
                    >
                      {sugg.title}
                    </h3>
                    <p className="font-reading text-xs sm:text-sm text-[#68635B] mt-1.5 leading-relaxed">
                      {sugg.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Interactive Controls */}
                <div className="pt-3 border-t border-[#EAE4DC]/60 flex items-center justify-between text-xs font-reading">
                  {isAccepted ? (
                    <div className="flex items-center gap-2 text-[#5D7359] text-xs font-medium">
                      <span>✓ 已安排在今日生活流中</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => acceptLifeSuggestion(sugg.id)}
                        className="px-3.5 py-1.5 rounded-full bg-[#2B2927] hover:bg-[#433F3B] text-[#FAF7F2] font-utility font-medium transition-colors cursor-pointer shadow-2xs"
                      >
                        安排
                      </button>
                      <button
                        onClick={() => handleOpenPickerForSuggestion(sugg)}
                        className="px-3 py-1.5 rounded-full bg-[#F3ECE8] hover:bg-[#E8DDD8] text-[#5A4542] font-utility font-medium transition-colors cursor-pointer"
                      >
                        改時間
                      </button>
                      <button
                        onClick={() => replaceLifeSuggestion(sugg.id)}
                        className="px-3 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#F5F0EB] text-[#6E665E] border border-[#DEC8C4]/60 font-reading transition-colors cursor-pointer"
                      >
                        換一個
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      onClick={() => stashLifeSuggestionToIdeas(sugg.id)}
                      className="text-[#8C7A77] hover:text-[#2B2927] hover:underline cursor-pointer"
                      title="放進未來的靈感牆慢慢醞釀"
                    >
                      先放著
                    </button>
                    <button
                      onClick={() => rejectLifeSuggestion(sugg.id)}
                      className="text-[#A39B92] hover:text-[#7A5A58] hover:underline cursor-pointer"
                    >
                      今天不要
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gentle Divider */}
      <hr className="border-t border-[#EAE4DC] my-10" />

      {/* ============================================================= */}
      {/* SCHEDULED TIMELINE: 已排入的今日生活流 */}
      {/* ============================================================= */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-[#EAE4DC] pb-2">
          <div className="flex items-center gap-2">
            <span className="font-utility text-xs text-[#2B2927] font-semibold tracking-wider uppercase">
              已排入的生活流 · TODAY'S FLOW
            </span>
            <span className="font-reading text-[11px] text-[#7C7871]">
              （確認的時間節奏與日常留白）
            </span>
          </div>
          <span className="font-reading text-[11px] text-[#8C7A77]">
            自由留白約 {dailyPlan.freeTimeHours} 小時
          </span>
        </div>

        <div className="space-y-3">
          {activeScheduledItems.map((item) => {
            const isFree = item.isFreeTime || item.type === 'rest';
            const isDone = item.status === 'completed';

            return (
              <div
                key={item.id}
                className={`group flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-[22px] transition-all ${
                  isFree
                    ? 'bg-[#FAF8F3] border border-[#DCE4DA]'
                    : isDone
                    ? 'bg-[#FAF7F2] border border-[#E6DFD3] opacity-75'
                    : item.isFixed
                    ? 'bg-[#F9F7F4] border border-[#C5B4A8]'
                    : 'bg-[#FCFAF6] border border-[#DEC8C4]/60 hover:border-[#C09D9B]'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <button
                    onClick={() =>
                      setPickerConfig({
                        isOpen: true,
                        targetId: item.id,
                        targetType: 'scheduled_item',
                        currentTime: item.startTime || '15:00',
                        title: `調整「${item.title}」的時間`
                      })
                    }
                    className="font-utility text-xs font-medium text-[#7C7871] hover:text-[#2B2927] hover:underline w-14 shrink-0 cursor-pointer text-left"
                    title="點擊調整時間"
                  >
                    {item.startTime}
                  </button>

                  <button
                    onClick={() => toggleScheduledItem(item.id)}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      isDone
                        ? 'bg-[#5D7359] border-[#5D7359] text-white text-xs'
                        : 'border-[#C8BFB2] hover:border-[#2B2927] bg-[#FFFFFF]'
                    }`}
                  >
                    {isDone && '✓'}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        onClick={() => toggleScheduledItem(item.id)}
                        className={`font-reading text-sm sm:text-base cursor-pointer transition-colors ${
                          isDone
                            ? 'line-through text-[#9E988D]'
                            : isFree
                            ? 'text-[#4A5D48] font-medium'
                            : 'text-[#2B2927]'
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.isFixed && (
                        <span className="font-reading text-[10px] text-[#55463D] px-2 py-0.5 rounded-full bg-[#EAE2DC] border border-[#D1BEB2] font-medium">
                          🔒 固定行程 · 保護
                        </span>
                      )}
                      {item.source === 'ai_conversation' && (
                        <span className="font-reading text-[10px] text-[#425B74] px-2 py-0.5 rounded-full bg-[#EAF0F6] border border-[#C5D5E6]">
                          AI 對話排入
                        </span>
                      )}
                      {item.source === 'suggestion_accepted' && (
                        <span className="font-reading text-[10px] text-[#7A5B58] px-2 py-0.5 rounded-full bg-[#FAF0ED] border border-[#DEC8C4]">
                          生活提案
                        </span>
                      )}
                      {isFree && (
                        <span className="font-reading text-[10px] text-[#5D7359] px-2 py-0.5 rounded-full bg-[#EAF0E8] border border-[#C8D6C5]">
                          自由留白
                        </span>
                      )}
                    </div>

                    {(item.description || item.aiNote) && (
                      <p className="font-reading text-xs text-[#7C7871] mt-0.5 leading-relaxed">
                        {item.description || item.aiNote}
                      </p>
                    )}
                  </div>
                </div>

                {!item.isFixed ? (
                  <button
                    onClick={() => deleteScheduledItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#B8B1A5] hover:text-[#7A5A58] text-xs font-utility transition-opacity shrink-0 px-2 cursor-pointer"
                    title="移除此項"
                  >
                    ✕
                  </button>
                ) : (
                  <span className="text-[11px] font-utility text-[#A3998F] shrink-0 px-1" title="不可刪除的固定行程">
                    固定
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Time Slot Toggle */}
        {!isAddingTimeSlot ? (
          <button
            onClick={() => setIsAddingTimeSlot(true)}
            className="px-4 py-2 rounded-full border border-[#DEC8C4]/70 bg-[#FCFAF6] hover:bg-[#F5EDE8] font-utility text-xs text-[#7A5B58] transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>＋</span>
            <span>加入新時段</span>
          </button>
        ) : (
          <form onSubmit={handleAddSlotSubmit} className="p-4 rounded-[24px] bg-[#FCFAF6] border border-[#DEC8C4] space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() =>
                  setPickerConfig({
                    isOpen: true,
                    targetId: 'new_slot',
                    targetType: 'new_slot',
                    currentTime: newSlotTime,
                    title: '選擇新時段時間'
                  })
                }
                className="font-utility px-3.5 py-2 rounded-full bg-[#FFFFFF] border border-[#DEC8C4] text-[#2B2927] font-medium cursor-pointer shrink-0"
              >
                🕒 {newSlotTime} (選時間)
              </button>

              <input
                type="text"
                placeholder="事項名稱（如：巷弄散步、手沖咖啡、整理書架）"
                value={newSlotTitle}
                onChange={(e) => setNewSlotTitle(e.target.value)}
                className="font-reading flex-1 px-3.5 py-2 rounded-full bg-[#FFFFFF] border border-[#DEC8C4] text-[#2B2927] focus:outline-hidden focus:border-[#C09D9B]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-[#68635B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNewSlotFree}
                  onChange={(e) => setIsNewSlotFree(e.target.checked)}
                  className="rounded accent-[#C09D9B]"
                />
                <span>這是一段完全留給自己的自由時間</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTimeSlot(false)}
                  className="px-3 py-1 rounded-full text-[#8C867C] hover:text-[#2B2927] cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2B2927] text-[#FAF7F2] rounded-full font-utility cursor-pointer shadow-2xs"
                >
                  確認加入
                </button>
              </div>
            </div>
          </form>
        )}
      </section>

      {/* Gentle Divider */}
      <hr className="border-t border-[#EAE4DC] my-10" />

      {/* ============================================================= */}
      {/* OPTIONAL MANUAL TASKS: 手動專注事項 (溫和，不給壓力) */}
      {/* ============================================================= */}
      <section className="space-y-5">
        <div className="flex items-baseline justify-between border-b border-[#EAE4DC] pb-2">
          <div className="flex items-center gap-2">
            <span className="font-utility text-xs text-[#2B2927] font-semibold tracking-wider uppercase">
              手動記事 · NOTES & TASKS
            </span>
            <span className="font-reading text-[11px] text-[#7C7871]">
              （由你隨心加入的專注項目）
            </span>
          </div>
          <span className="font-reading text-[11px] text-[#8C847A]">
            共 {dailyPlan.topImportantTasks.length + dailyPlan.leisureTasks.length} 項
          </span>
        </div>

        {/* Essential Tasks */}
        <div className="space-y-3">
          {dailyPlan.topImportantTasks.length === 0 && dailyPlan.leisureTasks.length === 0 ? (
            <p className="font-reading text-xs text-[#9A9386] italic py-1">
              今日無特別待辦，放鬆身心隨節奏自然生活。
            </p>
          ) : (
            <div className="space-y-2.5">
              {[...dailyPlan.topImportantTasks, ...dailyPlan.leisureTasks].map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-[20px] bg-[#FCFAF6] border border-[#DEC8C4]/60 text-sm"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id, task.type !== '必須做')}
                      className={`w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer shrink-0 ${
                        task.status === 'completed'
                          ? 'bg-[#5D7359] border-[#5D7359] text-white text-[10px]'
                          : 'border-[#C8BFB2] bg-white'
                      }`}
                    >
                      {task.status === 'completed' && '✓'}
                    </button>
                    <span
                      onClick={() => toggleTask(task.id, task.type !== '必須做')}
                      className={`font-reading cursor-pointer ${
                        task.status === 'completed' ? 'line-through text-[#9E988D]' : 'text-[#2B2927]'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <button
                    onClick={() => openRescheduleModal(task)}
                    className="font-utility text-[11px] text-[#8C6D52] hover:underline shrink-0 cursor-pointer"
                  >
                    調整步調
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Task Add Form */}
        <form onSubmit={handleQuickAdd} className="pt-2 flex items-center gap-2 text-xs font-reading">
          <input
            type="text"
            value={quickTaskText}
            onChange={(e) => setQuickTaskText(e.target.value)}
            placeholder="＋ 手動加入一件想做或要做的事..."
            className="flex-1 px-4 py-2 border border-[#DEC8C4]/80 rounded-full bg-[#FCFAF6] text-[#2B2927] focus:outline-hidden focus:border-[#C09D9B]"
          />
          <select
            value={quickTaskType}
            onChange={(e) => setQuickTaskType(e.target.value as any)}
            className="px-3 py-2 border border-[#DEC8C4]/80 rounded-full bg-[#FCFAF6] text-xs text-[#5A524A]"
          >
            <option value="important">必要事項</option>
            <option value="leisure">有餘裕時</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-[#2B2927] text-white rounded-full hover:bg-[#433F3B] text-xs font-utility cursor-pointer shadow-2xs"
          >
            加入
          </button>
        </form>
      </section>

      {/* Cute Time Picker Modal */}
      {pickerConfig?.isOpen && (
        <CuteTimePicker
          value={pickerConfig.currentTime}
          title={pickerConfig.title}
          subtitle="隨你的節奏自然安放，不急不徐"
          onChange={handlePickerConfirm}
          onClose={() => setPickerConfig(null)}
          isModal={true}
        />
      )}
    </div>
  );
};
