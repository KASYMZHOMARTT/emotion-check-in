import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  HeartHandshake, 
  BrainCircuit, 
  Layers, 
  Clock, 
  TrendingUp,
  UserCheck,
  BookOpen
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CheckInSession, SchoolClass, EmotionLevelConfig, Teacher, CheckInRecord } from '../types';

interface PedagogicalTipsPdfModalProps {
  session: CheckInSession;
  classes: SchoolClass[];
  teacher?: Teacher;
  levels: Record<number, EmotionLevelConfig>;
  checkIns?: CheckInRecord[];
  onClose: () => void;
}

export const PedagogicalTipsPdfModal: React.FC<PedagogicalTipsPdfModalProps> = ({
  session,
  classes,
  teacher,
  levels,
  checkIns = [],
  onClose
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const currentClass = classes.find((c) => c.id === session.classId) || {
    id: session.classId,
    name: session.className || classes[0]?.name || 'Сынып',
    studentCount: session.totalStudents || classes[0]?.studentCount || 0,
    room: classes[0]?.room || 'Кабинет'
  };

  const urgentCount = session.urgentSupportCount || 0;
  const supportIndex = session.supportIndex || 77.5;
  const recheckStats = session.recheckStats || {
    supportIndex: 92.3,
    averageLevel: 4.10,
    improvementPercent: 19.1
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `Emotion_CheckIn_Педагогикалық_Кеңестер_${currentClass.name.replace(/\s+/g, '_')}_${session.date || '2026-09-30'}.pdf`;
      pdf.save(fileName);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('PDF құру кезінде қате орын алды. Браузердің Басып шығару (Print) мүмкіндігін пайдаланыңыз.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Action Bar (No Print) */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Әдістемелік құжат
                </span>
                <span className="text-xs text-slate-500">• Сабақтан кейінгі қолдау</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Мұғалімге арналған «Педагогикалық кеңестер жинағы» (PDF)
              </h3>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Басып шығару</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-extrabold rounded-xl shadow-sm shadow-indigo-500/20 transition-all flex items-center gap-2"
            >
              <Download className={`w-4 h-4 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
              <span>{isGeneratingPdf ? 'PDF құрылуда...' : '📥 PDF жүктеп алу'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs font-bold text-emerald-800 flex items-center gap-2 no-print">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>PDF сәтті жүктелді! Файл компьютеріңіздің «Жүктемелер» (Downloads) папкасына сақталды.</span>
          </div>
        )}

        {/* ================= Printable Document Canvas ================= */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
          <div 
            ref={printRef}
            className="bg-white w-full max-w-[780px] p-8 sm:p-10 rounded-2xl shadow-md border border-slate-200 space-y-6 text-slate-800"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}
          >
            {/* Header / School Stamp */}
            <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-indigo-600">
                  Ғылыми-педагогикалық жоба: «Emotion Check-in»
                </p>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 leading-snug">
                  Сабақтан кейінгі педагогикалық кеңестер жинағы мен әрекет хаттамасы
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Өнім: 5 деңгейлі Emotion Check-in картасы + мұғалім әрекетінің жедел алгоритмі
                </p>
              </div>

              <div className="text-right shrink-0 sm:border-l sm:border-slate-200 sm:pl-4 space-y-1">
                <span className="text-xs font-bold text-slate-900 block">
                  {teacher?.school || '№87 IT-лицейі'}
                </span>
                <span className="text-[11px] text-slate-600 block">
                  Педагог: {teacher?.name || 'Айсұлу Нұрланқызы'}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block">
                  Күні: {session.date || new Date().toISOString().split('T')[0]}
                </span>
              </div>
            </div>

            {/* Session Metadata & Real Index Stats */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Сынып:</span>
                  <span className="text-sm font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-lg">
                    {currentClass.name}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span>Тексерілген оқушылар: <b>{session.submissionCount || 20} / {session.totalStudents || 20}</b></span>
                  <span>•</span>
                  <span>Өткізілген уақыт: <b>60 секунд</b></span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Сабақ алдындағы Қолдау Индексі:
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    {supportIndex}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">Орташа балл: {session.averageLevel || 3.35} / 5.0</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Сабақ соңындағы Re-check:
                  </span>
                  <span className="text-xl font-black text-emerald-600">
                    {recheckStats.supportIndex}%
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold block">
                    +{recheckStats.improvementPercent}% оң нәтиже
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Шұғыл назар аудару:
                  </span>
                  <span className={`text-xl font-black ${urgentCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {urgentCount > 0 ? `${urgentCount} оқушы` : 'Жоқ'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {urgentCount > 0 ? 'Жеке қолдау көрсетілді' : 'Барлығы қалыпты'}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Section: 5-Level Pedagogical Tips Collection */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>5 деңгей бойынша сабақтан кейінгі педагогикалық кеңестер жинағы:</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Мұғалімнің келесі сабақты жоспарлауына және инклюзивті ортаны қамтамасыз етуіне арналған нұсқаулық
                </p>
              </div>

              <div className="space-y-3.5">
                {/* Level 1: Crisis / Distress */}
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🆘</span>
                      <h3 className="text-xs sm:text-sm font-black text-rose-900">
                        1-деңгей: Қатты күйзеліс / Ашу / Мазасыздық (Шұғыл назар)
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">
                      Сыныпта: {session.breakdown?.[1] || 0} оқушы
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1.5 pl-7">
                    <p>
                      <b>Сабақтан кейінгі іс-әрекет:</b> Сынып алдында жарияламай, сабақ аяқталған соң оқушымен оңаша 1-2 минут жылы сөйлесу («Сенің көңіл-күйіңді түсіндім, бәрі жақсы болады»).
                    </p>
                    <p>
                      <b>Ұсынылатын педагогикалық шешім:</b> Үй тапсырмасын жеңілдету немесе орындау мерзімін ұзарту. Мектеп психологына құпия хабарлама жолдау.
                    </p>
                    <p className="text-[11px] text-rose-800 italic">
                      ⚠️ Ескерту: Күйзелістегі баланы тақтаға шығарып қинауға немесе төмен бағамен жазалауға қатаң тыйым салынады.
                    </p>
                  </div>
                </div>

                {/* Level 2: Fatigue */}
                <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🥱</span>
                      <h3 className="text-xs sm:text-sm font-black text-orange-900">
                        2-деңгей: Шаршау / Төмен қуат / Ұйқының қанбауы
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-200 text-orange-800">
                      Сыныпта: {session.breakdown?.[2] || 0} оқушы
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1.5 pl-7">
                    <p>
                      <b>Сабақтан кейінгі іс-әрекет:</b> Келесі сабақты монотонды теориямен емес, 60 секундтық кинезиологиялық ми гимнастикасымен бастауды жоспарлау.
                    </p>
                    <p>
                      <b>Ұсынылатын педагогикалық шешім:</b> Оқушының ұйқы және демалу режимі бойынша ата-анамен байланысу. Сабақта қозғалысты тапсырмаларды көбейту.
                    </p>
                  </div>
                </div>

                {/* Level 3: Neutral */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">😐</span>
                      <h3 className="text-xs sm:text-sm font-black text-amber-900">
                        3-деңгей: Бейтарап / Алаңдаушылық / Қалыпты
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                      Сыныпта: {session.breakdown?.[3] || 0} оқушы
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1.5 pl-7">
                    <p>
                      <b>Сабақтан кейінгі іс-әрекет:</b> Оқушының зейінін шоғырландыру үшін «Қармақ» әдісін (Hook question) дайындау.
                    </p>
                    <p>
                      <b>Ұсынылатын педагогикалық шешім:</b> Оқу материалын баланың жеке тәжірибесімен байланыстыратын практикалық тапсырмалар беру.
                    </p>
                  </div>
                </div>

                {/* Level 4: Optimal / Ready to Learn */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">😊</span>
                      <h3 className="text-xs sm:text-sm font-black text-emerald-900">
                        4-деңгей: Жақсы / Зейінді / Оқуға дайын (Оңтайлы танымдық аймақ)
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                      Сыныпта: {session.breakdown?.[4] || 0} оқушы
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1.5 pl-7">
                    <p>
                      <b>Сабақтан кейінгі іс-әрекет:</b> Оқушының тұрақтылығы мен жоғары зейінін мадақтау.
                    </p>
                    <p>
                      <b>Ұсынылатын педагогикалық шешім:</b> Өзара оқыту (Peer-learning) әдісі арқылы 2-деңгейдегі сыныптастарына жұпта көмектесуге тарту.
                    </p>
                  </div>
                </div>

                {/* Level 5: High Inspiration */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🤩</span>
                      <h3 className="text-xs sm:text-sm font-black text-blue-900">
                        5-деңгей: Жоғары шабыт / Энергия / Сенімділік
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-200 text-blue-800">
                      Сыныпта: {session.breakdown?.[5] || 0} оқушы
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1.5 pl-7">
                    <p>
                      <b>Сабақтан кейінгі іс-әрекет:</b> Оқушының артық энергиясын шығармашылық жобаларға немесе олимпиадалық күрделі есептерге бағыттау.
                    </p>
                    <p>
                      <b>Ұсынылатын педагогикалық шешім:</b> Топ көшбасшысы немесе сабақ қорытындысын шығарушы спикер рөлін ұсыну.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Notes & Signature Section */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <span className="font-bold text-slate-700 block">Мұғалімнің келесі сабаққа жеке ескертпесі:</span>
                <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50 min-h-[60px] text-slate-500 italic">
                  «1-деңгейдегі оқушыларға жеке тыныш карточка ұсынылды. Re-check кезінде сыныптың көңіл-күйі +19.1%-ға жақсарды. Келесі сабақта ми гимнастикасы жалғасады.»
                </div>
              </div>

              <div className="space-y-2 flex flex-col justify-end">
                <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                  <span className="text-slate-500">Мұғалімнің қолы:</span>
                  <span className="font-serif italic font-bold">А. Нұрланқызы</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Жүйе: Emotion Check-in v2.4</span>
                  <span>Құжат расталған №EC-{Date.now().toString().slice(-6)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
