import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bot, X, Send, Sparkles, User, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';
import { playClickSound } from '../utils/audio';
import { getSmartLocalResponse } from '../utils/aiKnowledge';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Greetings! I'm Cosmo, Vedant's AI Portfolio Assistant. Ask me anything about his B.Tech IT studies at DTU, YouTube Summarizer project, Pygame development, or 200+ LeetCode C++ solutions!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const quickPrompts = [
    'What is Vedant\'s CGPA at DTU?',
    'Tell me about his YouTube Summarizer AI project.',
    'What are his C++ & LeetCode achievements?',
    'How can I contact Vedant?',
  ];

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = promptText || input;
    if (!textToSend.trim() || isLoading) return;

    playClickSound(700, 0.03);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Non-JSON response (static Vercel hosting)');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply || getSmartLocalResponse(textToSend),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Offline / Serverless fallback: Use rich local intelligence
      const fallbackReply = getSmartLocalResponse(textToSend);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col backdrop-blur-2xl">
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40">
            <Bot className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>Cosmo AI Companion</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[11px] font-mono text-cyan-400">Powered by Gemini AI</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-purple-900 border border-purple-500/40 text-purple-200'
                  : 'bg-cyan-950 border border-cyan-500/40 text-cyan-300'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-3.5 space-y-1 ${
                msg.sender === 'user'
                  ? 'bg-purple-900/60 border border-purple-500/30 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
              <div className="text-[10px] text-slate-400 font-mono text-right">{msg.timestamp}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Cosmo is consulting orbital knowledge base...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 space-y-1.5">
        <div className="text-[10px] font-mono text-slate-400 uppercase">Suggested Prompts:</div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => handleSendMessage(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-cyan-300 transition-all text-left"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Cosmo about Vedant..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
