import React, { useState, useMemo } from 'react';
import { 
  X, 
  Users, 
  Sparkles, 
  Shuffle, 
  Copy, 
  Check, 
  Crown, 
  HeartHandshake, 
  ShieldCheck, 
  Zap, 
  GraduationCap, 
  Maximize2,
  Minimize2,
  Share2
} from 'lucide-react';
import { SchoolClass, Student, CheckInRecord, EmotionLevelConfig, CheckInSession } from '../types';

interface SmartGroupingModalProps {
  classes: SchoolClass[];
  students: Student[];
  sessions: CheckInSession[];
  checkIns: CheckInRecord[];
  levels: Record<number, EmotionLevelConfig>;
  initialClassId?: string;
  onClose: () => void;
}

export const SmartGroupingModal: React.FC<SmartGroupingModalProps> = ({
  classes,
  students,
  sessions,
  checkIns,
  levels,
  initialClassId,
  onClose
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(
    initialClassId || classes[0]?.id || 'class-9a'
  );
  const [groupCount, setGroupCount] = useState<number>(4);
  const [strategy, setStrategy] = useState<'balanced' | 'pairs' | 'energy'>('balanced');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Match each student to their latest check-in record
  const studentsWithEmotion = useMemo(() => {
    return classStudents.map((st) => {
      // Find latest check-in for this student
      const stCheckIn = checkIns
        .filter((c) => c.studentId === st.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

      const level = stCheckIn ? stCheckIn.level : 4; // default to 4 (good/ready) if not recorded yet
      const energyLevel = stCheckIn ? stCheckIn.energyLevel : 4;
      const factor = stCheckIn ? stCheckIn.primaryFactor : 'Сабаққа дайын';

      return {
        ...st,
        level,
        energyLevel,
        factor,
        levelConfig: levels[level] || levels[4]
      };
    });
  }, [classStudents, checkIns, levels, selectedClassId]);

  // Smart Grouping Algorithm based on psychological peer-balance
  const groups = useMemo(() => {
    // We make a copy and sort by emotion level descending (Level 5 leaders first, then 4, 3, 2, 1)
    const sorted = [...studentsWithEmotion].sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return (b.energyLevel || 3) - (a.energyLevel || 3);
    });

    if (sorted.length === 0) return [];

    let count = groupCount;
    if (strategy === 'pairs') {
      count = Math.max(1, Math.floor(sorted.length / 2));
    }

    const result: Array<{
      id: number;
      name: string;
      members: typeof studentsWithEmotion;
      averageLevel: number;
      leader?: (typeof studentsWithEmotion)[0];
    }> = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: strategy === 'pairs' ? `${i + 1}-жұп` : `${i + 1}-топ («${['Алғырлар', 'Сұңқарлар', 'Зерде', 'Талапкерлер', 'Қырандар', 'Жалын'][i % 6]}»)`,
      members: [],
      averageLevel: 0
    }));

    if (strategy === 'balanced') {
      // Serpentine (snake) allocation: distributes level 5s and level 1-2s across all groups evenly
      let forward = true;
      let groupIdx = 0;

      for (const st of sorted) {
        result[groupIdx].members.push(st);
        if (forward) {
          if (groupIdx === count - 1) {
            forward = false;
          } else {
            groupIdx++;
          }
        } else {
          if (groupIdx === 0) {
            forward = true;
          } else {
            groupIdx--;
          }
        }
      }
    } else if (strategy === 'pairs') {
      // Pair 5s with 2-3s (Peer buddy)
      const leaders = sorted.slice(0, count);
      const peers = sorted.slice(count).reverse();

      leaders.forEach((ldr, idx) => {
        result[idx].members.push(ldr);
        if (peers[idx]) {
          result[idx].members.push(peers[idx]);
        }
      });

      // Remaining students if odd count
      const placedCount = count * 2;
      if (placedCount < sorted.length) {
        for (let i = placedCount; i < sorted.length; i++) {
          result[i % count].members.push(sorted[i]);
        }
      }
    } else {
      // Energy-based Focus groups:
      const chunkSize = Math.ceil(sorted.length / count);
      for (let i = 0; i < count; i++) {
        result[i].members = sorted.slice(i * chunkSize, (i + 1) * chunkSize);
      }
    }

    // Assign leaders and calculate stats
    result.forEach((g) => {
      if (g.members.length > 0) {
        // Leader is student with highest level and energy
        g.leader = [...g.members].sort((a, b) => b.level - a.level || b.energyLevel - a.energyLevel)[0];
        const sum = g.members.reduce((acc, m) => acc + m.level, 0);
        g.averageLevel = Number((sum / g.members.length).toFixed(1));
      }
    });

    return result;
  }, [studentsWithEmotion, groupCount, strategy, shuffleSeed]);

  const handleCopyGroups = () => {
    let text = `📋 ${currentClass?.name || 'Сынып'} — Smart Grouping (Топтық құрам):\n\n`;
    groups.forEach((g) => {
      text += `🔷 ${g.name} (Орташа көңіл-күй: ${g.averageLevel}/5.0):\n`;
      g.members.forEach((m) => {
        const isLeader = g.leader?.id === m.id;
        text += `  • ${m.name} [${m.levelConfig.emoji} ${m.level}-деңгей] ${isLeader ? '👑 Жетекші' : ''}\n`;
      });
      text += '\n';
    });

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className={`bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col transition-all duration-300 w-full ${
          isFullscreen ? 'fixed inset-3 h-[calc(100vh-24px)] max-w-none' : 'max-w-5xl max-h-[92vh]'
        }`}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0 bg-slate-50/70 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Smart Grouping — Эмоциялық теңгерімді топқа бөлу
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                  Ғылыми әдіс
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Оқушылардың 60 секундтық Check-in нәтижесі бойынша серіктестік (Peer Buddy) теңгерімін құру
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              title={isFullscreen ? 'Шағын көрініс' : 'Тақтаға толық экранда ашу'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls Toolbar: Class Selector, Strategy, Group count */}
        <div className="p-4 sm:px-6 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Class select */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-xs font-bold text-slate-500">Сынып:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-transparent text-xs font-extrabold text-indigo-700 focus:outline-none cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({students.filter((s) => s.classId === c.id).length} оқушы)
                  </option>
                ))}
              </select>
            </div>

            {/* Strategy selector */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setStrategy('balanced')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  strategy === 'balanced'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Әр топта 5-деңгей (көшбасшы) мен 2-деңгей (қолдау қажет) теңдей бөлінеді"
              >
                Теңгерімді топтар
              </button>
              <button
                onClick={() => setStrategy('pairs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  strategy === 'pairs'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="5-деңгейдегі оқушы 2-3 деңгейдегі оқушымен жұптасады (Peer Buddy)"
              >
                Жұптық серіктестік
              </button>
              <button
                onClick={() => setStrategy('energy')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  strategy === 'energy'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Энергия мен қарқын деңгейіне қарай топтастыру"
              >
                Дифференциация
              </button>
            </div>

            {/* Group count selector (if not pairs) */}
            {strategy !== 'pairs' && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                <span className="text-xs font-bold text-slate-500">Топ саны:</span>
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setGroupCount(num)}
                    className={`w-6 h-6 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      groupCount === num
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShuffleSeed((prev) => prev + 1)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Қайта араластыру</span>
            </button>

            <button
              onClick={handleCopyGroups}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 cursor-pointer"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Көшірілді!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Тізімді көшіру</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Methodology Tip Banner */}
        <div className="px-4 sm:px-6 py-2.5 bg-indigo-50/70 border-b border-indigo-100 flex items-center gap-2 text-xs text-indigo-900 font-medium shrink-0">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            {strategy === 'balanced' && 'Әдістемелік кеңес: 5-деңгейдегі шабытты оқушылар топ жетекшісі ретінде 2-деңгейдегі құрдастарына көмектеседі.'}
            {strategy === 'pairs' && 'Әдістемелік кеңес: Жұптасып жұмыс жасағанда шаршаған оқушының сабаққа қосылу белсенділігі 40%-ға артады.'}
            {strategy === 'energy' && 'Әдістемелік кеңес: Жоғары энергиялы топқа күрделі жобалық тапсырма, шаршаған топқа сергіту ойынын беру ұсынылады.'}
          </span>
        </div>

        {/* Groups Grid */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/50">
          <div className={`grid gap-4 ${
            strategy === 'pairs' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : groupCount <= 3 
              ? 'grid-cols-1 md:grid-cols-3' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}>
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col overflow-hidden"
              >
                {/* Group Header */}
                <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="leading-tight">
                    <h4 className="font-extrabold text-slate-800 text-sm">{group.name}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {group.members.length} оқушы
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold">Орташа:</span>
                    <span className="text-xs font-black text-indigo-700">{group.averageLevel}</span>
                    <span className="text-[10px] text-slate-400">/5</span>
                  </div>
                </div>

                {/* Group Members List */}
                <div className="p-3 space-y-2 flex-1">
                  {group.members.map((member) => {
                    const isLeader = group.leader?.id === member.id;

                    return (
                      <div
                        key={member.id}
                        className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                          isLeader 
                            ? 'bg-amber-50/70 border-amber-200/80 shadow-2xs' 
                            : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base shrink-0" title={member.levelConfig.nameKz}>
                            {member.levelConfig.emoji}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate leading-snug">
                              {member.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {member.level}-деңгей • {member.factor}
                            </p>
                          </div>
                        </div>

                        {isLeader && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-800 bg-amber-200/70 px-1.5 py-0.5 rounded-md shrink-0">
                            <Crown className="w-3 h-3 text-amber-600" />
                            <span>Жетекші</span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Group Footer Tip */}
                <div className="p-2.5 bg-slate-50/70 border-t border-slate-100 text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Теңдестірілген психологиялық орта</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 rounded-b-3xl">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Барлығы {studentsWithEmotion.length} оқушы {groups.length} топқа бөлінді.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyGroups}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              {copiedSuccess ? 'Көшірілді!' : 'Топтарды көшіру'}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm shadow-indigo-500/20"
            >
              Сабаққа қайту
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
