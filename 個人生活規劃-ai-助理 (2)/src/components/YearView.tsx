import React from 'react';
import { useLife } from '../context/LifeContext';

export const YearView: React.FC = () => {
  const { yearlyPlan } = useLife();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 text-[#2B2927] space-y-16 animate-in fade-in duration-300">
      {/* 1. Compass Masthead */}
      <section className="border-b border-[#E6E1D7] pb-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="font-utility text-4xl sm:text-6xl font-light text-[#2B2927] tracking-tight">
            {yearlyPlan.year} <span className="text-xl sm:text-2xl text-[#7C7871]">MAP</span>
          </div>
          <div className="font-utility text-xs text-[#8C867C]">
            LIFE ORIENTATION
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <span className="font-utility text-[11px] uppercase tracking-widest text-[#7C7871]">
            Annual Keyword
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-[#2B2927]">
            「{yearlyPlan.keyword}」
          </h1>
          <p className="font-reading text-sm sm:text-base text-[#68635B] max-w-xl leading-relaxed pt-1">
            {yearlyPlan.keywordDesc}
          </p>
        </div>
      </section>

      {/* 2. 6 Life Dimensions (Compass Territories) */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between text-xs font-utility text-[#8C867C]">
          <span>SIX TERRITORIES</span>
          <span className="font-reading text-[11px]">不設 KPI，只定心向</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {yearlyPlan.goals.map((goal) => (
            <div
              key={goal.id}
              className="p-6 rounded-2xl border border-[#E6E1D7] bg-[#FAF7F2] space-y-4"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-utility text-xs text-[#7C7871] tracking-wider uppercase">
                  {goal.category}
                </span>
                <span className="font-utility text-[10px] text-[#8C867C] border-b border-[#DDD8CE] pb-0.5">
                  {goal.commitment}
                </span>
              </div>

              <h3 className="font-display text-lg text-[#2B2927] font-normal leading-snug">
                {goal.title}
              </h3>

              {goal.notes && (
                <p className="font-reading text-xs text-[#68635B] leading-relaxed">
                  {goal.notes}
                </p>
              )}

              {/* Minimalist hairline progress */}
              <div className="pt-2 flex items-center gap-3">
                <div className="flex-1 h-[2px] bg-[#EAE5DC]">
                  <div
                    className="h-full bg-[#2B2927]"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <span className="font-utility text-[11px] text-[#7C7871]">
                  {goal.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
