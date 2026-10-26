/**
 * Generates topic-accurate technical SVG illustrations (500x200 dark slate theme)
 * for quiz questions that do not embed their own custom SVG.
 * Never leaks the answer while providing a clear visual representation of the question's concept.
 */

export interface ContextualVisual {
  svg: string;
  caption: string;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateContextualQuestionSvg(
  questionText: string,
  idx: number
): ContextualVisual {
  const q = questionText.toLowerCase();

  // 1. Subnet Mask / IPv4 Class C
  if (q.includes('subnet mask') || q.includes('قناع') || q.includes('class c') || q.includes('ipv4')) {
    return {
      caption: 'بنية عنوان الشبكة وقناع الشبكة الفرعية في بروتوكول IPv4',
      svg: `<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="200" rx="16" fill="#0f172a"/>
        <rect x="35" y="25" width="430" height="150" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="250" y="52" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="15">IPv4 ADDRESSING &amp; SUBNET MASK</text>
        <g font-family="monospace" font-weight="bold" font-size="16">
          <rect x="65" y="72" width="82" height="42" rx="6" fill="#0284c7"/><text x="106" y="98" text-anchor="middle" fill="#fff">192</text>
          <text x="155" y="98" text-anchor="middle" fill="#38bdf8">.</text>
          <rect x="163" y="72" width="82" height="42" rx="6" fill="#0284c7"/><text x="204" y="98" text-anchor="middle" fill="#fff">168</text>
          <text x="253" y="98" text-anchor="middle" fill="#38bdf8">.</text>
          <rect x="261" y="72" width="82" height="42" rx="6" fill="#0284c7"/><text x="302" y="98" text-anchor="middle" fill="#fff">1</text>
          <text x="351" y="98" text-anchor="middle" fill="#38bdf8">.</text>
          <rect x="359" y="72" width="76" height="42" rx="6" fill="#0f172a" stroke="#facc15" stroke-width="2"/><text x="397" y="98" text-anchor="middle" fill="#facc15">HOST</text>
        </g>
        <text x="204" y="138" text-anchor="middle" fill="#7dd3fc" font-size="12" font-weight="bold">معرف الشبكة (Network ID)</text>
        <text x="397" y="138" text-anchor="middle" fill="#fde047" font-size="12" font-weight="bold">معرف الجهاز</text>
        <text x="250" y="162" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="12">Subnet Mask: ??? . ??? . ??? . ???</text>
      </svg>`
    };
  }

  // 2. CMD / ipconfig / flushdns / gpupdate / tracert
  if (
    q.includes('cmd') ||
    q.includes('موجه أوامر') ||
    q.includes('flushdns') ||
    q.includes('مسار الكامل') ||
    q.includes('tracert') ||
    q.includes('فرض تطبيق سياسات') ||
    q.includes('gpupdate')
  ) {
    const promptLine = q.includes('dns')
      ? 'C:\\Windows\\System32&gt; [ DNS Cache Command ]'
      : q.includes('مسار')
      ? 'C:\\Windows\\System32&gt; [ Trace Hops Command ] 8.8.8.8'
      : 'C:\\Windows\\System32&gt; [ Refresh Group Policy Command ]';
    return {
      caption: 'نافذة موجه الأوامر (Command Prompt) في نظام Windows',
      svg: `<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="200" rx="16" fill="#0f172a"/>
        <rect x="45" y="18" width="410" height="164" rx="10" fill="#090d16" stroke="#475569" stroke-width="2.5"/>
        <rect x="45" y="18" width="410" height="28" rx="10" fill="#1e293b"/>
        <circle cx="68" cy="32" r="5" fill="#ef4444"/>
        <circle cx="84" cy="32" r="5" fill="#f59e0b"/>
        <circle cx="100" cy="32" r="5" fill="#22c55e"/>
        <text x="250" y="36" text-anchor="middle" fill="#cbd5e1" font-family="monospace" font-size="11" font-weight="bold">Administrator: Command Prompt (CMD)</text>
        <text x="65" y="74" fill="#94a3b8" font-family="monospace" font-size="12">Microsoft Windows [Version 10.0.19045]</text>
        <text x="65" y="104" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="13">${promptLine}</text>
        <rect x="65" y="122" width="370" height="38" rx="6" fill="#1e293b" stroke="#334155"/>
        <text x="250" y="145" text-anchor="middle" fill="#22c55e" font-family="monospace" font-size="12">Executing network / system diagnostic utility...</text>
      </svg>`
    };
  }

  // 3. Linux CLI (chmod, df -h, permissions, disk space)
  if (q.includes('linux') || q.includes('صلاحيات الملفات') || q.includes('المساحة المستهلكة')) {
    const cmdHint = q.includes('صلاحيات')
      ? 'root@linux-srv:~# [ command ] 755 script.sh'
      : 'root@linux-srv:~# [ disk-usage-command ]';
    return {
      caption: 'طرفية أوامر نظام التشغيل Linux (Bash Shell)',
      svg: `<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="200" rx="16" fill="#0f172a"/>
        <rect x="45" y="18" width="410" height="164" rx="10" fill="#090d16" stroke="#10b981" stroke-width="2"/>
        <rect x="45" y="18" width="410" height="28" rx="10" fill="#064e3b"/>
        <text x="250" y="36" text-anchor="middle" fill="#ecfdf5" font-family="monospace" font-size="12" font-weight="bold">Linux Terminal — bash (tty1)</text>
        <text x="65" y="78" fill="#34d399" font-family="monospace" font-weight="bold" font-size="13">${cmdHint}</text>
        <text x="65" y="110" fill="#94a3b8" font-family="monospace" font-size="12">-rwxr-xr-x  1 root root  4.0K Oct 26  /var/www</text>
        <text x="65" y="135" fill="#38bdf8" font-family="monospace" font-size="12">/dev/sda1        50G   18G   32G  36% /</text>
      </svg>`
    };
  }

  // 4. DNS Server / Preferred DNS
  if (q.includes('dns')) {
    return {
      caption: 'آلية عمل خادم DNS في الشبكة',
      svg: `<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="200" rx="16" fill="#0f172a"/>
        <rect x="35" y="55" width="135" height="90" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
        <text x="102" y="92" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">جهاز العميل</text>
        <text x="102" y="115" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="11">Client PC</text>
        <path d="M180 85 H310" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6 4"/>
        <polygon points="310,85 298,79 298,91" fill="#38bdf8"/>
        <path d="M310 115 H180" stroke="#10b981" stroke-width="3" stroke-dasharray="6 4"/>
        <polygon points="180,115 192,109 192,121" fill="#10b981"/>
        <text x="245" y="75" text-anchor="middle" fill="#bae6fd" font-family="monospace" font-size="11">Query: domain.com</text>
        <text x="245" y="135" text-anchor="middle" fill="#6ee7b7" font-family="monospace" font-size="11">Response: 93.184.216.34</text>
        <rect x="325" y="45" width="140" height="110" rx="12" fill="#1e293b" stroke="#10b981" stroke-width="2.5"/>
        <text x="395" y="88" text-anchor="middle" fill="#10b981" font-family="monospace" font-weight="bold" font-size="18">DNS SERVER</text>
        <text x="395" y="115" text-anchor="middle" fill="#cbd5e1" font-size="12">خادم النطاقات</text>
      </svg>`
    };
  }

  // 5. DHCP (DORA)
  if (q.includes('dhcp') || q.includes('dora')) {
    return {
      caption: 'المراحل الأربع لتخصيص عناوين IP عبر خادم DHCP',
      svg: `<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="200" rx="16" fill="#0f172a"/>
        <rect x="40" y="35" width="110" height="130" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="95" y="95" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">DHCP Client</text>
        <text x="95" y="118" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="11">0.0.0.0</text>
        <rect x="350" y="35" width="110" height="130" rx="10" fill="#1e293b" stroke="#facc15" stroke-width="2"/>
        <text x="405" y="95" text-anchor="middle" fill="#fff" font-weight="bold" font-size="14">DHCP Server</text>
        <text x="405" y="118" text-anchor="middle" fill="#facc15" font-family="monospace" font-size="11">Pool: 192.168.1.x</text>
        <g font-family="monospace" font-weight="bold" font-size="12">
          <line x1="165" y1="55" x2="335" y2="55" stroke="#38bdf8" stroke-width="2"/><text x="250" y="49" text-anchor="middle" fill="#38bdf8">1. Step D ---&gt;</text>
          <line x1="165" y1="88" x2="335" y2="88" stroke="#facc15" stroke-width="2"/><text x="250" y="82" text-anchor="middle" fill="#facc15">&lt;--- 2. Step O</text>
          <line x1="165" y1="121" x2="335" y2="121" stroke="#38bdf8" stroke-width="2"/><text x="250" y="115" text-anchor="middle" fill="#38bdf8">3. Step R ---&gt;</text>
          <line x1="165" y1="154" x2="335" y2="154" stroke="#10b981" stroke-width="2"/><text x="250" y="148" text-anchor="middle" fill="#10b981">&lt;--- 4. Step A</text>
        </g>
      </svg>`
    };
  }

  // 6. NVMe SSD vs SATA SSD / File Systems (NTFS, FAT32, MBR, GPT, UEFI)
  if (
    q.includes('nvme') ||
    q.includes('نظام الملفات') ||
    q.includes('fat32') ||
    q.includes('mbr') ||
    q.includes('uefi')
  ) {
    return {
      caption: 'وحدات التخزين وأنظمة تقسيم وإقلاع الأقراص',
      svg: `<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="200" rx="16" fill="#0f172a"/>
        <rect x="45" y="35" width="410" height="130" rx="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
        <rect x="70" y="62" width="110" height="76" rx="8" fill="#090d16" stroke="#0284c7" stroke-width="2"/>
        <text x="125" y="96" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="15">STORAGE</text>
        <text x="125" y="118" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="11">SSD / DISK</text>
        <g font-family="sans-serif" font-weight="bold" font-size="13" fill="#e2e8f0">
          <text x="315" y="80" text-anchor="middle">تقنيات التخزين وأنظمة الملفات</text>
          <text x="315" y="108" text-anchor="middle" fill="#facc15" font-family="monospace">PCIe / SATA · GPT / MBR</text>
          <text x="315" y="132" text-anchor="middle" fill="#34d399" font-family="monospace">NTFS · FAT32 · exFAT</text>
        </g>
      </svg>`
    };
  }

  // 7. OSI Model Layers (Router, Switch, TCP Segment, Presentation Layer)
  if (
    q.includes('osi') ||
    q.includes('طبقة') ||
    q.includes('router') ||
    q.includes('switch') ||
    q.includes('pdu') ||
    q.includes('tcp')
  ) {
    return {
      caption: 'الطبقات السبع في نموذج الشبكات القياسي OSI Model',
      svg: `<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="200" rx="16" fill="#0f172a"/>
        <g font-family="monospace" font-weight="bold" font-size="11" text-anchor="middle">
          <rect x="90" y="16" width="320" height="21" rx="4" fill="#1e293b" stroke="#38bdf8"/><text x="250" y="30" fill="#e2e8f0">Layer 7: Application</text>
          <rect x="90" y="40" width="320" height="21" rx="4" fill="#1e293b" stroke="#38bdf8"/><text x="250" y="54" fill="#e2e8f0">Layer 6: Presentation</text>
          <rect x="90" y="64" width="320" height="21" rx="4" fill="#1e293b" stroke="#38bdf8"/><text x="250" y="78" fill="#e2e8f0">Layer 5: Session</text>
          <rect x="90" y="88" width="320" height="21" rx="4" fill="#0284c7"/><text x="250" y="102" fill="#ffffff">Layer 4: Transport (TCP / UDP)</text>
          <rect x="90" y="112" width="320" height="21" rx="4" fill="#0369a1"/><text x="250" y="126" fill="#ffffff">Layer 3: Network (IP / Routers)</text>
          <rect x="90" y="136" width="320" height="21" rx="4" fill="#1e293b" stroke="#38bdf8"/><text x="250" y="150" fill="#e2e8f0">Layer 2: Data Link (MAC / Switches)</text>
          <rect x="90" y="160" width="320" height="21" rx="4" fill="#1e293b" stroke="#38bdf8"/><text x="250" y="174" fill="#e2e8f0">Layer 1: Physical (Cables / Bits)</text>
        </g>
      </svg>`
    };
  }

  // 8. Network Ports & Protocols (RDP, SSH, SMTP)
  if (
    q.includes('منفذ') ||
    q.includes('port') ||
    q.includes('rdp') ||
    q.includes('ssh') ||
    q.includes('بروتوكول') ||
    q.includes('البريد الإلكتروني')
  ) {
    return {
      caption: 'بروتوكولات ومنافذ الاتصال الشبكي القياسية (Network Ports & Protocols)',
      svg: `<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="200" rx="16" fill="#0f172a"/>
        <rect x="45" y="35" width="410" height="130" rx="14" fill="#1e293b" stroke="#10b981" stroke-width="2.5"/>
        <circle cx="115" cy="100" r="38" fill="#064e3b" stroke="#10b981" stroke-width="3"/>
        <text x="115" y="96" text-anchor="middle" fill="#34d399" font-family="monospace" font-weight="bold" font-size="14">PORT</text>
        <text x="115" y="116" text-anchor="middle" fill="#facc15" font-family="monospace" font-weight="bold" font-size="14">TCP/IP</text>
        <text x="305" y="82" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="15">بروتوكولات الاتصال الآمن والخوادم</text>
        <text x="305" y="110" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="13">SSH · RDP · HTTPS · SMTP · IMAP</text>
        <text x="305" y="136" text-anchor="middle" fill="#94a3b8" font-size="12">تشفير الجلسات ونقل البيانات بين الأجهزة</text>
      </svg>`
    };
  }

  // 9. Patch Panel / T568B / Cabling
  if (q.includes('patch panel') || q.includes('t568b') || q.includes('كابلات الشبكة')) {
    return {
      caption: 'البنية التحتية لكابلات الشبكة ومعايير التوصيل القياسية',
      svg: `<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="200" rx="16" fill="#0f172a"/>
        <rect x="40" y="45" width="420" height="110" rx="10" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
        <text x="250" y="75" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="15">STRUCTURED CABLING &amp; RJ-45 PATCH PANEL</text>
        <g fill="#090d16" stroke="#94a3b8" stroke-width="1.5">
          <rect x="70" y="95" width="36" height="32" rx="4"/>
          <rect x="116" y="95" width="36" height="32" rx="4"/>
          <rect x="162" y="95" width="36" height="32" rx="4"/>
          <rect x="208" y="95" width="36" height="32" rx="4"/>
          <rect x="254" y="95" width="36" height="32" rx="4"/>
          <rect x="300" y="95" width="36" height="32" rx="4"/>
          <rect x="346" y="95" width="36" height="32" rx="4"/>
          <rect x="392" y="95" width="36" height="32" rx="4"/>
        </g>
        <text x="250" y="145" text-anchor="middle" fill="#facc15" font-family="monospace" font-size="11">Port 01   Port 02   Port 03   Port 04   Port 05   Port 06   Port 07   Port 08</text>
      </svg>`
    };
  }

  // 10. Windows Server / Active Directory / OU / Share Permissions / Hypervisor
  if (
    q.includes('windows server') ||
    q.includes('active directory') ||
    q.includes('الدومين') ||
    q.includes('share') ||
    q.includes('المجلد المشترك') ||
    q.includes('hypervisor') ||
    q.includes('طابعة')
  ) {
    return {
      caption: 'إدارة الخوادم وخدمات الدومين والموارد المشتركة في الشبكة',
      svg: `<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="200" rx="16" fill="#0f172a"/>
        <rect x="55" y="30" width="130" height="140" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
        <rect x="75" y="50" width="90" height="22" rx="4" fill="#090d16"/>
        <circle cx="150" cy="61" r="4" fill="#22c55e"/>
        <rect x="75" y="82" width="90" height="22" rx="4" fill="#090d16"/>
        <circle cx="150" cy="93" r="4" fill="#22c55e"/>
        <rect x="75" y="114" width="90" height="22" rx="4" fill="#090d16"/>
        <circle cx="150" cy="125" r="4" fill="#38bdf8"/>
        <text x="120" y="156" text-anchor="middle" fill="#cbd5e1" font-family="monospace" font-weight="bold" font-size="11">SERVER RACK</text>
        <rect x="215" y="45" width="235" height="110" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <text x="332" y="82" text-anchor="middle" fill="#38bdf8" font-weight="bold" font-size="15">إدارة أنظمة الخوادم والشبكات</text>
        <text x="332" y="108" text-anchor="middle" fill="#facc15" font-family="monospace" font-size="12">AD DS · GPO · SMB Shares</text>
        <text x="332" y="132" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="11">Virtualization &amp; Print Services</text>
      </svg>`
    };
  }

  // Generic clean technical card for any other question
  const shortSnippet = escapeXml(
    questionText.length > 52 ? questionText.slice(0, 52) + '...' : questionText
  );
  return {
    caption: `بطاقة السؤال التقني رقم ${idx + 1}`,
    svg: `<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="500" height="200" rx="16" fill="#0f172a"/>
      <rect x="35" y="28" width="430" height="144" rx="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="250" cy="75" r="24" fill="#0284c7" fill-opacity="0.25" stroke="#38bdf8" stroke-width="2"/>
      <text x="250" y="82" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-weight="bold" font-size="18">Q${idx + 1}</text>
      <text x="250" y="128" text-anchor="middle" fill="#e2e8f0" font-family="sans-serif" font-weight="bold" font-size="13">${shortSnippet}</text>
      <text x="250" y="152" text-anchor="middle" fill="#94a3b8" font-size="11">اختر الإجابة الصحيحة من الخيارات الأربعة أدناه</text>
    </svg>`
  };
}
