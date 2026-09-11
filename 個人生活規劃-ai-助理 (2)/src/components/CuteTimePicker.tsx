import React, { useState } from 'react';

interface CuteTimePickerProps {
  value: string; // e.g. "15:00"
  onChange: (newTime: string) => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  isModal?: boolean;
}

export const CuteTimePicker: React.FC<CuteTimePickerProps> = ({
  value,
  onChange,
  onClose,
  title = '選一個舒服的時間',
  subtitle = '隨你的節奏自然安排，不急不徐',
  isModal = true,
}) => {
  const initialParts = (value || '14:00').split(':');
  const initialH = parseInt(initialParts[0], 10) || 14;
  const initialM = parseInt(initialParts[1], 10) || 0;

  const [hour, setHour] = useState<number>(initialH);
  const [minute, setMinute] = useState<number>(initialM);

  const presets = [
    { label: '清晨微光', time: '07:30' },
    { label: '慢調早餐', time: '09:00' },
    { label: '早午茶時光', time: '10:30' },
    { label: '美味午餐', time: '12:00' },
    { label: '午後微憩', time: '13:30' },
    { label: '靈感閱讀', time: '15:00' },
    { label: '傍晚散步', time: '17:30' },
    { label: '溫暖晚餐', time: '19:00' },
    { label: '留給自己', time: '20:30' },
    { label: '晚安夜讀', time: '22:00' },
  ];

  const handleApplyPreset = (t: string) => {
    const [h, m] = t.split(':').map((n) => parseInt(n, 10));
    setHour(h);
    setMinute(m);
  };

  const handleHourChange = (delta: number) => {
    setHour((prev) => (prev + delta + 24) % 24);
  };

  const handleMinuteChange = (delta: number) => {
    // 15-minute snap for friendly cute tempo
    setMinute((prev) => {
      let next = prev + delta;
      if (next >= 60) next = 0;
      if (next < 0) next = 45;
      return next;
    });
  };

  const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  const handleConfirm = () => {
    onChange(formattedTime);
    if (onClose) onClose();
  };

  const content = (
    <div className="bg-[#FCFAF6] border border-[#DEC8C4] rounded-[32px] p-6 sm:p-7 shadow-xl space-y-6 max-w-md w-full animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="font-utility text-[11px] text-[#74484E] bg-[#EADCD9]/70 px-3.5 py-1 rounded-full font-medium inline-block tracking-wider">
          ✦ TIME & RHYTHM · 柔和時段 ✦
        </span>
        <h3 className="font-display text-xl sm:text-2xl text-[#2B2826] font-medium pt-1">
          {title}
        </h3>
        <p className="font-reading text-xs text-[#685F5B]">
          {subtitle}
        </p>
      </div>

      {/* Main Cute Big Time Bubble Display */}
      <div className="flex items-center justify-center gap-4 py-2">
        {/* Hour stepper */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleHourChange(1)}
            className="w-10 h-10 rounded-full bg-[#F7F5EE] hover:bg-[#EADCD9] border border-[#E5DFD5] text-[#2B2826] flex items-center justify-center text-lg font-bold transition-transform active:scale-90 cursor-pointer shadow-2xs"
            title="加一小時"
          >
            +
          </button>
          <div className="w-20 h-20 rounded-[26px] bg-gradient-to-b from-[#FAF8F5] to-[#F2EDE4] border-2 border-[#DEC8C4] flex flex-col items-center justify-center shadow-inner">
            <span className="font-display text-3xl font-semibold text-[#2B2826] tracking-tight">
              {String(hour).padStart(2, '0')}
            </span>
            <span className="font-utility text-[10px] text-[#9E938D] font-medium">時</span>
          </div>
          <button
            type="button"
            onClick={() => handleHourChange(-1)}
            className="w-10 h-10 rounded-full bg-[#F7F5EE] hover:bg-[#EADCD9] border border-[#E5DFD5] text-[#2B2826] flex items-center justify-center text-lg font-bold transition-transform active:scale-90 cursor-pointer shadow-2xs"
            title="減一小時"
          >
            −
          </button>
        </div>

        <div className="flex flex-col items-center justify-center pb-2">
          <span className="text-3xl font-bold text-[#C09D9B] animate-pulse">:</span>
        </div>

        {/* Minute stepper */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleMinuteChange(15)}
            className="w-10 h-10 rounded-full bg-[#F7F5EE] hover:bg-[#EADCD9] border border-[#E5DFD5] text-[#2B2826] flex items-center justify-center text-lg font-bold transition-transform active:scale-90 cursor-pointer shadow-2xs"
            title="加 15 分鐘"
          >
            +
          </button>
          <div className="w-20 h-20 rounded-[26px] bg-gradient-to-b from-[#FAF8F5] to-[#F2EDE4] border-2 border-[#DEC8C4] flex flex-col items-center justify-center shadow-inner">
            <span className="font-display text-3xl font-semibold text-[#2B2826] tracking-tight">
              {String(minute).padStart(2, '0')}
            </span>
            <span className="font-utility text-[10px] text-[#9E938D] font-medium">分</span>
          </div>
          <button
            type="button"
            onClick={() => handleMinuteChange(-15)}
            className="w-10 h-10 rounded-full bg-[#F7F5EE] hover:bg-[#EADCD9] border border-[#E5DFD5] text-[#2B2826] flex items-center justify-center text-lg font-bold transition-transform active:scale-90 cursor-pointer shadow-2xs"
            title="減 15 分鐘"
          >
            −
          </button>
        </div>
      </div>

      {/* Cute Quick Period Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-utility text-[#8C867C] px-1">
          <span>日常節奏快捷推薦</span>
          <span>點選即選取</span>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {presets.map((p) => {
            const isSelected = formattedTime === p.time;
            return (
              <button
                key={p.time}
                type="button"
                onClick={() => handleApplyPreset(p.time)}
                className={`px-3 py-1.5 rounded-full text-xs font-reading transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#C09D9B] text-[#2B2826] font-semibold shadow-xs scale-105 border border-[#B08A88]'
                    : 'bg-[#F7F5EE] text-[#524E47] hover:bg-[#EADCD9] border border-[#E5DFD5]'
                }`}
              >
                <span>{p.label}</span>
                <span className="font-utility text-[10px] opacity-75">{p.time}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFECE5]">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full font-utility text-xs text-[#7C7871] hover:text-[#2B2826] hover:bg-[#EFECE5] transition-colors cursor-pointer"
          >
            再想想
          </button>
        )}
        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-[#C09D9B] hover:bg-[#B38D8B] text-[#2B2826] font-medium font-reading text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer text-center"
        >
          就這個時間（{formattedTime}）✨
        </button>
      </div>
    </div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-[#2B2927]/35 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      {content}
    </div>
  );
};
