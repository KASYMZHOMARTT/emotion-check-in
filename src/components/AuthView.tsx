import React, { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  TabletSmartphone, 
  BookOpen, 
  HeartHandshake, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap,
  Building2,
  Lock,
  Mail,
  User,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { Teacher } from '../types';

interface AuthViewProps {
  onAuthSuccess: (teacher: Teacher) => void;
  onOpenKiosk: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onOpenKiosk }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('ustaz@mektep.kz');
  const [loginPassword, setLoginPassword] = useState<string>('123456');

  // Register form state
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regSchool, setRegSchool] = useState<string>('');
  const [regSubject, setRegSubject] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await api.login({
        email: loginEmail.trim(),
        password: loginPassword
      });
      onAuthSuccess(res.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Кіру сәтсіз аяқталды');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const res = await api.login({
        email: 'ustaz@mektep.kz',
        password: '123456'
      });
      onAuthSuccess(res.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Демо кіру сәтсіз болды');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Барлық міндетті өрістерді толтырыңыз');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Құпия сөз кемінде 6 таңбадан тұруы қажет');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Құпия сөздер бір-біріне сәйкес келмейді');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({
        name: regName.trim(),
        email: regEmail.trim(),
        school: regSchool.trim(),
        subject: regSubject.trim() || 'Мұғалім',
        password: regPassword
      });
      onAuthSuccess(res.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Тіркелу кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-950 to-indigo-950 flex flex-col justify-between text-slate-100 p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

      {/* Top Bar / Branding */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                Emotion Check-in
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
                Мұғалім кабинеті
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Оқушылардың эмоционалдық күйін 60 секундта анықтау жүйесі
            </p>
          </div>
        </div>

        {/* Quick Kiosk Access (Without logging in) */}
        <button
          onClick={onOpenKiosk}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-md shadow-xs cursor-pointer"
          title="Сыныпқа арналған планшетті бірден ашу"
        >
          <TabletSmartphone className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Оқушылар Киоскісі</span>
          <span className="sm:hidden">Киоск</span>
        </button>
      </header>

      {/* Main Content: Split Hero & Auth Card */}
      <main className="relative z-10 max-w-6xl mx-auto w-full my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Pedagogical Value & Info */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Педагогикалық-психологиялық цифрлық платформа</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Әр оқушының күйін <span className="bg-linear-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">терең түсініп</span>, қолдау көрсетіңіз
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
            Сабақ басындағы 60 секундтық скрининг арқылы стресс пен шаршау деңгейін анықтаңыз, сыныптың психологиялық климатын зерттеп, оқу мотивациясын арттырыңыз.
          </p>

          {/* Research & Methodology Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="leading-snug">
                <h4 className="text-xs font-bold text-white">5 деңгейлі карта</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Күйзелістен бастап жоғары шабытқа дейінгі нақты алгоритмдер</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="leading-snug">
                <h4 className="text-xs font-bold text-white">Re-check нәтижесі</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Сабақ соңында педагогикалық әсерді салыстырмалы талдау</p>
              </div>
            </div>
          </div>

          {/* Demo account quick login callout */}
          <div className="p-4 rounded-2xl bg-linear-to-r from-blue-950/80 to-indigo-950/80 border border-blue-500/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-blue-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Жүйені тез көру үшін:
              </p>
              <p className="text-[11px] text-slate-400">
                Дайын демо есептік жазбасымен (Қоңырбаева Әсем Жұмаділлақызы, 145 орта мектеп) 1-шертумен кіре аласыз
              </p>
            </div>
            <button
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <span>Демомен кіру</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Auth Card Form */}
        <div className="lg:col-span-6 max-w-md w-full mx-auto">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 relative">
            
            {/* Mode Tabs (Кіру / Тіркелу) */}
            <div className="flex bg-slate-800/80 p-1 rounded-2xl border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Жүйеге кіру</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Тіркелу</span>
              </button>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Мұғалімнің Email / Логині
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="ustaz@mektep.kz"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Құпия сөз
                    </label>
                    <span className="text-[11px] text-blue-400 font-medium">
                      (Әдепкі: 123456)
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Кабинетке кіру</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Hint */}
                <div className="pt-3 border-t border-white/10 text-center">
                  <p className="text-xs text-slate-400">
                    Тіркелгіңіз жоқ па?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                    >
                      Мұғалім ретінде тіркелу
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Мұғалімнің аты-жөні *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Мысалы: Қоңырбаева Әсем Жұмаділлақызы"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider flex items-center justify-between">
                      <span>Мектеп атауы</span>
                      <span className="text-[10px] text-slate-400 font-normal lowercase">(міндетті емес)</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={regSchool}
                        onChange={(e) => setRegSchool(e.target.value)}
                        placeholder="Мысалы: 145 орта мектеп (бос қалдыруға болады)"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Пәні / Лауазымы
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={regSubject}
                        onChange={(e) => setRegSubject(e.target.value)}
                        placeholder="Педагог-психолог"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Электронды пошта (Email) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="teacher@mektep.kz"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Құпия сөз *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Кемінде 6 таңба"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Қайталау *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Қайталаңыз"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Тіркелу және бастау</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-xs text-slate-400">
                    Тіркелгенсіз бе?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                    >
                      Жүйеге кіру
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <p>© 2026 Emotion Check-in. Мұғалімдер мен мектеп психологтарына арналған зерттеу жүйесі.</p>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Деректер қауіпсіз сақталады
          </span>
        </div>
      </footer>
    </div>
  );
};
