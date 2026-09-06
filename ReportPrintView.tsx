import React from 'react';
import { ComprehensiveAnalysisResult } from '../types';
import { ShieldCheck, Brain, CheckCircle2, Printer, X } from 'lucide-react';

interface ReportPrintViewProps {
  analysis: ComprehensiveAnalysisResult;
  onClose: () => void;
}

export const ReportPrintView: React.FC<ReportPrintViewProps> = ({
  analysis,
  onClose,
}) => {
  const {
    childMeta,
    nonDiagnosticDisclaimer,
    neurodevelopmentalStyle,
    domainScores,
    pedagogicalImpact,
    curriculumAdaptations,
    individualizedLearningPlan,
    timestamp,
  } = analysis;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#3D3B36]/70 backdrop-blur-xs overflow-y-auto p-4 sm:p-8 flex justify-center font-sans">
      {/* Floating Control Bar for Screen View */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="px-5 py-2.5 bg-[#5A5E4B] hover:bg-[#4A4E3D] text-white text-sm font-bold rounded-2xl shadow-lg flex items-center gap-2 transition-all"
        >
          <Printer className="w-4 h-4" /> Cetak / Simpan PDF
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-2.5 bg-white hover:bg-[#F2EDE4] text-[#4A4E3D] text-sm font-bold rounded-2xl shadow-lg border border-[#D9D4C7] transition-colors"
          title="Tutup Pratinjau Cetak"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-8 sm:p-12 text-[#3D3B36] space-y-8 my-auto print:shadow-none print:p-0 print:m-0 print:max-w-none">
        {/* Document Header */}
        <div className="border-b-2 border-[#4A4E3D] pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-tight text-[#4A4E3D]">
              Laporan Observasi Neuropsikologi Perkembangan & PPI
            </h1>
            <p className="text-xs font-semibold text-[#8D887B] uppercase tracking-wider">
              Pusat Layanan Asesmen Pedagogis Inklusif & Diferensiasi Pembelajaran Anak
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#5A5E4B] text-white flex items-center justify-center font-bold">
            <Brain className="w-7 h-7" />
          </div>
        </div>

        {/* Non-Diagnostic Ethical Disclaimer */}
        <div className="p-3.5 bg-[#F9EFEA] border border-[#EACBBF] rounded-2xl text-xs text-[#B86B50] leading-relaxed">
          <span className="font-bold block uppercase text-[10px] tracking-wider mb-0.5">
            Pemberitahuan Resmi Non-Diagnostik:
          </span>
          {nonDiagnosticDisclaimer}
        </div>

        {/* Identity Information Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#FDFCF7] border border-[#E5DFD1] rounded-2xl text-xs">
          <div>
            <span className="text-[#8D887B] block font-medium">Nama Anak:</span>
            <span className="font-bold text-[#3D3B36] text-sm">{childMeta.childName}</span>
          </div>
          <div>
            <span className="text-[#8D887B] block font-medium">Usia & Kelamin:</span>
            <span className="font-bold text-[#3D3B36]">
              {childMeta.ageYears} Thn {childMeta.ageMonths} Bln ({childMeta.gender})
            </span>
          </div>
          <div>
            <span className="text-[#8D887B] block font-medium">Pengamat:</span>
            <span className="font-bold text-[#3D3B36]">
              {childMeta.observerName || '-'} ({childMeta.observerRole})
            </span>
          </div>
          <div>
            <span className="text-[#8D887B] block font-medium">Tanggal Observasi:</span>
            <span className="font-bold text-[#3D3B36]">{formattedDate}</span>
          </div>
          <div>
            <span className="text-[#8D887B] block font-medium">Setting Observasi:</span>
            <span className="font-bold text-[#3D3B36]">{childMeta.observationSetting}</span>
          </div>
          <div>
            <span className="text-[#8D887B] block font-medium">Durasi:</span>
            <span className="font-bold text-[#3D3B36]">{childMeta.observationDuration}</span>
          </div>
          <div className="col-span-2">
            <span className="text-[#8D887B] block font-medium">Target Kurikulum:</span>
            <span className="font-bold text-[#5A5E4B]">{childMeta.curriculumTarget}</span>
          </div>
        </div>

        {/* Neurodevelopmental Profile Overview */}
        <div className="space-y-3">
          <h2 className="text-base font-serif font-bold text-[#4A4E3D] border-b border-[#E5DFD1] pb-1 uppercase tracking-wide">
            1. Profil Neuroperkembangan & Karakteristik Belajar
          </h2>
          <div className="p-4 rounded-2xl border border-[#E5DFD1] bg-[#FDFCF7] space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#4A4E3D]">
                {neurodevelopmentalStyle.archetypeTitle}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8EADF] text-[#5A5E4B] border border-[#D3D8C8]">
                Modalitas: {neurodevelopmentalStyle.primaryLearningModality}
              </span>
            </div>
            <p className="text-xs text-[#6B685F] leading-relaxed">
              {neurodevelopmentalStyle.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-[#F4F6F2] border border-[#D3D8C8] rounded-2xl space-y-1">
              <span className="font-bold text-[#4A4E3D] block">Kekuatan Utama:</span>
              <ul className="space-y-1 text-[#3D3B36]">
                {neurodevelopmentalStyle.keyStrengths.map((s, idx) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
            </div>
            <div className="p-3.5 bg-[#F2EDE4] border border-[#D9D4C7] rounded-2xl space-y-1">
              <span className="font-bold text-[#4A4E3D] block">Keterampilan Berkembang:</span>
              <ul className="space-y-1 text-[#3D3B36]">
                {neurodevelopmentalStyle.emergingSkills.map((s, idx) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
            </div>
            <div className="p-3.5 bg-[#F9EFEA] border border-[#EACBBF] rounded-2xl space-y-1">
              <span className="font-bold text-[#B86B50] block">Dukungan Prioritas:</span>
              <ul className="space-y-1 text-[#3D3B36]">
                {neurodevelopmentalStyle.prioritySupportAreas.map((s, idx) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Domain Scores Table */}
        <div className="space-y-3">
          <h2 className="text-base font-serif font-bold text-[#4A4E3D] border-b border-[#E5DFD1] pb-1 uppercase tracking-wide">
            2. Indeks Domain Perkembangan Teramati (6 Domain)
          </h2>
          <table className="w-full text-xs text-left border border-[#E5DFD1]">
            <thead className="bg-[#F2EDE4] font-bold border-b border-[#E5DFD1] text-[#4A4E3D]">
              <tr>
                <th className="p-2.5 border-r border-[#E5DFD1] w-1/4">Domain</th>
                <th className="p-2.5 border-r border-[#E5DFD1] w-16 text-center">Indeks</th>
                <th className="p-2.5 border-r border-[#E5DFD1]">Temuan Observasi Perilaku</th>
                <th className="p-2.5">Rekomendasi Dukungan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD1]">
              {domainScores.map((d, idx) => (
                <tr key={idx}>
                  <td className="p-2.5 font-bold text-[#3D3B36] border-r border-[#E5DFD1]">{d.domainLabel}</td>
                  <td className="p-2.5 font-bold text-[#5A5E4B] text-center border-r border-[#E5DFD1]">{d.score}</td>
                  <td className="p-2.5 text-[#6B685F] border-r border-[#E5DFD1] leading-relaxed">{d.summary}</td>
                  <td className="p-2.5 text-[#6B685F] leading-relaxed">{d.recommendedSupport}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pedagogical Implications */}
        <div className="space-y-3">
          <h2 className="text-base font-serif font-bold text-[#4A4E3D] border-b border-[#E5DFD1] pb-1 uppercase tracking-wide">
            3. Implikasi & Penataan Lingkungan Belajar
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#FDFCF7] border border-[#E5DFD1] rounded-2xl space-y-1">
              <span className="font-bold text-[#4A4E3D] block">Pemrosesan Instruksi:</span>
              <p className="text-[#6B685F] leading-relaxed">{pedagogicalImpact.instructionProcessing}</p>
            </div>
            <div className="p-3.5 bg-[#FDFCF7] border border-[#E5DFD1] rounded-2xl space-y-1">
              <span className="font-bold text-[#4A4E3D] block">Ritme Atensi:</span>
              <p className="text-[#6B685F] leading-relaxed">
                Fokus Optimal: <b>{pedagogicalImpact.optimalFocusSpanMinutes} Menit</b> | Interval Brain Break: <b>Tiap {pedagogicalImpact.brainBreakIntervalMinutes} Menit</b>
              </p>
              <p className="text-[#6B685F] leading-relaxed">Transisi: {pedagogicalImpact.transitionStrategy}</p>
            </div>
          </div>
        </div>

        {/* Differentiated Curriculum */}
        <div className="space-y-3">
          <h2 className="text-base font-serif font-bold text-[#4A4E3D] border-b border-[#E5DFD1] pb-1 uppercase tracking-wide">
            4. Diferensiasi Kurikulum & Desain Aktivitas PPI
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#F2EDE4] border border-[#D9D4C7] rounded-2xl">
              <span className="font-bold text-[#4A4E3D] block mb-1">Diferensiasi Konten:</span>
              <ul className="space-y-0.5 text-[#6B685F]">
                {curriculumAdaptations.contentDifferentiation.slice(0, 2).map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-[#F4F6F2] border border-[#D3D8C8] rounded-2xl">
              <span className="font-bold text-[#5A5E4B] block mb-1">Diferensiasi Proses:</span>
              <ul className="space-y-0.5 text-[#6B685F]">
                {curriculumAdaptations.processDifferentiation.slice(0, 2).map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-[#F9EFEA] border border-[#EACBBF] rounded-2xl">
              <span className="font-bold text-[#B86B50] block mb-1">Diferensiasi Produk:</span>
              <ul className="space-y-0.5 text-[#6B685F]">
                {curriculumAdaptations.productDifferentiation.slice(0, 2).map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-[#F8F7F2] border border-[#E5DFD1] rounded-2xl">
              <span className="font-bold text-[#8B9A82] block mb-1">Diferensiasi Lingkungan:</span>
              <ul className="space-y-0.5 text-[#6B685F]">
                {curriculumAdaptations.environmentDifferentiation.slice(0, 2).map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Micro Activities Brief */}
          <div className="space-y-2 pt-2">
            <span className="font-bold text-xs text-[#4A4E3D] block">Contoh Skenario Aktivitas Personal:</span>
            {individualizedLearningPlan.microActivities.map((act, idx) => (
              <div key={idx} className="p-3.5 border border-[#E5DFD1] rounded-2xl bg-white text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-[#3D3B36]">
                  <span>{idx + 1}. {act.title} ({act.duration})</span>
                  <span className="text-[#5A5E4B] font-semibold">{act.targetDomain}</span>
                </div>
                <p className="text-[#6B685F]">{act.objective}</p>
                <div className="text-[11px] text-[#8D887B]">
                  <b>Taktik Scaffolding:</b> {act.scaffoldingTactics} | <b>Sensori:</b> {act.sensoryIntegrationTip}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formal Institutional Signatures Section */}
        <div className="pt-8 border-t-2 border-[#D9D4C7] grid grid-cols-3 gap-6 text-center text-xs">
          <div className="space-y-16">
            <p className="font-semibold text-[#8D887B]">Guru / Pengamat Observasi</p>
            <div>
              <p className="font-bold text-[#3D3B36]">({childMeta.observerName || '...................................'})</p>
              <p className="text-[11px] text-[#8D887B]">{childMeta.observerRole}</p>
            </div>
          </div>

          <div className="space-y-16">
            <p className="font-semibold text-[#8D887B]">Kepala Sekolah / Koordinator Inklusi</p>
            <div>
              <p className="font-bold text-[#3D3B36]">(...................................)</p>
              <p className="text-[11px] text-[#8D887B]">NIP / NIY........................</p>
            </div>
          </div>

          <div className="space-y-16">
            <p className="font-semibold text-[#8D887B]">Orang Tua / Wali Murid</p>
            <div>
              <p className="font-bold text-[#3D3B36]">(...................................)</p>
              <p className="text-[11px] text-[#8D887B]">Orang Tua {childMeta.childName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
