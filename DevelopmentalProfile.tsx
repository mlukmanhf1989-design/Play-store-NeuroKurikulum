import React, { useState } from 'react';
import {
  Brain,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Target,
  Activity,
  MessageSquare,
  HeartHandshake,
  Puzzle,
  ChevronRight,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ComprehensiveAnalysisResult, DomainScoreResult } from '../types';

interface DevelopmentalProfileProps {
  analysis: ComprehensiveAnalysisResult;
  onNextStep: () => void;
}

export const DevelopmentalProfile: React.FC<DevelopmentalProfileProps> = ({
  analysis,
  onNextStep,
}) => {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'radar' | 'bar'>('radar');

  const {
    childMeta,
    nonDiagnosticDisclaimer,
    neurodevelopmentalStyle,
    domainScores,
  } = analysis;

  // Prepare chart data
  const chartData = (domainScores || []).map((d) => ({
    domain: (d.domainLabel || '').split('&')[0].trim(),
    fullName: d.domainLabel || '',
    score: d.score || 0,
    fullMark: 100,
  }));

  const getDomainIcon = (domainKey: string) => {
    switch (domainKey) {
      case 'attention_executive':
        return <Target className="w-5 h-5 text-[#8B9A82]" />;
      case 'motor_praxis':
        return <Activity className="w-5 h-5 text-[#5A5E4B]" />;
      case 'communication_language':
        return <MessageSquare className="w-5 h-5 text-[#C88E75]" />;
      case 'social_emotional':
        return <HeartHandshake className="w-5 h-5 text-[#B87B62]" />;
      case 'sensory_processing':
        return <Sparkles className="w-5 h-5 text-[#8B9A82]" />;
      case 'cognitive_play':
        return <Puzzle className="w-5 h-5 text-[#5A5E4B]" />;
      default:
        return <Brain className="w-5 h-5 text-[#8B9A82]" />;
    }
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-[#E8EADF] text-[#4A4E3D] border-[#D3D8C8]';
    if (score >= 65) return 'bg-[#F2EDE4] text-[#5A5E4B] border-[#D9D4C7]';
    return 'bg-[#F9EFEA] text-[#B86B50] border-[#EACBBF]';
  };

  return (
    <div className="space-y-6">
      {/* Ethical Non-Diagnostic Header Badge */}
      <div className="p-4 rounded-2xl bg-[#F2EDE4] border border-[#D9D4C7] flex items-start gap-3 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-[#8B9A82] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm text-[#4A4E3D]">
          <span className="font-bold uppercase tracking-wider text-[11px] bg-[#E8EADF] text-[#5A5E4B] px-2.5 py-0.5 rounded-full border border-[#D3D8C8]">
            Pemberitahuan Etika Non-Diagnostik
          </span>
          <p className="leading-relaxed text-[#6B685F]">{nonDiagnosticDisclaimer}</p>
        </div>
      </div>

      {/* Main Neurodevelopmental Style Hero */}
      <div className="bg-white rounded-3xl border border-[#E5DFD1] shadow-2xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#F2EDE4]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E8EADF] text-[#5A5E4B] border border-[#D3D8C8]">
                Profil Perkembangan & Gaya Belajar
              </span>
              <span className="text-xs text-[#8D887B]">
                {childMeta.childName} ({childMeta.ageYears} thn {childMeta.ageMonths} bln)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4E3D] tracking-tight">
              {neurodevelopmentalStyle.archetypeTitle}
            </h2>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6B685F]">
              <span>Modalitas Belajar Utama:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#F2EDE4] text-[#4A4E3D] border border-[#D9D4C7]">
                {neurodevelopmentalStyle.primaryLearningModality}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onNextStep}
            className="px-5 py-2.5 rounded-2xl bg-[#5A5E4B] hover:bg-[#4A4E3D] text-white text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 transition-all self-start md:self-auto"
          >
            <span>Interpretasi Pedagogis</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Narrative Description */}
        <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#E5DFD1] text-[#3D3B36] text-sm leading-relaxed">
          <p>{neurodevelopmentalStyle.description}</p>
        </div>

        {/* 3 Pillars: Strengths, Emerging Skills, Priority Support */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Key Strengths */}
          <div className="p-4 rounded-2xl bg-[#F4F6F2] border border-[#D3D8C8] space-y-2.5">
            <div className="flex items-center gap-2 text-[#4A4E3D] font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#8B9A82]" />
              <span>Kekuatan & Potensi Utama</span>
            </div>
            <ul className="space-y-1.5">
              {(neurodevelopmentalStyle?.keyStrengths || []).map((str, idx) => (
                <li key={idx} className="text-xs text-[#3D3B36] flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B9A82] mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Emerging Skills */}
          <div className="p-4 rounded-2xl bg-[#F2EDE4] border border-[#D9D4C7] space-y-2.5">
            <div className="flex items-center gap-2 text-[#5A5E4B] font-bold text-xs">
              <TrendingUp className="w-4 h-4 text-[#8B9A82]" />
              <span>Keterampilan yang Sedang Tumbuh</span>
            </div>
            <ul className="space-y-1.5">
              {(neurodevelopmentalStyle?.emergingSkills || []).map((skl, idx) => (
                <li key={idx} className="text-xs text-[#3D3B36] flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B9A82] mt-1.5 shrink-0" />
                  <span>{skl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Priority Support */}
          <div className="p-4 rounded-2xl bg-[#F9EFEA] border border-[#EACBBF] space-y-2.5">
            <div className="flex items-center gap-2 text-[#B86B50] font-bold text-xs">
              <Lightbulb className="w-4 h-4 text-[#C88E75]" />
              <span>Akomodasi & Dukungan Prioritas</span>
            </div>
            <ul className="space-y-1.5">
              {(neurodevelopmentalStyle?.prioritySupportAreas || []).map((sup, idx) => (
                <li key={idx} className="text-xs text-[#3D3B36] flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C88E75] mt-1.5 shrink-0" />
                  <span>{sup}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Domain Scores Visualizer: Radar / Bar Chart & Detail List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chart View (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-[#4A4E3D] text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#8B9A82]" />
              Peta Relatif 6 Domain Perkembangan
            </h3>
            <div className="flex gap-1 bg-[#F2EDE4] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('radar')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'radar' ? 'bg-white text-[#4A4E3D] shadow-2xs' : 'text-[#6B685F]'
                }`}
              >
                Radar
              </button>
              <button
                type="button"
                onClick={() => setViewMode('bar')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'bar' ? 'bg-white text-[#4A4E3D] shadow-2xs' : 'text-[#6B685F]'
                }`}
              >
                Grafik Batang
              </button>
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === 'radar' ? (
                <RadarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                  <PolarGrid stroke="#E5DFD1" />
                  <PolarAngleAxis dataKey="domain" tick={{ fill: '#5A5E4B', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#8D887B', fontSize: 10 }} />
                  <Radar
                    name="Indeks Perkembangan"
                    dataKey="score"
                    stroke="#5A5E4B"
                    fill="#8B9A82"
                    fillOpacity={0.4}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value}/100`, 'Indeks Relatif']}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', borderColor: '#D9D4C7', backgroundColor: '#FDFCF7' }}
                  />
                </RadarChart>
              ) : (
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F2EDE4" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#8D887B' }} />
                  <YAxis type="category" dataKey="domain" tick={{ fontSize: 11, fill: '#4A4E3D' }} width={80} />
                  <Tooltip formatter={(val: any) => [`${val}/100`, 'Skor']} contentStyle={{ borderRadius: '12px', borderColor: '#D9D4C7', backgroundColor: '#FDFCF7' }} />
                  <Bar dataKey="score" fill="#8B9A82" radius={[0, 6, 6, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-[#8D887B] text-center">
            *Skor adalah indeks relatif perkembangan teramati saat sesi observasi, bukan tolok ukur IQ kognitif.
          </p>
        </div>

        {/* Right: Detailed Domain Accordions (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2EDE4]">
            <h3 className="font-serif font-bold text-[#4A4E3D] text-base">
              Rincian Observasi Perilaku & Rekomendasi Tiap Domain
            </h3>
            <span className="text-xs text-[#8D887B]">Klik kartu untuk detail</span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {(domainScores || []).map((item: DomainScoreResult) => {
              const isExpanded = expandedDomain === item.domain;
              return (
                <div
                  key={item.domain}
                  className="rounded-2xl border border-[#E5DFD1] bg-[#FDFCF7] overflow-hidden transition-all"
                >
                  <div
                    onClick={() => setExpandedDomain(isExpanded ? null : item.domain)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#F8F7F2] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#D9D4C7] flex items-center justify-center shadow-2xs">
                        {getDomainIcon(item.domain)}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#3D3B36]">
                          {item.domainLabel}
                        </h4>
                        <p className="text-[11px] text-[#8D887B] line-clamp-1">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getScoreBadgeColor(
                          item.score
                        )}`}
                      >
                        {item.score}/100
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-[#8D887B]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#8D887B]" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 pt-2 border-t border-[#E5DFD1] bg-white space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-[#4A4E3D] block mb-1.5">
                          Perilaku Konkret yang Teramati:
                        </span>
                        <ul className="space-y-1">
                          {(item.observedBehaviors || []).map((b, bIdx) => (
                            <li key={bIdx} className="text-[#6B685F] flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8B9A82] mt-1.5 shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 bg-[#F4F6F2] rounded-xl border border-[#D3D8C8] space-y-1">
                        <span className="font-bold text-[#4A4E3D] block flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-[#8B9A82]" />
                          Rekomendasi Dukungan Kelas/Rumah:
                        </span>
                        <p className="text-[#3D3B36] leading-relaxed">
                          {item.recommendedSupport}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
