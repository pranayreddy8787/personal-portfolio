import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

interface AiBotProps {
  ownerName: string;
}

export default function AiBot({ ownerName }: AiBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "ai",
      text: `Hello! I am ${ownerName}'s AI representative. Ask me anything about his professional experience, technical stack, built projects, or design philosophy!`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const SUGGESTED_CHIPS = [
    "What are your core technical strengths?",
    "Tell me about the Synthia AI project.",
    "Are you open to contract or full-time roles?",
    "What is your development philosophy?"
  ];

  // Auto Scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Gather context history (excluding first welcome message for simpler mapping)
      const chatHistory = messages
        .filter(m => m.id !== "init")
        .map(m => ({
          sender: m.sender,
          text: m.text
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory
        })
      });

      if (!res.ok) {
        throw new Error("Chat server error");
      }

      const data = await res.json();
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.response
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "I apologize, but I am experiencing temporary difficulties communicating with my neural model. Please try again in a moment, or send an email directly using the contact form below!"
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Bot Chat Window */}
      {isOpen && (
        <div 
          id="ai-chatbot-window"
          className="w-[350px] sm:w-[400px] h-[500px] rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-100 shadow-2xl flex flex-col mb-4 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-indigo-600 px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-zinc-950/40 text-white">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide">AI Representative</h4>
                <p className="text-[10px] text-zinc-200 font-mono">Powered by Gemini AI</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-zinc-800"
          >
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div 
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs md:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-zinc-800/80 text-zinc-200 rounded-tl-none border border-zinc-750'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/20 flex items-center justify-center text-indigo-300 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-zinc-800/80 text-zinc-400 rounded-2xl rounded-tl-none border border-zinc-750 px-3.5 py-2.5 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Quick chips (Only when not loading) */}
          {!loading && (
            <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-850 overflow-x-auto flex gap-2 scrollbar-none whitespace-nowrap">
              {SUGGESTED_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="text-[10px] font-sans text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1 rounded-full transition shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Message Input Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-zinc-950 border-t border-zinc-850 flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Representative..."
              className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-750 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition"
              disabled={loading}
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim() || loading}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating launcher trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="ai-chatbot-trigger"
        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-sans text-sm font-semibold px-4 py-3 rounded-full shadow-2xl hover:shadow-indigo-500/20 active:scale-95 transition-all duration-300"
      >
        {isOpen ? (
          <>
            <X className="w-5 h-5" />
            Close Representative
          </>
        ) : (
          <>
            <Bot className="w-5 h-5 animate-bounce" />
            Consult Representative
          </>
        )}
      </button>
    </div>
  );
}
