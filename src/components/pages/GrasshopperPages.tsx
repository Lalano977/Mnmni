import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Zap,
  Target,
  Trophy,
  RefreshCw,
  Sun,
  Shield,
  Layers,
} from 'lucide-react';
import type { PageDefinition } from '../../types';
import { PhysicalMovementSensor } from '../PhysicalMovementSensor';
import {
  playSuccessSound,
  playJumpSound,
  playChirpSound,
  playMunchSound,
  playTryAgainSound,
  playApplauseSound,
  speakArabicEncouragement,
} from '../../utils/audio';

interface GrasshopperPagesProps {
  page: PageDefinition;
  onCompletePage: (pageNumber: number) => void;
  isCompleted: boolean;
}

export const GrasshopperPages: React.FC<GrasshopperPagesProps> = ({
  page,
  onCompletePage,
  isCompleted,
}) => {
  // Page 11: Egg Pod in Soil
  const [soilExcavated, setSoilExcavated] = useState(false);
  const [moistureSprayed, setMoistureSprayed] = useState(false);

  // Page 12: Nymph Hatching
  const [noticedWingless, setNoticedWingless] = useState(false);

  // Page 13: High Jump Challenge
  const [jumpPower, setJumpPower] = useState(50);
  const [jumpDistance, setJumpDistance] = useState(0);

  // Page 14: Mandibles vs Sucking
  const [chewedGrassCount, setChewedGrassCount] = useState(0);

  // Page 15: 5 Molts ordering
  const [selectedInstars, setSelectedInstars] = useState<number[]>([]);

  // Page 16: Exoskeleton hardening
  const [sunHardening, setSunHardening] = useState(0);

  // Page 17: Anatomy puzzle
  const [assembledParts, setAssembledParts] = useState<string[]>([]);

  // Page 18: Stridulation Music
  const [stridulationSpeed, setStridulationSpeed] = useState(0);

  // Page 19: Reflex escape
  const [predatorState, setPredatorState] = useState<'idle' | 'warning' | 'attacking' | 'escaped'>('idle');

  // Page 20: Arena Comparison
  const [sortedCards, setSortedCards] = useState<{ [cardId: string]: 'complete' | 'incomplete' }>({});
  const [arenaFinished, setArenaFinished] = useState(false);

  // Page 11 Handlers
  const handleDigSoil = () => {
    setSoilExcavated(true);
    playSuccessSound();
  };

  const handleSprayMoisture = () => {
    setMoistureSprayed(true);
    playSuccessSound();
    speakArabicEncouragement('أحسنت! جراب البيض الآن آمن ورطب في باطن التربة الدافئة!');
    onCompletePage(11);
  };

  // Page 12 Handlers
  const handleSpotDifference = (correct: boolean) => {
    if (correct) {
      setNoticedWingless(true);
      playSuccessSound();
      speakArabicEncouragement('ملاحظة علمية ممتازة! الحورية تشبه أمها تماماً ولكن بدون أجنحة وبلا شرنقة!');
      onCompletePage(12);
    } else {
      playTryAgainSound();
      speakArabicEncouragement('انظر جيداً! هل ترى شرنقة أو يرقة دودية مثل الفراشة؟ لا توجد!');
    }
  };

  // Page 13 Handlers
  const handleLaunchJump = () => {
    playJumpSound();
    const distance = Math.round((jumpPower / 100) * 80 + 20);
    setJumpDistance(distance);
    if (distance >= 60) {
      playSuccessSound();
      speakArabicEncouragement('قفزة عملاقة مذهلة! سيقان الجرادة الخلفية قوية جداً كالزنبرك!');
      onCompletePage(13);
    }
  };

  // Page 14 Handlers
  const handleChewGrass = (isCorrectFood: boolean) => {
    if (isCorrectFood) {
      playMunchSound();
      const next = chewedGrassCount + 1;
      setChewedGrassCount(next);
      if (next >= 3) {
        playSuccessSound();
        speakArabicEncouragement('ممتاز! قطعت الفكوك القارضة أوراق العشب بنجاح وأشبعت الجرادة!');
        onCompletePage(14);
      }
    } else {
      playTryAgainSound();
      speakArabicEncouragement('الجرادة حشرة عاشبة تتغذى على الحشائش الخضراء ولا تمتص الرحيق مثل الفراشة.');
    }
  };

  // Page 15 Handlers (5 Molts ordering)
  const handleSelectInstar = (stageNum: number) => {
    if (selectedInstars.includes(stageNum)) return;
    const expectedNext = selectedInstars.length + 1;

    if (stageNum === expectedNext) {
      playSuccessSound();
      const next = [...selectedInstars, stageNum];
      setSelectedInstars(next);
      if (next.length === 5) {
        speakArabicEncouragement('رائع! رتبت مراحل الانسلاخ الخمسة للحورية بشكل علمي دقيق!');
        onCompletePage(15);
      }
    } else {
      playTryAgainSound();
      speakArabicEncouragement(`ابحث عن العمر اليرقي رقم ${expectedNext} لترتيبها تدريجياً!`);
    }
  };

  // Page 16 Handlers (Exoskeleton Hardening)
  const handleExoskeletonSun = () => {
    playSuccessSound();
    const next = Math.min(100, sunHardening + 34);
    setSunHardening(next);
    if (next >= 100) {
      speakArabicEncouragement('تصلب هيكل الكيتين الخارجي وأصبح درعاً يحمي الجرادة من الشمس والجفاف!');
      onCompletePage(16);
    }
  };

  // Page 17 Handlers (Anatomy Puzzle)
  const handleAssemblePart = (part: string) => {
    if (!assembledParts.includes(part)) {
      playSuccessSound();
      const next = [...assembledParts, part];
      setAssembledParts(next);
      if (next.length >= 4) {
        speakArabicEncouragement('اكتمل تشريح الجرادة! رأس، صدر، بطن، وأرجل قافزة خارقة!');
        onCompletePage(17);
      }
    }
  };

  // Page 18 Handlers (Stridulation Music)
  const handleStridulate = () => {
    playChirpSound();
    const next = stridulationSpeed + 1;
    setStridulationSpeed(next);
    if (next >= 4) {
      playSuccessSound();
      speakArabicEncouragement('عزف رائع! أصدرت الجرادة صوت الصرير الموسيقي بحك أرجلها بأجنحتها!');
      onCompletePage(18);
    }
  };

  // Page 19 Handlers (Reflex Jump)
  const handleTriggerPredator = () => {
    setPredatorState('warning');
    setTimeout(() => {
      setPredatorState('attacking');
    }, 1200);
  };

  const handleReflexJump = () => {
    if (predatorState === 'attacking' || predatorState === 'warning') {
      playJumpSound();
      playSuccessSound();
      setPredatorState('escaped');
      speakArabicEncouragement('رد فعل خارق! قفزت الجرادة بسرعة هائلة ونجت من منقار الطائر المفترس!');
      onCompletePage(19);
    } else {
      playTryAgainSound();
    }
  };

  // Page 20 Handlers (Grand Arena)
  const handleSortCard = (cardId: string, category: 'complete' | 'incomplete') => {
    playSuccessSound();
    const updated = { ...sortedCards, [cardId]: category };
    setSortedCards(updated);

    if (Object.keys(updated).length >= 4) {
      setArenaFinished(true);
      playApplauseSound();
      speakArabicEncouragement('مبارك يا بطل! أنت الآن عالم أحياء معتمد في التحول الكامل والناقص!');
      onCompletePage(20);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page 11 */}
      {page.pageNumber === 11 && (
        <div className="bg-[#1E293B] border-2 border-yellow-400/50 rounded-3xl p-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-yellow-700/50 relative h-56 flex flex-col items-center justify-center overflow-hidden">
              {/* Soil layer */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-950 via-amber-900 to-amber-800 opacity-90" />

              <div className="relative z-10 space-y-2">
                <div className="text-5xl">
                  {!soilExcavated ? '🪨' : moistureSprayed ? '✨🌾' : '🫧'}
                </div>
                <div className="text-xs font-bold text-yellow-300 bg-black/60 px-3 py-1 rounded-full">
                  {!soilExcavated
                    ? 'التربة مغلقة على جراب البيض المدفون'
                    : moistureSprayed
                    ? 'جراب البيض رطب ومحمي داخل الرغوة الكيتينية!'
                    : 'تم كشف جراب البيض الرغوي! يحتاج لترطيب خفيف.'}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleDigSoil}
                disabled={soilExcavated}
                className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs"
              >
                {soilExcavated ? 'تم نبش التربة برفق ✓' : 'احفر برفق لكشف الجراب ⛏️'}
              </button>

              <button
                onClick={handleSprayMoisture}
                disabled={!soilExcavated || moistureSprayed}
                className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black text-xs shadow-md"
              >
                {moistureSprayed ? 'تم الترطيب والحماية! ✓' : 'رش قطرات الندى للحماية 💧'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page 12 */}
      {page.pageNumber === 12 && (
        <div className="bg-[#1E293B] border-2 border-yellow-400/50 rounded-3xl p-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-blue-900 flex items-center justify-around">
              <div className="flex flex-col items-center">
                <span className="text-3xl">🦗</span>
                <span className="text-[11px] text-gray-400 font-bold mt-1">الجرادة الأم الكبيرة (بأجنحة)</span>
              </div>
              <div className="text-2xl text-yellow-400">⚡ مقابل ⚡</div>
              <div className="flex flex-col items-center">
                <span className="text-2xl animate-pulse">🦗</span>
                <span className="text-[11px] text-yellow-300 font-bold mt-1">الحورية الصغيرة (بدون أجنحة وبلا شرنقة!)</span>
              </div>
            </div>

            <p className="text-xs text-blue-200">
              سؤال الملاحظة العلمية: ما الذي يميز الحورية فور خروجها من البيضة مقارنة بالفراشة؟
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleSpotDifference(true)}
                className="p-3 rounded-2xl bg-emerald-950/70 hover:bg-emerald-900 border-2 border-emerald-500 text-xs font-bold text-emerald-200"
              >
                ✓ تشبه أمها تماماً ولكن بدون أجنحة ولا تمر بمرحلة اليرقة أو الشرنقة!
              </button>
              <button
                onClick={() => handleSpotDifference(false)}
                className="p-3 rounded-2xl bg-rose-950/70 hover:bg-rose-900 border-2 border-rose-500 text-xs font-bold text-rose-200"
              >
                ✕ تخرج كدودة متموجة وتصنع شرنقة حريرية لتنام بداخلها
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page 13 */}
      {page.pageNumber === 13 && (
        <div className="bg-[#1E293B] border-2 border-yellow-400/50 rounded-3xl p-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-blue-900 relative h-48 overflow-hidden flex flex-col justify-end">
              {/* Field ground */}
              <div className="w-full h-8 bg-emerald-900 rounded-t-xl" />

              {/* Jumping grasshopper position */}
              <div
                className="absolute text-5xl transition-all duration-500"
                style={{
                  bottom: jumpDistance > 0 ? `${jumpDistance * 1.5}px` : '32px',
                  right: `${jumpDistance}%`,
                }}
              >
                🦗
              </div>
            </div>

            <div className="bg-[#0F172A] p-4 rounded-2xl border border-blue-900 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-300">قوة شد السيقان الخلفية:</span>
                <span className="text-yellow-400">{jumpPower}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={jumpPower}
                onChange={(e) => setJumpPower(parseInt(e.target.value, 10))}
                className="w-full accent-yellow-400 cursor-pointer"
              />
            </div>

            <button
              onClick={handleLaunchJump}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-black text-sm shadow-md active:scale-95"
            >
              أطلق قفزة الجرادة العملاقة! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Page 14 */}
      {page.pageNumber === 14 && (
        <div className="bg-[#1E293B] border-2 border-yellow-400/50 rounded-3xl p-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-[#0F172A] p-5 rounded-2xl border border-blue-900">
              <div className="text-5xl mb-2">🦗✂️</div>
              <h4 className="text-sm font-bold text-yellow-300">
                الفكوك القارضة الجانبية (Mandibles)
              </h4>
              <p className="text-xs text-gray-300 mt-1">
                تتحرك أفقياً لتقطيع ألياف النباتات الصلبة بكفاءة عالية.
              </p>
              <div className="text-xs font-bold text-emerald-400 mt-2">
                الحشائش المقطوعة: {chewedGrassCount} / 3
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleChewGrass(true)}
                className="p-4 rounded-2xl bg-emerald-950/70 hover:bg-emerald-900 border-2 border-emerald-500 flex flex-col items-center gap-1"
              >
                <span className="text-3xl">🌾</span>
                <span className="text-xs font-bold text-emerald-200">ساق قمح وعشب نضرة</span>
              </button>

              <button
                onClick={() => handleChewGrass(false)}
                className="p-4 rounded-2xl bg-rose-950/70 hover:bg-rose-900 border-2 border-rose-500 flex flex-col items-center gap-1"
              >
                <span className="text-3xl">🧃</span>
                <span className="text-xs font-bold text-rose-200">رحيق سائل (هذا طعام الفراشة!)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page 15 */}
      {page.pageNumber === 15 && (
        <div className="bg-[#1E293B] border-2 border-yellow-400/50 rounded-3xl p-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-[#0F172A] p-4 rounded-2xl border border-blue-900">
              <h4 className="text-sm font-bold text-yellow-300">
                ترتيب مراحل الانسلاخ الخمسة (Instars)
              </h4>
              <p className="text-xs text-gray-300 mt-1">
                انقر على الأعمار بالتسلسل من الأصغر (1) إلى الأكبر مع نمو براعم الأجنحة (5):
              </p>
              <div className="flex justify-center gap-2 mt-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div
                    key={num}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      selectedInstars.includes(num)
                        ? 'bg-yellow-400 text-slate-900 shadow-md'
                        : 'bg-slate-800 text-gray-500 border border-slate-700'
                    }`}
                  >
                    {selectedInstars.includes(num) ? `✓ ${num}` : num}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {[4, 1, 5, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => handleSelectInstar(num)}
                  disabled={selectedInstars.includes(num)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                    selectedInstars.includes(num)
                      ? 'bg-slate-800/50 border-slate-700 opacity-40 cursor-default'
                      : 'bg-blue-900 hover:bg-blue-800 border-yellow-400/50'
                  }`}
                >
                  <span style={{ fontSize: `${16 + num * 4}px` }}>🦗</span>
                  <span className="text-xs font-bold text-yellow-200">الطور {num}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page 16 */}
      {page.pageNumber === 16 && (
        <div className="bg-[#1E293B] border-2 border-yellow-400/50 rounded-3xl p-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-blue-900">
              <div className="text-6xl mb-2">🛡️🦗</div>
              <h4 className="text-sm font-bold text-yellow-300">
                تصلب درع الكيتين الخارجي (Exoskeleton)
              </h4>
              <p className="text-xs text-gray-300 mt-1">
                الهيكل الخارجي يحمي الجرادة كالدرع الفولاذي ويمنع تبخر الماء!
              </p>

              <div className="w-full bg-slate-800 h-5 rounded-full overflow-hidden my-4 border border-slate-700">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-amber-300 h-full transition-all duration-300"
                  style={{ width: `${sunHardening}%` }}
                />
              </div>

              <div className="text-xs font-bold text-yellow-400">
                صلابة الدرع: {Math.round(sunHardening)}%
              </div>
            </div>

            <button
              onClick={handleExoskeletonSun}
              disabled={sunHardening >= 100}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-900 font-black text-sm shadow-md active:scale-95"
            >
              {sunHardening >= 100 ? 'الدرع الخارجي صلب ومكتمل تماماً! ✓' : 'وجّه أشعة الشمس لتصلب الهيكل ☀️'}
            </button>
          </div>
        </div>
      )}

      {/* Page 17 */}
      {page.pageNumber === 17 && (
        <div className="bg-[#1E293B] border-2 border-yellow-400/50 rounded-3xl p-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-blue-900">
              <div className="text-6xl mb-2">🦗</div>
              <h4 className="text-sm font-bold text-yellow-300">تشريح أقسام جسم الحشرة الثلاثة</h4>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {['الرأس والعيون المركبة', 'الصدر والأرجل الست', 'البطن والأغشية الطبلية', 'الأجنحة الكاملة'].map((p) => (
                  <span
                    key={p}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      assembledParts.includes(p)
                        ? 'bg-emerald-900 text-emerald-200 border border-emerald-500'
                        : 'bg-slate-800 text-gray-500'
                    }`}
                  >
                    {assembledParts.includes(p) ? `✓ ${p}` : p}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'الرأس والعيون المركبة', desc: 'للرؤية في جميع الاتجاهات وقرون الاستشعار' },
                { name: 'الصدر والأرجل الست', desc: 'مركز الحركة والسيقان القافزة الجبارة' },
                { name: 'البطن والأغشية الطبلية', desc: 'للتنفس وسماع الأصوات' },
                { name: 'الأجنحة الكاملة', desc: 'للطيران وحك الأصوات الموسيقية' },
              ].map((part) => (
                <button
                  key={part.name}
                  onClick={() => handleAssemblePart(part.name)}
                  disabled={assembledParts.includes(part.name)}
                  className={`p-3 rounded-2xl border-2 text-right transition-all ${
                    assembledParts.includes(part.name)
                      ? 'bg-slate-800/40 border-slate-700 opacity-50'
                      : 'bg-[#0F172A] border-yellow-400 hover:bg-yellow-400/10'
                  }`}
                >
                  <div className="text-xs font-black text-yellow-300">{part.name}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{part.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page 18 */}
      {page.pageNumber === 18 && (
        <div className="bg-[#1E293B] border-2 border-yellow-400/50 rounded-3xl p-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-blue-900">
              <div className="text-6xl mb-2">🦗🎶</div>
              <h4 className="text-sm font-bold text-yellow-300">
                عزف الصرير الطبيعي (Stridulation)
              </h4>
              <p className="text-xs text-gray-300 mt-1">
                تحك الجرادة نتوءات صغيرة على رجلها الخلفية مع عروق الجناح لإصدار ألحان الصيف!
              </p>
              <div className="text-xs font-bold text-yellow-400 mt-2">
                النغمات المعزوفة: {stridulationSpeed} / 4
              </div>
            </div>

            <button
              onClick={handleStridulate}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-black text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <Volume2 className="w-5 h-5" />
              <span>احك الأرجل مع الجناح واعزف الصرير! 🎵</span>
            </button>
          </div>
        </div>
      )}

      {/* Page 19 */}
      {page.pageNumber === 19 && (
        <div className="bg-[#1E293B] border-2 border-yellow-400/50 rounded-3xl p-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-blue-900 relative h-48 flex items-center justify-center overflow-hidden">
              {predatorState === 'idle' && (
                <div className="text-4xl text-gray-400">🦗 الجرادة هادئة في الحقل...</div>
              )}
              {predatorState === 'warning' && (
                <div className="text-4xl text-yellow-400 animate-pulse">
                  ⚠️ ظل طائر مفترس يقترب في الأفق!
                </div>
              )}
              {predatorState === 'attacking' && (
                <div className="text-5xl text-rose-500 animate-bounce">
                  🦅 هجووووم! اقفز الآن بأقصى سرعة!
                </div>
              )}
              {predatorState === 'escaped' && (
                <div className="text-4xl text-emerald-400 font-black">
                  🎉 نجت الجرادة بقفزة تفادي خارقة!
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleTriggerPredator}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-xs"
              >
                بدء تحدي ظهور المفترس 🦅
              </button>

              <button
                onClick={handleReflexJump}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-black text-sm shadow-md active:scale-95"
              >
                ⚡ اقفز فوراً للهروب السريع!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page 20 */}
      {page.pageNumber === 20 && (
        <div className="bg-[#1E293B] border-4 border-yellow-400 rounded-3xl p-6 shadow-2xl text-center">
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="bg-gradient-to-r from-pink-950 via-slate-900 to-amber-950 p-6 rounded-2xl border border-yellow-500/50">
              <div className="text-5xl mb-2">🏆👑</div>
              <h3 className="text-lg font-black text-yellow-300">
                حلبة المقارنة الكبرى والتتويج العلمي
              </h3>
              <p className="text-xs text-blue-200 mt-1">
                صنف كل ميزة إلى نوع التحول المناسب (التحول الكامل للفراشة مقابل التحول الناقص للجرادة):
              </p>
            </div>

            {/* Cards to Sort */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
              {[
                { id: 'chrysalis', text: 'مرحلة الشرنقة الساكنة التي يعاد فيها بناء الجسد كلياً' },
                { id: 'nymph', text: 'الحورية التي تشبه الأب وتكبر بالانسلاخات بدون شرنقة' },
                { id: 'caterpillar', text: 'يرقة شرهة تتغذى على أوراق الشجر' },
                { id: 'chewing', text: 'فكوك قارضة تقطع سيقان العشب منذ الصغر' },
              ].map((card) => {
                const assigned = sortedCards[card.id];
                return (
                  <div
                    key={card.id}
                    className="p-4 bg-[#0F172A] rounded-2xl border border-blue-900 flex flex-col justify-between"
                  >
                    <p className="text-xs font-bold text-white mb-3">{card.text}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSortCard(card.id, 'complete')}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black transition-all ${
                          assigned === 'complete'
                            ? 'bg-pink-500 text-white shadow-md'
                            : 'bg-slate-800 text-pink-300 hover:bg-pink-950'
                        }`}
                      >
                        🦋 تحول كامل (فراشة)
                      </button>
                      <button
                        onClick={() => handleSortCard(card.id, 'incomplete')}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-black transition-all ${
                          assigned === 'incomplete'
                            ? 'bg-yellow-400 text-slate-900 shadow-md'
                            : 'bg-slate-800 text-yellow-300 hover:bg-amber-950'
                        }`}
                      >
                        🦗 تحول ناقص (جرادة)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {arenaFinished && (
              <div className="p-4 bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl text-emerald-200 text-xs sm:text-sm font-bold animate-bounce">
                🎉 مبارك يا بطل! أتممت بنجاح كافة الصفحات الـ 20 وأثبت تميزك كعالم أحياء واعد!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Embedded Physical Challenge for the Page */}
      {page.physicalChallenge && (
        <PhysicalMovementSensor
          challenge={page.physicalChallenge}
          onComplete={() => onCompletePage(page.pageNumber)}
          isCompleted={isCompleted}
        />
      )}
    </div>
  );
};
