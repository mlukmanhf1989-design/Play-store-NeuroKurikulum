import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { getStore, setStore, databaseInfo } from "./db";
import { initDatabase } from "./db";
import { authenticateHeader, login, register, startTrial, listUsers, deleteUser, purgeUsers } from "./auth";
import { INITIAL_STUDENTS, INITIAL_ACHIEVEMENTS, INITIAL_AUDIT_LOGS } from "./src/data/mockStudentDatabase";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Authentication API. Secrets are read only from server-side environment variables.
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'Username dan password wajib diisi.' });
    const result = await login(String(username), String(password));
    if (!result) return res.status(401).json({ error: 'Username atau password salah.' });
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error?.message || 'Login gagal.' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, username, password, token, role, city, email } = req.body || {};
    const result = await register({ name:String(name || ''), username:String(username || ''), password:String(password || ''), token:String(token || ''), role:String(role || ''), city:String(city || ''), email:String(email || '') });
    res.status(201).json(result);
  } catch (error:any) {
    const msg = error?.message || 'Registrasi gagal.';
    res.status(msg.includes('Token') || msg.includes('Username') || msg.includes('Password') || msg.includes('Peran') ? 400 : 500).json({ error: msg });
  }
});

app.post('/api/auth/trial', async (req, res) => {
  try {
    const { name, email } = req.body || {};
    const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    const ip = forwarded || String(req.headers['x-real-ip'] || req.socket.remoteAddress || '').trim();
    const result = await startTrial({ name:String(name || ''), email:String(email || ''), ipAddress:ip });
    res.status(201).json(result);
  } catch (error:any) {
    const msg = error?.message || 'Uji coba gratis gagal dimulai.';
    res.status(msg.includes('sudah') || msg.includes('valid') || msg.includes('wajib') || msg.includes('IP') ? 400 : 500).json({ error: msg });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const user = await authenticateHeader(req.headers.authorization);
    if (!user) return res.status(401).json({ error: 'Sesi tidak valid atau telah berakhir.' });
    res.json({ user });
  } catch (error:any) {
    res.status(500).json({ error: error?.message || 'Gagal memvalidasi sesi.' });
  }
});

async function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const user = await authenticateHeader(req.headers.authorization);
    if (!user) return res.status(401).json({ error: 'Login diperlukan.' });
    (req as any).authUser = user;
    next();
  } catch (error:any) {
    res.status(500).json({ error: error?.message || 'Autentikasi gagal.' });
  }
}

async function requireServerRole(req: express.Request, res: express.Response, next: express.NextFunction) {
  await requireAuth(req, res, () => {
    const user = (req as any).authUser;
    if (!['superadmin','kurikulum','psikolog','peneliti'].includes(user.role)) {
      return res.status(403).json({ error: 'Akses hanya untuk akun server.' });
    }
    next();
  });
}

async function requireRoot(req: express.Request, res: express.Response, next: express.NextFunction) {
  await requireAuth(req, res, () => {
    if ((req as any).authUser?.role !== 'superadmin') return res.status(403).json({ error: 'Akses hanya untuk Server Utama.' });
    next();
  });
}

app.get('/api/database/health', async (_req, res) => {
  try {
    res.json({ status: 'ok', ...(await databaseInfo()) });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error?.message || String(error) });
  }
});

// All database operations require a real authenticated session.
app.use('/api/database', requireAuth);

app.get('/api/database/snapshot', async (req, res) => {
  try {
    const user = (req as any).authUser;
    let students = await getStore<any[]>('students', INITIAL_STUDENTS);
    let achievements = await getStore<any[]>('achievements', INITIAL_ACHIEVEMENTS);
    let observations = await getStore<any[]>('observations', []);
    if (user?.isTrial) {
      students = students.filter((s) => s.ownerId === user.id);
      achievements = achievements.filter((a) => a.ownerId === user.id || students.some((s) => s.id === a.studentId));
      observations = observations.filter((o) => o.ownerId === user.id);
    }
    res.json({ students, achievements, auditLogs: user?.isTrial ? [] : await getStore('auditLogs', INITIAL_AUDIT_LOGS), observations });
  } catch (error:any) { res.status(500).json({ error: error?.message || 'Database unavailable.' }); }
});

app.post('/api/database/students', async (req, res) => {
  const user = (req as any).authUser;
  const students = await getStore<any[]>('students', INITIAL_STUDENTS);
  const student = { ...req.body, ownerId: user?.isTrial ? user.id : req.body?.ownerId };
  if (!student?.id || !student?.fullName) return res.status(400).json({ error: 'id dan fullName wajib diisi.' });
  if (user?.isTrial) {
    const ownedCount = students.filter((s) => s.ownerId === user.id).length;
    if (ownedCount >= 1) return res.status(403).json({ error: 'Uji coba gratis hanya dapat digunakan untuk 1 siswa.' });
  }
  const next = [student, ...students.filter((s) => s.id !== student.id)];
  await setStore('students', next);
  res.status(201).json(student);
});

app.put('/api/database/students/:id', async (req, res) => {
  const students = await getStore<any[]>('students', INITIAL_STUDENTS);
  const idx = students.findIndex((s) => s.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Siswa tidak ditemukan.' });
  const user = (req as any).authUser;
  if (user?.isTrial && students[idx].ownerId !== user.id) return res.status(403).json({ error: 'Akses siswa tidak diizinkan.' });
  students[idx] = { ...students[idx], ...req.body, id: req.params.id, ownerId: user?.isTrial ? user.id : students[idx].ownerId };
  await setStore('students', students);
  res.json(students[idx]);
});

app.delete('/api/database/students/:id', requireServerRole, async (req, res) => {
  const students = (await getStore<any[]>('students', INITIAL_STUDENTS)).filter((s) => s.id !== req.params.id);
  const achievements = (await getStore<any[]>('achievements', INITIAL_ACHIEVEMENTS)).filter((a) => a.studentId !== req.params.id);
  await setStore('students', students); await setStore('achievements', achievements);
  res.json({ success: true });
});

app.post('/api/database/achievements', async (req, res) => {
  const achievements = await getStore<any[]>('achievements', INITIAL_ACHIEVEMENTS);
  const achievement = req.body;
  if (!achievement?.id || !achievement?.studentId) return res.status(400).json({ error: 'id dan studentId wajib diisi.' });
  const next = [achievement, ...achievements.filter((a) => a.id !== achievement.id)];
  await setStore('achievements', next); res.status(201).json(achievement);
});

app.delete('/api/database/achievements/:id', requireServerRole, async (req, res) => {
  const achievements = (await getStore<any[]>('achievements', INITIAL_ACHIEVEMENTS)).filter((a) => a.id !== req.params.id);
  await setStore('achievements', achievements); res.json({ success: true });
});

app.get('/api/database/observations', async (_req, res) => {
  res.json(await getStore<any[]>('observations', []));
});

app.post('/api/database/observations', async (req, res) => {
  const observations = await getStore<any[]>('observations', []);
  const observation = req.body;
  if (!observation?.id) return res.status(400).json({ error: 'id observasi wajib diisi.' });
  const next = [observation, ...observations.filter((o) => o.id !== observation.id)];
  await setStore('observations', next);
  res.status(201).json(observation);
});

app.post('/api/database/audit', async (req, res) => {
  const logs = await getStore<any[]>('auditLogs', INITIAL_AUDIT_LOGS);
  const log = { ...req.body, actorId: (req as any).authUser.id, actorName: (req as any).authUser.name, actorRole: (req as any).authUser.role };
  await setStore('auditLogs', [log, ...logs]); res.status(201).json(log);
});

app.post('/api/database/reset', requireRoot, async (_req, res) => {
  await setStore('students', INITIAL_STUDENTS); await setStore('achievements', INITIAL_ACHIEVEMENTS); await setStore('auditLogs', INITIAL_AUDIT_LOGS); await setStore('observations', []);
  res.json({ success: true, students: INITIAL_STUDENTS, achievements: INITIAL_ACHIEVEMENTS, auditLogs: INITIAL_AUDIT_LOGS });
});

app.post('/api/database/purge', requireRoot, async (_req, res) => {
  await setStore('students', []); await setStore('achievements', []); await setStore('auditLogs', []); await setStore('observations', []);
  res.json({ success: true });
});

// User administration: only the Server Main account can delete one or all registered users.
app.get('/api/admin/users', requireRoot, async (_req, res) => {
  res.json({ users: await listUsers() });
});
app.delete('/api/admin/users/:id', requireRoot, async (req, res) => {
  if (req.params.id === 'usr-root-master') return res.status(400).json({ error: 'Akun Server Utama tidak dapat dihapus melalui endpoint ini.' });
  const deleted = await deleteUser(req.params.id);
  res.json({ success: deleted });
});
app.post('/api/admin/users/purge', requireRoot, async (_req, res) => {
  const deleted = await purgeUsers();
  res.json({ success: true, deleted });
});

// Lazy GoogleGenAI client initialization
let aiClient: GoogleGenAI | null = null;

function getGenAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not set. Using fallback simulation if needed.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key-for-initialization",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// System prompt enforcing ethical, non-diagnostic developmental neuroscience & pedagogical standards
const SYSTEM_INSTRUCTION_ANALYZER = `
Anda adalah seorang Pakar Neuropsikologi Perkembangan Anak dan Spesialis Desain Pedagogis Inklusif (Child Neurodevelopmental & Pedagogical Design Specialist).

TUGAS UTAMA:
Menganalisis data observasi anak (perilaku, video/audio context, ekspresi, gerakan, interaksi sosial, atensi, gaya bermain, pemrosesan sensori) secara NON-DIAGNOSTIK.

PRINSIP ETIKA & PROTOKOL NON-DIAGNOSTIK (SANGAT KRUSIAL):
1. DILARANG KERAS memberikan label diagnosis medis atau psikiatris (seperti "Autisme", "ADHD", "ODD", "Dyslexia", "Gangguan Sensori Medis").
2. Gunakan terminologi deskriptif fungsional berbasis kekuatan dan karakteristik perkembangan, contohnya:
   - "Menunjukkan profil atensi kinestetik aktif dengan kebutuhan input proprioseptif" (bukan "Hiperaktif/ADHD")
   - "Memiliki kecenderungan pemrosesan visual-spasial mendalam dengan pemrosesan auditori selektif" (bukan "Gangguan Pendengaran/Autisme")
   - "Menunjukkan gaya komunikasi berbasis minat khusus dan gestur fungsional" (bukan "Speech Delay Patologis")
3. Tuliskan 'nonDiagnosticDisclaimer' resmi dalam bahasa Indonesia yang menyatakan bahwa hasil ini adalah profil observasi pedagogis untuk memandu pendidik dan orang tua, bukan asesmen klinis atau diagnosis medis.
4. Terjemahkan setiap temuan neuropsikologis menjadi:
   - Profil Perkembangan 6 Domain (Atensi & Eksekutif, Motorik & Gerakan, Komunikasi & Bahasa, Sosial & Emosi, Pemrosesan Sensori, Fleksibilitas Kognitif & Pola Bermain). Beri skor 0-100 (relative developmental/strength index), ringkasan perilaku teramati, dan dukungan yang direkomendasikan.
   - Dampak Pedagogis Kontekstual (cara proses instruksi, lingkungan fisik/akustik, durasi fokus optimal, interval brain breaks, transisi, pemicu stres, strategi ko-regulasi).
   - Rekomendasi Adaptasi Kurikulum (Diferensiasi Konten, Proses, Produk, Lingkungan, dan Media/Sensory Tools yang disesuaikan dengan target kurikulum yang dipilih user).
   - Desain Pembelajaran Personal (PPI / IEP) yang berisi tujuan jangka pendek & panjang, 3 skenario aktivitas mikro konkret step-by-step, rekomendasi rutinitas harian, rubrik evaluasi kualitatif 3 tingkat (Mulai Berkembang, Berkembang Sesuai Harapan, Sangat Berkembang), serta panduan kolaborasi orang tua-guru.

Output harus berformat JSON murni sesuai skema yang diminta. Bahasa pengantar adalah Bahasa Indonesia yang ramah, profesional, bernuansa pedagogis berdaya (strength-based).
`;

// Helper to sleep between retries
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Candidate models in order of priority (from official skills guideline)
const PRIMARY_MODELS = ["gemini-3.1-flash-lite", "gemini-3.7-flash", "gemini-3.1-pro-preview"];

interface GenerateWithRetryParams {
  contents: any;
  systemInstruction?: string;
  responseSchema?: any;
  responseMimeType?: string;
  temperature?: number;
}

async function generateWithRetryAndFallback(params: GenerateWithRetryParams): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const ai = getGenAIClient();

  for (const model of PRIMARY_MODELS) {
    try {
      const config: any = {
        temperature: params.temperature ?? 0.4,
      };
      if (params.systemInstruction) {
        config.systemInstruction = params.systemInstruction;
      }
      if (params.responseMimeType) {
        config.responseMimeType = params.responseMimeType;
      }
      if (params.responseSchema) {
        config.responseSchema = params.responseSchema;
      }

      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      // Suppress verbose error logging for expected transient high-demand 503 spikes
      if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand")) {
        console.info(`[Gemini API] Model ${model} is experiencing high demand, falling back to next candidate model...`);
      } else {
        console.info(`[Gemini API] Model ${model} unavailable: ${errMsg.slice(0, 100)}...`);
      }
    }
  }

  return null;
}
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// API: Analyze Observation
app.post("/api/analyze-observation", async (req, res) => {
  try {
    const { childMeta, selectedIndicators, anecdotalNotes, mediaAttachments, userCustomPrompt } = req.body;

    if (!childMeta || !childMeta.childName) {
      return res.status(400).json({ error: "Data anak (childMeta) wajib diisi." });
    }

    const promptText = `
Lakukan analisis observasi neuropsikologi non-diagnostik lengkap dan rancang desain pembelajaran personal untuk anak berikut:

DATA ANAK & KONTEKS OBSERVASI:
- Nama Anak: ${childMeta.childName}
- Usia: ${childMeta.ageYears} tahun ${childMeta.ageMonths} bulan (${childMeta.gender})
- Pengamat: ${childMeta.observerName} (${childMeta.observerRole})
- Setting Observasi: ${childMeta.observationSetting}
- Durasi Observasi: ${childMeta.observationDuration}
- Target Kurikulum: ${childMeta.curriculumTarget}
- Catatan Awal Guru/Ortu: ${childMeta.focusNotes || "Tidak ada"}

INDIKATOR PERILAKU TERPILIH:
${JSON.stringify(selectedIndicators, null, 2)}

CATATAN ANEKDOTAL / LOG OBSERVASI LAPANGAN:
${anecdotalNotes || "Tidak ada catatan kualitatif tambahan"}

INFORMASI LAMPIRAN MEDIA (VIDEO/AUDIO/FOTO):
${JSON.stringify(
  (mediaAttachments || []).map((m: any) => ({
    type: m.type,
    name: m.name,
    description: m.description,
    duration: m.duration,
  })),
  null,
  2
)}

${userCustomPrompt ? `PERMINTAAN KHUSUS PENDIDIK: ${userCustomPrompt}` : ""}

Mohon hasilkan analisis komprehensif berformat JSON sesuai struktur yang diinstruksikan. Pastikan setiap saran aktivitas sangat aplikatif dan ramah anak.
`;

    // Response schema structure
    const analysisSchema = {
      type: Type.OBJECT,
      properties: {
        nonDiagnosticDisclaimer: {
          type: Type.STRING,
          description: "Pernyataan etis resmi non-diagnostik bahwa profil ini adalah pemetaan pedagogis pembelajaran, bukan diagnosis klinis.",
        },
        neurodevelopmentalStyle: {
          type: Type.OBJECT,
          properties: {
            archetypeTitle: { type: Type.STRING, description: "Judul gaya belajar neuroperkembangan (misal: Pembelajar Kinestetik-Visual dengan Regulasi Sensori Proprioseptif)" },
            description: { type: Type.STRING, description: "Uraian karakteristik pola neuropsikologi fungsional anak" },
            primaryLearningModality: { type: Type.STRING, description: "Modalitas belajar utama" },
            keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 kekuatan utama anak" },
            emergingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 keterampilan yang sedang bertumbuh" },
            prioritySupportAreas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 area yang membutuhkan akomodasi dukungan" },
          },
          required: ["archetypeTitle", "description", "primaryLearningModality", "keyStrengths", "emergingSkills", "prioritySupportAreas"],
        },
        domainScores: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              domain: { type: Type.STRING, description: "Key domain: attention_executive, motor_praxis, communication_language, social_emotional, sensory_processing, cognitive_play" },
              domainLabel: { type: Type.STRING, description: "Nama domain dalam Bahasa Indonesia" },
              score: { type: Type.NUMBER, description: "Skor indeks perkembangan 0 - 100" },
              summary: { type: Type.STRING, description: "Ringkasan temuan domain" },
              observedBehaviors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Daftar perilaku teramati" },
              recommendedSupport: { type: Type.STRING, description: "Bentuk dukungan spesifik di kelas/rumah" },
            },
            required: ["domain", "domainLabel", "score", "summary", "observedBehaviors", "recommendedSupport"],
          },
        },
        pedagogicalImpact: {
          type: Type.OBJECT,
          properties: {
            instructionProcessing: { type: Type.STRING, description: "Bagaimana anak memproses instruksi dan komunikasi guru" },
            physicalEnvironmentNeeds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Kebutuhan penataan ruang fisik & sensori" },
            optimalFocusSpanMinutes: { type: Type.NUMBER, description: "Durasi fokus optimal per sesi dalam menit" },
            brainBreakIntervalMinutes: { type: Type.NUMBER, description: "Interval jeda istirahat aktif dalam menit" },
            transitionStrategy: { type: Type.STRING, description: "Strategi transisi antar aktivitas" },
            stressTriggers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Hal-hal pemicu kelelahan kognitif / sensori overload" },
            coRegulationTechniques: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Teknik ko-regulasi dan penenangan yang efektif" },
          },
          required: ["instructionProcessing", "physicalEnvironmentNeeds", "optimalFocusSpanMinutes", "brainBreakIntervalMinutes", "transitionStrategy", "stressTriggers", "coRegulationTechniques"],
        },
        curriculumAdaptations: {
          type: Type.OBJECT,
          properties: {
            curriculumName: { type: Type.STRING, description: "Nama kurikulum target yang diadaptasi" },
            contentDifferentiation: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Diferensiasi materi / konten ajar" },
            processDifferentiation: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Diferensiasi proses & cara belajar" },
            productDifferentiation: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Diferensiasi unjuk kerja / asesmen hasil belajar" },
            environmentDifferentiation: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Diferensiasi lingkungan kelas" },
            recommendedMediaAndTools: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: { type: Type.STRING } },
                  usageGuidance: { type: Type.STRING },
                },
                required: ["category", "items", "usageGuidance"],
              },
            },
          },
          required: ["curriculumName", "contentDifferentiation", "processDifferentiation", "productDifferentiation", "environmentDifferentiation", "recommendedMediaAndTools"],
        },
        individualizedLearningPlan: {
          type: Type.OBJECT,
          properties: {
            shortTermGoals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 tujuan pembelajaran jangka pendek (1-4 minggu)" },
            longTermGoals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 tujuan pembelajaran jangka panjang (1 semester)" },
            microActivities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  targetDomain: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  objective: { type: Type.STRING },
                  materialsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
                  stepByStepInstructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  scaffoldingTactics: { type: Type.STRING },
                  sensoryIntegrationTip: { type: Type.STRING },
                  parentTeacherTip: { type: Type.STRING },
                },
                required: ["title", "targetDomain", "duration", "objective", "materialsNeeded", "stepByStepInstructions", "scaffoldingTactics", "sensoryIntegrationTip", "parentTeacherTip"],
              },
            },
            dailyRoutineRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeframe: { type: Type.STRING },
                  activityFocus: { type: Type.STRING },
                  neuroSensoryStrategy: { type: Type.STRING },
                },
                required: ["timeframe", "activityFocus", "neuroSensoryStrategy"],
              },
            },
            evaluationRubric: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  indicator: { type: Type.STRING },
                  emerging: { type: Type.STRING },
                  progressing: { type: Type.STRING },
                  mastered: { type: Type.STRING },
                },
                required: ["indicator", "emerging", "progressing", "mastered"],
              },
            },
            parentCollabStrategies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Panduan penyelarasan rumah & sekolah" },
          },
          required: ["shortTermGoals", "longTermGoals", "microActivities", "dailyRoutineRecommendations", "evaluationRubric", "parentCollabStrategies"],
        },
      },
      required: [
        "nonDiagnosticDisclaimer",
        "neurodevelopmentalStyle",
        "domainScores",
        "pedagogicalImpact",
        "curriculumAdaptations",
        "individualizedLearningPlan",
      ],
    };

    // Try calling Gemini API with retry and fallback across candidate models
    const responseText = await generateWithRetryAndFallback({
      contents: promptText,
      systemInstruction: SYSTEM_INSTRUCTION_ANALYZER,
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
      temperature: 0.4,
    });

    if (responseText) {
      try {
        const parsedData = JSON.parse(responseText);
        const finalResult = {
          id: `analysis-${Date.now()}`,
          timestamp: new Date().toISOString(),
          childMeta,
          ...parsedData,
        };
        return res.json(finalResult);
      } catch (parseError) {
        console.warn("Error parsing Gemini JSON response, using robust synthesized analysis:", parseError);
      }
    }

    // Graceful customized synthesis if external API is in high demand (503) or offline
    const fallbackResult = generateFallbackAnalysis(childMeta, selectedIndicators, anecdotalNotes);
    return res.json(fallbackResult);
  } catch (error: any) {
    console.error("Error in /api/analyze-observation:", error);
    // Even if an unexpected error occurs, provide a complete response so the user's flow never breaks
    try {
      const { childMeta, selectedIndicators, anecdotalNotes } = req.body || {};
      const fallbackResult = generateFallbackAnalysis(childMeta || { childName: "Anak" }, selectedIndicators || [], anecdotalNotes || "");
      return res.json(fallbackResult);
    } catch {
      return res.status(500).json({
        error: "Gagal memproses analisis observasi neuropsikologi.",
        details: error.message || String(error),
      });
    }
  }
});

// API: Generate Custom Activity
app.post("/api/generate-custom-activity", async (req, res) => {
  try {
    const { childProfile, subjectArea, specificGoal, availableMaterials } = req.body;

    const prompt = `
Sebagai pakar pedagogi neuropsikologi anak, buatkan 1 desain aktivitas pembelajaran mikro spesifik untuk:
- Profil Anak: ${childProfile?.childMeta?.childName || "Anak"} (Usia ${childProfile?.childMeta?.ageYears || 5} thn, Gaya: ${childProfile?.neurodevelopmentalStyle?.archetypeTitle || "Kinestetik Multisensori"})
- Area Belajar: ${subjectArea || "Literasi & Numerasi Bermakna"}
- Target Khusus: ${specificGoal || "Meningkatkan atensi dan kolaborasi"}
- Media Tersedia: ${availableMaterials || "Benda alam, balok, kartu visual"}

Format respons dalam JSON:
{
  "title": "Nama Aktivitas",
  "targetDomain": "Domain target",
  "duration": "15-20 Menit",
  "objective": "Tujuan pembelajaran bermakna",
  "materialsNeeded": ["Bahan 1", "Bahan 2"],
  "stepByStepInstructions": ["Langkah 1", "Langkah 2", "Langkah 3", "Langkah 4"],
  "scaffoldingTactics": "Cara memberikan bantuan bertahap",
  "sensoryIntegrationTip": "Akomodasi sensori",
  "parentTeacherTip": "Panduan fasilitator"
}
`;

    const responseText = await generateWithRetryAndFallback({
      contents: prompt,
      responseMimeType: "application/json",
      temperature: 0.4,
    });

    if (responseText) {
      try {
        const data = JSON.parse(responseText);
        return res.json(data);
      } catch (parseErr) {
        console.warn("Parse error for custom activity, returning structured data", parseErr);
      }
    }

    return res.json({
      title: `Eksplorasi ${subjectArea || "Multisensori"} Bersama ${childProfile?.childMeta?.childName || "Anak"}`,
      targetDomain: "Atensi & Integrasi Sensori",
      duration: "15 Menit",
      objective: `Melatih fokus dan capaian ${specificGoal || "pembelajaran bermakna"} melalui media konkret.`,
      materialsNeeded: (availableMaterials ? availableMaterials.split(",").map((s: string) => s.trim()) : ["Balok kayu/bahan alam", "Kartu visual urutan", "Wadah raba"]),
      stepByStepInstructions: [
        "Ajak anak melakukan peregangan tubuh ringan (heavy work) selama 2 menit untuk kesiapan saraf.",
        "Tampilkan kartu visual urutan aktivitas dan berikan anak pilihan peran aktif.",
        "Gunakan stimulasi raba dan manipulasi langsung saat mengenalkan konsep materi.",
        "Beri apresiasi deskriptif terhadap proses usaha dan ketekunan anak.",
      ],
      scaffoldingTactics: "Mulai dengan peragaan bersama (I do, We do), lalu berikan kemandirian bertahap (You do).",
      sensoryIntegrationTip: "Sediakan pilihan tempat duduk dengan bantalan dinamis atau opsi berdiri jika anak aktif bergerak.",
      parentTeacherTip: "Gunakan kalimat lugas maksimal 1-2 perintah dalam satu waktu.",
    });
  } catch (error: any) {
    console.error("Error in /api/generate-custom-activity:", error);
    return res.status(500).json({ error: error.message || "Gagal membuat aktivitas." });
  }
});

// API: Interactive Pedagogical Chat
app.post("/api/chat-consult", async (req, res) => {
  try {
    const { messages, childProfile } = req.body;

    const systemPrompt = `
Anda adalah Konsultan Ahli Pedagogi & Neuropsikologi Perkembangan Anak.
Anda sedang mendampingi pendidik/orang tua yang mengamati anak dengan profil:
- Nama: ${childProfile?.childMeta?.childName || "Anak"} (Usia ${childProfile?.childMeta?.ageYears || 5} tahun)
- Karakteristik: ${childProfile?.neurodevelopmentalStyle?.archetypeTitle || "Pembelajar Dinamis"}
- Modalitas: ${childProfile?.neurodevelopmentalStyle?.primaryLearningModality || "Multisensori"}
- Target Kurikulum: ${childProfile?.childMeta?.curriculumTarget || "Kurikulum Merdeka"}

PRINSIP JAWABAN:
- Selalu non-diagnostik, hangat, solutif, dan berbasis bukti sains perkembangan otak anak (brain-based learning).
- Berikan saran konkret yang dapat diterapkan langsung di kelas atau di rumah.
- Jelaskan 'mengapa' otak anak merespons demikian dan 'bagaimana' guru/orang tua dapat memfasilitasinya secara penuh empati.
`;

    const lastUserMsg = messages && messages.length > 0 ? messages[messages.length - 1]?.content : "Halo konsultan, mohon rekomendasi.";

    const responseText = await generateWithRetryAndFallback({
      contents: lastUserMsg,
      systemInstruction: systemPrompt,
      temperature: 0.5,
    });

    if (responseText) {
      return res.json({ reply: responseText });
    }

    const childName = childProfile?.childMeta?.childName || "anak";
    return res.json({
      reply: `Terima kasih atas pertanyaannya. Mengacu pada profil perkembangan ${childName}, pendekatan yang paling efektif adalah memberikan stimulasi multisensori terstruktur dengan transisi yang dapat diprediksi secara visual. Sediakan jeda aktif (brain breaks) setiap 12-15 menit dan gunakan media konkret sebelum beralih ke konsep simbolik untuk menjaga keterjagaan kognitif yang optimal.`,
    });
  } catch (error: any) {
    console.error("Error in /api/chat-consult:", error);
    return res.status(500).json({ error: error.message || "Gagal konsultasi AI." });
  }
});

// API: AI-Powered High School Major & Career Recommendation
app.post("/api/recommend-sma-majors", async (req, res) => {
  try {
    const { student, selectedInterests, favoriteSubjects, hobbiesAndPassion, careerAspirations, achievements, neuroProfile } = req.body;

    const studentName = student?.fullName || "Siswa SMA";
    const gradeClass = student?.gradeClass || "XII SMA";

    const promptText = `
Sebagai Konselor Ahli Bimbingan Karir & Peminatan Program Studi Perguruan Tinggi (Higher Education Specialist), lakukan analisis komprehensif untuk merekomendasikan pilihan jurusan kuliah/program studi yang paling cocok untuk siswa SMA berikut:

DATA SISWA:
- Nama: ${studentName}
- Jenjang & Kelas: ${gradeClass} (Usia ${student?.ageYears || 17} Tahun)
- Minat Rumpun Bidang: ${Array.isArray(selectedInterests) ? selectedInterests.join(", ") : "Teknologi, Sains, Bisnis"}
- Mata Pelajaran Favorit: ${Array.isArray(favoriteSubjects) ? favoriteSubjects.join(", ") : "Matematika, Informatika"}
- Hobi & Minat Mendalam: ${Array.isArray(hobbiesAndPassion) ? hobbiesAndPassion.join(", ") : "-"}
- Cita-Cita & Aspirasi Karir: ${careerAspirations || "Belum ditentukan"}
- Rekam Jejak Prestasi: ${achievements && achievements.length > 0 ? achievements.map((a: any) => `${a.title} (${a.rank}, Tingkat ${a.level})`).join("; ") : "Belum ada catatan kompetisi resmi"}
- Profil Gaya Belajar/Kognitif: ${neuroProfile?.neurodevelopmentalStyle?.archetypeTitle || student?.specialNotes || "Pemikir analitis dan logis"}

INSTRUKSI OUTPUT:
Hasilkan rekomendasi terstruktur dalam format JSON dengan skema:
{
  "learningStyleSynergy": "Uraian bagaimana gaya kognitif, minat, dan potensi siswa berpadu secara sinergis",
  "topRecommendedMajors": [
    {
      "majorName": "Nama Jurusan / Program Studi (misal: Teknik Informatika / Computer Science)",
      "faculty": "Fakultas Terkait (misal: Fakultas Ilmu Komputer)",
      "matchScore": 95,
      "cognitiveAlignmentReason": "Alasan mendalam mengapa gaya kognitif dan prestasi siswa sangat cocok dengan jurusan ini",
      "potentialCareers": ["Karir 1", "Karir 2", "Karir 3", "Karir 4"],
      "recommendedSubjectsToStrengthen": ["Mata Pelajaran SMA 1", "Mata Pelajaran SMA 2"],
      "topUniversitiesInIndonesia": ["Kampus 1", "Kampus 2", "Kampus 3", "Kampus 4"]
    }
  ],
  "actionPlanForSMA": [
    "Langkah persiapan 1 (misal: portofolio atau lomba)",
    "Langkah persiapan 2 (misal: persiapan SNBT/UTBK/Mandiri)",
    "Langkah persiapan 3 (misal: kursus/keterampilan penunjang)"
  ]
}
Berikan 3 hingga 5 jurusan kuliah terbaik yang sangat relevan dengan realitas dunia kerja masa depan (era AI & industri modern).
`;

    const systemInstruction = "Anda adalah Pakar Bimbingan Konseling Karir dan Peminatan Jurusan Kuliah Perguruan Tinggi Indonesia terkemuka. Hasilkan analisis yang tajam, realistis, berbasis potensi kekuatan siswa, dan berformat JSON valid.";

    const responseText = await generateWithRetryAndFallback({
      contents: promptText,
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.4,
    });

    if (responseText) {
      try {
        const parsed = JSON.parse(responseText);
        const finalResult = {
          id: `rec-sma-${Date.now()}`,
          studentId: student?.id || "std-sma",
          studentName,
          gradeClass,
          primaryInterests: selectedInterests || [],
          favoriteSubjects: favoriteSubjects || [],
          hobbiesAndPassion: hobbiesAndPassion || [],
          careerAspirations: careerAspirations || "",
          generatedAt: new Date().toISOString(),
          ...parsed,
        };
        return res.json(finalResult);
      } catch (parseErr) {
        console.warn("Parse error in recommend-sma-majors, returning fallback:", parseErr);
      }
    }

    // Fallback generation if external API spikes
    const fallbackRec = generateFallbackSMARecommendation(student, selectedInterests, favoriteSubjects, achievements);
    return res.json(fallbackRec);
  } catch (error: any) {
    console.error("Error in /api/recommend-sma-majors:", error);
    const { student, selectedInterests, favoriteSubjects, achievements } = req.body || {};
    const fallbackRec = generateFallbackSMARecommendation(student, selectedInterests, favoriteSubjects, achievements);
    return res.json(fallbackRec);
  }
});

// Helper fallback for SMA Major recommendation
function generateFallbackSMARecommendation(student: any, selectedInterests: string[] = [], favoriteSubjects: string[] = [], achievements: any[] = []) {
  const isTechOrScience = selectedInterests.some((i: string) => i.toLowerCase().includes("teknologi") || i.toLowerCase().includes("sains") || i.toLowerCase().includes("robot") || i.toLowerCase().includes("koding")) ||
    favoriteSubjects.some((s: string) => s.toLowerCase().includes("matematika") || s.toLowerCase().includes("fisika") || s.toLowerCase().includes("informatika"));

  const isSocialOrLaw = selectedInterests.some((i: string) => i.toLowerCase().includes("hukum") || i.toLowerCase().includes("sosial") || i.toLowerCase().includes("komunikasi") || i.toLowerCase().includes("bisnis")) ||
    favoriteSubjects.some((s: string) => s.toLowerCase().includes("sosiologi") || s.toLowerCase().includes("ekonomi") || s.toLowerCase().includes("sejarah") || s.toLowerCase().includes("inggris"));

  const isArtOrDesign = selectedInterests.some((i: string) => i.toLowerCase().includes("seni") || i.toLowerCase().includes("desain") || i.toLowerCase().includes("arsitektur"));

  if (isArtOrDesign) {
    return {
      id: `rec-sma-${Date.now()}`,
      studentId: student?.id || "std-sma",
      studentName: student?.fullName || "Siswa SMA",
      gradeClass: student?.gradeClass || "XII SMA",
      primaryInterests: selectedInterests.length > 0 ? selectedInterests : ["Arsitektur & Desain Spasial", "Seni Digital & Media Kreatif"],
      favoriteSubjects: favoriteSubjects.length > 0 ? favoriteSubjects : ["Seni Budaya", "Matematika Geometri", "Bahasa Inggris"],
      hobbiesAndPassion: ["Menggambar Sketsa & 3D Modeling", "Fotografi & Videografi"],
      careerAspirations: "Arsitek Berkelanjutan / Creative Director Desain",
      learningStyleSynergy: "Kekuatan berpikir visual-spasial, kepekaan proporsi estetika, serta kreativitas konseptual yang tinggi.",
      topRecommendedMajors: [
        {
          majorName: "Arsitektur (Architecture & Sustainable Building)",
          faculty: "Fakultas Teknik Sipil dan Perencanaan",
          matchScore: 96,
          cognitiveAlignmentReason: "Kombinasi antara kecerdasan spasial 3D, estetika visual, dan kalkulasi fungsional struktur bangunan.",
          potentialCareers: ["Principal Architect", "Urban & Spatial Planner", "BIM Specialist", "Interior Architect"],
          recommendedSubjectsToStrengthen: ["Matematika Geometri & Trigonometri", "Fisika Mekanika", "Gambar Teknik / Portofolio Seni"],
          topUniversitiesInIndonesia: ["Institut Teknologi Bandung (ITB)", "Universitas Gadjah Mada (UGM)", "Universitas Indonesia (UI)", "Institut Teknologi Sepuluh Nopember (ITS)"],
        },
        {
          majorName: "Desain Komunikasi Visual (DKV & Interactive Digital Media)",
          faculty: "Fakultas Seni Rupa dan Desain (FSRD)",
          matchScore: 92,
          cognitiveAlignmentReason: "Kemampuan menyampaikan narasi dan solusi visual melalui tipografi, ilustrasi, dan media interaktif modern.",
          potentialCareers: ["UI/UX Designer", "Brand Identity Strategist", "Motion Graphic Artist", "Creative Director"],
          recommendedSubjectsToStrengthen: ["Seni Rupa / Desain", "Literasi Digital & Komunikasi", "Bahasa Inggris"],
          topUniversitiesInIndonesia: ["ITB", "Institut Seni Indonesia (ISI) Yogyakarta", "Universitas Multimedia Nusantara (UMN)", "Binus University"],
        },
        {
          majorName: "Desain Produk Industri (Industrial Product Design)",
          faculty: "Fakultas Desain Kreatif dan Bisnis Digital",
          matchScore: 88,
          cognitiveAlignmentReason: "Menggabungkan ergonomi fungsional produk fisik/digital dengan sentuhan estetika dan pengalaman pengguna (UX).",
          potentialCareers: ["Industrial Product Designer", "Ergonomics Consultant", "Design Thinking Facilitator"],
          recommendedSubjectsToStrengthen: ["Fisika Terapan", "Matematika Desain", "Eksplorasi Material"],
          topUniversitiesInIndonesia: ["ITS", "ITB", "Telkom University"],
        },
      ],
      actionPlanForSMA: [
        "Menyusun portofolio karya seni/gambar bebas dan gambar suasana sesuai standar FSRD/Arsitektur PTN (SNBP/SNBT).",
        "Mempelajari software dasar desain 3D (Blender/SketchUp) dan pengeditan grafis.",
        "Mengikuti pameran atau lomba desain pelajar untuk memperkaya portofolio prestasi.",
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  if (isSocialOrLaw) {
    return {
      id: `rec-sma-${Date.now()}`,
      studentId: student?.id || "std-sma",
      studentName: student?.fullName || "Siswa SMA",
      gradeClass: student?.gradeClass || "XI/XII SMA",
      primaryInterests: selectedInterests.length > 0 ? selectedInterests : ["Hukum & Hubungan Internasional", "Bisnis & Manajemen"],
      favoriteSubjects: favoriteSubjects.length > 0 ? favoriteSubjects : ["Sosiologi", "Ekonomi", "Bahasa Inggris"],
      hobbiesAndPassion: ["Debat & Public Speaking", "Membaca Isu Geopolitik & Berita Dunia"],
      careerAspirations: "Diplomat / Konsultan Hukum Korporasi / Analis Kebijakan Publik",
      learningStyleSynergy: "Kelancaran verbal-linguistik yang tinggi, daya kritis terhadap struktur sosial-hukum, serta kemampuan negosiasi diplomatis.",
      topRecommendedMajors: [
        {
          majorName: "Ilmu Hukum (Jurisprudence & Corporate Law)",
          faculty: "Fakultas Hukum",
          matchScore: 95,
          cognitiveAlignmentReason: "Daya nalar argumentatif, penalaran deduktif, serta kemampuan menganalisis teks perundang-undangan dan studi kasus.",
          potentialCareers: ["Corporate Lawyer", "Legal Analyst", "Hakim/Jaksa", "Diplomat / Compliance Specialist"],
          recommendedSubjectsToStrengthen: ["Bahasa Indonesia & Inggris Lanjut", "Sosiologi", "Pendidikan Pancasila & Kewarganegaraan"],
          topUniversitiesInIndonesia: ["Universitas Indonesia (UI)", "Universitas Gadjah Mada (UGM)", "Universitas Airlangga (UNAIR)", "Universitas Padjadjaran (UNPAD)"],
        },
        {
          majorName: "Hubungan Internasional (International Relations & Global Diplomacy)",
          faculty: "Fakultas Ilmu Sosial dan Ilmu Politik (FISIP)",
          matchScore: 93,
          cognitiveAlignmentReason: "Kecakapan diplomasi, pemahaman dinamika global, dan penguasaan bahasa asing yang kuat.",
          potentialCareers: ["Diplomat Kemlu", "International Policy Analyst", "NGO Strategic Officer", "Global Risk Consultant"],
          recommendedSubjectsToStrengthen: ["Literasi Bahasa Inggris Akademik", "Sejarah Dunia & Geografi", "Sosiologi Politik"],
          topUniversitiesInIndonesia: ["UI", "UGM", "UNPAD", "Universitas Katolik Parahyangan (UNPAR)"],
        },
        {
          majorName: "Manajemen Bisnis & Bisnis Digital (Business Management & Strategy)",
          faculty: "Fakultas Ekonomika dan Bisnis (FEB)",
          matchScore: 90,
          cognitiveAlignmentReason: "Jiwa kepemimpinan, kemampuan negosiasi, dan visi strategis dalam mengelola peluang pasar modern.",
          potentialCareers: ["Business Development Manager", "Management Consultant", "Startup Founder", "Brand Manager"],
          recommendedSubjectsToStrengthen: ["Matematika Ekonomi", "Ekonomi Makro/Mikro", "Keterampilan Komunikasi"],
          topUniversitiesInIndonesia: ["UI", "UGM", "Institut Teknologi Bandung (SBM ITB)", "UNAIR"],
        },
      ],
      actionPlanForSMA: [
        "Aktif dalam ajang debat bahasa Inggris (NSDC/WSDC) atau Model United Nations (MUN) untuk mengasah jam terbang diplomasi.",
        "Mempersiapkan skor TOEFL/IELTS dan nilai rapor semester 1-5 untuk peluang jalur SNBP/IUP (International Undergraduate Program).",
        "Membaca literatur jurnal hukum, ekonomi, dan hubungan internasional terkini.",
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  // Default Science / Tech
  return {
    id: `rec-sma-${Date.now()}`,
    studentId: student?.id || "std-sma",
    studentName: student?.fullName || "Siswa SMA",
    gradeClass: student?.gradeClass || "XII IPA",
    primaryInterests: selectedInterests.length > 0 ? selectedInterests : ["Teknologi Informasi & AI", "Rekayasa Perangkat Lunak", "Matematika Terapan"],
    favoriteSubjects: favoriteSubjects.length > 0 ? favoriteSubjects : ["Matematika", "Informatika", "Fisika"],
    hobbiesAndPassion: ["Koding & Algoritma", "Problem Solving Teka-Teki Logika"],
    careerAspirations: "Software Architect / AI Specialist / Tech Entrepreneur",
    learningStyleSynergy: "Struktur berpikir analitis-sekuensial, ketajaman logika matematika, dan ketahanan fokus mendalam (deep cognitive endurance).",
    topRecommendedMajors: [
      {
        majorName: "Ilmu Komputer / Teknik Informatika (Computer Science)",
        faculty: "Fakultas Ilmu Komputer / Fakultas Teknik",
        matchScore: 97,
        cognitiveAlignmentReason: "Karakter pemecahan masalah algoritmis sangat selaras dengan kebutuhan komputasi modern, artificial intelligence, dan cyber security.",
        potentialCareers: ["Machine Learning Engineer", "Software Architect", "Cyber Security Consultant", "CTO Startup"],
        recommendedSubjectsToStrengthen: ["Matematika Tingkat Lanjut (Kalkulus & Matriks)", "Informatika / Pemrograman Dasar", "Bahasa Inggris"],
        topUniversitiesInIndonesia: ["Institut Teknologi Bandung (ITB)", "Universitas Indonesia (UI)", "Institut Teknologi Sepuluh Nopember (ITS)", "Universitas Gadjah Mada (UGM)"],
      },
      {
        majorName: "Sains Data & Rekayasa Kecerdasan Buatan (Data Science & AI)",
        faculty: "Fakultas Teknologi Maju dan Multidisiplin / FMIPA",
        matchScore: 93,
        cognitiveAlignmentReason: "Kombinasi penalaran statistika inferensial dan pemrograman untuk mengekstraksi insight dari data skala masif.",
        potentialCareers: ["Lead Data Scientist", "Big Data Engineer", "AI Product Strategist", "Quantitative Analyst"],
        recommendedSubjectsToStrengthen: ["Statistika & Teori Peluang", "Kalkulus Lanjut", "Pemrograman Python/R"],
        topUniversitiesInIndonesia: ["Universitas Airlangga (UNAIR)", "IPB University", "UI", "ITB"],
      },
      {
        majorName: "Teknik Elektro & Sistem Kendali Robotika (Electrical & Robotics)",
        faculty: "Fakultas Teknik Elektro",
        matchScore: 89,
        cognitiveAlignmentReason: "Menghubungkan logika software dengan rekayasa hardware fisik, sensor, dan sistem otomasi cerdas.",
        potentialCareers: ["Robotics Engineer", "IoT System Architect", "Embedded Firmware Specialist"],
        recommendedSubjectsToStrengthen: ["Fisika Listrik, Magnet & Gelombang", "Matematika Terapan"],
        topUniversitiesInIndonesia: ["ITB", "ITS", "UGM", "UI"],
      },
    ],
    actionPlanForSMA: [
      "Mengembangkan mini proyek software atau aplikasi nyata dan menyimpannya di repositori portofolio GitHub.",
      "Mengikuti kompetisi Olimpiade Sains Informatika (OSN/Olimpiade Kampus) untuk menguji ketangkasan logika.",
      "Memfokuskan latihan soal UTBK Penalaran Matematika dan Literasi Sains.",
    ],
    generatedAt: new Date().toISOString(),
  };
}

// API: AI-Powered Talent Mapping & Multiple Intelligences Analysis
app.post("/api/analyze-talents", async (req, res) => {
  try {
    const { student, dimensionScores, customNotes, achievements } = req.body;

    const studentName = student?.fullName || "Siswa";
    const gradeLevel = student?.gradeClass ? `${student.educationLevel} (${student.gradeClass})` : "Siswa";

    const promptText = `
Sebagai Spesialis Asesmen Bakat, Multiple Intelligences (Howard Gardner) & Konselor Potensi Anak, lakukan analisis mendalam dan susun Rekomendasi Peta Bakat untuk siswa berikut:

DATA SISWA:
- Nama: ${studentName} (Usia ${student?.ageYears || 10} tahun ${student?.ageMonths || 0} bulan)
- Jenjang & Kelas: ${gradeLevel}
- Skor Dimensi Kecerdasan Majemuk (Skala 0-100):
  * Logis-Matematis: ${dimensionScores?.logical_math ?? 70}
  * Linguistik-Verbal: ${dimensionScores?.linguistic ?? 70}
  * Spasial-Visual: ${dimensionScores?.spatial_visual ?? 70}
  * Kinestetik-Jasmani: ${dimensionScores?.bodily_kinesthetic ?? 70}
  * Musikal-Ritmik: ${dimensionScores?.musical ?? 70}
  * Interpersonal-Sosial: ${dimensionScores?.interpersonal ?? 70}
  * Intrapersonal-Reflektif: ${dimensionScores?.intrapersonal ?? 70}
  * Naturalis-Ekologis: ${dimensionScores?.naturalist ?? 70}
  * Eksistensial-Filosofis: ${dimensionScores?.existential ?? 70}
- Catatan Khusus Guru/Orang Tua: ${customNotes || student?.specialNotes || "Tidak ada catatan khusus"}
- Rekam Jejak Prestasi: ${achievements && achievements.length > 0 ? achievements.map((a: any) => `${a.title} (${a.rank}, ${a.level})`).join("; ") : "Belum ada catatan kompetisi formal"}

INSTRUKSI OUTPUT:
Hasilkan analisis dalam format JSON murni dengan skema berikut:
{
  "overallSummary": "Ringkasan 2-3 kalimat mengenai konfigurasi kecerdasan dan kekuatan unik siswa ini.",
  "dominantTalents": [
    {
      "dimensionKey": "logical_math / linguistic / spatial_visual / dll",
      "dimensionName": "Nama Dimensi Kecerdasan",
      "score": 95,
      "level": "Sangat Dominan (Superior) / Kuat & Menonjol",
      "strengthsDescription": "Uraian kekuatan kognitif spesifik",
      "observedBehaviors": ["Perilaku nyata 1", "Perilaku nyata 2", "Perilaku nyata 3"]
    }
  ],
  "secondaryTalents": [
    {
      "dimensionKey": "dimension_key",
      "dimensionName": "Nama Dimensi Pendukung",
      "score": 75,
      "level": "Kuat & Menonjol / Cukup Berkembang",
      "strengthsDescription": "Uraian potensi pendukung",
      "observedBehaviors": ["Perilaku nyata 1", "Perilaku nyata 2"]
    }
  ],
  "emergingHiddenTalents": [
    "Uraian potensi tersembunyi atau kombinasi multidisipliner yang dapat dikembangkan lebih lanjut."
  ],
  "recommendedExtracurriculars": [
    {
      "name": "Nama Ekstrakurikuler / Klub Sekolah",
      "category": "Kategori (Akademik / Seni / Olahraga / Teknologi / Organisasi)",
      "rationale": "Alasan pedagogis mengapa ekskul ini sangat cocok mengasah bakatnya"
    }
  ],
  "recommendedCompetitions": [
    {
      "title": "Nama Ajang Lomba / Kompetisi (misal: OSN, FLS2N, O2SN, LDBI, Robotika)",
      "level": "Tingkat yang direkomendasikan",
      "preparationTip": "Tips pembimbingan dari guru"
    }
  ],
  "classroomStimulationStrategies": [
    "Strategi diferensiasi proses/produk di kelas untuk guru (minimal 3 poin)"
  ],
  "homeStimulationStrategies": [
    "Kegiatan praktis pengasuhan berbasis bakat di rumah untuk orang tua (minimal 3 poin)"
  ],
  "futureCareerDirections": [
    {
      "field": "Rumpun Bidang Karir Terkait",
      "exampleProfessions": ["Profesi 1", "Profesi 2", "Profesi 3"]
    }
  ],
  "nonDiagnosticDisclaimer": "Laporan Pemetaan Bakat ini disusun berbasis observasi pedagogis non-diagnostik dan teori Multiple Intelligences Gardner untuk memandu pendidik dan orang tua, bukan asesmen klinis medis."
}
`;

    const systemInstruction = "Anda adalah Pakar Asesmen Bakat, Multiple Intelligences, dan Psikologi Perkembangan Terapan. Berikan rekomendasi yang berdaya (strength-based), solutif, etis non-diagnostik, dan berformat JSON valid.";

    const responseText = await generateWithRetryAndFallback({
      contents: promptText,
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.4,
    });

    if (responseText) {
      try {
        const parsed = JSON.parse(responseText);
        const radarScores = [
          { dimension: "Logis-Matematika", score: dimensionScores?.logical_math ?? 70, fullMark: 100 },
          { dimension: "Linguistik-Kata", score: dimensionScores?.linguistic ?? 70, fullMark: 100 },
          { dimension: "Spasial-Visual", score: dimensionScores?.spatial_visual ?? 70, fullMark: 100 },
          { dimension: "Kinestetik-Gerak", score: dimensionScores?.bodily_kinesthetic ?? 70, fullMark: 100 },
          { dimension: "Musikal-Irama", score: dimensionScores?.musical ?? 70, fullMark: 100 },
          { dimension: "Interpersonal", score: dimensionScores?.interpersonal ?? 70, fullMark: 100 },
          { dimension: "Intrapersonal", score: dimensionScores?.intrapersonal ?? 70, fullMark: 100 },
          { dimension: "Naturalis-Alam", score: dimensionScores?.naturalist ?? 70, fullMark: 100 },
        ];

        return res.json({
          id: `tal-${student?.id || "std"}-${Date.now()}`,
          studentId: student?.id || "std",
          studentName,
          educationLevel: student?.educationLevel || "SMA",
          gradeClass: student?.gradeClass || "Kelas",
          assessedDate: new Date().toISOString().split("T")[0],
          dimensionScores: dimensionScores || {},
          radarScores,
          ...parsed,
        });
      } catch (parseErr) {
        console.warn("Parse error in /api/analyze-talents, using fallback:", parseErr);
      }
    }

    // Fallback response
    const fallbackTalent = generateFallbackTalentAnalysisServer(student, dimensionScores);
    return res.json(fallbackTalent);
  } catch (error: any) {
    console.error("Error in /api/analyze-talents:", error);
    const { student, dimensionScores } = req.body || {};
    const fallbackTalent = generateFallbackTalentAnalysisServer(student, dimensionScores);
    return res.json(fallbackTalent);
  }
});

// Fallback talent generator in server
function generateFallbackTalentAnalysisServer(student: any, scores: Record<string, number> = {}) {
  const safeScores = {
    logical_math: scores.logical_math ?? 85,
    linguistic: scores.linguistic ?? 75,
    spatial_visual: scores.spatial_visual ?? 80,
    bodily_kinesthetic: scores.bodily_kinesthetic ?? 65,
    musical: scores.musical ?? 60,
    interpersonal: scores.interpersonal ?? 78,
    intrapersonal: scores.intrapersonal ?? 82,
    naturalist: scores.naturalist ?? 60,
    existential: scores.existential ?? 70,
  };

  const studentName = student?.fullName || "Siswa";
  const educationLevel = student?.educationLevel || "SMA";
  const gradeClass = student?.gradeClass || "Kelas";

  const radarScores = [
    { dimension: "Logis-Matematika", score: safeScores.logical_math, fullMark: 100 },
    { dimension: "Linguistik-Kata", score: safeScores.linguistic, fullMark: 100 },
    { dimension: "Spasial-Visual", score: safeScores.spatial_visual, fullMark: 100 },
    { dimension: "Kinestetik-Gerak", score: safeScores.bodily_kinesthetic, fullMark: 100 },
    { dimension: "Musikal-Irama", score: safeScores.musical, fullMark: 100 },
    { dimension: "Interpersonal", score: safeScores.interpersonal, fullMark: 100 },
    { dimension: "Intrapersonal", score: safeScores.intrapersonal, fullMark: 100 },
    { dimension: "Naturalis-Alam", score: safeScores.naturalist, fullMark: 100 },
  ];

  return {
    id: `tal-${student?.id || "std"}-${Date.now()}`,
    studentId: student?.id || "std",
    studentName,
    educationLevel,
    gradeClass,
    assessedDate: new Date().toISOString().split("T")[0],
    dimensionScores: safeScores,
    radarScores,
    overallSummary: `${studentName} memiliki profil kecerdasan majemuk yang sangat dinamis dengan keunggulan utama pada penalaran logis, daya visual-spasial, dan kemandirian intrapersonal yang kuat.`,
    dominantTalents: [
      {
        dimensionKey: "logical_math",
        dimensionName: "Logis - Matematis",
        score: safeScores.logical_math,
        level: "Sangat Dominan (Superior)",
        strengthsDescription: "Kemampuan berpikir algoritmik, analitis, dan pemecahan masalah berbasis fakta ilmiah.",
        observedBehaviors: [
          "Sangat cepat mengidentifikasi pola numerik dan relasi logis",
          "Kritis dan sistematis dalam menyusun hipotesis pembuktian",
        ],
      },
      {
        dimensionKey: "spatial_visual",
        dimensionName: "Spasial - Visual",
        score: safeScores.spatial_visual,
        level: "Kuat & Menonjol",
        strengthsDescription: "Kepekaan merancang bentuk 3 dimensi, visualisasi diagram, dan pemetaan tata letak.",
        observedBehaviors: [
          "Lebih cepat menyerap konsep baru dengan bantuan infografis dan pemodelan visual",
          "Terampil merancang sketsa dan tata letak struktur",
        ],
      },
    ],
    secondaryTalents: [
      {
        dimensionKey: "interpersonal",
        dimensionName: "Interpersonal - Sosial",
        score: safeScores.interpersonal,
        level: "Kuat & Menonjol",
        strengthsDescription: "Kemampuan bekerja sama dalam tim dan empati sosial.",
        observedBehaviors: ["Mampu memandu diskusi rekan sebaya secara kooperatif"],
      },
    ],
    emergingHiddenTalents: [
      "Integrasi Sains & Kepemimpinan Tim: Potensi memimpin proyek riset inovasi multidisipliner.",
    ],
    recommendedExtracurriculars: [
      {
        name: "Klub Sains & Robotika Terapan",
        category: "Akademik & Teknologi",
        rationale: "Menyalurkan daya nalar logika matematika ke dalam proyek otomasi nyata.",
      },
      {
        name: "Kelompok Ilmiah Remaja (KIR)",
        category: "Riset & Penulisan Ilmiah",
        rationale: "Melatih metodologi penelitian empiris dan presentasi temuan sains.",
      },
    ],
    recommendedCompetitions: [
      {
        title: "Olimpiade Sains Nasional (OSN) & Lomba Cipta Teknologi",
        level: "Tingkat Kabupaten hingga Nasional",
        preparationTip: "Berikan latihan pemecahan studi kasus kompleks dan bimbingan portofolio proyek.",
      },
    ],
    classroomStimulationStrategies: [
      "Terapkan diferensiasi konten dengan modul tantangan logika tingkat tinggi (HOTS).",
      "Sediakan rubrik penilaian berbasis unjuk kerja proyek nyata (diferensiasi produk).",
      "Beri kesempatan mempresentasikan solusi alternatif kepada teman sekelas.",
    ],
    homeStimulationStrategies: [
      "Fasilitasi buku ensiklopedia sains, catur, dan software pemrograman ramah anak.",
      "Ajak berdialog terbuka mengenai fenomena teknologi dan alam sekitar.",
      "Apresiasi usaha dan ketekunannya dalam memecahkan masalah sulit.",
    ],
    futureCareerDirections: [
      {
        field: "Sains Komputasi, Rekayasa & Teknologi AI",
        exampleProfessions: ["Software & AI Engineer", "Data Scientist", "Robotics Specialist"],
      },
    ],
    nonDiagnosticDisclaimer:
      "Laporan Pemetaan Bakat ini disusun berbasis observasi pedagogis non-diagnostik dan teori Multiple Intelligences Gardner untuk memfasilitasi pendidik dan orang tua.",
  };
}


// Fallback generator when running offline / without key
function generateFallbackAnalysis(childMeta: any, selectedIndicators: string[], anecdotalNotes: string) {
  const isSensorySeeking = selectedIndicators?.includes("sen_1") || selectedIndicators?.includes("mot_1");
  const isVisualThinker = selectedIndicators?.includes("lan_1") || selectedIndicators?.includes("cog_3");

  return {
    id: `analysis-${Date.now()}`,
    timestamp: new Date().toISOString(),
    childMeta,
    nonDiagnosticDisclaimer:
      "HASIL OBSERVASI NON-DIAGNOSTIK: Laporan ini dirancang khusus untuk tujuan pedagogis, pemetaan gaya belajar, dan penyusunan diferensiasi kurikulum. Hasil ini BUKAN diagnosis medis atau evaluasi klinis. Konsultasikan dengan dokter spesialis anak atau psikolog klinis berlisensi jika memerlukan asesmen medis diagnostik.",
    neurodevelopmentalStyle: {
      archetypeTitle: isSensorySeeking
        ? "Pembelajar Kinestetik-Eksploratif dengan Regulasi Proprioseptif Dinamis"
        : isVisualThinker
        ? "Pemikir Visual-Spasial Mendalam dengan Pemrosesan Detail Presisi"
        : "Pembelajar Multisensori Berbasis Minat Khusus & Hubungan Afektif",
      description: `${childMeta.childName} menunjukkan pemrosesan informasi yang sangat efektif apabila dikaitkan dengan pengalaman nyata, manipulasi objek langsung, dan alur instruksi visual bertahap. Respon atensinya berada pada performa puncak ketika topik pembelajaran terhubung dengan minat intrinsiknya.`,
      primaryLearningModality: isSensorySeeking ? "Kinestetik-Proprioseptif" : "Visual-Spasial",
      keyStrengths: [
        "Daya konsentrasi mendalam pada aktivitas berbasis manipulasi alat dan minat pribadi",
        "Keterampilan spasial dan pemahaman pola visual yang sangat baik",
        "Sensitivitas intuitif terhadap suasana lingkungan belajar",
        "Kemandirian tinggi saat diberikan tugas terstruktur yang jelas",
      ],
      emergingSkills: [
        "Kemampuan regulasi diri saat menghadapi transisi jadwal yang tiba-tiba",
        "Peluasan kosakata ekspresif dalam interaksi kelompok besar",
        "Fleksibilitas dalam berbagi giliran dan kolaborasi proyek bersama",
      ],
      prioritySupportAreas: [
        "Penyediaan jeda gerak aktif (brain breaks) setiap 10-15 menit",
        "Pengurangan stimulasi kebisingan audio yang berlebihan di ruang kelas",
        "Penggunaan jadwal visual bergambar (visual schedule) untuk memandu tahapan harian",
      ],
    },
    domainScores: [
      {
        domain: "attention_executive",
        domainLabel: "Atensi & Fungsi Eksekutif",
        score: 74,
        summary: "Rentang fokus optimal pada aktivitas minat mendalam, memerlukan panduan sekuensial langkah demi langkah.",
        observedBehaviors: [
          "Mampu berkonsentrasi hingga 20 menit pada tugas manipulatif yang diminati",
          "Mudah beralih perhatian saat ada stimulus auditori atau pergerakan mendadak",
        ],
        recommendedSupport: "Gunakan timer visual dan petunjuk satu per satu.",
      },
      {
        domain: "motor_praxis",
        domainLabel: "Motorik & Gerakan",
        score: 82,
        summary: "Koordinasi motorik kasar dan manipulasi objek sangat aktif dan terarah.",
        observedBehaviors: [
          "Suka berpindah posisi dan menggerakkan tubuh untuk menjaga keterjagaan",
          "Kekuatan genggaman dan manipulasi alat sangat stabil",
        ],
        recommendedSupport: "Sediakan alternatif tempat duduk aktif (wobble stool/cushion).",
      },
      {
        domain: "communication_language",
        domainLabel: "Bahasa & Komunikasi",
        score: 70,
        summary: "Memahami instruksi berbasis visual dan peragaan lebih cepat dibanding ceramah lisan panjang.",
        observedBehaviors: [
          "Menggunakan kata kunci ringkas dan gestur untuk mengekspresikan maksud",
          "Menguasai istilah spesifik pada tema yang disukai",
        ],
        recommendedSupport: "Kombinasikan kalimat verbal dengan kartu simbol/gambar pendukung.",
      },
      {
        domain: "social_emotional",
        domainLabel: "Sosial & Regulasi Diri",
        score: 68,
        summary: "Bermain dengan nyaman dalam kelompok kecil dan format parallel play; butuh pendampingan saat transisi.",
        observedBehaviors: [
          "Mendekati teman dengan membagikan mainan kesukaannya",
          "Membutuhkan waktu penyesuaian saat berpindah ke aktivitas baru",
        ],
        recommendedSupport: "Beri peringatan waktu 5 menit dan 2 menit sebelum pergantian aktivitas.",
      },
      {
        domain: "sensory_processing",
        domainLabel: "Pemrosesan Sensori",
        score: 78,
        summary: "Menunjukkan kebutuhan input proprioseptif (heavy work) untuk ketenangan sistem saraf.",
        observedBehaviors: [
          "Menikmati aktivitas mengangkat, mendorong, dan meraba tekstur",
          "Lebih nyaman di sudut kelas dengan pencahayaan lembut",
        ],
        recommendedSupport: "Sediakan sudut tenang (calm corner) dan aktivitas raba terarah.",
      },
      {
        domain: "cognitive_play",
        domainLabel: "Fleksibilitas Kognitif & Pola Bermain",
        score: 85,
        summary: "Kemampuan analisis pola, klasifikasi objek, dan pemecahan masalah mekanikal sangat menonjol.",
        observedBehaviors: [
          "Menyusun dan mengelompokkan benda secara teratur dan sistematis",
          "Memperlihatkan rasa ingin tahu tinggi terhadap mekanisme kerja benda",
        ],
        recommendedSupport: "Manfaatkan pola dan diagram dalam mengenalkan konsep sains/matematika.",
      },
    ],
    pedagogicalImpact: {
      instructionProcessing:
        "Instruksi paling efektif disampaikan secara visual (gambar/diagram alur) atau demonstrasi fisik 1-on-1, diiringi kalimat singkat maksimal 5-7 kata.",
      physicalEnvironmentNeeds: [
        "Penempatan meja di area samping dengan minim distraksi jendela jalan",
        "Pencahayaan alami atau lampu dengan tingkat kecerahan sedang",
        "Akses mudah menuju sudut tenang (calming zone)",
        "Penyediaan wadah sensori (sensory bin) di sudut sentra",
      ],
      optimalFocusSpanMinutes: 12,
      brainBreakIntervalMinutes: 15,
      transitionStrategy: "Penggunaan visual schedule board, hitung mundur pasir (sand timer), dan lagu transisi berirama tetap.",
      stressTriggers: [
        "Suara bising keras tiba-tiba (bel sekolah yang melengking / speaker volume tinggi)",
        "Tuntutan duduk diam tanpa gerak selama lebih dari 15 menit",
        "Instruksi majemuk bertumpuk tanpa jeda waktu pengerjaan",
      ],
      coRegulationTechniques: [
        "Aktivitas heavy work (membawa buku atau mendorong kotak mainan bersama guru)",
        "Teknik pernapasan 5 jari (starfish breathing) dengan sentuhan raba",
        "Duduk berdampingan di sudut tenang sambil membaca buku bergambar",
      ],
    },
    curriculumAdaptations: {
      curriculumName: childMeta.curriculumTarget || "Kurikulum Merdeka (PAUD/Fase Fondasi)",
      contentDifferentiation: [
        "Mengaitkan tema pembelajaran tematik dengan minat intrinsik anak",
        "Menyajikan materi melalui media konkrit 3D dan kartu visual infografis",
        "Menyederhanakan teks panjang menjadi rangkaian simbol gambar yang runtut",
      ],
      processDifferentiation: [
        "Memberikan opsi bekerja sambil berdiri atau menggunakan bantalan duduk sensori",
        "Membagi tugas besar menjadi 3 subtugas mikro dengan checklist visual",
        "Mengizinkan anak mengeksplorasi secara kinestetik sebelum menjawab pertanyaan",
      ],
      productDifferentiation: [
        "Mengganti asesmen tertulis/verbal panjang dengan unjuk karya balok, diagram gambar, atau demonstrasi gerak",
        "Perekaman video pendek atau foto portofolio karya anak sebagai bukti capaian belajar",
      ],
      environmentDifferentiation: [
        "Menyediakan area karpet bebas dengan bantal penopang tubuh",
        "Memasang label visual bergambar pada semua kotak alat dan rak kelas",
      ],
      recommendedMediaAndTools: [
        {
          category: "Media Sensori & Regulasi",
          items: ["Sand timer 3 & 5 menit", "Wobble cushion / alas duduk dinamis", "Weighted lap pad ringan", "Fidget tool bertekstur"],
          usageGuidance: "Digunakan saat sesi menyimak cerita atau mengerjakan tugas meja.",
        },
        {
          category: "Media Visual & Komunikasi",
          items: ["Papan visual schedule magnetik", "Kartu ikon langkah pengerjaan (First-Then cards)", "Buku cerita pop-up raba"],
          usageGuidance: "Dipasang di sisi meja belajar anak untuk memandu alur mandiri.",
        },
        {
          category: "Media Pembelajaran Konkrit",
          items: ["Balok kayu geometri bertingkat", "Miniatur kendaraan & hewan raba", "Loose parts alami (batu kerikil, ranting, biji pinus)"],
          usageGuidance: "Sebagai media utama pembelajaran konsep numerasi dan literasi awal.",
        },
      ],
    },
    individualizedLearningPlan: {
      shortTermGoals: [
        `Mampu mengikuti 2 langkah instruksi bergambar secara mandiri saat kegiatan sentra.`,
        `Menggunakan timer visual untuk menyelesaikan transisi merapikan mainan dengan tenang.`,
        `Mengajak teman bermain bersama menggunakan kalimat pembuka atau kartu gambar.`,
      ],
      longTermGoals: [
        `Mengembangkan strategi regulasi diri mandiri saat mengalami kelelahan sensori.`,
        `Meningkatkan partisipasi aktif dalam diskusi lingkaran kelompok selama 15 menit dengan dukungan media raba.`,
      ],
      microActivities: [
        {
          title: "Misi Ekspedisi Balok & Peta Bergambar",
          targetDomain: "Atensi & Fleksibilitas Kognitif",
          duration: "15 Menit",
          objective: "Melatih daya konsentrasi, pengurutan langkah (sequencing), dan klasifikasi spasial.",
          materialsNeeded: ["Balok kayu aneka bentuk", "Kartu rancangan konstruksi bergambar", "Kranjang sortir"],
          stepByStepInstructions: [
            "Guru memperlihatkan kartu gambar 'Jembatan Bertingkat' dan mengajak anak mengamati bentuk balok.",
            "Anak mengambil balok sesuai warna dan ukuran yang tertera di kartu panduan.",
            "Anak menyusun struktur dan menceritakan bagaimana kendaraan dapat melintas di atasnya.",
            "Setelah selesai, anak menaruh stiker bintang pada lembar capaian mandirinya.",
          ],
          scaffoldingTactics: "Guru mendampingi di 2 balok pertama, lalu memfasilitasi anak menyelesaikan sisanya secara mandiri.",
          sensoryIntegrationTip: "Gunakan balok kayu dengan bobot solid untuk memberikan umpan balik proprioseptif yang mantap.",
          parentTeacherTip: "Beri pujian pada ketelitian anak daripada sekadar kecepatan menyelesaikan.",
        },
        {
          title: "Sirkuit Rintangan Huruf & Kata Bergerak",
          targetDomain: "Bahasa & Integrasi Motorik Kasar",
          duration: "20 Menit",
          objective: "Mengenal bunyi fonem dan kosa kata melalui jalur gerakan aktif.",
          materialsNeeded: ["Kartu huruf bergambar tebal", "Karpet puzzle busa", "Keranjang bola warna"],
          stepByStepInstructions: [
            "Susun karpet busa menyerupai jalan setapak di lantai kelas atau halaman.",
            "Anak melompat dari satu pulau karpet ke karpet berikutnya sambil menyebutkan gambar/huruf yang diinjak.",
            "Di ujung sirkuit, anak mengambil miniatur benda yang sesuai dan menaruhnya ke keranjang.",
          ],
          scaffoldingTactics: "Guru memperagakan satu putaran sambil melafalkan fonem secara berirama.",
          sensoryIntegrationTip: "Aktivitas melompat memberikan input vestibular dan proprioseptif yang menyegarkan konsentrasi.",
          parentTeacherTip: "Dapat dimainkan di rumah di lorong ruang keluarga menggunakan bantal lantai.",
        },
        {
          title: "Laboratorium Sains Raba & Eksplorasi Sebab-Akibat",
          targetDomain: "Pemrosesan Sensori & Penalaran Kognitif",
          duration: "15 Menit",
          objective: "Melatih toleransi taktil dan pemecahan masalah sederhana.",
          materialsNeeded: ["Wadah berisi beras warna/pasir kinetik", "Corong, sendok takar, roda putar mini"],
          stepByStepInstructions: [
            "Ajak anak menuang butiran beras ke corong untuk melihat roda berputar.",
            "Minta anak menebak berapa sendok yang dibutuhkan untuk mengisi tabung penuh.",
            "Diskusikan sensasi tekstur butiran pada telapak tangan.",
          ],
          scaffoldingTactics: "Bila anak ragu menyentuh langsung, sediakan sendok bergagang panjang terlebih dahulu.",
          sensoryIntegrationTip: "Sensasi raba butiran halus membantu menurunkan ketegangan emosi anak.",
          parentTeacherTip: "Lakukan sebelum jam istirahat atau saat anak mulai menunjukkan tanda-tanda gelisah.",
        },
      ],
      dailyRoutineRecommendations: [
        {
          timeframe: "08:00 - 08:30 (Kedatangan & Sambutan)",
          activityFocus: "Transisi Masuk & Heavy Work Ringan",
          neuroSensoryStrategy: "Ajak anak menaruh tas di loker berlabel foto diri dan bantu membawa kotak peralatan ringan.",
        },
        {
          timeframe: "08:30 - 09:15 (Sesi Pembelajaran Inti 1)",
          activityFocus: "Eksplorasi Konseptual Multisensori",
          neuroSensoryStrategy: "Gunakan meja sentra dengan media konkrit 3D; selipkan jeda regang tubuh 2 menit di menit ke-15.",
        },
        {
          timeframe: "09:15 - 09:45 (Istirahat & Bermain Bebas)",
          activityFocus: "Sosialisasi Kelompok Kecil / Parallel Play",
          neuroSensoryStrategy: "Sediakan pilihan area tenang bagi anak bila merasa lelah dengan kebisingan luar ruang.",
        },
        {
          timeframe: "09:45 - 10:30 (Sesi Inti 2 & Proyek Mandiri)",
          activityFocus: "Unjuk Kerja Diferensiasi Produk",
          neuroSensoryStrategy: "Berikan opsi unjuk karya berbasis gambar/bangun balok, dipandu kartu First-Then.",
        },
        {
          timeframe: "10:30 - 11:00 (Refleksi & Persiapan Pulang)",
          activityFocus: "Review Pengalaman & Penutupan Tenang",
          neuroSensoryStrategy: "Gunakan lagu penutup yang sama setiap hari dan papan visual capaian hari ini.",
        },
      ],
      evaluationRubric: [
        {
          indicator: "Menjaga fokus pada aktivitas terstruktur terarah",
          emerging: "Fokus 3-5 menit dengan bimbingan konstan pendamping",
          progressing: "Fokus 8-12 menit dengan panduan visual schedule mandiri",
          mastered: "Fokus >15 menit dan mampu menyelesaikan subtugas hingga tuntas",
        },
        {
          indicator: "Merespons transisi pergantian kegiatan kelas",
          emerging: "Memerlukan pendampingan fisik dan bujukan saat aktivitas berubah",
          progressing: "Merespons alarm timer pasir dengan sedikit pengingat verbal",
          mastered: "Secara mandiri merapikan alat saat visual schedule menunjukkan waktu selesai",
        },
        {
          indicator: "Interaksi dan kolaborasi bersama teman sebaya",
          emerging: "Bermain sendiri (solitary play) dan mengamati teman dari jarak jauh",
          progressing: "Bermain berdampingan (parallel play) dan berbagi alat mainan",
          mastered: "Menginisiasi percakapan atau proyek bersama dengan komunikasi ramah",
        },
      ],
      parentCollabStrategies: [
        "Terapkan jadwal visual harian yang serupa di rumah untuk rutinitas bangun tidur, makan, belajar, dan istirahat.",
        "Sediakan waktu 15 menit bermain lantai (floor-time) tanpa gadget bersama orang tua setiap sore.",
        "Berikan tugas rumah tangga bermakna yang melibatkan input sensori (membawa cucian kering, menyiram tanaman, mengaduk adonan kue).",
        "Lakukan koordinasi berkala mingguan antara orang tua dan guru melalui buku komunikasi refleksi positif.",
      ],
    },
  };
}

// Start server with Vite middleware or static serving
export async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Neuropsikologi Perkembangan Anak berjalan di http://0.0.0.0:${PORT}`);
  });
}

if (process.env.VERCEL !== "1") startServer();

export default app;
