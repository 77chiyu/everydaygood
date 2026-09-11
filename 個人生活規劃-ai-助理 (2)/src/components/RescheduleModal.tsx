import React, { useState } from 'react';
import { useLife } from '../context/LifeContext';

export const RescheduleModal: React.FC = () => {
  const { rescheduleTarget, closeRescheduleModal, applyReschedule } = useLife();
  const [customNote, setCustomNote] = useState('');

  if (!rescheduleTarget) return null;

  const handleAction = (
    action: 'tomorrow' | 'other_date' | 'breakdown' | 'keep' | 'convert_to_idea' | 'cancel'
  ) => {
    applyReschedule(rescheduleTarget.id, action, customNote);
    setCustomNote('');
  };

  return (
    <div className="fixed inset-0 bg-[#2B2927]/25 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#FCFAF6] border border-[#DEC8C4]/80 rounded-[28px] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="space-y-1.5 border-b border-[#EAE4D7] pb-4">
          <div className="flex items-center justify-between">
            <span className="font-utility text-xs text-[#8C6D52] uppercase tracking-wider">
              Smart Reschedule · 步調調適
            </span>
            <button
              onClick={closeRescheduleModal}
              className="text-[#8C867C] hover:text-[#2B2927] font-utility text-sm"
            >
              關閉
            </button>
          </div>
          <h3 className="font-display text-2xl text-[#2B2927]">
            這件事今天沒有完成
          </h3>
          <p className="font-reading text-xs text-[#68635B] leading-relaxed">
            計畫沒做完是很正常的現象，生活本就有起伏與突發狀況。請不用自責，選擇一個讓自己舒服的調整方式：
          </p>
        </div>

        {/* Target info card */}
        <div className="p-4 rounded-xl bg-[#F4EFE6] border border-[#E2DDD3] space-y-1">
          <span className="font-utility text-[10px] text-[#7E8B7B] uppercase">
            待辦項目
          </span>
          <div className="font-reading text-sm font-medium text-[#2B2927]">
            {rescheduleTarget.title}
          </div>
          <div className="font-utility text-[11px] text-[#8C867C]">
            預估時長：{rescheduleTarget.estimatedDuration} · 延後次數：
            {rescheduleTarget.delayCount || 0}
          </div>
        </div>

        {/* 6 Core Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleAction('tomorrow')}
            className="p-3.5 rounded-xl border border-[#E6E1D7] bg-white hover:bg-[#F6F3EC] hover:border-[#CDC7BB] text-left transition-colors space-y-1"
          >
            <div className="font-reading text-xs font-semibold text-[#2B2927]">
              順延至明天
            </div>
            <div className="font-reading text-[11px] text-[#7C7871]">
              排入明晨或午後的合適空檔
            </div>
          </button>

          <button
            onClick={() => handleAction('breakdown')}
            className="p-3.5 rounded-xl border border-[#7E8B7B] bg-[#F2F5F1] hover:bg-[#E8EDE6] text-left transition-colors space-y-1"
          >
            <div className="font-reading text-xs font-semibold text-[#3C4E3A]">
              拆成微步驟（推薦）
            </div>
            <div className="font-reading text-[11px] text-[#556953]">
              先做 10 分鐘，消除啟動阻力
            </div>
          </button>

          <button
            onClick={() => handleAction('convert_to_idea')}
            className="p-3.5 rounded-xl border border-[#E6E1D7] bg-white hover:bg-[#F6F3EC] hover:border-[#CDC7BB] text-left transition-colors space-y-1"
          >
            <div className="font-reading text-xs font-semibold text-[#2B2927]">
              轉存至想法牆
            </div>
            <div className="font-reading text-[11px] text-[#7C7871]">
              移出每日待辦，不形成心理懸念
            </div>
          </button>

          <button
            onClick={() => handleAction('other_date')}
            className="p-3.5 rounded-xl border border-[#E6E1D7] bg-white hover:bg-[#F6F3EC] hover:border-[#CDC7BB] text-left transition-colors space-y-1"
          >
            <div className="font-reading text-xs font-semibold text-[#2B2927]">
              安排至週末或下週
            </div>
            <div className="font-reading text-[11px] text-[#7C7871]">
              挑選有充裕整段空閒的日子
            </div>
          </button>

          <button
            onClick={() => handleAction('keep')}
            className="p-3.5 rounded-xl border border-[#E6E1D7] bg-white hover:bg-[#F6F3EC] hover:border-[#CDC7BB] text-left transition-colors space-y-1"
          >
            <div className="font-reading text-xs font-semibold text-[#2B2927]">
              先保留在今天
            </div>
            <div className="font-reading text-[11px] text-[#7C7871]">
              晚點看看心情，順其自然
            </div>
          </button>

          <button
            onClick={() => handleAction('cancel')}
            className="p-3.5 rounded-xl border border-[#E8DFD8] bg-[#F8F4F2] hover:bg-[#EFE8E5] text-left transition-colors space-y-1"
          >
            <div className="font-reading text-xs font-semibold text-[#8C5D4B]">
              放下此事項
            </div>
            <div className="font-reading text-[11px] text-[#9A7465]">
              認同當前不適合，果斷移除
            </div>
          </button>
        </div>

        {/* Optional note */}
        <div className="space-y-1">
          <label className="font-utility text-[10px] text-[#8C867C] uppercase">
            補充備註（選填）
          </label>
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="例如：今天下午開會體力用盡，改週末早晨再做"
            className="w-full bg-white border border-[#E6E1D7] rounded-xl px-3.5 py-2 text-xs font-reading focus:outline-none focus:border-[#2B2927]"
          />
        </div>
      </div>
    </div>
  );
};
