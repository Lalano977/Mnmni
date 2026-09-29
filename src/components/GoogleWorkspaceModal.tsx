import React, { useState, useEffect } from 'react';
import {
  X,
  Presentation,
  CheckSquare,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
} from 'lucide-react';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
} from '../services/auth';
import { createLifecyclePresentation } from '../services/googleSlides';
import { getOrCreateTaskList, addEducationalTasks, fetchTasks, TaskItem } from '../services/googleTasks';
import type { User } from 'firebase/auth';
import { playSuccessSound } from '../utils/audio';

interface GoogleWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedPagesCount: number;
  studentName: string;
}

export const GoogleWorkspaceModal: React.FC<GoogleWorkspaceModalProps> = ({
  isOpen,
  onClose,
  completedPagesCount,
  studentName,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [presentationUrl, setPresentationUrl] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        playSuccessSound();
        setStatusMessage({
          type: 'success',
          text: `تم تسجيل الدخول بنجاح بحساب ${res.user.displayName || res.user.email}!`,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'فشل تسجيل الدخول';
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setPresentationUrl(null);
    setTasks([]);
    setStatusMessage({ type: 'info', text: 'تم تسجيل الخروج بنجاح.' });
  };

  const handleExportSlides = async () => {
    const activeToken = token || (await getAccessToken());
    if (!activeToken) {
      setStatusMessage({ type: 'error', text: 'يرجى تسجيل الدخول أولاً للوصول إلى Google Slides.' });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: 'info', text: 'جارٍ إنشاء عرض Google Slides وتنسيق الشرائح...' });
    try {
      const result = await createLifecyclePresentation(activeToken, {
        title: `دورة نمو الفراشة والجرادة - إنجاز ${studentName || 'الطالب'}`,
        studentName: studentName || 'الباحث الصغير',
        completedPagesCount,
      });
      setPresentationUrl(result.presentationUrl);
      playSuccessSound();
      setStatusMessage({
        type: 'success',
        text: 'تم إنشاء وتصدير العرض التقديمي في Google Slides بنجاح!',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء الاتصال بـ Google Slides';
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTasks = async () => {
    const activeToken = token || (await getAccessToken());
    if (!activeToken) {
      setStatusMessage({ type: 'error', text: 'يرجى تسجيل الدخول أولاً للوصول إلى Google Tasks.' });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: 'info', text: 'جارٍ إضافة المهام والواجبات التعليمية إلى Google Tasks...' });
    try {
      const listId = await getOrCreateTaskList(activeToken, 'مهام دورة الفراشة والجرادة (علوم)');
      const tasksToCreate = [
        {
          title: 'ملاحظة ورسم أجنحة الفراشة بالتناظر',
          notes: 'إتمام النشاط التفاعلي في صفحة 10 وملاحظة تناظر الألوان في الطبيعة.',
        },
        {
          title: 'حماية الشرنقة والتعرف على التحول الكامل',
          notes: 'التأكيد على عدم فتح الشرنقة قبل أوانها للحفاظ على سلامة أجنحة الفراشة.',
        },
        {
          title: 'تحدي قفز الجرادة وتمارين السيقان الخلفية',
          notes: 'ممارسة 5 قفزات رياضية ومقارنة أرجل الجرادة بأرجل الحشرات الأخرى.',
        },
        {
          title: 'المقارنة الكبرى بين التحول الكامل والتحول الناقص',
          notes: 'مراجعة الفروق بين حورية الجرادة ويرقة الفراشة.',
        },
      ];

      await addEducationalTasks(activeToken, listId, tasksToCreate);
      const updatedList = await fetchTasks(activeToken, listId);
      setTasks(updatedList);

      playSuccessSound();
      setStatusMessage({
        type: 'success',
        text: 'تمت إضافة التكليفات والمهام التعليمية إلى تطبيق Google Tasks بنجاح!',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء الاتصال بـ Google Tasks';
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1E293B] border-4 border-yellow-400 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-5 flex items-center justify-between text-white border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-slate-900 flex items-center justify-center font-black text-xl shadow-md">
              ⚡
            </div>
            <div>
              <h2 className="text-lg font-black text-white">تكامل Google Workspace</h2>
              <p className="text-xs text-yellow-300">Google Slides & Google Tasks</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-white">
          {/* User Sign-In Section */}
          <div className="bg-[#0F172A] p-4 rounded-2xl border border-blue-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            {user ? (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm">
                  {user.displayName ? user.displayName.charAt(0) : 'U'}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{user.displayName || 'مستخدم مسجل'}</div>
                  <div className="text-xs text-blue-300">{user.email}</div>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-bold text-white">سجّل الدخول بحساب Google</h4>
                <p className="text-xs text-gray-400">
                  لتمكين تصدير شرائح الدروس إلى Slides وإنشاء المهام في Tasks
                </p>
              </div>
            )}

            <div>
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>تسجيل الخروج</span>
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>تسجيل الدخول عبر Google</span>
                </button>
              )}
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-blue-950/60 border-blue-500 text-blue-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Google Slides Card */}
            <div className="bg-[#0F172A] p-4 rounded-2xl border border-yellow-400/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-yellow-400 text-slate-900">
                    <Presentation className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-yellow-300">Google Slides</h3>
                    <span className="text-[11px] text-gray-400">تصدير شرائح الدروس الـ 20</span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  توليد عرض شرائح تقديمي فوري يتضمن مراحل التحول الكامل والناقص وإنجازات الطالب للمراجعة في الصف.
                </p>
              </div>

              <div>
                <button
                  onClick={handleExportSlides}
                  disabled={loading}
                  className="w-full py-2.5 px-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <Presentation className="w-4 h-4" />
                  <span>تصدير إلى Google Slides</span>
                </button>

                {presentationUrl && (
                  <a
                    href={presentationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 w-full py-2 px-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-blue-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-blue-700"
                  >
                    <span>فتح العرض في Google Slides</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Google Tasks Card */}
            <div className="bg-[#0F172A] p-4 rounded-2xl border border-blue-600/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-blue-600 text-white">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-300">Google Tasks</h3>
                    <span className="text-[11px] text-gray-400">واجبات وتكليفات الطالب</span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  إرسال قائمة المهام والأنشطة العملية إلى Google Tasks لمتابعة إتمام التمارين الحركية وأسئلة التفكير.
                </p>
              </div>

              <div>
                <button
                  onClick={handleCreateTasks}
                  disabled={loading}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>إضافة المهام إلى Google Tasks</span>
                </button>

                {tasks.length > 0 && (
                  <div className="mt-2 p-2 bg-[#1E293B] rounded-xl border border-blue-800 text-[11px] text-blue-200">
                    <div className="font-bold text-yellow-300 mb-1">المهام المضافة ({tasks.length}):</div>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-300">
                      {tasks.slice(0, 3).map((t, idx) => (
                        <li key={idx} className="truncate">{t.title}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
