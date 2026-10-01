import React, { useState } from 'react';
import { Users, Plus, Search, CheckCircle2, ShieldCheck, Printer, TabletSmartphone, X, Trash2 } from 'lucide-react';
import { SchoolClass, Student } from '../types';
import { CreateClassModal } from './CreateClassModal';

interface ClassManagementProps {
  classes: SchoolClass[];
  students: Student[];
  selectedClassId?: string;
  onSelectClass?: (classId: string) => void;
  onAddClass: (data: any) => Promise<any>;
  onAddStudent: (data: { classId: string; name: string; gender?: string }) => Promise<any>;
  onDeleteClass?: (classId: string) => Promise<any>;
  onDeleteStudent?: (studentId: string) => Promise<any>;
  onOpenPrintCards: () => void;
  onOpenKioskForClass?: (classId: string) => void;
  onOpenCreateClassModal?: () => void;
}

export const ClassManagement: React.FC<ClassManagementProps> = ({
  classes,
  students,
  selectedClassId: propsSelectedClassId,
  onSelectClass,
  onAddClass,
  onAddStudent,
  onDeleteClass,
  onDeleteStudent,
  onOpenPrintCards,
  onOpenKioskForClass,
  onOpenCreateClassModal
}) => {
  const [localSelectedClassId, setLocalSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeClassId = propsSelectedClassId && propsSelectedClassId !== 'all' ? propsSelectedClassId : localSelectedClassId;

  const handleSelectClass = (clsId: string) => {
    setLocalSelectedClassId(clsId);
    if (onSelectClass) onSelectClass(clsId);
  };
  
  // New student form
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [isAddingStudent, setIsAddingStudent] = useState<boolean>(false);

  // New class modal
  const [showAddClassModal, setShowAddClassModal] = useState<boolean>(false);

  const currentClass = classes.find((c) => c.id === activeClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === currentClass?.id);

  const filteredStudents = classStudents.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !currentClass) return;

    setIsAddingStudent(true);
    try {
      await onAddStudent({
        classId: currentClass.id,
        name: newStudentName.trim()
      });
      setNewStudentName('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleCreateClass = async (classData: any) => {
    try {
      const created = await onAddClass(classData);
      if (created?.id) {
        handleSelectClass(created.id);
      }
      setShowAddClassModal(false);
    } catch (err: any) {
      alert(err.message || 'Сыныпты қосу сәтсіз аяқталды');
    }
  };

  const handleDeleteClass = async (classId: string, className: string) => {
    if (!confirm(`«${className}» сыныбын және оның барлық оқушыларын өшіруді растайсыз ба?`)) {
      return;
    }
    if (onDeleteClass) {
      try {
        await onDeleteClass(classId);
        const remaining = classes.filter((c) => c.id !== classId);
        handleSelectClass(remaining[0]?.id || '');
      } catch (err: any) {
        alert(err.message || 'Сыныпты өшіру мүмкін болмады');
      }
    }
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`«${studentName}» оқушысын сынып тізімінен өшіруді растайсыз ба?`)) {
      return;
    }
    if (onDeleteStudent) {
      try {
        await onDeleteStudent(studentId);
      } catch (err: any) {
        alert(err.message || 'Оқушыны өшіру мүмкін болмады');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Class Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {classes.map((cls) => {
            const isSelected = cls.id === currentClass?.id;
            return (
              <div key={cls.id} className="inline-flex items-center shrink-0">
                <button
                  onClick={() => handleSelectClass(cls.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  } ${classes.length > 1 ? 'rounded-r-none pr-2.5' : ''}`}
                >
                  {cls.name} ({cls.studentCount || 0})
                </button>
                {classes.length > 1 && (
                  <button
                    onClick={() => handleDeleteClass(cls.id, cls.name)}
                    title="Сыныпты өшіру"
                    className={`px-2 py-2 rounded-r-xl text-xs transition-colors ${
                      isSelected
                        ? 'bg-blue-700 text-blue-200 hover:text-white hover:bg-rose-600'
                        : 'bg-slate-200 text-slate-500 hover:text-rose-600 hover:bg-slate-300'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={() => setShowAddClassModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Жаңа сынып қосу</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onOpenKioskForClass && (
            <button
              onClick={() => onOpenKioskForClass(currentClass?.id || '')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all"
            >
              <TabletSmartphone className="w-3.5 h-3.5" />
              <span>Осы сыныпқа Check-in ашу</span>
            </button>
          )}

          <button
            onClick={onOpenPrintCards}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>5 деңгейлі карточкаларды басу</span>
          </button>
        </div>
      </div>

      {/* Class Details & Add Student */}
      {currentClass && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Students Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  {currentClass.name} — Оқушылар тізімі ({classStudents.length})
                </h4>
                <p className="text-xs text-slate-500">
                  Мұғалім сыныпты таңдағанда оқушылар осы тізімнен өз атын басып, 60с тестті орындайды
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Оқушы атын іздеу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none w-56"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Оқушының аты-жөні</th>
                    <th className="p-3">Сыныбы</th>
                    <th className="p-3">Тексеруге дайындығы</th>
                    <th className="p-3 text-right">Әрекет</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st, idx) => (
                    <tr key={st.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                          {st.name.charAt(0)}
                        </div>
                        <span className="text-sm">{st.name}</span>
                      </td>
                      <td className="p-3 font-medium text-slate-600">
                        {currentClass.name}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Тіркелген (Тестке қолжетімді)</span>
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {onDeleteStudent && (
                          <button
                            onClick={() => handleDeleteStudent(st.id, st.name)}
                            title="Оқушыны тізімнен өшіру"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {classStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 px-6 text-center">
                        <div className="max-w-sm mx-auto space-y-2">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                            <Users className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold text-slate-800">Бұл сыныпта әлі оқушылар жоқ</p>
                          <p className="text-xs text-slate-500">
                            Оң жақтағы форма арқылы оқушының аты-жөнін жазып, сынып тізіміне қолмен қосыңыз.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">
                        «{searchQuery}» бойынша оқушылар табылмады
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Col: Add New Student to Current Class */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>{currentClass.name} сыныбына оқушы қосу</span>
            </h4>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Оқушының аты-жөні:</label>
                <textarea
                  rows={3}
                  placeholder={`Мысалы: Әлихан Серікбай\nнемесе бірнеше оқушы:\nБауыржан Серіков\nАйзере Мұратқызы`}
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <p className="text-[11px] text-slate-400">
                💡 Бір оқушыны немесе бірнеше оқушының атын жазып (әр жолға бір оқушы), сыныпқа оңай қолмен қоса аласыз.
              </p>

              <button
                type="submit"
                disabled={isAddingStudent || !newStudentName.trim()}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingStudent ? 'Қосылуда...' : 'Оқушыны тізімге қосу'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Class */}
      {showAddClassModal && (
        <CreateClassModal
          onClose={() => setShowAddClassModal(false)}
          onCreate={handleCreateClass}
        />
      )}
    </div>
  );
};
