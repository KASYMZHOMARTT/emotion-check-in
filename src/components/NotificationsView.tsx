import React, { useState } from 'react';
import { AlertCircle, Bell, Send, CheckCircle2, AlertTriangle, Sparkles, Volume2 } from 'lucide-react';
import { AppNotification, SchoolClass } from '../types';

interface NotificationsViewProps {
  notifications: AppNotification[];
  classes: SchoolClass[];
  onMarkRead: (id: string) => void;
  onSendNotification: (classId: string, title: string, message: string) => Promise<any>;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  classes,
  onMarkRead,
  onSendNotification
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    try {
      await onSendNotification(
        selectedClassId,
        title.trim() || 'Мұғалімнің мотивациялық хабарламасы',
        message.trim()
      );
      setTitle('');
      setMessage('');
      setToastMessage('Push хабарлама барлық оқушыларға жеткізілді!');
      setTimeout(() => setToastMessage(''), 4000);

      // Web Notification API trigger if allowed
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title || 'Emotion Check-in', { body: message });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Notifications List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span>Ескертулер мен Педагогикалық хабарламалар</span>
            </h4>
            <span className="text-xs text-slate-400">
              Барлығы: {notifications.length}
            </span>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => {
              const isAlert = n.type === 'alert';
              return (
                <div
                  key={n.id}
                  onClick={() => onMarkRead(n.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isAlert
                      ? 'bg-rose-50/80 border-rose-200'
                      : !n.read
                      ? 'bg-blue-50/50 border-blue-200 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isAlert ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'
                        }`}
                      >
                        {isAlert ? <AlertTriangle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                            {n.title}
                          </h5>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {n.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Send Motivational Push Notification */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-600" />
            <span>Оқушыларға қолдау Push жіберу</span>
          </h4>

          <form onSubmit={handleSend} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Сыныпты таңдаңыз:</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">Барлық сыныптар</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Тақырыбы:</label>
              <input
                type="text"
                placeholder="Мысалы: Сабаққа сәттілік!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Хабарлама мәтіні:</label>
              <textarea
                rows={3}
                placeholder="Мысалы: «Бүгінгі сабақта әрқайсыңыздың пікірлеріңіз бағалы! Қорықпай сұрақ қойыңыздар!»..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {toastMessage && (
              <p className="text-xs font-bold text-emerald-600 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                {toastMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Жіберілуде...' : 'Push хабарлама жіберу'}</span>
            </button>
          </form>

          {/* Quick templates */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Дайын шаблондар:</p>
            <button
              type="button"
              onClick={() => setMessage('«Бүгінгі сабақта барлық оқушыларға сәттілік! Сендердің қолдарыңнан келеді!»')}
              className="w-full text-left text-xs text-slate-600 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors line-clamp-1"
            >
              🌟 «Сендердің қолдарыңнан келеді!»
            </button>
            <button
              type="button"
              onClick={() => setMessage('«Бүгін қиын тақырып болса да, бірге қадам-қадаммен талдаймыз. Уайымдамаңыздар!»')}
              className="w-full text-left text-xs text-slate-600 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors line-clamp-1"
            >
              🤝 «Бірге қадам-қадаммен талдаймыз»
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
