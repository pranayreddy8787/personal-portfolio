import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg("Please fill in all mandatory fields (Name, Email, Message).");
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit message");
      }

      setStatus('success');
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "An unexpected error occurred while sending your message. Please try again.");
      setStatus('error');
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-slate-950/60 p-6 md:p-8">
      <h3 className="text-xl font-bold text-white tracking-tight mb-2">
        Launch a Message Inquiry
      </h3>
      <p className="text-slate-400 text-xs md:text-sm mb-6 leading-relaxed">
        Have an exciting project, a role opening, or want to discuss technical architectures? Send a direct message to my live backend inbox!
      </p>

      {status === 'success' ? (
        <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-6 text-center space-y-3">
          <div className="mx-auto w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-indigo-300">Inquiry Received</h4>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">
            Your message was received in our local DB portal. The representative or Alex himself will get back to you soon.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-mono underline cursor-pointer"
          >
            Submit Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'error' && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Full Name <span className="text-indigo-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Tony Stark"
                className="w-full bg-slate-950 border border-slate-800/80 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-600 outline-none transition"
                disabled={status === 'loading'}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Email Address <span className="text-indigo-400">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="stark@starkindustries.com"
                className="w-full bg-slate-950 border border-slate-800/80 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-600 outline-none transition"
                disabled={status === 'loading'}
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Subject Line
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Collaboration opportunity"
              className="w-full bg-slate-950 border border-slate-800/80 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-600 outline-none transition"
              disabled={status === 'loading'}
            />
          </div>

          {/* Message Text */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Message Content <span className="text-indigo-400">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Hey! I saw your stunning portfolio and wanted to discuss..."
              className="w-full bg-slate-950 border border-slate-800/80 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-600 outline-none transition resize-none"
              disabled={status === 'loading'}
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-500/20 active:scale-98 transition duration-250 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Dispatching Message...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-indigo-200" />
                Dispatch Message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
