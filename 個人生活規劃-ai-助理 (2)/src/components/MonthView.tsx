import React from 'react';
import { useLife } from '../context/LifeContext';

export const MonthView: React.FC = () => {
  const { monthlyPlan } = useLife();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 text-[#2B2927] space-y-16 animate-in fade-in duration-300">
      {/* 1. Large Month Masthead */}
      <section className="border-b border-[#E6E1D7] pb-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="font-utility text-4xl sm:text-6xl font-light text-[#2B2927] tracking-tight uppercase">
            {monthlyPlan.monthEn} <span className="text-xl sm:text-2xl text-[#7C7871]">2026</span>
          </div>
          <div className="font-utility text-xs text-[#8C867C]">
            MONTHLY SPREAD
          </div>
        </div>

        <p className="font-display italic text-lg sm:text-xl text-[#68635B] mt-6 leading-relaxed max-w-2xl">
          — {monthlyPlan.vibe}
        </p>
      </section>

      {/* 2. 3 Focal Points */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between text-xs font-utility text-[#8C867C]">
          <span>THREE HIGHLIGHTS</span>
          <span className="font-reading text-[11px]">本月最重要的三個落點</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {monthlyPlan.threeHighlights.map((hl, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-[#E6E1D7] bg-[#FAF7F2] space-y-2"
            >
              <div className="flex items-baseline justify-between font-utility text-[11px] text-[#A69F93]">
                <span>0{idx + 1}</span>
                <span>{hl.category}</span>
              </div>
              <div className="font-reading text-sm text-[#2B2927] leading-relaxed pt-1">
                {hl.title}
              </div>
              <div className="pt-2 font-utility text-[10px] text-[#7C7871]">
                {hl.done ? '[已完成]' : '[進行中]'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Freely Scattered Experiences & Intentional Shopping */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Experiences */}
        <div className="space-y-4">
          <div className="font-utility text-xs text-[#8C867C] uppercase tracking-wider">
            Experiences to Try
          </div>
          <div className="space-y-3">
            {monthlyPlan.experiences.map((exp, i) => (
              <div
                key={i}
                className="flex items-baseline justify-between py-2 border-b border-[#EFEBE3] text-xs font-reading"
              >
                <span className="text-[#2B2927]">{exp.title}</span>
                <span className="font-utility text-[10px] text-[#8C867C] shrink-0 ml-4">
                  {exp.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Intentions */}
        <div className="space-y-4">
          <div className="font-utility text-xs text-[#8C867C] uppercase tracking-wider">
            Purchasing Intent
          </div>
          <div className="space-y-3">
            {monthlyPlan.shoppingList.map((item, i) => (
              <div
                key={i}
                className="flex items-baseline justify-between py-2 border-b border-[#EFEBE3] text-xs font-reading"
              >
                <div>
                  <span className="text-[#2B2927]">{item.title}</span>
                  <span className="font-utility text-[10px] text-[#8C867C] ml-2">
                    {item.type}
                  </span>
                </div>
                {item.price && (
                  <span className="font-utility text-[11px] text-[#7C7871] shrink-0">
                    {item.price}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Monthly Review Notes (生活札記回顧) */}
      <section className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#E6E1D7] space-y-6">
        <div className="flex items-baseline justify-between">
          <span className="font-utility text-xs text-[#7C7871] uppercase tracking-wider">
            Monthly Reflection
          </span>
          <span className="font-utility text-xs text-[#8C867C]">
            完成率 {monthlyPlan.monthlyReview.completionRate}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-reading leading-relaxed">
          <div className="space-y-1">
            <span className="font-utility text-[10px] text-[#A69F93] uppercase block">
              Most Rewarding
            </span>
            <p className="text-[#2B2927]">
              {monthlyPlan.monthlyReview.mostRewarding}
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-utility text-[10px] text-[#A69F93] uppercase block">
              Happiest Moment
            </span>
            <p className="text-[#2B2927]">
              {monthlyPlan.monthlyReview.happiestEvent}
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-utility text-[10px] text-[#A69F93] uppercase block">
              Habit Formed
            </span>
            <p className="text-[#2B2927]">
              {monthlyPlan.monthlyReview.newHabitFormed}
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-utility text-[10px] text-[#A69F93] uppercase block">
              Safe to Stop
            </span>
            <p className="text-[#2B2927]">
              {monthlyPlan.monthlyReview.safeToStop}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
