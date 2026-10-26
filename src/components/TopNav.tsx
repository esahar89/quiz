import React, { useState } from 'react';
import { Cpu, Share2, Check, LogOut, ShieldCheck, User } from 'lucide-react';

interface TopNavProps {
  role: 'guest' | 'student' | 'admin';
  sessionLabel?: string | null;
  activeQuizTitle?: string;
  onLogout: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  role,
  sessionLabel,
  activeQuizTitle,
  onLogout
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyUnifiedLink = () => {
    const url = `${window.location.origin}/`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title (Single line) */}
        <div className="flex items-center gap-3 text-right min-w-0">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Cpu className="w-5 h-5 text-slate-950" />
          </span>
          <span className="text-sm sm:text-lg font-extrabold bg-gradient-to-l from-white to-cyan-300 bg-clip-text text-transparent truncate max-w-[240px] sm:max-w-[440px]">
            {activeQuizTitle || 'منصة الاختبارات التفاعلية للطلاب'}
          </span>
        </div>

        {/* Zone 2: Current Session & Role Status */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-300">
          {role === 'guest' && (
            <span className="text-slate-400 whitespace-nowrap shrink-0">
              بوابة الدخول الموحدة (الطلاب · المشرف)
            </span>
          )}

          {role === 'student' && (
            <span className="text-cyan-300 flex items-center gap-2 whitespace-nowrap shrink-0">
              <User className="w-4 h-4 text-cyan-400" />
              <span>صلاحية طالب: {sessionLabel}</span>
            </span>
          )}

          {role === 'admin' && (
            <span className="text-emerald-400 flex items-center gap-2 whitespace-nowrap shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>صلاحية المشرف: لوحة التحكم وقاعدة البيانات ({sessionLabel})</span>
            </span>
          )}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCopyUnifiedLink}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>تم نسخ الرابط الموحد</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>نسخ رابط المنصة</span>
              </>
            )}
          </button>

          {role !== 'guest' && (
            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل خروج</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
