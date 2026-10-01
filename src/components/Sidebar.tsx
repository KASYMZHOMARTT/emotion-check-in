import React from 'react';
import { 
  BookOpen, 
  LayoutDashboard, 
  ClipboardCheck, 
  Users, 
  AlertCircle, 
  Settings, 
  PanelLeftClose, 
  PanelLeftOpen,
  Layers, 
  Printer, 
  TabletSmartphone, 
  BrainCircuit, 
  FileText,
  LogOut,
  Award 
} from 'lucide-react';
import { Teacher } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  teacher?: Teacher;
  unreadAlertsCount: number;
  onOpenKiosk: () => void;
  onOpenPrintCards: () => void;
  onOpenPdfTips?: () => void;
  onOpenSmartGrouping?: () => void;
  onOpenOfficialReport?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  teacher,
  unreadAlertsCount,
  onOpenKiosk,
  onOpenPrintCards,
  onOpenPdfTips,
  onOpenSmartGrouping,
  onOpenOfficialReport,
  onLogout
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Басты бет', icon: LayoutDashboard },
    { id: 'sessions', label: 'Check-in сессиялары', icon: BookOpen, badge: 'Белсенді' },
    { id: 'ai-insights', label: 'AI Аналитика (Gemini)', icon: BrainCircuit, badge: 'AI' },
    { id: 'students', label: 'Сыныптар & Оқушылар', icon: Users },
    { id: 'analytics', label: 'Бағалар & Зерттеу Аналитикасы', icon: ClipboardCheck },
    { id: 'notifications', label: 'Күйзеліс дабылдары', icon: AlertCircle, count: unreadAlertsCount },
    { id: 'settings', label: 'Баптаулар', icon: Settings },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200/90 flex flex-col transition-all duration-300 select-none z-30 h-full shrink-0 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top Header: Clean, non-overlapping in both collapsed & expanded modes */}
      <div 
        className={`border-b border-slate-100 shrink-0 transition-all ${
          collapsed 
            ? 'p-2.5 flex flex-col items-center gap-2 justify-center' 
            : 'p-4 flex items-center justify-between'
        }`}
      >
        <div 
          onClick={collapsed ? onToggleCollapse : undefined}
          className={`flex items-center gap-2.5 overflow-hidden ${
            collapsed ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
          }`}
          title={collapsed ? 'Мәзірді ашу' : undefined}
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="leading-tight truncate">
              <h1 className="font-bold text-slate-800 text-[14px] truncate">Emotion Check-in</h1>
              <p className="text-[11px] text-blue-600 font-semibold truncate">Педагогикалық қолдау</p>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          title={collapsed ? 'Мәзірді ашу' : 'Мәзірді жию'}
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4 text-blue-600" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links Scrollable Body: Compact & Adaptive */}
      <div className="flex-1 py-3 px-2.5 space-y-4 overflow-y-auto overflow-x-hidden">
        <div>
          {!collapsed && (
            <p className="px-2 mb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Навигация
            </p>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl transition-all duration-150 group relative ${
                    collapsed
                      ? 'justify-center p-2 h-10'
                      : 'gap-2.5 px-3 py-2 text-[13px] font-semibold text-left'
                  } ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-2xs border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span 
                      className={`absolute bg-blue-600 rounded-full z-10 ${
                        collapsed 
                          ? 'left-1 top-2 bottom-2 w-1' 
                          : 'left-1 top-1.5 bottom-1.5 w-1'
                      }`} 
                    />
                  )}

                  <Icon
                    className={`w-4.5 h-4.5 shrink-0 transition-transform ${
                      isActive 
                        ? 'text-blue-600 font-bold scale-105' 
                        : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />

                  {!collapsed && (
                    <span className={`truncate text-xs sm:text-[13px] ${isActive ? 'font-bold text-blue-700' : 'font-medium'}`}>
                      {item.label}
                    </span>
                  )}

                  {!collapsed && item.count && item.count > 0 ? (
                    <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                      {item.count}
                    </span>
                  ) : null}

                  {collapsed && item.count && item.count > 0 ? (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Tools for 60s Check-in & Research */}
        <div className="pt-2 border-t border-slate-100">
          {!collapsed && (
            <p className="px-2 mb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Зерттеу құралдары
            </p>
          )}
          <div className="space-y-1">
            <button
              onClick={() => onSelectTab('matrix')}
              className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all ${
                collapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-1.5'
              } text-amber-800 bg-amber-50/70 hover:bg-amber-100 border border-amber-200/70`}
              title="5 деңгейлі карта және мұғалім алгоритмі"
            >
              <Layers className="w-4 h-4 text-amber-600 shrink-0" />
              {!collapsed && <span className="truncate">5-деңгейлі карта</span>}
            </button>

            <button
              onClick={onOpenKiosk}
              className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all ${
                collapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-1.5'
              } text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 border border-indigo-200/70`}
              title="Ортақ планшет / Киоск режимі"
            >
              <TabletSmartphone className="w-4 h-4 text-indigo-600 shrink-0" />
              {!collapsed && <span className="truncate">Ортақ Планшет</span>}
            </button>

            <button
              onClick={onOpenPrintCards}
              className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all ${
                collapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-1.5'
              } text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200`}
              title="Қағаз карточкаларды басып шығару"
            >
              <Printer className="w-4 h-4 text-slate-600 shrink-0" />
              {!collapsed && <span className="truncate">Қағаз карталар</span>}
            </button>

            {onOpenSmartGrouping && (
              <button
                onClick={onOpenSmartGrouping}
                className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all ${
                  collapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-1.5'
                } text-purple-800 bg-purple-50/80 hover:bg-purple-100 border border-purple-200/80`}
                title="Smart Grouping — Эмоциялық теңгерімді топтарға бөлу"
              >
                <Users className="w-4 h-4 text-purple-600 shrink-0" />
                {!collapsed && <span className="truncate">Smart Grouping (Топ)</span>}
              </button>
            )}

            {onOpenOfficialReport && (
              <button
                onClick={onOpenOfficialReport}
                className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all ${
                  collapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-1.5'
                } text-emerald-800 bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-300/80 font-bold`}
                title="Ресми Аттестациялық және Әдістемелік есеп (PDF)"
              >
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                {!collapsed && <span className="truncate">Ресми Есеп (Акт)</span>}
              </button>
            )}

            {onOpenPdfTips && (
              <button
                onClick={onOpenPdfTips}
                className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all ${
                  collapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-1.5'
                } text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200`}
                title="Мұғалімдерге арналған педагогикалық кеңестер жинағын PDF форматында жүктеу"
              >
                <FileText className="w-4 h-4 text-slate-600 shrink-0" />
                {!collapsed && <span className="truncate">Кеңестер жинағы (PDF)</span>}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Teacher Workspace Badge */}
      <div className="p-2.5 border-t border-slate-100 bg-slate-50/70 shrink-0">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {teacher?.name ? teacher.name.charAt(0).toUpperCase() : 'М'}
            </div>
            {!collapsed && (
              <div className="overflow-hidden leading-tight">
                <p className="text-xs font-bold text-slate-800 truncate">{teacher?.name || 'Мұғалім'}</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">{teacher?.school || 'Оқушыларды бақылау'}</p>
              </div>
            )}
          </div>

          {!collapsed && onLogout && (
            <button
              onClick={onLogout}
              title="Жүйеден шығу"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
