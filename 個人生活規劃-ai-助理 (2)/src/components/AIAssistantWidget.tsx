import React, { useState, useRef, useEffect } from 'react';
import { useLife } from '../context/LifeContext';
import { ProposalCard } from './ProposalCard';
import { UrlInfoCard } from './UrlInfoCard';

export const AIAssistantWidget: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    sendChatMessage,
    handleProposalAction,
    undoAiNoteAction,
    setActiveTab,
    isAiLoading
  } = useLife();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isAiLoading) return;
    const text = inputVal;
    setInputVal('');
    await sendChatMessage(text);
  };

  const quickPrompts = [
    '幫我記：買牛奶',
    '幫我刪除：整理房間',
    '加到想法牆：想去京都看紅葉',
    '我今天想整理房間',
    '我以後想學陶藝',
    '我今天想買洗髮精'
  ];

  // 1. Closed state: Minimal typographic mark in soft floating bubble
  if (!isChatOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="btn-open-77"
          onClick={() => setIsChatOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FCFAF6] hover:bg-[#EADCD9] border border-[#DEC8C4] text-[#74484E] hover:text-[#2B2826] transition-all duration-200 shadow-sm cursor-pointer"
          title="與 77 聊聊生活節奏"
        >
          <span className="w-2 h-2 rounded-full bg-[#C09D9B] group-hover:scale-125 transition-transform" />
          <span className="font-utility text-xs tracking-wider font-medium">77 陪伴</span>
        </button>
      </div>
    );
  }

  // 2. Open state: Quiet personal companion panel in soft bubble style
  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] max-h-[82vh] bg-[#FCFAF6] border border-[#DEC8C4] rounded-[28px] shadow-lg flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#EFECE5] flex items-center justify-between bg-[#FCFAF6]">
        <div className="flex items-baseline gap-2">
          <span className="font-utility text-xs font-semibold text-[#74484E]">77</span>
          <span className="text-[#DEC8C4]">/</span>
          <span className="font-display italic text-xs text-[#685F5B]">安靜陪伴・生活手帳助理</span>
        </div>

        <button
          onClick={() => setIsChatOpen(false)}
          className="font-utility text-xs text-[#9E938D] hover:text-[#2B2826] transition-colors cursor-pointer px-2 py-0.5 rounded-full hover:bg-[#EFECE5]"
        >
          關閉
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FCFAF6] scrollbar-thin">
        {chatMessages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              className={`space-y-1 ${isAssistant ? 'text-left' : 'text-right'}`}
            >
              <div className="font-utility text-[10px] text-[#9E938D] tracking-wider">
                {isAssistant ? '77' : 'YOU'} · {msg.timestamp}
              </div>

              <div
                className={`inline-block text-xs leading-relaxed max-w-[90%] ${
                  isAssistant
                    ? 'font-reading text-[#2B2826] bg-[#F7F5EE] px-4 py-3 rounded-[20px] rounded-tl-sm border border-[#E5DFD5]'
                    : 'font-reading text-[#2B2826] bg-[#EADCD9] px-4 py-2.5 rounded-[20px] rounded-tr-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              {/* Direct Note Action Receipt Card */}
              {isAssistant && msg.noteAction && (
                <div className="max-w-[95%] mt-1.5 p-3.5 rounded-[18px] border border-[#DEC8C4] bg-[#F7F5EE] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-utility text-[10px] tracking-wider px-2.5 py-0.5 rounded-full font-medium ${
                        msg.noteAction.type === 'delete'
                          ? 'bg-[#F2E5E5] text-[#8E3E3E] border border-[#E5CFCF]'
                          : 'bg-[#E2ECE8] text-[#436259] border border-[#CDDBD6]'
                      }`}
                    >
                      {msg.noteAction.type === 'delete' ? '已自工作區移除' : '已存入工作區'}
                    </span>
                    <span className="font-utility text-[10px] text-[#9E938D]">
                      {msg.noteAction.timestamp}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="font-reading text-xs font-medium text-[#2B2826]">
                      {msg.noteAction.itemTitle}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#685F5B]">
                      <span className="text-[#9E938D]">位置：</span>
                      <span className="font-utility text-[#2B2826] bg-[#EFECE5] px-2 py-0.5 rounded-full text-[10px]">
                        {msg.noteAction.locationLabel}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-[#EFECE5] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab(msg.noteAction?.targetTab || 'today')}
                      className="font-utility text-[11px] text-[#74484E] hover:underline transition-colors"
                    >
                      前往{msg.noteAction.targetTab === 'ideas' ? '想法牆' : '今日工作區'}查看 →
                    </button>

                    <button
                      type="button"
                      onClick={() => msg.noteAction && undoAiNoteAction(msg.noteAction)}
                      className="font-utility text-[10px] px-2.5 py-0.5 rounded-full border border-[#DEC8C4] text-[#74484E] hover:bg-[#EADCD9] transition-colors cursor-pointer"
                    >
                      復原此操作
                    </button>
                  </div>
                </div>
              )}

              {/* URL Information & Content Verification Card */}
              {isAssistant && msg.urlCard && (
                <div className="max-w-[95%]">
                  <UrlInfoCard
                    identity={msg.urlCard.identity}
                    extracted={msg.urlCard.extracted}
                    suggestedAction={msg.urlCard.suggestedAction}
                    onIntentAction={(text) => sendChatMessage(text)}
                  />
                </div>
              )}

              {/* Scheduling Proposal Card */}
              {isAssistant && msg.proposal && (
                <div className="max-w-[95%]">
                  <ProposalCard
                    proposal={msg.proposal}
                    messageId={msg.id}
                    onAction={handleProposalAction}
                  />
                </div>
              )}

              {msg.detectedItem && !msg.proposal && (
                <div className="mt-1 p-2.5 bg-[#F4EFE6] border border-[#DDD8CE] rounded-lg text-xs text-[#4A453E] space-y-1">
                  <div className="font-utility text-[10px] uppercase text-[#7C7871]">
                    [DETECTED IDEA]
                  </div>
                  <div className="font-medium text-[#2B2927]">
                    {msg.detectedItem.title}
                  </div>
                  <div className="text-[11px] text-[#7C7871]">
                    分類：{msg.detectedItem.type} ｜ 時段：{msg.detectedItem.suggestedTime || '彈性'}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isAiLoading && (
          <div className="font-display italic text-xs text-[#8C867C] pt-1">
            77 正在溫柔處理中...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick starter chips */}
      <div className="px-4 py-2.5 border-t border-[#EFECE5] flex items-center gap-2 overflow-x-auto scrollbar-none bg-[#FCFAF6]">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => sendChatMessage(prompt)}
            className="font-reading text-[11px] px-3 py-1 rounded-full bg-[#F7F5EE] text-[#685F5B] border border-[#E5DFD5] hover:border-[#C09D9B] hover:text-[#2B2826] whitespace-nowrap transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#EFECE5] bg-[#FCFAF6] flex items-center gap-2">
        <input
          type="text"
          placeholder="例如：幫我記買牛奶、想去京都看紅葉..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={isAiLoading}
          className="font-reading flex-1 px-3.5 py-2 text-xs rounded-full bg-[#F7F5EE] border border-[#E5DFD5] focus:outline-none focus:border-[#C09D9B] text-[#2B2826]"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isAiLoading}
          className="font-utility text-xs px-4 py-2 bg-[#C09D9B] text-[#2B2826] font-medium rounded-full disabled:opacity-30 transition-all cursor-pointer shadow-xs"
        >
          送出
        </button>
      </form>
    </div>
  );
};
