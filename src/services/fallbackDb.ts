import { BootstrapData } from '../types';

export const INITIAL_DATA: BootstrapData = {
  teacher: {
    id: "teacher-1",
    name: "Қоңырбаева Әсем Жұмаділлақызы",
    email: "ustaz@mektep.kz",
    school: "145 орта мектеп",
    subject: "Педагог-психолог",
    role: "teacher"
  },
  classes: [
    {
      id: "class-9a",
      name: "9 «А» сыныбы",
      grade: "9",
      subject: "Информатика",
      studentCount: 20,
      room: "304 кабинет",
      schedule: "Сәрсенбі, 09:00 - 09:45"
    },
    {
      id: "class-7a",
      name: "7 «А» сыныбы",
      grade: "7",
      subject: "Математика",
      studentCount: 18,
      room: "208 кабинет",
      schedule: "Дүйсенбі, 10:00 - 10:45"
    }
  ],
  students: [
    { id: "s-9a-01", classId: "class-9a", name: "Әлихан Сейітов", gender: "M", avatarIndex: 1, recentGrade: 9, academicStatus: "Үздік" },
    { id: "s-9a-02", classId: "class-9a", name: "Амина Ержанқызы", gender: "F", avatarIndex: 2, recentGrade: 10, academicStatus: "Үздік" },
    { id: "s-9a-03", classId: "class-9a", name: "Диас Нұрболат", gender: "M", avatarIndex: 3, recentGrade: 6, academicStatus: "Орташа" },
    { id: "s-9a-04", classId: "class-9a", name: "Мәдина Қайратқызы", gender: "F", avatarIndex: 4, recentGrade: 7, academicStatus: "Жақсы" },
    { id: "s-9a-05", classId: "class-9a", name: "Санжар Бекет", gender: "M", avatarIndex: 5, recentGrade: 7, academicStatus: "Жақсы" },
    { id: "s-9a-06", classId: "class-9a", name: "Аружан Төлеген", gender: "F", avatarIndex: 6, recentGrade: 9, academicStatus: "Үздік" },
    { id: "s-9a-07", classId: "class-9a", name: "Батырхан Жұмабай", gender: "M", avatarIndex: 7, recentGrade: 8, academicStatus: "Жақсы" },
    { id: "s-9a-08", classId: "class-9a", name: "Дана Мұратбек", gender: "F", avatarIndex: 8, recentGrade: 9, academicStatus: "Үздік" },
    { id: "s-9a-09", classId: "class-9a", name: "Ерасыл Серікбай", gender: "M", avatarIndex: 9, recentGrade: 7, academicStatus: "Жақсы" },
    { id: "s-9a-10", classId: "class-9a", name: "Жансая Дәулетқызы", gender: "F", avatarIndex: 10, recentGrade: 10, academicStatus: "Үздік" },
    { id: "s-9a-11", classId: "class-9a", name: "Ильяс Қасымбек", gender: "M", avatarIndex: 11, recentGrade: 8, academicStatus: "Жақсы" },
    { id: "s-9a-12", classId: "class-9a", name: "Кәусар Омар", gender: "F", avatarIndex: 12, recentGrade: 9, academicStatus: "Үздік" },
    { id: "s-9a-13", classId: "class-9a", name: "Мейіржан Ораз", gender: "M", avatarIndex: 13, recentGrade: 7, academicStatus: "Жақсы" },
    { id: "s-9a-14", classId: "class-9a", name: "Нұргүл Айдар", gender: "F", avatarIndex: 14, recentGrade: 9, academicStatus: "Үздік" },
    { id: "s-9a-15", classId: "class-9a", name: "Олжас Бақытжан", gender: "M", avatarIndex: 15, recentGrade: 8, academicStatus: "Жақсы" },
    { id: "s-9a-16", classId: "class-9a", name: "Раяна Болатбек", gender: "F", avatarIndex: 16, recentGrade: 10, academicStatus: "Үздік" },
    { id: "s-9a-17", classId: "class-9a", name: "Сұлтан Бейбарыс", gender: "M", avatarIndex: 17, recentGrade: 8, academicStatus: "Жақсы" },
    { id: "s-9a-18", classId: "class-9a", name: "Томирис Есен", gender: "F", avatarIndex: 18, recentGrade: 8, academicStatus: "Жақсы" },
    { id: "s-9a-19", classId: "class-9a", name: "Шыңғыс Асқарұлы", gender: "M", avatarIndex: 19, recentGrade: 9, academicStatus: "Үздік" },
    { id: "s-9a-20", classId: "class-9a", name: "Ясмин Темірланқызы", gender: "F", avatarIndex: 20, recentGrade: 9, academicStatus: "Үздік" },
    
    // 7 «А»
    { id: "s-7a-01", classId: "class-7a", name: "Ильяс Қасымбек", gender: "M", avatarIndex: 5, recentGrade: 8, academicStatus: "Жақсы" },
    { id: "s-7a-02", classId: "class-7a", name: "Кәусар Омар", gender: "F", avatarIndex: 6, recentGrade: 9, academicStatus: "Үздік" },
    { id: "s-7a-03", classId: "class-7a", name: "Мейіржан Ораз", gender: "M", avatarIndex: 7, recentGrade: 7, academicStatus: "Жақсы" },
    { id: "s-7a-04", classId: "class-7a", name: "Нұргүл Айдар", gender: "F", avatarIndex: 8, recentGrade: 10, academicStatus: "Үздік" },
    { id: "s-7a-05", classId: "class-7a", name: "Олжас Бақытжан", gender: "M", avatarIndex: 9, recentGrade: 8, academicStatus: "Жақсы" },
    { id: "s-7a-06", classId: "class-7a", name: "Раяна Болатбек", gender: "F", avatarIndex: 10, recentGrade: 9, academicStatus: "Үздік" },
    { id: "s-7a-07", classId: "class-7a", name: "Сұлтан Бейбарыс", gender: "M", avatarIndex: 11, recentGrade: 6, academicStatus: "Орташа" },
    { id: "s-7a-08", classId: "class-7a", name: "Томирис Есен", gender: "F", avatarIndex: 12, recentGrade: 8, academicStatus: "Жақсы" },
    { id: "s-7a-09", classId: "class-7a", name: "Шыңғыс Асқарұлы", gender: "M", avatarIndex: 13, recentGrade: 8, academicStatus: "Жақсы" },
    { id: "s-7a-10", classId: "class-7a", name: "Айсұлтан Мұрат", gender: "M", avatarIndex: 14, recentGrade: 9, academicStatus: "Үздік" },
    { id: "s-7a-11", classId: "class-7a", name: "Айзере Қуаныш", gender: "F", avatarIndex: 15, recentGrade: 10, academicStatus: "Үздік" },
    { id: "s-7a-12", classId: "class-7a", name: "Бекзат Саматұлы", gender: "M", avatarIndex: 16, recentGrade: 7, academicStatus: "Жақсы" },
    { id: "s-7a-13", classId: "class-7a", name: "Гүлназ Ерлан", gender: "F", avatarIndex: 17, recentGrade: 8, academicStatus: "Жақсы" },
    { id: "s-7a-14", classId: "class-7a", name: "Дәулет Қанатұлы", gender: "M", avatarIndex: 18, recentGrade: 7, academicStatus: "Жақсы" },
    { id: "s-7a-15", classId: "class-7a", name: "Еркеназ Бағдат", gender: "F", avatarIndex: 19, recentGrade: 9, academicStatus: "Үздік" },
    { id: "s-7a-16", classId: "class-7a", name: "Жандос Серік", gender: "M", avatarIndex: 20, recentGrade: 8, academicStatus: "Жақсы" },
    { id: "s-7a-17", classId: "class-7a", name: "Мадина Болатқызы", gender: "F", avatarIndex: 1, recentGrade: 8, academicStatus: "Жақсы" },
    { id: "s-7a-18", classId: "class-7a", name: "Зере Бауыржанқызы", gender: "F", avatarIndex: 2, recentGrade: 9, academicStatus: "Үздік" }
  ],
  sessions: [
    {
      id: "sess-active-7a",
      title: "7 «А» сыныбы: Сабақ алдындағы Emotion Check-in",
      classId: "class-7a",
      className: "7 «А» сыныбы",
      date: "2026-09-30",
      createdAt: "2026-10-01T11:56:14.656Z",
      status: "active",
      type: "initial",
      hasRecheck: false,
      targetTimeSeconds: 60,
      submissionCount: 12,
      absentCount: 2,
      totalStudents: 18,
      supportIndex: 84.5,
      averageLevel: 3.83,
      breakdown: { "1": 0, "2": 2, "3": 2, "4": 5, "5": 3 },
      urgentSupportCount: 0,
      teacherPedagogicalActionsTaken: ["Сабақ басында «Ми гимнастикасы» сергіту жаттығуы орындалды"]
    },
    {
      id: "sess-active-1",
      title: "9 «А» сыныбы: Сабақ алдындағы Emotion Check-in",
      classId: "class-9a",
      className: "9 «А» сыныбы",
      date: "2026-09-30",
      createdAt: "2026-10-01T11:56:14.656Z",
      status: "active",
      type: "initial",
      hasRecheck: true,
      recheckSessionId: "sess-recheck-1",
      targetTimeSeconds: 60,
      submissionCount: 20,
      totalStudents: 20,
      supportIndex: 78.5,
      averageLevel: 3.42,
      breakdown: { "1": 1, "2": 3, "3": 3, "4": 8, "5": 5 },
      urgentSupportCount: 1,
      teacherPedagogicalActionsTaken: [
        "Сабақ алдында 60 секундтық «4-7-8» тыныс алу жаттығуы орындалды",
        "2-деңгейдегі оқушылар үшін ми гимнастикасы ұсынылды",
        "1-деңгейдегі 1 оқушыға жеке тыныш бақылау карточкасы берілді"
      ],
      recheckStats: {
        supportIndex: 94,
        averageLevel: 4.15,
        submissionCount: 20,
        breakdown: { "1": 0, "2": 1, "3": 1, "4": 12, "5": 6 },
        improvementPercent: 19.7
      }
    },
    {
      id: "sess-recheck-1",
      title: "9 «А» сыныбы: Сабақ соңындағы Re-check (Педагогикалық нәтиже)",
      classId: "class-9a",
      className: "9 «А» сыныбы",
      date: "2026-09-30",
      createdAt: "2026-10-01T11:51:14.656Z",
      status: "completed",
      type: "recheck",
      parentSessionId: "sess-active-1",
      targetTimeSeconds: 60,
      submissionCount: 20,
      totalStudents: 20,
      supportIndex: 94,
      averageLevel: 4.15,
      breakdown: { "1": 0, "2": 1, "3": 1, "4": 12, "5": 6 },
      urgentSupportCount: 0,
      improvementPercent: 19.7,
      teacherPedagogicalActionsTaken: [
        "4-7-8 тыныс алу жаттығуынан кейін рефлексия жүргізілді",
        "Тапсырмалар сараланып берілді"
      ]
    },
    {
      id: "sess-prev-1",
      title: "9 «А» сыныбы: Өткен аптадағы Check-in (Интервенцияға дейін)",
      classId: "class-9a",
      className: "9 «А» сыныбы",
      date: "2026-09-23",
      createdAt: "2026-09-24T11:56:14.656Z",
      status: "completed",
      type: "initial",
      hasRecheck: false,
      targetTimeSeconds: 60,
      submissionCount: 14,
      totalStudents: 20,
      supportIndex: 71,
      averageLevel: 3.14,
      breakdown: { "1": 3, "2": 4, "3": 2, "4": 4, "5": 1 },
      urgentSupportCount: 3,
      teacherPedagogicalActionsTaken: ["Сыныпта тыныштық орнату"]
    }
  ],
  checkIns: [
    { id: "ci-101", sessionId: "sess-active-1", studentId: "s-9a-01", studentName: "Әлихан С.", pin: "1042", level: 4, energyLevel: 4, primaryFactor: "Сабаққа қызығушылық", notesToTeacher: "Практикалық жұмысқа дайынмын.", wantsPrivateHelp: false, durationSeconds: 28, createdAt: "2026-10-01T11:31:14.656Z" },
    { id: "ci-102", sessionId: "sess-active-1", studentId: "s-9a-02", studentName: "Амина Е.", pin: "2381", level: 5, energyLevel: 5, primaryFactor: "Жақсы көңіл-күй", notesToTeacher: "Бүгін көңіл-күйім тамаша!", wantsPrivateHelp: false, durationSeconds: 22, createdAt: "2026-10-01T11:32:14.656Z" },
    { id: "ci-103", sessionId: "sess-active-1", studentId: "s-9a-03", studentName: "Диас Н.", pin: "4912", level: 1, energyLevel: 2, primaryFactor: "Ұйқының қанбауы", notesToTeacher: "Басым ауырып тұр, сұрамаңызшы.", wantsPrivateHelp: true, durationSeconds: 41, createdAt: "2026-10-01T11:33:14.656Z" },
    { id: "ci-104", sessionId: "sess-active-1", studentId: "s-9a-04", studentName: "Мәдина Қ.", pin: "3184", level: 2, energyLevel: 2, primaryFactor: "Үй тапсырмасы / Тест", notesToTeacher: "Тестке уайымдап отырмын.", wantsPrivateHelp: false, durationSeconds: 35, createdAt: "2026-10-01T11:34:14.656Z" },
    { id: "ci-105", sessionId: "sess-active-1", studentId: "s-9a-05", studentName: "Санжар Б.", pin: "7821", level: 1, energyLevel: 2, primaryFactor: "Жеке мәселе", notesToTeacher: "Көңіл-күйім жоқ.", wantsPrivateHelp: false, durationSeconds: 30, createdAt: "2026-10-01T11:35:14.656Z" },
    { id: "ci-106", sessionId: "sess-active-1", studentId: "s-9a-06", studentName: "Аружан Т.", pin: "1934", level: 4, energyLevel: 4, primaryFactor: "Сабаққа қызығушылық", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 25, createdAt: "2026-10-01T11:36:14.656Z" },
    { id: "ci-107", sessionId: "sess-active-1", studentId: "s-9a-07", studentName: "Батырхан Ж.", pin: "5562", level: 3, energyLevel: 3, primaryFactor: "Қалыпты орта", notesToTeacher: "Бәрі қалыпты.", wantsPrivateHelp: false, durationSeconds: 30, createdAt: "2026-10-01T11:37:14.656Z" },
    { id: "ci-108", sessionId: "sess-active-1", studentId: "s-9a-08", studentName: "Дана М.", pin: "6409", level: 4, energyLevel: 4, primaryFactor: "Жақсы көңіл-күй", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 27, createdAt: "2026-10-01T11:38:14.656Z" },
    { id: "ci-109", sessionId: "sess-active-1", studentId: "s-9a-09", studentName: "Ерасыл С.", pin: "9123", level: 2, energyLevel: 2, primaryFactor: "Ұйқының қанбауы", notesToTeacher: "Ұйқым келіп тұр.", wantsPrivateHelp: false, durationSeconds: 38, createdAt: "2026-10-01T11:39:14.656Z" },
    { id: "ci-110", sessionId: "sess-active-1", studentId: "s-9a-10", studentName: "Жансая Д.", pin: "1457", level: 5, energyLevel: 5, primaryFactor: "Жақсы көңіл-күй", notesToTeacher: "Тақтаға шығуға дайынмын!", wantsPrivateHelp: false, durationSeconds: 19, createdAt: "2026-10-01T11:40:14.656Z" },
    { id: "ci-111", sessionId: "sess-active-1", studentId: "s-9a-11", studentName: "Ильяс Қ.", pin: "2890", level: 3, energyLevel: 3, primaryFactor: "Жеке мәселе", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 33, createdAt: "2026-10-01T11:41:14.656Z" },
    { id: "ci-112", sessionId: "sess-active-1", studentId: "s-9a-12", studentName: "Кәусар О.", pin: "6731", level: 4, energyLevel: 4, primaryFactor: "Сабаққа қызығушылық", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 24, createdAt: "2026-10-01T11:42:14.656Z" },
    { id: "ci-113", sessionId: "sess-active-1", studentId: "s-9a-13", studentName: "Мейіржан О.", pin: "4518", level: 2, energyLevel: 2, primaryFactor: "Ұйқының қанбауы", notesToTeacher: "Шаршаңқы күйдемін.", wantsPrivateHelp: false, durationSeconds: 36, createdAt: "2026-10-01T11:43:14.656Z" },
    { id: "ci-114", sessionId: "sess-active-1", studentId: "s-9a-14", studentName: "Нұргүл А.", pin: "7829", level: 4, energyLevel: 4, primaryFactor: "Жақсы көңіл-күй", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 29, createdAt: "2026-10-01T11:44:14.656Z" },
    { id: "ci-115", sessionId: "sess-active-1", studentId: "s-9a-15", studentName: "Олжас Б.", pin: "3341", level: 3, energyLevel: 3, primaryFactor: "Бейтарап", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 31, createdAt: "2026-10-01T11:45:14.656Z" },
    { id: "ci-116", sessionId: "sess-active-1", studentId: "s-9a-16", studentName: "Раяна Б.", pin: "8914", level: 5, energyLevel: 5, primaryFactor: "Жақсы көңіл-күй", notesToTeacher: "Көңілім көтеріңкі.", wantsPrivateHelp: false, durationSeconds: 20, createdAt: "2026-10-01T11:46:14.656Z" },
    { id: "ci-117", sessionId: "sess-active-1", studentId: "s-9a-17", studentName: "Сұлтан Б.", pin: "2298", level: 4, energyLevel: 4, primaryFactor: "Сабаққа қызығушылық", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 26, createdAt: "2026-10-01T11:47:14.656Z" },
    { id: "ci-118", sessionId: "sess-active-1", studentId: "s-9a-18", studentName: "Томирис Е.", pin: "6615", level: 3, energyLevel: 3, primaryFactor: "Қалыпты орта", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 32, createdAt: "2026-10-01T11:48:14.656Z" },
    { id: "ci-119", sessionId: "sess-active-1", studentId: "s-9a-19", studentName: "Шыңғыс А.", pin: "5120", level: 4, energyLevel: 4, primaryFactor: "Сабаққа қызығушылық", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 23, createdAt: "2026-10-01T11:49:14.656Z" },
    { id: "ci-120", sessionId: "sess-active-1", studentId: "s-9a-20", studentName: "Ясмин Т.", pin: "9432", level: 4, energyLevel: 4, primaryFactor: "Жақсы көңіл-күй", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 25, createdAt: "2026-10-01T11:50:14.656Z" },

    // 7 «А»
    { id: "ci-7a-01", sessionId: "sess-active-7a", studentId: "s-7a-01", studentName: "Ильяс Қ.", pin: "3124", level: 4, energyLevel: 4, primaryFactor: "Сабаққа қызығушылық", notesToTeacher: "Сабаққа дайынмын", wantsPrivateHelp: false, durationSeconds: 24, createdAt: "2026-10-01T11:30:14.656Z" },
    { id: "ci-7a-02", sessionId: "sess-active-7a", studentId: "s-7a-02", studentName: "Кәусар О.", pin: "5891", level: 5, energyLevel: 5, primaryFactor: "Жақсы көңіл-күй", notesToTeacher: "Көңіл-күйім тамаша!", wantsPrivateHelp: false, durationSeconds: 18, createdAt: "2026-10-01T11:31:14.656Z" },
    { id: "ci-7a-03", sessionId: "sess-active-7a", studentId: "s-7a-03", studentName: "Мейіржан О.", pin: "4421", level: 2, energyLevel: 2, primaryFactor: "Ұйқының қанбауы", notesToTeacher: "Шаршаңқымын", wantsPrivateHelp: false, durationSeconds: 34, createdAt: "2026-10-01T11:32:14.656Z" },
    { id: "ci-7a-04", sessionId: "sess-active-7a", studentId: "s-7a-04", studentName: "Нұргүл А.", pin: "9012", level: 4, energyLevel: 4, primaryFactor: "Сабаққа қызығушылық", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 26, createdAt: "2026-10-01T11:33:14.656Z" },
    { id: "ci-7a-05", sessionId: "sess-active-7a", studentId: "s-7a-05", studentName: "Олжас Б.", pin: "7731", level: 3, energyLevel: 3, primaryFactor: "Бейтарап", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 31, createdAt: "2026-10-01T11:34:14.656Z" },
    { id: "ci-7a-06", sessionId: "sess-active-7a", studentId: "s-7a-06", studentName: "Раяна Б.", pin: "2190", level: 5, energyLevel: 5, primaryFactor: "Жақсы көңіл-күй", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 19, createdAt: "2026-10-01T11:35:14.656Z" },
    { id: "ci-7a-07", sessionId: "sess-active-7a", studentId: "s-7a-07", studentName: "Сұлтан Б.", pin: "6342", level: 2, energyLevel: 3, primaryFactor: "Үй тапсырмасы / Тест", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 35, createdAt: "2026-10-01T11:36:14.656Z" },
    { id: "ci-7a-08", sessionId: "sess-active-7a", studentId: "s-7a-08", studentName: "Томирис Е.", pin: "8814", level: 4, energyLevel: 4, primaryFactor: "Сабаққа қызығушылық", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 22, createdAt: "2026-10-01T11:37:14.656Z" },
    { id: "ci-7a-09", sessionId: "sess-active-7a", studentId: "s-7a-09", studentName: "Шыңғыс А.", pin: "1540", level: 3, energyLevel: 3, primaryFactor: "Қалыпты орта", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 28, createdAt: "2026-10-01T11:38:14.656Z" },
    { id: "ci-7a-10", sessionId: "sess-active-7a", studentId: "s-7a-10", studentName: "Айсұлтан М.", pin: "9823", level: 4, energyLevel: 4, primaryFactor: "Жақсы көңіл-күй", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 20, createdAt: "2026-10-01T11:39:14.656Z" },
    { id: "ci-7a-11", sessionId: "sess-active-7a", studentId: "s-7a-11", studentName: "Айзере Қ.", pin: "4301", level: 5, energyLevel: 5, primaryFactor: "Сабаққа қызығушылық", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 17, createdAt: "2026-10-01T11:40:14.656Z" },
    { id: "ci-7a-12", sessionId: "sess-active-7a", studentId: "s-7a-12", studentName: "Бекзат С.", pin: "7612", level: 4, energyLevel: 4, primaryFactor: "Жақсы көңіл-күй", notesToTeacher: "", wantsPrivateHelp: false, durationSeconds: 25, createdAt: "2026-10-01T11:41:14.656Z" },
    { id: "ci-7a-13", sessionId: "sess-active-7a", studentId: "s-7a-13", studentName: "Гүлназ Е.", pin: "5198", level: 0, energyLevel: 0, primaryFactor: "Сабақта жоқ", notesToTeacher: "Сабаққа келмеді", wantsPrivateHelp: false, durationSeconds: 0, status: "absent", createdAt: "2026-10-01T11:42:14.656Z" },
    { id: "ci-7a-14", sessionId: "sess-active-7a", studentId: "s-7a-14", studentName: "Дәулет Қ.", pin: "3209", level: 0, energyLevel: 0, primaryFactor: "Сабақта жоқ", notesToTeacher: "Сабаққа келмеді", wantsPrivateHelp: false, durationSeconds: 0, status: "absent", createdAt: "2026-10-01T11:43:14.656Z" }
  ],
  notifications: [
    { id: "notif-1", type: "alert", title: "Шұғыл педагогикалық қолдау қажет!", message: "9 «А» сыныбында 2 оқушы 1-деңгейді (Қатты күйзеліс) белгіледі. 4-7-8 тыныс алу алгоритмін қолданыңыз.", time: "15 минут бұрын", read: true, classId: "class-9a" },
    { id: "notif-2", type: "engagement", title: "Оқушыларға қолдау жіберілді", message: "«Бүгінгі сабақта бәріңіз де мықты нәтиже көрсете аласыз! Сәттілік!» мотивациялық хабарламасы жеткізілді.", time: "35 минут бұрын", read: true, classId: "class-9a" },
    { id: "notif-3", type: "success", title: "Re-check нәтижесі дайын", message: "Сабақ соңында оқушылардың көңіл-күйі +32.4%-ға жақсарды. 1-деңгей толық жойылды.", time: "1 сағат бұрын", read: true, classId: "class-9a" }
  ],
  pedagogicalExercises: [
    {
      id: "ex-1",
      title: "«4-7-8» Тыныс алу техникасы",
      category: "Тыныштандыру",
      targetLevels: [1, 3],
      duration: "2 минут",
      instruction: "Мұрынмен 4с терең дем алыңыз, тынысты 7с ұстаңыз, ауызбен 8с баяу шығарыңыз.",
      audioPrompt: "Денеңізді бос ұстаңыз, терең тыныс алып, барлық қобалжуды сыртқа шығарыңыз."
    },
    {
      id: "ex-2",
      title: "«Ми гимнастикасы» (Кинезиология)",
      category: "Энергетикалық ояту",
      targetLevels: [2, 3],
      duration: "1 минут",
      instruction: "Қарама-қарсы қол мен тізені айқастырып тигізіңіз (Cross-crawl), екі алақанды қатар айналдырыңыз.",
      audioPrompt: "Миымызды оятып, энергия жинаймыз! Әр қимылды нақты орындаймыз."
    },
    {
      id: "ex-3",
      title: "«Сенім шеңбері» педагогикалық қолдау сөзі",
      category: "Сөздік қолдау",
      targetLevels: [1, 2, 4],
      duration: "1 минут",
      instruction: "Оқушыларға көз байланысын орнатып, қателесуден қорықпауды, бірге қолдау көрсететінімізді жеткізу.",
      audioPrompt: "Бір-бірімізге тірек боламыз."
    }
  ],
  emotionLevels: {
    1: {
      level: 1,
      name: "High Distress / Crisis",
      nameKz: "1-деңгей: Қатты күйзеліс / Ашу / Мазасыздық",
      tagline: "Шұғыл психологиялық-педагогикалық қолдау қажет",
      color: "#EF4444",
      bgColor: "#FEF2F2",
      borderColor: "#FCA5A5",
      emoji: "🆘",
      description: "Оқушы қатты қобалжыған, ашулы немесе іштей терең дағдарыста. Сабаққа зейін қою биологиялық тұрғыда мүмкін емес.",
      indicators: ["Тұйықталу немесе агрессия", "Жылау, қол дірілі", "Көз контактісінен қашу", "Қорғаныс реакциясы"],
      teacherActionAlgorithm: {
        urgentAction: "Сынып алдында қысым көрсетпеу, тақтаға шақырмау, сұрақтармен қинамау.",
        pedagogicalStrategy: "Эмоционалдық қауіпсіздік аймағын ұсыну. Жеке тыныштандыру карточкасы немесе су ішуге рұқсат беру.",
        verbalSupport: "«Мен сенің көңіл-күйіңді түсінемін. Бүгін саған қысым жоқ, тыныш отырып тыңдауыңа болады».",
        recommendedActivities: ["«4-7-8» тыныс алу жаттығуы (2 минут)", "Жеке демалу карточкасы", "Сенімді досымен қатар отырғызу"]
      }
    },
    2: {
      level: 2,
      name: "Fatigue / Low Energy",
      nameKz: "2-деңгей: Шаршау / Төмен қуат / Мотивацияның болмауы",
      tagline: "Энергетикалық сергіту және жеңіл қарқын қажет",
      color: "#F97316",
      bgColor: "#FFF7ED",
      borderColor: "#FDBA74",
      emoji: "🥱",
      description: "Оқушының физикалық немесе когнитивтік қуаты таусылған, ұйқысы қанбаған немесе бейжай күйде.",
      indicators: ["Есінеу, партаға жату", "Баяу жауап қайтару", "Тапсырмаға қызығушылықтың болмауы"],
      teacherActionAlgorithm: {
        urgentAction: "Монотонды ұзақ теорияны қысқартып, қозғалыс белсенділігін қосу.",
        pedagogicalStrategy: "Кинезиологиялық жаттығулар арқылы мидың оң және сол жарты шарын ояту.",
        verbalSupport: "«Біраз шаршағаныңды байқадым. Қазір бәріміз бірге 60 секунд бойы күш-қуат жинаймыз!».",
        recommendedActivities: ["60 секундтық ми гимнастикасы", "Шағын топтық диалог", "Қарапайым \"Warm-up\" қызықты сұрақ"]
      }
    },
    3: {
      level: 3,
      name: "Neutral / Distracted",
      nameKz: "3-деңгей: Бейтарап / Алаңдаушылық / Қалыпты",
      tagline: "Зейінді шоғырландыру және мақсатты қызықтыру қажет",
      color: "#EAB308",
      bgColor: "#FEFCE8",
      borderColor: "#FDE047",
      emoji: "😐",
      description: "Оқушы тыныш, бірақ сабақ тақырыбына әлі терең кіріспеген. Ойы басқа мәселеде болуы мүмкін.",
      indicators: ["Терезеге немесе телефонға қарау", "Бейтарап қалып", "Енжар қатысу"],
      teacherActionAlgorithm: {
        urgentAction: "Сабақ мақсатын жеке оқушының өмірімен байланыстыру (Практикалық құндылық).",
        pedagogicalStrategy: "«Миға шабуыл» және қызықты интерактивті провокациялық сұрақ қою.",
        verbalSupport: "«Бүгінгі тақырып сендердің болашақ жобаларың үшін өте қызықты болады, назар салайық!».",
        recommendedActivities: ["«Қармақ» әдісі (Hook question)", "Жеке шағын болжам жасау", "Визуалды презентация"]
      }
    },
    4: {
      level: 4,
      name: "Good / Ready to Learn",
      nameKz: "4-деңгей: Жақсы / Зейінді / Оқуға дайын",
      tagline: "Оңтайлы танымдық аймақ (Zone of Optimal Learning)",
      color: "#10B981",
      bgColor: "#F0FDF4",
      borderColor: "#86EFAC",
      emoji: "😊",
      description: "Оқушы эмоционалдық тұрақты күйде, сабаққа ашық, жаңа білімді қабылдауға толық дайын.",
      indicators: ["Күлімсіреу, көз байланысы", "Дәптері мен қаламы дайын", "Сұрақтарға жауап беруге ынталы"],
      teacherActionAlgorithm: {
        urgentAction: "Оң көңіл-күйді қолдап, стандартты және креативті тапсырмаларды беру.",
        pedagogicalStrategy: "Жұптық жұмыста 2-деңгейдегі оқушыларға қолдау көрсетуге ынталандыру (Peer-learning).",
        verbalSupport: "«Керемет дайындық! Бүгін жаңа биіктерді бағындырамыз деп сенемін».",
        recommendedActivities: ["Деңгейлік практикалық тапсырмалар", "Жұптық өзара оқыту", "Проблемалық есептер"]
      }
    },
    5: {
      level: 5,
      name: "Inspired / Peak Energy",
      nameKz: "5-деңгей: Шабыт / Жоғары қуат / Көшбасшылық",
      tagline: "Шығармашылық шарықтау және көшбасшылық аймағы",
      color: "#3B82F6",
      bgColor: "#EFF6FF",
      borderColor: "#93C5FD",
      emoji: "🤩",
      description: "Оқушы ерекше шабытты, өте белсенді, өз бетінше бастама көтеруге және өзгелерді жетелеуге дайын.",
      indicators: ["Қол көтеру, белсенді ұсыныстар", "Жарқын көзқарас, көтеріңкі көңіл", "Өзгелерге көмектесуге құштарлық"],
      teacherActionAlgorithm: {
        urgentAction: "Энергияны нәтижелі арнаға бағыттау, көшбасшылық рөл ұсыну.",
        pedagogicalStrategy: "Топ көшбасшысы етіп тағайындау, қиындығы жоғары немесе шығармашылық жобалық тапсырма беру.",
        verbalSupport: "«Сенің бүгінгі шабытың бүкіл сыныпқа қанат бітіреді, жарайсың!».",
        recommendedActivities: ["Топтық жоба спикері болу", "Күрделі олимпиадалық тапсырма", "Мини-түсіндіруші рөлі (Student Teacher)"]
      }
    }
  }
};
