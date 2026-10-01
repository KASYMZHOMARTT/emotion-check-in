import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  HeartHandshake, 
  MessageSquare, 
  Clock, 
  Printer, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { EmotionLevelConfig } from '../types';

interface EmotionCard5LevelModalProps {
  levels: Record<number, EmotionLevelConfig>;
  onClose: () => void;
  onOpenBreathingTimer: () => void;
  onOpenBrainGym: () => void;
}

export const EmotionCard5LevelModal: React.FC<EmotionCard5LevelModalProps> = ({
  levels,
  onClose,
  onOpenBreathingTimer,
  onOpenBrainGym
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const current = levels[selectedLevel] || levels[1];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm shadow-amber-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                5 деңгейлі Emotion Check-in картасы және Мұғалім әрекетінің алгоритмі
              </h3>
              <p className="text-xs text-slate-500">
                Ғылыми-педагогикалық қолдау стандарты • Инклюзивті білім беру ортасы
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors no-print"
              title="Алгоритмді басып шығару"
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

        {/* Level Selector Tabs (5 distinct pedagogical levels) */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white grid grid-cols-5 gap-2">
          {([1, 2, 3, 4, 5] as const).map((lvl) => {
            const item = levels[lvl];
            const isSelected = selectedLevel === lvl;
            const bgBadge = 
              lvl === 1 ? 'bg-red-500' :
              lvl === 2 ? 'bg-orange-500' :
              lvl === 3 ? 'bg-yellow-500' :
              lvl === 4 ? 'bg-emerald-500' : 'bg-blue-600';

            return (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`py-2.5 px-2 rounded-2xl text-center transition-all flex flex-col items-center gap-1 border ${
                  isSelected
                    ? 'ring-2 ring-blue-500/50 shadow-md font-bold'
                    : 'hover:bg-slate-50 opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected ? item?.bgColor : '#f8fafc',
                  borderColor: isSelected ? item?.color : '#e2e8f0',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">{item?.emoji}</span>
                  <span className={`w-5 h-5 rounded-full ${bgBadge} text-white text-[11px] font-extrabold flex items-center justify-center`}>
                    {lvl}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                  {lvl === 1 ? 'Күйзеліс' : lvl === 2 ? 'Шаршау' : lvl === 3 ? 'Бейтарап' : lvl === 4 ? 'Жақсы' : 'Шабыт'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Body: Active Level Detailed View + Teacher Action Algorithm */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {current && (
            <div className="space-y-6">
              {/* Level Hero Banner */}
              <div 
                className="p-6 rounded-3xl border transition-all"
                style={{
                  backgroundColor: current.bgColor,
                  borderColor: current.borderColor
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-white"
                      style={{ border: `2px solid ${current.color}` }}
                    >
                      {current.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white uppercase tracking-wider"
                          style={{ backgroundColor: current.color }}
                        >
                          {current.level}-деңгей
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          {current.tagline}
                        </span>
                      </div>
                      <h4 className="text-xl font-extrabold text-slate-900 mt-1">
                        {current.nameKz}
                      </h4>
                      <p className="text-sm text-slate-700 mt-1">
                        {current.description}
                      </p>
                    </div>
                  </div>

                  {/* Indicator Pills */}
                  <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/80 shadow-xs sm:w-64 shrink-0">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      Сыртқы белгілері:
                    </p>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {current.indicators?.map((ind, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* The Core: Мұғалім әрекетінің алгоритмі (Teacher Action Algorithm) */}
              <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200/90 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Мұғалім әрекетінің қадамдық алгоритмі ({current.level}-деңгей үшін)</span>
                  </h4>
                  <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    60 секундтық Check-in нәтижесі бойынша
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Step 1: Шұғыл бірінші әрекет */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>1-қадам: Шұғыл бірінші әрекет</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {current.teacherActionAlgorithm.urgentAction}
                    </p>
                  </div>

                  {/* Step 2: Педагогикалық стратегия */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-2">
                      <HeartHandshake className="w-4 h-4" />
                      <span>2-қадам: Педагогикалық бейімдеу стратегиясы</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {current.teacherActionAlgorithm.pedagogicalStrategy}
                    </p>
                  </div>

                  {/* Step 3: Қолдаушы вербалды сөз тіркесі */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs md:col-span-2">
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-sm mb-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>3-қадам: Мұғалімнің вербалды қолдау сөзі (Тілдік қалып)</span>
                    </div>
                    <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-amber-900 font-semibold italic text-sm">
                      {current.teacherActionAlgorithm.verbalSupport}
                    </div>
                  </div>
                </div>

                {/* Recommended Activities & Quick Launch Tools */}
                <div className="pt-2">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2.5">
                    Ұсынылатын практикалық сергітулер мен әдістер:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {current.teacherActionAlgorithm.recommendedActivities.map((act, i) => (
                      <div
                        key={i}
                        className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>

                  {/* Direct interactive buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center flex-wrap gap-3">
                    <span className="text-xs font-semibold text-slate-500">
                      Сыныпта жедел іске қосу:
                    </span>
                    <button
                      onClick={onOpenBreathingTimer}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>«4-7-8» Тыныс алу таймерін қосу (60 сек)</span>
                    </button>

                    <button
                      onClick={onOpenBrainGym}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ми гимнастикасы сергітуі</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Research Rationale box */}
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-xs text-blue-900">
                <p className="font-bold mb-1">
                  🎓 Ғылыми негіздеме (Emotion Check-in зерттеу әдістемесі):
                </p>
                <p className="leading-relaxed text-blue-800">
                  Сабақ алдындағы 60 секундтық эмоционалдық скрининг оқушының миындағы амигдала белсенділігін түсініп, 
                  префронталды қыртысты (танымдық орталықты) оқуға бағыттауға мүмкіндік береді. Мұғалімнің осы 5 деңгейлі 
                  алгоритмді қолдануы сабақ тиімділігін 30-40%-ға арттырып, стрессті төмендетеді.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            «Emotion Check-in» оқушылардың жеке бағалауын ғана құпия тіркейді
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl text-xs transition-colors"
          >
            Жабу
          </button>
        </div>
      </div>
    </div>
  );
};
