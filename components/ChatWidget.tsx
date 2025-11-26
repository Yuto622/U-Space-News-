import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, ExternalLink } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'こんにちは。U-Space AIナビゲーターです。宇宙について何でも聞いてください。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await sendChatMessage(input);
    
    setMessages(prev => [...prev, { 
      role: 'model', 
      text: response.text, 
      sources: response.sources 
    }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center 
          bg-gradient-to-r from-cyan-600 to-blue-600 shadow-[0_0_20px_rgba(8,145,178,0.5)] 
          transition-all duration-300 hover:scale-110 active:scale-95
          ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
        `}
      >
        <MessageSquare className="text-white w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div 
        className={`
          fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh]
          glass-panel rounded-2xl flex flex-col shadow-2xl transition-all duration-500 origin-bottom-right
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="font-display font-bold text-white tracking-wide">AI NAVIGATOR</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`
                  max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${msg.role === 'user' 
                    ? 'bg-cyan-600/80 text-white rounded-tr-none' 
                    : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'}
                `}
              >
                {msg.text}
              </div>
              
              {/* Sources for Model responses */}
              {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 text-xs w-full max-w-[85%]">
                  <div className="text-gray-500 mb-1 pl-1">参考ソース:</div>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((source, sIdx) => (
                      <a 
                        key={sIdx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1 bg-black/40 hover:bg-cyan-900/40 px-2 py-1 rounded text-cyan-400 hover:text-cyan-300 transition-colors border border-white/5"
                      >
                        <ExternalLink size={10} />
                        <span className="truncate max-w-[150px]">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start">
               <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none flex gap-2">
                 <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ブラックホールについて教えて..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-cyan-400 transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;