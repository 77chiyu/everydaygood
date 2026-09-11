import React from 'react';
import { LifeProvider, useLife } from './context/LifeContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { TodayView } from './components/TodayView';
import { WeekView } from './components/WeekView';
import { MonthView } from './components/MonthView';
import { YearView } from './components/YearView';
import { GoalsView } from './components/GoalsView';
import { IdeasView } from './components/IdeasView';
import { LifeMemoryView } from './components/LifeMemoryView';
import { AIHubView } from './components/AIHubView';
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { DailyReviewModal } from './components/DailyReviewModal';
import { NewItemModal } from './components/NewItemModal';
import { RescheduleModal } from './components/RescheduleModal';

function MainContent() {
  const { activeTab } = useLife();

  return (
    <main className="w-full">
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'today' && <TodayView />}
      {activeTab === 'week' && <WeekView />}
      {activeTab === 'month' && <MonthView />}
      {activeTab === 'year' && <YearView />}
      {activeTab === 'goals' && <GoalsView />}
      {activeTab === 'ideas' && <IdeasView />}
      {(activeTab === 'memory' || (activeTab as string) === 'life') && <LifeMemoryView />}
      {activeTab === 'ai' && <AIHubView />}
    </main>
  );
}

export default function App() {
  return (
    <LifeProvider>
      <div className="min-h-screen bg-[#EFECE5] text-[#2B2927] font-reading antialiased selection:bg-[#EAE4D7] selection:text-[#1F1E1C]">
        <Navbar />
        <MainContent />
        <AIAssistantWidget />
        <DailyReviewModal />
        <NewItemModal />
        <RescheduleModal />

        {/* Quiet editorial footer */}
        <footer className="border-t border-[#E6E1D7] py-12 px-4 text-center space-y-1.5 mt-20">
          <div className="font-utility text-[10px] tracking-widest uppercase text-[#8C867C]">
            77 · PERSONAL LIFE OS
          </div>
          <p className="font-reading text-xs text-[#A69F93]">
            不把日程塞滿 · 身心優先 · 永遠保留屬於自己的自由留白
          </p>
        </footer>
      </div>
    </LifeProvider>
  );
}
