import React, { useState, useEffect } from 'react';
import { useLife } from '../context/LifeContext';

export const DailyReviewModal: React.FC = () => {
  const { isReviewModalOpen, setIsReviewModalOpen, submitDailyReview, justWrapUpToday, dailyPlan } = useLife();

  const [completedText, setCompletedText] = useState('');
  const [joyText, setJoyText] = useState('');
  const [tiredText, setTiredText] = useState('');
  const [tomorrowNotes, setTomorrowNotes] = useState('');
  const [moodState, setMoodState] = useState('舒適');

  // Sync inputs with dailyPlan.review when opened; if review is reset/empty, start fresh!
  useEffect(() => {
    if (isReviewModalOpen) {
      if (dailyPlan.review) {
        setCompletedText(dailyPlan.review.completedText || '');
        setJoyText(dailyPlan.review.joyText || '');
        setTiredText(dailyPlan.review.tiredText || '');
        setTomorrowNotes(dailyPlan.review.tomorrowNotes || '');
        setMoodState(dailyPlan.review.moodState || '舒適');
      } else {
        setCompletedText('');
        setJoyText('');
        setTiredText('');
        setTomorrowNotes('');
        setMoodState('舒適');
      }
    }
  }, [isReviewModalOpen, dailyPlan.review]);

  if (!isReviewModalOpen) return null;

  const moodOptions = ['疲憊', '平淡', '舒適', '愉悅', '充實'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDailyReview({
      completedText,
      joyText,
      tiredText,
      tomorrowNotes,
      moodState,
      isDone: true,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
    });
  };

  return (
    <div className="fixed inset-0 bg-[#2B2927]/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] border border-[#E6E1D7] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-baseline justify-between border-b border-[#EAE5DC] pb-4">
          <div>
            <div className="font-utility text-[10px] uppercase tracking-wider text-[#8C867C]">
              Evening Wrap-Up
            </div>
            <h2 className="font-display text-xl text-[#2B2927] mt-1 font-normal">
              記錄今天真實的感受
            </h2>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(false)}
            className="font-utility text-xs text-[#8C867C] hover:text-[#2B2927]"
          >
            關閉
          </button>
        </div>

        {/* State select */}
        <div className="space-y-2">
          <label className="block font-reading text-xs text-[#7C7871]">
            今天整體的身心感受：
          </label>
          <div className="flex items-center gap-2">
            {moodOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setMoodState(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-reading transition-all ${
                  moodState === opt
                    ? 'bg-[#2B2927] text-white font-medium'
                    : 'bg-[#F2ECE1] text-[#68635B] hover:bg-[#EAE4D7]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-reading">
          <div className="space-y-1">
            <label className="block text-[#68635B]">
              1. 今天完成了什麼？（微小的事也很好）
            </label>
            <input
              type="text"
              value={completedText}
              onChange={(e) => setCompletedText(e.target.value)}
              placeholder="例如：順利確認完資料、散步曬了太陽..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#F4EFE6] border border-[#DDD8CE] text-[#2B2927] placeholder-[#A0988E] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[#68635B]">
              2. 今天最放鬆、平靜的一刻是什麼？
            </label>
            <input
              type="text"
              value={joyText}
              onChange={(e) => setJoyText(e.target.value)}
              placeholder="例如：午後泡了熱茶捏陶、看窗外光影..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#F4EFE6] border border-[#DDD8CE] text-[#2B2927] placeholder-[#A0988E] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[#68635B]">
              3. 今天有什麼讓你感到耗能或疲累？
            </label>
            <input
              type="text"
              value={tiredText}
              onChange={(e) => setTiredText(e.target.value)}
              placeholder="例如：無特別疲累、或是通勤人潮較多..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#F4EFE6] border border-[#DDD8CE] text-[#2B2927] placeholder-[#A0988E] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[#68635B]">
              4. 明天有什麼需要先備忘的？
            </label>
            <input
              type="text"
              value={tomorrowNotes}
              onChange={(e) => setTomorrowNotes(e.target.value)}
              placeholder="例如：記得超商取件、其餘保持留白..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#F4EFE6] border border-[#DDD8CE] text-[#2B2927] placeholder-[#A0988E] focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#EAE5DC] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={justWrapUpToday}
              className="font-reading text-xs text-[#7C7871] hover:text-[#2B2927] hover:underline"
            >
              不想寫，一鍵「今天就這樣吧」
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="font-utility text-xs text-[#8C867C]"
              >
                稍後
              </button>
              <button
                type="submit"
                className="font-utility text-xs px-4 py-2 bg-[#2B2927] text-white rounded-lg hover:bg-[#423E3A] transition-colors"
              >
                儲存回顧
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
