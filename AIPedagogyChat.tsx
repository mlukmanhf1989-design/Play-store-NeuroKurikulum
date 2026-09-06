import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  X,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  CornerDownLeft,
  Minimize2,
} from 'lucide-react';
import { ComprehensiveAnalysisResult } from '../types';

interface AIPedagogyChatProps {
  analysis: ComprehensiveAnalysisResult | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AIPedagogyChat: React.FC<AIPedagogyChatProps> = ({
  analysis,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Halo! Saya Konsultan Spesialis Pedagogi & Neuropsikologi Perkembangan Anak. ${
        analysis
          ? `Saya siap mendiskusikan strategi belajar untuk **${analysis.childMeta.childName}** (${analysis.neurodevelopmentalStyle.archetypeTitle}). Ada hal spesifik yang ingin Anda tanyakan atau modifikasi?`
          : 'Silakan lakukan analisis observasi terlebih dahulu atau pilih salah satu kasus contoh.'
      }`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputValue, setInputValue] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Update initial message when analysis changes
  useEffect(() => {
    if (analysis) {
      setMessages((prev) => {
        if (prev.length === 1 && prev[0].id === 'welcome') {
          return [
            {
              id: 'welcome',
              role: 'assistant',
              content: `Halo! Saya Konsultan Spesialis Pedagogi & Neuropsikologi Perkembangan Anak. Saya telah menelaah profil perkembangan **${analysis.childMeta.childName}** (${analysis.neurodevelopmentalStyle.archetypeTitle}).\n\nApa yang ingin Anda eksplorasi lebih dalam? Misalnya: modifikasi aktivitas sentra, tips menghadapi transisi, atau permainan sensori di rumah?`,
              timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            },
          ];
        }
        return prev;
      });
    }
  }, [analysis]);

  const handleSendMessage = async (customText?: string) => {
    const text = customText || inputValue.trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          childProfile: analysis,
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Maaf, saya belum dapat memproses jawaban saat ini.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: 'Terjadi kendala jaringan saat menghubungi asisten. Silakan coba sesaat lagi.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const quickPrompts = [
    'Bagaimana cara menenangkan anak saat transisi jadwal?',
    'Buatkan ide permainan berhitung tanpa lembar kerja.',
    'Cara berkomunikasi yang efektif untuk profil visual-kinestetik?',
    'Aktivitas sensori apa yang cocok dilakukan bersama orang tua di rumah?',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#FDFCF7] shadow-2xl border-l border-[#E5DFD1] flex flex-col transition-all duration-300 font-sans">
      {/* Chat Header */}
      <div className="p-4 bg-[#5A5E4B] text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
            <Bot className="w-5 h-5 text-[#E8EADF]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm leading-tight flex items-center gap-1.5 text-white">
              Konsultan Pedagogi AI
              <span className="w-2 h-2 rounded-full bg-[#8B9A82] animate-pulse" />
            </h3>
            <p className="text-[11px] text-[#E8EADF]">
              {analysis ? `Kontekstual: ${analysis.childMeta.childName}` : 'Tanya Jawab Pedagogis'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          title="Tutup Chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FDFCF7]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-[#5A5E4B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-3xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                msg.role === 'user'
                  ? 'bg-[#5A5E4B] text-white rounded-tr-xs'
                  : 'bg-white text-[#3D3B36] border border-[#E5DFD1] rounded-tl-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <span
                className={`block text-[10px] mt-1 text-right ${
                  msg.role === 'user' ? 'text-[#E8EADF]' : 'text-[#8D887B]'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-[#8D887B] text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {isSending && (
          <div className="flex gap-2.5 items-center text-xs text-[#8D887B] italic">
            <div className="w-7 h-7 rounded-xl bg-[#E8EADF] text-[#5A5E4B] flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <span>Konsultan AI sedang merumuskan saran pedagogis...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-2.5 bg-[#F2EDE4] border-t border-[#E5DFD1] flex gap-1.5 overflow-x-auto scrollbar-none">
        {quickPrompts.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(chip)}
            className="px-3 py-1 bg-white hover:bg-[#E8EADF] border border-[#D9D4C7] text-[#4A4E3D] text-[11px] font-medium rounded-full whitespace-nowrap transition-colors shrink-0 shadow-2xs"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-[#E5DFD1] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Tanyakan rekomendasi strategi belajar..."
          className="flex-1 px-3.5 py-2.5 bg-[#FDFCF7] border border-[#D9D4C7] rounded-2xl text-xs sm:text-sm text-[#3D3B36] focus:outline-hidden focus:ring-2 focus:ring-[#8B9A82] focus:bg-white placeholder:text-[#8D887B]"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isSending}
          className="p-2.5 bg-[#5A5E4B] hover:bg-[#4A4E3D] disabled:bg-[#D9D4C7] text-white rounded-2xl shadow-xs transition-colors"
          title="Kirim pesan"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
