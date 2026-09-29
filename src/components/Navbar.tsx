import React from 'react';
import {
  Volume2,
  VolumeX,
  Award,
  Sparkles,
  Download,
  Share2,
  BookOpen,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import type { GameType } from '../types';

interface NavbarProps {
  currentPage: number;
  onSelectPage: (page: number) => void;
  activeGame: GameType;
  onSelectGame: (game: GameType) => void;
  stars: number;
  completedPages: number[];
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenTeacherModal: () => void;
  onOpenWorkspaceModal: () => void;
  motionEnabled: boolean;
  onToggleMotion: () => void;
  studentName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onSelectPage,
  activeGame,
  onSelectGame,
  stars,
  completedPages,
  isMuted,
  onToggleMute,
  onOpenTeacherModal,
  onOpenWorkspaceModal,
  motionEnabled,
  onToggleMotion,
  studentName,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b-4 border-pink-500 shadow-xl px-3 py-2 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-pink-500/30 text-2xl transform hover:scale-105 transition-transform">
              ✨
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                مغامرات نمو <span className="text-pink-400">الفراشة</span> و <span className="text-yellow-400">الجرادة</span>
              </h1>
              <p className="text-xs text-blue-200 hidden sm:block">
                20 صفحة تفاعلية • حركة • رسم • تفكير • أوفلاين
              </p>
            </div>
          </div>

          {/* Student Profile & Stars Badge */}
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 px-3 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{stars}</span>
              <span className="text-[10px] text-yellow-200">نجمة</span>
            </div>
            <div className="hidden lg:flex items-center gap-1 bg-[#1E293B] border border-blue-800 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
              <span>الباحث الصغير:</span>
              <span className="text-white font-bold">{studentName}</span>
            </div>
          </div>
        </div>

        {/* Center: Game Switcher Tabs */}
        <div className="flex items-center bg-[#1E293B] p-1 rounded-2xl border border-blue-900 shadow-inner">
          <button
            onClick={() => {
              onSelectGame('butterfly');
              if (currentPage > 10) onSelectPage(1);
            }}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeGame === 'butterfly'
                ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-500/40 scale-102'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-base">🦋</span>
            <span>دورة الفراشة</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/25">1-10</span>
          </button>

          <button
            onClick={() => {
              onSelectGame('grasshopper');
              if (currentPage <= 10) onSelectPage(11);
            }}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeGame === 'grasshopper'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-400 text-slate-900 shadow-md shadow-yellow-500/40 scale-102'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-base">🦗</span>
            <span>دورة الجرادة</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/25">11-20</span>
          </button>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-2">
          {/* Physical Movement Toggle */}
          <button
            onClick={onToggleMotion}
            title={motionEnabled ? 'وضع الحركة والحساس مفعل' : 'تفعيل تحديات الحركة البدنية'}
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              motionEnabled
                ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-sm'
                : 'bg-[#1E293B] border-blue-900 text-gray-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-pink-400" />
            <span className="hidden xl:inline">تحدي الحركة</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            className="p-2 rounded-xl bg-[#1E293B] border border-blue-900 text-yellow-300 hover:text-yellow-200 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Google Workspace Integration Button */}
          <button
            onClick={onOpenWorkspaceModal}
            className="px-2.5 py-1.5 rounded-xl bg-[#1E293B] border border-blue-700 hover:border-yellow-400 text-blue-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            title="Google Slides & Google Tasks"
          >
            <Share2 className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden sm:inline">Google Workspace</span>
          </button>

          {/* Teacher Guide & Offline Export Button */}
          <button
            onClick={onOpenTeacherModal}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-pink-500/30 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>دليل المعلم والأوفلاين</span>
          </button>
        </div>
      </div>

      {/* Pages 1-20 Breadcrumbs / Progress Rail */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-blue-900/60 flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs text-blue-300 font-bold shrink-0 ml-2">
          <span>الصفحة {currentPage} من 20:</span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((pageNum) => {
            const isCompleted = completedPages.includes(pageNum);
            const isCurrent = currentPage === pageNum;
            const isButterfly = pageNum <= 10;

            return (
              <button
                key={pageNum}
                onClick={() => {
                  onSelectPage(pageNum);
                  if (pageNum <= 10 && activeGame !== 'butterfly') onSelectGame('butterfly');
                  if (pageNum > 10 && activeGame !== 'grasshopper') onSelectGame('grasshopper');
                }}
                className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all relative shrink-0 ${
                  isCurrent
                    ? isButterfly
                      ? 'bg-pink-500 text-white shadow-md shadow-pink-500/50 scale-110 ring-2 ring-white'
                      : 'bg-yellow-400 text-slate-900 shadow-md shadow-yellow-400/50 scale-110 ring-2 ring-white'
                    : isCompleted
                    ? 'bg-blue-800 text-yellow-300 border border-yellow-400/40 hover:bg-blue-700'
                    : 'bg-[#1E293B] text-gray-400 border border-blue-900 hover:text-white hover:bg-blue-900/50'
                }`}
                title={`صفحة ${pageNum}: ${isButterfly ? 'دورة الفراشة' : 'دورة الجرادة'}`}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                ) : (
                  <span>{pageNum}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
