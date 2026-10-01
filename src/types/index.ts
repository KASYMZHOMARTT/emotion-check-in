export interface Teacher {
  id: string;
  name: string;
  title?: string;
  school?: string;
  subject?: string;
  email?: string;
  avatar?: string;
  role?: 'teacher' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: Teacher;
}

export interface SchoolClass {
  id: string;
  name: string;
  subject?: string;
  grade?: string;
  studentCount: number;
  room?: string;
  schedule?: string;
}

export interface Student {
  id: string;
  classId: string;
  name: string;
  pin?: string;
  gender?: 'M' | 'F' | string;
  avatarIndex?: number;
  recentGrade?: number; // 1-10 баллдық жүйе
  academicStatus?: 'Үздік' | 'Жақсы' | 'Орташа' | 'Қолдау қажет';
}

export interface EmotionLevelConfig {
  level: number;
  name: string;
  nameKz: string;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
  emoji: string;
  description: string;
  indicators: string[];
  teacherActionAlgorithm: {
    urgentAction: string;
    pedagogicalStrategy: string;
    verbalSupport: string;
    recommendedActivities: string[];
  };
}

export interface CheckInRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  pin?: string;
  level: number;
  energyLevel: number;
  primaryFactor: string;
  notesToTeacher: string;
  wantsPrivateHelp: boolean;
  durationSeconds: number;
  status?: 'completed' | 'absent' | 'missed';
  createdAt: string;
}

export interface CheckInSession {
  id: string;
  title: string;
  classId: string;
  className: string;
  subject?: string;
  date: string;
  createdAt: string;
  status: 'active' | 'completed';
  type: 'initial' | 'recheck';
  parentSessionId?: string;
  hasRecheck?: boolean;
  recheckSessionId?: string;
  recheckStats?: {
    supportIndex: number;
    averageLevel: number;
    submissionCount: number;
    breakdown: Record<number, number>;
    improvementPercent: number;
  };
  targetTimeSeconds?: number;
  submissionCount: number;
  absentCount?: number;
  totalStudents: number;
  supportIndex: number; // 0-100%
  averageLevel: number; // 1.0 - 5.0
  breakdown: Record<number, number>;
  urgentSupportCount: number;
  improvementPercent?: number;
  teacherPedagogicalActionsTaken?: string[];
}

export interface AppNotification {
  id: string;
  type: 'alert' | 'engagement' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
  classId?: string;
}

export interface PedagogicalExercise {
  id: string;
  title: string;
  category: string;
  targetLevels: number[];
  duration: string;
  instruction: string;
  audioPrompt: string;
}

export interface BootstrapData {
  teacher: Teacher;
  classes: SchoolClass[];
  students: Student[];
  sessions: CheckInSession[];
  checkIns: CheckInRecord[];
  notifications: AppNotification[];
  pedagogicalExercises: PedagogicalExercise[];
  emotionLevels: Record<number, EmotionLevelConfig>;
}
