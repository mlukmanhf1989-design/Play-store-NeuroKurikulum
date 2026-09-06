import React from 'react';
import {
  BookOpen,
  Clock,
  Volume2,
  Sparkles,
  AlertTriangle,
  Heart,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Maximize2,
  ShieldAlert,
  Flame,
  BatteryMedium,
  Zap,
} from 'lucide-react';
import { ComprehensiveAnalysisResult } from '../types';

interface PedagogicalInterpretationProps {
  analysis: ComprehensiveAnalysisResult;
  onNextStep: () => void;
}

export const PedagogicalInterpretation: React.FC<PedagogicalInterpretationProps> = ({
  analysis,
  onNextStep,
}) => {
  const { childMeta, pedagogicalImpact, neurodevelopmentalStyle } = analysis;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFD1] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8EADF] text-[#5A5E4B] border border-[#D3D8C8]">
              Langkah 3
            </span>
            <span className="text-xs text-[#8D887B]">Interpretasi & Implikasi Pedagogis</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4E3D] tracking-tight">
            Bagaimana Otak {childMeta.childName} Memproses Pembelajaran di Kelas
          </h2>
          <p className="text-[#6B685F] text-sm leading-relaxed">
            Menerjemahkan temuan observasi neuropsikologi ke dalam strategi instruksional, manajemen lingkungan, dan regulasi energi belajar.
          </p>
        </div>

        <button
          type="button"
          onClick={onNextStep}
          className="px-5 py-2.5 rounded-2xl bg-[#5A5E4B] hover:bg-[#4A4E3D] text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <span>Rekomendasi Kurikulum</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: Processing & Environment / Rhythm */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Focus Span & Energy Rhythms (4 cols) */}
        <div className="md:col-span-5 space-y-6">
          {/* Focus & Brain Breaks Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F2EDE4]">
              <Clock className="w-5 h-5 text-[#8B9A82]" />
              <h3 className="font-serif font-bold text-[#4A4E3D] text-base">
                Ritme Atensi & Siklus Jeda Otak
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#F4F6F2] border border-[#D3D8C8] text-center space-y-1">
                <span className="text-[11px] font-bold text-[#5A5E4B] block uppercase tracking-wider">
                  Fokus Puncak Optimal
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold font-serif text-[#4A4E3D]">
                  {pedagogicalImpact.optimalFocusSpanMinutes} Menit
                </span>
                <p className="text-[10px] text-[#6B685F] leading-tight">
                  Durasi efektif untuk instruksi konsep inti baru
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2EDE4] border border-[#D9D4C7] text-center space-y-1">
                <span className="text-[11px] font-bold text-[#8B9A82] block uppercase tracking-wider">
                  Interval Brain Break
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold font-serif text-[#4A4E3D]">
                  Tiap {pedagogicalImpact.brainBreakIntervalMinutes} Menit
                </span>
                <p className="text-[10px] text-[#6B685F] leading-tight">
                  Jeda peregangan tubuh & hidrasi otak
                </p>
              </div>
            </div>

            {/* Transition Strategy */}
            <div className="p-4 rounded-2xl bg-[#FDFCF7] border border-[#E5DFD1] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#4A4E3D]">
                <Zap className="w-4 h-4 text-[#C88E75]" />
                <span>Protokol Transisi Antar Aktivitas:</span>
              </div>
              <p className="text-xs text-[#6B685F] leading-relaxed">
                {pedagogicalImpact.transitionStrategy}
              </p>
            </div>
          </div>

          {/* Physical Environment Accommodations */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F2EDE4]">
              <Maximize2 className="w-5 h-5 text-[#8B9A82]" />
              <h3 className="font-serif font-bold text-[#4A4E3D] text-base">
                Akomodasi Ruang Fisik & Sensori
              </h3>
            </div>

            <ul className="space-y-2.5">
              {(pedagogicalImpact?.physicalEnvironmentNeeds || []).map((need, idx) => (
                <li
                  key={idx}
                  className="p-3.5 bg-[#FDFCF7] rounded-2xl border border-[#E5DFD1] text-xs text-[#3D3B36] flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-[#E8EADF] text-[#5A5E4B] font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span>{need}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Instruction Processing & Stress/Co-regulation (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          {/* Instruction Processing Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F2EDE4]">
              <BookOpen className="w-5 h-5 text-[#8B9A82]" />
              <h3 className="font-serif font-bold text-[#4A4E3D] text-base">
                Gaya Pemrosesan Instruksi & Komunikasi Guru
              </h3>
            </div>

            <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#E5DFD1] text-[#3D3B36] text-xs sm:text-sm leading-relaxed space-y-2">
              <p>{pedagogicalImpact?.instructionProcessing || '-'}</p>
            </div>
          </div>

          {/* Stress Triggers vs Co-Regulation Techniques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stress Triggers */}
            <div className="bg-white rounded-3xl p-5 border border-[#EACBBF] shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-[#B86B50] font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-[#C88E75]" />
                <span>Pemicu Beban Kognitif / Sensori Overload</span>
              </div>
              <ul className="space-y-2">
                {(pedagogicalImpact?.stressTriggers || []).map((trig, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#F9EFEA] border border-[#EACBBF] text-xs text-[#3D3B36] flex items-start gap-2 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C88E75] mt-1.5 shrink-0" />
                    <span>{trig}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Co-Regulation Techniques */}
            <div className="bg-white rounded-3xl p-5 border border-[#D3D8C8] shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-[#4A4E3D] font-bold text-xs">
                <Heart className="w-4 h-4 text-[#8B9A82]" />
                <span>Teknik Ko-Regulasi & Penenangan Efektif</span>
              </div>
              <ul className="space-y-2">
                {(pedagogicalImpact?.coRegulationTechniques || []).map((tech, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#F4F6F2] border border-[#D3D8C8] text-xs text-[#3D3B36] flex items-start gap-2 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B9A82] mt-1.5 shrink-0" />
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Do's & Don'ts Matrix for Educators */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-[#4A4E3D] text-sm">
              Panduan Cepat Sikap Pendidik & Fasilitator di Kelas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-[#F4F6F2] rounded-2xl border border-[#D3D8C8] space-y-1.5">
                <span className="font-bold text-[#4A4E3D] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8B9A82]" /> SANGAT DIANJURKAN (DO)
                </span>
                <ul className="space-y-1 text-[#5A5E4B]">
                  <li>• Gunakan visual schedule & kartu alur gambar.</li>
                  <li>• Tautkan konsep pelajaran dengan minat intrinsik anak.</li>
                  <li>• Berikan pilihan posisi duduk atau bekerja sambil berdiri.</li>
                </ul>
              </div>

              <div className="p-4 bg-[#F9EFEA] rounded-2xl border border-[#EACBBF] space-y-1.5">
                <span className="font-bold text-[#B86B50] flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-[#C88E75]" /> HINDARI (DON'T)
                </span>
                <ul className="space-y-1 text-[#8D4E3A]">
                  <li>• Memberikan rentetan &gt;2 instruksi lisan sekaligus.</li>
                  <li>• Memaksa anak duduk diam kaku lebih dari 15 menit.</li>
                  <li>• Menghentikan aktivitas mendadak tanpa aba-aba mundur.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
