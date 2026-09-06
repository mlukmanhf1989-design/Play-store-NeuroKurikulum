import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEFAULT_USERS } from '../data/mockStudentDatabase';
import {
  LogIn,
  UserCheck,
  Shield,
  GraduationCap,
  Users,
  CheckCircle2,
  Key,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  Server,
  BookOpen,
  Brain,
  Microscope,
  Building2,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  FileBadge,
  School,
  Compass
} from 'lucide-react';

interface LoginPortalViewProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onAuthenticate?: (username: string, password: string) => Promise<void>;
  onRegister?: (input: { name: string; username: string; password: string; token: string; role: UserRole; city?: string }) => Promise<void>;
  onNavigateToAssessment: () => void;
  onOpenMasterControl?: () => void;
}

export const LoginPortalView: React.FC<LoginPortalViewProps> = ({
  currentUser,
  onSelectUser,
  onAuthenticate,
  onRegister,
  onNavigateToAssessment,
  onOpenMasterControl,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'directory' | 'register' | 'security'>('login');

  // Login form state
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Custom User / Register State
  const [customName, setCustomName] = useState('');
  const [customUsername, setCustomUsername] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [customToken, setCustomToken] = useState('');
  const [customRole, setCustomRole] = useState<UserRole>('lembaga');
  const [customCity, setCustomCity] = useState('');

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      if (onAuthenticate) {
        await onAuthenticate(inputUsername.trim(), inputPassword);
        setSuccessNotice('Login berhasil. Sesi aman telah dibuat.');
      } else {
        const user = DEFAULT_USERS.find((u) => u.username.toLowerCase() === inputUsername.trim().toLowerCase() && u.password === inputPassword);
        if (!user) throw new Error('Username atau password salah.');
        onSelectUser(user);
        setSuccessNotice(`Login berhasil sebagai ${user.roleLabel}.`);
      }
    } catch (error: any) {
      setErrorMessage(error?.message || 'Username atau password salah.');
    }
  };

  const handleQuickFill = (user: UserProfile) => {
    setInputUsername(user.username);
    setInputPassword(user.password || '');
    setErrorMessage(null);
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCustomRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      if (onRegister) {
        await onRegister({
          name: customName.trim(),
          username: customUsername.trim(),
          password: customPassword,
          token: customToken,
          role: customRole,
          city: customCity.trim(),
        });
      } else {
        throw new Error('Layanan registrasi belum terhubung ke server.');
      }
      setSuccessNotice('Registrasi berhasil dan akun telah login.');
      setCustomName('');
      setCustomUsername('');
      setCustomPassword('');
      setCustomToken('');
      setCustomCity('');
    } catch (error: any) {
      setErrorMessage(error?.message || 'Registrasi gagal.');
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return <Server className="w-5 h-5 text-rose-600" />;
      case 'kurikulum':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'psikolog':
        return <Brain className="w-5 h-5 text-purple-600" />;
      case 'peneliti':
        return <Microscope className="w-5 h-5 text-teal-600" />;
      case 'lembaga':
        return <Building2 className="w-5 h-5 text-amber-600" />;
      case 'guru':
        return <UserCheck className="w-5 h-5 text-[#2D5A43]" />;
      default:
        return <Shield className="w-5 h-5 text-gray-600" />;
    }
  };

  const isServerRole = ['superadmin', 'kurikulum', 'psikolog', 'peneliti'].includes(currentUser.role);
  const isSuperAdmin = currentUser.role === 'superadmin';

  return (
    <div id="login-portal-view" className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-[#FAF7F2] border border-[#E5DFD1] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2D5A43]/10 text-[#2D5A43] rounded-full text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Sistem Manajemen Akses & Autentikasi Pengguna</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A261F] tracking-tight">
              Menu Login & Autentikasi Peran
            </h2>
            <p className="text-xs sm:text-sm text-[#6C6659] max-w-3xl leading-relaxed">
              Aplikasi Kurikulum Berbasis Neuropsikologi menerapkan kontrol akses berjenjang (*Role-Based Access Control*).
              Akun Lembaga Pendidikan dibatasi maksimal 3 siswa mandiri, sedangkan Akun Server Spesialis memiliki otoritas kurasi kurikulum dan peninjauan lintas akun.
            </p>
          </div>

          {/* Active User Card in Header */}
          <div className="bg-white border border-[#D8D2C5] rounded-xl p-4 shadow-2xs shrink-0 flex items-center gap-3.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-xl object-cover border border-[#2D5A43]"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-bold text-[#2D5A43] uppercase tracking-wider">
                  Sesi Sedang Aktif
                </span>
              </div>
              <div className="font-serif font-bold text-sm text-[#2A261F]">{currentUser.name}</div>
              <div className="text-xs text-[#6C6659]">{currentUser.roleLabel}</div>
              {currentUser.studentLimit && (
                <div className="text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1 inline-block">
                  Batas Kuota: {currentUser.studentLimit} Siswa
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Success / Error notifications */}
        {successNotice && (
          <div className="mt-5 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 text-emerald-900 text-xs sm:text-sm font-semibold animate-fadeIn shadow-2xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
            <button
              onClick={onNavigateToAssessment}
              className="px-3 py-1.5 bg-[#2D5A43] hover:bg-[#234735] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0"
            >
              Mulai Observasi <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mt-5 p-4 bg-rose-50 border border-rose-300 rounded-xl flex items-center gap-2.5 text-rose-900 text-xs sm:text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-[#E5DFD1] bg-[#F2EDE4] px-4 pt-2 gap-2 overflow-x-auto rounded-t-2xl">
        <button
          id="portal-tab-login"
          onClick={() => setActiveTab('login')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'login'
              ? 'bg-white text-[#1F2937] border-t-2 border-[#2D5A43] shadow-xs'
              : 'text-[#6C6659] hover:text-[#1F2937]'
          }`}
        >
          <Lock className="w-4 h-4 text-[#2D5A43]" />
          <span>Form Login Pengguna</span>
        </button>

        <button
          id="portal-tab-directory"
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-white text-[#1F2937] border-t-2 border-[#2D5A43] shadow-xs'
              : 'text-[#6C6659] hover:text-[#1F2937]'
          }`}
        >
          <Key className="w-4 h-4 text-blue-600" />
          <span>Daftar Akun & Password Resmi</span>
        </button>

        <button
          id="portal-tab-register"
          onClick={() => setActiveTab('register')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'register'
              ? 'bg-white text-[#1F2937] border-t-2 border-[#2D5A43] shadow-xs'
              : 'text-[#6C6659] hover:text-[#1F2937]'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-600" />
          <span>Registrasi Lembaga Baru</span>
        </button>

        <button
          id="portal-tab-security"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-white text-[#1F2937] border-t-2 border-[#2D5A43] shadow-xs'
              : 'text-[#6C6659] hover:text-[#1F2937]'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-purple-600" />
          <span>Kebijakan Otoritas & Keamanan</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-white border border-[#E5DFD1] rounded-b-2xl p-6 sm:p-8 shadow-sm">
        {/* TAB 1: FORM LOGIN */}
        {activeTab === 'login' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form */}
            <div className="lg:col-span-6 space-y-6">
              <div className="border-b border-[#E5DFD1] pb-3">
                <h3 className="text-lg font-serif font-bold text-[#2A261F]">Masuk ke Sesi Terotentikasi</h3>
                <p className="text-xs text-[#6C6659] mt-0.5">
                  Gunakan kredensial akun server atau lembaga Anda untuk mengakses fitur sistem.
                </p>
              </div>

              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453A] mb-1.5">
                    Username / ID Pengguna *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="input-portal-username"
                      required
                      value={inputUsername}
                      onChange={(e) => setInputUsername(e.target.value)}
                      placeholder="Contoh: server_utama, lembaga_sekolah, kurikulum_pusat"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF7F2] border border-[#D8D2C5] rounded-xl text-[#2A261F] font-mono focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                    <LogIn className="w-4 h-4 text-[#8D887B] absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A453A] mb-1.5">
                    Password / Kata Sandi Terenkripsi *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="input-portal-password"
                      required
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      className="w-full pl-10 pr-11 py-2.5 text-sm bg-[#FAF7F2] border border-[#D8D2C5] rounded-xl text-[#2A261F] font-mono focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                    <Lock className="w-4 h-4 text-[#8D887B] absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-[#8D887B] hover:text-[#2A261F]"
                      title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    id="btn-portal-submit-login"
                    className="flex-1 bg-[#1F2937] hover:bg-black text-white font-bold text-sm py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-emerald-400" />
                    <span>Masuk ke Akun Ini</span>
                  </button>

                  <button
                    type="button"
                    onClick={onNavigateToAssessment}
                    className="px-4 py-3 bg-[#FAF7F2] hover:bg-[#E5DFD1] text-[#4A453A] font-semibold text-xs rounded-xl border border-[#D8D2C5] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Lanjutkan Observasi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Master Control quick launcher if server */}
              {isServerRole && onOpenMasterControl && (
                <div className="p-4 bg-[#1F2937] text-white rounded-xl flex items-center justify-between gap-3 border border-gray-700">
                  <div className="flex items-center gap-2.5 text-xs">
                    <Server className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white">Akses Panel Server Utama Terbuka</div>
                      <div className="text-gray-300 text-[11px]">Audit data & kontrol penghapusan aktif</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenMasterControl}
                    className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs shrink-0"
                  >
                    Buka Panel Server
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Quick Role Presets */}
            <div className="lg:col-span-6 space-y-4 lg:border-l lg:border-[#E5DFD1] lg:pl-8">
              <div className="flex items-center justify-between border-b border-[#E5DFD1] pb-3">
                <div>
                  <h4 className="text-sm font-serif font-bold text-[#2A261F]">Pilih Cepat Peran Resmi (Quick-Fill)</h4>
                  <p className="text-xs text-[#6C6659]">Klik salah satu peran untuk mengisi formulir otomatis:</p>
                </div>
                <span className="text-[10px] font-bold text-[#2D5A43] bg-[#EBF3EE] px-2 py-1 rounded-md border border-[#2D5A43]/30">
                  5 Profil Terverifikasi
                </span>
              </div>

              <div className="space-y-2.5">
                {DEFAULT_USERS.slice(0, 5).map((user) => {
                  const isCurrent = currentUser.id === user.id;
                  const isFilled = inputUsername === user.username;

                  return (
                    <div
                      key={user.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-[#EBF3EE] border-[#2D5A43] ring-1 ring-[#2D5A43]'
                          : isFilled
                          ? 'bg-blue-50/60 border-blue-300'
                          : 'bg-[#FAF7F2] border-[#E5DFD1] hover:bg-white hover:border-[#2D5A43]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white border border-[#E5DFD1] flex items-center justify-center shrink-0">
                          {getRoleIcon(user.role)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#2A261F] flex items-center gap-2">
                            <span>{user.name.split('(')[0].trim()}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 bg-[#2D5A43] text-white text-[9px] font-bold rounded">
                                Sedang Aktif
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#6C6659] flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[#2D5A43] font-bold">{user.username}</span>
                            <span>•</span>
                            <span className="text-[#8D887B]">{user.roleLabel.split('&')[0]}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleQuickFill(user)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white hover:bg-[#FAF7F2] text-[#4A453A] border border-[#D8D2C5] transition-colors"
                          title="Isi form dengan akun ini"
                        >
                          Isi Form
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectUser(user);
                            setSuccessNotice(`Beralih ke akun ${user.name}`);
                            setTimeout(() => setSuccessNotice(null), 3000);
                          }}
                          className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                            isCurrent
                              ? 'bg-[#2D5A43] text-white'
                              : 'bg-[#2D5A43] text-white hover:bg-[#234735]'
                          }`}
                        >
                          {isCurrent ? 'Aktif' : 'Gunakan Langsung'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DAFTAR AKUN & PASSWORD RESMI */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs sm:text-sm text-blue-950 flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Buku Direktori Kredensial Resmi Platform</p>
                <p className="text-xs text-blue-900 mt-1 leading-relaxed">
                  Tabel berikut merangkum seluruh kredensial akun server, pengembang kurikulum, psikolog klinis, peneliti, dan akun lembaga pendidikan. Anda dapat langsung mengklik tombol "Gunakan Akun" atau menyalin (*copy*) kredensial untuk kebutuhan dokumentasi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEFAULT_USERS.map((user) => {
                const isCurrent = currentUser.id === user.id;

                return (
                  <div
                    key={user.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-[#EBF3EE] border-[#2D5A43] ring-1 ring-[#2D5A43]'
                        : 'bg-[#FAF7F2] border-[#E5DFD1] hover:bg-white hover:border-[#2D5A43]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DFD1] flex items-center justify-center shrink-0">
                            {getRoleIcon(user.role)}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#2A261F]">{user.name}</div>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  user.badgeColor || 'bg-gray-800 text-white'
                                }`}
                              >
                                {user.roleLabel}
                              </span>
                              {user.studentLimit && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                  Batas: {user.studentLimit} Siswa
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setInputUsername(user.username);
                            setActiveTab('login');
                            setSuccessNotice(`Username ${user.username} dipilih. Masukkan password untuk autentikasi.`);
                          }}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors shrink-0 ${
                            isCurrent
                              ? 'bg-[#2D5A43] text-white'
                              : 'bg-white hover:bg-[#2D5A43] hover:text-white text-[#2D5A43] border border-[#2D5A43]/40'
                          }`}
                        >
                          {isCurrent ? 'Aktif' : 'Gunakan Akun'}
                        </button>
                      </div>

                      <p className="text-xs text-[#6C6659] mt-3 leading-relaxed">
                        {user.description}
                      </p>
                    </div>

                    {/* Credentials box */}
                    <div className="mt-4 pt-3 border-t border-[#E5DFD1] grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-[#E5DFD1]">
                        <span className="text-[#8D887B] text-[11px]">User:</span>
                        <div className="flex items-center gap-1">
                          <code className="font-mono font-bold text-[#2A261F]">{user.username}</code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(user.username, `dir-u-${user.username}`)}
                            className="text-gray-400 hover:text-gray-700"
                            title="Salin username"
                          >
                            {copiedKey === `dir-u-${user.username}` ? (
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

        {/* TAB 3: REGISTRASI LEMBAGA BARU */}
        {activeTab === 'register' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
              <Building2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Registrasi Akun Baru</p>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                  Registrasi membutuhkan token rahasia yang hanya diberikan oleh administrator. Token diproses di server dan tidak disimpan di browser.
                </p>
              </div>
            </div>
            <form onSubmit={handleCustomRegister} className="space-y-4 bg-[#FAF7F2] p-6 rounded-2xl border border-[#E5DFD1]">
              <div>
                <label className="block text-xs font-bold text-[#4A453A] mb-1.5">Nama Lembaga / Peneliti / Psikolog *</label>
                <input type="text" required value={customName} onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Contoh: SMA Cendekia / Dr. Nama Peneliti / Psikolog Nama"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453A] mb-1.5">Username *</label>
                  <input type="text" required minLength={4} maxLength={32} value={customUsername} onChange={(e) => setCustomUsername(e.target.value)}
                    placeholder="username_anda"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A453A] mb-1.5">Password *</label>
                  <input type="password" required minLength={8} value={customPassword} onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453A] mb-1.5">Peran *</label>
                  <select value={customRole} onChange={(e) => setCustomRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F]">
                    <option value="lembaga">Lembaga Pendidikan</option>
                    <option value="peneliti">Peneliti</option>
                    <option value="psikolog">Psikolog</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A453A] mb-1.5">Kota / Wilayah</label>
                  <input type="text" value={customCity} onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="Opsional"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A453A] mb-1.5">Token Registrasi Rahasia *</label>
                <input type="password" required value={customToken} onChange={(e) => setCustomToken(e.target.value)}
                  placeholder="Masukkan token yang diberikan administrator"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]" />
              </div>
              <button type="submit" id="btn-portal-submit-register"
                className="w-full bg-[#2D5A43] hover:bg-[#234735] text-white font-bold text-sm py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2">
                <Building2 className="w-4 h-4" /> Daftar & Login
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: KEBIJAKAN OTORITAS & KEAMANAN */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-[#FAF7F2] border border-[#E5DFD1] rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#2A261F]">Akun Lembaga Pendidikan</h4>
                <ul className="text-xs text-[#6C6659] space-y-1.5 list-disc list-inside">
                  <li>Batas kuota ketat: <strong>Maksimal 3 Siswa</strong> aktif.</li>
                  <li>Input observasi 5 langkah perkembangan.</li>
                  <li>Mencatat rekam prestasi & pemetaan bakat.</li>
                  <li>Melihat analisis rekomendasi program studi SMA.</li>
                  <li>Tidak dapat mengakses database akun lembaga lain.</li>
                </ul>
              </div>

              <div className="p-5 bg-[#FAF7F2] border border-[#E5DFD1] rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-800">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#2A261F]">Akun Server Spesialis</h4>
                <ul className="text-xs text-[#6C6659] space-y-1.5 list-disc list-inside">
                  <li><strong>Pengembang Kurikulum, Psikolog & Peneliti</strong>.</li>
                  <li>Akses peninjauan database seluruh siswa lintas akun.</li>
                  <li>Hak kurasi dan penghapusan data yang tidak valid.</li>
                  <li>Akses log audit aktivitas server secara real-time.</li>
                  <li>Tidak dibatasi kuota 3 siswa.</li>
                </ul>
              </div>

              <div className="p-5 bg-[#1F2937] text-white border border-gray-700 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-900/60 border border-rose-500 flex items-center justify-center text-rose-300">
                  <Server className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-base text-white">Akun Server Utama (Root)</h4>
                <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                  <li>Otoritas tertinggi administrasi platform.</li>
                  <li>Fitur <strong>Purge / Hapus Total Seluruh Database</strong>.</li>
                  <li>Fitur <strong>Reset ke Konfigurasi Default</strong>.</li>
                  <li>Fitur <strong>Ekspor Cadangan Database (JSON)</strong>.</li>
                  <li>Pengawasan penuh integritas sistem dan kepatuhan data.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
