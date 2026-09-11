import React, { useState } from 'react';
import { useLife } from '../context/LifeContext';
import { LifeContextStage, LeavingContextScenario } from '../types';

export const ContextualReminderWidget: React.FC = () => {
  const {
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
    resetChecklist,
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
    checklistItems,
    addChecklistItem,
    deleteChecklistItem,
    editChecklistItem,
    toggleChecklistItemEnabled,
    addTemporaryReminder
  } = useLife();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemText, setEditingItemText] = useState('');
  const [tempItemInput, setTempItemInput] = useState('');
  const [tempItemReason, setTempItemReason] = useState('');

  const checkedCount = activeChecklist.filter((item) => item.checked).length;
  const totalCount = activeChecklist.length;
  const allCompleted = totalCount > 0 && checkedCount === totalCount;
  const remainingCount = totalCount - checkedCount;

  // Natural language assistant phrasing (No red warnings, no panic)
  const getFeedbackPhrase = () => {
    if (allCompleted) {
      return '隨身物品皆已確認妥當，出門路上步調放緩即可。';
    }
    if (remainingCount === 1) {
      return '還有最後一樣可以順手確認一下。';
    }
    if (remainingCount === 2) {
      return '還有兩樣可以再看一眼。';
    }
    return leavingPhrase;
  };

  const now = Date.now();
  const isWaterCoolingDown = waterReminder.nextEligibleAt > now;

  const waterPhrases = [
    '喝口水吧。',
    '記得喝點水。',
    '去喝幾口水吧。'
  ];
  const currentWaterPhrase =
    waterPhrases[waterReminder.currentPhraseIndex % waterPhrases.length];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addChecklistItem(newItemName.trim());
    setNewItemName('');
  };

  const handleAddTempItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempItemInput.trim()) return;
    addTemporaryReminder(tempItemInput.trim(), tempItemReason.trim() || '本次出門單次提醒');
    setTempItemInput('');
    setTempItemReason('');
  };

  const handleSaveEdit = (id: string) => {
    if (editingItemText.trim()) {
      editChecklistItem(id, editingItemText.trim());
    }
    setEditingItemId(null);
  };

  return (
    <div className="w-full bg-[#FCFAF6] border border-[#DEC8C4]/70 rounded-[28px] p-5 sm:p-6 space-y-4 shadow-xs transition-all duration-300">
      {/* Top Header & Stage Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#EFEBE3] pb-3">
        <div className="flex items-baseline gap-2.5">
          <span className="font-utility text-[11px] text-[#7E8B7B] tracking-widest uppercase font-medium">
            CONTEXTUAL LIFE ASSISTANT
          </span>
          <span className="text-[#DDD8CE]">·</span>
          <span className="font-display text-sm text-[#2B2927]">
            情境生活提醒
          </span>
        </div>

        {/* Stage simulation test switches */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs font-utility">
          <span className="text-[10px] text-[#8C867C] mr-1 hidden md:inline">
            感知階段：
          </span>
          <button
            onClick={() => setLifeContextStage('HOME')}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
              lifeContextStage === 'HOME'
                ? 'bg-[#2B2927] text-white font-medium'
                : 'text-[#7C7871] hover:text-[#2B2927] bg-[#F2ECE1]/70'
            }`}
          >
            在家
          </button>
          <button
            onClick={simulateLeaving}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
              lifeContextStage === 'LEAVING'
                ? 'bg-[#8C6D52] text-white font-medium'
                : 'text-[#7C7871] hover:text-[#2B2927] bg-[#F2ECE1]/70'
            }`}
            title="測試出門提醒情境"
          >
            準備出門
          </button>
          <button
            onClick={() => setLifeContextStage('OUTSIDE')}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
              lifeContextStage === 'OUTSIDE'
                ? 'bg-[#2B2927] text-white font-medium'
                : 'text-[#7C7871] hover:text-[#2B2927] bg-[#F2ECE1]/70'
            }`}
          >
            在外
          </button>
          <button
            onClick={() => setLifeContextStage('RETURNING')}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
              lifeContextStage === 'RETURNING'
                ? 'bg-[#2B2927] text-white font-medium'
                : 'text-[#7C7871] hover:text-[#2B2927] bg-[#F2ECE1]/70'
            }`}
          >
            返家中
          </button>

          <span className="text-[#DDD8CE] mx-0.5">|</span>

          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="text-[11px] text-[#8C867C] hover:text-[#2B2927] underline underline-offset-2"
          >
            {isSettingsOpen ? '關閉設定' : '情境與基本清單'}
          </button>
        </div>
      </div>

      {/* Settings Panel (Expandable) */}
      {isSettingsOpen && (
        <div className="bg-[#F4EFE6] p-4 rounded-xl space-y-4 text-xs font-reading border border-[#E3DDD1] animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#E8E1D4] pb-2">
            <div>
              <span className="font-utility text-xs text-[#2B2927] font-medium block">
                生活情境規則與物品管理
              </span>
              <p className="text-[11px] text-[#7C7871] leading-relaxed mt-0.5">
                系統遵循「基本物品＋情境動態增量」，嚴格控制出門提醒在 1–5 項內，不形成繁瑣的打擾清單。
              </p>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer text-[#635E56] shrink-0 ml-4">
              <input
                type="checkbox"
                checked={leavingReminderEnabled}
                onChange={(e) => setLeavingReminderEnabled(e.target.checked)}
                className="accent-[#2B2927]"
              />
              <span>啟用出門感知</span>
            </label>
          </div>

          {/* Context Rules Switcher */}
          <div className="space-y-2">
            <span className="font-utility text-[11px] text-[#8C6D52] uppercase font-semibold block">
              情境動態增量規則（AI 自動依據天氣與行程補充）
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scenarioRules.map((rule) => (
                <div
                  key={rule.id}
                  onClick={() => toggleScenarioRule(rule.id)}
                  className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    rule.enabled
                      ? 'bg-[#FAF7F2] border-[#D8CFBE] text-[#2B2927]'
                      : 'bg-[#ECE5D8] border-[#E0D7C8] text-[#8C867C]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-medium text-xs block">
                      + {rule.itemName}
                    </span>
                    <span className="text-[10px] text-[#7C7871] block">
                      觸發：{rule.conditionLabel}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => {}} // Handled by div click
                    className="accent-[#8C6D52]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Permanent Base Items Management */}
          <div className="space-y-2 pt-2 border-t border-[#E8E1D4]">
            <div className="flex items-center justify-between">
              <span className="font-utility text-[11px] text-[#8C867C] uppercase font-semibold">
                常態必備基本物品（每次出門預設）
              </span>
              <span className="text-[10px] text-[#A69F93]">
                點擊勾選可暫時略過該常設物品
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 py-1 px-2.5 rounded bg-[#FAF7F2] border border-[#E8E3DA]"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => toggleChecklistItemEnabled(item.id)}
                      className="accent-[#7E8B7B]"
                      title="啟用 / 暫停此項目"
                    />
                    {editingItemId === item.id ? (
                      <input
                        type="text"
                        value={editingItemText}
                        onChange={(e) => setEditingItemText(e.target.value)}
                        onBlur={() => handleSaveEdit(item.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(item.id)}
                        autoFocus
                        className="px-1 py-0.5 text-xs bg-white border border-[#DDD8CE] rounded flex-1"
                      />
                    ) : (
                      <span
                        className={`text-xs ${
                          item.enabled ? 'text-[#2B2927]' : 'text-[#A69F93] line-through'
                        }`}
                      >
                        {item.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-utility text-[11px] text-[#8C867C]">
                    {editingItemId !== item.id ? (
                      <button
                        onClick={() => {
                          setEditingItemId(item.id);
                          setEditingItemText(item.name);
                        }}
                        className="hover:text-[#2B2927]"
                      >
                        修改
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="text-[#2B2927] font-medium"
                      >
                        儲存
                      </button>
                    )}
                    <button
                      onClick={() => deleteChecklistItem(item.id)}
                      className="hover:text-[#8C6D52]"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add permanent item */}
            <form onSubmit={handleAddItem} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="新增常態基本物品（如：助聽器、門禁感應卡）..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#DDD8CE] rounded-lg text-[#2B2927] focus:outline-none font-reading"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#2B2927] text-white rounded-lg text-xs font-utility whitespace-nowrap"
              >
                加入常備
              </button>
            </form>
          </div>

          {/* Add temporary one-time item */}
          <div className="space-y-1.5 pt-2 border-t border-[#E8E1D4]">
            <span className="font-utility text-[11px] text-[#7E8B7B] uppercase font-semibold block">
              單次出門特殊提醒（不永久污染基本清單，如：幫朋友帶的書、還外套）
            </span>
            <form onSubmit={handleAddTempItem} className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="單次攜帶物品（如：借閱的書籍）..."
                value={tempItemInput}
                onChange={(e) => setTempItemInput(e.target.value)}
                className="w-full sm:flex-1 px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#DDD8CE] rounded-lg text-[#2B2927] focus:outline-none"
              />
              <input
                type="text"
                placeholder="原因備註（如：下午要還給朋友）..."
                value={tempItemReason}
                onChange={(e) => setTempItemReason(e.target.value)}
                className="w-full sm:w-48 px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#DDD8CE] rounded-lg text-[#2B2927] focus:outline-none"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-3 py-1.5 bg-[#8C6D52] text-white rounded-lg text-xs font-utility whitespace-nowrap"
              >
                加到今日提醒
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. LEAVING STAGE: 出門提醒 (Checklist + Contextual dynamic) */}
      {/* ------------------------------------------------------------- */}
      {lifeContextStage === 'LEAVING' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-utility text-xs text-[#8C6D52] tracking-wider uppercase font-semibold">
                  BEFORE LEAVING
                </span>
                <span className="text-[#DDD8CE]">·</span>
                <span className="font-utility text-[11px] text-[#7C7871]">
                  AI 正在關注本次外出情境
                </span>
              </div>
              <h3 className="font-display text-xl text-[#2B2927]">
                出門前看一眼
              </h3>
            </div>

            {/* Scenario Quick Simulator Bar */}
            <div className="flex items-center gap-1 flex-wrap text-xs font-utility">
              <span className="text-[10px] text-[#8C867C] mr-0.5">外出模式：</span>
              {(
                [
                  { key: 'auto', label: '自動判定' },
                  { key: 'short_errand', label: '超商短程' },
                  { key: 'rainy_day', label: '陰雨天' },
                  { key: 'long_outing', label: '長時間外出' },
                  { key: 'photo_walk', label: '拍照散步' }
                ] as const
              ).map((sc) => (
                <button
                  key={sc.key}
                  onClick={() => setLeavingContextScenario(sc.key)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    leavingContextScenario === sc.key
                      ? 'bg-[#8C6D52] text-white font-medium'
                      : 'text-[#6F685F] hover:bg-[#EBE3D5] bg-[#F0EAE0]/70'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Checklist content */}
          {!isChecklistDismissed ? (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {activeChecklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleActiveChecklistItem(item.id)}
                    className={`cursor-pointer select-none p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      item.checked
                        ? 'bg-[#ECE5D8] border-[#D6CFBF] text-[#555047]'
                        : 'bg-[#FAF8F5] border-[#E6E1D7] text-[#2B2927] hover:border-[#D1C9B8]'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`font-reading text-sm ${
                            item.checked ? 'text-[#7C7871] line-through' : 'font-medium'
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.isContextual && (
                          <span className="font-utility text-[9px] px-1.5 py-0.2 rounded bg-[#EAE2D2] text-[#8C6D52] border border-[#DDD3C0]">
                            情境增量
                          </span>
                        )}
                        {item.isTemporary && (
                          <span className="font-utility text-[9px] px-1.5 py-0.2 rounded bg-[#E4ECE3] text-[#4E7051] border border-[#D0DED0]">
                            單次
                          </span>
                        )}
                      </div>

                      {item.contextReason && (
                        <p className="font-reading text-[11px] text-[#8C867C] leading-tight">
                          {item.contextReason}
                        </p>
                      )}
                    </div>

                    {/* Geometric checkbox indicator */}
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        item.checked
                          ? 'border-[#2B2927] bg-[#2B2927]'
                          : 'border-[#C5BFAF] bg-transparent'
                      }`}
                    >
                      {item.checked && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Natural contextual phrase & Quick Actions */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#EFEBE3]">
                <div className="flex items-center gap-3">
                  <p className="font-reading text-xs text-[#68635B]">
                    {getFeedbackPhrase()}
                  </p>
                  <button
                    onClick={cycleLeavingPhrase}
                    className="font-utility text-[10px] text-[#A69F93] hover:text-[#2B2927] underline"
                  >
                    換句話
                  </button>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={confirmAllChecklist}
                    className="font-utility text-xs px-3 py-1.5 bg-[#2B2927] text-white rounded-xl hover:bg-[#45403B] transition-colors"
                  >
                    都確認好了
                  </button>
                  <button
                    onClick={resetChecklist}
                    className="font-utility text-xs px-2.5 py-1.5 bg-[#EAE4D7] text-[#635E56] rounded-xl hover:bg-[#DDD6C7] transition-colors"
                  >
                    重新確認
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-[#EAE4D7]/70 rounded-xl flex items-center justify-between text-xs font-reading border border-[#DFD7C8]">
              <div className="space-y-0.5">
                <span className="text-[#3A3630] font-medium block">
                  隨身物品皆已備齊。祝外出順利，隨意享受沿途風景。
                </span>
                <span className="text-[11px] text-[#7C7871]">
                  共確認了 {checkedCount} 項隨身物品。
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <button
                  onClick={() => setIsChecklistDismissed(false)}
                  className="font-utility text-[11px] text-[#7C7871] hover:text-[#2B2927] underline"
                >
                  重新檢視
                </button>
                <button
                  onClick={() => setLifeContextStage('OUTSIDE')}
                  className="font-utility text-xs px-3 py-1 bg-[#2B2927] text-white rounded-lg hover:bg-[#45403B]"
                >
                  我已出門
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. HOME STAGE: 居家生活提醒 (喝水 / 放鬆 / 留白) */}
      {/* ------------------------------------------------------------- */}
      {lifeContextStage === 'HOME' && (
        <div className="space-y-2 animate-in fade-in">
          <div className="flex items-baseline justify-between">
            <span className="font-utility text-xs text-[#7C7871] tracking-wider uppercase">
              HOME COMFORT
            </span>
            <div className="flex items-center gap-2 font-utility text-[11px] text-[#8C867C]">
              <span>今日補水 {waterReminder.sipCountToday} 次</span>
              {waterReminder.pausedToday ? (
                <button
                  onClick={resumeWaterReminderToday}
                  className="text-[#8C6D52] hover:underline"
                >
                  恢復提醒
                </button>
              ) : (
                <button
                  onClick={pauseWaterReminderToday}
                  className="text-[#A69F93] hover:text-[#2B2927]"
                  title="當天降低或停止喝水提醒"
                >
                  今天先不打擾
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="space-y-0.5">
              <div className="font-display text-lg text-[#2B2927]">
                {waterReminder.pausedToday
                  ? '今天步調由你自主掌握。'
                  : currentWaterPhrase}
              </div>
              <p className="font-reading text-xs text-[#68635B]">
                {waterReminder.pausedToday
                  ? '已暫停今日主動提醒，有餘裕時再隨手喝水即可。'
                  : isWaterCoolingDown
                  ? '剛喝過水不久，身體節奏很好。'
                  : '不是待辦事項，只是輕輕提醒喉嚨放鬆。'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
              <button
                onClick={recordWaterSip}
                className="font-utility text-xs px-4 py-2 bg-[#2B2927] hover:bg-[#433F3B] text-[#FAF7F2] rounded-full transition-all cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
              >
                <span>💧</span>
                <span>喝了一口水</span>
              </button>
              <button
                onClick={simulateLeaving}
                className="font-utility text-xs px-3.5 py-2 bg-[#F3ECE8] hover:bg-[#E8DDD8] text-[#5A4542] rounded-full transition-colors cursor-pointer"
              >
                準備出門
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. OUTSIDE STAGE: 在外情境 (不顯示喝水與出門 Checklist) */}
      {/* ------------------------------------------------------------- */}
      {lifeContextStage === 'OUTSIDE' && (
        <div className="space-y-2 animate-in fade-in">
          <div className="flex items-baseline justify-between">
            <span className="font-utility text-xs text-[#7E8B7B] tracking-wider uppercase">
              OUTSIDE PACE
            </span>
            <button
              onClick={() => setLifeContextStage('RETURNING')}
              className="font-utility text-xs text-[#2B2927] underline underline-offset-2"
            >
              準備返家
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <div className="font-display text-lg text-[#2B2927]">
                在外活動中 · 步調放緩
              </div>
              <p className="font-reading text-xs text-[#68635B] mt-0.5">
                出門清單已自動靜音。下午有一段松菸手作行程，記得留意步行的微風與時間。
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setLifeContextStage('RETURNING')}
                className="font-utility text-xs px-3 py-1.5 bg-[#EAE4D7] text-[#2B2927] rounded-xl hover:bg-[#DDD6C7] transition-colors"
              >
                啟程返家
              </button>
              <button
                onClick={() => {
                  setLifeContextStage('HOME');
                  resetChecklist();
                }}
                className="font-utility text-xs px-3 py-1.5 bg-[#2B2927] text-white rounded-xl hover:bg-[#45403B] transition-colors"
              >
                已回到家
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. RETURNING STAGE: 返家情境 */}
      {/* ------------------------------------------------------------- */}
      {lifeContextStage === 'RETURNING' && (
        <div className="space-y-2 animate-in fade-in">
          <div className="flex items-baseline justify-between">
            <span className="font-utility text-xs text-[#8C6D52] tracking-wider uppercase">
              RETURNING HOME
            </span>
            <button
              onClick={() => {
                setLifeContextStage('HOME');
                resetChecklist();
              }}
              className="font-utility text-xs text-[#2B2927] underline underline-offset-2"
            >
              確認已抵達
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <div className="font-display text-lg text-[#2B2927]">
                路上慢慢走。
              </div>
              <p className="font-reading text-xs text-[#68635B] mt-0.5">
                回家前看一眼隨身包包，今天帶出的物品是否有收齊。今天辛苦了，到家好好喘口氣。
              </p>
            </div>

            <button
              onClick={() => {
                setLifeContextStage('HOME');
                resetChecklist();
              }}
              className="font-utility text-xs px-3.5 py-1.5 bg-[#2B2927] text-white rounded-xl hover:bg-[#45403B] transition-colors shrink-0"
            >
              回到家了
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
