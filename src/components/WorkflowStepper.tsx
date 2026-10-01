import React from 'react';
import { 
  Building2, 
  Users, 
  Clock, 
  Database, 
  Activity, 
  BarChart3, 
  Sparkles, 
  RotateCcw, 
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  TabletSmartphone
} from 'lucide-react';

interface WorkflowStepperProps {
  onStepClick: (stepId: string) => void;
  activeStep?: string;
  hasActiveSession?: boolean;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  onStepClick,
  hasActiveSession = true
}) => {
  const steps = [
    {
      id: 'step-class',
      num: 1,
      title: 'Сыныпты таңдау',
      subtitle: 'Мұғалім сыныпқа кіреді',
      icon: Building2,
      actionText: 'Сыныптар',
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      id: 'step-students',
      num: 2,
      title: 'Оқушылар тізімі',
      subtitle: 'Экранда оқушылар шығады',
      icon: Users,
      actionText: 'Тізім',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      id: 'step-kiosk',
      num: 3,
      title: 'Оқушы өзін басады',
      subtitle: '1 басумен тікелей бастау',
      icon: TabletSmartphone,
      actionText: 'Планшет',
      color: 'bg-sky-50 text-sky-600 border-sky-200'
    },
    {
      id: 'step-start',
      num: 4,
      title: '60с Emotion Check-in',
      subtitle: '5 деңгейлі картадан таңдау',
      icon: Clock,
      actionText: '60с тест',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      id: 'step-db',
      num: 5,
      title: 'Базаға сақталу',
      subtitle: 'Жедел тіркеледі',
      icon: Database,
      actionText: 'Деректер',
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      id: 'step-index',
      num: 6,
      title: 'Қолдау Индексі',
      subtitle: 'Support Index есептелуі',
      icon: Activity,
      actionText: 'Индекс',
      color: 'bg-rose-50 text-rose-600 border-rose-200'
    },
    {
      id: 'step-analytics',
      num: 7,
      title: 'Сынып аналитикасы',
      subtitle: '5 түсті үлестірім',
      icon: BarChart3,
      actionText: 'Аналитика',
      color: 'bg-violet-50 text-violet-600 border-violet-200'
    },
    {
      id: 'step-algorithm',
      num: 8,
      title: 'Мұғалім алгоритмі',
      subtitle: 'Педагогикалық қолдау',
      icon: Sparkles,
      actionText: 'Алгоритм',
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      id: 'step-recheck',
      num: 9,
      title: 'Re-check бастау',
      subtitle: 'Сабақ соңында қайталау',
      icon: RotateCcw,
      actionText: 'Re-check',
      color: 'bg-teal-50 text-teal-600 border-teal-200'
    },
    {
      id: 'step-compare',
      num: 10,
      title: 'Нәтиже салыстыру',
      subtitle: 'Before & After динамика',
      icon: TrendingUp,
      actionText: 'Салыстыру',
      color: 'bg-blue-50 text-blue-700 border-blue-300'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
            Негізгі жұмыс алгоритмі (Main Research Workflow)
          </h4>
        </div>
        <p className="text-xs text-slate-500">
          Сынып таңдау → Оқушы өз атын басады → 60с тест → Сақталу → Қолдау Индексі → Алгоритм
        </p>
      </div>

      {/* Horizontal Steps Scroll */}
      <div className="overflow-x-auto pb-2 pt-1">
        <div className="flex items-center gap-2 min-w-[980px]">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <React.Fragment key={st.id}>
                <div
                  onClick={() => onStepClick(st.id)}
                  className={`flex-1 min-w-[140px] p-3 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:scale-[1.02] bg-white ${
                    st.id === 'step-kiosk' || st.id === 'step-algorithm'
                      ? 'border-blue-400 ring-2 ring-blue-100'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                      {st.num}
                    </span>
                    <div className={`p-1.5 rounded-lg border ${st.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h5 className="font-extrabold text-slate-800 text-xs truncate">
                    {st.title}
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                    {st.subtitle}
                  </p>

                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-blue-600">
                    <span>{st.actionText}</span>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <div className="text-slate-300 font-bold shrink-0 select-none">
                    →
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
