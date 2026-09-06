import React, { useState } from 'react';
import { UserProfile, StudentMasterRecord, StudentAchievement, ServerAuditLog } from '../types';
import { DEFAULT_USERS } from '../data/mockStudentDatabase';
import {
  ShieldAlert,
  Trash2,
  RotateCcw,
  Download,
  Key,
  Users,
  Database,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  X,
  Server,
  Activity,
  History,
  Copy,
  Check
} from 'lucide-react';

interface ServerMasterDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  students: StudentMasterRecord[];
  achievements: StudentAchievement[];
  auditLogs: ServerAuditLog[];
  registeredUsers: UserProfile[];
  onRefreshUsers: () => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
  onPurgeUsers: () => Promise<void>;
  onPurgeAllDatabase: () => void;
  onResetToDefaultDatabase: () => void;
  onSelectUser: (user: UserProfile) => void;
}

export const ServerMasterDatabaseModal: React.FC<ServerMasterDatabaseModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  students,
  achievements,
  auditLogs,
  registeredUsers,
  onRefreshUsers,
  onDeleteUser,
  onPurgeUsers,
  onPurgeAllDatabase,
  onResetToDefaultDatabase,
  onSelectUser,
}) => {
  const [activeTab, setActiveTab] = useState<'control' | 'accounts' | 'users' | 'audit'>('control');
  const [confirmationInput, setConfirmationInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isSuperAdmin = currentUser.role === 'superadmin';
  const isServerRole = ['superadmin', 'kurikulum', 'psikolog', 'peneliti'].includes(currentUser.role);

  const togglePassword = (username: string) => {
    setShowPasswords((prev) => ({ ...prev, [username]: !prev[username] }));
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExecutePurge = () => {
    if (confirmationInput !== 'HAPUS-DATABASE-UTAMA') {
      alert('Teks konfirmasi tidak sesuai. Harap ketik "HAPUS-DATABASE-UTAMA" persis sesuai instruksi.');
      return;
    }
    onPurgeAllDatabase();
    setShowDeleteConfirm(false);
    setConfirmationInput('');
    setSuccessMessage('Seluruh database telah berhasil dikosongkan.');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleExecuteReset = () => {
    onResetToDefaultDatabase();
    setShowResetConfirm(false);
    setSuccessMessage('Database berhasil direset ke data master standar bawaan sistem.');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleExportJSON = () => {
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      exporter: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        roleLabel: currentUser.roleLabel,
      },
      systemStats: {
        totalStudents: students.length,
        totalAchievements: achievements.length,
      },
      database: {
        students,
        achievements,
        registeredUsers,
        auditLogs,
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup_database_master_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSuccessMessage('Berkas cadangan JSON berhasil diunduh ke komputer Anda.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div id="master-server-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] border border-[#E5DFD1] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#1F2937] text-white p-5 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-white">
                  Pusat Kontrol Server Utama & Master Database
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-rose-500 text-white rounded-full">
                  Root Admin
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Manajemen Server, Otoritas Lintas Akun, Kredensial Resmi & Tindakan Kritis Database
              </p>
            </div>
          </div>
          <button
            id="close-server-modal-btn"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E5DFD1] bg-[#F2EDE4] px-4 pt-2.5 gap-2 overflow-x-auto">
          <button
            id="tab-server-control"
            onClick={() => setActiveTab('control')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'control'
                ? 'bg-[#FAF7F2] text-[#1F2937] border-t-2 border-[#1F2937] shadow-xs'
                : 'text-[#6C6659] hover:text-[#1F2937]'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-rose-600" />
            <span>Kontrol Database & Tindakan Kritis</span>
          </button>
          <button
            id="tab-server-accounts"
            onClick={() => setActiveTab('accounts')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'accounts'
                ? 'bg-[#FAF7F2] text-[#1F2937] border-t-2 border-[#1F2937] shadow-xs'
                : 'text-[#6C6659] hover:text-[#1F2937]'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-blue-600" />
            <span>Daftar Akun & Username/Password</span>
          </button>
          <button
            id="tab-server-users"
            onClick={() => { setActiveTab('users'); onRefreshUsers().catch(() => undefined); }}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-[#FAF7F2] text-[#1F2937] border-t-2 border-[#1F2937] shadow-xs'
                : 'text-[#6C6659] hover:text-[#1F2937]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kelola Pengguna ({registeredUsers.length})</span>
          </button>
          <button
            id="tab-server-audit"
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-[#FAF7F2] text-[#1F2937] border-t-2 border-[#1F2937] shadow-xs'
                : 'text-[#6C6659] hover:text-[#1F2937]'
            }`}
          >
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>Log Audit Server ({auditLogs.length})</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="bg-emerald-100 border-b border-emerald-300 px-5 py-2.5 flex items-center gap-2 text-emerald-900 text-xs font-semibold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: KONTROL DATABASE */}
          {activeTab === 'control' && (
            <div className="space-y-6">
              {/* Server Stats Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6C6659] mb-3">
                  Ringkasan Volume Database Saat Ini
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white border border-[#E5DFD1] p-3.5 rounded-xl text-center">
                    <div className="text-2xl font-extrabold text-[#2A261F]">{students.length}</div>
                    <div className="text-xs text-[#6C6659] font-medium mt-0.5">Siswa Terdaftar</div>
                  </div>
                  <div className="bg-white border border-[#E5DFD1] p-3.5 rounded-xl text-center">
                    <div className="text-2xl font-extrabold text-amber-700">{achievements.length}</div>
                    <div className="text-xs text-[#6C6659] font-medium mt-0.5">Prestasi Tercatat</div>
                  </div>
                  <div className="bg-white border border-[#E5DFD1] p-3.5 rounded-xl text-center">
                    <div className="text-2xl font-extrabold text-emerald-700">
                      {students.filter((s) => s.hasObservation).length}
                    </div>
                    <div className="text-xs text-[#6C6659] font-medium mt-0.5">Asesmen Aktif</div>
                  </div>
                  <div className="bg-white border border-[#E5DFD1] p-3.5 rounded-xl text-center">
                    <div className="text-2xl font-extrabold text-blue-700">{registeredUsers.length + 1}</div>
                    <div className="text-xs text-[#6C6659] font-medium mt-0.5">Akun Otoritas</div>
                  </div>
                </div>
              </div>

              {/* Authority Status Card */}
              <div className="bg-[#EBF3EE] border border-[#2D5A43]/40 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2D5A43] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="text-xs text-[#2A261F] space-y-1">
                  <div className="font-bold text-sm text-[#2D5A43] flex items-center gap-2">
                    <span>Otoritas Sesi: {currentUser.name}</span>
                    <span className="px-2 py-0.5 bg-[#2D5A43] text-white rounded-md text-[10px]">
                      {currentUser.roleLabel}
                    </span>
                  </div>
                  <p className="text-[#5A554A]">
                    {isSuperAdmin
                      ? 'Anda memiliki hak akses Root Administrator. Anda diizinkan mengekspor data, meninjau akun lain, menghapus record individual, serta menghapus atau mereset seluruh database sistem.'
                      : isServerRole
                      ? 'Anda berada dalam mode Akun Server Spesialis. Anda berhak meninjau seluruh data lintas lembaga dan menghapus record yang tidak valid.'
                      : 'Akun Lembaga Pendidikan memiliki batasan maksimum 3 siswa dan tidak dapat melakukan penghapusan database massal.'}
                  </p>
                </div>
              </div>

              {/* Critical Actions Panel */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Tindakan Kritis Manajemen Database
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {/* Export Backup Card */}
                  <div className="bg-white border border-[#D8D2C5] rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2 text-[#245464] font-bold text-sm">
                        <Download className="w-4 h-4" /> Ekspor Backup JSON
                      </div>
                      <p className="text-xs text-[#6C6659] mt-1.5">
                        Unduh seluruh salinan cadangan data siswa, prestasi, dan asesmen dalam format JSON terenkripsi.
                      </p>
                    </div>
                    <button
                      id="btn-export-database-json"
                      onClick={handleExportJSON}
                      className="w-full py-2 bg-[#245464] hover:bg-[#1b3f4c] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh Cadangan JSON
                    </button>
                  </div>

                  {/* Reset to Default Card */}
                  <div className="bg-white border border-[#D8D2C5] rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                        <RotateCcw className="w-4 h-4" /> Reset Database Standar
                      </div>
                      <p className="text-xs text-[#6C6659] mt-1.5">
                        Memulihkan data master ke konfigurasi awal bawaan (siswa SMA, PAUD, SD, dan contoh kasus lengkap).
                      </p>
                    </div>
                    <button
                      id="btn-open-reset-confirm"
                      disabled={!isSuperAdmin && !isServerRole}
                      onClick={() => setShowResetConfirm(true)}
                      className={`w-full py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                        isSuperAdmin || isServerRole
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset ke Data Bawaan
                    </button>
                  </div>

                  {/* Purge All Database Card */}
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                        <Trash2 className="w-4 h-4 text-rose-600" /> Hapus Seluruh Database
                      </div>
                      <p className="text-xs text-rose-800/80 mt-1.5">
                        <strong>Tindakan Permanen:</strong> Mengosongkan seluruh tabel database siswa, prestasi, dan catatan observasi.
                      </p>
                    </div>
                    <button
                      id="btn-open-purge-confirm"
                      disabled={!isSuperAdmin}
                      onClick={() => setShowDeleteConfirm(true)}
                      className={`w-full py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                        isSuperAdmin
                          ? 'bg-rose-700 hover:bg-rose-800 text-white shadow-xs'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      title={!isSuperAdmin ? 'Hanya Akun Server Utama yang berwenang' : 'Hapus semua database'}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus Semua Database
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Confirmation for Purge All Database */}
              {showDeleteConfirm && (
                <div className="bg-rose-100 border-2 border-rose-400 rounded-xl p-4.5 space-y-3.5 animate-fadeIn">
                  <div className="flex items-center gap-2 text-rose-950 font-bold text-sm">
                    <ShieldAlert className="w-5 h-5 text-rose-700" />
                    Konfirmasi Keamanan: Hapus Seluruh Database Server
                  </div>
                  <p className="text-xs text-rose-900 leading-relaxed">
                    Tindakan ini akan <strong>menghapus secara permanen</strong> seluruh data ({students.length} siswa,{' '}
                    {achievements.length} catatan prestasi). Untuk melanjutkan, ketik teks konfirmasi di bawah:
                  </p>
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono font-bold text-rose-950 bg-rose-200/80 px-2.5 py-1 rounded inline-block">
                      HAPUS-DATABASE-UTAMA
                    </div>
                    <input
                      type="text"
                      id="input-purge-confirmation"
                      value={confirmationInput}
                      onChange={(e) => setConfirmationInput(e.target.value)}
                      placeholder="Ketik HAPUS-DATABASE-UTAMA di sini"
                      className="w-full px-3 py-2 text-sm bg-white border border-rose-300 rounded-lg text-rose-950 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setConfirmationInput('');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-white border border-rose-200 text-rose-900 rounded-lg hover:bg-rose-50"
                    >
                      Batal
                    </button>
                    <button
                      id="btn-confirm-purge-execute"
                      onClick={handleExecutePurge}
                      disabled={confirmationInput !== 'HAPUS-DATABASE-UTAMA'}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                        confirmationInput === 'HAPUS-DATABASE-UTAMA'
                          ? 'bg-rose-800 hover:bg-rose-900 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eksekusi Pengosongan Database
                    </button>
                  </div>
                </div>
              )}

              {/* Modal Confirmation for Reset */}
              {showResetConfirm && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                    <RotateCcw className="w-5 h-5 text-amber-600" />
                    Konfirmasi Reset ke Master Database Bawaan
                  </div>
                  <p className="text-xs text-amber-900">
                    Sistem akan memuat kembali sampel data siswa standar PAUD, SD, SMP, SMA beserta portofolio prestasinya.
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1.5 text-xs font-semibold bg-white border border-amber-200 text-amber-900 rounded-lg hover:bg-amber-100"
                    >
                      Batal
                    </button>
                    <button
                      id="btn-confirm-reset-execute"
                      onClick={handleExecuteReset}
                      className="px-4 py-1.5 text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Konfirmasi Reset Data Bawaan
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DAFTAR AKUN, USERNAME & PASSWORD RESMI */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#2A261F]">
                    Katalog Kredensial Akun Server & Lembaga Resmi
                  </h4>
                  <p className="text-xs text-[#6C6659]">
                    Gunakan username dan password berikut untuk login sesuai wewenang peran:
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {DEFAULT_USERS.map((user) => {
                  const isVisible = showPasswords[user.username];
                  const isCurrent = currentUser.id === user.id;

                  return (
                    <div
                      key={user.id}
                      id={`account-card-${user.username}`}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-[#EBF3EE] border-[#2D5A43] ring-1 ring-[#2D5A43]'
                          : 'bg-white border-[#E5DFD1] hover:border-[#2D5A43]/50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-11 h-11 rounded-full object-cover border border-[#E5DFD1] mt-0.5 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-sm text-[#2A261F]">{user.name}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  user.badgeColor || 'bg-gray-800 text-white'
                                }`}
                              >
                                {user.roleLabel}
                              </span>
                              {user.studentLimit && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                  Batas: {user.studentLimit} Anak
                                </span>
                              )}
                              {isCurrent && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                                  Akun Anda Saat Ini
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#6C6659] mt-1">{user.description}</p>
                          </div>
                        </div>

                        {/* Action switch button */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            id={`btn-switch-to-${user.username}`}
                            onClick={() => {
                              setSuccessMessage(`Akun ${user.username} ditampilkan untuk peninjauan. Login tetap wajib untuk mengganti sesi.`);
                              setTimeout(() => setSuccessMessage(null), 3000);
                            }}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                              isCurrent
                                ? 'bg-[#2D5A43] text-white'
                                : 'bg-[#F2EDE4] hover:bg-[#2D5A43] hover:text-white text-[#2D5A43]'
                            }`}
                          >
                            {isCurrent ? 'Aktif' : 'Login Sebagai Akun Ini'}
                          </button>
                        </div>
                      </div>

                      {/* Credentials Display Box */}
                      <div className="mt-3 pt-3 border-t border-[#E5DFD1] grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#FAF7F2] p-2.5 rounded-lg text-xs">
                        <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded border border-[#E5DFD1]">
                          <span className="text-[#6C6659] font-medium">Username:</span>
                          <div className="flex items-center gap-1.5">
                            <code className="font-mono font-bold text-[#2A261F]">{user.username}</code>
                            <button
                              onClick={() => copyToClipboard(user.username, `u-${user.username}`)}
                              className="text-gray-400 hover:text-gray-700 p-1"
                              title="Salin Username"
                            >
                              {copiedKey === `u-${user.username}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded border border-[#E5DFD1]">
                          <span className="text-[#6C6659] font-medium">Password:</span>
                          <div className="flex items-center gap-1.5">
                            <code className="font-mono font-bold text-rose-800">
                              {isVisible ? user.password : '••••••••••••'}
                            </code>
                            <button
                              onClick={() => togglePassword(user.username)}
                              className="text-gray-400 hover:text-gray-700 p-1"
                              title={isVisible ? 'Sembunyikan' : 'Tampilkan'}
                            >
                              {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(user.password || '', `p-${user.username}`)}
                              className="text-gray-400 hover:text-gray-700 p-1"
                              title="Salin Password"
                            >
                              {copiedKey === `p-${user.username}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: KELOLA PENGGUNA */}
          {activeTab === 'users' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-[#2A261F]">Akun Pengguna Terdaftar</h4>
                  <p className="text-xs text-[#6C6659]">Hanya Server Utama yang dapat menghapus akun satu per satu atau seluruh akun terdaftar.</p>
                </div>
                {isSuperAdmin && registeredUsers.length > 0 && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm('Hapus SEMUA akun pengguna terdaftar? Tindakan ini permanen.')) return;
                      try {
                        await onPurgeUsers();
                        setSuccessMessage('Seluruh akun pengguna berhasil dihapus.');
                      } catch (e:any) { alert(e?.message || 'Gagal menghapus akun.'); }
                    }}
                    className="px-3 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus Semua Akun
                  </button>
                )}
              </div>

              {!isSuperAdmin ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  Menu ini terkunci. Hak penghapusan akun pengguna hanya dimiliki Server Utama.
                </div>
              ) : registeredUsers.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#8D887B] bg-white border border-[#E5DFD1] rounded-xl">
                  Belum ada akun pengguna terdaftar.
                </div>
              ) : (
                <div className="space-y-2">
                  {registeredUsers.map((user) => (
                    <div key={user.id} className="bg-white border border-[#E5DFD1] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-sm text-[#2A261F]">{user.name}</div>
                        <div className="text-xs text-[#6C6659]">@{user.username} · {user.roleLabel}</div>
                        <div className="text-[11px] text-[#8D887B]">{user.institutionName}{user.joinedDate ? ` · ${user.joinedDate}` : ''}</div>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!window.confirm(`Hapus akun @${user.username}? Tindakan ini permanen.`)) return;
                          try {
                            await onDeleteUser(user.id);
                            setSuccessMessage(`Akun @${user.username} berhasil dihapus.`);
                          } catch (e:any) { alert(e?.message || 'Gagal menghapus akun.'); }
                        }}
                        className="px-3 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LOG AUDIT SERVER */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#2A261F]">Riwayat Log Aktivitas & Penghapusan Server</h4>
                  <p className="text-xs text-[#6C6659]">
                    Semua aktivitas peninjauan akun, penghapusan record, dan reset database dicatat secara kronologis:
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {auditLogs.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#8D887B] bg-white border border-[#E5DFD1] rounded-xl">
                    Belum ada riwayat aktivitas log server.
                  </div>
                ) : (
                  auditLogs.map((log) => (
                    <div
                      key={log.id}
                      id={`log-item-${log.id}`}
                      className="p-3.5 bg-white border border-[#E5DFD1] rounded-xl flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            log.actionType === 'PURGE_ALL_DATABASE' || log.actionType === 'DELETE_STUDENT'
                              ? 'bg-rose-100 text-rose-700'
                              : log.actionType === 'RESET_DATABASE'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#2A261F]">{log.actionType}</span>
                            <span className="text-[10px] px-2 py-0.2 bg-[#F2EDE4] text-[#4A453A] font-semibold rounded">
                              {log.actorName} ({log.actorRole})
                            </span>
                          </div>
                          <p className="text-[#5A554A] mt-1">{log.targetDetails}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-[#8D887B] font-mono">{log.timestamp}</span>
                        <div className="mt-0.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            {log.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F2EDE4] border-t border-[#E5DFD1] flex items-center justify-between text-xs text-[#6C6659]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>
              Server ID: <strong>NP-SRV-JKT-01</strong> • Status: <strong>Online & Terproteksi</strong>
            </span>
          </div>
          <button
            id="btn-close-server-modal-bottom"
            onClick={onClose}
            className="px-4 py-2 bg-[#2D5A43] hover:bg-[#234735] text-white rounded-xl font-bold shadow-xs transition-colors"
          >
            Tutup Panel Server
          </button>
        </div>
      </div>
    </div>
  );
};
