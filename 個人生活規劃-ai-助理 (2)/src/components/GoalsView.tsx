import React, { useState } from 'react';
import { useLife } from '../context/LifeContext';
import { GoalStatus } from '../types';

export const GoalsView: React.FC = () => {
  const { goalCascades, goalItems, updateGoalStatus, addTask, setActiveTab } = useLife();
  const [selectedStatus, setSelectedStatus] = useState<GoalStatus | 'all'>('all');

  const allStatuses: GoalStatus[] = [
    '想到',
    '想試試',
    '準備中',
    '進行中',
    '暫停',
    '重新考慮',
    '方向改變',
    '完成',
    '放下'
  ];

  const filteredGoals =
    selectedStatus === 'all'
      ? goalItems
      : goalItems.filter((g) => g.status === selectedStatus);

  const handleSendToToday = (actionTitle: string) => {
    addTask(
      {
        title: actionTitle,
        type: '想做',
        status: 'todo',
        importance: 2,
        estimatedDuration: '25 分鐘',
        preferredTime: '今日午後',
        source: '方向連動微行動'
      },
      true
    );
    setActiveTab('today');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 text-[#2B2927] space-y-12 animate-in fade-in duration-300">
      {/* 1. Header */}
      <section className="border-b border-[#E6E1D7] pb-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <span className="font-utility text-xs text-[#8C867C] uppercase tracking-wider">
            Direction Map
          </span>
          <span className="font-utility text-xs text-[#7C7871]">
            非進度管理表 · 是生活心向
          </span>
        </div>

        <div className="mt-6 space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-normal text-[#2B2927]">
            願景如何溫和沉降入日常
          </h1>
          <p className="font-reading text-sm text-[#68635B] leading-relaxed max-w-xl">
            不是逼迫自己爬階梯，而是確認今天只做二十分鐘的小事，依然與內心真正想去的地方連在一起。目標可隨時暫停或放下，無須愧疚。
          </p>
        </div>
      </section>

      {/* 2. Cascading Maps */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between">
          <span className="font-utility text-xs text-[#8C867C] uppercase tracking-wider">
            CASCADING FLOW / 願景階梯
          </span>
        </div>

        <div className="space-y-6">
          {goalCascades.map((cascade) => (
            <div
              key={cascade.id}
              className="p-8 rounded-2xl border border-[#E6E1D7] bg-[#FAF7F2] space-y-6"
            >
              {/* Year */}
              <div className="space-y-1">
                <span className="font-utility text-[10px] uppercase text-[#8C867C] tracking-wider">
                  Year Horizon
                </span>
                <div className="font-display text-xl text-[#2B2927]">
                  {cascade.yearGoal}
                </div>
              </div>

              {/* Stepped flow */}
              <div className="pl-4 sm:pl-6 border-l border-[#DDD8CE] space-y-5 text-xs font-reading">
                {/* Month */}
                <div className="space-y-0.5">
                  <span className="font-utility text-[10px] text-[#A69F93] uppercase">
                    Month Focal Point
                  </span>
                  <p className="text-[#3E3A34] text-sm">{cascade.monthGoal}</p>
                </div>

                {/* Week */}
                <div className="space-y-0.5">
                  <span className="font-utility text-[10px] text-[#A69F93] uppercase">
                    Week Gentle Step
                  </span>
                  <p className="text-[#3E3A34] text-sm">{cascade.weekMilestone}</p>
                </div>

                {/* Today */}
                <div className="space-y-1.5 pt-1">
                  <span className="font-utility text-[10px] text-[#8C6D52] font-semibold uppercase">
                    Today Micro Action
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                    <p className="text-[#2B2927] font-medium text-sm">
                      {cascade.todayAction}
                    </p>
                    <button
                      onClick={() => handleSendToToday(cascade.todayAction)}
                      className="font-utility text-[11px] text-[#2B2927] border-b border-[#2B2927] pb-0.5 hover:text-[#8C6D52] hover:border-[#8C6D52] transition-colors self-start"
                    >
                      放入今日待辦
                    </button>
                  </div>
                </div>
              </div>

              {/* AI companion note */}
              <div className="pt-2 border-t border-[#EFEBE3] font-display italic text-xs text-[#7A756C]">
                — {cascade.aiObservation}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Goal Status & Evolution System (9 Statuses) */}
      <section className="space-y-6 pt-6 border-t border-[#E6E1D7]">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <span className="font-utility text-xs text-[#8C867C] uppercase tracking-wider">
              GOAL STATUS RADAR
            </span>
            <h2 className="font-display text-2xl text-[#2B2927] mt-1">
              生活目標演變狀態
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`font-utility text-xs px-2.5 py-1 rounded transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-[#2B2927] text-white'
                  : 'bg-[#FAF7F2] border border-[#E6E1D7] text-[#6E685F] hover:bg-[#EDE8DE]'
              }`}
            >
              全部 ({goalItems.length})
            </button>
            {allStatuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`font-utility text-xs px-2 py-1 rounded transition-colors ${
                  selectedStatus === st
                    ? 'bg-[#2B2927] text-white'
                    : 'bg-[#FAF7F2] border border-[#E6E1D7] text-[#6E685F] hover:bg-[#EDE8DE]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Goal items list with quick status switcher */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6E1D7] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="font-utility text-[10px] text-[#7E8B7B] uppercase bg-[#EDF1EB] px-2 py-0.5 rounded">
                    {goal.category}
                  </span>
                  <span className="font-utility text-[10px] text-[#8C867C]">
                    更新於 {goal.updatedAt}
                  </span>
                </div>

                <h3 className="font-display text-lg text-[#2B2927] font-normal leading-snug">
                  {goal.title}
                </h3>

                <p className="font-reading text-xs text-[#68635B] leading-relaxed">
                  {goal.description}
                </p>

                {goal.microActionToday && (
                  <div className="p-2 rounded-lg bg-[#F5F1E9] text-xs font-reading text-[#555049]">
                    今日輕步驟：{goal.microActionToday}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#EFEBE3] flex items-center justify-between">
                <span className="font-utility text-[10px] text-[#8C867C]">
                  當前狀態：
                </span>
                <select
                  value={goal.status}
                  onChange={(e) => updateGoalStatus(goal.id, e.target.value as GoalStatus)}
                  className="font-reading text-xs bg-white border border-[#DDD8CE] rounded-lg px-2 py-1 text-[#2B2927] focus:outline-none"
                >
                  {allStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
