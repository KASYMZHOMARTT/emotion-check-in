import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  BrainCircuit, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  HeartHandshake, 
  Printer, 
  Clock, 
  FileText, 
  Share2, 
  Activity,
  Calendar,
  Layers
} from 'lucide-react';
import { SchoolClass, CheckInSession } from '../types';
import { api } from '../services/api';

interface AIInsightsViewProps {
  classes: SchoolClass[];
  sessions: CheckInSession[];
  selectedClassId?: string;
  onSelectClass?: (classId: string) => void;
  onOpenBreathingTimer: () => void;
  onOpenBrainGym: () => void;
  onSendNotification: (classId: string, title: string, message: string) => Promise<any>;
}

export const AIInsightsView: React.FC<AIInsightsViewProps> = ({
  classes,
  sessions,
  selectedClassId: propsSelectedClassId,
  onSelectClass,
  onOpenBreathingTimer,
  onOpenBrainGym,
  onSendNotification
}) => {
  const [localSelectedClassId, setLocalSelectedClassId] = useState<string>('all');
  const currentClassId = propsSelectedClassId !== undefined ? propsSelectedClassId : localSelectedClassId;

  const [loading, setLoading] = useState<boolean>(false);
  const [insights, setInsights] = useState<any>(null);
  const [generatedAt, setGeneratedAt] = useState<string>('Жаңа ғана');
  const [insightsCache, setInsightsCache] = useState<Record<string, any>>({});

  const handleClassChange = (newId: string) => {
    setLocalSelectedClassId(newId);
    if (onSelectClass) onSelectClass(newId);
    fetchInsights(newId);
  };

  const fetchInsights = async (clsId: string, forceRefresh: boolean = false) => {
    if (!forceRefresh && insightsCache[clsId]) {
      setInsights(insightsCache[clsId].data);
      setGeneratedAt(insightsCache[clsId].generatedAt);
      return;
    }

    setLoading(true);
    try {
      const res = await api.generateAIInsights(clsId);
      const timeStr = res.generatedAt ? new Date(res.generatedAt).toLocaleTimeString('kk-KZ') : 'Жаңа ғана';
      setInsights(res.data);
      setGeneratedAt(timeStr);
      setInsightsCache((prev) => ({
        ...prev,
        [clsId]: { data: res.data, generatedAt: timeStr }
      }));
    } catch (err: any) {
      console.error('Failed to generate insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights(currentClassId);
  }, [currentClassId]);

  // Filtered sessions for trend chart
  const filteredSessions = currentClassId === 'all'
    ? sessions
    : sessions.filter((s) => s.classId === currentClassId);

  const totalAllStudents = classes.reduce((sum, c) => sum + (c.studentCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 rounded-3xl p-6 text-white shadow-md shadow-blue-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-amber-300" />
                Gemini 3.8 Flash • AI Insights
              </span>
              <span className="text-blue-100 text-xs">
                Апталық Қолдау Индексін талдау
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              AI Педагогикалық Талдау және Қорытынды
            </h3>
            <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
              Gemini жасанды интеллектісі оқушылардың 60 секундтық Emotion Check-in нәтижелерін, 
              апталық трендтерін және себеп факторларын талдап, мұғалімге табиғи тілдегі нақты педагогикалық ұсынымдар ұсынады.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 shrink-0">
            <select
              value={currentClassId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="px-3.5 py-2.5 bg-white text-slate-800 rounded-xl text-xs font-bold shadow-xs focus:outline-none cursor-pointer border border-slate-200"
            >
              <option value="all">
                Барлық сыныптар ({totalAllStudents} оқушы)
              </option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.studentCount} оқушы)
                </option>
              ))}
            </select>

            <button
              onClick={() => fetchInsights(currentClassId, true)}
              disabled={loading}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Талдануда...' : 'AI Жаңарту'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors no-print"
              title="Педагогикалық есепті басып шығару"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Support Index Visual Progression Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Апталық Қолдау Индексінің Тренді (Weekly Support Index Progression)</span>
            </h4>
            <p className="text-xs text-slate-500">
              Сабақ алды және сабақ соңындағы (Re-check) психологиялық климат динамикасы
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              Орташа өсім: +32.4%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Жаңартылды: {generatedAt || 'Жаңа ғана'}
            </span>
          </div>
        </div>

        {/* Visual Trend Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {filteredSessions.slice(0, 4).map((sess, idx) => {
            const isRecheck = sess.type === 'recheck';
            return (
              <div
                key={sess.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isRecheck 
                    ? 'bg-purple-50/70 border-purple-200' 
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700 truncate">{sess.className}</span>
                  <span className={`px-2 py-0.2 rounded-full font-bold text-[10px] ${
                    isRecheck ? 'bg-purple-200 text-purple-800' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {isRecheck ? 'Re-check' : 'Сабақ алды'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-black text-slate-900">
                    {sess.supportIndex}%
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {sess.averageLevel} / 5.0
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      sess.supportIndex >= 85 ? 'bg-emerald-500' : sess.supportIndex >= 70 ? 'bg-blue-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${sess.supportIndex}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 truncate">
                  {sess.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main AI Pedagogical Insights Cards */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xs">
          <BrainCircuit className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <h4 className="text-base font-bold text-slate-800">
            Gemini API апталық Қолдау Индексі мен оқушылар жауаптарын талдауда...
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Оқушылардың 5 деңгейлік бөлінісі, күйзеліс себептері және сабақ тиімділігі есептелуде.
          </p>
        </div>
      ) : insights ? (
        <div className="space-y-6">
          {/* 1. Executive Summary Callout */}
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-3xl p-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-900 flex items-center justify-center font-black shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Негізгі педагогикалық қорытынды (Executive Summary)
                </span>
                <p className="text-sm font-semibold text-slate-800 leading-relaxed pt-1">
                  {insights.executiveSummary}
                </p>
              </div>
            </div>
          </div>

          {/* 2 Cols: Trend Analysis & Emotional Climate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trend Analysis */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Апталық Қолдау Индексінің Динамикасы</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {insights.weeklyTrendAnalysis}
              </p>
            </div>

            {/* Emotional Climate */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Сыныптың Эмоционалдық Климаты (5 деңгей бойынша)</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {insights.emotionalClimate}
              </p>
            </div>
          </div>

          {/* 2 Cols: Identified Risks & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identified Risks */}
            <div className="bg-white p-6 rounded-3xl border border-rose-200/90 shadow-xs space-y-3">
              <h4 className="font-extrabold text-rose-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Анықталған қауіп факторлары (Risk Factors):</span>
              </h4>
              <ul className="space-y-2">
                {insights.identifiedRisks?.map((risk: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      !
                    </span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pedagogical Recommendations */}
            <div className="bg-white p-6 rounded-3xl border border-blue-200/90 shadow-xs space-y-3">
              <h4 className="font-extrabold text-blue-900 text-sm flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-blue-600" />
                <span>Мұғалімге ұсынылатын педагогикалық әрекеттер:</span>
              </h4>
              <ul className="space-y-2">
                {insights.pedagogicalRecommendations?.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Scientific Research Conclusion Box */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-3xl p-6 space-y-2">
            <h4 className="font-extrabold text-blue-950 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Ғылыми-әдістемелік қорытынды (School Research Conclusion)</span>
            </h4>
            <p className="text-xs text-blue-900 leading-relaxed font-medium">
              {insights.scientificConclusion}
            </p>
          </div>

          {/* Action Toolkit Bar */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h5 className="font-bold text-slate-900 text-xs">
                Талдау негізінде сабақты қолдау:
              </h5>
              <p className="text-[11px] text-slate-500">
                Экспресс-жаттығуларды немесе қолдау хабарламасын дереу іске қосыңыз
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={onOpenBreathingTimer}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>«4-7-8» Тыныс алу таймері</span>
              </button>

              <button
                onClick={onOpenBrainGym}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ми гимнастикасы</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
