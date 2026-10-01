import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, School } from 'lucide-react';

interface CreateClassModalProps {
  onClose: () => void;
  onCreate: (data: {
    name: string;
    grade?: string;
  }) => Promise<any>;
}

// Smart normalizer for Kazakh class names: 9 А -> 9 «А» сыныбы, 8 А -> 8 «А» сыныбы, etc.
export function formatClassNamePreview(rawInput: string): { formatted: string; grade: string } {
  let cleaned = (rawInput || '').trim();
  if (!cleaned) {
    return { formatted: '8 «А» сыныбы', grade: '8' };
  }

  // Remove existing "сыныбы", "сынып"
  cleaned = cleaned.replace(/\s*(сыныбы|сынып|класс)\s*$/i, '').trim();

  const match = cleaned.match(/^(\d{1,2})\s*[-—–_]?\s*[«"'„“]?\s*([А-Яа-яӘәІіҢңҒғҮүҰұҚқӨөҺһA-Za-z])\s*[»"'„”]?$/i);
  if (match) {
    const num = match[1];
    const letter = match[2].toUpperCase();
    return {
      formatted: `${num} «${letter}» сыныбы`,
      grade: num
    };
  }

  if (/^\d{1,2}$/.test(cleaned)) {
    return {
      formatted: `${cleaned} «А» сыныбы`,
      grade: cleaned
    };
  }

  if (/сыныбы$/i.test(cleaned)) {
    return {
      formatted: cleaned,
      grade: cleaned.match(/\d{1,2}/)?.[0] || '8'
    };
  }

  return {
    formatted: `${cleaned} сыныбы`,
    grade: cleaned.match(/\d{1,2}/)?.[0] || '8'
  };
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({
  onClose,
  onCreate
}) => {
  const [rawName, setRawName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const preview = formatClassNamePreview(rawName || '8 А');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawName.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreate({
        name: preview.formatted,
        grade: preview.grade
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Сыныпты қосу мүмкін болмады');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/30">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Жаңа сынып қосу
              </h3>
              <p className="text-xs text-slate-500">
                Сынып құрып, оқушыларды өзіңіз қолмен енгізесіз
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Class Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Сынып атауы:
            </label>
            <input
              type="text"
              placeholder="Мысалы: 7 А, 8 А, 10 Б, 5 Ә"
              value={rawName}
              onChange={(e) => setRawName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              autoFocus
            />

            {rawName.trim() && (
              <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between gap-2 mt-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-medium">Сақталатын ресми атауы:</span>
                </div>
                <span className="font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded-lg border border-blue-200 shadow-2xs">
                  {preview.formatted}
                </span>
              </div>
            )}
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <span className="text-base leading-none">✍️</span>
            <span>
              Сыныпқа автоматты түрде оқушы қосылмайды. Сынып ашылғаннан кейін оқушыларды өзіңіз қолмен қосасыз.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Болдырмау
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !rawName.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Сақталуда...' : 'Сыныпты ашу'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
