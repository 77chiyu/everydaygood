import React, { useState } from 'react';
import { useLife } from '../context/LifeContext';

export const IdeasView: React.FC = () => {
  const { ideas, scheduleIdeaToToday, setIsNewItemModalOpen, deleteIdea } = useLife();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const categories = [
    '想做',
    '想買',
    '想學',
    '想去',
    '想看',
    '想體驗',
    '靈感',
    '待觀察'
  ];

  // Specific low-saturation palette for category chips as specified in Section 6
  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case '想做':
      case '想體驗':
        return {
          bg: 'bg-[#EADCD9]',
          text: 'text-[#74484E]',
          border: 'border-[#DEC8C4]'
        };
      case '想買':
        return {
          bg: 'bg-[#F3E9DF]',
          text: 'text-[#785642]',
          border: 'border-[#E6D7C8]'
        };
      case '想學':
        return {
          bg: 'bg-[#EAE6F0]',
          text: 'text-[#5E536E]',
          border: 'border-[#D9D3E3]'
        };
      case '想去':
        return {
          bg: 'bg-[#E2ECE8]',
          text: 'text-[#436259]',
          border: 'border-[#CDDDD7]'
        };
      case '想看':
        return {
          bg: 'bg-[#ECE5E8]',
          text: 'text-[#6E505E]',
          border: 'border-[#DFD5DA]'
        };
      case '靈感':
      case '突然想到':
        return {
          bg: 'bg-[#F4EFE2]',
          text: 'text-[#726543]',
          border: 'border-[#E7DEC9]'
        };
      case '待觀察':
      default:
        return {
          bg: 'bg-[#EBEAE5]',
          text: 'text-[#5E5B54]',
          border: 'border-[#DDDCD5]'
        };
    }
  };

  const filteredIdeas =
    selectedFilter === 'all'
      ? ideas
      : ideas.filter((i) => (i.category as string) === selectedFilter);

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-8 text-[#2B2826] space-y-10 animate-in fade-in duration-300">
      {/* 1. Masthead */}
      <section className="border-b border-[#E5DFD5] pb-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="font-utility text-xs text-[#74484E] bg-[#EADCD9]/70 px-3.5 py-1.5 rounded-full uppercase tracking-wider font-medium inline-block self-start">
            IDEAS WALL · 想做的事
          </div>

          {/* Section 8: 「＋ 隨手捕捉想法」 Pill Header Action */}
          <button
            onClick={() => setIsNewItemModalOpen(true)}
            className="font-utility text-[15px] leading-normal text-[#685F5B] hover:text-[#2B2826] px-5 py-2 rounded-full border border-[#E5DFD5] bg-[#FCFAF6] hover:bg-[#F2EFE7] transition-all duration-200 ease-out flex items-center gap-2 self-start sm:self-auto cursor-pointer hover:scale-[1.02] active:scale-[0.985] shadow-xs"
          >
            <span className="text-base font-light">+</span>
            <span>隨手捕捉想法</span>
          </button>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#2B2826]">
            工作室的想法牆
          </h1>
          <p className="font-reading text-sm text-[#685F5B] leading-relaxed max-w-xl">
            不排日期、沒有必須繳交的期限。隨興釘在牆上，想做、想買、想學、想去或隨想，想翻閱的時候隨時翻翻看。
          </p>
        </div>

        {/* Categories: Section 6 Chip style: padding 7px 13px, 9999px pill, 13-14px font */}
        <div className="pt-4 flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none text-[13px] font-reading">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-[13px] py-[7px] rounded-full transition-all duration-180 whitespace-nowrap cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-[#2B2826] text-white font-medium shadow-xs'
                : 'bg-[#FCFAF6] text-[#685F5B] border border-[#E5DFD5] hover:bg-[#F2EFE7] hover:text-[#2B2826]'
            }`}
          >
            全部 ({ideas.length})
          </button>

          {categories.map((cat) => {
            const count = ideas.filter((i) => (i.category as string) === cat).length;
            const isSelected = selectedFilter === cat;
            const style = getCategoryBadgeStyle(cat);

            return (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-[13px] py-[7px] rounded-full transition-all duration-180 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? `${style.bg} ${style.text} border-2 ${style.border} font-semibold scale-[1.02]`
                    : `bg-[#FCFAF6] ${style.text} border ${style.border}/70 hover:bg-[#F2EFE7]`
                }`}
              >
                <span>{cat}</span>
                <span className="font-utility text-[11px] opacity-70">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. The Ideas Cards: Section 7 spec: 2 cols on desktop, gap 28-32px, 24px radius, min-height 180px */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8">
        {filteredIdeas.map((idea) => {
          const badgeStyle = getCategoryBadgeStyle(idea.category as string);

          return (
            <div
              key={idea.id}
              className="min-h-[180px] p-7 sm:p-8 rounded-[24px] border border-[#E5DFD5] bg-[#FCFAF6] hover:border-[#D5CDC0] flex flex-col justify-between transition-all duration-200 ease-out hover:-translate-y-0.5 shadow-xs group"
            >
              <div className="space-y-3">
                <div className="flex items-baseline justify-between font-utility text-[11px] text-[#9E938D]">
                  <span
                    className={`px-3 py-1 rounded-full font-medium text-xs border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                  >
                    {idea.category}
                  </span>
                  <span>{idea.createdAt}</span>
                </div>

                <h3 className="font-display text-lg sm:text-xl text-[#2B2826] font-normal leading-snug">
                  {idea.title}
                </h3>

                {idea.description && (
                  <p className="font-reading text-sm text-[#685F5B] leading-relaxed">
                    {idea.description}
                  </p>
                )}

                {idea.preferredContext && (
                  <div className="font-reading text-xs text-[#74484E] bg-[#EADCD9]/40 px-3 py-1 rounded-full inline-block">
                    適合時機：{idea.preferredContext}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-[#EFECE5] flex items-center justify-between text-xs font-utility">
                <button
                  onClick={() => deleteIdea(idea.id)}
                  className="text-[11px] text-[#9E938D] hover:text-[#74484E] transition-colors cursor-pointer"
                >
                  移除
                </button>

                <button
                  onClick={() => scheduleIdeaToToday(idea.id, '15:00')}
                  className="text-[#74484E] hover:text-[#2B2826] px-3.5 py-1.5 rounded-full bg-[#EADCD9]/50 hover:bg-[#EADCD9] transition-all font-medium cursor-pointer"
                >
                  排入今日下午
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

