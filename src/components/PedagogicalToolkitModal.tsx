import React, { useState, useEffect } from 'react';
import { X, Clock, Play, Pause, RotateCcw, Sparkles, HeartHandshake, Volume2, CheckCircle2 } from 'lucide-react';

interface PedagogicalToolkitModalProps {
  initialTool?: 'breathing' | 'brain_gym' | 'verbal';
  onClose: () => void;
}

export const PedagogicalToolkitModal: React.FC<PedagogicalToolkitModalProps> = ({
  initialTool = 'breathing',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'brain_gym' | 'verbal'>(initialTool);

  // Breathing 4-7-8 State
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [counter, setCounter] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setCounter((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Transition phase
            if (phase === 'inhale') {
              setPhase('hold');
              return 7;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return 8;
            } else {
              setPhase('inhale');
              setCyclesCompleted((c) => c + 1);
              return 4;
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCounter(4);
    setCyclesCompleted(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                Педагогикалық Экспресс-құралдар жинағы
              </h3>
              <p className="text-xs text-slate-500">
                Сабақта 60 секунд ішінде эмоционалдық тепе-теңдікті қалпына келтіру
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-3 bg-white text-xs font-bold text-slate-500">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'breathing' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>«4-7-8» Тыныс алу таймері</span>
          </button>

          <button
            onClick={() => setActiveTab('brain_gym')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'brain_gym' ? 'border-amber-500 text-amber-600' : 'border-transparent hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Ми гимнастикасы (Энерджайзер)</span>
          </button>

          <button
            onClick={() => setActiveTab('verbal')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'verbal' ? 'border-emerald-500 text-emerald-600' : 'border-transparent hover:text-slate-800'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Қолдаушы сөз тіркестері</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* 1. Breathing Timer */}
          {activeTab === 'breathing' && (
            <div className="flex flex-col items-center justify-center space-y-6 text-center py-4">
              <div className="space-y-1">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
                  1 және 3-деңгейдегі оқушылар үшін
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-2">
                  «4-7-8» Анти-стресс тыныс алуы
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Сыныпты бір уақытта тыныштандырып, миды оттегімен қанықтыратын халықаралық әдістеме
                </p>
              </div>

              {/* Animated Breathing Circle */}
              <div className="relative w-56 h-56 flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                    phase === 'inhale'
                      ? 'scale-100 bg-blue-200/80 ring-8 ring-blue-400/40'
                      : phase === 'hold'
                      ? 'scale-100 bg-amber-200/80 ring-8 ring-amber-400/40'
                      : 'scale-75 bg-emerald-200/70 ring-4 ring-emerald-300/40'
                  }`}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-4xl font-black text-slate-900 font-mono">
                    {counter}
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mt-1">
                    {phase === 'inhale' ? 'Дем алу (Мұрынмен)' : phase === 'hold' ? 'Тынысты ұстау' : 'Дем шығару (Ауызбен)'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 shadow-sm transition-all ${
                    isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isActive ? 'Кідірту' : 'Таймерді бастау'}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                  title="Басынан бастау"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Орындалған циклдар: <span className="font-bold text-slate-700">{cyclesCompleted}</span> (Оңтайлы: 3-4 цикл)
              </p>
            </div>
          )}

          {/* 2. Brain Gym */}
          {activeTab === 'brain_gym' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                ⚡ <b>2-деңгей (Шаршау және төмен қуат) үшін:</b> 60 секундтық ми жаттығулары мидың екі жарты шарын байланыстырып, ұйқыны бірден ашады.
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 transition-colors">
                  <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">1</span>
                    «Құлақ - Мұрын» жаттығуы (30 секунд)
                  </h5>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Сол қолмен мұрынның ұшын, оң қолмен сол құлақты айқастыра ұстаймыз. Шапалақ ұрып, қолдың орнын ауыстырамыз. 
                    Оқушыларға көңілділік сыйлап, когнитивтік серпіліс береді.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 transition-colors">
                  <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">2</span>
                    «Жалқау сегіздік» (Көз жаттығуы)
                  </h5>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Бас бармақпен ауада жатқан 8 цифрын (шексіздік белгісін) сызып, көзбен оның ізінен бақылау. 
                    Көз бұлшықеттерін босатып, ақпаратты қабылдау жылдамдығын арттырады.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 transition-colors">
                  <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">3</span>
                    «Күш түймелері» (Нүктелік уқалау)
                  </h5>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Бұғана сүйегінің астындағы нүктелерді бір қолмен, екінші қолмен кіндікті 20 секунд уқалау. 
                    Миға баратын қан айналымын 15%-ға жеделдетеді.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. Verbal Phrasing */}
          {activeTab === 'verbal' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                💬 <b>Психологиялық қауіпсіздік сөздері:</b> Мұғалімнің алғашқы 60 секундтағы сөйлеген сөзі сабақтың бүкіл эмоционалдық фонын қалыптастырады.
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <span className="text-[10px] font-bold text-rose-600 uppercase">1-деңгей үшін (Күйзеліс):</span>
                  <p className="font-semibold text-slate-800 text-xs mt-1 italic">
                    «Мен сенің шаршағаныңды/қобалжығаныңды көріп тұрмын. Бүгін саған ешқандай қысым жоқ. Сен өз қарқыныңмен отыра аласың, мен қасыңдамын».
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <span className="text-[10px] font-bold text-amber-600 uppercase">2-деңгей үшін (Шаршау):</span>
                  <p className="font-semibold text-slate-800 text-xs mt-1 italic">
                    «Бүгінгі сабақты күрделі етпейміз. Қазір кішкене сергіп алып, бірге қызықты тапсырманы шешеміз!».
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">4 және 5-деңгей үшін (Дайындық және Шабыт):</span>
                  <p className="font-semibold text-slate-800 text-xs mt-1 italic">
                    «Сендердің керемет энергияларыңыз барлығымызға шабыт береді! Бүгінгі зерттеу тобының жетекшісі болғың келе ме?».
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
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
