import React from 'react';
import { Users, BookOpen, ClipboardCheck, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  totalStudents?: number;
  classesCount?: number;
  activeTasksCount?: number;
  completedChecksCount?: number;
  averageScore?: number | string;
  supportIndex?: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalStudents = 66,
  classesCount = 3,
  activeTasksCount = 1,
  completedChecksCount = 33,
  averageScore = '3.58',
  supportIndex = 81.3
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Барлық оқушылар */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs transition-all hover:shadow-md hover:border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Барлық оқушылар</p>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
              {classesCount} сынып бойынша
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-600 bg-blue-50/50">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalStudents} <span className="text-sm font-medium text-slate-500">оқушы</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            Сыныптар контингенті толық тіркелген
          </p>
        </div>
      </div>

      {/* 2. Белсенді Check-in сессиялары */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs transition-all hover:shadow-md hover:border-slate-200">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-slate-600">Белсенді Check-in</p>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-500">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeTasksCount}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-normal">
            60 секундтық скрининг жүруде
          </p>
        </div>
      </div>

      {/* 3. Өткізілген Emotion Check-in */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs transition-all hover:shadow-md hover:border-slate-200">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-slate-600">Өткізілген Check-in</p>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500">
            <ClipboardCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {completedChecksCount}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-normal">
            Жеке өзін-өзі бағалаулар тіркелді
          </p>
        </div>
      </div>

      {/* 4. Қолдау индексі / Орташа балл */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs transition-all hover:shadow-md hover:border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Қолдау индексі</p>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Support Index: {supportIndex}%
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {averageScore} <span className="text-sm font-medium text-slate-400">/ 5.0</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-normal">
            Орташа эмоционалдық деңгей
          </p>
        </div>
      </div>
    </div>
  );
};
