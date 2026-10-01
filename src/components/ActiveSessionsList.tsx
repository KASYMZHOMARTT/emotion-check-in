import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  BarChart3, 
  ArrowRight, 
  RotateCcw, 
  TabletSmartphone, 
  Sparkles, 
  AlertTriangle,
  BookOpen,
  Plus,
  TrendingUp,
  Play
} from 'lucide-react';
import { CheckInSession, SchoolClass } from '../types';

interface ActiveSessionsListProps {
  sessions: CheckInSession[];
  classes?: SchoolClass[];
  selectedClassId?: string;
  onSelectClass?: (classId: string) => void;
  onSelectSession: (session: CheckInSession) => void;
  onStartRecheck: (session: CheckInSession) => void;
  onOpenKioskForSession: (session: CheckInSession) => void;
  onOpenTeacherAlgorithm: (session: CheckInSession) => void;
  onOpenPdfTips?: (session: CheckInSession) => void;
  onOpenKioskForClass?: (classId: string) => void;
}

export const ActiveSessionsList: React.FC<ActiveSessionsListProps> = ({
  sessions,
  classes = [],
  selectedClassId: propsSelectedClassId,
  onSelectClass,
  onSelectSession,
  onStartRecheck,
  onOpenKioskForSession,
  onOpenTeacherAlgorithm,
  onOpenPdfTips,
  onOpenKioskForClass
}) => {
  const [localSelectedClassId, setLocalSelectedClassId] = useState<string>(
    classes[0]?.id || sessions[0]?.classId || ''
  );

  const currentClassId = propsSelectedClassId !== undefined ? propsSelectedClassId : localSelectedClassId;

  const handleClassChange = (newClassId: string) => {
    setLocalSelectedClassId(newClassId);
    if (onSelectClass) {
      onSelectClass(newClassId);
    }
  };

  const handleLaunchForSelectedClass = () => {
    const targetId = currentClassId && currentClassId !== 'all' ? currentClassId : (classes[0]?.id || sessions[0]?.classId);
    if (onOpenKioskForClass && targetId) {
      onOpenKioskForClass(targetId);
    } else {
      const sess = sessions.find((s) => s.classId === targetId) || sessions[0];
      if (sess) onOpenKioskForSession(sess);
    }
  };

  // Filter sessions: if a specific class is selected, show ONLY that class's results!
  const displaySessions = React.useMemo(() => {
    if (!currentClassId || currentClassId === 'all') return sessions;
    return sessions.filter((s) => s.classId === currentClassId);
  }, [sessions, currentClassId]);

  const selectedClassName = classes.find((c) => c.id === currentClassId)?.name;

  return (
    <div className="space-y-5">
      {/* Quick Launch Panel: Fully responsive and adaptive banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-5 sm:p-6 lg:p-7 text-white shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex items-center flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs whitespace-nowrap">
              Жедел тексеру бөлімі
            </span>
            <span className="text-xs text-blue-100 font-semibold whitespace-nowrap">• 60 секундтық скрининг</span>
          </div>

          <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-white tracking-tight leading-snug break-words">
            Оқушыларға <span className="whitespace-nowrap">Emotion Check-in</span> тестін ашу
          </h4>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-2xl">
            Барлық сыныптардың арасынан керекті сыныпты таңдап, оқушыларға тексеру экранын бірден ашып беріңіз. Оқушылардың жауабы сақталып, жүйенің барлық бөлімінде жедел көрінеді.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full xl:w-auto">
          {classes.length > 0 && (
            <div className="relative flex-1 sm:flex-initial sm:min-w-[220px]">
              <select
                value={currentClassId}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-4 py-3 bg-white text-slate-900 text-xs sm:text-sm font-extrabold rounded-2xl border-0 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none cursor-pointer"
              >
                <option value="all">Барлық сыныптар ({classes.length})</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.studentCount || 0} оқушы)
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleLaunchForSelectedClass}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
            title="Таңдалған сыныпқа планшетте 60 секундтық тексеру экранын ашу"
          >
            <TabletSmartphone className="w-4 h-4 shrink-0" />
            <span>Оқушыларға тест ашу (Планшет)</span>
          </button>
        </div>
      </div>

      {/* Class Quick Switch Pills */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500">Сынып бойынша сүзу:</span>
          <button
            onClick={() => handleClassChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentClassId === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Барлық сыныптар
          </button>
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => handleClassChange(cls.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentClassId === cls.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>

        <div className="text-xs font-semibold text-slate-500">
          {selectedClassName ? (
            <span>Тек <b>{selectedClassName}</b> нәтижелері: <b>{displaySessions.length} сессия</b></span>
          ) : (
            <span>Барлығы: <b>{displaySessions.length} сессия</b></span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {displaySessions.map((session) => {
          const urgentAlert = session.urgentSupportCount > 0;
          const totalCount = session.totalStudents || 20;
          const completedCount = session.submissionCount || 0;
          const absentCount = session.absentCount || 0;
          const participationRate = totalCount > 0 
            ? Math.round((completedCount / totalCount) * 100) 
            : 0;

          return (
            <div
              key={session.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md ${
                urgentAlert 
                  ? 'border-rose-200/90 hover:border-rose-300' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <h4 className="font-extrabold text-slate-900 text-lg leading-snug">
                      {session.className || session.title}
                    </h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500 text-white">
                      Белсенді
                    </span>
                    {session.recheckStats && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                        <TrendingUp className="w-3 h-3" />
                        <span>Re-check: {session.recheckStats.supportIndex}%</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    60 секундтық Emotion Check-in өздік бағалауы
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{completedCount} / {totalCount} оқушы</span>
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Тексеру қарқыны</span>
                  <span className="font-bold text-slate-700">{participationRate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${participationRate}%` }} 
                  />
                </div>
              </div>

              {/* Support Index & Emotion Mini Distribution Bar */}
              <div className="mt-4 bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Қолдау индексі:</span>
                    <span className={`font-black text-sm px-2 py-0.5 rounded-md ${
                      session.supportIndex >= 85 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : session.supportIndex >= 70 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {session.supportIndex}%
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Орташа балл:</span>
                    <span className="font-extrabold text-slate-800">{session.averageLevel} / 5.0</span>
                  </div>
                </div>

                {/* 5-Color Mini Distribution Bar */}
                {session.submissionCount > 0 && session.breakdown && (
                  <div className="space-y-1 pt-1">
                    <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-slate-200">
                      <div 
                        style={{ width: `${((session.breakdown[1] || 0) / session.submissionCount) * 100}%` }} 
                        className="bg-red-500" 
                        title={`1-деңгей (Күйзеліс): ${session.breakdown[1] || 0}`} 
                      />
                      <div 
                        style={{ width: `${((session.breakdown[2] || 0) / session.submissionCount) * 100}%` }} 
                        className="bg-orange-400" 
                        title={`2-деңгей (Шаршау): ${session.breakdown[2] || 0}`} 
                      />
                      <div 
                        style={{ width: `${((session.breakdown[3] || 0) / session.submissionCount) * 100}%` }} 
                        className="bg-yellow-400" 
                        title={`3-деңгей (Бейтарап): ${session.breakdown[3] || 0}`} 
                      />
                      <div 
                        style={{ width: `${((session.breakdown[4] || 0) / session.submissionCount) * 100}%` }} 
                        className="bg-emerald-500" 
                        title={`4-деңгей (Жақсы): ${session.breakdown[4] || 0}`} 
                      />
                      <div 
                        style={{ width: `${((session.breakdown[5] || 0) / session.submissionCount) * 100}%` }} 
                        className="bg-blue-600" 
                        title={`5-деңгей (Шабыт): ${session.breakdown[5] || 0}`} 
                      />
                    </div>
                  </div>
                )}

                {urgentAlert ? (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 font-medium">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{session.urgentSupportCount} оқушыға жедел педагогикалық көмек қажет!</span>
                  </div>
                ) : (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                    <span>Барлық оқушылар сабаққа дайын эмоционалдық аймақта</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 flex items-center flex-wrap gap-2 border-t border-slate-100">
                <button
                  onClick={() => onOpenKioskForSession(session)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all"
                  title="Осы сыныптың оқушылары үшін тексеру экранын ашу"
                >
                  <TabletSmartphone className="w-4 h-4" />
                  <span>Оқушыларды тексеру (Планшет)</span>
                </button>

                <button
                  onClick={() => onSelectSession(session)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Аналитика мен Нәтиже</span>
                </button>

                <button
                  onClick={() => onOpenTeacherAlgorithm(session)}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Мұғалім әрекеті алгоритмі</span>
                </button>

                {onOpenPdfTips && (
                  <button
                    onClick={() => onOpenPdfTips(session)}
                    className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/80 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors ml-auto"
                    title="Педагогикалық кеңестер жинағын PDF форматында жүктеп алу"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>📄 Кеңестер жинағы (PDF)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
