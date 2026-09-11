import React from 'react';
import { useLife } from '../context/LifeContext';

export const WeekView: React.FC = () => {
  const { weeklyPlan, addTask, setActiveTab } = useLife();

  const handleAdoptBreakdown = (taskTitle: string) => {
    addTask({
      title: `${taskTitle}（輕量 20 分鐘）`,
      type: '想做',
      status: 'todo',
      importance: 1,
      estimatedDuration: '20 分鐘',
      preferredTime: '午後有空時',
      source: '77 拖延拆解建議'
    }, true);
    setActiveTab('today');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 text-[#2B2927] space-y-12 animate-in fade-in duration-300">
      {/* 1. Planning Sheet Masthead */}
      <section className="border-b border-[#E6E1D7] pb-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-3">
            <span className="font-utility text-4xl sm:text-5xl font-light text-[#2B2927]">
              W{weeklyPlan.weekNumber}
            </span>
            <span className="font-utility text-xs text-[#7C7871] tracking-wider uppercase">
              {weeklyPlan.weekRange}
            </span>
          </div>
          <div className="font-utility text-xs text-[#8C867C]">
            WEEKLY DESK SHEET
          </div>
        </div>

        <div className="mt-6">
          <span className="font-utility text-[11px] uppercase tracking-widest text-[#7C7871] block mb-1">
            Theme
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#2B2927]">
            {weeklyPlan.theme}
          </h1>
        </div>

        {/* 3 Top Priorities */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#EFEBE3]">
          {weeklyPlan.topPriorities.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <span className="font-utility text-[11px] text-[#A69F93]">
                0{idx + 1}
              </span>
              <p className="font-reading text-sm text-[#2B2927] leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. 7-Day Rhythm (Horizontal Flow) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs font-utility text-[#8C867C]">
          <span>7-DAY FLOW</span>
          <span className="font-reading text-[11px]">將自由視為正式行程</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
          {weeklyPlan.daysSummary.map((d, i) => {
            const isRest = d.status === '休息' || d.status === '自由';

            return (
              <div
                key={i}
                className={`p-3.5 rounded-xl border transition-all ${
                  d.dayEn === 'Thu'
                    ? 'border-[#2B2927] bg-[#FBF9F5]'
                    : 'border-[#E6E1D7] bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-baseline justify-between font-utility text-xs text-[#7C7871]">
                  <span className="font-medium text-[#2B2927]">{d.dayEn}</span>
                  <span className="text-[10px]">{d.date}</span>
                </div>

                <div className="mt-3">
                  <span
                    className={`font-utility text-[10px] pb-0.5 ${
                      isRest
                        ? 'text-[#465445] border-b border-[#A4B5A2]'
                        : 'text-[#7C7871]'
                    }`}
                  >
                    {d.status}
                  </span>
                  <p className="font-reading text-xs text-[#2B2927] mt-1.5 line-clamp-2">
                    {d.routine}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-[#EFEBE3] font-utility text-[10px] text-[#8C867C]">
                  空白 {d.freeHours}h
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Free Space Meter & Pacing Observation */}
      <section className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E6E1D7] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <span className="font-utility text-xs text-[#7C7871] tracking-wider uppercase">
            Free Space Ratio
          </span>
          <span className="font-utility text-sm font-medium text-[#2B2927]">
            {weeklyPlan.freeTimePercentage}% 留白（約 40 小時自由時間）
          </span>
        </div>

        {/* Minimalist line meter */}
        <div className="w-full h-[2px] bg-[#E2DCD1] relative">
          <div
            className="h-full bg-[#2B2927]"
            style={{ width: `${weeklyPlan.freeTimePercentage}%` }}
          />
        </div>

        <p className="font-display italic text-sm text-[#635E56] leading-relaxed pt-1">
          — {weeklyPlan.aiPacingJudgement}
        </p>
      </section>

      {/* 4. Delayed Task Insight & Micro-Breakdown */}
      <section className="space-y-4">
        <div className="font-utility text-xs text-[#8C867C] uppercase tracking-wider">
          Reflection & Breakdown
        </div>

        {weeklyPlan.delayedTasksAnalysis.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border border-[#E6E1D7] bg-[#FAF7F2] space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-3">
                <h3 className="font-display text-base text-[#2B2927] font-medium">
                  {item.taskName}
                </h3>
                <span className="font-utility text-[11px] text-[#A69F93]">
                  連續延後 {item.delayedCount} 次
                </span>
              </div>
              <span className="font-reading text-xs text-[#7C7871]">
                不怪自己，只是門檻過高
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-reading text-[#68635B]">
              <div className="font-utility text-[10px] text-[#A69F93] uppercase">
                Why delayed
              </div>
              {item.reasons.map((r, ri) => (
                <div key={ri} className="flex items-baseline gap-2">
                  <span className="text-[#A69F93]">·</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#EFEBE3] space-y-2">
              <div className="font-utility text-[10px] text-[#A69F93] uppercase">
                Suggested 20-min steps
              </div>
              <div className="flex flex-wrap gap-2">
                {item.suggestedBreakdown.map((step, si) => (
                  <button
                    key={si}
                    onClick={() => handleAdoptBreakdown(step)}
                    className="font-reading text-xs px-3 py-1.5 rounded-lg bg-[#F2ECE1] hover:bg-[#EAE4D7] border border-[#DDD8CE] text-[#2B2927] transition-colors"
                  >
                    + {step}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
