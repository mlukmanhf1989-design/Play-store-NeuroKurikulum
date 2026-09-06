import React, { useState } from 'react';
import { BookOpen, Globe2, Brain, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

const frameworks = [
  {
    id:'merdeka-b', title:'Kurikulum Merdeka — Fase B', country:'Indonesia', phase:'SD Kelas III–IV',
    desc:'Penguatan literasi, numerasi, penalaran, eksplorasi dan pembelajaran kontekstual.',
    principles:['Pembelajaran berdiferensiasi','Literasi & numerasi','Proyek kontekstual','Asesmen formatif','Profil Pelajar Pancasila']
  },
  {
    id:'merdeka-c', title:'Kurikulum Merdeka — Fase C', country:'Indonesia', phase:'SD Kelas V–VI',
    desc:'Pendalaman penalaran, kemandirian belajar, pemecahan masalah dan kesiapan transisi ke SMP.',
    principles:['Penalaran kritis','Problem solving','Kemandirian','Kolaborasi','Asesmen autentik']
  },
  {
    id:'cambridge', title:'Cambridge International', country:'Inggris/Internasional', phase:'Primary–Secondary',
    desc:'Kerangka internasional yang menekankan inquiry, subject mastery, critical thinking dan asesmen terstruktur.',
    principles:['Inquiry-based learning','Subject mastery','Critical thinking','International perspective','Assessment for learning']
  },
  {
    id:'singapore', title:'Singapore Curriculum', country:'Singapura', phase:'Primary–Secondary',
    desc:'Pendekatan berorientasi penguasaan konsep, problem solving, metakognisi dan literasi abad ke-21.',
    principles:['Concept mastery','Mathematical/problem solving','Metacognition','21st-century competencies','Applied learning']
  }
];

export const CurriculumFrameworksView: React.FC<{onUse?: (target:string)=>void}> = ({onUse}) => {
  const [selected, setSelected] = useState(frameworks[0]);
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
    <div className="rounded-3xl bg-[#1E3A2F] text-white p-6 shadow-sm">
      <div className="flex items-start gap-4"><div className="p-3 rounded-2xl bg-white/10"><Globe2 className="w-7 h-7"/></div><div>
        <h2 className="text-2xl font-bold">Fase B, Fase C & Kurikulum Internasional</h2>
        <p className="text-emerald-100 mt-1">Bandingkan kerangka pembelajaran Indonesia, Cambridge, dan Singapura untuk desain kurikulum berbasis neuropsikologi.</p>
      </div></div>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {frameworks.map(f=><button key={f.id} onClick={()=>setSelected(f)} className={`text-left rounded-2xl border p-5 transition ${selected.id===f.id?'border-[#1E3A2F] bg-[#EAF1EC] shadow-sm':'border-[#E6DFD5] bg-white hover:bg-[#FAF8F5]'}`}>
        <div className="flex justify-between items-start"><BookOpen className="w-5 h-5 text-[#1E3A2F]"/><span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#F2EDE4]">{f.country}</span></div>
        <h3 className="font-bold mt-4 text-[#1F2937]">{f.title}</h3><p className="text-xs text-[#6B7280] mt-1">{f.phase}</p><p className="text-sm text-[#4B5563] mt-3">{f.desc}</p>
      </button>)}
    </div>
    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
      <div className="bg-white rounded-3xl border border-[#E6DFD5] p-6"><div className="flex items-center gap-3"><Brain className="w-6 h-6 text-[#1E3A2F]"/><div><h3 className="text-xl font-bold">{selected.title}</h3><p className="text-sm text-gray-500">{selected.country} · {selected.phase}</p></div></div>
        <p className="mt-5 text-gray-700 leading-relaxed">{selected.desc}</p>
        <div className="mt-5 grid sm:grid-cols-2 gap-3">{selected.principles.map(p=><div key={p} className="flex gap-2 items-start p-3 rounded-xl bg-[#FAF8F5]"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-700"/><span className="text-sm">{p}</span></div>)}</div>
        {onUse && <button onClick={()=>onUse(selected.title)} className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E3A2F] text-white font-semibold">Gunakan sebagai Target Observasi <ArrowRight className="w-4 h-4"/></button>}
      </div>
      <div className="bg-[#F5F1E8] rounded-3xl p-6 border border-[#E6DFD5]"><Sparkles className="w-6 h-6 text-[#1E3A2F]"/><h3 className="font-bold text-lg mt-3">Integrasi Neuropsikologi</h3><p className="text-sm text-gray-700 mt-2 leading-relaxed">Kerangka kurikulum di atas dapat dipadukan dengan profil atensi, bahasa, motorik, sosial-emosional, sensori dan fleksibilitas kognitif. AI digunakan untuk membantu diferensiasi konten, proses, produk, lingkungan, dan media.</p></div>
    </div>
  </div>;
};
