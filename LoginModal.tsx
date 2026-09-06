import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEFAULT_USERS } from '../data/mockStudentDatabase';
import {
  LogIn,
  UserCheck,
  Shield,
  GraduationCap,
  Users,
  HeartHandshake,
  CheckCircle2,
  X,
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
  Check
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onSelectUser: (user: UserProfile) => void;
  onAuthenticate?: (username: string, password: string) => Promise<void>;
  onRegister?: (input: { name: string; username: string; password: string; token: string; role: UserRole; city?: string }) => Promise<void>;
  onOpenMasterControl?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSelectUser,
  onAuthenticate,
  onRegister,
  onOpenMasterControl,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'directory' | 'custom'>('login');
  
  // Login form state
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Custom User State
  const [customName, setCustomName] = useState('');
  const [customUsername, setCustomUsername] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [customToken, setCustomToken] = useState('');
  const [customRole, setCustomRole] = useState<UserRole>('lembaga');
  const [customCity, setCustomCity] = useState('');

  if (!isOpen) return null;

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      if (onAuthenticate) await onAuthenticate(inputUsername.trim(), inputPassword);
      else {
        const user = DEFAULT_USERS.find((u) => u.username.toLowerCase() === inputUsername.trim().toLowerCase() && u.password === inputPassword);
        if (!user) throw new Error('Username atau password salah.');
        onSelectUser(user);
      }
      setSuccessNotice('Login berhasil. Sesi aman telah dibuat.');
      setTimeout(() => { setSuccessNotice(null); onClose(); }, 800);
    } catch (error:any) {
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

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      if (!onRegister) throw new Error('Layanan registrasi belum terhubung ke server.');
      await onRegister({
        name: customName.trim(),
        username: customUsername.trim(),
        password: customPassword,
        token: customToken,
        role: customRole,
        city: customCity.trim(),
      });
      setSuccessNotice('Registrasi berhasil dan akun telah login.');
      setTimeout(() => { setSuccessNotice(null); onClose(); }, 800);
    } catch (error:any) {
      setErrorMessage(error?.message || 'Registrasi gagal.');
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return <Server className="w-4 h-4 text-rose-600" />;
      case 'kurikulum':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'psikolog':
        return <Brain className="w-4 h-4 text-purple-600" />;
      case 'peneliti':
        return <Microscope className="w-4 h-4 text-teal-600" />;
      case 'lembaga':
        return <Building2 className="w-4 h-4 text-amber-600" />;
      case 'guru':
        return <UserCheck className="w-4 h-4 text-[#2D5A43]" />;
      default:
        return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div id="login-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] border border-[#E5DFD1] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#1F2937] text-white p-5 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Key className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">Menu Login & Autentikasi Peran</h3>
              <p className="text-xs text-gray-300">
                Akses Terproteksi Lembaga Pendidikan, Pengembang Kurikulum, Psikolog, Peneliti & Server Utama
              </p>
            </div>
          </div>
          <button
            id="close-login-modal-btn"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#E5DFD1] bg-[#F2EDE4] px-4 pt-3 gap-2 overflow-x-auto">
          <button
            id="tab-login-form"
            onClick={() => setActiveTab('login')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-[#FAF7F2] text-[#1F2937] border-t-2 border-[#1F2937] shadow-xs'
                : 'text-[#6C6659] hover:text-[#1F2937]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#2D5A43]" />
            <span>Form Login (Username & Password)</span>
          </button>
          <button
            id="tab-directory"
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'directory'
                ? 'bg-[#FAF7F2] text-[#1F2937] border-t-2 border-[#1F2937] shadow-xs'
                : 'text-[#6C6659] hover:text-[#1F2937]'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-blue-600" />
            <span>Daftar Akun & Password Resmi</span>
          </button>
          <button
            id="tab-custom-account"
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'custom'
                ? 'bg-[#FAF7F2] text-[#1F2937] border-t-2 border-[#1F2937] shadow-xs'
                : 'text-[#6C6659] hover:text-[#1F2937]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Registrasi Akun Lembaga Baru</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: FORM LOGIN DENGAN USERNAME & PASSWORD */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              {/* Error & Success Feedback */}
              {errorMessage && (
                <div className="bg-rose-100 border border-rose-300 text-rose-900 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successNotice && (
                <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successNotice}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handlePasswordLogin} className="space-y-4 bg-white p-5 rounded-2xl border border-[#E5DFD1] shadow-xs">
                <div>
                  <label className="block text-xs font-bold text-[#4A453A] mb-1.5">
                    Username / ID Pengguna *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="input-login-username"
                      required
                      value={inputUsername}
                      onChange={(e) => setInputUsername(e.target.value)}
                      placeholder="Contoh: server_utama, lembaga_sekolah, kurikulum_pusat"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-[#FAF7F2] border border-[#D8D2C5] rounded-xl text-[#2A261F] font-mono focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                    <LogIn className="w-4 h-4 text-[#8D887B] absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A453A] mb-1.5">
                    Password / Kata Sandi Terenkripsi *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="input-login-password"
                      required
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      className="w-full pl-9 pr-10 py-2.5 text-sm bg-[#FAF7F2] border border-[#D8D2C5] rounded-xl text-[#2A261F] font-mono focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
                    />
                    <Lock className="w-4 h-4 text-[#8D887B] absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#8D887B] hover:text-[#2A261F]"
                      title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-submit-login-credentials"
                  className="w-full bg-[#1F2937] hover:bg-black text-white font-bold text-sm py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" /> Masuk ke Sesi Terotentikasi
                </button>
              </form>

              {/* Quick Fill Preset Buttons */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6C6659]">
                    Pilih Cepat Kredensial Peran (Quick-Fill):
                  </span>
                  <span className="text-[11px] text-[#8D887B]">Klik untuk mengisi otomatis</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEFAULT_USERS.slice(0, 5).map((user) => {
                    const isFilled = inputUsername === user.username;
                    return (
                      <button
                        key={user.id}
                        type="button"
                        id={`quickfill-btn-${user.username}`}
                        onClick={() => handleQuickFill(user)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isFilled
                            ? 'bg-[#EBF3EE] border-[#2D5A43] ring-1 ring-[#2D5A43]'
                            : 'bg-white border-[#E5DFD1] hover:bg-[#FAF7F2] hover:border-[#2D5A43]/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E5DFD1] flex items-center justify-center shrink-0">
                            {getRoleIcon(user.role)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#2A261F] flex items-center gap-1.5">
                              <span>{user.name.split('(')[0].trim()}</span>
                            </div>
                            <div className="text-[10px] text-[#6C6659]">
                              <code className="font-mono text-[#2D5A43] font-bold">{user.username}</code>
                              {user.studentLimit && (
                                <span className="ml-1 px-1 bg-amber-100 text-amber-800 rounded font-semibold">
                                  Maks 3
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#2D5A43] bg-white px-2 py-1 rounded-md border border-[#E5DFD1]">
                          Isi
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DAFTAR AKUN & PASSWORD RESMI */}
          {activeTab === 'directory' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  Berikut adalah daftar akun server dan lembaga yang telah terdaftar dalam sistem. Anda dapat menyalin kredensial atau langsung mengaktifkan akun tersebut.
                </p>
              </div>

              <div className="space-y-3">
                {DEFAULT_USERS.map((user) => {
                  const isCurrent = currentUser.id === user.id;

                  return (
                    <div
                      key={user.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-[#EBF3EE] border-[#2D5A43]'
                          : 'bg-white border-[#E5DFD1] hover:border-[#2D5A43]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5DFD1] flex items-center justify-center shrink-0">
                            {getRoleIcon(user.role)}
                          </div>
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
                                  Batas: {user.studentLimit} Siswa
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#6C6659] mt-1">{user.description}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setInputUsername(user.username);
                            setActiveTab('login');
                          }}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors shrink-0 ${
                            isCurrent
                              ? 'bg-[#2D5A43] text-white'
                              : 'bg-[#F2EDE4] hover:bg-[#2D5A43] hover:text-white text-[#2D5A43]'
                          }`}
                        >
                          {isCurrent ? 'Aktif' : 'Gunakan'}
                        </button>
                      </div>

                      {/* Credentials Row */}
                      <div className="mt-3 pt-2.5 border-t border-[#E5DFD1] grid grid-cols-2 gap-2 text-xs bg-[#FAF7F2] p-2 rounded-lg">
                        <div className="flex items-center justify-between bg-white px-2.5 py-1 rounded border border-[#E5DFD1]">
                          <span className="text-[#6C6659]">Username:</span>
                          <div className="flex items-center gap-1">
                            <code className="font-mono font-bold text-[#2A261F]">{user.username}</code>
                            <button
                              onClick={() => copyToClipboard(user.username, `tab-u-${user.username}`)}
                              className="text-gray-400 hover:text-gray-700"
                            >
                              {copiedKey === `tab-u-${user.username}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
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

          {/* TAB 3: REGISTRASI */}
          {activeTab === 'custom' && (
            <form onSubmit={handleCustomLogin} className="space-y-4 bg-white p-5 rounded-2xl border border-[#E5DFD1]">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900">
                Registrasi membutuhkan token rahasia. Token hanya diverifikasi di server.
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4A453A] mb-1">Nama Lembaga / Peneliti / Psikolog *</label>
                <input type="text" required value={customName} onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Nama lembaga atau nama profesional"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Username *</label>
                  <input type="text" required minLength={4} maxLength={32} value={customUsername} onChange={(e) => setCustomUsername(e.target.value)}
                    placeholder="username_anda"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Password *</label>
                  <input type="password" required minLength={8} value={customPassword} onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F]" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Peran *</label>
                  <select value={customRole} onChange={(e) => setCustomRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F]">
                    <option value="lembaga">Lembaga</option>
                    <option value="peneliti">Peneliti</option>
                    <option value="psikolog">Psikolog</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A453A] mb-1">Kota / Wilayah</label>
                  <input type="text" value={customCity} onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="Opsional"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4A453A] mb-1">Token Registrasi Rahasia *</label>
                <input type="password" required value={customToken} onChange={(e) => setCustomToken(e.target.value)}
                  placeholder="Token rahasia"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8D2C5] rounded-xl text-[#2A261F]" />
              </div>
              <button type="submit" id="btn-submit-custom-account"
                className="w-full bg-[#2D5A43] hover:bg-[#234735] text-white font-medium text-sm py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 mt-4">
                <Building2 className="w-4 h-4" /> Daftar & Login
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F2EDE4] border-t border-[#E5DFD1] flex flex-wrap items-center justify-between gap-2 text-xs text-[#6C6659]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              Sesi Aktif: <strong>{currentUser.name}</strong> ({currentUser.roleLabel})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentUser.role === 'superadmin' && onOpenMasterControl && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenMasterControl();
                }}
                className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Server className="w-3.5 h-3.5" /> Buka Panel Server Utama
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white border border-[#D8D2C5] hover:bg-[#FAF7F2] rounded-lg text-[#4A453A] font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
