import React from 'react';
import {
  Layers,
  Sparkles,
  BookOpen,
  FileSpreadsheet,
  PackageCheck,
  ArrowRight,
  Sliders,
  Compass,
  Palette,
  Box,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { ComprehensiveAnalysisResult } from '../types';

interface CurriculumRecommendationsProps {
  analysis: ComprehensiveAnalysisResult;
  onNextStep: () => void;
}

export const CurriculumRecommendations: React.FC<CurriculumRecommendationsProps> = ({
  analysis,
  onNextStep,
}) => {
  const { childMeta, curriculumAdaptations, neurodevelopmentalStyle } = analysis;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFD1] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8EADF] text-[#5A5E4B] border border-[#D3D8C8]">
              Langkah 4
            </span>
            <span className="text-xs font-medium text-[#8D887B]">
              Prinsip Penyesuaian & Diferensiasi Kurikulum
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4E3D] tracking-tight">
            Adaptasi Kontekstual {curriculumAdaptations.curriculumName}
          </h2>
          <p className="text-[#6B685F] text-sm leading-relaxed">
            Menyelaraskan capaian kurikulum dengan karakteristik neuropsikologi {childMeta.childName} melalui 4 pilar pembelajaran berdiferensiasi.
          </p>
        </div>

        <button
          type="button"
          onClick={onNextStep}
          className="px-5 py-2.5 rounded-2xl bg-[#5A5E4B] hover:bg-[#4A4E3D] text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <span>Desain Pembelajaran Personal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Pillars of Differentiated Instruction (Content, Process, Product, Environment) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Diferensiasi Konten */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F2EDE4]">
            <div className="w-10 h-10 rounded-2xl bg-[#E8EADF] text-[#5A5E4B] border border-[#D3D8C8] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#5A5E4B] uppercase tracking-wider">Pilar 1</span>
              <h3 className="font-serif font-bold text-[#4A4E3D] text-base">Diferensiasi Konten (Materi Ajar)</h3>
            </div>
          </div>
          <p className="text-xs text-[#8D887B]">
            Penyesuaian cara materi disajikan agar relevan dengan profil kognitif anak:
          </p>
          <ul className="space-y-2">
            {(curriculumAdaptations?.contentDifferentiation || []).map((item, idx) => (
              <li
                key={idx}
                className="p-3.5 bg-[#FDFCF7] rounded-2xl border border-[#E5DFD1] text-xs text-[#3D3B36] flex items-start gap-2.5 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B9A82] mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Diferensiasi Proses */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F2EDE4]">
            <div className="w-10 h-10 rounded-2xl bg-[#F2EDE4] text-[#8B9A82] border border-[#D9D4C7] flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#8B9A82] uppercase tracking-wider">Pilar 2</span>
              <h3 className="font-serif font-bold text-[#4A4E3D] text-base">Diferensiasi Proses (Cara Belajar)</h3>
            </div>
          </div>
          <p className="text-xs text-[#8D887B]">
            Modifikasi aktivitas belajar dan tahapan scaffolding bagi anak:
          </p>
          <ul className="space-y-2">
            {(curriculumAdaptations?.processDifferentiation || []).map((item, idx) => (
              <li
                key={idx}
                className="p-3.5 bg-[#FDFCF7] rounded-2xl border border-[#E5DFD1] text-xs text-[#3D3B36] flex items-start gap-2.5 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B9A82] mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Diferensiasi Produk */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F2EDE4]">
            <div className="w-10 h-10 rounded-2xl bg-[#F9EFEA] text-[#C88E75] border border-[#EACBBF] flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#C88E75] uppercase tracking-wider">Pilar 3</span>
              <h3 className="font-serif font-bold text-[#4A4E3D] text-base">Diferensiasi Produk (Bukti Belajar)</h3>
            </div>
          </div>
          <p className="text-xs text-[#8D887B]">
            Alternatif unjuk kerja dan asesmen formatif yang memvalidasi potensi anak:
          </p>
          <ul className="space-y-2">
            {(curriculumAdaptations?.productDifferentiation || []).map((item, idx) => (
              <li
                key={idx}
                className="p-3.5 bg-[#FDFCF7] rounded-2xl border border-[#E5DFD1] text-xs text-[#3D3B36] flex items-start gap-2.5 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C88E75] mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Diferensiasi Lingkungan Belajar */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F2EDE4]">
            <div className="w-10 h-10 rounded-2xl bg-[#F4F6F2] text-[#5A5E4B] border border-[#D3D8C8] flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#5A5E4B] uppercase tracking-wider">Pilar 4</span>
              <h3 className="font-serif font-bold text-[#4A4E3D] text-base">Diferensiasi Lingkungan Belajar</h3>
            </div>
          </div>
          <p className="text-xs text-[#8D887B]">
            Penataan iklim kelas dan tata letak fisik yang ramah profil sensori:
          </p>
          <ul className="space-y-2">
            {(curriculumAdaptations?.environmentDifferentiation || []).map((item, idx) => (
              <li
                key={idx}
                className="p-3.5 bg-[#FDFCF7] rounded-2xl border border-[#E5DFD1] text-xs text-[#3D3B36] flex items-start gap-2.5 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A5E4B] mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Pedagogical & Sensory Media Toolkit */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F2EDE4]">
          <PackageCheck className="w-5 h-5 text-[#8B9A82]" />
          <div>
            <h3 className="font-serif font-bold text-[#4A4E3D] text-base">
              Rekomendasi Alat Peraga, Media Konkrit, & Sensory Tools
            </h3>
            <p className="text-xs text-[#8D887B]">
              Media yang terbukti efektif menstimulasi keterjagaan dan pemahaman konsep bagi profil anak
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(curriculumAdaptations?.recommendedMediaAndTools || []).map((toolGroup, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-[#E5DFD1] bg-[#FDFCF7] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#5A5E4B] px-3 py-1 rounded-full bg-[#E8EADF] border border-[#D3D8C8] inline-block">
                  {toolGroup.category}
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(toolGroup.items || []).map((item, iIdx) => (
                    <span
                      key={iIdx}
                      className="px-2.5 py-1 rounded-xl bg-white border border-[#D9D4C7] text-xs text-[#3D3B36] font-medium shadow-2xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E5DFD1] text-[11px] text-[#6B685F] leading-relaxed">
                <span className="font-bold text-[#4A4E3D] block mb-0.5">Panduan Penggunaan:</span>
                {toolGroup.usageGuidance}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
