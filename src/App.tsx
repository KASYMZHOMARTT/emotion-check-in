import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { ActiveSessionsList } from './components/ActiveSessionsList';
import { WorkflowStepper } from './components/WorkflowStepper';
import { SupportIndexTrendChart } from './components/SupportIndexTrendChart';
import { EmotionCard5LevelModal } from './components/EmotionCard5LevelModal';
import { StudentKioskModal } from './components/StudentKioskModal';
import { SessionAnalyticsModal } from './components/SessionAnalyticsModal';
import { PedagogicalToolkitModal } from './components/PedagogicalToolkitModal';
import { PrintableCardsModal } from './components/PrintableCardsModal';
import { ClassManagement } from './components/ClassManagement';
import { NotificationsView } from './components/NotificationsView';
import { SettingsView } from './components/SettingsView';
import { AIInsightsView } from './components/AIInsightsView';
import { PedagogicalTipsPdfModal } from './components/PedagogicalTipsPdfModal';
import { SessionComparisonView } from './components/SessionComparisonView';
import { GradesAndResearchAnalyticsView } from './components/GradesAndResearchAnalyticsView';
import { AuthView } from './components/AuthView';
import { SmartGroupingModal } from './components/SmartGroupingModal';
import { OfficialReportModal } from './components/OfficialReportModal';
import { api, authStorage } from './services/api';
import {
  BootstrapData,
  CheckInSession,
  SchoolClass,
  Student,
  CheckInRecord,
  AppNotification,
  EmotionLevelConfig,
  Teacher
} from './types';
import { Sparkles, Layers, RotateCcw, AlertTriangle, TabletSmartphone, BookOpen } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<BootstrapData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!authStorage.getToken();
  });
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1200;
    }
    return false;
  });

  // Modals state
  const [showMatrixModal, setShowMatrixModal] = useState<boolean>(false);
  const [showKioskModal, setShowKioskModal] = useState<boolean>(false);
  const [showSmartGroupingModal, setShowSmartGroupingModal] = useState<boolean>(false);
  const [showOfficialReportModal, setShowOfficialReportModal] = useState<boolean>(false);
  const [kioskSession, setKioskSession] = useState<CheckInSession | undefined>(undefined);
  const [kioskClassId, setKioskClassId] = useState<string | undefined>(undefined);
  const [kioskStudentId, setKioskStudentId] = useState<string | undefined>(undefined);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSessionForAnalytics, setSelectedSessionForAnalytics] = useState<CheckInSession | null>(null);
  const [showToolkitModal, setShowToolkitModal] = useState<boolean>(false);
  const [toolkitTool, setToolkitTool] = useState<'breathing' | 'brain_gym' | 'verbal'>('breathing');
  const [showPrintCardsModal, setShowPrintCardsModal] = useState<boolean>(false);
  const [showPdfTipsModal, setShowPdfTipsModal] = useState<boolean>(false);
  const [pdfTipsSession, setPdfTipsSession] = useState<CheckInSession | null>(null);
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'comparison' | 'all'>('comparison');
  const [comparisonSessionA, setComparisonSessionA] = useState<string | undefined>(undefined);
  const [comparisonSessionB, setComparisonSessionB] = useState<string | undefined>(undefined);

  const handleOpenPdfTips = (sess: CheckInSession) => {
    setPdfTipsSession(sess);
    setShowPdfTipsModal(true);
  };

  // Load initial data
  const loadData = async () => {
    try {
      const res = await api.getBootstrap();
      setData(res);

      if (authStorage.getToken()) {
        try {
          const me = await api.getMe();
          if (me.user) {
            setCurrentTeacher(me.user);
            setIsAuthenticated(true);
          }
        } catch {
          // Token expired or invalid
          authStorage.clearToken();
          setIsAuthenticated(false);
          if (res.teacher) setCurrentTeacher(res.teacher);
        }
      } else if (res.teacher) {
        setCurrentTeacher(res.teacher);
      }

      if (res.classes && res.classes.length > 0) {
        setSelectedClassId((prev) => {
          const savedClass = localStorage.getItem('emotion_selected_class');
          if (savedClass && res.classes.some((c: any) => c.id === savedClass)) {
            return savedClass;
          }
          const exists = res.classes.some((c: any) => c.id === prev);
          return exists && prev ? prev : (res.classes[0]?.id || '');
        });
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
      if (!authStorage.getToken()) {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      localStorage.setItem('emotion_selected_class', selectedClassId);
    }
  }, [selectedClassId]);

  const handleAuthSuccess = async (teacher: Teacher) => {
    setCurrentTeacher(teacher);
    setIsAuthenticated(true);
    await loadData();
  };

  const handleLogout = async () => {
    await api.logout();
    setIsAuthenticated(false);
    setCurrentTeacher(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('emotion_selected_class');
    }
    setSelectedClassId('');
  };

  const handleUpdateProfile = async (profileData: any) => {
    const res = await api.updateProfile(profileData);
    if (res.user) {
      setCurrentTeacher(res.user);
      if (data) {
        setData({ ...data, teacher: res.user });
      }
    }
    return res;
  };

  const handleResetDemo = async () => {
    if (window.confirm('Барлық зерттеу деректерін бастапқы қалпына келтіруді қалайсыз ба?')) {
      try {
        const res = await api.resetDemo();
        setData(res);
        alert('Деректер қалпына келтірілді!');
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // Start Re-check
  const handleStartRecheck = async (sess: CheckInSession) => {
    try {
      const res = await api.startRecheck(sess.id);
      await loadData();
      setSelectedSessionForAnalytics(res.recheckSession);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Student check-in submission from kiosk
  const handleSubmitCheckIn = async (checkInData: any) => {
    const res = await api.submitCheckIn(checkInData);
    await loadData();
    return res;
  };

  const handleMarkAbsent = async (params: { sessionId: string; studentId: string }) => {
    const res = await api.markStudentAbsent(params);
    await loadData();
    return res;
  };

  const handleFinalizeAbsent = async (sessionId: string) => {
    const res = await api.finalizeSessionAbsent(sessionId);
    await loadData();
    return res;
  };

  // Notifications
  const handleSendNotification = async (classId: string, title: string, message: string) => {
    const res = await api.sendNotification({ classId, title, message });
    await loadData();
    return res;
  };

  const handleMarkNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    if (data) {
      setData({
        ...data,
        notifications: data.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      });
    }
  };

  // Add class and student
  const handleAddClass = async (classData: Partial<SchoolClass>) => {
    const res = await api.createClass(classData);
    await loadData();
    return res;
  };

  const handleAddStudent = async (studentData: { classId: string; name: string; gender?: string }) => {
    const res = await api.addStudent(studentData);
    await loadData();
    return res;
  };

  const handleDeleteClass = async (classId: string) => {
    const res = await api.deleteClass(classId);
    await loadData();
    return res;
  };

  const handleDeleteStudent = async (studentId: string) => {
    const res = await api.deleteStudent(studentId);
    await loadData();
    return res;
  };

  const handleUpdateGrade = async (studentId: string, grade: number) => {
    const res = await api.updateStudentGrade(studentId, grade);
    await loadData();
    return res;
  };

  const handleUpdateTeacher = async (name: string) => {
    const res = await api.updateTeacher({ name });
    await loadData();
    return res;
  };

  const handleWorkflowStep = (stepId: string) => {
    if (stepId === 'step-class' || stepId === 'step-students' || stepId === 'step-start') {
      setCurrentTab('students');
    } else if (stepId === 'step-kiosk') {
      setKioskSession(activeSessions[0] || data?.sessions[0]);
      setShowKioskModal(true);
    } else if (stepId === 'step-index') {
      setCurrentTab('ai-insights');
    } else if (stepId === 'step-db') {
      setCurrentTab('analytics');
    } else if (stepId === 'step-analytics') {
      const sess = activeSessions[0] || data?.sessions[0];
      if (sess) setSelectedSessionForAnalytics(sess);
    } else if (stepId === 'step-algorithm') {
      setShowMatrixModal(true);
    } else if (stepId === 'step-recheck') {
      const sess = activeSessions[0] || data?.sessions[0];
      if (sess) handleStartRecheck(sess);
    } else if (stepId === 'step-compare') {
      const recheckSess = data?.sessions.find((s) => s.hasRecheck) || data?.sessions[0];
      if (recheckSess) setSelectedSessionForAnalytics(recheckSess);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
            <BookOpen className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-200">«Emotion Check-in» жүктелуде...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthView
          onAuthSuccess={handleAuthSuccess}
          onOpenKiosk={() => {
            const sess = data?.sessions?.[0];
            setKioskSession(sess);
            setShowKioskModal(true);
          }}
        />

        {/* Student Tablet Kiosk (Can also be used directly from Auth screen) */}
        {showKioskModal && data && data.emotionLevels && (
          <StudentKioskModal
            session={kioskSession || data.sessions[0]}
            initialClassId={kioskClassId || selectedClassId}
            initialStudentId={kioskStudentId}
            allSessions={data.sessions}
            students={data.students}
            classes={data.classes}
            checkIns={data.checkIns}
            levels={data.emotionLevels}
            onClose={() => {
              setShowKioskModal(false);
              setKioskClassId(undefined);
              setKioskStudentId(undefined);
            }}
            onSubmitCheckIn={handleSubmitCheckIn}
            onMarkAbsent={handleMarkAbsent}
            onFinalizeAbsent={handleFinalizeAbsent}
          />
        )}
      </>
    );
  }

  if (!data) {
    return null;
  }

  const unreadAlertsCount = data.notifications.filter((n) => !n.read && n.type === 'alert').length;
  const activeSessions = data.sessions.filter((s) => s.status === 'active');
  const totalStudentsCount = data.students.length;
  const totalCheckInsCount = data.checkIns.length;
  const activeOrAllSessions = data.sessions.filter((s) => s.submissionCount > 0);
  const primarySupportIndex = activeOrAllSessions.length > 0
    ? Number((activeOrAllSessions.reduce((acc, s) => acc + s.supportIndex, 0) / activeOrAllSessions.length).toFixed(1))
    : data.sessions[0]?.supportIndex || 85.0;
  const avgScore = activeOrAllSessions.length > 0
    ? (activeOrAllSessions.reduce((acc, s) => acc + s.averageLevel, 0) / activeOrAllSessions.length).toFixed(2)
    : (data.sessions[0]?.averageLevel || 3.8).toFixed(2);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-row bg-slate-50/50">
      {/* 1. Left Sidebar matching reference screenshot */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'matrix') {
            setShowMatrixModal(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        teacher={currentTeacher || data.teacher}
        unreadAlertsCount={unreadAlertsCount}
        onOpenKiosk={() => {
          setKioskSession(activeSessions[0] || data.sessions[0]);
          setShowKioskModal(true);
        }}
        onOpenPrintCards={() => setShowPrintCardsModal(true)}
        onOpenPdfTips={() => handleOpenPdfTips(data.sessions[0])}
        onOpenSmartGrouping={() => setShowSmartGroupingModal(true)}
        onOpenOfficialReport={() => setShowOfficialReportModal(true)}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Area: Dedicated scrollable viewport */}
      <div className="flex-1 h-screen overflow-y-auto overflow-x-hidden min-w-0 flex flex-col">
        <main className="flex-1 p-3 sm:p-5 lg:p-6 space-y-5 max-w-7xl w-full mx-auto">
          {/* Top Header */}
          <Header
            title={
              currentTab === 'dashboard'
                ? 'Қош келдіңіз!'
                : currentTab === 'sessions'
                  ? 'Тапсырмалар мен Сессиялар'
                  : currentTab === 'ai-insights'
                    ? 'AI Педагогикалық Аналитика (Gemini)'
                    : currentTab === 'analytics'
                      ? 'Бағалар мен Зерттеу Аналитикасы'
                      : currentTab === 'students'
                        ? 'Оқушылар мен Сыныптар'
                        : currentTab === 'notifications'
                          ? 'Ескертулер мен Хабарламалар'
                          : 'Жүйелік Баптаулар'
            }
            subtitle={
              currentTab === 'dashboard'
                ? 'Мұғалім панелінің шолуы'
                : currentTab === 'ai-insights'
                  ? 'Gemini API арқылы апталық Қолдау Индексінің трендтерін талдау және табиғи тілдегі қорытынды'
                  : 'Emotion Check-in ғылыми-педагогикалық басқару ортасы'
            }
            classes={data.classes}
            selectedClassId={selectedClassId}
            onSelectClass={setSelectedClassId}
            showClassSelector={currentTab !== 'dashboard'}
            onOpenKiosk={() => {
              setKioskSession(activeSessions[0] || data.sessions[0]);
              setShowKioskModal(true);
            }}
            onResetDemo={handleResetDemo}
            onOpenSmartGrouping={() => setShowSmartGroupingModal(true)}
            onOpenOfficialReport={() => setShowOfficialReportModal(true)}
            teacher={currentTeacher || data.teacher}
            onLogout={handleLogout}
          />

          {/* Highlight Banner: 5-деңгейлі карта & алгоритм Quick Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-4 sm:p-5 text-white shadow-md shadow-blue-500/15 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
                  Негізгі әдістемелік өнім
                </span>
                <span className="text-blue-100 text-xs font-medium">60 секундта анықтау</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                5 деңгейлі Emotion Check-in картасы + Мұғалім әрекетінің алгоритмі
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed max-w-2xl">
                Оқушының сабақ алдындағы эмоционалдық күйін 60 секундта анықтап, инклюзивті орта құру және сабақ тиімділігін 30-40%-ға арттыру. Смартфонсыз сыныптар үшін ортақ планшет немесе қағаз карталар қарастырылған.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                onClick={() => setShowMatrixModal(true)}
                className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-white hover:bg-blue-50 text-blue-700 font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4 text-blue-600" />
                <span>5 деңгейлі картаны ашу</span>
              </button>

              <button
                onClick={() => {
                  setToolkitTool('breathing');
                  setShowToolkitModal(true);
                }}
                className="px-3 sm:px-3.5 py-2 sm:py-2.5 bg-blue-500/40 hover:bg-blue-500/60 border border-white/20 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>«4-7-8» Тыныс алу таймері</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Dashboard */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Top 4 Stats Cards matching reference image */}
              <StatsCards
                totalStudents={totalStudentsCount}
                classesCount={data.classes.length}
                activeTasksCount={activeSessions.length}
                completedChecksCount={totalCheckInsCount}
                averageScore={avgScore}
                supportIndex={primarySupportIndex}
              />

              {/* 10-Step Interactive Workflow */}
              <WorkflowStepper onStepClick={handleWorkflowStep} />

              {/* 30-Day Longitudinal Recharts Data Visualization */}
              <SupportIndexTrendChart
                classes={data.classes}
                sessions={data.sessions}
                selectedClassId={selectedClassId}
              />

              {/* Active Sessions List matching screenshot bottom */}
              <ActiveSessionsList
                sessions={data.sessions}
                classes={data.classes}
                onSelectSession={(sess) => setSelectedSessionForAnalytics(sess)}
                onStartRecheck={handleStartRecheck}
                onOpenKioskForSession={(sess) => {
                  setKioskSession(sess);
                  setShowKioskModal(true);
                }}
                onOpenKioskForClass={(clsId) => {
                  const sess = data.sessions.find((s) => s.classId === clsId) || data.sessions[0];
                  setKioskSession(sess);
                  setShowKioskModal(true);
                }}
                onOpenTeacherAlgorithm={(sess) => {
                  setSelectedSessionForAnalytics(sess);
                }}
                onOpenPdfTips={handleOpenPdfTips}
              />
            </div>
          )}

          {/* Tab 2: Sessions */}
          {currentTab === 'sessions' && (
            <div className="space-y-4">
              <ActiveSessionsList
                sessions={data.sessions}
                classes={data.classes}
                selectedClassId={selectedClassId}
                onSelectClass={setSelectedClassId}
                onSelectSession={(sess) => setSelectedSessionForAnalytics(sess)}
                onStartRecheck={handleStartRecheck}
                onOpenKioskForSession={(sess) => {
                  setKioskSession(sess);
                  setKioskClassId(sess.classId);
                  setShowKioskModal(true);
                }}
                onOpenKioskForClass={(clsId) => {
                  const sess = data.sessions.find((s) => s.classId === clsId) || data.sessions[0];
                  setKioskSession(sess);
                  setKioskClassId(clsId);
                  setShowKioskModal(true);
                }}
                onOpenTeacherAlgorithm={(sess) => setSelectedSessionForAnalytics(sess)}
                onOpenPdfTips={handleOpenPdfTips}
              />
            </div>
          )}

          {/* Tab 3: Grades & Research Analytics */}
          {currentTab === 'analytics' && (
            <GradesAndResearchAnalyticsView
              classes={data.classes}
              students={data.students}
              sessions={data.sessions}
              checkIns={data.checkIns}
              levels={data.emotionLevels}
              selectedClassId={selectedClassId}
              onSelectClass={setSelectedClassId}
              onUpdateGrade={handleUpdateGrade}
              onSelectSessionForAnalytics={(sess) => setSelectedSessionForAnalytics(sess)}
              onOpenBreathingTimer={() => {
                setToolkitTool('breathing');
                setShowToolkitModal(true);
              }}
              onOpenBrainGym={() => {
                setToolkitTool('brain_gym');
                setShowToolkitModal(true);
              }}
              initialSessionAId={comparisonSessionA}
              initialSessionBId={comparisonSessionB}
            />
          )}

          {/* Tab: AI Insights */}
          {currentTab === 'ai-insights' && (
            <AIInsightsView
              classes={data.classes}
              sessions={data.sessions}
              selectedClassId={selectedClassId}
              onSelectClass={setSelectedClassId}
              onOpenBreathingTimer={() => {
                setToolkitTool('breathing');
                setShowToolkitModal(true);
              }}
              onOpenBrainGym={() => {
                setToolkitTool('brain_gym');
                setShowToolkitModal(true);
              }}
              onSendNotification={handleSendNotification}
            />
          )}

          {/* Tab 4: Students & Classes */}
          {currentTab === 'students' && (
            <ClassManagement
              classes={data.classes}
              students={data.students}
              selectedClassId={selectedClassId}
              onSelectClass={setSelectedClassId}
              onAddClass={handleAddClass}
              onAddStudent={handleAddStudent}
              onDeleteClass={handleDeleteClass}
              onDeleteStudent={handleDeleteStudent}
              onOpenPrintCards={() => setShowPrintCardsModal(true)}
              onOpenKioskForClass={(clsId) => {
                const sess = data.sessions.find((s) => s.classId === clsId) || data.sessions[0];
                setKioskSession(sess);
                setKioskClassId(clsId);
                setShowKioskModal(true);
              }}
            />
          )}

          {/* Tab 5: Notifications */}
          {currentTab === 'notifications' && (
            <NotificationsView
              notifications={data.notifications}
              classes={data.classes}
              onMarkRead={handleMarkNotificationRead}
              onSendNotification={handleSendNotification}
            />
          )}

          {/* Tab 6: Settings */}
          {currentTab === 'settings' && (
            <SettingsView
              teacher={currentTeacher || data.teacher}
              onUpdateTeacher={handleUpdateTeacher}
              onUpdateProfile={handleUpdateProfile}
              onResetDemo={handleResetDemo}
              onOpenKiosk={() => {
                setKioskSession(activeSessions[0] || data.sessions[0]);
                setShowKioskModal(true);
              }}
              onOpenMatrix={() => setShowMatrixModal(true)}
              onOpenPrintCards={() => setShowPrintCardsModal(true)}
              onOpenSmartGrouping={() => setShowSmartGroupingModal(true)}
              onOpenOfficialReport={() => setShowOfficialReportModal(true)}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. 5-Level Emotion Check-in Card & Teacher Algorithm Modal */}
      {showMatrixModal && data.emotionLevels && (
        <EmotionCard5LevelModal
          levels={data.emotionLevels}
          onClose={() => setShowMatrixModal(false)}
          onOpenBreathingTimer={() => {
            setShowMatrixModal(false);
            setToolkitTool('breathing');
            setShowToolkitModal(true);
          }}
          onOpenBrainGym={() => {
            setShowMatrixModal(false);
            setToolkitTool('brain_gym');
            setShowToolkitModal(true);
          }}
        />
      )}

      {/* 2. Student Tablet Kiosk (60s Check-in without phones!) */}
      {showKioskModal && data.emotionLevels && (
        <StudentKioskModal
          session={kioskSession}
          initialClassId={kioskClassId || selectedClassId}
          initialStudentId={kioskStudentId}
          allSessions={data.sessions}
          students={data.students}
          classes={data.classes}
          checkIns={data.checkIns}
          levels={data.emotionLevels}
          onClose={() => {
            setShowKioskModal(false);
            setKioskClassId(undefined);
            setKioskStudentId(undefined);
          }}
          onSubmitCheckIn={handleSubmitCheckIn}
          onMarkAbsent={handleMarkAbsent}
          onFinalizeAbsent={handleFinalizeAbsent}
          onOpenTeacherAnalytics={(sess) => {
            setShowKioskModal(false);
            setSelectedSessionForAnalytics(sess);
          }}
        />
      )}

      {/* 3. Session Analytics & Re-check Comparison Modal */}
      {selectedSessionForAnalytics && data.emotionLevels && (
        <SessionAnalyticsModal
          session={selectedSessionForAnalytics}
          allSessions={data.sessions}
          checkIns={data.checkIns}
          levels={data.emotionLevels}
          onClose={() => setSelectedSessionForAnalytics(null)}
          onStartRecheck={handleStartRecheck}
          onOpenBreathingTimer={() => {
            setToolkitTool('breathing');
            setShowToolkitModal(true);
          }}
          onOpenBrainGym={() => {
            setToolkitTool('brain_gym');
            setShowToolkitModal(true);
          }}
          onSendNotification={handleSendNotification}
          onOpenPdfTips={handleOpenPdfTips}
          onOpenComparison={(sessAId, sessBId) => {
            setComparisonSessionA(sessAId);
            if (sessBId) setComparisonSessionB(sessBId);
            setAnalyticsSubTab('comparison');
            setCurrentTab('analytics');
          }}
        />
      )}

      {/* 4. Pedagogical Toolkit Modal (Breathing Timer, Brain Gym) */}
      {showToolkitModal && (
        <PedagogicalToolkitModal
          initialTool={toolkitTool}
          onClose={() => setShowToolkitModal(false)}
        />
      )}

      {/* 5. Printable Paper Cards & Student Desk Badges */}
      {showPrintCardsModal && data.emotionLevels && (
        <PrintableCardsModal
          classes={data.classes}
          students={data.students}
          levels={data.emotionLevels}
          initialClassId={selectedClassId}
          onClose={() => setShowPrintCardsModal(false)}
          onStartCheckInForStudent={(student) => {
            setShowPrintCardsModal(false);
            const sess = data.sessions.find((s) => s.classId === student.classId) || data.sessions[0];
            setKioskSession(sess);
            setKioskClassId(student.classId);
            setKioskStudentId(student.id);
            setShowKioskModal(true);
          }}
        />
      )}

      {/* 6. Pedagogical Tips PDF Modal */}
      {showPdfTipsModal && pdfTipsSession && data.emotionLevels && (
        <PedagogicalTipsPdfModal
          session={pdfTipsSession}
          classes={data.classes}
          teacher={data.teacher}
          levels={data.emotionLevels}
          checkIns={data.checkIns}
          onClose={() => setShowPdfTipsModal(false)}
        />
      )}

      {/* 7. Smart Grouping Modal */}
      {showSmartGroupingModal && data && data.emotionLevels && (
        <SmartGroupingModal
          classes={data.classes}
          students={data.students}
          sessions={data.sessions}
          checkIns={data.checkIns}
          levels={data.emotionLevels}
          initialClassId={selectedClassId}
          onClose={() => setShowSmartGroupingModal(false)}
        />
      )}

      {/* 8. Official Attestation & Research Report Modal */}
      {showOfficialReportModal && data && data.emotionLevels && (
        <OfficialReportModal
          classes={data.classes}
          sessions={data.sessions}
          checkIns={data.checkIns}
          levels={data.emotionLevels}
          teacher={currentTeacher || data.teacher}
          onClose={() => setShowOfficialReportModal(false)}
        />
      )}
    </div>
  );
}
