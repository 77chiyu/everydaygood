import React from 'react';
import { SchedulingProposal, ProposalActionOption } from '../types';

interface ProposalCardProps {
  proposal: SchedulingProposal;
  messageId: string;
  onAction: (messageId: string, option: ProposalActionOption) => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  messageId,
  onAction
}) => {
  const isPending = proposal.status === 'pending';

  // Scenario configuration based on the Editorial Color System
  const getScenarioStyle = () => {
    switch (proposal.scenario) {
      case 'schedule_today':
        return {
          tag: '建議安排在今天',
          cardBg: 'bg-[#EEF3F7]',
          cardBorder: 'border-[#D0DEE8]',
          tagBg: 'bg-[#D9E4EC]',
          tagText: 'text-[#3A5364]',
          accentText: 'text-[#2C4150]',
          reasonText: 'text-[#4A677B]'
        };
      case 'schedule_future':
        return {
          tag: '建議預留未來從容時段',
          cardBg: 'bg-[#F8F1F3]',
          cardBorder: 'border-[#E5CED4]',
          tagBg: 'bg-[#EAD8DD]',
          tagText: 'text-[#734950]',
          accentText: 'text-[#5C363D]',
          reasonText: 'text-[#8C5D65]'
        };
      case 'overload_warn':
        return {
          tag: '今日已充實・建議保留留白',
          cardBg: 'bg-[#F9F5EA]',
          cardBorder: 'border-[#E3D8B6]',
          tagBg: 'bg-[#EBE1C0]',
          tagText: 'text-[#6F5B29]',
          accentText: 'text-[#57461F]',
          reasonText: 'text-[#877038]'
        };
      case 'long_term_wish':
        return {
          tag: '長期生活興趣・建議備存',
          cardBg: 'bg-[#F4F0F4]',
          cardBorder: 'border-[#D7CAD8]',
          tagBg: 'bg-[#DDD3DE]',
          tagText: 'text-[#564457]',
          accentText: 'text-[#423343]',
          reasonText: 'text-[#6B576C]'
        };
      case 'small_chore':
        return {
          tag: '順路微型雜事・輕鬆完成',
          cardBg: 'bg-[#EFF3EE]',
          cardBorder: 'border-[#D0DDD0]',
          tagBg: 'bg-[#D7E3D5]',
          tagText: 'text-[#4B5C48]',
          accentText: 'text-[#384636]',
          reasonText: 'text-[#5F735C]'
        };
      default:
        return {
          tag: '生活節奏建議',
          cardBg: 'bg-[#F7F5F0]',
          cardBorder: 'border-[#E6E1D7]',
          tagBg: 'bg-[#EFEBE3]',
          tagText: 'text-[#635E56]',
          accentText: 'text-[#2B2927]',
          reasonText: 'text-[#68635B]'
        };
    }
  };

  const style = getScenarioStyle();

  return (
    <div
      id={`proposal-card-${proposal.id}`}
      className={`mt-2.5 p-4 rounded-xl border ${style.cardBg} ${style.cardBorder} transition-all space-y-3 text-left`}
    >
      {/* Header Tag & Status */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`font-utility text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md ${style.tagBg} ${style.tagText}`}
          >
            {style.tag}
          </span>
          <span className="font-reading text-[11px] text-[#8C867C]">
            {proposal.category}
          </span>
        </div>

        {/* Status indicator when not pending */}
        {!isPending && (
          <span className="font-reading text-[11px] px-2 py-0.5 rounded-full bg-white/70 border border-[#DDD8CE] text-[#4A453E]">
            {proposal.status === 'accepted' && '已排入行程'}
            {proposal.status === 'stashed_as_idea' && '已備存至想法牆'}
            {proposal.status === 'alternative_requested' && '已挑選替代時段'}
            {proposal.status === 'dismissed' && '已放下'}
          </span>
        )}
      </div>

      {/* Activity Details */}
      <div className="space-y-1">
        <div className={`font-display text-base font-medium ${style.accentText}`}>
          {proposal.activityTitle}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-reading text-[#5A554E]">
          {proposal.proposedTime && (
            <span>
              時段：<strong className="font-medium text-[#2B2927]">{proposal.proposedDate || '今天'} {proposal.proposedTime}</strong>
            </span>
          )}
          {proposal.durationMinutes > 0 && (
            <span>
              預估：<strong className="font-medium text-[#2B2927]">{Math.round((proposal.durationMinutes / 60) * 10) / 10} 小時</strong>
            </span>
          )}
        </div>

        {/* Source Provenance Link & Info */}
        {proposal.sourceInfo && (
          <div className="mt-2 p-2 rounded-lg bg-black/[0.03] border border-black/5 flex items-start justify-between gap-2 text-xs">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5 font-utility text-[10px] text-[#7C7871] tracking-wider uppercase">
                <span>{proposal.sourceInfo.contentType === 'youtube' ? 'YouTube 影片來源' : '活動網址來源'}</span>
                {proposal.sourceInfo.verificationStatus === 'verified' && (
                  <span className="text-[#3A5364] bg-[#D9E4EC]/60 px-1 rounded text-[9px]">已驗證原始資訊</span>
                )}
              </div>
              <div className="font-medium text-[#2B2927] truncate text-[11px]">
                {proposal.sourceInfo.channelName ? `頻道：${proposal.sourceInfo.channelName}` : proposal.sourceInfo.sourceDomain}
              </div>
              {proposal.sourceInfo.location && (
                <div className="text-[11px] text-[#635E56] truncate">
                  地點：{proposal.sourceInfo.location}
                </div>
              )}
              {proposal.sourceInfo.deadlineText && (
                <div className="text-[10px] text-[#8C5D65]">
                  備註：{proposal.sourceInfo.deadlineText}
                </div>
              )}
            </div>

            <a
              href={proposal.sourceInfo.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-[11px] text-[#4A677B] hover:text-[#2C4150] underline font-reading px-1 py-0.5"
            >
              查看原頁面
            </a>
          </div>
        )}
      </div>

      {/* AI Consideration & Reason */}
      {proposal.reason && (
        <p className={`font-reading text-xs leading-relaxed ${style.reasonText} border-t border-black/5 pt-2`}>
          {proposal.reason}
        </p>
      )}

      {/* Quiet Non-Intrusive Action Options */}
      {isPending ? (
        <div className="pt-2 border-t border-black/5 flex flex-wrap items-center gap-2">
          {proposal.actionOptions.map((opt, idx) => {
            const isPrimary = idx === 0;
            return (
              <button
                key={opt.id || idx}
                id={`proposal-btn-${opt.id || idx}`}
                onClick={() => onAction(messageId, opt)}
                className={`font-reading text-xs px-3 py-1.5 rounded-lg transition-all ${
                  isPrimary
                    ? 'bg-white/90 hover:bg-white text-[#2B2927] font-medium border border-black/15 shadow-xs hover:border-black/30'
                    : 'bg-transparent hover:bg-black/5 text-[#5A554E] hover:text-[#2B2927] border border-black/10'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="pt-1 text-[11px] font-reading text-[#7C7871] italic">
          此建議已確認，節奏已更新。
        </div>
      )}
    </div>
  );
};
