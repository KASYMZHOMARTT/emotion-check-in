import React, { useState } from 'react';
import { X, Printer, Layers, Users, CheckCircle2, FileText, BadgeCheck, Sparkles, ExternalLink } from 'lucide-react';
import { SchoolClass, Student, EmotionLevelConfig } from '../types';

interface PrintableCardsModalProps {
  classes: SchoolClass[];
  students: Student[];
  levels: Record<number, EmotionLevelConfig>;
  initialClassId?: string;
  onClose: () => void;
  onStartCheckInForStudent?: (student: Student) => void;
}

export const PrintableCardsModal: React.FC<PrintableCardsModalProps> = ({
  classes,
  students,
  levels,
  initialClassId,
  onClose,
  onStartCheckInForStudent
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId || classes[0]?.id || '');
  const [cardType, setCardType] = useState<'emotion_cards' | 'student_badges'>('student_badges');

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0] || ({
    id: '',
    name: 'Сынып',
    grade: '',
    subject: '',
    studentCount: 0,
    room: '',
    schedule: ''
  } as SchoolClass);
  const filteredStudents = students.filter((s) => s.classId === selectedClassId || (!s.classId && classes[0]?.id === selectedClassId));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          #printable-modal-content {
            display: block !important;
            position: static !important;
            max-height: none !important;
            overflow: visible !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Қағаз форматы және Оқушылардың жеке үстел бейдждері
              </h3>
              <p className="text-xs text-slate-500">
                Партаға қойылатын оқушы визиткалары, 5 деңгейлі сигналдық карточкалар және 1 басумен Check-in ашу
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Басып шығару (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCardType('student_badges')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                cardType === 'student_badges'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🪪 Оқушылардың жеке үстел бейдждері
            </button>
            <button
              onClick={() => setCardType('emotion_cards')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                cardType === 'emotion_cards'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              5 деңгейлі сигналдық карточкалар
            </button>
          </div>

          {cardType === 'student_badges' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Сынып:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.studentCount} оқушы)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Printable Content Body */}
        <div id="printable-modal-content" className="p-6 overflow-y-auto flex-1">
          {cardType === 'emotion_cards' ? (
            <div className="space-y-4">
              <div className="no-print p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                📄 <b>Қолдану тәсілі:</b> Төмендегі 5 түрлі-түсті карточканы қалың қағазға басып шығарып, әр оқушының партасына немесе сынып қорабына қойыңыз. Смартфон болмаған жағдайда оқушылар сабақ басында тиісті карточканы көтереді.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {([1, 2, 3, 4, 5] as const).map((lvl) => {
                  const item = levels[lvl];
                  return (
                    <div
                      key={lvl}
                      className="p-5 rounded-2xl border-2 border-dashed flex flex-col justify-between h-56 transition-all bg-white"
                      style={{
                        backgroundColor: item?.bgColor,
                        borderColor: item?.color
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-white text-[10px] font-black uppercase"
                            style={{ backgroundColor: item?.color }}
                          >
                            {lvl}-деңгей
                          </span>
                          <span className="text-3xl">{item?.emoji}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm mt-2">
                          {item?.nameKz.split(':')[1] || item?.nameKz}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {item?.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-300/40 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                        <span>Emotion Check-in v2.4</span>
                        <span>Қағаз карточкасы</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="no-print p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 text-xs text-blue-950 font-medium space-y-1 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                  <span>🪪 Оқушының жеке үстел бейджі (Desk Badge) не үшін керек?</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <b>1. Офлайн қолдану:</b> Принтерден басып шығарып, қиып, әр оқушының партасына қойылады. Оқушы өз бейджіне қарап көңіл-күйін көрсетеді.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <b>2. Экранда қолдану (Интерактивті):</b> Кез келген оқушының бейджін басу арқылы сол оқушының <b>60 секундтық жеке Emotion Check-in скринингін бірден ашуға</b> болады.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {filteredStudents.map((st, index) => (
                  <div
                    key={st.id}
                    onClick={() => {
                      if (onStartCheckInForStudent) {
                        onStartCheckInForStudent(st);
                      }
                    }}
                    className="p-3.5 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center text-center space-y-2 relative overflow-hidden group cursor-pointer"
                    title={`«${st.name}» үшін Emotion Check-in ашу`}
                  >
                    {/* Top School/Class tag */}
                    <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="truncate max-w-[95px] font-bold text-slate-600">{selectedClass.name}</span>
                      <span className="font-bold text-blue-600">#{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                    </div>

                    <div className="w-11 h-11 rounded-2xl bg-blue-100 group-hover:bg-blue-600 group-hover:text-white text-blue-800 font-black flex items-center justify-center text-sm shadow-2xs transition-all">
                      {st.name.charAt(0)}
                    </div>
                    
                    <p className="text-xs font-extrabold text-slate-900 truncate w-full leading-tight">
                      {st.name}
                    </p>

                    {/* Interactive 1-click Checkin button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onStartCheckInForStudent) {
                          onStartCheckInForStudent(st);
                        }
                      }}
                      className="bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 px-2 py-1.5 rounded-xl border border-emerald-200/90 w-full flex items-center justify-center gap-1 transition-all cursor-pointer font-extrabold text-[10px] shadow-2xs"
                      title="Осы оқушының 60 секундтық скринингін ашу"
                    >
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white shrink-0" />
                      <span>Check-in бастау 🚀</span>
                    </button>

                    {/* 5 Emotion Level Color Palette Indicators */}
                    <div className="pt-0.5 flex items-center justify-center gap-1.5 opacity-80" title="5 деңгейлі түстер палитрасы">
                      <span className="w-2 h-2 rounded-full bg-rose-500" title="1-деңгей (Күйзеліс)" />
                      <span className="w-2 h-2 rounded-full bg-orange-500" title="2-деңгей (Шаршау)" />
                      <span className="w-2 h-2 rounded-full bg-amber-400" title="3-деңгей (Бейтарап)" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="4-деңгей (Жақсы)" />
                      <span className="w-2 h-2 rounded-full bg-blue-500" title="5-деңгей (Шабыт)" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between no-print">
          <p className="text-xs text-slate-500">
            {cardType === 'student_badges'
              ? `Барлығы: ${filteredStudents.length} оқушы бейджі`
              : '5 деңгейлі педагогикалық түстер карточкалары'}
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Жабу
          </button>
        </div>
      </div>
    </div>
  );
};
