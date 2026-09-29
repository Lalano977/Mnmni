import React, { useState, useEffect, useRef } from 'react';
import { Camera, Footprints, Zap, CheckCircle2, RotateCcw } from 'lucide-react';
import { playJumpSound, playSuccessSound, speakArabicEncouragement } from '../utils/audio';

interface PhysicalMovementSensorProps {
  challenge: {
    actionName: string;
    instructions: string;
    targetRepetitions: number;
  };
  onComplete: () => void;
  isCompleted: boolean;
}

export const PhysicalMovementSensor: React.FC<PhysicalMovementSensorProps> = ({
  challenge,
  onComplete,
  isCompleted,
}) => {
  const [count, setCount] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setCount(isCompleted ? challenge.targetRepetitions : 0);
  }, [challenge, isCompleted]);

  // Handle physical action completion
  const handleActionTrigger = () => {
    if (count >= challenge.targetRepetitions) return;

    playJumpSound();
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 300);

    const nextCount = count + 1;
    setCount(nextCount);

    if (nextCount >= challenge.targetRepetitions) {
      playSuccessSound();
      speakArabicEncouragement('ممتاز يا بطل! حركة رائعة ومليئة بالنشاط!');
      onComplete();
    }
  };

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch {
      alert('لم نتمكن من تشغيل الكاميرا؛ يمكنك استخدام زر الحركة البديلة اللمسي بسهولة!');
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  return (
    <div className="bg-[#1E293B]/90 border-2 border-pink-500/60 rounded-2xl p-4 sm:p-5 text-white shadow-xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-pink-500 text-white shadow-md">
            <Footprints className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="text-xs text-yellow-300 font-extrabold uppercase tracking-wide">
              تحدي الحركة البدنية والنشاط 🏃‍♂️
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">{challenge.actionName}</h3>
          </div>
        </div>

        {/* Progress Counter Pill */}
        <div className="flex items-center gap-2 bg-[#0F172A] border border-pink-400 px-3 py-1.5 rounded-full shadow-inner">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-bold text-gray-300">المرات المنجزة:</span>
          <span className="text-base font-black text-yellow-400">
            {count} / {challenge.targetRepetitions}
          </span>
          {count >= challenge.targetRepetitions && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
          )}
        </div>
      </div>

      <p className="text-sm text-blue-100 bg-[#0F172A]/70 p-3 rounded-xl border border-blue-900 mb-4 font-medium leading-relaxed">
        {challenge.instructions}
      </p>

      {/* Main Interaction Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Visual action simulator & tap sensor */}
        <div className="flex flex-col items-center justify-center p-4 bg-[#0F172A]/80 rounded-2xl border border-blue-900 text-center relative">
          <div
            className={`w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-400 flex items-center justify-center text-4xl shadow-lg transition-transform duration-200 cursor-pointer select-none ${
              isJumping ? 'scale-125 -translate-y-4 shadow-yellow-400/50' : 'hover:scale-105'
            }`}
            onClick={handleActionTrigger}
          >
            {count >= challenge.targetRepetitions ? '⭐' : '🤸'}
          </div>

          <p className="text-xs text-yellow-300 font-bold mt-2">
            {count >= challenge.targetRepetitions
              ? 'رائع! أكملت الحركة البدنية بنجاح!'
              : 'قم بالحركة واضغط هنا لتسجيل كل مرة!'}
          </p>

          <button
            onClick={handleActionTrigger}
            disabled={count >= challenge.targetRepetitions}
            className={`mt-3 w-full py-2.5 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              count >= challenge.targetRepetitions
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 active:scale-95 shadow-yellow-500/30'
            }`}
          >
            {count >= challenge.targetRepetitions ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>تم إنجاز التحدي الحركي!</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>سجل حركة (اضغط هنا أو اقفز!)</span>
              </>
            )}
          </button>
        </div>

        {/* Camera / Gesture Sensor Option */}
        <div className="flex flex-col items-center justify-center p-4 bg-[#0F172A]/80 rounded-2xl border border-blue-900 text-center">
          <div className="w-full h-28 bg-[#1E293B] rounded-xl flex items-center justify-center relative overflow-hidden border border-blue-800">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              playsInline
              muted
            />
            {!cameraActive && (
              <div className="flex flex-col items-center gap-1 text-gray-400 p-2">
                <Camera className="w-6 h-6 text-pink-400" />
                <span className="text-xs">مرآة الحركة التفاعلية (اختياري)</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full mt-3">
            {!cameraActive ? (
              <button
                onClick={handleStartCamera}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-blue-700"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>تشغيل الكاميرا للمتابعة</span>
              </button>
            ) : (
              <button
                onClick={handleStopCamera}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-900 hover:bg-rose-800 text-rose-200 text-xs font-bold transition-colors"
              >
                إيقاف الكاميرا
              </button>
            )}

            <button
              onClick={() => setCount(0)}
              title="إعادة التحدي"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
