import React, { useState } from 'react';
import {
  CalendarCheck,
  Target,
  Sparkles,
  Play,
  Plus,
  Printer,
  FileDown,
  Clock,
  Box,
  Layers,
  HeartHandshake,
  CheckCircle2,
  ListOrdered,
  Lightbulb,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ComprehensiveAnalysisResult, LearningActivityDesign } from '../types';

interface PersonalizedLearningPlanProps {
  analysis: ComprehensiveAnalysisResult;
  onPrint: () => void;
  onGenerateCustomActivity: (subjectArea: string, specificGoal: string) => Promise<void>;
  isGeneratingActivity: boolean;
}

export const PersonalizedLearningPlan: React.FC<PersonalizedLearningPlanProps> = ({
  analysis,
  onPrint,
  onGenerateCustomActivity,
  isGeneratingActivity,
}) => {
  const [showActivityGenerator, setShowActivityGenerator] = useState<boolean>(false);
  const [customSubject, setCustomSubject] = useState<string>('Numerasi Bermakna & Balok');
  const [customGoal, setCustomGoal] = useState<string>('Mengenal pola & angka melalui permainan fisik');
  const [expandedActivityIdx, setExpandedActivityIdx] = useState<number | null>(0);

  const {
    childMeta,
    individualizedLearningPlan,
    neurodevelopmentalStyle,
  } = analysis;

  const {
    shortTermGoals = [],
    longTermGoals = [],
    microActivities = [],
    dailyRoutineRecommendations = [],
    evaluationRubric = [],
    parentCollabStrategies = [],
  } = individualizedLearningPlan || {};

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerateCustomActivity(customSubject, customGoal);
    setShowActivityGenerator(false);
  };

  const downloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Profil_Neuropsikologi_${childMeta.childName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Card with Export Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFD1] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8EADF] text-[#5A5E4B] border border-[#D3D8C8]">
              Langkah 5
            </span>
            <span className="text-xs font-medium text-[#8D887B]">
              Program Pembelajaran Individual (PPI) / Modul Ajar Personal
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4E3D] tracking-tight">
            Desain Pembelajaran & Intervensi Pedagogis Personal {childMeta.childName}
          </h2>
          <p className="text-[#6B685F] text-sm leading-relaxed">
            Rencana aksi konkrit berbasis ritme neuroperkembangan, target capaian bertahap, dan panduan kolaborasi sekolah-rumah.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={onPrint}
            className="px-4 py-2.5 rounded-2xl bg-[#5A5E4B] hover:bg-[#4A4E3D] text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Lengkap</span>
          </button>
          <button
            type="button"
            onClick={downloadJson}
            className="px-4 py-2.5 rounded-2xl bg-[#F2EDE4] hover:bg-[#E5DFD1] text-[#4A4E3D] text-xs sm:text-sm font-semibold border border-[#D9D4C7] flex items-center gap-2 transition-colors"
          >
            <FileDown className="w-4 h-4" />
            <span>Unduh JSON</span>
          </button>
        </div>
      </div>

      {/* Target Goals: Short Term vs Long Term */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Short Term Goals */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F2EDE4]">
            <Target className="w-5 h-5 text-[#8B9A82]" />
            <div>
              <span className="text-[11px] font-bold text-[#8B9A82] uppercase tracking-wider">Target 1 - 4 Minggu</span>
              <h3 className="font-serif font-bold text-[#4A4E3D] text-base">Tujuan Pembelajaran Jangka Pendek</h3>
            </div>
          </div>
          <ul className="space-y-2.5">
            {shortTermGoals.map((goal, idx) => (
              <li
                key={idx}
                className="p-3.5 bg-[#FDFCF7] rounded-2xl border border-[#E5DFD1] text-xs sm:text-sm text-[#3D3B36] flex items-start gap-2.5 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-[#5A5E4B] text-white font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                  {idx + 1}
                </span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Long Term Goals */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F2EDE4]">
            <Sparkles className="w-5 h-5 text-[#5A5E4B]" />
            <div>
              <span className="text-[11px] font-bold text-[#5A5E4B] uppercase tracking-wider">Target 1 Semester</span>
              <h3 className="font-serif font-bold text-[#4A4E3D] text-base">Tujuan Pembelajaran Jangka Panjang</h3>
            </div>
          </div>
          <ul className="space-y-2.5">
            {longTermGoals.map((goal, idx) => (
              <li
                key={idx}
                className="p-3.5 bg-[#F4F6F2] rounded-2xl border border-[#D3D8C8] text-xs sm:text-sm text-[#3D3B36] flex items-start gap-2.5 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-[#8B9A82] text-white font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                  {idx + 1}
                </span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skenario Aktivitas Mikro Terarah */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#F2EDE4]">
          <div>
            <h3 className="font-serif font-bold text-[#4A4E3D] text-lg flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-[#8B9A82]" />
              Skenario Aktivitas Pembelajaran Mikro (Step-by-Step)
            </h3>
            <p className="text-xs text-[#8D887B] mt-0.5">
              Rangkaian aktivitas multisensori berdaya yang siap dieksekusi di kelas atau di rumah
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowActivityGenerator(!showActivityGenerator)}
            className="px-3.5 py-2 rounded-xl bg-[#F2EDE4] hover:bg-[#E5DFD1] text-[#4A4E3D] border border-[#D9D4C7] text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Rancang Aktivitas Tambahan</span>
          </button>
        </div>

        {/* Dynamic Activity Generator Drawer / Inline Form */}
        {showActivityGenerator && (
          <form
            onSubmit={handleCreateActivity}
            className="p-5 rounded-2xl bg-[#F8F7F2] border border-[#E5DFD1] space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-serif font-bold text-[#4A4E3D] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8B9A82]" />
                Generator AI Aktivitas Pembelajaran Khusus
              </h4>
              <button
                type="button"
                onClick={() => setShowActivityGenerator(false)}
                className="text-xs text-[#8D887B] hover:text-[#3D3B36]"
              >
                Tutup
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A4E3D] mb-1">
                  Area Materi Pembelajaran
                </label>
                <select
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D9D4C7] rounded-xl text-[#3D3B36] focus:outline-hidden focus:ring-2 focus:ring-[#8B9A82]"
                >
                  <option value="Literasi & Fonik Multisensori">Literasi & Fonik Multisensori</option>
                  <option value="Numerasi Bermakna & Balok">Numerasi Bermakna & Balok</option>
                  <option value="Eksplorasi Sains & Sebab Akibat">Eksplorasi Sains & Sebab Akibat</option>
                  <option value="Sosio-Dramatis & Bermain Peran">Sosio-Dramatis & Bermain Peran</option>
                  <option value="Seni Rupa Taktil & Eksplorasi Warna">Seni Rupa Taktil & Eksplorasi Warna</option>
                  <option value="Sirkuit Fisik Motorik & Keseimbangan">Sirkuit Fisik Motorik & Keseimbangan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4E3D] mb-1">
                  Target Karakteristik Khusus
                </label>
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="Contoh: 'Melatih fokus 10 menit dengan balok kayu'"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D9D4C7] rounded-xl text-[#3D3B36] focus:outline-hidden focus:ring-2 focus:ring-[#8B9A82]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowActivityGenerator(false)}
                className="px-3.5 py-1.5 text-xs text-[#6B685F] hover:bg-[#E5DFD1] rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isGeneratingActivity}
                className="px-4 py-2 bg-[#5A5E4B] hover:bg-[#4A4E3D] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-60"
              >
                {isGeneratingActivity ? 'Merancang Aktivitas...' : 'Buat Aktivitas dengan AI'}
              </button>
            </div>
          </form>
        )}

        {/* Micro Activities List */}
        <div className="space-y-4">
          {microActivities.map((act: LearningActivityDesign, aIdx: number) => {
            const isExpanded = expandedActivityIdx === aIdx;
            return (
              <div
                key={aIdx}
                className="rounded-3xl border border-[#E5DFD1] bg-[#FDFCF7] overflow-hidden transition-all shadow-2xs"
              >
                {/* Activity Header Bar */}
                <div
                  onClick={() => setExpandedActivityIdx(isExpanded ? null : aIdx)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-[#F8F7F2] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#5A5E4B] text-white uppercase tracking-wider">
                        Aktivitas {aIdx + 1}
                      </span>
                      <span className="text-xs font-semibold text-[#5A5E4B] bg-[#E8EADF] px-2.5 py-0.5 rounded-full border border-[#D3D8C8]">
                        {act.targetDomain}
                      </span>
                      <span className="text-xs text-[#8D887B] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {act.duration}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-[#3D3B36]">
                      {act.title}
                    </h4>
                    <p className="text-xs text-[#6B685F] line-clamp-1">
                      {act.objective}
                    </p>
                  </div>

                  <div className="p-2 text-[#8D887B]">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Activity Content */}
                {isExpanded && (
                  <div className="p-5 pt-2 border-t border-[#E5DFD1] bg-white space-y-5 text-xs sm:text-sm">
                    {/* Materials Needed */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-[#4A4E3D] flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <Box className="w-4 h-4 text-[#8B9A82]" /> Alat & Bahan:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(act.materialsNeeded || []).map((m, mIdx) => (
                          <span
                            key={mIdx}
                            className="px-2.5 py-1 rounded-xl bg-[#F2EDE4] border border-[#D9D4C7] text-xs text-[#3D3B36] font-medium"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Step-by-Step Instructions */}
                    <div className="space-y-2">
                      <span className="font-bold text-[#4A4E3D] flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <ListOrdered className="w-4 h-4 text-[#8B9A82]" /> Langkah Pelaksanaan:
                      </span>
                      <div className="space-y-2">
                        {(act.stepByStepInstructions || []).map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3.5 rounded-2xl bg-[#FDFCF7] border border-[#E5DFD1] flex items-start gap-3 text-[#3D3B36] leading-relaxed text-xs"
                          >
                            <span className="w-5 h-5 rounded-full bg-[#5A5E4B] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3 Strategy Columns: Scaffolding, Sensory, Parent/Teacher */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                      <div className="p-3.5 bg-[#F2EDE4] rounded-2xl border border-[#D9D4C7] space-y-1">
                        <span className="font-bold text-[#4A4E3D] text-xs block">
                          🎯 Taktik Scaffolding (Bantuan Bertahap):
                        </span>
                        <p className="text-[#3D3B36] text-xs leading-relaxed">
                          {act.scaffoldingTactics}
                        </p>
                      </div>

                      <div className="p-3.5 bg-[#F4F6F2] rounded-2xl border border-[#D3D8C8] space-y-1">
                        <span className="font-bold text-[#4A4E3D] text-xs block">
                          ✨ Integrasi Sensori:
                        </span>
                        <p className="text-[#3D3B36] text-xs leading-relaxed">
                          {act.sensoryIntegrationTip}
                        </p>
                      </div>

                      <div className="p-3.5 bg-[#F9EFEA] rounded-2xl border border-[#EACBBF] space-y-1">
                        <span className="font-bold text-[#B86B50] text-xs block">
                          💡 Tips Fasilitator/Guru:
                        </span>
                        <p className="text-[#3D3B36] text-xs leading-relaxed">
                          {act.parentTeacherTip}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Routine Schedule with Neuro-Sensory Strategies */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F2EDE4]">
          <Clock className="w-5 h-5 text-[#8B9A82]" />
          <h3 className="font-serif font-bold text-[#4A4E3D] text-base">
            Rekomendasi Struktur Rutinitas Harian di Kelas
          </h3>
        </div>

        <div className="space-y-3">
          {dailyRoutineRecommendations.map((routine, rIdx) => (
            <div
              key={rIdx}
              className="p-4 rounded-2xl border border-[#E5DFD1] bg-[#FDFCF7] grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs"
            >
              <div className="md:col-span-3 font-bold text-[#4A4E3D]">
                {routine.timeframe}
              </div>
              <div className="md:col-span-4 font-semibold text-[#3D3B36]">
                {routine.activityFocus}
              </div>
              <div className="md:col-span-5 text-[#6B685F] bg-white p-3 rounded-xl border border-[#E5DFD1] leading-relaxed">
                <span className="font-bold text-[#4A4E3D] block text-[11px] mb-0.5">Strategi Sensori:</span>
                {routine.neuroSensoryStrategy}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Qualitative Evaluation Rubric (3-Tiers) */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F2EDE4]">
          <CheckCircle2 className="w-5 h-5 text-[#8B9A82]" />
          <div>
            <h3 className="font-serif font-bold text-[#4A4E3D] text-base">
              Rubrik Evaluasi Formatif Kualitatif (3 Tingkat Capaian)
            </h3>
            <p className="text-xs text-[#8D887B]">
              Digunakan guru untuk memantau kemajuan perkembangan non-angka secara berkala
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#F2EDE4] border-b border-[#E5DFD1] text-[#4A4E3D]">
                <th className="p-3.5 font-bold rounded-l-xl w-1/4">Indikator Capaian</th>
                <th className="p-3.5 font-bold text-[#B86B50] bg-[#F9EFEA] w-1/4">Mulai Berkembang (MB)</th>
                <th className="p-3.5 font-bold text-[#5A5E4B] bg-[#F4F6F2] w-1/4">Berkembang Sesuai Harapan (BSH)</th>
                <th className="p-3.5 font-bold text-[#4A4E3D] bg-[#E8EADF] rounded-r-xl w-1/4">Sangat Berkembang (SB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EDE4]">
              {evaluationRubric.map((rubric, idx) => (
                <tr key={idx} className="hover:bg-[#FDFCF7]">
                  <td className="p-3.5 font-semibold text-[#3D3B36] align-top">{rubric.indicator}</td>
                  <td className="p-3.5 text-[#6B685F] bg-[#F9EFEA]/30 align-top leading-relaxed">{rubric.emerging}</td>
                  <td className="p-3.5 text-[#6B685F] bg-[#F4F6F2]/30 align-top leading-relaxed">{rubric.progressing}</td>
                  <td className="p-3.5 text-[#6B685F] bg-[#E8EADF]/30 align-top leading-relaxed">{rubric.mastered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parent Collaboration Guide */}
      <div className="bg-[#F4F6F2] rounded-3xl p-6 sm:p-8 border border-[#D3D8C8] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#D3D8C8]">
          <HeartHandshake className="w-5 h-5 text-[#8B9A82]" />
          <h3 className="font-serif font-bold text-[#4A4E3D] text-base">
            Panduan Penyelarasan & Kolaborasi Sekolah - Rumah (Home-School Partnership)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {parentCollabStrategies.map((strat, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-2xl border border-[#E5DFD1] text-xs text-[#3D3B36] flex items-start gap-2.5 leading-relaxed shadow-2xs"
            >
              <span className="w-5 h-5 rounded-full bg-[#5A5E4B] text-white font-bold flex items-center justify-center shrink-0 text-xs">
                {idx + 1}
              </span>
              <span>{strat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
