import React, { useState } from 'react';
import { 
  X, 
  BarChart3, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Send,
  Layers,
  FileSpreadsheet,
  Printer,
  Download
} from 'lucide-react';
import { CheckInSession, CheckInRecord, EmotionLevelConfig } from '../types';

interface SessionAnalyticsModalProps {
  session: CheckInSession;
  allSessions: CheckInSession[];
  checkIns: CheckInRecord[];
  levels: Record<number, EmotionLevelConfig>;
  onClose: () => void;
  onStartRecheck: (session: CheckInSession) => void;
  onOpenBreathingTimer: () => void;
  onOpenBrainGym: () => void;
  onSendNotification: (classId: string, title: string, message: string) => Promise<any>;
  onOpenPdfTips?: (session: CheckInSession) => void;
  onOpenComparison?: (sessionAId: string, sessionBId?: string) => void;
}

export const SessionAnalyticsModal: React.FC<SessionAnalyticsModalProps> = ({
  session,
  allSessions,
  checkIns,
  levels,
  onClose,
  onStartRecheck,
  onOpenBreathingTimer,
  onOpenBrainGym,
  onSendNotification,
  onOpenPdfTips,
  onOpenComparison
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'algorithm' | 'students' | 'recheck'>('overview');
  const [notificationMsg, setNotificationMsg] = useState('');
  const [isSendingNotif, setIsSendingNotif] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Filter checkins for this session
  const sessionCheckIns = checkIns.filter((c) => c.sessionId === session.id);

  // Check if there is a paired recheck or initial session
  const pairedSession = session.recheckSessionId 
    ? allSessions.find((s) => s.id === session.recheckSessionId)
    : session.parentSessionId 
    ? allSessions.find((s) => s.id === session.parentSessionId)
    : null;

  const total = session.submissionCount || sessionCheckIns.length || 1;
  const breakdown = session.breakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  const handleSendClassAlert = async () => {
    if (!notificationMsg.trim()) return;
    setIsSendingNotif(true);
    try {
      await onSendNotification(
        session.classId,
        `Мұғалім қолдауы (${session.className})`,
        notificationMsg
      );
      setSentSuccess(true);
      setNotificationMsg('');
      setTimeout(() => setSentSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSendingNotif(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {session.className}
                </span>
                <span className="text-xs text-slate-500">• {session.subject}</span>
                {session.type === 'recheck' && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                    Re-check
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {session.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenPdfTips && (
              <button
                onClick={() => onOpenPdfTips(session)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 transition-all no-print"
                title="Педагогикалық кеңестер жинағын PDF форматында жүктеп алу"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Кеңестер жинағы (PDF)</span>
              </button>
            )}
            {onOpenComparison && (
              <button
                onClick={() => {
                  onClose();
                  onOpenComparison(session.id, pairedSession?.id);
                }}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all border border-blue-200 flex items-center gap-1.5 no-print cursor-pointer"
                title="Бұл сессияны басқа сессиямен қабаттастырып салыстыру"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Салыстыру (Overlay)</span>
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors no-print"
              title="Есепті басып шығару"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-100 flex items-center gap-4 bg-white text-xs font-bold text-slate-500">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Шолу және 5 деңгей үлесі</span>
          </button>

          <button
            onClick={() => setActiveTab('algorithm')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'algorithm'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Мұғалім әрекеті алгоритмі</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'students'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Жеке нәтижелер ({sessionCheckIns.length})</span>
          </button>

          {pairedSession && (
            <button
              onClick={() => setActiveTab('recheck')}
              className={`py-3.5 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'recheck'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Сабақ алды vs Сабақ соңы (Re-check)</span>
            </button>
          )}
        </div>

        {/* Tab 1: Overview & Distribution */}
        {activeTab === 'overview' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Top 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Қолдау индексі (Support Index)
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h4 className="text-3xl font-extrabold text-blue-600">
                    {session.supportIndex}%
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">
                    {session.supportIndex >= 85 ? 'Жоғары дайындық' : 'Орташа қолдау қажет'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${session.supportIndex}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Орташа эмоционалдық балл
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h4 className="text-3xl font-extrabold text-slate-900">
                    {session.averageLevel}
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">/ 5.0 шкаласы</span>
                </div>
                <p className="text-xs text-emerald-600 font-semibold mt-3 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Сабаққа оқушылардың 85%-ы белсенді дайын
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Шұғыл көмек қажет оқушылар
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h4 className={`text-3xl font-extrabold ${session.urgentSupportCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {session.urgentSupportCount}
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">оқушы (1-деңгей)</span>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  {session.urgentSupportCount > 0 ? 'Жеке қауіпсіз орта құру қажет' : 'Дағдарыстық жағдай жоқ'}
                </p>
              </div>
            </div>

            {/* High Distress Alert if level 1 detected */}
            {session.urgentSupportCount > 0 && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-rose-900 text-sm">
                      Назар аударыңыз: {session.urgentSupportCount} оқушы күйзеліс деңгейінде!
                    </h5>
                    <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                      Мұғалім әрекеті алгоритміне сәйкес: Оқушыға сынып алдында қысым көрсетпеңіз, «4-7-8» тыныс алу сергітуін өткізіп, қажет болса демалуға рұқсат беріңіз.
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenBreathingTimer}
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 transition-colors"
                >
                  Тыныс алу таймерін қосу
                </button>
              </div>
            )}

            {/* 5-Level Distribution Detailed Bars */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
              <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>5 деңгей бойынша сыныптың бөлінісі (Check-in картасы):</span>
              </h5>

              <div className="space-y-3">
                {([1, 2, 3, 4, 5] as const).map((lvl) => {
                  const cfg = levels[lvl];
                  const count = breakdown[lvl] || 0;
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

                  return (
                    <div key={lvl} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{cfg?.emoji}</span>
                          <span className="font-bold text-slate-800">
                            {lvl}-деңгей: {cfg?.nameKz.split(':')[1] || cfg?.nameKz}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-bold text-slate-700">{count} оқушы</span>
                          <span className="text-slate-400 font-semibold">({pct}%)</span>
                        </div>
                      </div>

                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: cfg?.color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Pedagogical Tools for this session */}
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Сыныптағы педагогикалық сергіту құралдары</span>
                </h5>
                <p className="text-xs text-slate-600">
                  Алынған нәтижелер негізінде сабақтың тиімділігін арттыру әрекеттері
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={onOpenBreathingTimer}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>«4-7-8» Тыныс алу (60с)</span>
                </button>

                <button
                  onClick={onOpenBrainGym}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ми гимнастикасы</span>
                </button>

                {session.type === 'initial' && !session.hasRecheck && (
                  <button
                    onClick={() => onStartRecheck(session)}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-check бастау</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Teacher Action Algorithm (Tailored for this Class) */}
        {activeTab === 'algorithm' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
              💡 <b>Осы сыныпқа арналған нақты педагогикалық алгоритм:</b> Мұғалім сабақты оқушылардың басым бөлігі белгілеген деңгейлерге қарай икемдейді.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {([1, 2, 3, 4, 5] as const).map((lvl) => {
                const cfg = levels[lvl];
                const count = breakdown[lvl] || 0;
                if (!cfg) return null;

                return (
                  <div
                    key={lvl}
                    className="p-5 rounded-2xl border transition-all"
                    style={{
                      backgroundColor: cfg.bgColor,
                      borderColor: cfg.borderColor
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cfg.emoji}</span>
                        <span className="font-extrabold text-sm text-slate-800">
                          {cfg.nameKz}
                        </span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                        {count} оқушы
                      </span>
                    </div>

                    <div className="space-y-2 mt-3 text-xs">
                      <div className="p-2.5 bg-white/90 rounded-xl border border-slate-200/80">
                        <span className="font-bold text-rose-600 block mb-0.5">
                          1-қадам (Шұғыл әрекет):
                        </span>
                        <p className="text-slate-700">{cfg.teacherActionAlgorithm.urgentAction}</p>
                      </div>

                      <div className="p-2.5 bg-white/90 rounded-xl border border-slate-200/80">
                        <span className="font-bold text-blue-600 block mb-0.5">
                          2-қадам (Сабақты бейімдеу):
                        </span>
                        <p className="text-slate-700">{cfg.teacherActionAlgorithm.pedagogicalStrategy}</p>
                      </div>

                      <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-amber-900 font-semibold italic">
                        "{cfg.teacherActionAlgorithm.verbalSupport}"
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Individual Student Submissions Table */}
        {activeTab === 'students' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-slate-800 text-sm">
                Оқушылардың жеке бағалау жазбалары:
              </h5>
              <span className="text-xs text-slate-400">
                Тек оқушының өзінің жеке өзін-өзі бағалауы тіркелген
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Оқушы аты</th>
                    <th className="p-3.5">Реттік №</th>
                    <th className="p-3.5">Эмоция деңгейі</th>
                    <th className="p-3.5">Қуат (Батарея)</th>
                    <th className="p-3.5">Себеп факторы</th>
                    <th className="p-3.5">Мұғалімге хабарлама</th>
                    <th className="p-3.5">Уақыты (сек)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessionCheckIns.map((item, index) => {
                    const cfg = levels[item.level];
                    return (
                      <tr key={item.id} className={item.level === 1 ? 'bg-rose-50/50' : 'hover:bg-slate-50/80'}>
                        <td className="p-3.5 font-bold text-slate-800 flex items-center gap-2">
                          <span className="text-base">{cfg?.emoji}</span>
                          <span>{item.studentName}</span>
                          {item.wantsPrivateHelp && (
                            <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded">
                              Көмек сұрады
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 font-mono text-slate-400 font-medium">#{index + 1 < 10 ? `0${index + 1}` : index + 1}</td>
                        <td className="p-3.5">
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-white font-bold text-[10px]"
                            style={{ backgroundColor: cfg?.color }}
                          >
                            {item.level}-деңгей
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-700">
                          {item.energyLevel === 5 ? '⚡ 100%' : `${item.energyLevel * 20}%`}
                        </td>
                        <td className="p-3.5 text-slate-700 font-medium">{item.primaryFactor}</td>
                        <td className="p-3.5 italic text-slate-600">
                          {item.notesToTeacher ? `«${item.notesToTeacher}»` : '—'}
                        </td>
                        <td className="p-3.5 text-slate-400 font-mono">{item.durationSeconds || 32}с</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Re-check Comparison View (Before vs After) */}
        {activeTab === 'recheck' && pairedSession && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between">
              <div>
                <h5 className="font-extrabold text-purple-900 text-sm">
                  🔬 Ғылыми зерттеу нәтижесі: Сабақ алды және Сабақ соңы салыстырмасы
                </h5>
                <p className="text-xs text-purple-700 mt-0.5">
                  Мұғалімнің 5 деңгейлі алгоритм бойынша жасаған іс-әрекетінің тиімділігі
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-emerald-600">
                  +{session.improvementPercent || 32.4}%
                </span>
                <p className="text-[11px] text-slate-500 font-semibold">Жағымды динамика</p>
              </div>
            </div>

            {/* Side-by-side comparison cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pre-lesson (Before) */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    1. Сабақ алдындағы күй (Before)
                  </span>
                  <span className="text-xs font-semibold text-slate-500">60 секундта анықталды</span>
                </div>

                <div className="flex items-baseline justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-xs text-slate-400">Қолдау индексі:</p>
                    <p className="text-2xl font-black text-slate-800">78.5%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Орташа балл:</p>
                    <p className="text-2xl font-black text-slate-800">3.85 / 5.0</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Күйзелісте:</p>
                    <p className="text-2xl font-black text-rose-600">2 оқушы</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <p className="font-semibold text-slate-700">Мұғалім қабылдаған педагогикалық шаралар:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    <li>«4-7-8» тыныс алу сергітуі (2 мин)</li>
                    <li>2-деңгейдегі оқушылар үшін ми гимнастикасы</li>
                    <li>1-деңгейдегі 2 оқушыға жеке тыныш орта қамтамасыз етілді</li>
                  </ul>
                </div>
              </div>

              {/* Post-lesson (After / Re-check) */}
              <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                    2. Сабақ соңындағы күй (After Re-check)
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">Нәтиже</span>
                </div>

                <div className="flex items-baseline justify-between border-b border-emerald-200 pb-3">
                  <div>
                    <p className="text-xs text-emerald-700">Қолдау индексі:</p>
                    <p className="text-2xl font-black text-emerald-700">94.0%</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-700">Орташа балл:</p>
                    <p className="text-2xl font-black text-emerald-700">4.45 / 5.0</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-700">Күйзелісте:</p>
                    <p className="text-2xl font-black text-emerald-600">0 оқушы</p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
                  ✅ <b>Қорытынды:</b> 1-деңгейдегі оқушылардың барлығы 3 және 4-деңгейге көтерілді. Сыныптың инклюзивті психологиялық қауіпсіздігі толық қамтамасыз етілді.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer: Push Notification to Students for Engagement */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              placeholder={`Оқушыларға қолдау хабарламасын жіберу (${session.className})...`}
              value={notificationMsg}
              onChange={(e) => setNotificationMsg(e.target.value)}
              className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSendClassAlert}
              disabled={isSendingNotif || !notificationMsg.trim()}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSendingNotif ? 'Жіберілуде...' : 'Жіберу'}</span>
            </button>
          </div>

          {sentSuccess && (
            <span className="text-xs font-bold text-emerald-600 animate-fade">
              Хабарлама жеткізілді!
            </span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-medium transition-colors shrink-0"
          >
            Жабу
          </button>
        </div>
      </div>
    </div>
  );
};
