import type { QuizQuestion } from '../types/quiz.ts';

export const ARABIC_LETTERS = ['أ', 'ب', 'ج', 'د'] as const;

export const svgIllustrations: Record<string, string> = {
  biosChip: `
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="200" rx="16" fill="#0f172a"/>
      <!-- Motherboard PCB Traces -->
      <path d="M30 40 H150 L180 70 M30 100 H140 M30 160 H150 L180 130 M470 40 H350 L320 70 M470 100 H360 M470 160 H350 L320 130" stroke="#1e293b" stroke-width="3" fill="none"/>
      <!-- Metallic Pins -->
      <g fill="#94a3b8">
        <rect x="165" y="52" width="20" height="8" rx="2"/>
        <rect x="165" y="76" width="20" height="8" rx="2"/>
        <rect x="165" y="100" width="20" height="8" rx="2"/>
        <rect x="165" y="124" width="20" height="8" rx="2"/>
        <rect x="165" y="148" width="20" height="8" rx="2"/>
        <rect x="315" y="52" width="20" height="8" rx="2"/>
        <rect x="315" y="76" width="20" height="8" rx="2"/>
        <rect x="315" y="100" width="20" height="8" rx="2"/>
        <rect x="315" y="124" width="20" height="8" rx="2"/>
        <rect x="315" y="148" width="20" height="8" rx="2"/>
      </g>
      <!-- BIOS Chip Body -->
      <rect x="180" y="35" width="140" height="135" rx="8" fill="#1e293b" stroke="#475569" stroke-width="3"/>
      <circle cx="200" cy="55" r="6" fill="#0f172a"/>
      <text x="250" y="95" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="24">BIOS</text>
      <text x="250" y="120" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12">ROM FIRMWARE</text>
      <rect x="205" y="135" width="90" height="12" rx="4" fill="#0f172a"/>
      <text x="250" y="144" text-anchor="middle" fill="#facc15" font-family="monospace" font-size="9">POST &amp; BOOT</text>
    </svg>`,

  uefiGui: `
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="200" rx="16" fill="#0f172a"/>
      <!-- Monitor Frame -->
      <rect x="85" y="15" width="330" height="170" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <!-- Top Header -->
      <rect x="95" y="25" width="310" height="26" rx="5" fill="#0284c7"/>
      <text x="115" y="42" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="12">UEFI BIOS Utility - EZ Mode</text>
      <circle cx="388" cy="38" r="6" fill="#38bdf8"/>
      <!-- Dashboard Widgets -->
      <rect x="95" y="58" width="145" height="65" rx="6" fill="#0f172a" stroke="#334155"/>
      <text x="167" y="75" text-anchor="middle" fill="#94a3b8" font-size="10">حرارة المعالج CPU</text>
      <circle cx="167" cy="100" r="16" fill="none" stroke="#22c55e" stroke-width="4"/>
      <text x="167" y="104" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="bold">42°C</text>

      <rect x="250" y="58" width="155" height="65" rx="6" fill="#0f172a" stroke="#334155"/>
      <text x="327" y="75" text-anchor="middle" fill="#94a3b8" font-size="10">ترتيب الإقلاع (سحب وإفلات)</text>
      <rect x="265" y="85" width="35" height="25" rx="4" fill="#0369a1"/>
      <text x="282" y="101" text-anchor="middle" fill="#fff" font-size="9">SSD</text>
      <rect x="310" y="85" width="35" height="25" rx="4" fill="#334155"/>
      <text x="327" y="101" text-anchor="middle" fill="#fff" font-size="9">USB</text>
      <rect x="355" y="85" width="35" height="25" rx="4" fill="#334155"/>
      <text x="372" y="101" text-anchor="middle" fill="#fff" font-size="9">DVD</text>

      <!-- Bottom Bar -->
      <rect x="95" y="132" width="310" height="40" rx="6" fill="#0f172a" stroke="#334155"/>
      <rect x="110" y="142" width="80" height="20" rx="4" fill="#10b981"/>
      <text x="150" y="156" text-anchor="middle" fill="#0f172a" font-weight="bold" font-size="10">حفظ وخروج</text>

      <!-- Mouse Cursor Highlight -->
      <g transform="translate(285, 98)">
        <circle cx="5" cy="5" r="18" fill="#facc15" fill-opacity="0.25"/>
        <polygon points="0,0 0,22 6,17 11,26 15,24 10,15 17,15" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>
      </g>
    </svg>`,

  hdmiPort: `
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="200" rx="16" fill="#0f172a"/>
      <!-- Outer Metal Shield (HDMI D-Bevel Shape) -->
      <polygon points="120,55 380,55 380,110 350,145 150,145 120,110" fill="#334155" stroke="#94a3b8" stroke-width="6" stroke-linejoin="round"/>
      <polygon points="132,65 368,65 368,106 343,135 157,135 132,106" fill="#090d16"/>
      <!-- Center Pin Tongue -->
      <rect x="155" y="92" width="190" height="14" rx="2" fill="#1e293b"/>
      <!-- 19 Gold Pins -->
      <g fill="#facc15">
        <rect x="162" y="88" width="12" height="5" rx="1"/>
        <rect x="182" y="88" width="12" height="5" rx="1"/>
        <rect x="202" y="88" width="12" height="5" rx="1"/>
        <rect x="222" y="88" width="12" height="5" rx="1"/>
        <rect x="242" y="88" width="12" height="5" rx="1"/>
        <rect x="262" y="88" width="12" height="5" rx="1"/>
        <rect x="282" y="88" width="12" height="5" rx="1"/>
        <rect x="302" y="88" width="12" height="5" rx="1"/>
        <rect x="322" y="88" width="12" height="5" rx="1"/>
        <!-- Bottom row pins -->
        <rect x="172" y="105" width="12" height="5" rx="1"/>
        <rect x="192" y="105" width="12" height="5" rx="1"/>
        <rect x="212" y="105" width="12" height="5" rx="1"/>
        <rect x="232" y="105" width="12" height="5" rx="1"/>
        <rect x="252" y="105" width="12" height="5" rx="1"/>
        <rect x="272" y="105" width="12" height="5" rx="1"/>
        <rect x="292" y="105" width="12" height="5" rx="1"/>
        <rect x="312" y="105" width="12" height="5" rx="1"/>
      </g>
      <text x="250" y="36" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-weight="bold" font-size="15">منفذ رقمي لنقل الصورة والصوت معاً (19 سنّاً)</text>
      <text x="250" y="178" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="16">HIGH-DEFINITION MULTIMEDIA</text>
    </svg>`,

  sataPort: `
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="200" rx="16" fill="#0f172a"/>
      <!-- Motherboard SATA Header -->
      <rect x="135" y="50" width="230" height="95" rx="8" fill="#1e293b" stroke="#64748b" stroke-width="4"/>
      <rect x="150" y="62" width="200" height="70" fill="#090d16"/>
      <!-- Characteristic L-Shaped Tongue -->
      <path d="M 175 88 H 315 V 102 H 192 V 122 H 175 Z" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
      <!-- 7 Gold Contacts on L-Tongue -->
      <g fill="#facc15">
        <rect x="202" y="83" width="10" height="6" rx="1"/>
        <rect x="218" y="83" width="10" height="6" rx="1"/>
        <rect x="234" y="83" width="10" height="6" rx="1"/>
        <rect x="250" y="83" width="10" height="6" rx="1"/>
        <rect x="266" y="83" width="10" height="6" rx="1"/>
        <rect x="282" y="83" width="10" height="6" rx="1"/>
        <rect x="298" y="83" width="10" height="6" rx="1"/>
      </g>
      <text x="250" y="35" text-anchor="middle" fill="#e2e8f0" font-size="14" font-weight="bold">منفذ تخزين داخلي بتصميم حرف (L) المميز (7 أسنان)</text>
      <text x="250" y="175" text-anchor="middle" fill="#f87171" font-family="monospace" font-weight="bold" font-size="16">HDD / SSD STORAGE PORT</text>
    </svg>`,

  cmosBattery: `
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="200" rx="16" fill="#0f172a"/>
      <!-- PCB Background Lines -->
      <circle cx="250" cy="100" r="82" fill="#1e293b" stroke="#475569" stroke-width="4"/>
      <!-- Black Plastic Socket Retainer Clips -->
      <rect x="160" y="85" width="18" height="30" rx="3" fill="#090d16"/>
      <rect x="322" y="85" width="18" height="30" rx="3" fill="#090d16"/>
      <rect x="235" y="168" width="30" height="16" rx="3" fill="#cbd5e1"/>
      <!-- Metallic Silver Coin Cell -->
      <defs>
        <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="50%" stop-color="#cbd5e1"/>
          <stop offset="100%" stop-color="#64748b"/>
        </linearGradient>
      </defs>
      <circle cx="250" cy="100" r="66" fill="url(#coinGrad)" stroke="#e2e8f0" stroke-width="3"/>
      <circle cx="250" cy="100" r="58" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 2"/>
      <!-- Plus Sign & Markings -->
      <text x="250" y="72" text-anchor="middle" fill="#334155" font-family="monospace" font-weight="bold" font-size="26">+</text>
      <text x="250" y="105" text-anchor="middle" fill="#1e293b" font-family="monospace" font-weight="bold" font-size="22">CR2032</text>
      <text x="250" y="128" text-anchor="middle" fill="#334155" font-family="sans-serif" font-weight="bold" font-size="12">LITHIUM 3V</text>
      <text x="250" y="145" text-anchor="middle" fill="#475569" font-family="monospace" font-size="10">CMOS BATTERY</text>
    </svg>`,

  usbC: `
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="200" rx="16" fill="#0f172a"/>
      <!-- Symmetrical Oval Outer Shell -->
      <rect x="125" y="60" width="250" height="80" rx="40" fill="#475569" stroke="#cbd5e1" stroke-width="6"/>
      <rect x="137" y="72" width="226" height="56" rx="28" fill="#090d16"/>
      <!-- Central Reversible Tongue -->
      <rect x="165" y="93" width="170" height="14" rx="7" fill="#334155" stroke="#64748b" stroke-width="1.5"/>
      <!-- Top & Bottom Symmetrical Gold Pins (12 each side) -->
      <g fill="#facc15">
        <rect x="178" y="88" width="8" height="5" rx="1"/>
        <rect x="191" y="88" width="8" height="5" rx="1"/>
        <rect x="204" y="88" width="8" height="5" rx="1"/>
        <rect x="217" y="88" width="8" height="5" rx="1"/>
        <rect x="230" y="88" width="8" height="5" rx="1"/>
        <rect x="243" y="88" width="8" height="5" rx="1"/>
        <rect x="256" y="88" width="8" height="5" rx="1"/>
        <rect x="269" y="88" width="8" height="5" rx="1"/>
        <rect x="282" y="88" width="8" height="5" rx="1"/>
        <rect x="295" y="88" width="8" height="5" rx="1"/>
        <rect x="308" y="88" width="8" height="5" rx="1"/>
        <!-- Bottom symmetrical pins -->
        <rect x="178" y="107" width="8" height="5" rx="1"/>
        <rect x="191" y="107" width="8" height="5" rx="1"/>
        <rect x="204" y="107" width="8" height="5" rx="1"/>
        <rect x="217" y="107" width="8" height="5" rx="1"/>
        <rect x="230" y="107" width="8" height="5" rx="1"/>
        <rect x="243" y="107" width="8" height="5" rx="1"/>
        <rect x="256" y="107" width="8" height="5" rx="1"/>
        <rect x="269" y="107" width="8" height="5" rx="1"/>
        <rect x="282" y="107" width="8" height="5" rx="1"/>
        <rect x="295" y="107" width="8" height="5" rx="1"/>
        <rect x="308" y="107" width="8" height="5" rx="1"/>
      </g>
      <!-- Reversible Arrows -->
      <path d="M85 80 C65 100, 65 100, 85 120" stroke="#38bdf8" stroke-width="3" fill="none"/>
      <polygon points="85,75 92,85 78,85" fill="#38bdf8"/>
      <polygon points="85,125 92,115 78,115" fill="#38bdf8"/>
      <text x="250" y="38" text-anchor="middle" fill="#38bdf8" font-size="15" font-weight="bold">تصميم بيضاوي متماثل تماماً (24 سنّاً)</text>
      <text x="250" y="175" text-anchor="middle" fill="#cbd5e1" font-family="monospace" font-size="15">USB TYPE-C REVERSIBLE</text>
    </svg>`,

  secureBoot: `
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="200" rx="16" fill="#0f172a"/>
      <!-- Glow Circle -->
      <circle cx="250" cy="100" r="75" fill="#10b981" fill-opacity="0.1"/>
      <!-- Security Shield -->
      <path d="M250 25 L320 52 V102 C320 145 250 175 250 175 C250 175 180 145 180 102 V52 L250 25 Z" fill="#065f46" stroke="#10b981" stroke-width="4"/>
      <!-- Padlock inside Shield -->
      <rect x="230" y="92" width="40" height="34" rx="5" fill="#facc15"/>
      <path d="M238 92 V78 C238 68 262 68 262 78 V92" stroke="#facc15" stroke-width="5" fill="none"/>
      <circle cx="250" cy="107" r="4" fill="#0f172a"/>
      <rect x="248" y="109" width="4" height="9" fill="#0f172a"/>
      <!-- Labels -->
      <rect x="70" y="82" width="85" height="32" rx="6" fill="#1e293b" stroke="#10b981"/>
      <text x="112" y="102" text-anchor="middle" fill="#34d399" font-size="11" font-weight="bold">توقيع موثوق ✓</text>
      <rect x="345" y="82" width="85" height="32" rx="6" fill="#1e293b" stroke="#ef4444"/>
      <text x="387" y="102" text-anchor="middle" fill="#f87171" font-size="11" font-weight="bold">حظر الفيروسات ✕</text>
    </svg>`,

  rj45Ethernet: `
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="200" rx="16" fill="#0f172a"/>
      <!-- Ethernet Port Wall Jack + Plug -->
      <rect x="155" y="30" width="190" height="140" rx="12" fill="#1e293b" stroke="#64748b" stroke-width="4"/>
      <!-- Inner Jack Cutout with Top Clip Notch -->
      <polygon points="180,65 225,65 225,48 275,48 275,65 320,65 320,145 180,145" fill="#090d16" stroke="#475569" stroke-width="2"/>
      <!-- Status LEDs -->
      <rect x="182" y="46" width="24" height="10" rx="2" fill="#22c55e"/>
      <rect x="294" y="46" width="24" height="10" rx="2" fill="#f59e0b"/>
      <!-- 8 Gold Contacts (8P8C) -->
      <g fill="#facc15">
        <rect x="195" y="115" width="8" height="24" rx="1"/>
        <rect x="210" y="115" width="8" height="24" rx="1"/>
        <rect x="225" y="115" width="8" height="24" rx="1"/>
        <rect x="240" y="115" width="8" height="24" rx="1"/>
        <rect x="255" y="115" width="8" height="24" rx="1"/>
        <rect x="270" y="115" width="8" height="24" rx="1"/>
        <rect x="285" y="115" width="8" height="24" rx="1"/>
        <rect x="300" y="115" width="8" height="24" rx="1"/>
      </g>
      <text x="250" y="188" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="14">8P8C NETWORK CONNECTOR (LAN)</text>
    </svg>`,

  bootKeys: `
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="200" rx="16" fill="#0f172a"/>
      <!-- Keycap 1: DEL -->
      <g transform="translate(105, 45)">
        <rect x="0" y="8" width="120" height="105" rx="14" fill="#334155"/>
        <rect x="6" y="0" width="108" height="95" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
        <text x="60" y="55" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="28">Delete</text>
        <text x="60" y="78" text-anchor="middle" fill="#94a3b8" font-size="11">زر الحذف</text>
      </g>
      <text x="250" y="105" text-anchor="middle" fill="#64748b" font-weight="bold" font-size="20">أو</text>
      <!-- Keycap 2: F2 -->
      <g transform="translate(275, 45)">
        <rect x="0" y="8" width="120" height="105" rx="14" fill="#334155"/>
        <rect x="6" y="0" width="108" height="95" rx="12" fill="#1e293b" stroke="#facc15" stroke-width="3"/>
        <text x="60" y="55" text-anchor="middle" fill="#facc15" font-family="monospace" font-weight="bold" font-size="30">F2</text>
        <text x="60" y="78" text-anchor="middle" fill="#94a3b8" font-size="11">مفتاح وظيفي</text>
      </g>
      <text x="250" y="182" text-anchor="middle" fill="#cbd5e1" font-size="13">يتم الضغط عليها بشكل متكرر فور تشغيل زر الطاقة</text>
    </svg>`,

  atx24Pin: `
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="200" rx="16" fill="#0f172a"/>
      <!-- Latch Clip on Top -->
      <rect x="220" y="32" width="60" height="16" rx="3" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
      <!-- 24-Pin Housing Block -->
      <rect x="65" y="48" width="370" height="95" rx="6" fill="#1e293b" stroke="#cbd5e1" stroke-width="3"/>
      <!-- 2 Rows x 12 Pins Grid -->
      <g fill="#090d16" stroke="#64748b" stroke-width="1.5">
        <!-- Row 1 (12 pins) -->
        <rect x="78" y="58" width="24" height="32" rx="3"/><circle cx="90" cy="74" r="4" fill="#facc15"/>
        <rect x="107" y="58" width="24" height="32" rx="3"/><circle cx="119" cy="74" r="4" fill="#facc15"/>
        <rect x="136" y="58" width="24" height="32" rx="3"/><circle cx="148" cy="74" r="4" fill="#facc15"/>
        <rect x="165" y="58" width="24" height="32" rx="3"/><circle cx="177" cy="74" r="4" fill="#facc15"/>
        <rect x="194" y="58" width="24" height="32" rx="3"/><circle cx="206" cy="74" r="4" fill="#facc15"/>
        <rect x="223" y="58" width="24" height="32" rx="3"/><circle cx="235" cy="74" r="4" fill="#facc15"/>
        <rect x="252" y="58" width="24" height="32" rx="3"/><circle cx="264" cy="74" r="4" fill="#facc15"/>
        <rect x="281" y="58" width="24" height="32" rx="3"/><circle cx="293" cy="74" r="4" fill="#facc15"/>
        <rect x="310" y="58" width="24" height="32" rx="3"/><circle cx="322" cy="74" r="4" fill="#facc15"/>
        <rect x="339" y="58" width="24" height="32" rx="3"/><circle cx="351" cy="74" r="4" fill="#facc15"/>
        <!-- 20+4 Split Line -->
        <line x1="366" y1="48" x2="366" y2="143" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 2"/>
        <rect x="370" y="58" width="24" height="32" rx="3"/><circle cx="382" cy="74" r="4" fill="#facc15"/>
        <rect x="399" y="58" width="24" height="32" rx="3"/><circle cx="411" cy="74" r="4" fill="#facc15"/>

        <!-- Row 2 (12 pins) -->
        <rect x="78" y="98" width="24" height="32" rx="3"/><circle cx="90" cy="114" r="4" fill="#facc15"/>
        <rect x="107" y="98" width="24" height="32" rx="3"/><circle cx="119" cy="114" r="4" fill="#facc15"/>
        <rect x="136" y="98" width="24" height="32" rx="3"/><circle cx="148" cy="114" r="4" fill="#facc15"/>
        <rect x="165" y="98" width="24" height="32" rx="3"/><circle cx="177" cy="114" r="4" fill="#facc15"/>
        <rect x="194" y="98" width="24" height="32" rx="3"/><circle cx="206" cy="114" r="4" fill="#facc15"/>
        <rect x="223" y="98" width="24" height="32" rx="3"/><circle cx="235" cy="114" r="4" fill="#facc15"/>
        <rect x="252" y="98" width="24" height="32" rx="3"/><circle cx="264" cy="114" r="4" fill="#facc15"/>
        <rect x="281" y="98" width="24" height="32" rx="3"/><circle cx="293" cy="114" r="4" fill="#facc15"/>
        <rect x="310" y="98" width="24" height="32" rx="3"/><circle cx="322" cy="114" r="4" fill="#facc15"/>
        <rect x="339" y="98" width="24" height="32" rx="3"/><circle cx="351" cy="114" r="4" fill="#facc15"/>
        <rect x="370" y="98" width="24" height="32" rx="3"/><circle cx="382" cy="114" r="4" fill="#facc15"/>
        <rect x="399" y="98" width="24" height="32" rx="3"/><circle cx="411" cy="114" r="4" fill="#facc15"/>
      </g>
      <text x="250" y="175" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="14">24-PIN (20+4) MAIN POWER CONNECTOR</text>
    </svg>`,

  legacyBiosScreen: `
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="200" rx="16" fill="#0f172a"/>
      <!-- Classic Blue Screen Monitor -->
      <rect x="75" y="12" width="350" height="176" rx="6" fill="#0000aa" stroke="#94a3b8" stroke-width="4"/>
      <rect x="83" y="20" width="334" height="160" fill="none" stroke="#ffffff" stroke-width="1.5"/>
      <!-- Top Title -->
      <text x="250" y="36" text-anchor="middle" fill="#ffff55" font-family="monospace" font-weight="bold" font-size="12">CMOS SETUP UTILITY - STANDARD BIOS</text>
      <line x1="83" y1="43" x2="417" y2="43" stroke="#ffffff" stroke-width="1"/>
      <!-- Text Items -->
      <text x="95" y="62" fill="#ffffff" font-family="monospace" font-size="11">System Time         [13:25:10]</text>
      <text x="95" y="80" fill="#ffffff" font-family="monospace" font-size="11">System Date         [Sun, Oct 25 2026]</text>
      <rect x="92" y="89" width="215" height="15" fill="#aa0000"/>
      <text x="95" y="100" fill="#ffff55" font-family="monospace" font-size="11">&gt; Primary Master    [Hard Disk]</text>
      <text x="95" y="118" fill="#ffffff" font-family="monospace" font-size="11">&gt; Primary Slave     [None]</text>
      <text x="95" y="136" fill="#ffffff" font-family="monospace" font-size="11">&gt; Boot Sequence     [A, C, CD-ROM]</text>
      <!-- Bottom Legend -->
      <line x1="83" y1="152" x2="417" y2="152" stroke="#ffffff" stroke-width="1"/>
      <text x="250" y="168" text-anchor="middle" fill="#ffff55" font-family="monospace" font-size="10">↑↓→←:Move   Enter:Select   F10:Save   ESC:Exit</text>
    </svg>`,

  hdmiCablePlug: `
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="200" rx="16" fill="#0f172a"/>
      <!-- Back of Monitor / PC Panel -->
      <rect x="40" y="30" width="160" height="140" rx="8" fill="#1e293b" stroke="#475569" stroke-width="3"/>
      <text x="120" y="65" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-weight="bold" font-size="16">HDMI</text>
      <polygon points="75,80 165,80 165,105 152,120 88,120 75,105" fill="#090d16" stroke="#cbd5e1" stroke-width="3"/>
      <rect x="92" y="97" width="56" height="6" fill="#facc15"/>

      <!-- Connection Arrow -->
      <path d="M235 100 H185" stroke="#38bdf8" stroke-width="4" stroke-dasharray="5 3"/>
      <polygon points="185,100 197,93 197,107" fill="#38bdf8"/>

      <!-- Gold-Plated HDMI Male Connector & Black Cable -->
      <polygon points="250,78 295,78 295,122 250,122" fill="#facc15" stroke="#eab308" stroke-width="2"/>
      <line x1="262" y1="88" x2="282" y2="88" stroke="#713f12" stroke-width="3"/>
      <line x1="262" y1="112" x2="282" y2="112" stroke="#713f12" stroke-width="3"/>
      <!-- Connector Grip Housing -->
      <rect x="295" y="65" width="95" height="70" rx="8" fill="#334155" stroke="#64748b" stroke-width="2"/>
      <text x="342" y="105" text-anchor="middle" fill="#f8fafc" font-family="monospace" font-weight="bold" font-size="16">HDMI</text>
      <!-- Cable Tail -->
      <rect x="390" y="85" width="80" height="30" fill="#1e293b"/>
    </svg>`,

  redSataCable: `
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="200" rx="16" fill="#0f172a"/>
      <!-- Flat Red SATA Cable -->
      <path d="M30 80 H230 V125 H30 Z" fill="#dc2626" stroke="#ef4444" stroke-width="2"/>
      <text x="125" y="108" text-anchor="middle" fill="#fecaca" font-family="monospace" font-weight="bold" font-size="15">SERIAL ATA 6Gb/s</text>

      <!-- Black Connector Head with Metal Clip -->
      <rect x="225" y="62" width="105" height="80" rx="6" fill="#1e293b" stroke="#475569" stroke-width="3"/>
      <!-- Silver Locking Latch -->
      <rect x="248" y="75" width="55" height="22" rx="3" fill="#cbd5e1"/>
      <!-- L-Shaped Tip Output -->
      <rect x="330" y="74" width="45" height="56" rx="3" fill="#090d16" stroke="#64748b" stroke-width="2"/>
      <path d="M342 84 H368 V116 H358 V94 H342 Z" fill="#facc15"/>
      <text x="425" y="100" text-anchor="middle" fill="#38bdf8" font-weight="bold" font-size="14">رأس بشكل</text>
      <text x="425" y="122" text-anchor="middle" fill="#facc15" font-weight="bold" font-size="20">حرف L</text>
    </svg>`,

  postCheck: `
    <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="200" rx="16" fill="#0f172a"/>
      <!-- Diagnostic Checklist Screen -->
      <rect x="90" y="20" width="320" height="160" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
      <text x="250" y="48" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="16">POST: POWER-ON SELF-TEST</text>
      <line x1="115" y1="58" x2="385" y2="58" stroke="#334155" stroke-width="2"/>

      <!-- Check Items -->
      <g font-family="monospace" font-size="13">
        <circle cx="135" cy="82" r="8" fill="#22c55e"/>
        <text x="135" y="86" text-anchor="middle" fill="#0f172a" font-weight="bold">✓</text>
        <text x="365" y="86" text-anchor="end" fill="#e2e8f0">CPU Processor Check ...... OK</text>

        <circle cx="135" cy="112" r="8" fill="#22c55e"/>
        <text x="135" y="116" text-anchor="middle" fill="#0f172a" font-weight="bold">✓</text>
        <text x="365" y="116" text-anchor="end" fill="#e2e8f0">RAM Memory Test .......... OK</text>

        <circle cx="135" cy="142" r="8" fill="#22c55e"/>
        <text x="135" y="146" text-anchor="middle" fill="#0f172a" font-weight="bold">✓</text>
        <text x="365" y="146" text-anchor="end" fill="#e2e8f0">VGA &amp; Keyboard Init ...... OK</text>
      </g>
    </svg>`
};

/**
 * 14 Questions with fixed, balanced distribution of correct answers across (أ=0, ب=1, ج=2, د=3)
 * No dynamic shuffling at runtime so every student sees the exact same option order.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "ما هي الوظيفة الأساسية لنظام BIOS في جهاز الحاسوب عند تشغيله؟",
    svg: svgIllustrations.biosChip,
    caption: "شريحة BIOS الثابتة المثبتة على اللوحة الأم",
    options: [
      "تصميم الصور والرسومات ثلاثية الأبعاد",
      "بدء فحص العتاد وإقلاع نظام التشغيل",
      "تصفح مواقع الإنترنت وتحميل الملفات",
      "تبريد المعالج ومنع ارتفاع حرارته"
    ],
    correct: 1, // ب
    explanation: "يقوم نظام BIOS فور الضغط على زر التشغيل بفحص سلامة القطع الأساسية ثم تحميل نظام التشغيل (مثل ويندوز) من القرص الصلب إلى الذاكرة."
  },
  {
    id: 2,
    question: "ما هي الميزة الأبرز التي يقدمها نظام UEFI الحديث كبديل متطور لنظام BIOS التقليدي؟",
    svg: svgIllustrations.uefiGui,
    caption: "واجهة UEFI الرسومية الحديثة وتدعم مؤشر الفأرة",
    options: [
      "يعمل بدون الحاجة إلى وجود لوحة أم أو معالج",
      "يمنع توصيل أي شاشة خارجية بالحاسوب",
      "واجهة رسومية حديثة تدعم استخدام الفأرة والأقراص الكبيرة",
      "يقتصر عمله على تشغيل الصوتيات فقط"
    ],
    correct: 2, // ج
    explanation: "يتميز UEFI بواجهة رسومية ملونة وسهلة الاستخدام تدعم التحكم بالفأرة، بالإضافة إلى دعم الأقراص الصلبة التي تزيد سعتها عن 2.2 تيرابايت."
  },
  {
    id: 3,
    question: "أي من هذه الموصلات يُستخدم بشكل شائع لتوصيل الشاشة أو التلفاز بالحاسوب لنقل الصورة والصوت الرقمي معاً بكابل واحد؟",
    svg: svgIllustrations.hdmiPort,
    caption: "منفذ العرض الرقمي عالي الدقة ذو 19 سنّاً",
    options: [
      "HDMI",
      "RJ-45",
      "SATA",
      "PS/2"
    ],
    correct: 0, // أ
    explanation: "منفذ HDMI (High-Definition Multimedia Interface) هو المعيار الأشهر لنقل الفيديو عالي الدقة والصوت الرقمي معاً عبر كابل واحد."
  },
  {
    id: 4,
    question: "ما هو المنفذ القياسي الموجود على اللوحة الأم والمستخدم لتوصيل الأقراص الصلبة الداخلية (HDD أو SSD)؟",
    svg: svgIllustrations.sataPort,
    caption: "منفذ توصيل وحدات التخزين الداخلي على اللوحة الأم",
    options: [
      "VGA",
      "Ethernet",
      "Audio Jack",
      "SATA"
    ],
    correct: 3, // د
    explanation: "منفذ SATA (Serial ATA) هو المنفذ القياسي المخصص لربط محركات الأقراص الصلبة (HDD) وأقراص الحالة الصلبة (SATA SSD) باللوحة الأم."
  },
  {
    id: 5,
    question: "ما هو الاختصار الذي تشير إليه عملية الفحص الذاتي للمكونات فور تشغيل الحاسوب وقبل ظهور شعار النظام؟",
    svg: svgIllustrations.postCheck,
    caption: "عملية الفحص الذاتي للعتاد (المعالج، الذاكرة، البطاقة الرسومية)",
    options: [
      "HTML (HyperText Markup Language)",
      "POST (Power-On Self-Test)",
      "HTTP (HyperText Transfer Protocol)",
      "WIFI (Wireless Fidelity)"
    ],
    correct: 1, // ب
    explanation: "عملية POST هي اختبار ذاتي يجريه الـ BIOS/UEFI فور وصول التيار الكهربائي للتأكد من وجود وسلامة المعالج والرامات ولوحة المفاتيح والشاشة."
  },
  {
    id: 6,
    question: "ما هي الميزة الرئيسية لمنفذ USB من النوع C (USB Type-C) مقارنة بالأنواع القديمة؟",
    svg: svgIllustrations.usbC,
    caption: "منفذ USB-C البيضاوي المتماثل",
    options: [
      "حجمه كبير جداً ولا يركب إلا في الطابعات القديمة",
      "ينقل الصوت التناظري فقط ولا ينقل البيانات",
      "يتطلب إيقاف تشغيل الحاسوب قبل توصيله",
      "إمكانية إدخال القابس بأي اتجاه (متماثل الوجهين) دون خطأ"
    ],
    correct: 3, // د
    explanation: "يتميز موصل USB Type-C بتصميمه البيضاوي المتماثل (Reversible)، مما يتيح للمستخدم تركيبه من أي وجه بسهولة مع سرعات عالية لنقل البيانات والطاقة."
  },
  {
    id: 7,
    question: "ما هو الهدف من خاصية الإقلاع الآمن (Secure Boot) في أنظمة UEFI الحديثة؟",
    svg: svgIllustrations.secureBoot,
    caption: "حماية عملية الإقلاع من البرمجيات الخبيثة غير الموثوقة",
    options: [
      "زيادة سرعة مروحة المعالج إلى أقصى حد",
      "حذف جميع الصور والملفات الشخصية تلقائياً",
      "منع تشغيل البرمجيات الخبيثة أو الأنظمة غير الموثوقة أثناء بدء التشغيل",
      "إلغاء كلمة مرور حساب المستخدم في ويندوز"
    ],
    correct: 2, // ج
    explanation: "تتحقق ميزة Secure Boot من التوقيع الرقمي لملفات الإقلاع، مما يمنع الفيروسات والبرمجيات الخبيثة (Rootkits) من العمل قبل تحميل نظام التشغيل."
  },
  {
    id: 8,
    question: "أي من هذه الموصلات يُستخدم تقليدياً لربط كابل شبكة الإنترنت السلكي بجهاز الحاسوب؟",
    svg: svgIllustrations.rj45Ethernet,
    caption: "منفذ الشبكة السلكية ذو الـ 8 أطراف نحاسية",
    options: [
      "RJ-45 (Ethernet)",
      "HDMI",
      "DVI",
      "Molex"
    ],
    correct: 0, // أ
    explanation: "موصل RJ-45 هو القابس القياسي لكابلات الشبكة المحلية السلكية (Ethernet / LAN) ويحتوي على 8 دبابيس نحاسية ومشبك بلاستيكي للتثبيت."
  },
  {
    id: 9,
    question: "كيف يدخل المستخدم عادةً إلى شاشة إعدادات BIOS أو UEFI عند بدء تشغيل الحاسوب؟",
    svg: svgIllustrations.bootKeys,
    caption: "المفاتيح الأكثر شيوعاً للدخول إلى إعدادات اللوحة الأم",
    options: [
      "من خلال فتح متصفح الإنترنت وكتابة موقع جوجل",
      "عن طريق فصل كابل الشاشة وإعادة تركيبه",
      "بالضغط على زر إيقاف التشغيل لمدة 10 ثوانٍ",
      "بالضغط المتكرر على زر محدد (مثل Delete أو F2) فور بدء التشغيل"
    ],
    correct: 3, // د
    explanation: "للدخول إلى إعدادات BIOS/UEFI يتم الضغط المتكرر على مفتاح مخصص يحدده مصنّع اللوحة الأم (وأشهرها Delete أو F2 أو F12) لحظة تشغيل الجهاز."
  },
  {
    id: 10,
    question: "ما هو الكابل المسؤول عن إمداد اللوحة الأم بمعظم الطاقة الكهربائية اللازمة من مزود الطاقة (PSU)؟",
    svg: svgIllustrations.atx24Pin,
    caption: "موصل الطاقة الرئيسي للوحة الأم المكوّن من 24 سنّاً",
    options: [
      "كابل الصوت 3.5 ملم",
      "كابل ATX الرئيسي ذو 24 سنّاً (24-Pin)",
      "كابل الشاشة VGA",
      "كابل الشبكة RJ-11"
    ],
    correct: 1, // ب
    explanation: "موصل الطاقة ATX المكوّن من 24 سنّاً (أحياناً يأتي بتصميم 20+4) هو أضخم موصل على اللوحة الأم ويزودها بالتيار الكهربائي الرئيسي."
  },
  {
    id: 11,
    question: "بالنظر إلى الشكل التوضيحي للبطارية الدائرية (CR2032) المثبتة على اللوحة الأم، ما هي المهمة الرئيسية لهذه البطارية؟",
    svg: svgIllustrations.cmosBattery,
    caption: "بطارية الليثيوم المعدنية (CMOS CR2032) بجهد 3 فولت على اللوحة الأم",
    options: [
      "الحفاظ على إعدادات BIOS والوقت والتاريخ عند فصل الكهرباء عن الجهاز",
      "تشغيل شاشة الحاسوب عند انقطاع التيار الكهربائي المنزلي",
      "تبريد شريحة المعالج الرسومي أثناء الألعاب",
      "تخزين الأفلام والألعاب الكبيرة بدلاً من القرص الصلب"
    ],
    correct: 0, // أ
    explanation: "تزود بطارية CMOS شريحة الذاكرة وساعة الوقت الفعلي (RTC) بطاقة مستمرة ليبقى التاريخ والوقت وإعدادات BIOS محفوظة حتى بعد فصل القابس الكهربائي."
  },
  {
    id: 12,
    question: "يُظهر الرسم التوضيحي أدناه شاشة زرقاء نصية كلاسيكية يتم التنقل فيها بلوحة المفاتيح فقط دون فأرة. ماذا تمثل هذه الشاشة؟",
    svg: svgIllustrations.legacyBiosScreen,
    caption: "واجهة الإعدادات الكلاسيكية ذات الخلفية الزرقاء والنصوص الصفراء والبيضاء",
    options: [
      "واجهة UEFI الرسومية ثلاثية الأبعاد",
      "شاشة سطح المكتب في نظام Windows 11",
      "نظام BIOS التقليدي القديم (Legacy BIOS)",
      "واجهة تطبيق تحرير الصور والفيديو"
    ],
    correct: 2, // ج
    explanation: "الشاشة الزرقاء النصية البسيطة التي تعتمد كلياً على الأسهم ومفاتيح الوظائف (F1-F10) هي السمة الكلاسيكية لنظام BIOS التقليدي (Legacy BIOS)."
  },
  {
    id: 13,
    question: "يظهر في الرسم التوضيحي كابل ومنفذ معدني ذو حواف مشطوفة شائع جداً في الشاشات وأجهزة اللابتوب. ما اسم هذا الموصل؟",
    svg: svgIllustrations.hdmiCablePlug,
    caption: "توصيل كابل العرض الرقمي بمنفذه المطابق خلف الجهاز",
    options: [
      "موصل الطاقة الثلاثي",
      "موصل ومنفذ HDMI عالي الدقة",
      "منفذ البطاقة الصوتية التناظري",
      "موصل المودم الهاتفي القديم"
    ],
    correct: 1, // ب
    explanation: "هذا التصميم المميز ذو الحليتين الجانبيتين المائلتين هو موصل ومنفذ HDMI القياسي لنقل الفيديو والصوت الرقمي."
  },
  {
    id: 14,
    question: "يظهر في الشكل التوضيحي كابل داخلي أحمر مسطح ينتهي برأس أسود بداخله مجرى على شكل حرف (L). فيمَ يُستخدم هذا الكابل؟",
    svg: svgIllustrations.redSataCable,
    caption: "كابل البيانات الداخلي ذو الطرف المصمم على شكل حرف L لمنع التركيب الخاطئ",
    options: [
      "كابل توصيل السماعات الخارجية ومضخم الصوت",
      "كابل تغذية المعالج المركزي بالطاقة 8-Pin",
      "كابل ربط الطابعة الخارجية عبر منفذ USB",
      "كابل بيانات SATA لتوصيل الأقراص الصلبة (HDD / SSD) باللوحة الأم"
    ],
    correct: 3, // د
    explanation: "كابل بيانات SATA يتميز بلونه المسطح (غالباً أحمر أو أسود) وتصميمه الداخلي على شكل حرف L لضمان تركيبه بالاتجاه الصحيح دائماً بين القرص الصلب واللوحة الأم."
  }
];

export function evaluateGrade(percentage: number): { grade: string; feedback: string } {
  if (percentage >= 85) {
    return {
      grade: "ممتاز",
      feedback: "أداء رائع جداً! لقد أتقنت أساسيات BIOS و UEFI وأنواع الموصلات بامتياز."
    };
  }
  if (percentage >= 70) {
    return {
      grade: "جيد جداً",
      feedback: "مستوى جميل جداً! لديك معرفة أساسية قوية بمكونات الحاسوب والمنافذ."
    };
  }
  if (percentage >= 50) {
    return {
      grade: "مقبول",
      feedback: "نتيجة مقبولة، يمكنك مراجعة التوضيحات العلمية بالأسفل لتعزيز فهمك لبعض الموصلات."
    };
  }
  return {
    grade: "يحتاج مراجعة",
    feedback: "راجع الشروحات العلمية المرفقة تحت كل سؤال لتثبيت المعلومات الأساسية حول BIOS والموصلات."
  };
}
