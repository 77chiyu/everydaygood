import React, { useState } from 'react';
import { useLife } from '../context/LifeContext';
import { ItemCategoryType } from '../types';

export const NewItemModal: React.FC = () => {
  const {
    isNewItemModalOpen,
    setIsNewItemModalOpen,
    addIdea,
    addTask,
    addTimeSlot,
    setActiveTab
  } = useLife();

  const [inputTitle, setInputTitle] = useState('');
  const [inputNote, setInputNote] = useState('');
  const [category, setCategory] = useState<ItemCategoryType>('想做');
  const [destination, setDestination] = useState<'idea' | 'today_task' | 'timeline'>('idea');
  const [timelineHour, setTimelineHour] = useState('15:00');
  const [isParsing, setIsParsing] = useState(false);

  if (!isNewItemModalOpen) return null;

  const categoryTags: ItemCategoryType[] = [
    '必須做',
    '應該做',
    '想做',
    '習慣',
    '靈感',
    '待觀察'
  ];

  const handleSmartAnalyze = async () => {
    if (!inputTitle.trim()) return;
    setIsParsing(true);
    try {
      const res = await fetch('/api/ai/parse-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputTitle })
      });
      const data = await res.json();
      if (data.title) setInputTitle(data.title);
      if (data.type && categoryTags.includes(data.type)) setCategory(data.type);
      if (data.notes) setInputNote(data.notes);
    } catch (e) {
      console.warn('Smart intent analyze note:', e);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    if (destination === 'idea') {
      addIdea({
        title: inputTitle.trim(),
        description: inputNote.trim() || '隨手記下',
        category,
        urgency: 'low',
        interestLevel: 'high',
        preferredContext: '有空閒時',
        aiScore: 85
      });
      setActiveTab('ideas');
    } else if (destination === 'today_task') {
      addTask({
        title: inputTitle.trim(),
        type: category,
        status: 'todo',
        importance: category === '必須做' ? 3 : 2,
        estimatedDuration: '45 分鐘',
        preferredTime: '今日空檔',
        source: '隨手捕捉',
        aiNotes: inputNote.trim() || undefined
      }, category === '想做');
      setActiveTab('today');
    } else {
      addTimeSlot({
        time: timelineHour,
        title: inputTitle.trim(),
        category: category === '想做' ? 'task' : 'fixed',
        durationMinutes: 60,
        aiNote: inputNote.trim() || undefined,
        completed: false
      });
      setActiveTab('today');
    }

    setInputTitle('');
    setInputNote('');
    setIsNewItemModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-[#2B2927]/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] border border-[#E6E1D7] rounded-2xl p-6 max-w-md w-full shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-baseline justify-between border-b border-[#EAE5DC] pb-3">
          <div>
            <div className="font-utility text-[10px] uppercase tracking-wider text-[#8C867C]">
              Capture
            </div>
            <h2 className="font-display text-lg text-[#2B2927] mt-0.5 font-normal">
              捕捉生活想法
            </h2>
          </div>
          <button
            onClick={() => setIsNewItemModalOpen(false)}
            className="font-utility text-xs text-[#8C867C] hover:text-[#2B2927]"
          >
            關閉
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-reading">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[#68635B]">
                想到什麼？
              </label>
              <button
                type="button"
                onClick={handleSmartAnalyze}
                disabled={isParsing || !inputTitle.trim()}
                className="font-utility text-[11px] text-[#2B2927] hover:underline disabled:opacity-30"
              >
                {isParsing ? '解析中...' : '讓 77 協助分析'}
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="例如：去美術館看插畫展、整理書桌..."
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-[#F4EFE6] border border-[#DDD8CE] text-[#2B2927] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#68635B] mb-1.5">
              生活分類
            </label>
            <div className="grid grid-cols-3 gap-1.5 font-reading">
              {categoryTags.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-1.5 rounded-lg text-xs transition-all ${
                    category === cat
                      ? 'bg-[#2B2927] text-white font-medium'
                      : 'bg-[#F4EFE6] text-[#68635B] hover:bg-[#EAE4D7]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#68635B] mb-1.5">
              存放位置
            </label>
            <div className="space-y-1.5 text-xs text-[#524E47]">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#F4EFE6] cursor-pointer">
                <input
                  type="radio"
                  checked={destination === 'idea'}
                  onChange={() => setDestination('idea')}
                  className="accent-[#2B2927]"
                />
                <span>收進「想法牆」（不排日期，毫無壓力）</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#F4EFE6] cursor-pointer">
                <input
                  type="radio"
                  checked={destination === 'today_task'}
                  onChange={() => setDestination('today_task')}
                  className="accent-[#2B2927]"
                />
                <span>放入今日清單</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#F4EFE6] cursor-pointer">
                <input
                  type="radio"
                  checked={destination === 'timeline'}
                  onChange={() => setDestination('timeline')}
                  className="accent-[#2B2927]"
                />
                <span>指定今日時間軸</span>
              </label>
            </div>
          </div>

          {destination === 'timeline' && (
            <div className="flex items-center gap-2 bg-[#F4EFE6] p-2.5 rounded-lg">
              <span className="font-utility text-xs text-[#7C7871]">時間：</span>
              <input
                type="time"
                value={timelineHour}
                onChange={(e) => setTimelineHour(e.target.value)}
                className="font-utility px-2 py-1 text-xs rounded bg-white border border-[#DDD8CE]"
              />
            </div>
          )}

          <div>
            <label className="block text-[#68635B] mb-1">
              小備註（選填）
            </label>
            <input
              type="text"
              placeholder="給自己的溫柔提醒..."
              value={inputNote}
              onChange={(e) => setInputNote(e.target.value)}
              className="w-full px-3.5 py-1.5 rounded-lg bg-[#F4EFE6] border border-[#DDD8CE] text-[#2B2927] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsNewItemModalOpen(false)}
              className="font-utility text-xs text-[#8C867C]"
            >
              取消
            </button>
            <button
              type="submit"
              className="font-utility text-xs px-4 py-2 bg-[#2B2927] text-white rounded-lg hover:bg-[#423E3A] transition-colors"
            >
              確認記錄
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
