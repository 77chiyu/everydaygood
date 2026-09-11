import React, { useState } from 'react';
import { useLife } from '../context/LifeContext';

export const LifeMemoryView: React.FC = () => {
  const { memories, updateMemoryStatus, adjustMemoryConfidence } = useLife();
  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const layers = [
    { id: 'fact', label: '事實', desc: '具體發生過的生活紀錄' },
    { id: 'preference', label: '偏好', desc: '你表達過的生活喜好與節奏' },
    { id: 'pattern', label: '模式', desc: '77 長期觀察到的行為律動' },
    { id: 'goal', label: '目標', desc: '你的長遠渴望與核心理念' }
  ];

  const filteredMemories = selectedLayer === 'all'
    ? memories
    : memories.filter(m => m.layer === selectedLayer);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 text-[#2B2927] space-y-12 animate-in fade-in duration-300">
      {/* 1. Masthead */}
      <section className="border-b border-[#DDD3DE] pb-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="font-utility text-xs text-[#6B576C] bg-[#F7F3F7] border border-[#DDD3DE] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-medium">
            OBSERVATION NOTES · 生活筆記
          </div>
          <div className="font-utility text-xs text-[#8A758B]">
            累積 {memories.length} 條生活洞察
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#2B2927]">
            77 慢慢認識你的筆記
          </h1>
          <p className="font-reading text-sm text-[#68635B] leading-relaxed max-w-xl">
            生活是你的。如果我有任何推測不準確的地方，你可以隨時修正或叫我暫停。我不會固執己見。
          </p>
        </div>

        {/* Layer tabs */}
        <div className="mt-8 pt-4 border-t border-[#EAE3EA] flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none text-xs font-reading">
          <button
            onClick={() => setSelectedLayer('all')}
            className={`transition-colors whitespace-nowrap ${
              selectedLayer === 'all'
                ? 'text-[#6B576C] font-semibold underline underline-offset-4'
                : 'text-[#8C867C] hover:text-[#6B576C]'
            }`}
          >
            全部 ({memories.length})
          </button>

          {layers.map((layer) => {
            const count = memories.filter(m => m.layer === layer.id).length;
            const isSelected = selectedLayer === layer.id;

            return (
              <button
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                className={`transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'text-[#6B576C] font-semibold underline underline-offset-4'
                    : 'text-[#8C867C] hover:text-[#6B576C]'
                }`}
              >
                {layer.label} <span className="font-utility text-[10px] text-[#A898A9]">({count})</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Memory Notes */}
      <section className="space-y-4">
        {filteredMemories.map((mem) => {
          const isExpanded = expandedId === mem.id;
          const isPaused = mem.status === 'paused';

          return (
            <div
              key={mem.id}
              className={`p-6 rounded-2xl border transition-all ${
                isPaused
                  ? 'border-dashed border-[#DDD8CE] bg-[#FAF7F2] opacity-60'
                  : 'border-[#D7CAD8] bg-[#FAF7FA] hover:border-[#C4B2C5]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-utility text-[10px] text-[#6B576C] uppercase tracking-wider bg-[#EAE3EA] px-2 py-0.5 rounded font-medium">
                    {mem.layer.toUpperCase()}
                  </span>
                  <h3 className="font-display text-base sm:text-lg text-[#2B2927] font-normal">
                    {mem.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 font-utility text-xs">
                  <span className="text-[#8A758B]">
                    信心值 {Math.round(mem.confidence * 100)}%
                  </span>
                  <button
                    onClick={() => toggleExpand(mem.id)}
                    className="text-[#6B576C] hover:text-[#4B394C] border-b border-[#D7CAD8] pb-0.2"
                  >
                    {isExpanded ? '收起依據' : '檢視依據'}
                  </button>
                </div>
              </div>

              <p className="font-reading text-xs text-[#5D4E5E] mt-2.5 leading-relaxed">
                {mem.content}
              </p>

              {/* Collapsible Inspection Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-[#EAE3EA] space-y-3 text-xs font-reading animate-in fade-in">
                  <div className="bg-[#F3EEF3] p-4 rounded-xl space-y-1.5 border border-[#E3DAE4]">
                    <div className="font-utility text-[10px] uppercase text-[#6B576C] font-medium">
                      Why 77 thinks so
                    </div>
                    <p className="text-[#433444] leading-relaxed">
                      {mem.evidenceNotes}
                    </p>
                    <div className="font-utility text-[10px] text-[#8C7A8D] pt-1">
                      印證次數：{mem.evidenceCount} 次 ｜ 最近確認：{mem.lastConfirmedDate}
                    </div>
                  </div>

                  {/* Override controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#7C7871]">微調信心：</span>
                      {[0.5, 0.75, 0.95].map((val) => (
                        <button
                          key={val}
                          onClick={() => adjustMemoryConfidence(mem.id, val)}
                          className={`font-utility text-[10px] px-2 py-0.5 rounded border transition-colors ${
                            mem.confidence === val
                              ? 'border-[#2B2927] bg-[#2B2927] text-white'
                              : 'border-[#DDD8CE] text-[#7C7871] hover:border-[#2B2927]'
                          }`}
                        >
                          {Math.round(val * 100)}%
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {mem.status === 'active' ? (
                        <button
                          onClick={() => updateMemoryStatus(mem.id, 'paused')}
                          className="text-[#7C7871] hover:text-[#2B2927] font-reading text-xs"
                        >
                          暫停參考
                        </button>
                      ) : (
                        <button
                          onClick={() => updateMemoryStatus(mem.id, 'active')}
                          className="text-[#2B2927] font-medium font-reading text-xs"
                        >
                          恢復參考
                        </button>
                      )}

                      <button
                        onClick={() => updateMemoryStatus(mem.id, 'superseded')}
                        className="text-[#8C6D52] hover:underline font-reading text-xs"
                      >
                        理解錯了（刪除）
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* 3. Overall Rhythm Observation */}
      <section className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#E6E1D7] space-y-6">
        <div className="font-utility text-xs text-[#7C7871] uppercase tracking-wider">
          Life Rhythm Synthesis
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-reading">
          <div className="space-y-1">
            <span className="font-utility text-[10px] text-[#A69F93] uppercase block">
              Optimal Flow Window
            </span>
            <div className="font-display text-lg text-[#2B2927]">
              14:00 – 17:00
            </div>
            <p className="text-[#68635B] leading-relaxed pt-1">
              午後精神最飽滿且平靜，適合手作與深度思考。
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-utility text-[10px] text-[#A69F93] uppercase block">
              Time Distribution
            </span>
            <div className="font-display text-lg text-[#2B2927]">
              留白 42%
            </div>
            <p className="text-[#68635B] leading-relaxed pt-1">
              必要 30% · 創作 28% · 自由時間 42%，身心壓力低。
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-utility text-[10px] text-[#A69F93] uppercase block">
              Recharge Anchor
            </span>
            <div className="font-display text-base text-[#2B2927]">
              手作 ＋ 無計畫散步
            </div>
            <p className="text-[#68635B] leading-relaxed pt-1">
              比起熱鬧社交，安靜獨處帶來的修復感更深。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
