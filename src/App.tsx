import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Share2,
  CheckCircle2,
  Lightbulb,
  Award,
  Zap,
} from 'lucide-react';
import { PAGES_DATA } from './data/pagesData';
import type { GameType, StudentProgress } from './types';
import { Navbar } from './components/Navbar';
import { ButterflyPages } from './components/pages/ButterflyPages';
import { GrasshopperPages } from './components/pages/GrasshopperPages';
import { TeacherReportModal } from './components/TeacherReportModal';
import { GoogleWorkspaceModal } from './components/GoogleWorkspaceModal';
import {
  setMuted,
  getMuted,
  playSuccessSound,
  playApplauseSound,
  speakArabicEncouragement,
} from './utils/audio';

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeGame, setActiveGame] = useState<GameType>('butterfly');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [motionEnabled, setMotionEnabled] = useState<boolean>(true);

  // Modals state
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState<boolean>(false);

  // Student progress state
  const [progress, setProgress] = useState<StudentProgress>(() => {
    const saved = localStorage.getItem('butterfly_grasshopper_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback below
      }
    }
    return {
      studentName: 'باحث الطبيعة الصغير',
      completedPages: [],
      stars: 0,
      score: 0,
      badges: ['مستكشف مبتدئ'],
      drawings: {},
      startTime: Date.now(),
    };
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('butterfly_grasshopper_progress', JSON.stringify(progress));
  }, [progress]);

  const activePageData = PAGES_DATA.find((p) => p.pageNumber === currentPage) || PAGES_DATA[0];

  const handleSelectPage = (pageNum: number) => {
    setCurrentPage(pageNum);
    if (pageNum <= 10) {
      setActiveGame('butterfly');
    } else {
      setActiveGame('grasshopper');
    }
  };

  const handleToggleMute = () => {
    const newMuted = !isAudioMuted;
    setIsAudioMuted(newMuted);
    setMuted(newMuted);
  };

  const handleCompletePage = (pageNum: number) => {
    if (!progress.completedPages.includes(pageNum)) {
      const updatedPages = [...progress.completedPages, pageNum];
      const newStars = progress.stars + 3;

      let newBadges = [...progress.badges];
      if (updatedPages.length >= 10 && !newBadges.includes('خبير الفراشة')) {
        newBadges.push('خبير الفراشة 🦋');
      }
      if (updatedPages.length >= 20 && !newBadges.includes('عالم الحشرات الأكبر')) {
        newBadges.push('عالم الحشرات الأكبر 👑');
      }

      setProgress((prev) => ({
        ...prev,
        completedPages: updatedPages,
        stars: newStars,
        badges: newBadges,
      }));

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#EC4899', '#FBBF24', '#38BDF8', '#34D399'],
        });
      } catch {
        // Non-fatal
      }
    }
  };

  const handleSaveDrawing = (dataUrl: string) => {
    setProgress((prev) => ({
      ...prev,
      drawings: { ...prev.drawings, [currentPage]: dataUrl },
    }));
  };

  const handleNextPage = () => {
    if (currentPage < 20) {
      handleSelectPage(currentPage + 1);
    } else {
      playApplauseSound();
      speakArabicEncouragement('ألف مبارك! أتممت جميع الصفحات الـ 20 بنجاح باهر!');
      setIsTeacherModalOpen(true);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handleSelectPage(currentPage - 1);
    }
  };

  const isCurrentPageCompleted = progress.completedPages.includes(currentPage);

  return (
    <div className="min-h-screen bg-[#0B1329] text-white flex flex-col selection:bg-pink-500 selection:text-white pb-12">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onSelectPage={handleSelectPage}
        activeGame={activeGame}
        onSelectGame={(game) => {
          setActiveGame(game);
          if (game === 'butterfly' && currentPage > 10) handleSelectPage(1);
          if (game === 'grasshopper' && currentPage <= 10) handleSelectPage(11);
        }}
        stars={progress.stars}
        completedPages={progress.completedPages}
        isMuted={isAudioMuted}
        onToggleMute={handleToggleMute}
        onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
        onOpenWorkspaceModal={() => setIsWorkspaceModalOpen(true)}
        motionEnabled={motionEnabled}
        onToggleMotion={() => setMotionEnabled(!motionEnabled)}
        studentName={progress.studentName}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Page Stage Banner */}
        <section className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] border-2 border-pink-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Light */}
          <div
            className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
              activeGame === 'butterfly' ? 'bg-pink-500/10' : 'bg-yellow-400/10'
            }`}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                    activeGame === 'butterfly'
                      ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/30'
                      : 'bg-yellow-400 text-slate-900 shadow-sm shadow-yellow-400/30'
                  }`}
                >
                  {activeGame === 'butterfly'
                    ? '🦋 دورة الفراشة (التحول الكامل)'
                    : '🦗 دورة الجرادة (التحول الناقص)'}
                </span>

                <span className="text-xs text-yellow-300 font-bold bg-[#1E293B] px-2.5 py-0.5 rounded-full border border-blue-800">
                  {activePageData.stageName}
                </span>

                {isCurrentPageCompleted && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>مكتملة ✓</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {activePageData.title}
              </h2>

              <p className="text-xs sm:text-sm text-blue-200 mt-1 font-medium">
                {activePageData.subtitle}
              </p>
            </div>

            {/* Scientific Fact Pill */}
            <div className="max-w-md bg-[#0F172A]/90 border border-blue-800 p-3 sm:p-3.5 rounded-2xl flex items-start gap-2.5 shadow-inner">
              <div className="p-1.5 rounded-xl bg-yellow-400/20 text-yellow-400 shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-black text-yellow-300 block">
                  معلومة علمية للأذكياء:
                </span>
                <p className="text-xs text-gray-300 leading-relaxed mt-0.5">
                  {activePageData.scientificFact}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Interactive Page Content */}
        <section>
          {currentPage <= 10 ? (
            <ButterflyPages
              page={activePageData}
              onCompletePage={handleCompletePage}
              isCompleted={isCurrentPageCompleted}
              onSaveDrawing={handleSaveDrawing}
              savedDrawing={progress.drawings[currentPage]}
            />
          ) : (
            <GrasshopperPages
              page={activePageData}
              onCompletePage={handleCompletePage}
              isCompleted={isCurrentPageCompleted}
            />
          )}
        </section>

        {/* Bottom Pagination Controls */}
        <footer className="bg-[#1E293B]/90 border-t-2 border-blue-900/60 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="px-4 py-2.5 rounded-2xl bg-[#0F172A] hover:bg-blue-900/60 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none border border-blue-800"
            >
              <ChevronRight className="w-4 h-4" />
              <span>الصفحة السابقة</span>
            </button>

            <span className="text-xs font-black text-blue-300 px-3 py-1 bg-black/40 rounded-xl">
              {currentPage} / 20
            </span>

            <button
              onClick={handleNextPage}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-slate-900 font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-pink-500/20 active:scale-95"
            >
              <span>{currentPage < 20 ? 'الصفحة التالية' : 'التتويج والشهادة 🎓'}</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isCurrentPageCompleted ? (
              <button
                onClick={() => handleCompletePage(currentPage)}
                className="px-4 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-emerald-500"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تسجيل إتمام الصفحة</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500">
                <Sparkles className="w-4 h-4" />
                <span>أحسنت! نلت 3 نجوم لهذه الصفحة!</span>
              </div>
            )}
          </div>
        </footer>
      </main>

      {/* Teacher Report & Offline Package Modal */}
      <TeacherReportModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        progress={progress}
        onUpdateStudentName={(name) => setProgress((prev) => ({ ...prev, studentName: name }))}
      />

      {/* Google Workspace Modal (Slides & Tasks) */}
      <GoogleWorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        completedPagesCount={progress.completedPages.length}
        studentName={progress.studentName}
      />
    </div>
  );
}
