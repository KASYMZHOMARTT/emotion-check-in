import React, { useState } from 'react';
import { X, Printer, Layers, Users, CheckCircle2, FileText, BadgeCheck } from 'lucide-react';
import { SchoolClass, Student, EmotionLevelConfig } from '../types';

interface PrintableCardsModalProps {
  classes: SchoolClass[];
  students: Student[];
  levels: Record<number, EmotionLevelConfig>;
  onClose: () => void;
}

export const PrintableCardsModal: React.FC<PrintableCardsModalProps> = ({
  classes,
  students,
  levels,
  onClose
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [cardType, setCardType] = useState<'emotion_cards' | 'student_badges'>('emotion_cards');

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0] || {
    name: '9 «А» сыныбы',
    studentCount: 20
  };
  const filteredStudents = students.filter((s) => s.classId === selectedClassId || !s.classId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Қағаз форматы және Смартфонсыз сыныптар үшін
              </h3>
              <p className="text-xs text-slate-500">
                Смартфоны жоқ оқушыларға арналған 5 деңгейлі карточкалар мен оқушылардың жеке үстел бейдждері
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Басып шығару (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCardType('emotion_cards')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                cardType === 'emotion_cards'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              5 деңгейлі сигналдық карточкалар
            </button>
            <button
              onClick={() => setCardType('student_badges')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                cardType === 'student_badges'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Оқушылардың жеке үстел бейдждері
            </button>
          </div>

          {cardType === 'student_badges' && (
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.studentCount} оқушы)
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Printable Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
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
                      className="p-5 rounded-2xl border-2 border-dashed flex flex-col justify-between h-56 transition-all"
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
              <div className="no-print p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 font-medium">
                🪪 <b>Оқушылардың жеке үстел бейдждері:</b> Оқушылар ортақ планшетке немесе компьютерге келгенде өз есімін 1 рет басу арқылы тікелей тіркеледі (ешқандай PIN-код талап етілмейді).
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredStudents.map((st, index) => (
                  <div
                    key={st.id}
                    className="p-3.5 rounded-2xl border border-slate-300 bg-white shadow-xs flex flex-col items-center text-center space-y-2 relative overflow-hidden"
                  >
                    {/* Top School/Class tag */}
                    <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{selectedClass.name}</span>
                      <span className="font-bold text-blue-600">#{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 font-black flex items-center justify-center text-sm shadow-2xs">
                      {st.name.charAt(0)}
                    </div>
                    
                    <p className="text-xs font-bold text-slate-900 truncate w-full leading-tight">
                      {st.name}
                    </p>

                    <div className="bg-emerald-50 px-2 py-1 rounded-xl border border-emerald-200/80 w-full flex items-center justify-center gap-1">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-[10px] font-bold text-emerald-800">
                        1 басумен тіркелу
                      </span>
                    </div>

                    {/* 5 Emotion Level Color Palette Indicators */}
                    <div className="pt-1 flex items-center justify-center gap-1.5 opacity-80" title="5 деңгейлі түстер палитрасы">
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
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end no-print">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Жабу
          </button>
        </div>
      </div>
    </div>
  );
};
