import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  RefreshCw, 
  Layers, 
  BookOpen, 
  Check, 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  Building2, 
  GraduationCap, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Users,
  Award 
} from 'lucide-react';
import { Teacher } from '../types';

interface SettingsViewProps {
  teacher?: Teacher;
  onUpdateTeacher?: (name: string) => Promise<any>;
  onUpdateProfile?: (data: { name?: string; school?: string; subject?: string; currentPassword?: string; newPassword?: string }) => Promise<any>;
  onResetDemo: () => void;
  onOpenKiosk: () => void;
  onOpenMatrix: () => void;
  onOpenPrintCards: () => void;
  onOpenSmartGrouping?: () => void;
  onOpenOfficialReport?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  teacher,
  onUpdateTeacher,
  onUpdateProfile,
  onResetDemo,
  onOpenKiosk,
  onOpenMatrix,
  onOpenPrintCards,
  onOpenSmartGrouping,
  onOpenOfficialReport
}) => {
  const [name, setName] = useState<string>(teacher?.name || 'Мұғалім');
  const [school, setSchool] = useState<string>(teacher?.school || '');
  const [subject, setSubject] = useState<string>(teacher?.subject || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPasswordText, setShowPasswordText] = useState<boolean>(false);
  const [passwordSaved, setPasswordSaved] = useState<boolean>(false);

  useEffect(() => {
    if (teacher) {
      setName(teacher.name || 'Мұғалім');
      setSchool(teacher.school || '');
      setSubject(teacher.subject || '');
    }
  }, [teacher]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSaving(true);
    try {
      if (onUpdateProfile) {
        await onUpdateProfile({
          name: name.trim() || 'Мұғалім',
          school: school.trim(),
          subject: subject.trim()
        });
      } else if (onUpdateTeacher) {
        await onUpdateTeacher(name.trim() || 'Мұғалім');
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Сақтау қатесі');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!currentPassword) {
      setErrorMsg('Ағымдағы құпия сөзді енгізіңіз');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Жаңа құпия сөз кемінде 6 таңбадан тұруы керек');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Жаңа құпия сөздер бір-біріне сәйкес келмейді');
      return;
    }

    if (!onUpdateProfile) return;

    setIsSaving(true);
    try {
      await onUpdateProfile({
        currentPassword,
        newPassword
      });
      setPasswordSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Құпия сөзді өзгерту сәтсіз аяқталды');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Platform Core Purpose & Teacher Input Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">
                Мұғалімнің жеке кабинеті
              </h4>
              <p className="text-xs text-slate-500">
                Профиль деректері мен жүйеге кіру қауіпсіздігі
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Мұғалім
          </span>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Mission Statement */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Платформаның негізгі мақсаты:</span>
          </div>
          <p className="text-xs text-blue-950 leading-relaxed font-medium">
            Оқушылардың сабақ алдындағы эмоционалдық дайындығы мен көңіл-күйін 60 секундта нақты бақылап, күйзеліс пен шаршау деңгейін анықтау және мұғалім ретінде дер кезінде педагогикалық қолдау көрсету.
          </p>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Мұғалімнің аты-жөні:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Мысалы: Қоңырбаева Әсем Жұмаділлақызы"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Электронды пошта (Email / Логин):
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={teacher?.email || 'ustaz@mektep.kz'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm font-medium cursor-not-allowed"
                  title="Email өзгерту шектелген"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Мектеп атауы:
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="145 орта мектеп"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Оқытатын пәні / Лауазымы:
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Педагог-психолог"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>{showPasswordSection ? 'Құпия сөзді жасыру' : 'Құпия сөзді өзгерту'}</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Сақталды!</span>
                </>
              ) : (
                <span>{isSaving ? 'Сақталуда...' : 'Профильді сақтау'}</span>
              )}
            </button>
          </div>
        </form>

        {/* Change Password Dropdown Form */}
        {showPasswordSection && (
          <form onSubmit={handleChangePassword} className="mt-4 pt-4 border-t border-slate-100 space-y-3 bg-slate-50/80 p-4 rounded-xl">
            <h5 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span>Құпия сөзді жаңарту</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Ағымдағы құпия сөз:
                </label>
                <div className="relative">
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Жаңа құпия сөз (кемінде 6):
                </label>
                <div className="relative">
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Жаңа құпия сөз"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Қайталаңыз:
                </label>
                <div className="relative">
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Қайталаңыз"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPasswordText(!showPasswordText)}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                {showPasswordText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPasswordText ? 'Жасыру' : 'Көрсету'}</span>
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {passwordSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Құпия сөз жаңартылды!</span>
                  </>
                ) : (
                  <span>Құпия сөзді жаңарту</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Research Methodology Documentation */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <span>«Emotion Check-in» Педагогикалық бақылау әдістемесі</span>
        </h4>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            <b>Зерттеу нысаны:</b> Оқушының сабақ алдындағы эмоционалдық күйін 60 секундта анықтау және мұғалімнің жедел педагогикалық қолдау көрсету алгоритмі.
          </p>
          <p>
            <b>Мақсаты:</b> Сабақ басындағы стрессті төмендету, оқу мотивациясын күшейту, сабақ тиімділігін 30%-дан астам көтеру және инклюзивті қауіпсіз психологиялық орта құру.
          </p>
          <p>
            <b>Құралдар:</b> 5 деңгейлі сигналдық Emotion картасы, ортақ планшет (Киоск режимі), басып шығарылатын қағаз форматы.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap gap-2">
          <button
            onClick={onOpenMatrix}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>5 деңгейлі карта & алгоритмді көру</span>
          </button>

          {onOpenSmartGrouping && (
            <button
              onClick={onOpenSmartGrouping}
              className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-4 h-4 text-purple-600" />
              <span>Smart Grouping (Топқа бөлу)</span>
            </button>
          )}

          {onOpenOfficialReport && (
            <button
              onClick={onOpenOfficialReport}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Ресми Аттестациялық Есеп (PDF)</span>
            </button>
          )}

          <button
            onClick={onOpenPrintCards}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Қағаз карточкаларын жүктеу
          </button>
        </div>
      </div>

      {/* Demo Reset */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-3">
        <h4 className="font-extrabold text-slate-900 text-base text-rose-600 flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          <span>Зерттеу деректерін қалпына келтіру</span>
        </h4>
        <p className="text-xs text-slate-500">
          Сыныптар, оқушылар, сессиялар мен check-in жазбаларын бастапқы зерттеу демо жағдайына қайтару.
        </p>
        <button
          onClick={onResetDemo}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          Барлық демо деректерді қалпына келтіру
        </button>
      </div>
    </div>
  );
};
