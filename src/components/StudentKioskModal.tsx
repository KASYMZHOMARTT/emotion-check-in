import React, { useState, useEffect } from 'react';
import { 
  X, 
  TabletSmartphone, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  BatteryCharging, 
  MessageSquare, 
  ShieldAlert, 
  ArrowLeft,
  Users,
  Search,
  RotateCcw,
  Check,
  Maximize2,
  Minimize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CheckInSession, Student, EmotionLevelConfig, SchoolClass, CheckInRecord } from '../types';

interface StudentKioskModalProps {
  session?: CheckInSession;
  initialClassId?: string;
  allSessions: CheckInSession[];
  students: Student[];
  classes?: SchoolClass[];
  checkIns?: CheckInRecord[];
  levels: Record<number, EmotionLevelConfig>;
  onClose: () => void;
  onSubmitCheckIn: (data: {
    sessionId: string;
    studentId: string;
    pin?: string;
    level: number;
    energyLevel: number;
    primaryFactor?: string;
    notesToTeacher?: string;
    wantsPrivateHelp?: boolean;
    durationSeconds: number;
  }) => Promise<any>;
  onMarkAbsent?: (data: { sessionId: string; studentId: string }) => Promise<any>;
  onFinalizeAbsent?: (sessionId: string) => Promise<any>;
}

export const StudentKioskModal: React.FC<StudentKioskModalProps> = ({
  session,
  initialClassId,
  allSessions,
  students,
  classes = [],
  checkIns = [],
  levels,
  onClose,
  onSubmitCheckIn,
  onMarkAbsent,
  onFinalizeAbsent
}) => {
  const activeSession = session || allSessions.find((s) => s.status === 'active') || allSessions[0];
  
  // Selected class
  const [selectedClassId, setSelectedClassId] = useState<string>(
    initialClassId || session?.classId || activeSession?.classId || classes[0]?.id || 'class-9a'
  );

  useEffect(() => {
    if (initialClassId) {
      setSelectedClassId(initialClassId);
    } else if (session?.classId) {
      setSelectedClassId(session.classId);
    }
  }, [initialClassId, session?.classId]);

  // Kiosk step: 'select_student' -> 'checkin' -> 'success'
  const [step, setStep] = useState<'select_student' | 'checkin' | 'success'>('select_student');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 60-second Check-in Form States
  const [selectedLevel, setSelectedLevel] = useState<number>(4);
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [primaryFactor, setPrimaryFactor] = useState<string>('Сабаққа қызығушылық');
  const [notesToTeacher, setNotesToTeacher] = useState<string>('');
  const [wantsPrivateHelp, setWantsPrivateHelp] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [autoResetTimer, setAutoResetTimer] = useState<number>(3);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Students of current class
  const classStudents = students.filter(
    (s) => s.classId === selectedClassId
  );

  // Active session for selected class
  const activeSessionForClass = allSessions.find((s) => s.classId === selectedClassId && s.status === 'active') || 
                                allSessions.find((s) => s.classId === selectedClassId) ||
                                activeSession;

  // Map of completed checkIns for current session
  const currentSessionId = activeSessionForClass?.id;
  const completedMap = new Map<string, CheckInRecord>();
  if (currentSessionId) {
    checkIns.forEach((ci) => {
      if (ci.sessionId === currentSessionId) {
        completedMap.set(ci.studentId, ci);
      }
    });
  }

  const filteredStudents = classStudents.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedCount = classStudents.filter((s) => {
    const ci = completedMap.get(s.id);
    return ci && ci.status !== 'absent' && ci.level > 0;
  }).length;

  const absentCount = classStudents.filter((s) => {
    const ci = completedMap.get(s.id);
    return ci && (ci.status === 'absent' || ci.level === 0);
  }).length;

  const totalCount = classStudents.length;
  const remainingCount = Math.max(0, totalCount - (completedCount + absentCount));

  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);

  const handleMarkStudentAbsent = async (studentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetSession = activeSessionForClass || activeSession;
    if (!targetSession || !onMarkAbsent) return;
    try {
      await onMarkAbsent({ sessionId: targetSession.id, studentId });
    } catch (err: any) {
      alert(err.message || 'Қате орын алды');
    }
  };

  const handleFinalizeRemainingAbsent = async () => {
    const targetSession = activeSessionForClass || activeSession;
    if (!targetSession || !onFinalizeAbsent) return;
    setIsFinalizing(true);
    try {
      await onFinalizeAbsent(targetSession.id);
    } catch (err: any) {
      alert(err.message || 'Қате орын алды');
    } finally {
      setIsFinalizing(false);
    }
  };

  const factorOptions = [
    'Сабаққа қызығушылық',
    'Жақсы көңіл-күй',
    'Ұйқының қанбауы',
    'Үй тапсырмасы / Тест',
    'Денсаулық жағдайы',
    'Достар / Қарым-қатынас',
    'Жеке мәселе'
  ];

  // 60-second timer when checkin step is active
  useEffect(() => {
    let interval: any = null;
    if (step === 'checkin') {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  // Auto-reset countdown on success step
  useEffect(() => {
    let interval: any = null;
    if (step === 'success') {
      interval = setInterval(() => {
        setAutoResetTimer((prev) => {
          if (prev <= 1) {
            handleReturnToStudentList();
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleSelectStudent = (student: Student) => {
    setCurrentStudent(student);
    const existing = completedMap.get(student.id);
    if (existing) {
      setSelectedLevel(existing.level || 4);
      setEnergyLevel(existing.energyLevel || 4);
      setPrimaryFactor(existing.primaryFactor || 'Сабаққа қызығушылық');
      setNotesToTeacher(existing.notesToTeacher || '');
      setWantsPrivateHelp(existing.wantsPrivateHelp || false);
    } else {
      setSelectedLevel(4);
      setEnergyLevel(4);
      setPrimaryFactor('Сабаққа қызығушылық');
      setNotesToTeacher('');
      setWantsPrivateHelp(false);
    }
    setTimerSeconds(60);
    setTimeSpent(0);
    setStep('checkin');
  };

  const handleSubmit = async () => {
    const targetSession = activeSessionForClass || activeSession;
    if (!currentStudent || !targetSession) return;
    setIsSubmitting(true);
    try {
      await onSubmitCheckIn({
        sessionId: targetSession.id,
        studentId: currentStudent.id,
        level: selectedLevel,
        energyLevel,
        primaryFactor,
        notesToTeacher,
        wantsPrivateHelp: wantsPrivateHelp || selectedLevel === 1,
        durationSeconds: Math.max(5, timeSpent)
      });

      // Confetti celebration
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      setStep('success');
      setAutoResetTimer(3);
    } catch (err: any) {
      alert(err.message || 'Қате орын алды');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnToStudentList = () => {
    setCurrentStudent(null);
    setSelectedLevel(4);
    setEnergyLevel(4);
    setPrimaryFactor('Сабаққа қызығушылық');
    setNotesToTeacher('');
    setWantsPrivateHelp(false);
    setStep('select_student');
  };

  const currentLevelConfig = levels[selectedLevel] || levels[4];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className={`bg-white rounded-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 ${
        isFullscreen ? 'fixed inset-2 h-[calc(100vh-16px)] max-w-none' : 'max-w-5xl lg:max-w-6xl max-h-[94vh]'
      }`}>
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/30 shrink-0">
              <TabletSmartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-full shrink-0">
                  Планшет экраны
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">• 60 секундтық скрининг</span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800 truncate">
                {classes.find((c) => c.id === selectedClassId)?.name || activeSession?.className || 'Сынып'} — Emotion Check-in
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {step !== 'select_student' && (
              <button
                onClick={handleReturnToStudentList}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Оқушылар тізімі</span>
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              title={isFullscreen ? 'Шағын көрініс' : 'Тақтаға толық экранда ашу'}
            >
              {isFullscreen ? <Minimize2 className="w-4.5 h-4.5" /> : <Maximize2 className="w-4.5 h-4.5" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              title="Жабу"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= STEP 1: STUDENT SELECTION SCREEN ================= */}
        {step === 'select_student' && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* Class Banner & Progress */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                    Сыныпты таңдау:
                  </span>
                  <select
                    value={selectedClassId}
                    onChange={(e) => {
                      setSelectedClassId(e.target.value);
                      setCurrentStudent(null);
                      setSearchQuery('');
                    }}
                    className="bg-white text-slate-900 text-xs font-extrabold px-3 py-1 rounded-xl shadow-xs focus:ring-2 focus:ring-blue-300 focus:outline-none cursor-pointer"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.studentCount || 0} оқушы)
                      </option>
                    ))}
                  </select>
                </div>
                <h4 className="text-xl font-extrabold text-white">
                  {classes.find((c) => c.id === selectedClassId)?.name || '9 «А» сыныбы'}
                </h4>
                <p className="text-xs text-blue-100">
                  Оқушылар кезекпен келіп өз атын басып, 60 секундта көңіл-күйін белгілейді
                </p>
              </div>

              {/* Counter Pill */}
              <div className="bg-white/20 backdrop-blur-xs rounded-2xl px-4 py-2 text-center shrink-0 space-y-0.5">
                <span className="text-[10px] font-bold text-blue-100 block uppercase tracking-wider">
                  Өткендер / Жалпы
                </span>
                <span className="text-xl font-black text-white">
                  {completedCount} <span className="text-xs font-semibold text-blue-200">/ {totalCount}</span>
                </span>
                {absentCount > 0 && (
                  <span className="block text-[10px] font-extrabold text-amber-200">
                    ({absentCount} келмеді)
                  </span>
                )}
              </div>
            </div>

            {/* Search Box */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Өз аты-жөніңізді іздеңіз..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                />
              </div>

              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 self-center">
                <span>Өз аты-жөніңізді басыңыз 👇</span>
              </div>
            </div>

            {/* Students Grid: Responsive 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
              {filteredStudents.map((st) => {
                const checked = completedMap.has(st.id);
                const record = completedMap.get(st.id);
                const isAbsent = record?.status === 'absent' || record?.level === 0;
                const levelConfig = record && !isAbsent ? levels[record.level] : null;

                return (
                  <div
                    key={st.id}
                    onClick={() => {
                      if (!isAbsent) {
                        handleSelectStudent(st);
                      }
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 shadow-2xs ${
                      checked
                        ? isAbsent
                          ? 'bg-slate-50/90 border-slate-200 opacity-90'
                          : 'bg-blue-50/80 border-blue-200/90 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                        : 'bg-white border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-xs cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-2xs ${
                          checked
                            ? isAbsent
                              ? 'bg-slate-200 text-slate-600'
                              : 'bg-blue-600 text-white shadow-blue-500/25'
                            : 'bg-blue-100/80 text-blue-700 font-extrabold'
                        }`}
                      >
                        {checked ? (
                          isAbsent ? '❌' : (levelConfig?.emoji || '✓')
                        ) : (
                          st.name.charAt(0)
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug break-words">
                          {st.name}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium leading-tight">
                          {checked ? (
                            isAbsent ? (
                              <span className="text-amber-700 font-bold">Сабақта жоқ (Өтпеді)</span>
                            ) : (
                              <span className="text-blue-700 font-bold flex items-center gap-1">
                                <Check className="w-3 h-3 text-blue-600 shrink-0" />
                                <span>{levelConfig?.nameKz ? levelConfig.nameKz.split(':')[0] : 'Тексерілді'}</span>
                              </span>
                            )
                          ) : (
                            <span className="text-blue-600 font-semibold">Басу үшін қолжетімді</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 pl-1">
                      {checked ? (
                        isAbsent ? (
                          <span className="px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold bg-slate-200 text-slate-700">
                            Өтпеді
                          </span>
                        ) : (
                          <span className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-blue-600" />
                            <span>Өтті</span>
                          </span>
                        )
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {onMarkAbsent && (
                            <button
                              type="button"
                              onClick={(e) => handleMarkStudentAbsent(st.id, e)}
                              className="px-2.5 py-2 rounded-xl text-[11px] font-bold text-slate-500 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                              title="Оқушы сабақта жоқ болса, келмеді деп белгілеу"
                            >
                              Келмеді
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleSelectStudent(st)}
                            className="px-3.5 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-xs shadow-blue-500/20 cursor-pointer"
                          >
                            Бастау
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Finalize remaining absent banner */}
            {onFinalizeAbsent && remainingCount > 0 && (
              <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <h5 className="font-extrabold text-amber-950 text-xs sm:text-sm">
                      Сабаққа келмеген оқушылар бар ма?
                    </h5>
                  </div>
                  <p className="text-[11px] text-amber-800/90 leading-tight">
                    Барлық келген оқушылар өтіп болған соң, қалған <b>{remainingCount} оқушыны</b> автоматты «Өтпеді (Келмеді)» деп белгілеп сақтауға болады.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleFinalizeRemainingAbsent}
                  disabled={isFinalizing || remainingCount === 0}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isFinalizing ? 'Сақталуда...' : `Қалған ${remainingCount} оқушыны «Өтпеді» деп сақтау`}</span>
                </button>
              </div>
            )}

            {filteredStudents.length === 0 && (
              <div className="text-center py-10 text-slate-400 space-y-1">
                <Users className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Оқушы табылмады</p>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 2: 60-SECOND EMOTION CHECK-IN ================= */}
        {step === 'checkin' && currentStudent && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* Student Name & 60-second Timer Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {currentStudent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">
                    Сәлем, {currentStudent.name}!
                  </h4>
                  <p className="text-xs text-slate-500">
                    Қазір өзіңізді қалай сезініп тұрсыз? (60 секунд ішінде белгілеңіз)
                  </p>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <Clock className={`w-4 h-4 ${timerSeconds < 15 ? 'text-rose-500 animate-spin' : 'text-blue-600'}`} />
                <span className={`font-mono font-black text-sm ${timerSeconds < 15 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {timerSeconds}с
                </span>
              </div>
            </div>

            {/* 1. 5-Level Emotion Cards */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>1. 5 деңгейлі Emotion Check-in картасынан өз күйіңізді таңдаңыз:</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                {[1, 2, 3, 4, 5].map((lvl) => {
                  const cfg = levels[lvl];
                  const isSelected = selectedLevel === lvl;

                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedLevel(lvl)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'shadow-md scale-102 ring-2 ring-blue-500'
                          : 'hover:border-slate-300 opacity-90 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: cfg?.bgColor || '#f8fafc',
                        borderColor: isSelected ? cfg?.color : cfg?.borderColor || '#e2e8f0',
                      }}
                    >
                      <div>
                        <div className="text-2xl mb-1">{cfg?.emoji}</div>
                        <p className="text-[11px] font-black text-slate-900 leading-tight">
                          {cfg?.nameKz ? cfg.nameKz.split(':')[0] : ''}
                        </p>
                        <p className="text-[10px] text-slate-600 mt-0.5 leading-tight font-medium">
                          {cfg?.tagline}
                        </p>
                      </div>

                      {isSelected && (
                        <div 
                          className="mt-2 text-[10px] font-bold px-1.5 py-0.5 rounded text-white text-center"
                          style={{ backgroundColor: cfg?.color }}
                        >
                          Таңдалды ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Description preview */}
              <div 
                className="p-3.5 rounded-xl border text-xs font-medium"
                style={{
                  backgroundColor: currentLevelConfig?.bgColor,
                  borderColor: currentLevelConfig?.borderColor,
                  color: '#1e293b'
                }}
              >
                <span className="font-extrabold">{currentLevelConfig?.nameKz}: </span>
                {currentLevelConfig?.description}
              </div>
            </div>

            {/* 2. Energy Battery */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <BatteryCharging className="w-4 h-4 text-blue-600" />
                <span>2. Физикалық күш-қуатыңыз (Батарея):</span>
              </label>

              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setEnergyLevel(b)}
                    className={`py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      energyLevel === b
                        ? 'bg-blue-600 text-white border-blue-700 shadow-sm shadow-blue-500/30 scale-102'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {b === 1 ? '🔋 20%' : b === 2 ? '🔋 40%' : b === 3 ? '🔋 60%' : b === 4 ? '🔋 80%' : '⚡ 100%'}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Primary Factor Tag */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                3. Бұл көңіл-күйге не себеп болды?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {factorOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPrimaryFactor(opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      primaryFactor === opt
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Optional Note to Teacher */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>4. Мұғалімге құпия хабарлама (Қаласаңыз ғана):</span>
              </label>
              <input
                type="text"
                placeholder="Мысалы: «Басым ауырып тұр», «Тапсырманы түсінбедім», «Жақсы көңіл-күйдемін»..."
                value={notesToTeacher}
                onChange={(e) => setNotesToTeacher(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Private Support Checkbox */}
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={wantsPrivateHelp}
                onChange={(e) => setWantsPrivateHelp(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-700 font-medium">
                Маған бүгінгі сабақта мұғалімнің жеке қолдауы қажет (көп қинамау немесе кеңес беру)
              </span>
            </label>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleReturnToStudentList}
                className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
              >
                Артқа (Тізім)
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isSubmitting ? 'Сақталуда...' : '✅ Аяқтау және Сақтау'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: SUCCESS & AUTO-RESET ================= */}
        {step === 'success' && currentStudent && (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-5 flex-1">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center text-3xl shadow-md shadow-blue-500/20">
              {currentLevelConfig?.emoji || '🎉'}
            </div>

            <div className="space-y-1 max-w-md">
              <h4 className="text-2xl font-black text-slate-900">
                Рахмет, {currentStudent.name}!
              </h4>
              <p className="text-sm text-slate-600">
                Көңіл-күйіңіз сақталды. Сабақта сәттілік тілейміз!
              </p>
            </div>

            <div 
              className="p-4 rounded-2xl border text-xs max-w-md w-full"
              style={{
                backgroundColor: currentLevelConfig?.bgColor,
                borderColor: currentLevelConfig?.borderColor,
                color: '#1e293b'
              }}
            >
              <p className="font-extrabold text-sm">{currentLevelConfig?.nameKz}</p>
              <p className="text-slate-600 mt-1">{currentLevelConfig?.tagline}</p>
            </div>

            <div className="pt-4 flex flex-col items-center gap-2">
              <button
                onClick={handleReturnToStudentList}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <span>Келесі оқушыға көшу</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full font-mono text-[10px]">
                  {autoResetTimer}с
                </span>
              </button>
              <p className="text-[11px] text-slate-400">
                Жүйе автоматты түрде келесі оқушыға дайындалуда
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
