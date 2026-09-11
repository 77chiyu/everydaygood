import React, { useState } from 'react';
import { useLife, NavTab } from '../context/LifeContext';
import { DisturbanceMode } from '../types';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsChatOpen,
    disturbanceMode,
    setDisturbanceMode,
    setIsReviewModalOpen,
    taipeiTimeStr,
    weather
  } = useLife();

  const [isModeOpen, setIsModeOpen] = useState(false);

  // Define unique bubble traits for each nav item to avoid identical capsule syndrome
  const navItems: {
    id: NavTab;
    label: string;
    sub: string;
    sizeClass: string;
    extraRoundClass?: string;
  }[] = [
    { id: 'home', label: '首頁', sub: 'Home', sizeClass: 'px-3 py-1.5 text-xs' },
    { id: 'today', label: '今日', sub: 'Today', sizeClass: 'px-4 py-1.5 text-xs font-medium' },
    { id: 'week', label: '週計畫', sub: 'Week', sizeClass: 'px-3 py-1.5 text-xs' },
    { id: 'month', label: '月計畫', sub: 'Month', sizeClass: 'px-3 py-1.5 text-xs' },
    { id: 'year', label: '年地圖', sub: 'Year', sizeClass: 'px-3.5 py-1.5 text-xs', extraRoundClass: 'rounded-2xl' },
    { id: 'goals', label: '方向', sub: 'Goals', sizeClass: 'px-3 py-1.5 text-xs' },
    { id: 'ideas', label: '想做的事', sub: 'Ideas', sizeClass: 'px-4 py-1.5 text-xs font-medium' },
    { id: 'memory', label: '生活筆記', sub: 'Memory', sizeClass: 'px-3 py-1.5 text-xs' },
    { id: 'ai', label: 'AI', sub: '77 Hub', sizeClass: 'px-3.5 py-1.5 text-xs tracking-wider' }
  ];

  const modeLabels: Record<DisturbanceMode, { label: string; desc: string }> = {
    free: { label: '自然伴讀', desc: '適時提供生活推薦' },
    low: { label: '低頻微語', desc: '每日至多一至兩條輕量提示' },
    important_only: { label: '僅記重要', desc: '僅期限與固定行程提醒' },
    quiet: { label: '靜音模式', desc: '不主動打擾，有提問才回應' }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F7F5EE]/95 backdrop-blur-md border-b border-[#E5DFD5] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 min-h-[64px] py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Live Taipei Clock */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div
            onClick={() => setActiveTab('home')}
            className="cursor-pointer group flex items-baseline gap-2"
          >
            <span className="font-utility text-sm tracking-widest text-[#2B2826] font-semibold">
              77
            </span>
            <span className="text-[#C4BCAC]">/</span>
            <span className="font-display text-base tracking-wide text-[#2B2826]">
              LIFE OS
            </span>
          </div>

          <div className="flex items-baseline gap-2 font-utility text-xs text-[#685F5B]">
            <span className="tracking-tight font-medium text-[#2B2826]">
              {taipeiTimeStr}
            </span>
            <span className="text-[#C4BCAC]">·</span>
            <span className="font-reading text-[11px] text-[#9E938D] hidden sm:inline">
              台北 {weather.temp}°C
            </span>
          </div>
        </div>

        {/* Floating Bubble Navigation */}
        <nav
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const roundClass = item.extraRoundClass || 'rounded-full';

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative whitespace-nowrap transition-all duration-200 ease-out select-none cursor-pointer ${roundClass} ${item.sizeClass} ${
                  isActive
                    ? 'bg-[#C09D9B] text-[#2B2826] font-medium shadow-[0_1px_4px_rgba(0,0,0,0.05)] scale-[1.02]'
                    : 'text-[#685F5B] bg-transparent hover:bg-[#EDE9DE]/70 hover:text-[#2B2826] hover:scale-[1.02]'
                }`}
              >
                <span className="font-reading inline-block">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side: Quiet Mode & Quick Actions */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs">
          {/* Evening review button */}
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="font-utility text-[11px] text-[#685F5B] hover:text-[#2B2826] px-3 py-1.5 rounded-full bg-[#EFECE2]/70 hover:bg-[#EAE4D7] transition-all"
          >
            日末回顧
          </button>

          <span className="text-[#DDD7CB]">·</span>

          {/* Mode Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsModeOpen(!isModeOpen)}
              className="font-utility text-[11px] text-[#685F5B] hover:text-[#2B2826] px-3 py-1.5 rounded-full bg-[#EFECE2]/70 hover:bg-[#EAE4D7] flex items-center gap-1.5 transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FA59F]" />
              <span>{modeLabels[disturbanceMode].label}</span>
            </button>

            {isModeOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-[#FCFAF6] border border-[#E5DFD5] rounded-2xl shadow-sm p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setIsModeOpen(false)}
              >
                {(['free', 'low', 'important_only', 'quiet'] as DisturbanceMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setDisturbanceMode(mode);
                      setIsModeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors ${
                      disturbanceMode === mode
                        ? 'bg-[#EADCD9] text-[#2B2826] font-medium'
                        : 'text-[#685F5B] hover:bg-[#F2EFE7]'
                    }`}
                  >
                    <div className="font-medium">{modeLabels[mode].label}</div>
                    <div className="text-[10px] text-[#9E938D] mt-0.5">
                      {modeLabels[mode].desc}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-[#DDD7CB]">·</span>

          {/* 77 Companion Drawer toggle */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="font-utility text-[11px] text-[#2B2826] px-3 py-1.5 rounded-full bg-[#EADCD9]/60 hover:bg-[#C09D9B]/50 transition-all font-medium"
          >
            · 77 對話
          </button>
        </div>
      </div>
    </header>
  );
};

