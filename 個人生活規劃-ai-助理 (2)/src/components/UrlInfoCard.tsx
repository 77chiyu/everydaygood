import React from 'react';
import { UrlIdentity, ExtractedUrlInfo } from '../types';

interface UrlInfoCardProps {
  identity: UrlIdentity;
  extracted: ExtractedUrlInfo;
  suggestedAction?: 'ask_intent' | 'proposal' | 'info_only';
  onIntentAction?: (actionText: string) => void;
}

export const UrlInfoCard: React.FC<UrlInfoCardProps> = ({
  identity,
  extracted,
  suggestedAction,
  onIntentAction
}) => {
  const isYouTube = identity.pageType === 'youtube';

  if (!extracted.isReadable) {
    return (
      <div className="mt-2 p-3.5 rounded-xl border border-[#E3D8B6] bg-[#FAF6ED] text-left space-y-2">
        <div className="flex items-center gap-1.5 font-utility text-[10px] text-[#8C7A3E] tracking-wider uppercase">
          <span>網址讀取提示</span>
        </div>
        <p className="font-reading text-xs text-[#5A4F2E] leading-relaxed">
          我目前讀不到這個頁面的完整內容，你可以貼一下內容或截圖給我，我再幫你判斷。
        </p>
        <div className="text-[11px] font-reading text-[#8C7A3E] truncate">
          來源網址：
          <a
            href={identity.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline ml-1"
          >
            {identity.sourceUrl}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 p-3.5 rounded-xl border border-[#D5DDD5] bg-[#F7FAF7] text-left space-y-2.5 transition-all">
      {/* Header Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="font-utility text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#E3ECE3] text-[#3D523D]">
            {isYouTube ? 'YouTube 影片理解' : '活動與頁面解析'}
          </span>
          <span className="font-utility text-[9px] text-[#3D523D] bg-white/70 border border-[#CBD8CB] px-1.5 py-0.2 rounded">
            已確認原始資訊
          </span>
        </div>

        <a
          href={identity.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-reading text-[11px] text-[#4F6B4F] hover:text-[#2E422E] underline shrink-0"
        >
          查看原頁面
        </a>
      </div>

      {/* Content Layout */}
      <div className="flex items-start gap-3">
        {extracted.thumbnailUrl && (
          <img
            src={extracted.thumbnailUrl}
            alt={extracted.title}
            className="w-16 h-12 object-cover rounded-lg border border-black/10 shrink-0"
            referrerPolicy="no-referrer"
          />
        )}

        <div className="space-y-1 min-w-0 flex-1">
          <div className="font-display text-sm font-medium text-[#2B2927] leading-snug">
            {isYouTube ? `〈${extracted.title}〉` : extracted.title}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs font-reading text-[#5A554E]">
            {extracted.channelName && (
              <span>頻道：<strong>{extracted.channelName}</strong></span>
            )}
            {extracted.duration && (
              <span>片長：<strong>{extracted.duration}</strong>（約 {extracted.durationMinutes} 分鐘）</span>
            )}
            {extracted.dateText && (
              <span>日期：<strong>{extracted.dateText}</strong></span>
            )}
            {extracted.timeText && (
              <span>時間：<strong>{extracted.timeText}</strong></span>
            )}
          </div>

          {extracted.locationText && (
            <div className="text-[11px] font-reading text-[#5A554E] pt-0.5">
              地點：{extracted.locationText}
            </div>
          )}

          {extracted.priceText && (
            <div className="text-[11px] font-reading text-[#5A554E]">
              費用：{extracted.priceText}
            </div>
          )}

          {extracted.deadlineText && (
            <div className="text-[11px] font-reading text-[#7A4B54]">
              備註：{extracted.deadlineText}
            </div>
          )}
        </div>
      </div>

      {/* Intent Action Chips */}
      {suggestedAction === 'ask_intent' && onIntentAction && (
        <div className="pt-2 border-t border-black/5 flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onIntentAction(isYouTube ? '我想今天找時間看這支影片' : '我想去這個活動，幫我找時間')}
            className="font-reading text-xs px-2.5 py-1 rounded-lg bg-white text-[#2B2927] border border-black/15 hover:border-black/30 shadow-xs"
          >
            {isYouTube ? '我想看這支影片' : '我想去這個活動'}
          </button>
          <button
            onClick={() => onIntentAction('只是分享給你看')}
            className="font-reading text-xs px-2.5 py-1 rounded-lg bg-transparent text-[#635E56] hover:bg-black/5 border border-black/10"
          >
            只是分享給你看
          </button>
          <button
            onClick={() => onIntentAction('幫我分析一下這個頁面的重點')}
            className="font-reading text-xs px-2.5 py-1 rounded-lg bg-transparent text-[#635E56] hover:bg-black/5 border border-black/10"
          >
            幫我看看重點
          </button>
        </div>
      )}
    </div>
  );
};
