import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, HelpCircle, Loader2 } from "lucide-react";
import { StartupIdea, ValidationReport } from "../types";

interface HelpChatProps {
  currentIdea: StartupIdea | null;
  currentReport: ValidationReport | null;
}

export default function HelpChat({ currentIdea, currentReport }: HelpChatProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: "Hello! I am VentureMind Advisor. I am charged with your startup concept details. Ask me about monetization channels, expansion hacks, tech stacks, competitive defensive lines, or fundraising plans!"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userText = inputValue;
    setInputValue("");
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          startupDetails: currentIdea ? {
            name: currentIdea.name,
            industry: currentIdea.industry,
            idea: currentIdea.idea,
            targetCustomers: currentIdea.targetCustomers
          } : undefined
        })
      });

      if (!response.ok) {
        throw new Error("Advisory AI dropped the connection.");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply || "I apologize, my analysis was blank." }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: "Host connectivity issue: Please verify if your GEMINI_API_KEY is configured in the secrets menu." }]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "What monetization models work best for this?",
    "Suggest a simple 3-month MVP technology roadmap.",
    "Draft a cold email sequence to pitch early angel investors.",
    "What should be my primary customer acquisition hack?"
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl flex flex-col h-[calc(100vh-12rem)] min-h-[500px] font-sans">
      {/* Header element */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-650 p-6 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base">VentureMind Strategic Mentor</h3>
            <p className="text-xs text-blue-100 flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping mr-1.5" />
              {currentIdea ? `Tuned to "${currentIdea.name}"` : "General Strategy Mode"}
            </p>
          </div>
        </div>
        <div className="text-xs font-mono font-semibold px-2.5 py-1 bg-white/10 rounded-full">
          Gemini 3.5 AI
        </div>
      </div>

      {/* Messages layout */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-start space-x-2.5`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              }`}
            >
              {m.text.split('\n').map((line, idx) => (
                <p key={idx} className={line.trim() === '' ? 'h-2' : 'mb-1 font-normal'}>
                  {line}
                </p>
              ))}
            </div>
            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl rounded-bl-none text-sm text-slate-500 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Analyzing business factors...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick sample inquiry triggers */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center text-xs font-semibold text-slate-400 mb-2">
          <HelpCircle className="w-3.5 h-3.5 mr-1" />
          <span>SUGGESTED ENQUIRIES</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => setInputValue(q)}
              className="text-xs bg-white text-slate-600 hover:text-blue-600 hover:border-blue-400 border border-slate-200 px-3 py-1.5 rounded-full transition-all text-left font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat inputs */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex space-x-2.5">
        <input
          type="text"
          className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 bg-slate-50/50 outline-none placeholder:text-slate-400"
          placeholder={currentIdea ? `Inquire about "${currentIdea.name}"...` : "Discuss general core metrics..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 flex items-center justify-center shadow-md shadow-blue-500/15 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
