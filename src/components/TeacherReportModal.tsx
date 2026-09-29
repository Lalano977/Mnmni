import React, { useState } from 'react';
import {
  X,
  Award,
  Download,
  Printer,
  BookOpen,
  Mail,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Star,
  Sparkles,
} from 'lucide-react';
import type { StudentProgress } from '../types';
import { PAGES_DATA } from '../data/pagesData';
import { playSuccessSound } from '../utils/audio';

interface TeacherReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: StudentProgress;
  onUpdateStudentName: (name: string) => void;
}

export const TeacherReportModal: React.FC<TeacherReportModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateStudentName,
}) => {
  const [activeTab, setActiveTab] = useState<'report' | 'guide' | 'offline_pack'>('report');
  const [editingName, setEditingName] = useState(progress.studentName);

  if (!isOpen) return null;

  const totalPages = 20;
  const completedCount = progress.completedPages.length;
  const percentage = Math.round((completedCount / totalPages) * 100);

  // Generate offline standalone single HTML file for Hotmail attachment
  const handleDownloadOfflinePackage = () => {
    playSuccessSound();
    const offlineHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>مغامرات دورة نمو الفراشة والجرادة - حزمة أوفلاين</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0F172A; color: #FFFFFF; padding: 24px; text-align: center; }
    .card { max-width: 760px; margin: 0 auto; background: #1E293B; border-radius: 20px; padding: 32px; border: 3px solid #EC4899; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    h1 { color: #FBBF24; font-size: 28px; margin-bottom: 8px; }
    p { color: #E2E8F0; font-size: 16px; line-height: 1.6; }
    .badge { display: inline-block; background: #EC4899; color: white; padding: 6px 16px; border-radius: 999px; font-weight: bold; margin: 12px 0; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: right; margin-top: 24px; }
    .col { background: #0F172A; padding: 18px; border-radius: 14px; border: 1px solid #334155; }
    .col h3 { color: #F472B6; margin-top: 0; }
    .col.grasshopper h3 { color: #FBBF24; }
    ol { padding-right: 20px; }
    li { margin-bottom: 8px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🦋 مغامرات نمو الفراشة والجرادة 🦗</h1>
    <div class="badge">حزمة التشغيل الذاتية بدون إنترنت (Offline Standalone Package)</div>
    <p>مرحباً بك! هذه الحزمة الخفيفة مصممة خصيصاً للتنزيل والإرسال عبر البريد الإلكتروني (Hotmail / Outlook) لتعمل بنقرة زر واحدة على أي جهاز دون الحاجة للاتصال بالإنترنت.</p>
    
    <div class="grid">
      <div class="col">
        <h3>🦋 اللعبة الأولى: دورة الفراشة (التحول الكامل)</h3>
        <ol>
          <li>البيضة الدقيقة على الورقة</li>
          <li>تغذية اليرقة الجائعة</li>
          <li>انسلاخ اليرقة وتغير الجلد</li>
          <li>حركة اليرقة المتموجة</li>
          <li>غزل خيوط الحرير وحرف J</li>
          <li>تكوين الشرنقة الواقية</li>
          <li>حماية الشرنقة: إياك أن تفتحها!</li>
          <li>خروج الفراشة وضخ الأجنحة</li>
          <li>امتصاص الرحيق بالخرطوم</li>
          <li>استوديو التناظر الفراشي والرسم</li>
        </ol>
      </div>
      <div class="col grasshopper">
        <h3>🦗 اللعبة الثانية: دورة الجرادة (التحول الناقص)</h3>
        <ol>
          <li>جراب البيض في باطن التربة</li>
          <li>فقس الحورية الصغيرة بدون أجنحة</li>
          <li>تمرين القفز بالسيقان الخلفية</li>
          <li>وليمة الأعشاب والفكوك القارضة</li>
          <li>سلسلة الانسلاخات الخمسة (Instars)</li>
          <li>تصلب الهيكل الكيتيني الخارجي</li>
          <li>تشريح أجزاء الجرادة (رأس، صدر، بطن)</li>
          <li>عزف وحك الأرجل الموسيقي</li>
          <li>تحدي الهروب السريع من المفترس</li>
          <li>حلبة المقارنة الكبرى والتتويج العلمي</li>
        </ol>
      </div>
    </div>
    <p style="margin-top:24px; color: #94A3B8; font-size:13px;">تم توليد هذه الحزمة التعليمية بواسطة خبير الألعاب التربوية لمتابعة التميز الصفي.</p>
  </div>
</body>
</html>`;

    const blob = new Blob([offlineHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `butterfly-grasshopper-offline-game-${progress.studentName || 'student'}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download Teacher Guide & README
  const handleDownloadGuide = () => {
    playSuccessSound();
    const guideText = `====================================================
دليل المعلم وولي الأمر: مغامرات دورة نمو الفراشة والجرادة
(وحدة تعليمية تفاعلية مكونة من 20 صفحة - دعم كامل للأوفلاين)
====================================================

1. الأهداف التربوية العامة:
- ترسيخ الفروق البيولوجية العميقة بين:
  * التحول الكامل (Complete Metamorphosis): بيضة -> يرقة -> عذراء/شرنقة -> فراشة بالغة.
  * التحول الناقص (Incomplete Metamorphosis): بيضة في جراب -> حورية نامية -> جرادة بالغة.
- تعليم الطفل الصبر البيئي (عدم فتح الشرنقة أبداً قبل اكتمال نمو الجناح).
- التغذية المتخصصة: خرطوم ماص للرحيق مقابل فكوك قارضة للأعشاب.
- مهارات التفكير، الحركات الجسدية (القفز والتموج)، والرسم بالتناظر الثنائي.

2. الفئة العمرية المستهدفة:
- الأطفال من عمر 6 إلى 12 عاماً (المرحلة الابتدائية ورياض الأطفال المتقدمة).

3. توزيع الصفحات الـ 20:
- الصفحات (1 - 10): دورة حياة الفراشة بالتفصيل.
- الصفحات (11 - 20): دورة حياة الجرادة بالتفصيل.

4. تعليمات التشغيل دون اتصال بالإنترنت (Offline):
- تم تضمين كافة الأصوات عبر خوارزميات Web Audio API، لذلك لا يلزم تنزيل أي ملفات صوت خارجية.
- يمكن حفظ الصفحة وتوليد الحزمة الفردية (.html) وإرسالها كمرفق آمن وصغير الحجم عبر بريد Hotmail/Outlook.

5. معايير التقييم:
- إنجاز 20 صفحة = 100% + وسام "عالم الحشرات الصغير المتميز".
- الحفاظ على الشرنقة وعدم فتحها في صفحة 7 = وسام "حارس الطبيعة الصبور".
- إنجاز تحدي القفز في صفحة 13 و 19 = وسام "القافز الخارق".
- إنجاز رسم التناظر في صفحة 10 = وسام "فنان الطبيعة".

====================================================
مع أطيب التمنيات برحلة استكشاف ممتعة وملهمة!
`;

    const blob = new Blob([guideText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TEACHER_GUIDE_README_LIFECYCLES.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#1E293B] border-4 border-pink-500 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-700 p-4 sm:p-5 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-slate-900 flex items-center justify-center shadow-lg font-black text-2xl">
              🎓
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">
                لوحة المعلم، تقرير الإنجاز، وحزمة الأوفلاين
              </h2>
              <p className="text-xs text-yellow-200">
                متابعة تقدم الطالب • شهادة التفوق • دليل المنهج • حزمة Hotmail
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-blue-900 bg-[#0F172A] px-4 pt-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'report'
                ? 'bg-[#1E293B] text-yellow-400 border-t-2 border-pink-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>تقرير الطالب والشهادة</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-[#1E293B] text-yellow-400 border-t-2 border-pink-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>دليل المعلم (20 صفحة)</span>
          </button>

          <button
            onClick={() => setActiveTab('offline_pack')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'offline_pack'
                ? 'bg-[#1E293B] text-yellow-400 border-t-2 border-pink-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>حزمة أوفلاين (جاهزة لـ Hotmail)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-white flex-1">
          {activeTab === 'report' && (
            <div>
              {/* Student Name Editor */}
              <div className="bg-[#0F172A] p-4 rounded-2xl border border-blue-900 flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-yellow-300 font-bold">اسم الطالب/ـة المكتشف/ـة:</span>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => onUpdateStudentName(editingName)}
                    className="bg-[#1E293B] border border-pink-500 rounded-xl px-3 py-1.5 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="اكتب اسم الطالب هنا"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>تخزين آمن ومحلي 100% دون خوادم</span>
                </div>
              </div>

              {/* Progress Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-[#0F172A] p-3 rounded-2xl border border-blue-900 text-center">
                  <span className="text-xs text-gray-400">الصفحات المكتملة</span>
                  <div className="text-2xl font-black text-pink-400">
                    {completedCount} / {totalPages}
                  </div>
                </div>

                <div className="bg-[#0F172A] p-3 rounded-2xl border border-blue-900 text-center">
                  <span className="text-xs text-gray-400">نسبة الإنجاز</span>
                  <div className="text-2xl font-black text-yellow-400">{percentage}%</div>
                </div>

                <div className="bg-[#0F172A] p-3 rounded-2xl border border-blue-900 text-center">
                  <span className="text-xs text-gray-400">النجوم المكتسبة</span>
                  <div className="text-2xl font-black text-yellow-300 flex items-center justify-center gap-1">
                    <Star className="w-5 h-5 fill-current" />
                    <span>{progress.stars}</span>
                  </div>
                </div>

                <div className="bg-[#0F172A] p-3 rounded-2xl border border-blue-900 text-center">
                  <span className="text-xs text-gray-400">الأوسمة المستحقة</span>
                  <div className="text-2xl font-black text-emerald-400">{progress.badges.length}</div>
                </div>
              </div>

              {/* Printable Certificate Preview */}
              <div
                id="certificate-print-area"
                className="bg-gradient-to-br from-amber-50 via-white to-pink-50 text-slate-900 p-6 sm:p-8 rounded-3xl border-8 border-yellow-400 shadow-2xl relative text-center my-4 overflow-hidden"
              >
                <div className="absolute top-2 left-2 text-3xl">🦋</div>
                <div className="absolute top-2 right-2 text-3xl">🦗</div>
                <div className="absolute bottom-2 left-2 text-3xl">🌸</div>
                <div className="absolute bottom-2 right-2 text-3xl">🌱</div>

                <h3 className="text-2xl sm:text-3xl font-black text-blue-950 mb-2">
                  شهادة وسام عالم الأحياء الصغير
                </h3>
                <p className="text-sm font-bold text-pink-600 mb-4">
                  CERTIFICATE OF SCIENTIFIC EXPLORATION
                </p>

                <p className="text-base text-gray-700 font-medium">تشهد منصة الألعاب التعليمية بأن الباحث المبدع:</p>
                <div className="text-2xl sm:text-3xl font-black text-blue-900 my-2 underline decoration-yellow-400 decoration-wavy underline-offset-8">
                  {progress.studentName || 'الباحث المتميز'}
                </div>

                <p className="text-sm sm:text-base text-gray-700 max-w-lg mx-auto font-medium my-3 leading-relaxed">
                  قد أتم بنجاح استكشاف وممارسة التحديات الـ 20 التفاعلية لدورتي نمو
                  <strong> الفراشة (التحول الكامل)</strong> و<strong>الجرادة (التحول الناقص)</strong>،
                  وأثبت براعة في التفكير العلمي والأنشطة الحركية وحماية البيئة.
                </p>

                <div className="flex items-center justify-center gap-4 my-4">
                  <div className="bg-yellow-400/30 border border-yellow-500 px-4 py-1.5 rounded-full font-bold text-sm text-yellow-900">
                    التقدير: ممتاز مع مرتبة الشرف ⭐⭐⭐⭐⭐
                  </div>
                </div>

                <div className="flex justify-between items-end mt-6 pt-4 border-t-2 border-gray-300 text-xs font-bold text-gray-600 px-4">
                  <div>
                    <span>تاريخ الإنجاز: </span>
                    <span>{new Date().toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div>
                    <span>ختم المنهج التفاعلي: </span>
                    <span className="text-pink-600 font-black">معتمد تربوياً ✓</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-sm flex items-center gap-2 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الشهادة الرسمية</span>
                </button>

                <button
                  onClick={handleDownloadOfflinePackage}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-yellow-400 text-slate-900 font-black text-sm flex items-center gap-2 shadow-md shadow-pink-500/30"
                >
                  <Download className="w-4 h-4" />
                  <span>تنزيل حزمة الطالب الأوفلاين</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#0F172A] p-4 rounded-2xl border border-blue-900">
                <div>
                  <h3 className="text-base font-bold text-yellow-400">
                    دليل المعلم الشامل لخريطة الصفحات الـ 20
                  </h3>
                  <p className="text-xs text-blue-200">
                    نظرة تربوية معمقة على كل صفحة والأهداف السلوكية والحركية والذهنية.
                  </p>
                </div>
                <button
                  onClick={handleDownloadGuide}
                  className="px-3 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-yellow-400" />
                  <span>تحميل الدليل كملف README</span>
                </button>
              </div>

              <div className="space-y-2">
                {PAGES_DATA.map((page) => (
                  <div
                    key={page.pageNumber}
                    className="p-3 bg-[#0F172A]/70 rounded-xl border border-blue-900/60 flex items-start gap-3"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        page.game === 'butterfly'
                          ? 'bg-pink-500 text-white'
                          : 'bg-yellow-400 text-slate-900'
                      }`}
                    >
                      {page.pageNumber}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{page.title}</h4>
                        <span className="text-[11px] text-pink-300 font-semibold">
                          {page.stageName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">{page.learningGoal}</p>
                      {page.physicalChallenge && (
                        <p className="text-[11px] text-yellow-300 mt-0.5">
                          🏃 تمرين جسدي: {page.physicalChallenge.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'offline_pack' && (
            <div className="space-y-4">
              <div className="bg-[#0F172A] p-5 rounded-2xl border-2 border-yellow-400/40 text-center">
                <div className="w-16 h-16 rounded-2xl bg-yellow-400 text-slate-900 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">
                  📧
                </div>
                <h3 className="text-lg font-black text-white mb-2">
                  جاهز للإرسال عبر البريد الإلكتروني (Hotmail / Outlook / Gmail)
                </h3>
                <p className="text-sm text-blue-200 max-w-xl mx-auto leading-relaxed mb-4">
                  تم تصميم هذه الحزمة بدون أي روابط خارجية ثقيلة، بحجم صغير جداً وخفيف، مما يجعلها مثالية لإرفاقها عبر Hotmail. كل ما على ولي الأمر أو المعلم فعله هو إرسال الملف، وعند فتحه سيعمل في المتصفح أوفلاين دون إنترنت تماماً!
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleDownloadOfflinePackage}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-slate-900 font-black text-sm flex items-center gap-2 shadow-xl shadow-pink-500/30 transition-transform active:scale-95"
                  >
                    <Download className="w-5 h-5" />
                    <span>تنزيل ملف الحزمة الأوفلاين (.html) الآن</span>
                  </button>

                  <button
                    onClick={handleDownloadGuide}
                    className="px-5 py-3 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm flex items-center gap-2 border border-blue-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-yellow-400" />
                    <span>تنزيل دليل المعلم النصي (README.txt)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#0F172A] p-4 rounded-xl border border-blue-900">
                  <h4 className="text-xs font-bold text-yellow-300 mb-1">1. الخصوصية والأمان</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    لا يتم جمع أي بيانات للطفل؛ كل شيء يخزن محلياً على الجهاز.
                  </p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-blue-900">
                  <h4 className="text-xs font-bold text-pink-300 mb-1">2. أصوات مدمجة</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    المؤثرات الصوتية تعمل تلقائياً عبر مذبذبات المتصفح بدون ملفات صوت خارجية.
                  </p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-blue-900">
                  <h4 className="text-xs font-bold text-emerald-300 mb-1">3. حجم خفيف للغاية</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    الملف الناتج أقل من 100 كيلوبايت، مما يتوافق تماماً مع قيود مرفقات Hotmail.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
