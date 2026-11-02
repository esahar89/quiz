import type { QuizDefinition, QuizQuestion } from '../types/quiz.ts';
import { generateContextualQuestionSvg } from '../utils/contextualSvg.ts';

export const THIRD_QUIZ_ID = 'quiz-comptia-itf-40';

export const COMPTIA_SVG_DIAGRAMS: Record<string, string> = {
  binaryTable: `
    <svg viewBox="0 0 600 135" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="590" height="125" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <text x="300" y="28" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="Cairo, sans-serif">جدول أوزان الخانات الثنائية (8-Bit Binary Byte)</text>
      <g font-family="monospace" text-anchor="middle">
        <rect x="22" y="40" width="65" height="36" rx="6" fill="#1e293b" stroke="#475569"/>
        <text x="54.5" y="63" fill="#38bdf8" font-size="15" font-weight="bold">128</text>
        <rect x="92" y="40" width="65" height="36" rx="6" fill="#1e293b" stroke="#475569"/>
        <text x="124.5" y="63" fill="#38bdf8" font-size="15" font-weight="bold">64</text>
        <rect x="162" y="40" width="65" height="36" rx="6" fill="#06b6d4" fill-opacity="0.2" stroke="#06b6d4"/>
        <text x="194.5" y="63" fill="#22d3ee" font-size="15" font-weight="bold">32</text>
        <rect x="232" y="40" width="65" height="36" rx="6" fill="#1e293b" stroke="#475569"/>
        <text x="264.5" y="63" fill="#38bdf8" font-size="15" font-weight="bold">16</text>
        <rect x="302" y="40" width="65" height="36" rx="6" fill="#06b6d4" fill-opacity="0.2" stroke="#06b6d4"/>
        <text x="334.5" y="63" fill="#22d3ee" font-size="15" font-weight="bold">8</text>
        <rect x="372" y="40" width="65" height="36" rx="6" fill="#1e293b" stroke="#475569"/>
        <text x="404.5" y="63" fill="#38bdf8" font-size="15" font-weight="bold">4</text>
        <rect x="442" y="40" width="65" height="36" rx="6" fill="#06b6d4" fill-opacity="0.2" stroke="#06b6d4"/>
        <text x="474.5" y="63" fill="#22d3ee" font-size="15" font-weight="bold">2</text>
        <rect x="512" y="40" width="65" height="36" rx="6" fill="#1e293b" stroke="#475569"/>
        <text x="544.5" y="63" fill="#38bdf8" font-size="15" font-weight="bold">1</text>

        <rect x="22" y="82" width="65" height="38" rx="6" fill="#090d16" stroke="#334155"/>
        <text x="54.5" y="107" fill="#64748b" font-size="18">0</text>
        <rect x="92" y="82" width="65" height="38" rx="6" fill="#090d16" stroke="#334155"/>
        <text x="124.5" y="107" fill="#64748b" font-size="18">0</text>
        <rect x="162" y="82" width="65" height="38" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
        <text x="194.5" y="107" fill="#34d399" font-size="18" font-weight="bold">1</text>
        <rect x="232" y="82" width="65" height="38" rx="6" fill="#090d16" stroke="#334155"/>
        <text x="264.5" y="107" fill="#64748b" font-size="18">0</text>
        <rect x="302" y="82" width="65" height="38" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
        <text x="334.5" y="107" fill="#34d399" font-size="18" font-weight="bold">1</text>
        <rect x="372" y="82" width="65" height="38" rx="6" fill="#090d16" stroke="#334155"/>
        <text x="404.5" y="107" fill="#64748b" font-size="18">0</text>
        <rect x="442" y="82" width="65" height="38" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
        <text x="474.5" y="107" fill="#34d399" font-size="18" font-weight="bold">1</text>
        <rect x="512" y="82" width="65" height="38" rx="6" fill="#090d16" stroke="#334155"/>
        <text x="544.5" y="107" fill="#64748b" font-size="18">0</text>
      </g>
    </svg>
  `,
  iposCycle: `
    <svg viewBox="0 0 620 150" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="610" height="140" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <rect x="25" y="30" width="130" height="60" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <text x="90" y="57" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="bold" font-family="Cairo, sans-serif">1. الإدخال (Input)</text>
      <text x="90" y="76" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Cairo, sans-serif">لوحة المفاتيح / الفأرة</text>
      <path d="M160 60 L195 60" stroke="#22d3ee" stroke-width="3"/>
      <rect x="200" y="25" width="165" height="70" rx="10" fill="#06b6d4" fill-opacity="0.18" stroke="#22d3ee" stroke-width="2.5" stroke-dasharray="5,3"/>
      <text x="282" y="55" text-anchor="middle" fill="#fbbf24" font-size="16" font-weight="bold" font-family="Cairo, sans-serif">2. [ ؟؟؟ ]</text>
      <text x="282" y="78" text-anchor="middle" fill="#e2e8f0" font-size="12" font-family="monospace">CPU / Processor</text>
      <path d="M370 60 L405 60" stroke="#22d3ee" stroke-width="3"/>
      <rect x="410" y="30" width="180" height="60" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
      <text x="500" y="57" text-anchor="middle" fill="#34d399" font-size="14" font-weight="bold" font-family="Cairo, sans-serif">3. الإخراج (Output)</text>
      <text x="500" y="76" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Cairo, sans-serif">الشاشة / الطابعة</text>
      <rect x="210" y="108" width="145" height="30" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="1.5"/>
      <text x="282" y="128" text-anchor="middle" fill="#c084fc" font-size="12" font-weight="bold" font-family="Cairo, sans-serif">4. التخزين (Storage)</text>
    </svg>
  `,
  videoPorts: `
    <svg viewBox="0 0 600 160" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="590" height="150" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <g transform="translate(30, 25)">
        <rect x="0" y="0" width="150" height="110" rx="10" fill="#1e293b" stroke="#475569"/>
        <polygon points="35,30 115,30 105,70 45,70" fill="#1d4ed8" stroke="#93c5fd" stroke-width="2.5"/>
        <circle cx="22" cy="50" r="6" fill="#64748b"/>
        <circle cx="128" cy="50" r="6" fill="#64748b"/>
        <circle cx="52" cy="40" r="2.2" fill="#f8fafc"/><circle cx="64" cy="40" r="2.2" fill="#f8fafc"/><circle cx="76" cy="40" r="2.2" fill="#f8fafc"/><circle cx="88" cy="40" r="2.2" fill="#f8fafc"/><circle cx="100" cy="40" r="2.2" fill="#f8fafc"/>
        <circle cx="55" cy="50" r="2.2" fill="#f8fafc"/><circle cx="67" cy="50" r="2.2" fill="#f8fafc"/><circle cx="79" cy="50" r="2.2" fill="#f8fafc"/><circle cx="91" cy="50" r="2.2" fill="#f8fafc"/><circle cx="103" cy="50" r="2.2" fill="#f8fafc"/>
        <circle cx="52" cy="60" r="2.2" fill="#f8fafc"/><circle cx="64" cy="60" r="2.2" fill="#f8fafc"/><circle cx="76" cy="60" r="2.2" fill="#f8fafc"/><circle cx="88" cy="60" r="2.2" fill="#f8fafc"/><circle cx="100" cy="60" r="2.2" fill="#f8fafc"/>
        <text x="75" y="96" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="Cairo, sans-serif" font-weight="bold">منفذ (أ) - 15 دبوساً أزرق</text>
      </g>
      <g transform="translate(220, 20)">
        <rect x="0" y="0" width="165" height="120" rx="10" fill="#064e3b" fill-opacity="0.35" stroke="#10b981" stroke-width="2.5"/>
        <polygon points="28,35 137,35 137,55 122,70 43,70 28,55" fill="#090d16" stroke="#34d399" stroke-width="2.5"/>
        <rect x="48" y="50" width="69" height="6" rx="2" fill="#fbbf24"/>
        <text x="82.5" y="95" text-anchor="middle" fill="#34d399" font-size="14" font-family="Cairo, sans-serif" font-weight="bold">المنفذ المشار إليه (ب)</text>
        <text x="82.5" y="112" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="Cairo, sans-serif">صوت + صورة رقمية عالية الدقة</text>
      </g>
      <g transform="translate(415, 25)">
        <rect x="0" y="0" width="150" height="110" rx="10" fill="#1e293b" stroke="#475569"/>
        <polygon points="30,32 120,32 120,68 45,68 30,53" fill="#090d16" stroke="#cbd5e1" stroke-width="2.5"/>
        <rect x="48" y="48" width="56" height="5" fill="#38bdf8"/>
        <text x="75" y="96" text-anchor="middle" fill="#cbd5e1" font-size="13" font-family="Cairo, sans-serif" font-weight="bold">منفذ (ج) - زاوية مشطوفة واحدة</text>
      </g>
    </svg>
  `,
  motherboardDiagram: `
    <svg viewBox="0 0 600 210" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="580" height="190" rx="14" fill="#0b1325" stroke="#334155" stroke-width="2.5"/>
      <rect x="60" y="35" width="110" height="105" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <rect x="78" y="53" width="74" height="70" rx="4" fill="#0f172a" stroke="#64748b" stroke-dasharray="3,3"/>
      <text x="115" y="92" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="bold" font-family="monospace">(1) CPU Socket</text>
      <g>
        <rect x="210" y="25" width="135" height="125" rx="8" fill="#06b6d4" fill-opacity="0.15" stroke="#22d3ee" stroke-width="2.5"/>
        <rect x="228" y="35" width="16" height="105" rx="3" fill="#0f172a" stroke="#fbbf24" stroke-width="2"/>
        <rect x="254" y="35" width="16" height="105" rx="3" fill="#0f172a" stroke="#fbbf24" stroke-width="2"/>
        <rect x="280" y="35" width="16" height="105" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
        <rect x="306" y="35" width="16" height="105" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
        <text x="395" y="65" fill="#22d3ee" font-size="15" font-weight="bold" font-family="Cairo, sans-serif">← المنطقة رقم (2)</text>
        <text x="395" y="88" fill="#94a3b8" font-size="12" font-family="Cairo, sans-serif">4 شقوق طولية متوازية بجانب المعالج</text>
      </g>
      <rect x="55" y="160" width="240" height="22" rx="4" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
      <text x="175" y="175" text-anchor="middle" fill="#c084fc" font-size="12" font-family="monospace">(3) PCIe x16 Slot</text>
      <circle cx="480" cy="145" r="26" fill="#334155" stroke="#cbd5e1" stroke-width="2.5"/>
      <text x="480" y="149" text-anchor="middle" fill="#f8fafc" font-size="11" font-family="monospace">(4) CR2032</text>
    </svg>
  `,
  rj45VsRj11: `
    <svg viewBox="0 0 600 165" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="590" height="155" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <g transform="translate(55, 22)">
        <rect x="0" y="0" width="220" height="120" rx="10" fill="#064e3b" fill-opacity="0.3" stroke="#10b981" stroke-width="2"/>
        <rect x="45" y="20" width="130" height="62" rx="6" fill="#090d16" stroke="#34d399" stroke-width="2"/>
        <g fill="#fbbf24">
          <rect x="60" y="22" width="7" height="24" rx="1"/>
          <rect x="73" y="22" width="7" height="24" rx="1"/>
          <rect x="86" y="22" width="7" height="24" rx="1"/>
          <rect x="99" y="22" width="7" height="24" rx="1"/>
          <rect x="112" y="22" width="7" height="24" rx="1"/>
          <rect x="125" y="22" width="7" height="24" rx="1"/>
          <rect x="138" y="22" width="7" height="24" rx="1"/>
          <rect x="151" y="22" width="7" height="24" rx="1"/>
        </g>
        <text x="110" y="102" text-anchor="middle" fill="#34d399" font-size="14" font-weight="bold" font-family="Cairo, sans-serif">الموصل (أ): 8 دبابيس نحاسية (8P8C)</text>
      </g>
      <g transform="translate(325, 22)">
        <rect x="0" y="0" width="220" height="120" rx="10" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <rect x="65" y="25" width="90" height="55" rx="6" fill="#090d16" stroke="#94a3b8" stroke-width="2"/>
        <g fill="#fbbf24">
          <rect x="84" y="27" width="8" height="22" rx="1"/>
          <rect x="99" y="27" width="8" height="22" rx="1"/>
          <rect x="114" y="27" width="8" height="22" rx="1"/>
          <rect x="129" y="27" width="8" height="22" rx="1"/>
        </g>
        <text x="110" y="102" text-anchor="middle" fill="#cbd5e1" font-size="14" font-weight="bold" font-family="Cairo, sans-serif">الموصل (ب): 4 دبابيس (خط الهاتف)</text>
      </g>
    </svg>
  `,
  ssdVsHdd: `
    <svg viewBox="0 0 600 170" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="590" height="160" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <g transform="translate(35, 20)">
        <rect x="0" y="0" width="245" height="130" rx="10" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
        <circle cx="80" cy="65" r="44" fill="#090d16" stroke="#94a3b8" stroke-width="3"/>
        <circle cx="80" cy="65" r="14" fill="#38bdf8"/>
        <path d="M135 105 L95 68" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
        <circle cx="135" cy="105" r="8" fill="#f59e0b"/>
        <text x="185" y="55" text-anchor="middle" fill="#f8fafc" font-size="14" font-weight="bold" font-family="Cairo, sans-serif">القرص (أ)</text>
        <text x="185" y="78" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Cairo, sans-serif">أقراص مغناطيسية دوارة</text>
        <text x="185" y="96" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Cairo, sans-serif">وذراع قراءة ميكانيكي</text>
      </g>
      <g transform="translate(320, 20)">
        <rect x="0" y="0" width="245" height="130" rx="10" fill="#064e3b" fill-opacity="0.3" stroke="#10b981" stroke-width="2"/>
        <rect x="22" y="25" width="42" height="34" rx="4" fill="#090d16" stroke="#34d399" stroke-width="2"/>
        <rect x="74" y="25" width="42" height="34" rx="4" fill="#090d16" stroke="#34d399" stroke-width="2"/>
        <rect x="22" y="70" width="42" height="34" rx="4" fill="#090d16" stroke="#34d399" stroke-width="2"/>
        <rect x="74" y="70" width="42" height="34" rx="4" fill="#090d16" stroke="#34d399" stroke-width="2"/>
        <text x="182" y="55" text-anchor="middle" fill="#34d399" font-size="14" font-weight="bold" font-family="Cairo, sans-serif">القرص (ب)</text>
        <text x="182" y="78" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="Cairo, sans-serif">شرائح ذاكرة فلاش إلكترونية</text>
        <text x="182" y="96" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">(NAND Flash)</text>
      </g>
    </svg>
  `,
  usbConnectors: `
    <svg viewBox="0 0 600 150" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="590" height="140" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <g transform="translate(35, 25)">
        <rect x="0" y="0" width="155" height="100" rx="8" fill="#1e293b" stroke="#475569"/>
        <rect x="28" y="28" width="100" height="36" fill="#090d16" stroke="#cbd5e1" stroke-width="2.5"/>
        <rect x="33" y="33" width="90" height="14" fill="#3b82f6"/>
        <text x="77" y="86" text-anchor="middle" fill="#cbd5e1" font-size="13" font-family="monospace">USB Type-A</text>
      </g>
      <g transform="translate(222, 25)">
        <rect x="0" y="0" width="155" height="100" rx="8" fill="#1e293b" stroke="#475569"/>
        <polygon points="48,25 107,25 117,37 117,65 38,65 38,37" fill="#090d16" stroke="#cbd5e1" stroke-width="2.5"/>
        <rect x="58" y="40" width="39" height="12" fill="#94a3b8"/>
        <text x="77" y="86" text-anchor="middle" fill="#cbd5e1" font-size="13" font-family="monospace">USB Type-B</text>
      </g>
      <g transform="translate(410, 20)">
        <rect x="0" y="0" width="160" height="110" rx="10" fill="#06b6d4" fill-opacity="0.2" stroke="#22d3ee" stroke-width="2.5"/>
        <rect x="30" y="32" width="100" height="32" rx="16" fill="#090d16" stroke="#22d3ee" stroke-width="3"/>
        <rect x="46" y="45" width="68" height="6" rx="3" fill="#fbbf24"/>
        <text x="80" y="88" text-anchor="middle" fill="#22d3ee" font-size="14" font-weight="bold" font-family="Cairo, sans-serif">الموصل المشار إليه (ج)</text>
        <text x="80" y="103" text-anchor="middle" fill="#bae6fd" font-size="11" font-family="Cairo, sans-serif">بيضاوي متماثل الوجهين</text>
      </g>
    </svg>
  `,
  osLayers: `
    <svg viewBox="0 0 600 180" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="590" height="170" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <g text-anchor="middle" font-family="Cairo, sans-serif">
        <rect x="100" y="18" width="400" height="32" rx="6" fill="#1e293b" stroke="#38bdf8"/>
        <text x="300" y="39" fill="#38bdf8" font-size="13" font-weight="bold">المستخدم وتطبيقات سطح المكتب (Applications)</text>
        <rect x="100" y="56" width="400" height="32" rx="6" fill="#1e293b" stroke="#a855f7"/>
        <text x="300" y="77" fill="#c084fc" font-size="13" font-weight="bold">واجهة المستخدم الرسومية أو النصية (GUI / Shell)</text>
        <rect x="100" y="94" width="400" height="36" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
        <text x="300" y="117" fill="#34d399" font-size="14" font-weight="bold">الطبقة الوسطى [ ؟؟؟ ] (قلب نظام التشغيل)</text>
        <rect x="100" y="136" width="400" height="30" rx="6" fill="#334155" stroke="#94a3b8"/>
        <text x="300" y="156" fill="#f8fafc" font-size="13" font-weight="bold">العتاد المادي (CPU, RAM, Disks - Hardware)</text>
      </g>
    </svg>
  `,
  filePathTree: `
    <svg viewBox="0 0 600 130" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="590" height="120" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <text x="300" y="35" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="Cairo, sans-serif">مسار الملف في نظام التشغيل Windows:</text>
      <rect x="45" y="50" width="510" height="52" rx="8" fill="#090d16" stroke="#06b6d4" stroke-width="2"/>
      <text x="300" y="83" text-anchor="middle" fill="#22d3ee" font-size="18" font-weight="bold" font-family="monospace" dir="ltr">
        C:\\Users\\Student\\Projects\\Database_Schema.sql
      </text>
    </svg>
  `,
  flowchartCondition: `
    <svg viewBox="0 0 600 175" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="590" height="165" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <polygon points="300,20 410,75 300,130 190,75" fill="#1e293b" stroke="#fbbf24" stroke-width="2.5"/>
      <text x="300" y="72" text-anchor="middle" fill="#fbbf24" font-size="14" font-weight="bold" font-family="monospace">score &gt;= 60 ?</text>
      <text x="300" y="92" text-anchor="middle" fill="#cbd5e1" font-size="11" font-family="Cairo, sans-serif">فحص الشرط</text>
      <path d="M410 75 L470 75" stroke="#10b981" stroke-width="2.5"/>
      <text x="440" y="65" text-anchor="middle" fill="#34d399" font-size="12" font-family="monospace">True</text>
      <rect x="470" y="52" width="105" height="46" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
      <text x="522" y="80" text-anchor="middle" fill="#34d399" font-size="14" font-weight="bold" font-family="Cairo, sans-serif">ناجح (Pass)</text>
      <path d="M190 75 L130 75" stroke="#f43f5e" stroke-width="2.5"/>
      <text x="160" y="65" text-anchor="middle" fill="#fb7185" font-size="12" font-family="monospace">False</text>
      <rect x="25" y="52" width="105" height="46" rx="8" fill="#4c0519" stroke="#f43f5e" stroke-width="2"/>
      <text x="77" y="80" text-anchor="middle" fill="#fb7185" font-size="13" font-weight="bold" font-family="Cairo, sans-serif">يحتاج مراجعة</text>
    </svg>
  `,
  arrayIndexing: `
    <svg viewBox="0 0 600 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="590" height="130" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <text x="300" y="30" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="monospace" dir="ltr">int grades[] = {75, 82, 95, 68, 90};</text>
      <g font-family="monospace" text-anchor="middle">
        <rect x="65" y="45" width="88" height="48" rx="6" fill="#1e293b" stroke="#475569"/>
        <text x="109" y="75" fill="#f8fafc" font-size="18" font-weight="bold">75</text>
        <text x="109" y="114" fill="#38bdf8" font-size="12">Index [0]</text>
        <rect x="161" y="45" width="88" height="48" rx="6" fill="#1e293b" stroke="#475569"/>
        <text x="205" y="75" fill="#f8fafc" font-size="18" font-weight="bold">82</text>
        <text x="205" y="114" fill="#38bdf8" font-size="12">Index [1]</text>
        <rect x="257" y="45" width="88" height="48" rx="6" fill="#06b6d4" fill-opacity="0.25" stroke="#22d3ee" stroke-width="2"/>
        <text x="301" y="75" fill="#22d3ee" font-size="18" font-weight="bold">95</text>
        <text x="301" y="114" fill="#fbbf24" font-size="12" font-weight="bold">Index [2]</text>
        <rect x="353" y="45" width="88" height="48" rx="6" fill="#1e293b" stroke="#475569"/>
        <text x="397" y="75" fill="#f8fafc" font-size="18" font-weight="bold">68</text>
        <text x="397" y="114" fill="#38bdf8" font-size="12">Index [3]</text>
        <rect x="449" y="45" width="88" height="48" rx="6" fill="#1e293b" stroke="#475569"/>
        <text x="493" y="75" fill="#f8fafc" font-size="18" font-weight="bold">90</text>
        <text x="493" y="114" fill="#38bdf8" font-size="12">Index [4]</text>
      </g>
    </svg>
  `,
  relationalKeys: `
    <svg viewBox="0 0 600 165" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="590" height="155" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <rect x="30" y="25" width="210" height="115" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <rect x="30" y="25" width="210" height="30" rx="8" fill="#0284c7"/>
      <text x="135" y="45" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="bold" font-family="monospace">quizzes (جدول الكويزات)</text>
      <text x="135" y="78" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="bold" font-family="monospace">🔑 id (PRIMARY KEY)</text>
      <text x="135" y="105" text-anchor="middle" fill="#cbd5e1" font-size="12" font-family="monospace">title NVARCHAR(160)</text>
      <path d="M240 75 L345 95" stroke="#10b981" stroke-width="3" stroke-dasharray="5,3"/>
      <rect x="345" y="25" width="225" height="115" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
      <rect x="345" y="25" width="225" height="30" rx="8" fill="#059669"/>
      <text x="457" y="45" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="bold" font-family="monospace">student_submissions</text>
      <text x="457" y="75" text-anchor="middle" fill="#cbd5e1" font-size="12" font-family="monospace">🔑 id (PRIMARY KEY)</text>
      <text x="457" y="100" text-anchor="middle" fill="#34d399" font-size="13" font-weight="bold" font-family="monospace">🔗 quiz_id [ ؟؟؟ ]</text>
      <text x="457" y="122" text-anchor="middle" fill="#cbd5e1" font-size="12" font-family="monospace">score INT</text>
    </svg>
  `,
  sqlQueryVisual: `
    <svg viewBox="0 0 600 135" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="590" height="125" rx="12" fill="#090d16" stroke="#334155" stroke-width="2"/>
      <text x="30" y="38" fill="#38bdf8" font-size="15" font-weight="bold" font-family="monospace" dir="ltr">SELECT student_name, percentage, grade</text>
      <text x="30" y="65" fill="#34d399" font-size="15" font-weight="bold" font-family="monospace" dir="ltr">FROM student_submissions</text>
      <text x="30" y="92" fill="#fbbf24" font-size="15" font-weight="bold" font-family="monospace" dir="ltr">WHERE percentage &gt;= 85;</text>
    </svg>
  `,
  ciaTriad: `
    <svg viewBox="0 0 600 185" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="590" height="175" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <polygon points="300,25 415,145 185,145" fill="#06b6d4" fill-opacity="0.12" stroke="#22d3ee" stroke-width="3"/>
      <text x="300" y="105" text-anchor="middle" fill="#f8fafc" font-size="14" font-weight="bold" font-family="Cairo, sans-serif">مثلث CIA الأمني</text>
      <rect x="215" y="10" width="170" height="28" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="300" y="29" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="bold" font-family="Cairo, sans-serif">1. السرية (Confidentiality)</text>
      <rect x="370" y="142" width="185" height="30" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>
      <text x="462" y="162" text-anchor="middle" fill="#34d399" font-size="13" font-weight="bold" font-family="Cairo, sans-serif">2. السلامة (Integrity)</text>
      <rect x="45" y="142" width="185" height="30" rx="6" fill="#451a03" stroke="#fbbf24" stroke-width="2"/>
      <text x="137" y="162" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="bold" font-family="Cairo, sans-serif">3. الركن الثالث: [ ؟؟؟ ]</text>
    </svg>
  `,
  firewallDiagram: `
    <svg viewBox="0 0 600 165" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="590" height="155" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <circle cx="95" cy="82" r="45" fill="#1e293b" stroke="#f43f5e" stroke-width="2"/>
      <text x="95" y="78" text-anchor="middle" fill="#fb7185" font-size="13" font-weight="bold" font-family="Cairo, sans-serif">شبكة الإنترنت</text>
      <text x="95" y="96" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Cairo, sans-serif">(خارجية غير موثوقة)</text>
      <path d="M145 65 L255 65" stroke="#10b981" stroke-width="3"/>
      <text x="200" y="56" text-anchor="middle" fill="#34d399" font-size="11" font-family="Cairo, sans-serif">حزم مسموحة ✓</text>
      <path d="M145 102 L255 102" stroke="#f43f5e" stroke-width="3" stroke-dasharray="4,4"/>
      <text x="200" y="120" text-anchor="middle" fill="#fb7185" font-size="11" font-family="Cairo, sans-serif">حزم خبيثة محظورة ✕</text>
      <rect x="265" y="25" width="65" height="115" rx="6" fill="#991b1b" stroke="#f87171" stroke-width="2.5"/>
      <line x1="265" y1="55" x2="330" y2="55" stroke="#fca5a5" stroke-width="2"/>
      <line x1="265" y1="85" x2="330" y2="85" stroke="#fca5a5" stroke-width="2"/>
      <line x1="265" y1="115" x2="330" y2="115" stroke="#fca5a5" stroke-width="2"/>
      <text x="297" y="153" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="bold" font-family="Cairo, sans-serif">[ ؟؟؟ ]</text>
      <path d="M335 65 L435 65" stroke="#10b981" stroke-width="3"/>
      <rect x="440" y="38" width="125" height="88" rx="10" fill="#064e3b" fill-opacity="0.35" stroke="#10b981" stroke-width="2"/>
      <text x="502" y="78" text-anchor="middle" fill="#34d399" font-size="13" font-weight="bold" font-family="Cairo, sans-serif">الشبكة الداخلية</text>
      <text x="502" y="98" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="monospace">(Trusted LAN)</text>
    </svg>
  `,
  mfaDiagram: `
    <svg viewBox="0 0 600 155" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="590" height="145" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <rect x="25" y="28" width="160" height="98" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <text x="105" y="60" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="bold" font-family="Cairo, sans-serif">1. شيء تعرفه</text>
      <text x="105" y="84" text-anchor="middle" fill="#e2e8f0" font-size="12" font-family="Cairo, sans-serif">كلمة المرور (Password)</text>
      <text x="105" y="106" text-anchor="middle" fill="#64748b" font-size="11" font-family="monospace">******</text>
      <text x="205" y="82" text-anchor="middle" fill="#fbbf24" font-size="22" font-weight="bold">+</text>
      <rect x="225" y="28" width="160" height="98" rx="10" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
      <text x="305" y="60" text-anchor="middle" fill="#34d399" font-size="14" font-weight="bold" font-family="Cairo, sans-serif">2. شيء تملكه</text>
      <text x="305" y="84" text-anchor="middle" fill="#e2e8f0" font-size="12" font-family="Cairo, sans-serif">رمز الهاتف المؤقت OTP</text>
      <text x="305" y="106" text-anchor="middle" fill="#34d399" font-size="11" font-family="monospace">482-910</text>
      <text x="405" y="82" text-anchor="middle" fill="#fbbf24" font-size="22" font-weight="bold">+</text>
      <rect x="425" y="28" width="150" height="98" rx="10" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
      <text x="500" y="60" text-anchor="middle" fill="#c084fc" font-size="14" font-weight="bold" font-family="Cairo, sans-serif">3. شيء يمثلك</text>
      <text x="500" y="84" text-anchor="middle" fill="#e2e8f0" font-size="12" font-family="Cairo, sans-serif">بصمة الإصبع أو الوجه</text>
      <text x="500" y="106" text-anchor="middle" fill="#c084fc" font-size="11" font-family="monospace">Biometrics</text>
    </svg>
  `
};

interface RawComptiaQuestion {
  id: number;
  domain: string;
  difficulty: string;
  text: string;
  svgKey?: string;
  visualCaption?: string;
  options: [string, string, string, string];
  correctOption: number;
  explanation: string;
}

const RAW_COMPTIA_QUESTIONS: RawComptiaQuestion[] = [
  {
    id: 1,
    domain: 'مفاهيم تقنية المعلومات',
    difficulty: 'متوسط',
    text: 'بالنظر إلى جدول الخانات الثنائية (Binary) الموضح في الشكل، ما هي القيمة العشرية (Decimal) المكافئة للرقم الثنائي 00101010؟',
    svgKey: 'binaryTable',
    visualCaption: 'تحويل العدد الثنائي 00101010 إلى النظام العشري',
    options: ['38', '42', '44', '50'],
    correctOption: 1,
    explanation: 'نجمع أوزان الخانات التي تحتوي على الرقم (1) فقط: 32 + 8 + 2 = 42.'
  },
  {
    id: 2,
    domain: 'مفاهيم تقنية المعلومات',
    difficulty: 'سهل',
    text: 'ما هي أصغر وحدة لتمثيل البيانات في الحاسوب، والتي تأخذ إحدى القيمتين (0 أو 1) فقط؟',
    options: ['البايت (Byte)', 'البت (Bit)', 'الكيلوبايت (Kilobyte)', 'الهيرتز (Hertz)'],
    correctOption: 1,
    explanation: 'البت (Bit - Binary Digit) هو أصغر وحدة بيانات في الحاسوب ويمثل 0 أو 1، بينما البايت (Byte) يتكون من 8 بتات.'
  },
  {
    id: 3,
    domain: 'مفاهيم تقنية المعلومات',
    difficulty: 'سهل',
    text: 'يمثل المخطط التالي دورة الحوسبة الأساسية (IPOS). ما هي المرحلة رقم (2) المفقودة التي يقوم بها المعالج (CPU) لتحويل البيانات المدخلة إلى معلومات مفيدة؟',
    svgKey: 'iposCycle',
    visualCaption: 'مخطط دورة الحوسبة الأساسية (Input - ? - Output - Storage)',
    options: ['الضغط (Compression)', 'المعالجة (Processing)', 'التشفير (Encryption)', 'النسخ الاحتياطي (Backup)'],
    correctOption: 1,
    explanation: 'دورة العمل الأساسية في الحاسوب تتكون من: الإدخال (Input)، ثم المعالجة (Processing) بواسطة CPU، ثم الإخراج (Output)، والتخزين (Storage).'
  },
  {
    id: 4,
    domain: 'مفاهيم تقنية المعلومات',
    difficulty: 'سهل',
    text: 'كم عدد البتات (Bits) الموجودة في بايت واحد (1 Byte) قياسي؟',
    options: ['4 بتات', '8 بتات', '16 بت', '1024 بت'],
    correctOption: 1,
    explanation: 'البايت الواحد (1 Byte) يتكون قياسياً من 8 بتات (8 Bits).'
  },
  {
    id: 5,
    domain: 'مفاهيم تقنية المعلومات',
    difficulty: 'متوسط',
    text: 'وفقاً لمنهجية CompTIA القياسية لاستكشاف الأخطاء وإصلاحها (Troubleshooting Methodology)، ما هي الخطوة الأولى التي يجب على الفني القيام بها عند الإبلاغ عن عطل؟',
    options: [
      'وضع نظرية للأسباب المحتملة فوراً',
      'تحديد المشكلة (Identify the problem) وجمع المعلومات من المستخدم',
      'استبدال قطع العتاد المشكوك فيها',
      'توثيق النتائج والحلول'
    ],
    correctOption: 1,
    explanation: 'الخطوة الأولى دائماً في منهجية CompTIA هي تحديد المشكلة (Identify the problem) عبر سؤال المستخدم ومراجعة الأعراض.'
  },
  {
    id: 6,
    domain: 'البنية التحتية والعتاد',
    difficulty: 'سهل',
    text: 'في الرسم التوضيحي لمنافذ العرض، ما هو اسم المنفذ رقم (ب) الذي ينقل الصوت والصورة الرقمية معاً بجودة عالية ويشيع استخدامه في الشاشات والتلفاز؟',
    svgKey: 'videoPorts',
    visualCaption: 'مقارنة أشكال منافذ العرض: (أ) VGA، (ب) ؟، (ج) DisplayPort',
    options: ['منفذ VGA التناظري', 'منفذ HDMI', 'منفذ DVI-D', 'منفذ PS/2'],
    correctOption: 1,
    explanation: 'المنفذ (ب) هو منفذ HDMI (High-Definition Multimedia Interface) الذي يتميز بحواف مشطوفة من الجانبين السفليين وينقل الصوت والصورة رقمياً.'
  },
  {
    id: 7,
    domain: 'مفاهيم تقنية المعلومات',
    difficulty: 'متوسط',
    text: 'أي نظام عدّ يستخدم الأرقام من (0 إلى 9) والحروف من (A إلى F) لتمثيل القيم ويُستخدم بكثرة في عناوين MAC وأكواد الألوان؟',
    options: [
      'النظام الثنائي (Binary)',
      'النظام العشري (Decimal)',
      'النظام السداسي عشري (Hexadecimal)',
      'النظام الثماني (Octal)'
    ],
    correctOption: 2,
    explanation: 'النظام السداسي عشري (Hexadecimal - Base 16) يستخدم 16 رمزاً: من 0-9 ومن A-F.'
  },
  {
    id: 8,
    domain: 'البنية التحتية والعتاد',
    difficulty: 'سهل',
    text: 'بالنظر إلى مخطط اللوحة الأم (Motherboard)، ما هي القطعة التي تركب في الشقوق الطولية المشار إليها بالرقم (2)؟',
    svgKey: 'motherboardDiagram',
    visualCaption: 'تخطيط المكونات الأساسية على اللوحة الأم (Motherboard)',
    options: [
      'شرائح ذاكرة الوصول العشوائي (RAM DIMMs)',
      'مزود الطاقة (Power Supply)',
      'القرص الصلب الميكانيكي (HDD)',
      'المشتت الحراري (Heat Sink)'
    ],
    correctOption: 0,
    explanation: 'الشقوق الطولية المتوازية رقم (2) المجاورة لمقبس المعالج هي شقوق DIMM المخصصة لتركيب ذاكرة الوصول العشوائي (RAM).'
  },
  {
    id: 9,
    domain: 'البنية التحتية والعتاد',
    difficulty: 'سهل',
    text: 'أي من الذاكرات التالية تُعد ذاكرة "متطايرة" (Volatile Memory) تفقد جميع بياناتها فور انقطاع التيار الكهربائي عن الحاسوب؟',
    options: [
      'القرص الصلب (SSD)',
      'ذاكرة الوصول العشوائي (RAM)',
      'ذاكرة القراءة فقط (ROM)',
      'محرك الفلاش (USB Flash Drive)'
    ],
    correctOption: 1,
    explanation: 'ذاكرة RAM هي ذاكرة مؤقتة متطايرة (Volatile) تحتفظ ببيانات البرامج قيد التشغيل فقط طالما الجهاز متصل بالكهرباء.'
  },
  {
    id: 10,
    domain: 'البنية التحتية والعتاد',
    difficulty: 'سهل',
    text: 'يوضح الشكل الفرق بين موصلين شهيرين. ما هو اسم الموصل (أ) ذو الـ 8 دبابيس نحاسية المستخدم في كابلات شبكات الإيثرنت (Ethernet LAN)؟',
    svgKey: 'rj45VsRj11',
    visualCaption: 'مقارنة بين موصل الشبكة (أ) وموصل الهاتف (ب)',
    options: ['RJ-11', 'RJ-45', 'Coaxial F-Connector', 'Thunderbolt'],
    correctOption: 1,
    explanation: 'الموصل (أ) هو RJ-45 (8P8C) ويحتوي على 8 دبابيس ويستخدم في كابلات الشبكات المحلية، بينما RJ-11 يستخدم في خطوط الهاتف.'
  },
  {
    id: 11,
    domain: 'البنية التحتية والعتاد',
    difficulty: 'متوسط',
    text: 'ما هي الوظيفة الأساسية لبرمجية BIOS أو UEFI المخزنة على اللوحة الأم عند تشغيل الحاسوب؟',
    options: [
      'حماية المتصفح من الإعلانات المنبثقة',
      'إجراء الفحص الذاتي للعتاد (POST) وتهيئة المكونات ثم تحميل نظام التشغيل',
      'تصميم قواعد البيانات العلائقية',
      'ترجمة صفحات HTML في المتصفح'
    ],
    correctOption: 1,
    explanation: 'يقوم BIOS/UEFI بإجراء فحص POST (Power-On Self-Test) للتأكد من سلامة العتاد ثم يبحث عن محمل الإقلاع لتشغيل نظام التشغيل.'
  },
  {
    id: 12,
    domain: 'البنية التحتية والعتاد',
    difficulty: 'سهل',
    text: 'بناءً على الرسم التوضيحي لوحدات التخزين، ما الذي يميز القرص (ب) من نوع SSD مقارنة بالقرص (أ) من نوع HDD؟',
    svgKey: 'ssdVsHdd',
    visualCaption: 'مقارنة التركيب الداخلي بين (أ) HDD و (ب) SSD',
    options: [
      'القرص (ب) أبطأ ويستهلك طاقة أكبر',
      'القرص (ب) لا يحتوي على أجزاء متحركة ويعتمد على شرائح فلاش لذلك هو أسرع وأكثر مقاومة للصدمات',
      'القرص (ب) يستخدم أقراصاً ممغنطة تدور بسرعة 7200 دورة في الدقيقة',
      'القرص (ب) يفقد البيانات عند إيقاف تشغيل الجهاز'
    ],
    correctOption: 1,
    explanation: 'أقراص الحالة الصلبة (SSD) تعتمد على شرائح ذاكرة NAND Flash ولا تحتوي على أجزاء ميكانيكية متحركة، مما يمنحها سرعة عالية ومقاومة للصدمات.'
  },
  {
    id: 13,
    domain: 'البنية التحتية والعتاد',
    difficulty: 'سهل',
    text: 'ما هي وظيفة مزود الطاقة (PSU - Power Supply Unit) في الحاسوب المكتبي؟',
    options: [
      'تحويل التيار المتردد (AC) القادم من الحائط إلى تيار مستمر (DC) منخفض الجهد لمكونات الحاسوب',
      'تخزين ملفات نظام التشغيل بشكل دائم',
      'معالجة الرسوميات ثلاثية الأبعاد',
      'توزيع عناوين IP للأجهزة المتصلة'
    ],
    correctOption: 0,
    explanation: 'يقوم مزود الطاقة (PSU) بتحويل التيار المتردد (AC) من مقبس الكهرباء إلى تيار مستمر (DC) بفولتيات مناسبة (مثل 3.3V, 5V, 12V) لتغذية قطع الحاسوب.'
  },
  {
    id: 14,
    domain: 'البنية التحتية والعتاد',
    difficulty: 'متوسط',
    text: 'ما هي وحدة قياس سرعة التردد أو الساعة (Clock Speed) للمعالج المركزي (CPU) الحديثة؟',
    options: ['الجيجابايت (Gigabyte - GB)', 'الجيجاهيرتز (Gigahertz - GHz)', 'الميجابكسل (Megapixel - MP)', 'الواط (Watt)'],
    correctOption: 1,
    explanation: 'تقاس سرعة المعالج بعدد الدورات في الثانية بوحدة الهيرتز، وفي المعالجات الحديثة تقاس بالجيجاهيرتز (GHz).'
  },
  {
    id: 15,
    domain: 'البنية التحتية والعتاد',
    difficulty: 'سهل',
    text: 'في الشكل المرفق لموصلات USB، ما هو اسم الموصل (ج) الذي يتميز بتصميم بيضاوي متماثل يمكن إدخاله من أي وجه (Reversible)؟',
    svgKey: 'usbConnectors',
    visualCaption: 'مقارنة أشكال موصلات الناقل التسلسلي العام (USB)',
    options: ['USB Type-A', 'USB Type-B', 'USB Type-C', 'Mini-USB'],
    correctOption: 2,
    explanation: 'الموصل (ج) هو USB Type-C الذي يتميز بقابليته للتوصيل من كلا الوجهين ودعمه لسرعات نقل بيانات وشحن طاقة عالية.'
  },
  {
    id: 16,
    domain: 'البنية التحتية والعتاد',
    difficulty: 'سهل',
    text: 'أي من الأجهزة الطرفية التالية يُصنف كجهاز "إدخال وإخراج معاً" (Input & Output Device)؟',
    options: [
      'لوحة المفاتيح القياسية (Keyboard)',
      'شاشة اللمس التفاعلية (Touchscreen)',
      'الميكروفون (Microphone)',
      'مكبر الصوت (Speaker)'
    ],
    correctOption: 1,
    explanation: 'شاشة اللمس (Touchscreen) تعرض الصورة للمستخدم (إخراج) وتستقبل نقرات اللمس منه (إخال) في آنٍ واحد.'
  },
  {
    id: 17,
    domain: 'البنية التحتية والعتاد',
    difficulty: 'متوسط',
    text: 'ما هي التقنية اللاسلكية قصيرة المدى جداً (عادة بضعة سنتيمترات) التي تُستخدم في الدفع الإلكتروني عبر الهواتف والبطاقات الذكية؟',
    options: ['Wi-Fi 6', 'NFC (الاتصال قريب المدى)', 'Satellite', 'Ethernet'],
    correctOption: 1,
    explanation: 'تقنية NFC (Near Field Communication) تعمل على مسافات قريبة جداً (أقل من 4 سم) وتُستخدم في أنظمة الدفع اللاتلامسي.'
  },
  {
    id: 18,
    domain: 'التطبيقات وأنظمة التشغيل',
    difficulty: 'متوسط',
    text: 'يوضح الشكل طبقات نظام التشغيل. ما هو المصطلح التقني للطبقة الوسطى الخضراء التي تمثل "قلب نظام التشغيل" المسؤول عن التواصل المباشر مع العتاد؟',
    svgKey: 'osLayers',
    visualCaption: 'مخطط الطبقات المعمارية لنظام التشغيل',
    options: [
      'المتصفح (Browser)',
      'النواة (Kernel)',
      'جدول البيانات (Spreadsheet)',
      'جدار الحماية (Firewall)'
    ],
    correctOption: 1,
    explanation: 'النواة (Kernel) هي الجزء الأساسي في نظام التشغيل الذي يدير موارد العتاد (CPU, RAM, I/O) ويربط البرمجيات بالمكونات المادية.'
  },
  {
    id: 19,
    domain: 'التطبيقات وأنظمة التشغيل',
    difficulty: 'سهل',
    text: 'أي من أنظمة التشغيل التالية يُعد نظاماً مفتوح المصدر (Open Source) شائع الاستخدام في الخوادم وأجهزة الشبكات؟',
    options: ['Microsoft Windows 11', 'Apple macOS', 'Linux (لينكس)', 'Apple iOS'],
    correctOption: 2,
    explanation: 'نظام Linux هو نظام تشغيل مفتوح المصدر (Open Source) يمكن الاطلاع على كوده المصدري وتعديله وتوزيعه مجاناً.'
  },
  {
    id: 20,
    domain: 'التطبيقات وأنظمة التشغيل',
    difficulty: 'متوسط',
    text: 'ما هو نظام الملفات (File System) الافتراضي والحديث الذي يعتمد عليه نظام التشغيل Microsoft Windows في الأقراص الداخلية ويدعم الصلاحيات الأمنية والتشفير؟',
    options: ['FAT16', 'NTFS', 'ext4', 'APFS'],
    correctOption: 1,
    explanation: 'نظام NTFS (New Technology File System) هو النظام الافتراضي لـ Windows، بينما ext4 خاص بلينكس و APFS خاص بأجهزة أبل.'
  },
  {
    id: 21,
    domain: 'التطبيقات وأنظمة التشغيل',
    difficulty: 'سهل',
    text: 'بالنظر إلى مسار الملف الموضح في الصورة، ما هو امتداد الملف (File Extension) الذي يحدد نوع الملف والبرنامج المناسب لفتحه؟',
    svgKey: 'filePathTree',
    visualCaption: 'تحليل مسار الملف في نظام التشغيل',
    options: ['C:\\', 'Projects', '.sql', 'Users'],
    correctOption: 2,
    explanation: 'الجزء الأخير بعد النقطة (.sql) هو امتداد الملف (File Extension) ويشير إلى أن الملف عبارة عن نص أوامر لغة SQL.'
  },
  {
    id: 22,
    domain: 'التطبيقات وأنظمة التشغيل',
    difficulty: 'سهل',
    text: 'ما هو البرنامج الصغير المتخصص الذي يُمكّن نظام التشغيل من التعرف على قطعة عتاد جديدة (مثل طابعة أو بطاقة شاشة) والتخاطب معها؟',
    options: [
      'برنامج التعريف (Device Driver)',
      'معالج النصوص (Word Processor)',
      'برنامج الضغط (File Archiver)',
      'محرك البحث (Search Engine)'
    ],
    correctOption: 0,
    explanation: 'برنامج التعريف (Device Driver) يعمل كمترجم بين نظام التشغيل وقطعة العتاد المادية.'
  },
  {
    id: 23,
    domain: 'التطبيقات وأنظمة التشغيل',
    difficulty: 'متوسط',
    text: 'ما هو نموذج الحوسبة السحابية الذي يقدم للمستخدم تطبيقاً جاهزاً للاستخدام مباشرة عبر المتصفح (مثل Google Docs أو Microsoft 365 Web) دون تثبيته محلياً؟',
    options: [
      'البرمجيات كخدمة (SaaS - Software as a Service)',
      'البنية التحتية كخدمة (IaaS)',
      'الذاكرة المؤقتة (Cache)',
      'الشبكة الشخصية (PAN)'
    ],
    correctOption: 0,
    explanation: 'نموذج SaaS (Software as a Service) يتيح للمستخدمين الوصول للتطبيقات عبر الإنترنت مباشرة عبر المتصفح.'
  },
  {
    id: 24,
    domain: 'مفاهيم تطوير البرمجيات',
    difficulty: 'سهل',
    text: 'في لغات البرمجة، ما هو نوع البيانات (Data Type) الأنسب لتخزين قيمة منطقية تحتمل "صواب أو خطأ" (True / False) كما في حقل isCorrect؟',
    options: [
      'Integer (عدد صحيح)',
      'Boolean (منطقي)',
      'Float (عدد عشري)',
      'Char (حرف واحد)'
    ],
    correctOption: 1,
    explanation: 'النوع المنطقي (Boolean) يخزن إحدى القيمتين فقط: True (صحيح) أو False (خاطئ).'
  },
  {
    id: 25,
    domain: 'مفاهيم تطوير البرمجيات',
    difficulty: 'سهل',
    text: 'يمثل المخطط الانسيابي (Flowchart) في الشكل اتخاذ قرار بناءً على شرط معين. أي من تراكيب البرمجة التالية يمثل هذا المنطق؟',
    svgKey: 'flowchartCondition',
    visualCaption: 'مخطط انسيابي لفحص شرط النجاح',
    options: [
      'الجمل الشرطية والتفرع (If / Else Conditional Branching)',
      'تعريف الثوابت (Constants)',
      'التعليقات البرمجية (Comments)',
      'استيراد المكتبات (Imports)'
    ],
    correctOption: 0,
    explanation: 'الشكل المعين في المخطط الانسيابي يمثل جملة شرطية (If / Else) توجه مسار البرنامج حسب تحقق الشرط (True أو False).'
  },
  {
    id: 26,
    domain: 'مفاهيم تطوير البرمجيات',
    difficulty: 'متوسط',
    text: 'ما هو التركيب البرمجي الذي يُستخدم لتكرار تنفيذ مجموعة من الأوامر عدة مرات طالما أن شرطاً معيناً ما زال محققاً؟',
    options: [
      'الحلقات التكرارية (Loops - مثل For و While)',
      'المتغيرات النصية (Strings)',
      'المترجمات (Compilers)',
      'المعرفات الفريدة (UUIDs)'
    ],
    correctOption: 0,
    explanation: 'الحلقات التكرارية (Loops) مثل For Loop و While Loop تُستخدم لتكرار كود معين دون الحاجة لإعادة كتابته.'
  },
  {
    id: 27,
    domain: 'مفاهيم تطوير البرمجيات',
    difficulty: 'سهل',
    text: 'في تطوير الويب، ما هي اللغة المسؤولة عن بناء الهيكل الأساسي وعناصر صفحة الويب (مثل العناوين، الفقرات، والجداول)؟',
    options: ['SQL', 'HTML (لغة توصيف النص الفائق)', 'BIOS', 'DHCP'],
    correctOption: 1,
    explanation: 'لغة HTML (HyperText Markup Language) هي اللغة القياسية لبناء هيكل ومحتوى صفحات الويب.'
  },
  {
    id: 28,
    domain: 'مفاهيم تطوير البرمجيات',
    difficulty: 'متوسط',
    text: 'بالاعتماد على الرسم التوضيحي للمصفوفة (Array) التي تبدأ فهرستها من الصفر (Zero-indexed)، ما هي القيمة المخزنة في العنصر grades[2]؟',
    svgKey: 'arrayIndexing',
    visualCaption: 'تمثيل عناصر المصفوفة وفهارسها في الذاكرة',
    options: ['75', '82', '95', '68'],
    correctOption: 2,
    explanation: 'بما أن الفهرسة تبدأ من 0: فإن grades[0]=75، و grades[1]=82، وبالتالي العنصر الثالث grades[2] قيمته 95.'
  },
  {
    id: 29,
    domain: 'أساسيات قواعد البيانات و SQL',
    difficulty: 'سهل',
    text: 'في قواعد البيانات العلائقية (Relational Databases)، ماذا يمثل "الصف الواحد" (Row) داخل الجدول؟',
    options: [
      'سجلاً واحداً متكاملاً (Record / Tuple) مثل محاولة طالب واحدة',
      'نوع بيانات العمود (Data Type)',
      'اسم قاعدة البيانات بالكامل',
      'كلمة مرور الخادم'
    ],
    correctOption: 0,
    explanation: 'الصف (Row) في الجدول العلائقي يُسمى سجلاً (Record)، بينما العمود (Column) يُسمى حقلاً (Field / Attribute).'
  },
  {
    id: 30,
    domain: 'أساسيات قواعد البيانات و SQL',
    difficulty: 'متوسط',
    text: 'في مخطط جدول نتائج الاختبار المرفق، الحقل quiz_id في جدول student_submissions يشير إلى الحقل id في جدول quizzes. ماذا يُسمى quiz_id في هذه الحالة؟',
    svgKey: 'relationalKeys',
    visualCaption: 'العلاقة بين جدول الكويزات وجدول تسليمات الطلاب',
    options: [
      'مفتاح أجنبي (Foreign Key)',
      'مفتاح عشوائي (Random Key)',
      'مفتاح تشفير (Encryption Key)',
      'فهرس نصي (Text Index)'
    ],
    correctOption: 0,
    explanation: 'المفتاح الأجنبي (Foreign Key) هو حقل في جدول يشير إلى المفتاح الأساسي (Primary Key) في جدول آخر لإنشاء علاقة ترابطية بينهما.'
  },
  {
    id: 31,
    domain: 'أساسيات قواعد البيانات و SQL',
    difficulty: 'سهل',
    text: 'أي من أوامر لغة SQL التالية يُستخدم لإضافة سجل جديد (صف جديد) داخل جدول student_submissions؟',
    options: [
      'SELECT * FROM student_submissions',
      'INSERT INTO student_submissions VALUES (...)',
      'DROP TABLE student_submissions',
      'DELETE FROM student_submissions'
    ],
    correctOption: 1,
    explanation: 'الأمر INSERT INTO هو أمر معالجة البيانات (DML) المخصص لإدراج صفوف جديدة في الجدول.'
  },
  {
    id: 32,
    domain: 'أساسيات قواعد البيانات و SQL',
    difficulty: 'سهل',
    text: 'ما هي نتيجة تنفيذ استعلام SQL الموضح في الشكل على جدول student_submissions؟',
    svgKey: 'sqlQueryVisual',
    visualCaption: 'استعلام SQL مع شرط تصفية WHERE',
    options: [
      'حذف جميع الطلاب الذين حصلوا على نسبة 85% فأعلى',
      'عرض أسماء ونسب وتقديرات الطلاب الذين حصلوا على نسبة 85% فأعلى فقط',
      'تعديل درجات جميع الطلاب لتصبح 85%',
      'إنشاء جدول جديد باسم percentage'
    ],
    correctOption: 1,
    explanation: 'الأمر SELECT يسترجع الحقول المحددة، وجملة WHERE percentage >= 85 تصفي النتائج لتعرض فقط من نسبتهم 85% فأكثر.'
  },
  {
    id: 33,
    domain: 'أساسيات قواعد البيانات و SQL',
    difficulty: 'متوسط',
    text: 'في هيكلية جدول student_submissions، ماذا يضمن القيد UNIQUE (quiz_id, student_id) في قاعدة البيانات؟',
    options: [
      'أن تكون درجة الطالب دائماً 100%',
      'منع نفس الطالب (student_id) من تسجيل أكثر من محاولة واحدة لنفس الاختبار (quiz_id)',
      'السماح بترك حقل اسم الطالب فارغاً (NULL)',
      'حذف الجدول تلقائياً بعد انتهاء الوقت'
    ],
    correctOption: 1,
    explanation: 'القيد المركب UNIQUE (quiz_id, student_id) يمنع تكرار نفس الزوج من معرف الاختبار والرقم الجامعي للطالب، مما يضمن محاولة واحدة لكل كويز.'
  },
  {
    id: 34,
    domain: 'أساسيات قواعد البيانات و SQL',
    difficulty: 'متوسط',
    text: 'في جدول student_submissions، تم تعريف الحقل answers بنوع البيانات JSONB. ما هي الميزة الرئيسية لهذا النوع؟',
    options: [
      'يقبل الأرقام الصحيحة السالبة فقط',
      'تخزين البيانات المهيكلة (كائنات ومصفوفات JSON) بصيغة ثنائية مفهرسة وسريعة الاستعلام',
      'يمنع قراءة البيانات من قبل المسؤول',
      'يستخدم لتخزين الملفات الصوتية فقط'
    ],
    correctOption: 1,
    explanation: 'نوع JSONB (Binary JSON) يخزن مصفوفات وكائنات JSON بكفاءة عالية مع دعم الفهرسة والبحث السريع داخل عناصر المصفوفة.'
  },
  {
    id: 35,
    domain: 'أمن المعلومات والشبكات',
    difficulty: 'سهل',
    text: 'يوضح الشكل مثلث أمن المعلومات الشهير (CIA Triad). إذا كان الضلع الأول هو السرية (Confidentiality) والثاني هو السلامة (Integrity)، فما هو الضلع الثالث المفقود؟',
    svgKey: 'ciaTriad',
    visualCaption: 'نموذج مثلث أمن المعلومات (CIA Triad)',
    options: [
      'التوافر / الإتاحة (Availability)',
      'الأتمتة (Automation)',
      'الافتراضية (Virtualization)',
      'التجميع (Aggregation)'
    ],
    correctOption: 0,
    explanation: 'مثلث CIA يتكون من: Confidentiality (السرية)، Integrity (سلامة البيانات)، و Availability (التوافر عند الحاجة).'
  },
  {
    id: 36,
    domain: 'أمن المعلومات والشبكات',
    difficulty: 'سهل',
    text: 'ما هو نوع الهجوم السيبراني الذي يعتمد على إرسال رسائل بريد إلكتروني مزيفة تبدو وكأنها من جهة موثوقة (مثل البنك أو الجامعة) لخداع المستخدم وسرقة بيانات دخوله؟',
    options: [
      'التصيد الاحتيالي (Phishing)',
      'إلغاء التجزئة (Defragmentation)',
      'النسخ الاحتياطي التفاضلي (Differential Backup)',
      'تعدد المهام (Multitasking)'
    ],
    correctOption: 0,
    explanation: 'التصيد الاحتيالي (Phishing) هو أحد أشهر أساليب الهندسة الاجتماعية لخداع المستخدمين وكشف كلمات المرور.'
  },
  {
    id: 37,
    domain: 'أمن المعلومات والشبكات',
    difficulty: 'سهل',
    text: 'في مخطط حماية الشبكة الموضح، ما هو النظام الأمني الذي يقع بين الإنترنت والشبكة الداخلية لمراقبة حركة البيانات وحظر الحزم غير المصرح بها؟',
    svgKey: 'firewallDiagram',
    visualCaption: 'تصفية حزم البيانات بين الشبكة الخارجية والداخلية',
    options: [
      'جدار الحماية (Firewall)',
      'الموزع البسيط (Hub)',
      'ذاكرة الكاش (Cache Memory)',
      'محول الطاقة (Inverter)'
    ],
    correctOption: 0,
    explanation: 'جدار الحماية (Firewall) يفحص حزم البيانات الواردة والصادرة ويسمح أو يحظر المرور بناءً على قواعد أمنية محددة.'
  },
  {
    id: 38,
    domain: 'أمن المعلومات والشبكات',
    difficulty: 'متوسط',
    text: 'ما هو الفرق الجوهري بين "المصادقة" (Authentication) و"التفويض" (Authorization) في أمن الأنظمة؟',
    options: [
      'لا يوجد فرق بينهما نهائياً',
      'المصادقة تتحقق من هوية المستخدم (من أنت؟)، بينما التفويض يحدد الصلاحيات المسموحة له بعد دخوله (ماذا يحق لك فعله؟)',
      'المصادقة خاصة بالطابعات، والتفويض خاص بالشاشات',
      'التفويض يتم قبل كتابة اسم المستخدم دائماً'
    ],
    correctOption: 1,
    explanation: 'المصادقة (Authentication) تتأكد من الهوية (مثل اسم المستخدم وكلمة المرور)، ثم يأتي التفويض (Authorization) لتحديد الصلاحيات.'
  },
  {
    id: 39,
    domain: 'أمن المعلومات والشبكات',
    difficulty: 'سهل',
    text: 'يوضح الشكل الجمع بين كلمة المرور، ورمز الهاتف OTP، وبصمة الإصبع لتسجيل الدخول. ماذا تُسمى هذه الآلية الأمنية؟',
    svgKey: 'mfaDiagram',
    visualCaption: 'عوامل التحقق المتعددة لتأمين الحسابات',
    options: [
      'المصادقة متعددة العوامل (MFA - Multi-Factor Authentication)',
      'التصفح المتخفي (Incognito Mode)',
      'البرمجيات الإعلانية (Adware)',
      'بروتوكول نقل الملفات (FTP)'
    ],
    correctOption: 0,
    explanation: 'المصادقة متعددة العوامل (MFA) تتطلب عاملين أو أكثر من فئات مختلفة (شيء تعرفه + شيء تملكه + شيء يمثلك) لتعزيز الأمان.'
  },
  {
    id: 40,
    domain: 'أمن المعلومات والشبكات',
    difficulty: 'متوسط',
    text: 'ما هو نوع البرمجيات الخبيثة (Malware) الذي يقوم بتشفير ملفات الضحية بالكامل ويطالب بدفع مبلغ مالي مقابل مفتاح فك التشفير؟',
    options: [
      'برمجيات الفدية (Ransomware)',
      'ملفات تعريف الارتباط (Cookies)',
      'برامج تشغيل العتاد (Drivers)',
      'الجداول المحورية (Pivot Tables)'
    ],
    correctOption: 0,
    explanation: 'برمجيات الفدية (Ransomware) تشفر بيانات النظام أو القرص وتطالب بفدية مالية لإعادة الوصول إليها.'
  }
];

// Deterministic balanced answer distribution across أ (0), ب (1), ج (2), د (3)
const COMPTIA_TARGET_SLOTS: number[] = [
  1, 2, 0, 3, 1, 2, 3, 0, 2, 1,
  3, 1, 0, 2, 3, 1, 0, 2, 3, 0,
  2, 3, 1, 0, 3, 2, 1, 0, 3, 1,
  2, 0, 3, 1, 2, 0, 3, 1, 2, 0
];

function redistributeOptions(
  options: [string, string, string, string],
  originalCorrect: number,
  targetCorrect: number
): [string, string, string, string] {
  const correctText = options[originalCorrect];
  const distractors = options.filter((_, idx) => idx !== originalCorrect);
  const result: string[] = [];
  let dIdx = 0;

  for (let i = 0; i < 4; i++) {
    if (i === targetCorrect) {
      result.push(correctText);
    } else {
      result.push(distractors[dIdx++]);
    }
  }

  return [result[0], result[1], result[2], result[3]];
}

export const COMPTIA_ITF_QUESTIONS: QuizQuestion[] = RAW_COMPTIA_QUESTIONS.map((q, idx) => {
  const targetSlot = COMPTIA_TARGET_SLOTS[idx % COMPTIA_TARGET_SLOTS.length];
  const balancedOptions = redistributeOptions(q.options, q.correctOption, targetSlot);

  const customSvg = q.svgKey ? COMPTIA_SVG_DIAGRAMS[q.svgKey] : '';
  const fallbackVisual = generateContextualQuestionSvg(q.text, idx);

  return {
    id: q.id,
    question: q.text,
    svg: customSvg || fallbackVisual.svg,
    caption: q.visualCaption || `${q.domain} — ${fallbackVisual.caption}`,
    options: balancedOptions,
    correct: targetSlot,
    explanation: q.explanation
  };
});

export function buildComptiaQuiz(isActive = true): QuizDefinition {
  return {
    id: THIRD_QUIZ_ID,
    title: 'اختبار CompTIA IT Fundamentals الشامل (40 سؤالاً)',
    description:
      'يغطي المفاهيم الأساسية لتقنية المعلومات، العتاد والمنافذ، أنظمة التشغيل، البرمجة، قواعد البيانات و SQL، وأمن المعلومات (40 سؤالاً)',
    createdAt: new Date().toISOString(),
    isActive,
    questions: COMPTIA_ITF_QUESTIONS
  };
}
