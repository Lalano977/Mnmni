import React, { useRef, useState, useEffect } from 'react';
import {
  Paintbrush,
  Eraser,
  RotateCcw,
  Download,
  Sparkles,
  CheckCircle2,
  Spline,
} from 'lucide-react';
import { playSuccessSound, speakArabicEncouragement } from '../utils/audio';

interface SymmetryCanvasProps {
  onSave?: (dataUrl: string) => void;
  onComplete?: () => void;
  isCompleted?: boolean;
}

const COLORS = [
  { name: 'زهري مشرق', value: '#EC4899' },
  { name: 'زهري فاتح', value: '#F472B6' },
  { name: 'أصفر ذهبي', value: '#F59E0B' },
  { name: 'أصفر ساطع', value: '#FBBF24' },
  { name: 'أزرق داكن', value: '#0F172A' },
  { name: 'أزرق نيلي', value: '#1E3A8A' },
  { name: 'أبيض ناصع', value: '#FFFFFF' },
  { name: 'أخضر يانع', value: '#10B981' },
];

export const SymmetryCanvas: React.FC<SymmetryCanvasProps> = ({
  onSave,
  onComplete,
  isCompleted,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#EC4899');
  const [brushSize, setBrushSize] = useState<number>(8);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [symmetryEnabled, setSymmetryEnabled] = useState<boolean>(true);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokesCount, setStrokesCount] = useState<number>(0);

  // Initialize canvas with butterfly outline
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset background
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center symmetry guide line
    drawGuides(ctx, canvas.width, canvas.height);
  }, []);

  const drawGuides = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Symmetry Axis
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2, 20);
    ctx.lineTo(width / 2, height - 20);
    ctx.stroke();

    // Outline hint of butterfly wings
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.lineWidth = 3;

    // Right wing hint
    ctx.beginPath();
    ctx.moveTo(width / 2 + 10, height / 2);
    ctx.bezierCurveTo(width / 2 + 120, height / 2 - 140, width - 40, height / 2 - 100, width - 30, height / 2 - 20);
    ctx.bezierCurveTo(width - 40, height / 2 + 80, width / 2 + 100, height / 2 + 130, width / 2 + 10, height / 2 + 60);
    ctx.stroke();

    // Left wing hint
    ctx.beginPath();
    ctx.moveTo(width / 2 - 10, height / 2);
    ctx.bezierCurveTo(width / 2 - 120, height / 2 - 140, 40, height / 2 - 100, 30, height / 2 - 20);
    ctx.bezierCurveTo(40, height / 2 + 80, width / 2 - 100, height / 2 + 130, width / 2 - 10, height / 2 + 60);
    ctx.stroke();

    // Butterfly body in center
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2 + 10, 10, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.stroke();

    ctx.restore();
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else if ('clientX' in e) {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCanvasCoords(e);
    drawDot(x, y);
    setStrokesCount((prev) => prev + 1);
  };

  const drawDot = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = isEraser ? '#0F172A' : selectedColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();

    if (symmetryEnabled) {
      const mirrorX = canvas.width - x;
      ctx.beginPath();
      ctx.arc(mirrorX, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);
    drawDot(x, y);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (strokesCount > 15 && onComplete) {
      onComplete();
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGuides(ctx, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    if (onSave) onSave(dataUrl);

    playSuccessSound();
    speakArabicEncouragement('لوحة فراشة بديعة! ألوانك وتناظرك مذهل!');

    const link = document.createElement('a');
    link.download = `butterfly-symmetry-art-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    if (onComplete) onComplete();
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-[#1E293B]/80 p-4 sm:p-6 rounded-3xl border-2 border-pink-500/50 shadow-2xl">
      {/* Title & Symmetry status */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-pink-500 text-white shadow-md">
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              استوديو التناظر الفراشي (Symmetry Studio)
            </h3>
            <p className="text-xs text-blue-200">
              ارسم في جانب واحد بالزهري والأصفر، وسينعكس الجانب الآخر سحرياً!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSymmetryEnabled(!symmetryEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              symmetryEnabled
                ? 'bg-yellow-400 text-slate-900 shadow-md shadow-yellow-400/30'
                : 'bg-slate-800 text-gray-400 border border-slate-700'
            }`}
          >
            <Spline className="w-4 h-4" />
            <span>{symmetryEnabled ? 'التناظر مفعل (انعكاس مرآوي)' : 'رسم حر عادي'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative border-4 border-pink-400/60 rounded-2xl overflow-hidden shadow-2xl bg-[#0F172A]">
        <canvas
          ref={canvasRef}
          width={640}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair touch-none max-w-full h-auto block"
        />
      </div>

      {/* Tools & Palette */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-[#0F172A]/90 p-3 sm:p-4 rounded-2xl border border-blue-900">
        {/* Colors Palette */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-gray-400 font-bold ml-1">الألوان:</span>
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                setSelectedColor(c.value);
                setIsEraser(false);
              }}
              title={c.name}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform border-2 ${
                !isEraser && selectedColor === c.value
                  ? 'scale-125 border-white shadow-lg shadow-white/40 ring-2 ring-pink-500'
                  : 'border-transparent hover:scale-110'
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>

        {/* Brush Sizes & Eraser */}
        <div className="flex items-center gap-2">
          {/* Eraser */}
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
              isEraser
                ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                : 'bg-slate-800 text-gray-300 border-slate-700 hover:text-white'
            }`}
            title="ممحاة"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">ممحاة</span>
          </button>

          {/* Brush Sizes */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            {[4, 8, 16].map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                  brushSize === size ? 'bg-pink-500 text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}
                title={`حجم الفرشاة ${size}`}
              >
                <div
                  className="rounded-full bg-current"
                  style={{ width: size / 2 + 2, height: size / 2 + 2 }}
                />
              </button>
            ))}
          </div>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 transition-colors border border-slate-700"
            title="مسح اللوحة والبدء من جديد"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Download & Complete */}
          <button
            onClick={handleDownload}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-slate-900 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-pink-500/30 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>حفظ اللوحة واكتمال النشاط</span>
          </button>
        </div>
      </div>
    </div>
  );
};
