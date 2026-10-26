import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileCode,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  Layers
} from 'lucide-react';
import {
  parseQuizFileContent,
  distributeCorrectAnswersDeterministically,
  ParsedQuizDraft
} from '../utils/quizParser';
import { svgIllustrations, ARABIC_LETTERS } from '../data/questions';
import type { QuizQuestion } from '../types/quiz';

interface QuizUploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const SVG_PRESET_LABELS: Record<string, string> = {
  biosChip: 'شريحة BIOS على اللوحة الأم',
  uefiGui: 'واجهة UEFI الرسومية الحديثة',
  hdmiPort: 'منفذ HDMI الرقمي (19 سنّاً)',
  sataPort: 'منفذ تخزين SATA الداخلي (حرف L)',
  cmosBattery: 'بطارية اللوحة الأم CMOS CR2032',
  usbC: 'منفذ USB Type-C المتماثل',
  secureBoot: 'درع الحماية والإقلاع الآمن Secure Boot',
  rj45Ethernet: 'منفذ الشبكة السلكية RJ-45 Ethernet',
  bootKeys: 'مفاتيح الدخول للإعدادات Delete / F2',
  atx24Pin: 'موصل الطاقة الرئيسي ATX 24-Pin',
  legacyBiosScreen: 'شاشة BIOS الزرقاء الكلاسيكية',
  hdmiCablePlug: 'توصيل كابل ومنفذ HDMI',
  redSataCable: 'كابل بيانات SATA الأحمر',
  postCheck: 'شاشة الفحص الذاتي POST'
};

export const QuizUploadModal: React.FC<QuizUploadModalProps> = ({
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'upload' | 'paste' | 'manual'>('upload');
  const [autoDistribute, setAutoDistribute] = useState(true);
  const [activateImmediately, setActivateImmediately] = useState(true);
  const [parsedDrafts, setParsedDrafts] = useState<ParsedQuizDraft[]>([]);
  const [pasteContent, setPasteContent] = useState('');
  const [pasteTitle, setPasteTitle] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Manual builder state
  const [manualTitle, setManualTitle] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualQuestions, setManualQuestions] = useState<
    Array<{
      question: string;
      svgKey: string;
      caption: string;
      options: [string, string, string, string];
      correct: number;
      explanation: string;
    }>
  >([
    {
      question: '',
      svgKey: 'biosChip',
      caption: 'رسم توضيحي مباشر للمكون التقني',
      options: ['', '', '', ''],
      correct: 1,
      explanation: ''
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFileList = async (files: FileList | File[]) => {
    setErrorMsg(null);
    const newDrafts: ParsedQuizDraft[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const text = await file.text();
        const draft = parseQuizFileContent(text, file.name, autoDistribute);
        newDrafts.push(draft);
      } catch (err: any) {
        errors.push(`${file.name}: ${err?.message || 'تعذر قراءة الملف'}`);
      }
    }

    if (newDrafts.length > 0) {
      setParsedDrafts((prev) => [...prev, ...newDrafts]);
    }
    if (errors.length > 0) {
      setErrorMsg(errors.join(' | '));
    }
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processFileList(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFileList(e.dataTransfer.files);
    }
  };

  const handleParsePastedContent = (): ParsedQuizDraft | null => {
    setErrorMsg(null);
    if (!pasteContent.trim()) {
      setErrorMsg('يرجى لصق كود ملف الكويز (HTML أو JSON) أولاً.');
      return null;
    }

    try {
      const draft = parseQuizFileContent(
        pasteContent,
        pasteTitle.trim() || 'كويز مضاف بالكود',
        autoDistribute
      );
      if (pasteTitle.trim()) {
        draft.title = pasteTitle.trim();
      }
      setParsedDrafts((prev) => [...prev, draft]);
      setPasteContent('');
      setPasteTitle('');
      setMode('upload');
      return draft;
    } catch (err: any) {
      setErrorMsg(err?.message || 'تعذر استخراج الأسئلة من الكود الملصق.');
      return null;
    }
  };

  const handleSaveUploadedQuizzes = async () => {
    let draftsToSave = [...parsedDrafts];

    // If user is on the paste tab and pasted code without clicking "Analyze" first, parse it now
    if (mode === 'paste' && pasteContent.trim()) {
      try {
        const directDraft = parseQuizFileContent(
          pasteContent,
          pasteTitle.trim() || 'كويز مضاف بالكود',
          autoDistribute
        );
        if (pasteTitle.trim()) {
          directDraft.title = pasteTitle.trim();
        }
        draftsToSave.push(directDraft);
      } catch (err: any) {
        setErrorMsg(err?.message || 'تعذر استخراج الأسئلة من الكود الملصق.');
        return;
      }
    }

    if (draftsToSave.length === 0) {
      setErrorMsg('يرجى اختيار ملف كويز أو لصق الكود أولاً قبل الحفظ.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizzes: draftsToSave,
          activateImmediately
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'حدث خطأ أثناء حفظ الكويزات.');
        setSaving(false);
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setErrorMsg('تعذر الاتصال بالخادم لحفظ الكويزات.');
      setSaving(false);
    }
  };

  const handleSaveManualQuiz = async () => {
    setErrorMsg(null);
    if (!manualTitle.trim()) {
      setErrorMsg('يرجى إدخال عنوان الكويز.');
      return;
    }

    for (let i = 0; i < manualQuestions.length; i++) {
      const mq = manualQuestions[i];
      if (!mq.question.trim()) {
        setErrorMsg(`يرجى كتابة نص السؤال رقم ${i + 1}.`);
        return;
      }
      if (mq.options.some((opt) => !opt.trim())) {
        setErrorMsg(`يرجى تعبئة جميع الخيارات الأربعة للسؤال رقم ${i + 1}.`);
        return;
      }
    }

    let formattedQuestions: QuizQuestion[] = manualQuestions.map((mq, idx) => ({
      id: idx + 1,
      question: mq.question.trim(),
      svg: svgIllustrations[mq.svgKey] || svgIllustrations.biosChip,
      caption: mq.caption.trim() || SVG_PRESET_LABELS[mq.svgKey] || 'رسم توضيحي',
      options: [
        mq.options[0].trim(),
        mq.options[1].trim(),
        mq.options[2].trim(),
        mq.options[3].trim()
      ],
      correct: mq.correct,
      explanation: mq.explanation.trim() || 'معلومة تقنية أساسية في المنهج.'
    }));

    if (autoDistribute) {
      formattedQuestions = distributeCorrectAnswersDeterministically(formattedQuestions);
    }

    setSaving(true);
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizzes: [
            {
              title: manualTitle.trim(),
              description:
                manualDescription.trim() ||
                `اختبار تفاعلي مصور (${formattedQuestions.length} سؤالاً)`,
              questions: formattedQuestions
            }
          ],
          activateImmediately
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'حدث خطأ أثناء حفظ الكويز.');
        setSaving(false);
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setErrorMsg('تعذر الاتصال بالخادم لحفظ الكويز.');
      setSaving(false);
    }
  };

  const canSaveUploadOrPaste =
    parsedDrafts.length > 0 || (mode === 'paste' && pasteContent.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-cyan-400 font-bold mb-1">
              نظام إدارة الكويزات المتعددة (يدعم كافة نماذج ملفات الكويز HTML و JSON)
            </div>
            <h2 className="text-xl font-extrabold text-white">
              إضافة أو رفع كويزات جديدة للنظام
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-6 pt-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-2xl border border-slate-700">
            <button
              type="button"
              onClick={() => {
                setMode('upload');
                setErrorMsg(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                mode === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>رفع ملفات كويز (HTML / JSON)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('paste');
                setErrorMsg(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                mode === 'paste'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>لصق كود كويز</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('manual');
                setErrorMsg(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                mode === 'manual'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء كويز يدوياً</span>
            </button>
          </div>

          {/* Options Toggles */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={autoDistribute}
                onChange={(e) => setAutoDistribute(e.target.checked)}
                className="rounded border-slate-600 text-cyan-500 focus:ring-0"
              />
              <span>توزيع الإجابة الصحيحة تلقائياً بين (أ، ب، ج، د)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-emerald-300 font-bold">
              <input
                type="checkbox"
                checked={activateImmediately}
                onChange={(e) => setActivateImmediately(e.target.checked)}
                className="rounded border-slate-600 text-emerald-500 focus:ring-0"
              />
              <span>تفعيل الكويز للطلاب فور الحفظ</span>
            </label>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* MODE 1: FILE UPLOAD (SINGLE OR BATCH 20+ FILES + DRAG & DROP) */}
          {mode === 'upload' && (
            <div className="space-y-5">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-cyan-400 bg-blue-950/40'
                    : 'border-cyan-500/40 hover:border-cyan-400 bg-slate-800/50 hover:bg-slate-800/80'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".html,.htm,.json,.js,.txt"
                  multiple
                  onChange={handleFilesSelected}
                  className="hidden"
                />
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white mb-1">
                  اسحب وأفلت ملفات الكويز هنا أو اضغط لاختيارها (يدعم رفع 20+ ملف دفعة واحدة)
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                  يدعم جميع نماذج الكويزات بصيغة <code className="text-cyan-300">.html</code> أو <code className="text-cyan-300">.json</code> بغض النظر عن مسميات المتغيرات أو طريقة كتابة الأسئلة والرسوم التوضيحية بداخلها.
                </p>
              </div>

              {parsedDrafts.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>الكويزات الجاهزة للإضافة ({parsedDrafts.length} كويز)</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setParsedDrafts([])}
                      className="text-xs text-rose-400 hover:text-rose-300 font-bold"
                    >
                      مسح القائمة
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {parsedDrafts.map((draft, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-[220px]">
                          <div className="flex items-center gap-2 mb-1.5">
                            <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                            <input
                              type="text"
                              value={draft.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setParsedDrafts((prev) =>
                                  prev.map((d, i) => (i === idx ? { ...d, title: val } : d))
                                );
                              }}
                              className="bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-1 text-sm font-bold text-white w-full"
                            />
                          </div>
                          <span className="text-xs text-emerald-400 font-mono-tabular">
                            ✓ تم استخراج {draft.questions.length} سؤالاً بنجاح مع الرسوم التوضيحية وتوزيع الإجابات
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setParsedDrafts((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700"
                          title="إزالة من القائمة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: PASTE HTML / JSON CODE */}
          {mode === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  عنوان الكويز (اختياري - سيتم استخراجه تلقائياً من الكود إذا تُرك فارغاً)
                </label>
                <input
                  type="text"
                  placeholder="مثال: الكويز الثاني - منافذ الطاقة والشبكات"
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-400 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  الصق كود الكويز (HTML كامل أو مصفوفة JSON للأسئلة)
                </label>
                <textarea
                  rows={8}
                  dir="ltr"
                  placeholder="<!DOCTYPE html>... أو [{ question: '...', options: [...], correct: 0 }]"
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:outline-none rounded-2xl p-4 text-xs font-mono-tabular text-cyan-300 text-left"
                />
              </div>

              <button
                type="button"
                onClick={handleParsePastedContent}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>تحليل الكود ومعاينته قبل الحفظ</span>
              </button>
            </div>
          )}

          {/* MODE 3: MANUAL VISUAL QUIZ BUILDER */}
          {mode === 'manual' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    عنوان الكويز الجديد
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: اختبار اللوحة الأم والمعالج"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-400 focus:outline-none rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    وصف مختصر للكويز
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: اختبار قصير لطلاب صيانة الحاسب"
                    value={manualDescription}
                    onChange={(e) => setManualDescription(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-cyan-400 focus:outline-none rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {manualQuestions.map((mq, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-cyan-400 font-mono-tabular">
                        السؤال #{qIdx + 1}
                      </span>
                      {manualQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setManualQuestions((prev) => prev.filter((_, i) => i !== qIdx))
                          }
                          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف السؤال</span>
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="اكتب نص السؤال هنا..."
                      value={mq.question}
                      onChange={(e) => {
                        const val = e.target.value;
                        setManualQuestions((prev) =>
                          prev.map((item, i) => (i === qIdx ? { ...item, question: val } : item))
                        );
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          الرسم التوضيحي المدمج (SVG)
                        </label>
                        <select
                          value={mq.svgKey}
                          onChange={(e) => {
                            const key = e.target.value;
                            setManualQuestions((prev) =>
                              prev.map((item, i) =>
                                i === qIdx
                                  ? {
                                      ...item,
                                      svgKey: key,
                                      caption: SVG_PRESET_LABELS[key] || item.caption
                                    }
                                  : item
                              )
                            );
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          {Object.entries(SVG_PRESET_LABELS).map(([k, label]) => (
                            <option key={k} value={k}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          تسمية الرسم التوضيحي
                        </label>
                        <input
                          type="text"
                          value={mq.caption}
                          onChange={(e) => {
                            const val = e.target.value;
                            setManualQuestions((prev) =>
                              prev.map((item, i) =>
                                i === qIdx ? { ...item, caption: val } : item
                              )
                            );
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[0, 1, 2, 3].map((optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setManualQuestions((prev) =>
                                prev.map((item, i) =>
                                  i === qIdx ? { ...item, correct: optIdx } : item
                                )
                              )
                            }
                            className={`w-8 h-8 rounded-lg font-extrabold text-xs shrink-0 border transition ${
                              mq.correct === optIdx
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                : 'bg-slate-900 text-slate-400 border-slate-700'
                            }`}
                            title="اضغط لتحديد هذا الخيار كإجابة صحيحة"
                          >
                            {ARABIC_LETTERS[optIdx]}
                          </button>
                          <input
                            type="text"
                            placeholder={`نص الخيار (${ARABIC_LETTERS[optIdx]})`}
                            value={mq.options[optIdx]}
                            onChange={(e) => {
                              const val = e.target.value;
                              setManualQuestions((prev) =>
                                prev.map((item, i) => {
                                  if (i !== qIdx) return item;
                                  const nextOpts = [...item.options] as [
                                    string,
                                    string,
                                    string,
                                    string
                                  ];
                                  nextOpts[optIdx] = val;
                                  return { ...item, options: nextOpts };
                                })
                              );
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="التوضيح العلمي بعد نهاية الاختبار (اختياري)..."
                      value={mq.explanation}
                      onChange={(e) => {
                        const val = e.target.value;
                        setManualQuestions((prev) =>
                          prev.map((item, i) =>
                            i === qIdx ? { ...item, explanation: val } : item
                          )
                        );
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setManualQuestions((prev) => [
                    ...prev,
                    {
                      question: '',
                      svgKey: 'uefiGui',
                      caption: 'رسم توضيحي مباشر',
                      options: ['', '', '', ''],
                      correct: (prev.length + 1) % 4,
                      explanation: ''
                    }
                  ])
                }
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة سؤال جديد للكويز</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-800 flex items-center justify-between gap-4 bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-bold"
          >
            إلغاء
          </button>

          {mode === 'manual' ? (
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveManualQuiz}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'جاري حفظ الكويز...' : 'حفظ الكويز في النظام'}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={saving || !canSaveUploadOrPaste}
              onClick={handleSaveUploadedQuizzes}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-40"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {saving
                  ? 'جاري الحفظ...'
                  : `حفظ وإضافة الكويزات (${
                      parsedDrafts.length > 0 ? parsedDrafts.length : 1
                    })`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
