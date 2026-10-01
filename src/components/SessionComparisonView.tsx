import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  Users, 
  Layers, 
  Printer, 
  Filter, 
  HelpCircle,
  Clock,
  Zap,
  HeartHandshake,
  Check,
  Search
} from 'lucide-react';
import { CheckInSession, CheckInRecord, EmotionLevelConfig } from '../types';

interface SessionComparisonViewProps {
  sessions: CheckInSession[];
  checkIns: CheckInRecord[];
  levels: Record<number, EmotionLevelConfig>;
  initialSessionAId?: string;
  initialSessionBId?: string;
  onOpenBreathingTimer?: () => void;
  onOpenBrainGym?: () => void;
}

export const SessionComparisonView: React.FC<SessionComparisonViewProps> = ({
  sessions,
  checkIns,
  levels,
  initialSessionAId,
  initialSessionBId,
  onOpenBreathingTimer,
  onOpenBrainGym
}) => {
  // Safe default selection: Pick first session (or provided) and paired recheck / second session
  const defaultSessionA = useMemo(() => {
    if (initialSessionAId) {
      const found = sessions.find((s) => s.id === initialSessionAId);
      if (found) return found.id;
    }
    return sessions[0]?.id || '';
  }, [sessions, initialSessionAId]);

  const defaultSessionB = useMemo(() => {
    if (initialSessionBId) {
      const found = sessions.find((s) => s.id === initialSessionBId);
      if (found) return found.id;
    }
    // Try to find a recheck or the next available session
    const sessA = sessions.find((s) => s.id === defaultSessionA);
    if (sessA?.recheckSessionId) {
      const recheck = sessions.find((s) => s.id === sessA.recheckSessionId);
      if (recheck) return recheck.id;
    }
    const other = sessions.find((s) => s.id !== defaultSessionA);
    return other?.id || sessions[0]?.id || '';
  }, [sessions, defaultSessionA, initialSessionBId]);

  const [sessionAId, setSessionAId] = useState<string>(defaultSessionA);
  const [sessionBId, setSessionBId] = useState<string>(defaultSessionB);
  const [viewMode, setViewMode] = useState<'overlay' | 'side-by-side'>('overlay');
  const [studentFilter, setStudentFilter] = useState<'all' | 'improved' | 'same' | 'declined'>('all');
  const [searchStudent, setSearchStudent] = useState<string>('');

  const sessionA = useMemo(() => sessions.find((s) => s.id === sessionAId), [sessions, sessionAId]);
  const sessionB = useMemo(() => sessions.find((s) => s.id === sessionBId), [sessions, sessionBId]);

  // Swap sessions
  const handleSwapSessions = () => {
    const temp = sessionAId;
    setSessionAId(sessionBId);
    setSessionBId(temp);
  };

  // Presets
  const handleSelectRecheckPreset = () => {
    // Find initial session that has a recheck
    const paired = sessions.find((s) => s.recheckSessionId || s.type === 'recheck');
    if (paired) {
      if (paired.recheckSessionId) {
        setSessionAId(paired.id);
        setSessionBId(paired.recheckSessionId);
      } else if (paired.parentSessionId) {
        setSessionAId(paired.parentSessionId);
        setSessionBId(paired.id);
      }
    }
  };

  // Checkins for both
  const checkInsA = useMemo(() => checkIns.filter((c) => c.sessionId === sessionAId), [checkIns, sessionAId]);
  const checkInsB = useMemo(() => checkIns.filter((c) => c.sessionId === sessionBId), [checkIns, sessionBId]);

  // Breakdowns
  const breakdownA = useMemo(() => sessionA?.breakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, [sessionA]);
  const breakdownB = useMemo(() => sessionB?.breakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, [sessionB]);

  const countA = sessionA?.submissionCount || checkInsA.length || 1;
  const countB = sessionB?.submissionCount || checkInsB.length || 1;

  // Comparison Metrics & Deltas
  const supportIndexDelta = useMemo(() => {
    if (!sessionA || !sessionB) return 0;
    return Number((sessionB.supportIndex - sessionA.supportIndex).toFixed(1));
  }, [sessionA, sessionB]);

  const avgLevelDelta = useMemo(() => {
    if (!sessionA || !sessionB) return 0;
    return Number((sessionB.averageLevel - sessionA.averageLevel).toFixed(2));
  }, [sessionA, sessionB]);

  const stressCountA = (breakdownA[1] || 0) + (breakdownA[2] || 0);
  const stressCountB = (breakdownB[1] || 0) + (breakdownB[2] || 0);
  const stressDelta = stressCountB - stressCountA;

  const optimalCountA = (breakdownA[4] || 0) + (breakdownA[5] || 0);
  const optimalCountB = (breakdownB[4] || 0) + (breakdownB[5] || 0);
  const optimalDelta = optimalCountB - optimalCountA;

  // Matched Student Trajectories
  const studentTrajectories = useMemo(() => {
    if (!sessionA || !sessionB) return [];

    const mapB = new Map<string, CheckInRecord>();
    checkInsB.forEach((c) => {
      mapB.set(c.studentId, c);
      // fallback by name
      mapB.set(c.studentName.toLowerCase(), c);
    });

    const results: Array<{
      studentId: string;
      studentName: string;
      levelA: number;
      levelB?: number;
      factorA: string;
      notesA: string;
      notesB?: string;
      delta: number;
      status: 'improved' | 'same' | 'declined' | 'only_a' | 'only_b';
    }> = [];

    checkInsA.forEach((cA) => {
      const cB = mapB.get(cA.studentId) || mapB.get(cA.studentName.toLowerCase());
      if (cB) {
        const delta = cB.level - cA.level;
        let status: 'improved' | 'same' | 'declined' = 'same';
        if (delta > 0) status = 'improved';
        else if (delta < 0) status = 'declined';

        results.push({
          studentId: cA.studentId,
          studentName: cA.studentName,
          levelA: cA.level,
          levelB: cB.level,
          factorA: cA.primaryFactor || '',
          notesA: cA.notesToTeacher || '',
          notesB: cB.notesToTeacher || '',
          delta,
          status
        });
      } else {
        results.push({
          studentId: cA.studentId,
          studentName: cA.studentName,
          levelA: cA.level,
          factorA: cA.primaryFactor || '',
          notesA: cA.notesToTeacher || '',
          delta: 0,
          status: 'only_a'
        });
      }
    });

    return results;
  }, [checkInsA, checkInsB, sessionA, sessionB]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return studentTrajectories.filter((st) => {
      if (studentFilter !== 'all' && st.status !== studentFilter) return false;
      if (searchStudent.trim() && !st.studentName.toLowerCase().includes(searchStudent.toLowerCase())) return false;
      return true;
    });
  }, [studentTrajectories, studentFilter, searchStudent]);

  // Improvement Patterns Detection
  const improvementPatterns = useMemo(() => {
    const patterns = [];

    // Pattern 1: De-escalation of distress
    if (stressDelta < 0) {
      patterns.push({
        type: 'positive',
        title: 'Күйзеліс пен шаршау деңгейінің сейілуі (De-escalation)',
        description: `1-2 деңгейдегі оқушылар саны ${stressCountA}-ден ${stressCountB}-ге дейін (${Math.abs(stressDelta)} оқушыға) азайды. Педагогикалық жедел қолдау сабақ алдындағы алаңдаушылықты сәтті сейілтті.`,
        tag: 'Стресс төмендеуі'
      });
    } else if (stressDelta > 0) {
      patterns.push({
        type: 'warning',
        title: 'Қосымша назар қажет: Шаршау белгілері байқалды',
        description: `1-2 деңгейдегі оқушылар саны ${Math.abs(stressDelta)} оқушыға көбейді. Тақырыптың күрделілігі немесе сабақ соңындағы қажу әсер еткен болуы мүмкін.`,
        tag: 'Шаршау деңгейі'
      });
    }

    // Pattern 2: Optimal focus increase
    if (optimalDelta > 0) {
      patterns.push({
        type: 'positive',
        title: 'Оқу дайындығы мен Мотивацияның артуы (Learning Flow)',
        description: `4-5 деңгейдегі оқушылар қатары +${optimalDelta} оқушыға (${optimalCountA}-дан ${optimalCountB}-ге) өсті. Оқушылардың басым бөлігі оңтайлы жұмыс аймағына ауысты.`,
        tag: 'Дайындық өсімі'
      });
    }

    // Pattern 3: Overall support index improvement
    if (supportIndexDelta > 0) {
      patterns.push({
        type: 'highlight',
        title: `Қолдау Индексінің динамикасы: +${supportIndexDelta}%`,
        description: `Сыныптың орташа қолдау көрсеткіші ${sessionA?.supportIndex}%-дан ${sessionB?.supportIndex}%-ға дейін жоғарылады. 60 секундтық скрининг пен мұғалім іс-әрекеті оң нәтиже берді.`,
        tag: 'Индекс өсімі'
      });
    }

    // Pattern 4: Pedagogical recommendation
    patterns.push({
      type: 'recommendation',
      title: 'Зерттеу бойынша педагогикалық тұжырым',
      description: 'Оқушыларға сабақ басында 60 секунд тыныс алу және баяу бейімделу уақытын беру келесі сабақтарда да оңтайлы көңіл-күйді сақтауға мүмкіндік береді.',
      tag: 'Педагогикалық әдістеме'
    });

    return patterns;
  }, [stressDelta, stressCountA, stressCountB, optimalDelta, optimalCountA, optimalCountB, supportIndexDelta, sessionA, sessionB]);

  if (!sessionA || !sessionB) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
        <Layers className="w-10 h-10 text-slate-400 mx-auto" />
        <h4 className="font-bold text-slate-800">Салыстыру үшін кемінде 2 сессия қажет</h4>
        <p className="text-xs text-slate-500">
          Сыныптар мен оқушылар бөлімінде Check-in өткізіп, осы жерде нәтижелерді салыстыра аласыз.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Overlay Салыстыру
              </span>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Сессия нәтижелерін салыстыру және динамика
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Екі сессия нәтижесін қабаттастырып (overlay), оқушылардың көңіл-күйіндегі өзгеріс заңдылықтарын анықтау
            </p>
          </div>

          {/* Quick presets & print */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleSelectRecheckPreset}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Сабақ алдындағы және сабақ соңындағы Re-check сессияларын таңдау"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Сабақ алдында vs Re-check</span>
            </button>

            <button
              onClick={handleSwapSessions}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Сессияларды орындарымен ауыстыру"
            >
              <span>A ⇄ B Ауыстыру</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title="Есепті басып шығару"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dual Selectors: Session A vs Session B */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          {/* Card A */}
          <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">A</span>
                <span>Бастапқы күй (Сессия А)</span>
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                sessionA.type === 'recheck' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {sessionA.type === 'recheck' ? 'Re-check' : 'Сабақ алдында'}
              </span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Сессияны таңдаңыз:</label>
              <select
                value={sessionAId}
                onChange={(e) => setSessionAId(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.className}: {s.title} ({s.date}) — {s.supportIndex}%
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Summary A */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Қолдау индексі</span>
                <span className="text-sm font-extrabold text-blue-600">{sessionA.supportIndex}%</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Орташа балл</span>
                <span className="text-sm font-extrabold text-slate-800">{sessionA.averageLevel} / 5.0</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Оқушы саны</span>
                <span className="text-sm font-extrabold text-slate-800">{countA} оқушы</span>
              </div>
            </div>
          </div>

          {/* Card B */}
          <div className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">B</span>
                <span>Нәтиже / Салыстыру (Сессия B)</span>
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                sessionB.type === 'recheck' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {sessionB.type === 'recheck' ? 'Re-check нәтижесі' : 'Екінші сессия'}
              </span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Сессияны таңдаңыз:</label>
              <select
                value={sessionBId}
                onChange={(e) => setSessionBId(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.className}: {s.title} ({s.date}) — {s.supportIndex}%
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Summary B */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Қолдау индексі</span>
                <span className="text-sm font-extrabold text-emerald-600">{sessionB.supportIndex}%</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Орташа балл</span>
                <span className="text-sm font-extrabold text-slate-800">{sessionB.averageLevel} / 5.0</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Оқушы саны</span>
                <span className="text-sm font-extrabold text-slate-800">{countB} оқушы</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Comparison Delta Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Support Index Delta */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Қолдау Индексінің динамикасы</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">
              {sessionA.supportIndex}% ➔ {sessionB.supportIndex}%
            </span>
            <span className={`inline-flex items-center gap-0.5 text-xs font-extrabold px-2 py-0.5 rounded-full ${
              supportIndexDelta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {supportIndexDelta >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{supportIndexDelta >= 0 ? `+${supportIndexDelta}%` : `${supportIndexDelta}%`}</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {supportIndexDelta >= 0 ? 'Жалпы психологиялық көңіл-күй оң бағытта артты' : 'Қолдау деңгейінің динамикасы'}
          </p>
        </div>

        {/* Average Score Delta */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Орташа эмоциялық балл (1-5)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">
              {sessionA.averageLevel} ➔ {sessionB.averageLevel}
            </span>
            <span className={`inline-flex items-center gap-0.5 text-xs font-extrabold px-2 py-0.5 rounded-full ${
              avgLevelDelta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {avgLevelDelta >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{avgLevelDelta >= 0 ? `+${avgLevelDelta}` : `${avgLevelDelta}`}</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {avgLevelDelta > 0 ? 'Оқушылар оңтайлы оқу дайындығына ауысты' : 'Тұрақты деңгей'}
          </p>
        </div>

        {/* Stress & Anxiety Reduction (Levels 1-2) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Шұғыл көмек қажет (1-2 деңгей)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">
              {stressCountA} оқушы ➔ {stressCountB} оқушы
            </span>
            <span className={`inline-flex items-center gap-0.5 text-xs font-extrabold px-2 py-0.5 rounded-full ${
              stressDelta <= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {stressDelta <= 0 ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              <span>{stressDelta <= 0 ? `${stressDelta} оқушы` : `+${stressDelta} оқушы`}</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {stressDelta < 0 ? 'Күйзелістегі оқушылар саны айтарлықтай азайды' : 'Күйзеліс динамикасы'}
          </p>
        </div>

        {/* Optimal Readiness (Levels 4-5) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Оқуға дайындық (4-5 деңгей)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">
              {optimalCountA} оқушы ➔ {optimalCountB} оқушы
            </span>
            <span className={`inline-flex items-center gap-0.5 text-xs font-extrabold px-2 py-0.5 rounded-full ${
              optimalDelta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {optimalDelta >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{optimalDelta >= 0 ? `+${optimalDelta}` : `${optimalDelta}`}</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {optimalDelta >= 0 ? 'Оқу мотивациясы мен дайындығы күшейді' : 'Дайындық динамикасы'}
          </p>
        </div>
      </div>

      {/* Visual Overlay Chart (5 Levels Side-by-Side & Overlay) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>5 деңгей бойынша қабаттасу визуализациясы (Overlay Distribution)</span>
            </h4>
            <p className="text-xs text-slate-500">
              Әр деңгейдегі оқушылардың сабақ алдындағы (көк) және нәтижелік (жасыл) үлесі
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3.5 h-3.5 rounded-md bg-blue-500 inline-block"></span>
              <span>Сессия A</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 inline-block"></span>
              <span>Сессия B</span>
            </span>
          </div>
        </div>

        {/* 5 Levels Overlay Bars */}
        <div className="space-y-4 pt-1">
          {[1, 2, 3, 4, 5].map((levelNum) => {
            const cfg = levels[levelNum] || {
              name: `Деңгей ${levelNum}`,
              nameKz: `Деңгей ${levelNum}`,
              emoji: '🎯',
              tagline: ''
            };
            const valA = breakdownA[levelNum] || 0;
            const valB = breakdownB[levelNum] || 0;
            const pctA = Math.round((valA / countA) * 100);
            const pctB = Math.round((valB / countB) * 100);
            const diff = valB - valA;

            return (
              <div key={levelNum} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span className="text-base">{cfg.emoji}</span>
                    <span>{levelNum}-деңгей: {cfg.nameKz}</span>
                    <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
                      ({cfg.tagline})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-bold">
                    <span className="text-slate-600">
                      А: <b className="text-blue-600">{valA}</b> ({pctA}%)
                    </span>
                    <span className="text-slate-400">➔</span>
                    <span className="text-slate-600">
                      B: <b className="text-emerald-600">{valB}</b> ({pctB}%)
                    </span>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ml-1 ${
                      diff === 0 
                        ? 'bg-slate-100 text-slate-600'
                        : (levelNum <= 2 && diff < 0) || (levelNum >= 4 && diff > 0)
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {diff > 0 ? `+${diff}` : diff}
                    </span>
                  </div>
                </div>

                {/* Overlaid Dual Bars */}
                <div className="space-y-1.5">
                  {/* Bar A */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 w-12 text-right">Сессия А:</span>
                    <div className="flex-1 h-3.5 bg-slate-200/70 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pctA, 1)}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 w-10">{pctA}%</span>
                  </div>

                  {/* Bar B */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 w-12 text-right">Сессия B:</span>
                    <div className="flex-1 h-3.5 bg-slate-200/70 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pctB, 1)}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 w-10">{pctB}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Identified Improvement Patterns (Педагогикалық заңдылықтар) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Анықталған жақсару заңдылықтары (Improvement Patterns)
            </h4>
            <p className="text-xs text-slate-500">
              Екі сессия нәтижесін салыстыру негізінде жасалған педагогикалық тұжырымдар
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {improvementPatterns.map((pat, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                pat.type === 'positive'
                  ? 'bg-emerald-50/40 border-emerald-200/80 text-emerald-950'
                  : pat.type === 'highlight'
                  ? 'bg-blue-50/40 border-blue-200/80 text-blue-950'
                  : pat.type === 'warning'
                  ? 'bg-amber-50/40 border-amber-200/80 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 border border-current">
                  {pat.tag}
                </span>
                <CheckCircle2 className="w-4 h-4 opacity-70" />
              </div>
              <h5 className="font-bold text-xs sm:text-sm mb-1">{pat.title}</h5>
              <p className="text-xs leading-relaxed opacity-90">{pat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Student-by-Student Trajectory Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Оқушылардың жеке даму траекториясы (Student Trajectories)</span>
            </h4>
            <p className="text-xs text-slate-500">
              Әр оқушының бастапқы күйі мен екінші сессиядағы эмоционалдық деңгейінің жеке динамикасы
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Оқушы атын іздеу..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none w-44"
              />
            </div>

            <div className="flex items-center rounded-xl bg-slate-100 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setStudentFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  studentFilter === 'all' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'
                }`}
              >
                Барлығы ({studentTrajectories.length})
              </button>
              <button
                onClick={() => setStudentFilter('improved')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  studentFilter === 'improved' ? 'bg-white shadow-xs font-bold text-emerald-700' : 'text-slate-600'
                }`}
              >
                Жақсарған (+)
              </button>
              <button
                onClick={() => setStudentFilter('same')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  studentFilter === 'same' ? 'bg-white shadow-xs font-bold text-blue-700' : 'text-slate-600'
                }`}
              >
                Тұрақты (=)
              </button>
              <button
                onClick={() => setStudentFilter('declined')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  studentFilter === 'declined' ? 'bg-white shadow-xs font-bold text-rose-700' : 'text-slate-600'
                }`}
              >
                Назар қажет (-)
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Оқушы аты-жөні</th>
                <th className="p-3">Сессия A (Бастапқы)</th>
                <th className="p-3">Сессия B (Нәтижелік)</th>
                <th className="p-3">Динамика (Траектория)</th>
                <th className="p-3">Себеп / Оқушы пікірі</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st, idx) => {
                const cfgA = levels[st.levelA];
                const cfgB = st.levelB ? levels[st.levelB] : null;

                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-bold text-slate-900">
                      {st.studentName}
                    </td>

                    <td className="p-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px]" style={{
                        backgroundColor: cfgA?.bgColor || '#f1f5f9',
                        color: cfgA?.color || '#334155'
                      }}>
                        <span>{cfgA?.emoji || '🎯'}</span>
                        <span>{st.levelA}-деңгей</span>
                      </span>
                    </td>

                    <td className="p-3">
                      {cfgB ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px]" style={{
                          backgroundColor: cfgB.bgColor,
                          color: cfgB.color
                        }}>
                          <span>{cfgB.emoji}</span>
                          <span>{st.levelB}-деңгей</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Қатыспады</span>
                      )}
                    </td>

                    <td className="p-3">
                      {st.levelB !== undefined ? (
                        st.delta > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>+{st.delta} деңгейге көтерілді</span>
                          </span>
                        ) : st.delta < 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            <ArrowDownRight className="w-3.5 h-3.5" />
                            <span>{st.delta} деңгейге түсті</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            <span>Өзгеріссіз тұрақты</span>
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="p-3 text-slate-600">
                      {st.notesB || st.notesA || st.factorA || '—'}
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    Оқушылар табылмады
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
