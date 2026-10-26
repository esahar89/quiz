import type { QuizQuestion } from '../types/quiz';
import { svgIllustrations } from '../data/questions';
import { generateContextualQuestionSvg } from './contextualSvg';

export interface ParsedQuizDraft {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

const BALANCED_PATTERN = [1, 2, 0, 3, 1, 3, 2, 0, 3, 1, 0, 2, 1, 3];

export function inferSmartQuizTitle(
  rawTitle: string,
  questions: QuizQuestion[]
): string {
  const cleaned = (rawTitle || '').trim();
  const isGeneric =
    !cleaned ||
    /^(questions?|quiz(data|questions)?|data|items|test|index|untitled|كويز مضاف بالكود|اختبار جديد|اختبار تفاعلي مستورد)$/i.test(
      cleaned
    );

  if (!isGeneric) {
    return cleaned;
  }

  const combinedText = questions
    .slice(0, 8)
    .map((q) => q.question)
    .join(' ')
    .toLowerCase();

  if (
    combinedText.includes('ipv4') ||
    combinedText.includes('dns') ||
    combinedText.includes('dhcp') ||
    combinedText.includes('osi')
  ) {
    return `اختبار الشبكات وأنظمة التشغيل وإدارة الخوادم (${questions.length} سؤالاً)`;
  }

  if (combinedText.includes('bios') || combinedText.includes('uefi')) {
    return `اختبار BIOS و UEFI وتقنيات العتاد (${questions.length} سؤالاً)`;
  }

  if (combinedText.includes('linux') || combinedText.includes('windows')) {
    return `اختبار إدارة أنظمة التشغيل (${questions.length} سؤالاً)`;
  }

  const firstQ = questions[0]?.question || '';
  if (firstQ.length > 0) {
    const shortTopic = firstQ.replace(/[؟?!.]/g, '').trim().slice(0, 42);
    return `اختبار: ${shortTopic}... (${questions.length} سؤالاً)`;
  }

  return `اختبار تفاعلي (${questions.length} سؤالاً)`;
}

/**
 * Reorders each question's options deterministically so that the correct answer
 * sits at a balanced position across (أ=0, ب=1, ج=2, د=3) instead of always being at index 0.
 */
export function distributeCorrectAnswersDeterministically(
  questions: QuizQuestion[]
): QuizQuestion[] {
  return questions.map((q, idx) => {
    const validOptionsCount = q.options.filter((o) => o && o.trim() !== '').length;
    if (validOptionsCount < 2) {
      return { ...q, id: idx + 1 };
    }

    const currentCorrectIdx =
      typeof q.correct === 'number' && q.correct >= 0 && q.correct < validOptionsCount
        ? q.correct
        : 0;
    const targetCorrectIdx = BALANCED_PATTERN[idx % BALANCED_PATTERN.length] % validOptionsCount;

    if (currentCorrectIdx === targetCorrectIdx) {
      return { ...q, id: idx + 1 };
    }

    const newOptions = [...q.options] as [string, string, string, string];
    const temp = newOptions[targetCorrectIdx];
    newOptions[targetCorrectIdx] = newOptions[currentCorrectIdx];
    newOptions[currentCorrectIdx] = temp;

    return {
      ...q,
      id: idx + 1,
      options: newOptions,
      correct: targetCorrectIdx
    };
  });
}

function resolveCorrectIndex(
  rawItem: any,
  extractedOptions: string[],
  rawOptionsArray: any[]
): number {
  // 1. Check if options array itself consists of objects with { isCorrect / correct }
  if (Array.isArray(rawOptionsArray)) {
    const objIdx = rawOptionsArray.findIndex(
      (o) =>
        o &&
        typeof o === 'object' &&
        (o.isCorrect === true || o.correct === true || o.right === true || o.answer === true)
    );
    if (objIdx >= 0 && objIdx < 4) return objIdx;
  }

  const rawCorrect =
    rawItem.correct ??
    rawItem.correctAnswer ??
    rawItem.correctIndex ??
    rawItem.correctOption ??
    rawItem.answer ??
    rawItem.ans ??
    rawItem.rightAnswer ??
    rawItem.right;

  if (typeof rawCorrect === 'number' && !Number.isNaN(rawCorrect)) {
    if (rawCorrect >= 0 && rawCorrect <= 3) return rawCorrect;
    if (rawCorrect >= 1 && rawCorrect <= 4) return rawCorrect - 1;
  }

  if (typeof rawCorrect === 'string') {
    const clean = rawCorrect.trim();
    // Numeric string
    if (/^[0-3]$/.test(clean)) return Number(clean);
    // Letter mapping
    const letterMap: Record<string, number> = {
      a: 0,
      b: 1,
      c: 2,
      d: 3,
      أ: 0,
      ا: 0,
      ب: 1,
      ج: 2,
      د: 3
    };
    if (letterMap[clean.toLowerCase()] !== undefined) {
      return letterMap[clean.toLowerCase()];
    }
    // Match against option text
    const textMatchIdx = extractedOptions.findIndex(
      (opt) => opt.trim().toLowerCase() === clean.toLowerCase()
    );
    if (textMatchIdx >= 0 && textMatchIdx < 4) {
      return textMatchIdx;
    }
  }

  return 0;
}

function normalizeQuestionList(
  rawList: unknown[],
  svgMap: Record<string, string>,
  autoDistributeAnswers: boolean
): QuizQuestion[] {
  // Check if all raw items have 1-based indexing (1..4 and no 0)
  const numericCorrects = rawList
    .map((item: any) => item?.correct ?? item?.correctIndex ?? item?.answer)
    .filter((v): v is number => typeof v === 'number');
  const isOneBased =
    numericCorrects.length > 0 &&
    numericCorrects.every((v) => v >= 1 && v <= 4) &&
    !numericCorrects.includes(0);

  const parsed: QuizQuestion[] = rawList
    .map((item: any, idx: number) => {
      if (!item || typeof item !== 'object') return null;

      const questionText = String(
        item.question ||
          item.q ||
          item.text ||
          item.questionText ||
          item.title ||
          item.prompt ||
          item.stem ||
          ''
      ).trim();

      if (!questionText) return null;

      const rawOptionsArray = Array.isArray(item.options)
        ? item.options
        : Array.isArray(item.choices)
        ? item.choices
        : Array.isArray(item.answers)
        ? item.answers
        : Array.isArray(item.opts)
        ? item.opts
        : Array.isArray(item.alternatives)
        ? item.alternatives
        : [
            item.optionA ?? item.a ?? item.opt1,
            item.optionB ?? item.b ?? item.opt2,
            item.optionC ?? item.c ?? item.opt3,
            item.optionD ?? item.d ?? item.opt4
          ].filter((v) => v !== undefined);

      const stringOptions: string[] = rawOptionsArray.map((opt: any) => {
        if (opt && typeof opt === 'object') {
          return String(opt.text ?? opt.label ?? opt.value ?? opt.option ?? '').trim();
        }
        return String(opt ?? '').trim();
      });

      if (stringOptions.filter(Boolean).length === 0) return null;

      const paddedOptions: [string, string, string, string] = [
        stringOptions[0] || 'الخيار الأول',
        stringOptions[1] || 'الخيار الثاني',
        stringOptions[2] || (stringOptions.length === 2 ? 'غير ذلك' : 'الخيار الثالث'),
        stringOptions[3] || (stringOptions.length <= 3 ? 'لا شيء مما سبق' : 'الخيار الرابع')
      ];

      const rawSvg = String(
        item.svg ||
          item.illustration ||
          item.diagram ||
          item.icon ||
          item.visual ||
          item.image ||
          item.img ||
          ''
      ).trim();

      const contextualVisual = generateContextualQuestionSvg(questionText, idx);
      let svgContent = '';
      if (rawSvg && svgMap[rawSvg]) {
        svgContent = svgMap[rawSvg];
      } else if (rawSvg.includes('<svg')) {
        svgContent = rawSvg;
      } else if (
        rawSvg.startsWith('http://') ||
        rawSvg.startsWith('https://') ||
        rawSvg.startsWith('data:image/')
      ) {
        svgContent = `<img src="${rawSvg}" alt="رسم توضيحي" class="max-h-52 mx-auto rounded-xl object-contain" />`;
      } else {
        svgContent = contextualVisual.svg;
      }

      let correctIdx = resolveCorrectIndex(item, paddedOptions, rawOptionsArray);
      if (isOneBased && typeof item.correct === 'number') {
        correctIdx = Math.max(0, Math.min(3, item.correct - 1));
      }

      const captionText = String(
        item.caption ||
          item.imageCaption ||
          item.svgCaption ||
          item.subtitle ||
          contextualVisual.caption
      ).trim();

      const explanationText = String(
        item.explanation ||
          item.exp ||
          item.rationale ||
          item.feedback ||
          item.note ||
          item.hint ||
          item.desc ||
          'راجع الشرح العلمي المرتبط بهذا السؤال.'
      ).trim();

      return {
        id: idx + 1,
        question: questionText,
        svg: svgContent,
        caption: captionText,
        options: paddedOptions,
        correct: correctIdx,
        explanation: explanationText
      };
    })
    .filter((q): q is QuizQuestion => q !== null);

  if (autoDistributeAnswers) {
    return distributeCorrectAnswersDeterministically(parsed);
  }
  return parsed;
}

/**
 * Extracts all key: `<svg>...</svg>` template literals or string assignments from scripts
 */
function extractSvgDictionaryFromSource(rawContent: string): Record<string, string> {
  const map: Record<string, string> = { ...svgIllustrations };

  // Match key: `<svg...<\/svg>`
  const propSvgRegex = /([a-zA-Z0-9_$]+)\s*:\s*`([\s\S]*?<\/svg>\s*)`/gi;
  let match: RegExpExecArray | null;
  while ((match = propSvgRegex.exec(rawContent)) !== null) {
    map[match[1]] = match[2].trim();
  }

  // Also match key: '<svg...<\/svg>' or "<svg...<\/svg>"
  const quotedSvgRegex = /([a-zA-Z0-9_$]+)\s*:\s*(['"])(\s*<svg[\s\S]*?<\/svg>\s*)\2/gi;
  while ((match = quotedSvgRegex.exec(rawContent)) !== null) {
    map[match[1]] = match[3].trim();
  }

  return map;
}

/**
 * Safely finds the matching closing bracket `]` for an array starting at `startIdx`,
 * while properly skipping JS single-line comments `//`, multi-line comments `/* * /`,
 * and string literals `'...'`, `"..."`, `` `...` ``.
 */
function findMatchingArrayEnd(source: string, startIdx: number): number {
  let depth = 0;
  let inString: string | null = null;
  let inSingleComment = false;
  let inMultiComment = false;
  let escaped = false;

  for (let i = startIdx; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (inSingleComment) {
      if (ch === '\n' || ch === '\r') {
        inSingleComment = false;
      }
      continue;
    }

    if (inMultiComment) {
      if (ch === '*' && next === '/') {
        inMultiComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === inString) {
        inString = null;
      }
      continue;
    }

    // Check comment starts outside strings
    if (ch === '/' && next === '/') {
      inSingleComment = true;
      i++;
      continue;
    }
    if (ch === '/' && next === '*') {
      inMultiComment = true;
      i++;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch;
      continue;
    }

    if (ch === '[') {
      depth++;
    } else if (ch === ']') {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }

  return -1;
}

/**
 * Evaluates an extracted JS array literal in a fault-tolerant Proxy scope
 * so any variable like `svgIllustrations.xyz`, `svgs.abc`, `icons.def` never throws ReferenceError.
 */
function evaluateQuestionArraySafely(
  arrayLiteral: string,
  svgMap: Record<string, string>
): any[] | null {
  // Replace any `someObj.someKey` where `someKey` exists in `svgMap`
  const preprocessed = arrayLiteral.replace(
    /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\.([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g,
    (fullMatch, objName, propName) => {
      if (svgMap[propName]) {
        return JSON.stringify(svgMap[propName]);
      }
      if (
        ['svgIllustrations', 'svgs', 'illustrations', 'icons', 'diagrams', 'images'].includes(
          objName
        )
      ) {
        return JSON.stringify(svgMap[propName] || propName);
      }
      return fullMatch;
    }
  );

  const fallbackProxy = new Proxy(svgMap, {
    get(target, prop) {
      if (typeof prop === 'string' && prop in target) {
        return target[prop];
      }
      return typeof prop === 'string' ? prop : '';
    }
  });

  const scopeProxy = new Proxy(
    {
      svgIllustrations: fallbackProxy,
      svgs: fallbackProxy,
      illustrations: fallbackProxy,
      icons: fallbackProxy,
      diagrams: fallbackProxy,
      images: fallbackProxy
    },
    {
      has() {
        return true;
      },
      get(target, prop) {
        if (prop === Symbol.unscopables) return undefined;
        if (prop in target) return (target as any)[prop];
        if (typeof prop === 'string' && prop in svgMap) return svgMap[prop];
        if (prop in globalThis) return (globalThis as any)[prop];
        return fallbackProxy;
      }
    }
  );

  try {
    const fn = new Function('scope', `with (scope) { return (${preprocessed}); }`);
    const result = fn(scopeProxy);
    if (Array.isArray(result) && result.length > 0) {
      return result;
    }
  } catch {
    // ignore and allow next strategy
  }

  return null;
}

/**
 * Fallback DOM extractor if questions are rendered directly in HTML elements
 */
function extractQuestionsFromHtmlDom(
  doc: Document,
  autoDistributeAnswers: boolean
): QuizQuestion[] {
  const results: any[] = [];

  // Look for cards that contain a heading (h2/h3/h4) and multiple buttons or list items
  const candidateCards = Array.from(
    doc.querySelectorAll('#quizContainer > div, .question-card, .quiz-card, main > div > div')
  );

  for (const card of candidateCards) {
    const heading = card.querySelector('h2, h3, h4, .question-text, .question');
    const optionEls = Array.from(
      card.querySelectorAll('button.option-btn, .options button, ul li, .option')
    );

    if (!heading || optionEls.length < 2) continue;

    const questionText = heading.textContent?.trim() || '';
    if (!questionText) continue;

    const options = optionEls
      .slice(0, 4)
      .map((el) => {
        // Strip leading Arabic letter badges (أ، ب، ج، د) if nested inside spans
        const spans = el.querySelectorAll('span');
        if (spans.length >= 2) {
          return spans[spans.length - 1].textContent?.trim() || el.textContent?.trim() || '';
        }
        return el.textContent?.trim() || '';
      })
      .filter(Boolean);

    if (options.length < 2) continue;

    const svgEl = card.querySelector('svg');
    const captionEl = card.querySelector('.svg-container + p, figcaption');

    results.push({
      question: questionText,
      options,
      svg: svgEl ? svgEl.outerHTML : '',
      caption: captionEl?.textContent?.replace(/^🔍\s*رسم توضيحي مباشر:\s*/, '').trim() || '',
      correct: 0,
      explanation: ''
    });
  }

  if (results.length > 0) {
    return normalizeQuestionList(results, {}, autoDistributeAnswers);
  }
  return [];
}

/**
 * Parses an uploaded HTML or JSON file/string into a structured Quiz definition
 */
export function parseQuizFileContent(
  rawContent: string,
  fileName: string,
  autoDistributeAnswers = true
): ParsedQuizDraft {
  const trimmed = rawContent.trim();
  const baseName = fileName.replace(/\.(html?|json|txt)$/i, '').replace(/[_-]+/g, ' ');

  // 1. Try JSON format first
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const json = JSON.parse(trimmed);
      if (Array.isArray(json)) {
        const questions = normalizeQuestionList(json, {}, autoDistributeAnswers);
        if (questions.length > 0) {
          return {
            title: inferSmartQuizTitle(baseName, questions),
            description: `اختبار تفاعلي مكون من ${questions.length} سؤالاً`,
            questions
          };
        }
      } else if (json && typeof json === 'object') {
        const rawArr =
          json.questions ||
          json.quizQuestions ||
          json.quizData ||
          json.data ||
          json.items ||
          json.quiz;
        if (Array.isArray(rawArr)) {
          const questions = normalizeQuestionList(
            rawArr,
            json.svgIllustrations || json.svgs || {},
            autoDistributeAnswers
          );
          if (questions.length > 0) {
            return {
              title: inferSmartQuizTitle(
                String(json.title || json.name || baseName || ''),
                questions
              ),
              description: String(
                json.description || `اختبار تفاعلي مكون من ${questions.length} سؤالاً`
              ),
              questions
            };
          }
        }
      }
    } catch {
      // Not pure JSON; continue to JS/HTML extraction
    }
  }

  // 2. Parse HTML Document Metadata & Scripts
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawContent, 'text/html');

  const h1Text = doc.querySelector('h1')?.textContent?.trim();
  const docTitle = doc.querySelector('title')?.textContent?.trim();
  const extractedTitle = h1Text || docTitle || baseName || '';
  const subtitleEl = doc.querySelector('header p, .subtitle')?.textContent?.trim();

  const extractedSvgMap = extractSvgDictionaryFromSource(rawContent);

  // Strategy A: Find any JS variable assignment to an array `[` (e.g., questions, quizData, data, etc.)
  const arrayAssignRegex =
    /(?:const|let|var|window\.)?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\[/g;
  let assignMatch: RegExpExecArray | null;

  // Prioritize known question variable names first, then any array variable
  const candidateArrays: Array<{ varName: string; literal: string }> = [];

  while ((assignMatch = arrayAssignRegex.exec(rawContent)) !== null) {
    const varName = assignMatch[1];
    // Skip injected Google/Bard array variables
    if (varName === 'googleLlmBaseApiUrls' || varName === 'SCROLL_KEYS') {
      continue;
    }
    const openBracketIdx = assignMatch.index + assignMatch[0].length - 1;
    const closeBracketIdx = findMatchingArrayEnd(rawContent, openBracketIdx);
    if (closeBracketIdx !== -1) {
      const literal = rawContent.slice(openBracketIdx, closeBracketIdx + 1);
      if (literal.length > 40 && literal.includes('{')) {
        candidateArrays.push({ varName, literal });
      }
    }
  }

  // Sort so variables named `questions`, `quizQuestions`, `quizData` are tested first
  candidateArrays.sort((a, b) => {
    const score = (name: string) =>
      /question|quiz|data|items/i.test(name) ? 0 : 1;
    return score(a.varName) - score(b.varName);
  });

  for (const candidate of candidateArrays) {
    const evaluated = evaluateQuestionArraySafely(candidate.literal, extractedSvgMap);
    if (evaluated && evaluated.length > 0) {
      const normalized = normalizeQuestionList(
        evaluated,
        extractedSvgMap,
        autoDistributeAnswers
      );
      if (normalized.length > 0) {
        return {
          title: inferSmartQuizTitle(extractedTitle, normalized),
          description:
            subtitleEl || `اختبار تفاعلي مصور (${normalized.length} سؤالاً)`,
          questions: normalized
        };
      }
    }
  }

  // Strategy B: Extract directly from rendered HTML DOM cards if no script array matched
  const domQuestions = extractQuestionsFromHtmlDom(doc, autoDistributeAnswers);
  if (domQuestions.length > 0) {
    return {
      title: inferSmartQuizTitle(extractedTitle, domQuestions),
      description:
        subtitleEl || `اختبار تفاعلي مصور (${domQuestions.length} سؤالاً)`,
      questions: domQuestions
    };
  }

  throw new Error(
    'تعذر العثور على أسئلة داخل هذا الملف. تأكد من أن الملف يحتوي على أسئلة اختبار بصيغة HTML أو JSON.'
  );
}
