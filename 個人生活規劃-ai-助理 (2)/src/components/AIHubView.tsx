import React, { useState } from 'react';
import { useLife } from '../context/LifeContext';
import { DisturbanceMode } from '../types';
import { ProposalCard } from './ProposalCard';

export const AIHubView: React.FC = () => {
  const {
    userProfile,
    behaviorPatterns,
    memories,
    disturbanceMode,
    setDisturbanceMode,
    chatMessages,
    sendChatMessage,
    handleProposalAction,
    isAiLoading,
    dailyPlan,
    timeOfDayText
  } = useLife();

  const [inputMessage, setInputMessage] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isAiLoading) return;
    const msg = inputMessage;
    setInputMessage('');
    await sendChatMessage(msg);
  };

  const disturbanceModes: { mode: DisturbanceMode; title: string; desc: string }[] = [
    {
      mode: 'free',
      title: '溫和陪伴',
      desc: '在適當時段提供生活提醒與手作建議，完全尊重拒絕。'
    },
    {
      mode: 'low',
      title: '低度干擾',
      desc: '僅在時段轉換時提供氛圍指引，不主動推薦新任務。'
    },
    {
      mode: 'important_only',
      title: '僅重要事項',
      desc: '只在有必須處理的時限事務時提醒，其餘全天靜音。'
    },
    {
      mode: 'quiet',
      title: '徹底靜默',
      desc: '完全不主動打擾，靜靜作為手帳與生活紀錄器。'
    }
  ];

  const starters = [
    '我今天想整理房間',
    '我想去看那個展覽',
    '我今天想買洗髮精',
    '我以後想學陶藝',
    '今天已經排很滿，還想寫企劃'
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-8 text-[#2B2927] space-y-12 animate-in fade-in duration-300">
      {/* 1. Header */}
      <div className="border-b border-[#E6E1D7] pb-8 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-utility text-xs text-[#7E8B7B] uppercase tracking-wider">
            AI LIFE COMPANION
          </span>
          <span className="text-[#C5BFAF]">·</span>
          <span className="font-reading text-xs text-[#8C867C]">
            個人生活助理系統「77」
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-[#2B2927]">
          生活節奏理解與陪伴中心
        </h1>
        <p className="font-reading text-sm text-[#6E685F] leading-relaxed max-w-2xl">
          77
          不是為了替你把每一分鐘填滿，而是為了保護你的身心節奏、維持充足留白，讓你在舒服的步調下完成真正重要之事。
        </p>
      </div>

      {/* 2. AI Understanding Profile & Disturbance Mode */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: How 77 understands user (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-1">
            <span className="font-utility text-xs text-[#8C867C] uppercase tracking-wider">
              PROFILE & RHYTHM
            </span>
            <h2 className="font-display text-xl text-[#2B2927]">
              77 對你的長期生活理解
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E6E1D7] space-y-4">
            <div className="space-y-2">
              <span className="font-utility text-[10px] text-[#7E8B7B] uppercase">
                CORE MOTTO
              </span>
              <p className="font-display text-lg text-[#2B2927] leading-relaxed">
                「{userProfile.lifeMotto}」
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#EFEBE3] text-xs font-reading">
              <div>
                <span className="font-utility text-[10px] text-[#8C867C] block">
                  能量基準
                </span>
                <span className="text-[#3A3631] font-medium">
                  {userProfile.energyBaseline}
                </span>
              </div>
              <div>
                <span className="font-utility text-[10px] text-[#8C867C] block">
                  建議作息
                </span>
                <span className="text-[#3A3631] font-medium">
                  {userProfile.preferredWakeTime} 醒 · {userProfile.preferredRestTime} 眠
                </span>
              </div>
            </div>
          </div>

          {/* Behavior patterns */}
          <div className="space-y-3">
            <span className="font-utility text-xs text-[#8C867C] uppercase tracking-wider block">
              OBSERVED PATTERNS / 行為模式洞察
            </span>

            <div className="space-y-3">
              {behaviorPatterns.map((bp) => (
                <div
                  key={bp.id}
                  className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6E1D7] space-y-2 text-xs font-reading"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-[#2B2927]">
                      {bp.patternName}
                    </span>
                    <span className="font-utility text-[10px] text-[#7E8B7B]">
                      信心 {Math.round(bp.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-[#68635B] leading-relaxed">
                    觀察現象：{bp.observedTrait}
                  </p>
                  <div className="p-2.5 rounded-lg bg-[#F5F1E9] text-[#524E47] text-[11px] leading-relaxed">
                    77 應對原則：{bp.influenceOnPacing}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Disturbance mode selector & quick controls (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="space-y-1">
            <span className="font-utility text-xs text-[#8C867C] uppercase tracking-wider">
              DISTURBANCE LEVEL
            </span>
            <h2 className="font-display text-xl text-[#2B2927]">
              陪伴模式設定
            </h2>
          </div>

          <div className="space-y-3">
            {disturbanceModes.map((item) => (
              <div
                key={item.mode}
                onClick={() => setDisturbanceMode(item.mode)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  disturbanceMode === item.mode
                    ? 'bg-[#FAF7F2] border-[#2B2927] shadow-sm'
                    : 'bg-[#FAF7F2]/60 border-[#E6E1D7] hover:border-[#CDC7BB]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-reading text-sm font-medium text-[#2B2927]">
                    {item.title}
                  </span>
                  <span
                    className={`w-3 h-3 rounded-full border ${
                      disturbanceMode === item.mode
                        ? 'border-[#2B2927] bg-[#2B2927]'
                        : 'border-[#CDC7BB]'
                    }`}
                  />
                </div>
                <p className="font-reading text-xs text-[#7C7871] mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Current system status card */}
          <div className="p-4 rounded-xl bg-[#F6F4EE] border border-[#DDD8CE] space-y-2 text-xs font-reading">
            <div className="font-utility text-[10px] uppercase text-[#7E8B7B] tracking-wider">
              CURRENT CONTEXT
            </div>
            <p className="text-[#555049] leading-relaxed">
              目前處於「{timeOfDayText}」時段，身心指數{' '}
              {dailyPlan.energy}/5，今日剩餘自由留白 {dailyPlan.freeTimeHours} 小時。77
              會依據此節奏適度調整互動頻率。
            </p>
          </div>
        </div>
      </div>

      {/* 3. Quiet Conversation Console */}
      <div className="pt-8 border-t border-[#E6E1D7] space-y-6">
        <div className="space-y-1">
          <span className="font-utility text-xs text-[#8C867C] uppercase tracking-wider">
            CONVERSATION CONSOLE
          </span>
          <h2 className="font-display text-xl text-[#2B2927]">
            與 77 安靜交談
          </h2>
        </div>

        {/* Quick starter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {starters.map((s, idx) => (
            <button
              key={idx}
              onClick={() => sendChatMessage(s)}
              className="font-reading text-xs px-3 py-1.5 bg-[#FAF7F2] border border-[#E6E1D7] rounded-full text-[#6E685F] hover:text-[#2B2927] hover:border-[#CDC7BB] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Chat message flow */}
        <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E6E1D7] space-y-4 max-h-96 overflow-y-auto">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              } space-y-1`}
            >
              <div
                className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm font-reading leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#2B2927] text-white rounded-br-none'
                    : 'bg-[#F2EFE8] text-[#2B2927] border border-[#E4DFD5] rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === 'assistant' && msg.proposal && (
                <div className="w-full max-w-xl">
                  <ProposalCard
                    proposal={msg.proposal}
                    messageId={msg.id}
                    onAction={handleProposalAction}
                  />
                </div>
              )}

              <span className="font-utility text-[10px] text-[#A69F93] px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isAiLoading && (
            <div className="flex items-center gap-2 text-xs font-utility text-[#8C867C] py-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#7E8B7B] animate-ping" />
              77 正在細細梳理你的生活想法...
            </div>
          )}
        </div>

        {/* Input form */}
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="告訴 77 你現在的想法、想做的事，或是想調整的步調..."
            className="flex-1 bg-[#FAF7F2] border border-[#E6E1D7] rounded-xl px-4 py-3 text-xs sm:text-sm font-reading focus:outline-none focus:border-[#2B2927] transition-colors"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isAiLoading}
            className="font-utility text-xs sm:text-sm px-6 py-3 bg-[#2B2927] text-white rounded-xl hover:bg-[#45403B] disabled:opacity-40 transition-colors shrink-0"
          >
            傳送
          </button>
        </form>
      </div>
    </div>
  );
};
