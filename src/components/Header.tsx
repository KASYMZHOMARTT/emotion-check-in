import React from 'react';
import { TabletSmartphone, RefreshCw, GraduationCap, LogOut, User, Award, Users } from 'lucide-react';
import { SchoolClass, Teacher } from '../types';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  classes?: SchoolClass[];
  selectedClassId?: string;
  onSelectClass?: (classId: string) => void;
  showClassSelector?: boolean;
  onOpenKiosk: () => void;
  onResetDemo: () => void;
  onOpenSmartGrouping?: () => void;
  onOpenOfficialReport?: () => void;
  teacher?: Teacher;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Emotion Check-in Панелі',
  subtitle = 'Оқушының сабақ алдындағы эмоционалдық күйін 60 секундта анықтау және педагогикалық қолдау әдісі',
  classes = [],
  selectedClassId,
  onSelectClass,
  showClassSelector = false,
  onOpenKiosk,
  onResetDemo,
  onOpenSmartGrouping,
  onOpenOfficialReport,
  teacher,
  onLogout
}) => {
  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
      <div className="min-w-0 flex-1">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-2.5 shrink-0">
        {showClassSelector && classes.length > 0 && (
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-xs">
            <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Сынып:</span>
            <select
              value={selectedClassId}
              onChange={(e) => onSelectClass && onSelectClass(e.target.value)}
              className="bg-transparent text-xs font-black text-blue-700 focus:outline-none cursor-pointer pr-1"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.studentCount || 0} оқушы)
                </option>
              ))}
            </select>
          </div>
        )}

        {onOpenSmartGrouping && (
          <button
            onClick={onOpenSmartGrouping}
            className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Smart Grouping — Эмоциялық теңгерімді топқа бөлу"
          >
            <Users className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Smart Grouping</span>
          </button>
        )}

        {onOpenOfficialReport && (
          <button
            onClick={onOpenOfficialReport}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Мұғалімнің кезекті аттестациясына арналған ресми есеп"
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Ресми есеп (PDF)</span>
          </button>
        )}

        <button
          onClick={onOpenKiosk}
          className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm shadow-blue-500/20 cursor-pointer"
        >
          <TabletSmartphone className="w-4 h-4" />
          <span>Оқушылар Check-in (Планшет)</span>
        </button>

        {teacher && onLogout && (
          <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[11px]">
                {teacher.name ? teacher.name.charAt(0).toUpperCase() : 'М'}
              </div>
              <span className="text-xs font-bold text-slate-800 max-w-[130px] truncate" title={teacher.name}>
                {teacher.name}
              </span>
            </div>

            <button
              onClick={onLogout}
              title="Жүйеден шығу"
              className="p-2 sm:p-2.5 text-rose-500 hover:text-rose-700 bg-rose-50/70 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Шығу</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
