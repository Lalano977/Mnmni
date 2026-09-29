import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Droplets,
  Sun,
  Shield,
  Eye,
  RefreshCw,
  Wind,
} from 'lucide-react';
import type { PageDefinition } from '../../types';
import { SymmetryCanvas } from '../SymmetryCanvas';
import { PhysicalMovementSensor } from '../PhysicalMovementSensor';
import {
  playSuccessSound,
  playMunchSound,
  playFlapSound,
  playTryAgainSound,
  speakArabicEncouragement,
} from '../../utils/audio';

interface ButterflyPagesProps {
  page: PageDefinition;
  onCompletePage: (pageNumber: number) => void;
  isCompleted: boolean;
  onSaveDrawing: (dataUrl: string) => void;
  savedDrawing?: string;
}

export const ButterflyPages: React.FC<ButterflyPagesProps> = ({
  page,
  onCompletePage,
  isCompleted,
  onSaveDrawing,
}) => {
  // Page 1: Egg on Leaf
  const [zoomLevel, setZoomLevel] = useState(1);
  const [eggWarmth, setEggWarmth] = useState(25);
  const [eggHatched, setEggHatched] = useState(false);

  // Page 2: Hungry Caterpillar Feed
  const [caterpillarWeight, setCaterpillarWeight] = useState(10);
  const [fedCount, setFedCount] = useState(0);

  // Page 3: Caterpillar Molting
  const [moltProgress, setMoltProgress] = useState(0);
  const [rulerLength, setRulerLength] = useState(2);

  // Page 4: Caterpillar Wave Crawl
  const [crawlDistance, setCrawlDistance] = useState(0);

  // Page 5: Silk Spinning
  const [silkThreads, setSilkThreads] = useState(0);
  const [isHangingJ, setIsHangingJ] = useState(false);

  // Page 6: Chrysalis Formation
  const [armorLayers, setArmorLayers] = useState<number[]>([]);

  // Page 7: Protect Chrysalis (DO NOT OPEN)
  const [protectionTime, setProtectionTime] = useState(10);
  const [threatShooed, setThreatShooed] = useState(false);
  const [temptationWarning, setTemptationWarning] = useState<string | null>(null);

  // Page 8: Butterfly Emergence & Wing Pumping
  const [wingPumps, setWingPumps] = useState(0);

  // Page 9: Nectar Feeding
  const [collectedNectar, setCollectedNectar] = useState<string[]>([]);

  // Page 1 handler
  const handleEggNurture = (tempDelta: number) => {
    const newTemp = Math.min(32, Math.max(18, eggWarmth + tempDelta));
    setEggWarmth(newTemp);
    if (newTemp >= 27 && newTemp <= 30 && zoomLevel >= 2) {
      setEggHatched(true);
      playSuccessSound();
      speakArabicEncouragement('انظر! تشق اليرقة الصغيرة قشرة البيضة وتخرج للحياة!');
      onCompletePage(1);
    }
  };

  // Page 2 handler (Feed Caterpillar)
  const handleFeed = (isGoodLeaf: boolean) => {
    if (isGoodLeaf) {
      playMunchSound();
      const nextFed = fedCount + 1;
      setFedCount(nextFed);
      setCaterpillarWeight((prev) => prev + 15);
      if (nextFed >= 4) {
        playSuccessSound();
        speakArabicEncouragement('يرقة شبعانة وبصحة ممتازة! زاد وزنها وأصبحت جاهزة للنمو!');
        onCompletePage(2);
      }
    } else {
      playTryAgainSound();
      speakArabicEncouragement('انتبه! هذه الورقة شوكية أو فاسدة، اليرقة تحتاج أوراقاً طازجة.');
    }
  };

  // Page 3 handler (Molting)
  const handleMoltRub = () => {
    const nextProgress = moltProgress + 25;
    setMoltProgress(nextProgress);
    setRulerLength((prev) => prev + 1);
    if (nextProgress >= 100) {
      playSuccessSound();
      speakArabicEncouragement('تخلصت اليرقة من جلدها القديم الضيق ونمت وأصبحت أطول!');
      onCompletePage(3);
    }
  };

  // Page 4 handler (Wave crawl)
  const handleCrawlStep = () => {
    playFlapSound();
    const next = Math.min(100, crawlDistance + 20);
    setCrawlDistance(next);
    if (next >= 100) {
      playSuccessSound();
      speakArabicEncouragement('وصلت اليرقة إلى قمة الغصن الآمن بفضل حركتك المتموجة!');
      onCompletePage(4);
    }
  };

  // Page 5 handler (Silk weaving)
  const handleAddSilk = () => {
    playFlapSound();
    const next = silkThreads + 1;
    setSilkThreads(next);
    if (next >= 3) {
      setIsHangingJ(true);
      playSuccessSound();
      speakArabicEncouragement('رائع! غَزَلت اليرقة وسادة الحرير وعلقت نفسها على شكل حرف J!');
      onCompletePage(5);
    }
  };

  // Page 6 handler (Chrysalis armor)
  const handleAddArmorLayer = (layerId: number) => {
    if (!armorLayers.includes(layerId)) {
      playSuccessSound();
      const updated = [...armorLayers, layerId];
      setArmorLayers(updated);
      if (updated.length >= 3) {
        speakArabicEncouragement('اكتمل غلاف الشرنقة الواقي! تبدأ الآن معجزة التحول الكبرى!');
        onCompletePage(6);
      }
    }
  };

  // Page 7 handler (Protect Chrysalis)
  const handleAttemptOpen = () => {
    playTryAgainSound();
    setTemptationWarning('⚠️ إياك أن تفتح الشرنقة! إذا فُتحت بالقوة ستتشوه أجنحة الفراشة ولن تستطيع الطيران أبداً. الصبر هو سر الطبيعة!');
  };

  const handleShooBird = () => {
    playSuccessSound();
    setThreatShooed(true);
    setTemptationWarning('👏 أحسنت يا بطل! أبعدت الطائر الفضولي وحميت الشرنقة بصبر وهدوء!');
    onCompletePage(7);
  };

  // Page 8 handler (Wing pumping)
  const handlePumpWing = () => {
    playFlapSound();
    const next = wingPumps + 1;
    setWingPumps(next);
    if (next >= 5) {
      playSuccessSound();
      speakArabicEncouragement('تفردت الأجنحة وجفت تماماً! الفراشة الآن مستعدة لأول تحليق في سماء الحديقة!');
      onCompletePage(8);
    }
  };

  // Page 9 handler (Nectar feeding)
  const handleFlowerNectar = (color: string) => {
    playSuccessSound();
    if (!collectedNectar.includes(color)) {
      const updated = [...collectedNectar, color];
      setCollectedNectar(updated);
      if (updated.length >= 3) {
        speakArabicEncouragement('امتصت الفراشة رحيق الأزهار بخرطومها المرن وساعدت في تلقيح الأزهار الجميلة!');
        onCompletePage(9);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Content Switcher */}
      {page.pageNumber === 1 && (
        <div className="bg-[#1E293B] border-2 border-pink-500/40 rounded-3xl p-6 text-center shadow-xl">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="relative w-64 h-56 mx-auto bg-gradient-to-b from-emerald-950 to-slate-900 rounded-2xl border-4 border-emerald-500 flex items-center justify-center overflow-hidden shadow-inner">
              {/* Green leaf graphic */}
              <div className="absolute inset-0 flex items-center justify-center opacity-70">
                <svg viewBox="0 0 200 160" className="w-full h-full text-emerald-600 fill-current">
                  <path d="M10,80 Q100,10 190,80 Q100,150 10,80 Z" />
                </svg>
              </div>

              {/* Egg on leaf */}
              {!eggHatched ? (
                <div
                  className="relative z-10 transition-transform duration-300 cursor-pointer"
                  style={{ transform: `scale(${zoomLevel})` }}
                  onClick={() => setZoomLevel(zoomLevel >= 2 ? 1 : zoomLevel + 0.5)}
                  title="انقر للتكبير بالمكبرة"
                >
                  <div className="w-12 h-16 bg-gradient-to-t from-yellow-200 via-amber-100 to-white rounded-full border-2 border-amber-300 shadow-xl flex items-center justify-center">
                    <span className="text-[10px] font-black text-amber-900">🥚</span>
                  </div>
                  <div className="text-[11px] font-bold text-yellow-300 mt-1 bg-black/60 px-2 py-0.5 rounded-full">
                    بيضة دقيقة
                  </div>
                </div>
              ) : (
                <div className="relative z-10 animate-bounce">
                  <div className="text-5xl">🐛</div>
                  <div className="text-xs font-black text-yellow-300 bg-emerald-950/80 px-3 py-1 rounded-full mt-1 border border-emerald-500">
                    فقست اليرقة الصغيرة بنجاح!
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-[#0F172A] p-4 rounded-2xl border border-blue-900 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                <span className="text-gray-300">مستوى تكبير المكبرة:</span>
                <span className="text-yellow-400">{zoomLevel}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.5"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs sm:text-sm font-bold pt-2 border-t border-slate-800">
                <span className="text-gray-300">حرارة عش البيضة المناسبة (27°C - 30°C):</span>
                <span className="text-yellow-400">{eggWarmth}° مئوية</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleEggNurture(-1)}
                  className="px-3 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-blue-200 text-xs font-bold"
                >
                  ❄️ تبريد قليلاً
                </button>
                <button
                  onClick={() => handleEggNurture(1)}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                >
                  ☀️ تدفئة شمسية
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {page.pageNumber === 2 && (
        <div className="bg-[#1E293B] border-2 border-pink-500/40 rounded-3xl p-6 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-5 text-center">
            {/* Hungry Caterpillar Display */}
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-blue-900 flex flex-col items-center justify-center">
              <div
                className="transition-transform duration-300 flex items-center justify-center"
                style={{ transform: `scale(${1 + fedCount * 0.15})` }}
              >
                <div className="text-6xl sm:text-7xl">🐛</div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-gray-400 font-bold">مقياس شبع اليرقة ونموها:</span>
                <div className="w-48 bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-yellow-400 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (fedCount / 4) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-yellow-400 font-black">{caterpillarWeight} جم</span>
              </div>
            </div>

            {/* Food Selection Trays */}
            <div>
              <p className="text-xs sm:text-sm text-yellow-300 font-bold mb-3">
                اختر الأوراق الطازجة الصحية المغذية وأطعم اليرقة:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleFeed(true)}
                  className="p-3 bg-emerald-950/70 hover:bg-emerald-900/90 border-2 border-emerald-500 rounded-2xl flex flex-col items-center gap-1 transition-all active:scale-95"
                >
                  <span className="text-3xl">🍃</span>
                  <span className="text-xs font-bold text-emerald-300">ورقة توت خضراء طازجة</span>
                </button>

                <button
                  onClick={() => handleFeed(false)}
                  className="p-3 bg-rose-950/70 hover:bg-rose-900/90 border-2 border-rose-500 rounded-2xl flex flex-col items-center gap-1 transition-all active:scale-95"
                >
                  <span className="text-3xl">🌵</span>
                  <span className="text-xs font-bold text-rose-300">نبات شوكي حاد (مؤذٍ!)</span>
                </button>

                <button
                  onClick={() => handleFeed(true)}
                  className="p-3 bg-emerald-950/70 hover:bg-emerald-900/90 border-2 border-emerald-500 rounded-2xl flex flex-col items-center gap-1 transition-all active:scale-95"
                >
                  <span className="text-3xl">🌿</span>
                  <span className="text-xs font-bold text-emerald-300">ورقة شجر لينة غنية</span>
                </button>

                <button
                  onClick={() => handleFeed(false)}
                  className="p-3 bg-amber-950/70 hover:bg-amber-900/90 border-2 border-amber-600 rounded-2xl flex flex-col items-center gap-1 transition-all active:scale-95"
                >
                  <span className="text-3xl">🍂</span>
                  <span className="text-xs font-bold text-amber-300">ورقة يابسة متعفنة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {page.pageNumber === 3 && (
        <div className="bg-[#1E293B] border-2 border-pink-500/40 rounded-3xl p-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-blue-900 relative">
              <div className="text-6xl my-2">🐛</div>
              <p className="text-xs text-blue-200">
                لقد ضاق جلد اليرقة القديم! مرر يدك أو انقر لنزع الغطاء الضيق ومساعدتها على الانسلاخ.
              </p>

              {/* Molt progress bar */}
              <div className="w-full bg-slate-800 h-5 rounded-full overflow-hidden my-4 border border-slate-700">
                <div
                  className="bg-gradient-to-r from-pink-500 to-yellow-400 h-full transition-all duration-300"
                  style={{ width: `${moltProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-gray-400 px-2">
                <span>بداية الانسلاخ</span>
                <span className="text-yellow-400">طول اليرقة: {rulerLength} سم 📏</span>
                <span>اكتمال الجلد الجديد</span>
              </div>

              <button
                onClick={handleMoltRub}
                disabled={moltProgress >= 100}
                className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-slate-900 font-black text-sm shadow-md active:scale-95 transition-all"
              >
                {moltProgress >= 100 ? 'تم الانسلاخ بنجاح! ✓' : 'انزع الجلد الضيق بالتدليك (انقر هنا)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {page.pageNumber === 4 && (
        <div className="bg-[#1E293B] border-2 border-pink-500/40 rounded-3xl p-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-blue-900 relative h-48 flex items-center justify-between px-6 overflow-hidden">
              {/* Tree branch */}
              <div className="absolute top-1/2 left-0 right-0 h-4 bg-amber-900 rounded-full transform -translate-y-1/2" />

              {/* Destination flag */}
              <div className="absolute top-1/4 left-6 text-3xl">🚩 الغصن الآمن</div>

              {/* Caterpillar moving along branch */}
              <div
                className="absolute top-1/3 transition-all duration-300 text-5xl"
                style={{ right: `${crawlDistance}%`, transform: 'translate(50%, 0)' }}
              >
                🐛
              </div>
            </div>

            <button
              onClick={handleCrawlStep}
              disabled={crawlDistance >= 100}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-yellow-400 text-slate-900 font-black text-sm shadow-lg active:scale-95 transition-all"
            >
              {crawlDistance >= 100
                ? 'وصلت اليرقة لقمة الغصن بنجاح! 🏆'
                : 'تموج وازحف خطوة للأمام! 🐾'}
            </button>
          </div>
        </div>
      )}

      {page.pageNumber === 5 && (
        <div className="bg-[#1E293B] border-2 border-pink-500/40 rounded-3xl p-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-blue-900 relative h-60 flex flex-col items-center justify-between">
              <div className="w-full h-4 bg-amber-800 rounded-full shadow-md" />

              {/* Silk thread & Hanging Caterpillar in J-shape */}
              <div className="flex flex-col items-center">
                <div
                  className="w-1 bg-white border-l-2 border-dashed border-pink-300 transition-all duration-300"
                  style={{ height: `${silkThreads * 25}px` }}
                />
                <div
                  className={`text-6xl transition-transform duration-500 ${
                    isHangingJ ? 'rotate-180 scale-110' : ''
                  }`}
                >
                  🐛
                </div>
              </div>

              <div className="text-xs font-bold text-yellow-300 bg-black/60 px-3 py-1 rounded-full">
                {isHangingJ
                  ? 'رائع! اليرقة متدلية الآن بأمان وجاهزة لتكوين الشرنقة!'
                  : `خيوط الحرير المنسوجة: ${silkThreads} / 3`}
              </div>
            </div>

            <button
              onClick={handleAddSilk}
              disabled={isHangingJ}
              className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-black text-sm shadow-md transition-all active:scale-95"
            >
              {isHangingJ ? 'تم التعلق بحرف J بنجاح! ✓' : 'اغزل خيط حرير إضافي 🧵'}
            </button>
          </div>
        </div>
      )}

      {page.pageNumber === 6 && (
        <div className="bg-[#1E293B] border-2 border-pink-500/40 rounded-3xl p-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-blue-900 flex items-center justify-center h-48">
              <div className="relative">
                <div className="text-6xl">
                  {armorLayers.length >= 3 ? '🫒' : '🐛'}
                </div>
                <div className="text-xs font-bold text-yellow-300 mt-2">
                  {armorLayers.length >= 3
                    ? 'الشرنقة مكتملة ومغلقة بإحكام!'
                    : `طبقات الغلاف المشكلة: ${armorLayers.length} من 3`}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAddArmorLayer(1)}
                disabled={armorLayers.includes(1)}
                className={`p-3 rounded-xl text-xs font-bold transition-all ${
                  armorLayers.includes(1)
                    ? 'bg-emerald-800 text-emerald-200'
                    : 'bg-blue-900 hover:bg-blue-800 text-white'
                }`}
              >
                1. الغلاف الكيتيني
              </button>
              <button
                onClick={() => handleAddArmorLayer(2)}
                disabled={armorLayers.includes(2)}
                className={`p-3 rounded-xl text-xs font-bold transition-all ${
                  armorLayers.includes(2)
                    ? 'bg-emerald-800 text-emerald-200'
                    : 'bg-blue-900 hover:bg-blue-800 text-white'
                }`}
              >
                2. العزل الحراري
              </button>
              <button
                onClick={() => handleAddArmorLayer(3)}
                disabled={armorLayers.includes(3)}
                className={`p-3 rounded-xl text-xs font-bold transition-all ${
                  armorLayers.includes(3)
                    ? 'bg-emerald-800 text-emerald-200'
                    : 'bg-blue-900 hover:bg-blue-800 text-white'
                }`}
              >
                3. التمويه الطبيعي
              </button>
            </div>
          </div>
        </div>
      )}

      {page.pageNumber === 7 && (
        <div className="bg-[#1E293B] border-4 border-yellow-400 rounded-3xl p-6 shadow-2xl text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-yellow-500/50 relative">
              <div className="text-6xl mb-2">🫒</div>
              <div className="text-sm font-black text-yellow-400">
                الشرنقة تنمو بسلام داخل غلافها
              </div>
              <p className="text-xs text-gray-300 mt-1">
                تحدث تغيرات بيولوجية مذهلة بالداخل؛ احترام الطبيعة يقتضي عدم لمسها!
              </p>

              {/* Warning box */}
              {temptationWarning && (
                <div className="mt-4 p-3 bg-rose-950/80 border border-rose-500 rounded-xl text-xs font-bold text-rose-200 animate-pulse">
                  {temptationWarning}
                </div>
              )}
            </div>

            {/* Temptation vs Protection buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleAttemptOpen}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-800/60 font-bold text-xs"
              >
                ❌ افتح الشرنقة لأرى ما بداخلها!
              </button>

              <button
                onClick={handleShooBird}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/30 active:scale-95"
              >
                🛡️ احمِ الشرنقة وأبعد الطائر الفضولي بهدوء
              </button>
            </div>
          </div>
        </div>
      )}

      {page.pageNumber === 8 && (
        <div className="bg-[#1E293B] border-2 border-pink-500/40 rounded-3xl p-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-blue-900">
              <div
                className="text-7xl transition-transform duration-300"
                style={{ transform: `scale(${0.7 + wingPumps * 0.1})` }}
              >
                🦋
              </div>
              <div className="text-xs font-bold text-yellow-300 mt-2">
                مستوى ضخ سائل الأجنحة: {wingPumps} / 5
              </div>
              <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden my-3 border border-slate-700">
                <div
                  className="bg-gradient-to-r from-pink-500 to-yellow-400 h-full transition-all duration-300"
                  style={{ width: `${(wingPumps / 5) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={handlePumpWing}
              disabled={wingPumps >= 5}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-slate-900 font-black text-sm shadow-md active:scale-95"
            >
              {wingPumps >= 5
                ? 'فردت الفراشة أجنحتها الرائعة بنجاح! 🦋'
                : 'اضغط لضخ السائل في أوردة الأجنحة 💨'}
            </button>
          </div>
        </div>
      )}

      {page.pageNumber === 9 && (
        <div className="bg-[#1E293B] border-2 border-pink-500/40 rounded-3xl p-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-[#0F172A] p-4 rounded-2xl border border-blue-900 flex items-center justify-between">
              <div className="text-5xl">🦋</div>
              <div className="text-xs text-right text-gray-300">
                <div className="font-bold text-yellow-400">خرطوم الفراشة الملتف (Proboscis)</div>
                <div>يمتص الرحيق السكري كالمصاصة الطبيعية</div>
              </div>
              <div className="text-xs font-bold text-pink-300 bg-pink-950/60 px-3 py-1 rounded-full border border-pink-700">
                الرحيق الممتص: {collectedNectar.length} / 3
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleFlowerNectar('pink')}
                disabled={collectedNectar.includes('pink')}
                className={`p-4 rounded-2xl flex flex-col items-center gap-1 border-2 transition-all ${
                  collectedNectar.includes('pink')
                    ? 'bg-pink-950 border-pink-400 text-pink-200'
                    : 'bg-[#0F172A] border-pink-500 hover:bg-pink-900/40 text-white'
                }`}
              >
                <span className="text-4xl">🌸</span>
                <span className="text-xs font-bold">زهرة الورد الزهرية</span>
              </button>

              <button
                onClick={() => handleFlowerNectar('yellow')}
                disabled={collectedNectar.includes('yellow')}
                className={`p-4 rounded-2xl flex flex-col items-center gap-1 border-2 transition-all ${
                  collectedNectar.includes('yellow')
                    ? 'bg-amber-950 border-yellow-400 text-yellow-200'
                    : 'bg-[#0F172A] border-yellow-400 hover:bg-amber-900/40 text-white'
                }`}
              >
                <span className="text-4xl">🌻</span>
                <span className="text-xs font-bold">زهرة عباد الشمس الذهبية</span>
              </button>

              <button
                onClick={() => handleFlowerNectar('blue')}
                disabled={collectedNectar.includes('blue')}
                className={`p-4 rounded-2xl flex flex-col items-center gap-1 border-2 transition-all ${
                  collectedNectar.includes('blue')
                    ? 'bg-blue-950 border-blue-400 text-blue-200'
                    : 'bg-[#0F172A] border-blue-500 hover:bg-blue-900/40 text-white'
                }`}
              >
                <span className="text-4xl">🪻</span>
                <span className="text-xs font-bold">زهرة اللافندر البنفسجية</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {page.pageNumber === 10 && (
        <SymmetryCanvas
          onSave={onSaveDrawing}
          onComplete={() => onCompletePage(10)}
          isCompleted={isCompleted}
        />
      )}

      {/* Embedded Physical Challenge for the Page (if defined) */}
      {page.physicalChallenge && page.pageNumber !== 10 && (
        <PhysicalMovementSensor
          challenge={page.physicalChallenge}
          onComplete={() => onCompletePage(page.pageNumber)}
          isCompleted={isCompleted}
        />
      )}
    </div>
  );
};
