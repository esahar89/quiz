import type { QuizDefinition, QuizQuestion } from '../types/quiz.ts';
import { COMPTIA_SVG_DIAGRAMS } from './comptiaQuiz.ts';
import { generateContextualQuestionSvg } from '../utils/contextualSvg.ts';

export const FOURTH_QUIZ_ID = 'quiz-comptia-techplus-70';

interface RawTechPlusQuestion {
  q: string;
  options: [string, string, string, string];
  answer: number;
  exp: string;
}

const QUESTION_BANK: RawTechPlusQuestion[] = [
  {
    q: 'Which of the following units represents the smallest increment of digital data?',
    options: ['Bit', 'Byte', 'Nibble', 'Word'],
    answer: 0,
    exp: 'A bit (binary digit) is the fundamental and smallest unit of data in computing, taking a value of either 0 or 1. A nibble is 4 bits, and a byte is 8 bits.'
  },
  {
    q: 'A technician needs to connect a monitor to a modern desktop and wants a single digital interface cable that supports both ultra-high-definition video and multi-channel digital audio. Which interface is best suited?',
    options: ['VGA', 'DVI-A', 'HDMI', 'RS-232'],
    answer: 2,
    exp: 'HDMI (High-Definition Multimedia Interface) carries both high-resolution digital video and multi-channel audio over a single cable. VGA and DVI-A carry analog signals without native audio.'
  },
  {
    q: 'Which internal computer component retains boot configurations and current system time even when the computer is completely unplugged from electrical power?',
    options: ['RAM', 'CMOS battery', 'Heat sink', 'PCIe bus'],
    answer: 1,
    exp: 'The CMOS battery (typically a CR2032 lithium coin cell) powers the RTC (Real-Time Clock) and keeps BIOS/UEFI configuration memory alive while the system is powered off.'
  },
  {
    q: 'Which non-volatile storage technology has no moving physical parts and connects directly to high-speed PCIe lanes on modern motherboards?',
    options: ['SATA HDD', 'NVMe M.2 SSD', 'Magnetic tape', 'Optical drive'],
    answer: 1,
    exp: 'NVMe (Non-Volatile Memory Express) M.2 SSDs use flash memory and interface directly across PCIe lanes for high throughput and ultra-low latency.'
  },
  {
    q: 'In the troubleshooting methodology recommended by CompTIA, what should a technician do IMMEDIATELY after identifying the problem?',
    options: [
      'Implement the preventive measures',
      'Establish a theory of probable cause',
      'Verify full system functionality',
      'Document findings and outcomes'
    ],
    answer: 1,
    exp: 'The CompTIA troubleshooting process starts with: 1. Identify the problem -> 2. Establish a theory of probable cause -> 3. Test theory -> 4. Establish plan of action -> 5. Verify functionality -> 6. Document findings.'
  },
  {
    q: 'Which file system is the primary default for modern installations of Microsoft Windows, providing file-level permissions, compression, and encryption features?',
    options: ['FAT32', 'NTFS', 'ext4', 'HFS+'],
    answer: 1,
    exp: 'NTFS (New Technology File System) is the standard modern Windows file system offering native security access control lists (ACLs), journaling, compression, and EFS encryption.'
  },
  {
    q: 'What type of operating system license allows end users to inspect, modify, and redistribute the underlying source code freely?',
    options: ['Proprietary', 'Open source', 'Commercial closed-source', 'EULA-restricted single user'],
    answer: 1,
    exp: 'Open-source software (such as Linux) makes source code openly accessible for inspection, modification, and redistribution under licenses like GPL or MIT.'
  },
  {
    q: 'Which port number is used by default to send unencrypted email via the Simple Mail Transfer Protocol (SMTP)?',
    options: ['Port 25', 'Port 80', 'Port 110', 'Port 443'],
    answer: 0,
    exp: 'SMTP uses TCP port 25 for basic server-to-server mail delivery. (Port 80 is HTTP, 110 is POP3, 443 is HTTPS).'
  },
  {
    q: "A user reports they can access local printers and file shares by IP address, but cannot browse websites using domain names like 'www.comptia.org'. Which service is MOST likely failing?",
    options: ['DHCP', 'DNS', 'NTP', 'SNMP'],
    answer: 1,
    exp: 'DNS (Domain Name System) resolves human-friendly domain names to IP addresses. If IP connectivity works but domain names fail, DNS resolution is broken.'
  },
  {
    q: 'Which network device operates at Layer 2 to make intelligent forwarding decisions between computers on a LAN based on hardware MAC addresses?',
    options: ['Passive Hub', 'Switch', 'Modem', 'Repeater'],
    answer: 1,
    exp: 'Network switches inspect Ethernet frames and forward traffic specifically to the destination port matching the destination MAC address.'
  },
  {
    q: 'Which IPv4 address belongs to a designated RFC 1918 private address range and is not routable on the public Internet?',
    options: ['8.8.8.8', '192.168.1.50', '172.33.10.1', '100.64.0.1'],
    answer: 1,
    exp: 'Private IP ranges defined in RFC 1918 are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. 192.168.1.50 falls within this private class.'
  },
  {
    q: 'Which Wi-Fi security protocol introduces simultaneous authentication of equals (SAE) to protect against offline password dictionary guessing?',
    options: ['WEP', 'WPA', 'WPA2', 'WPA3'],
    answer: 3,
    exp: 'WPA3 replaces the pre-shared key exchange with Dragonfly / SAE, rendering offline dictionary attacks ineffective and enhancing cryptographic security.'
  },
  {
    q: 'What type of attack involves an attacker sending fraudulent emails appearing to come from a trustworthy source to deceive users into disclosing passwords?',
    options: ['Phishing', 'DDoS', 'Man-in-the-Middle', 'SQL injection'],
    answer: 0,
    exp: 'Phishing is social engineering via email or messaging aimed at tricking recipients into revealing credentials or installing malware.'
  },
  {
    q: 'Which pillar of the CIA Triad is directly maintained when using cryptographic hash algorithms (such as SHA-256) to ensure a file has not been tampered with?',
    options: ['Confidentiality', 'Integrity', 'Availability', 'Authentication'],
    answer: 1,
    exp: 'Integrity ensures that data has not been altered or tampered with in transit or storage. Hashing proves file integrity.'
  },
  {
    q: 'An employee logs into a corporate workstation using a smart card and a 6-digit PIN. Which two authentication factor categories are being used?',
    options: [
      'Something you know and something you are',
      'Something you have and something you know',
      'Something you have and somewhere you are',
      'Something you are and something you do'
    ],
    answer: 1,
    exp: "The smart card is 'something you have' (possession) and the PIN is 'something you know' (knowledge), making this multi-factor authentication (MFA)."
  },
  {
    q: 'Which programming language type is translated directly into machine code by a program prior to execution, producing a standalone executable binary?',
    options: ['Compiled language', 'Interpreted language', 'Scripting language', 'Markup language'],
    answer: 0,
    exp: 'Compiled languages (e.g., C, C++, Rust) use a compiler to convert human-readable source code into machine binary code prior to runtime.'
  },
  {
    q: 'In relational databases, what is the key called that uniquely identifies each individual record/row in a table?',
    options: ['Foreign key', 'Primary key', 'Index key', 'Secondary key'],
    answer: 1,
    exp: 'A Primary Key is a unique identifier assigned to each record in a relational database table that guarantees no duplicate rows exist.'
  },
  {
    q: 'Which SQL clause is used to extract data from a relational database table?',
    options: ['INSERT', 'SELECT', 'UPDATE', 'DROP'],
    answer: 1,
    exp: 'The SELECT statement is used in SQL to query and retrieve data from one or more database tables.'
  },
  {
    q: 'Which cloud computing deployment model delivers hardware virtualization, networking, and raw virtual machines where the customer manages the OS and software?',
    options: [
      'Software as a Service (SaaS)',
      'Platform as a Service (PaaS)',
      'Infrastructure as a Service (IaaS)',
      'Function as a Service (FaaS)'
    ],
    answer: 2,
    exp: 'IaaS (Infrastructure as a Service) provides the basic virtual computing building blocks (VMs, storage, networks) while the customer installs and manages the OS and applications.'
  },
  {
    q: 'A developer wants to store a true or false value in a computer program. Which primitive data type should they assign to the variable?',
    options: ['Integer', 'String', 'Boolean', 'Float'],
    answer: 2,
    exp: 'A Boolean data type represents logical values that can only be either TRUE or FALSE.'
  },
  {
    q: 'Which port does secure, encrypted web browsing (HTTPS) communicate over by default?',
    options: ['21', '53', '80', '443'],
    answer: 3,
    exp: 'HTTPS (Hypertext Transfer Protocol Secure) operates over TCP port 443 by default using TLS encryption.'
  },
  {
    q: 'What type of malicious software encrypts user files and demands payment in exchange for the decryption key?',
    options: ['Spyware', 'Adware', 'Ransomware', 'Keylogger'],
    answer: 2,
    exp: "Ransomware locks or encrypts the victim's data and demands ransom payment to restore access."
  },
  {
    q: 'Which connector type is reversible and capable of delivering high-speed data, video display output, and fast battery charging power?',
    options: ['USB Type-A', 'USB Type-B', 'USB Type-C', 'Micro-USB'],
    answer: 2,
    exp: 'USB Type-C features a reversible 24-pin connector supporting Power Delivery (PD), USB 3.x/4 data, and DisplayPort alternate mode.'
  },
  {
    q: 'Which component inside a desktop computer converts alternating current (AC) high-voltage wall power into low-voltage direct current (DC) for internal components?',
    options: [
      'CPU',
      'Power Supply Unit (PSU)',
      'Uninterruptible Power Supply (UPS)',
      'Motherboard chipset'
    ],
    answer: 1,
    exp: 'The internal Power Supply Unit (PSU) converts building AC voltage (110V/230V) into direct current voltages (+3.3V, +5V, +12V) required by computer hardware.'
  },
  {
    q: 'Which Windows utility provides real-time information regarding active processes, CPU utilization, memory consumption, and disk activity?',
    options: [
      'Device Manager',
      'Task Manager',
      'Disk Management',
      'System Configuration (msconfig)'
    ],
    answer: 1,
    exp: 'Task Manager allows Windows users to monitor resource consumption, view running processes, terminate frozen apps, and review performance graphs.'
  },
  {
    q: 'A technician needs to test end-to-end network reachability and measure round-trip packet latency to a remote server. Which command-line tool should be run?',
    options: ['ipconfig', 'ping', 'nslookup', 'netstat'],
    answer: 1,
    exp: "The 'ping' command sends ICMP Echo Request packets to verify network connectivity and measures round-trip time in milliseconds."
  },
  {
    q: 'What is the primary role of a DHCP server on a local computer network?',
    options: [
      'To map domain names to IP addresses',
      'To automatically assign IP addresses, subnet masks, and default gateways to clients',
      'To protect private networks by inspecting packet state',
      'To translate private IP addresses into a single public address'
    ],
    answer: 1,
    exp: 'DHCP (Dynamic Host Configuration Protocol) automates IP configuration, dynamically leasing IP addresses and network parameters to client devices.'
  },
  {
    q: 'Which backup approach backs up ONLY data that has changed since the most recent FULL or INCREMENTAL backup and clears the archive bit?',
    options: ['Full backup', 'Incremental backup', 'Differential backup', 'Mirror backup'],
    answer: 1,
    exp: 'An incremental backup copies only files created or modified since the last backup (full or incremental) and clears the archive attribute.'
  },
  {
    q: 'Which network architecture type connects computers over a broad geographical area spanning multiple cities, states, or countries?',
    options: ['LAN', 'PAN', 'WAN', 'WLAN'],
    answer: 2,
    exp: 'A Wide Area Network (WAN) connects multiple geographically dispersed networks across cities or continents (the Internet is the largest WAN).'
  },
  {
    q: 'What is an advantage of a 64-bit operating system compared to a legacy 32-bit operating system?',
    options: [
      'It requires no thermal cooling for the processor',
      'It can address more than 4 GB of system RAM',
      'It eliminates the need for peripheral device drivers',
      'It runs only open-source software packages'
    ],
    answer: 1,
    exp: 'A 32-bit OS has a hard memory addressing limit of 4 GB (2^32 bytes). A 64-bit architecture can address vastly larger theoretical amounts (up to 16 Exabytes).'
  },
  {
    q: 'Which device is designed to supply short-term battery power to connected computing equipment during a sudden electrical blackout?',
    options: [
      'Surge protector',
      'Power strip',
      'Uninterruptible Power Supply (UPS)',
      'Step-down transformer'
    ],
    answer: 2,
    exp: 'A UPS (Uninterruptible Power Supply) contains battery cells that immediately kick in during a blackout, giving systems time to shut down cleanly without data loss.'
  },
  {
    q: 'Which optical storage media format typically offers the highest standard single-layer storage capacity (~25 GB)?',
    options: ['CD-ROM', 'DVD-R', 'Blu-ray Disc (BD)', 'Floppy disk'],
    answer: 2,
    exp: 'A standard single-layer Blu-ray Disc holds 25 GB, compared to ~4.7 GB for a single-layer DVD and ~700 MB for a CD.'
  },
  {
    q: 'What type of intellectual property protection grants an inventor exclusive legal rights to an invention or technical process for a limited time?',
    options: ['Copyright', 'Trademark', 'Patent', 'Trade secret'],
    answer: 2,
    exp: 'A patent grants exclusive commercial rights to an inventor for a novel and non-obvious invention or process (usually 20 years).'
  },
  {
    q: 'What is the decimal equivalent of the 8-bit binary number 00001010?',
    options: ['8', '10', '12', '16'],
    answer: 1,
    exp: 'Reading place values from right to left (1, 2, 4, 8, 16...): 0×128 + 0×64 + 0×32 + 0×16 + 1×8 + 0×4 + 1×2 + 0×1 = 8 + 2 = 10.'
  },
  {
    q: 'Which cybersecurity concept enforces that users are granted only the minimum permissions necessary to perform their assigned job duties?',
    options: [
      'Principle of Least Privilege',
      'Separation of Duties',
      'Implicit Deny',
      'Defense in Depth'
    ],
    answer: 0,
    exp: 'The Principle of Least Privilege dictates that accounts should possess only the bare minimum rights and permissions required to perform daily work tasks.'
  },
  {
    q: 'Which protocol operates on TCP port 22 and provides an encrypted, secure command-line shell session to manage remote servers?',
    options: ['Telnet', 'SSH', 'FTP', 'RDP'],
    answer: 1,
    exp: 'SSH (Secure Shell) uses TCP port 22 to provide secure encrypted remote administrative CLI access, replacing insecure plaintext Telnet (port 23).'
  },
  {
    q: 'In database design, which concept ensures that relationships between tables remain consistent, preventing orphaned records from existing?',
    options: [
      'Data normalization',
      'Referential integrity',
      'Schema indexing',
      'Query optimization'
    ],
    answer: 1,
    exp: 'Referential integrity is a relational database rule ensuring that a foreign key value must always match a valid primary key in the parent table.'
  },
  {
    q: 'What is a major characteristic of volatile memory?',
    options: [
      'Contents are preserved when power is disconnected',
      'Contents are immediately lost when power is removed',
      'It can only be written to once during factory manufacture',
      'It is primarily used for secondary long-term file archiving'
    ],
    answer: 1,
    exp: 'Volatile memory (such as system RAM) requires continuous electrical current to retain its stored state. When power shuts off, data is lost.'
  },
  {
    q: 'Which technology allows a single physical server hardware host to run multiple independent guest operating systems simultaneously?',
    options: [
      'Overclocking',
      'Hardware Virtualization / Hypervisor',
      'Load Balancing',
      'Network Attached Storage'
    ],
    answer: 1,
    exp: 'Hypervisor virtualization allows multiple isolated virtual machines (guest OSs) to share the physical hardware resources of one host server.'
  },
  {
    q: 'Which command in Windows displays the current IP address, subnet mask, and default gateway assigned to network adapters?',
    options: ['ifconfig', 'ipconfig', 'traceroute', 'route print'],
    answer: 1,
    exp: "The 'ipconfig' utility displays IP configuration details on Windows machines (whereas 'ifconfig' or 'ip addr' is used on Linux/UNIX)."
  },
  {
    q: 'What type of data is represented by structured rows and columns in a schema-defined relational database table?',
    options: ['Unstructured data', 'Semi-structured data', 'Structured data', 'Raw metadata'],
    answer: 2,
    exp: 'Structured data follows a strict tabular schema composed of clearly defined rows, records, columns, and data types (as seen in SQL RDBMS).'
  },
  {
    q: 'What is the primary function of an operating system kernel?',
    options: [
      'To compile high-level programming code into binaries',
      'To manage communication between hardware and application software',
      'To render graphical web pages inside internet browsers',
      'To scan file downloads for malware definitions'
    ],
    answer: 1,
    exp: 'The kernel is the core of the operating system that directly controls memory, CPU time, peripheral input/output, and hardware access for applications.'
  },
  {
    q: 'Which device is used to connect dissimilar networks together and route packets between different subnets based on destination IP addresses?',
    options: ['Hub', 'Router', 'Unmanaged Switch', 'Access Point'],
    answer: 1,
    exp: 'A router operates at Layer 3 (Network layer) to route packets across different logical networks and determine optimal paths based on IP addresses.'
  },
  {
    q: 'What form of malware disguises itself as legitimate, useful software (such as a game or utility) to trick users into running it?',
    options: ['Worm', 'Trojan horse', 'Rootkit', 'Adware'],
    answer: 1,
    exp: 'A Trojan horse conceals malicious payloads inside or disguised as seemingly legitimate software.'
  },
  {
    q: 'Which port does the unencrypted Hypertext Transfer Protocol (HTTP) utilize by default?',
    options: ['20', '25', '80', '143'],
    answer: 2,
    exp: 'HTTP transmits plain-text web traffic across TCP port 80 by default.'
  },
  {
    q: 'Which of the following describes a secure method for destroying sensitive data on an old mechanical hard drive before disposal?',
    options: [
      'Formatting using quick format',
      'Degaussing or physical shredding',
      'Emptying the recycle bin',
      'Deleting the partition table'
    ],
    answer: 1,
    exp: 'Degaussing (disrupting the magnetic field) or physical destruction/shredding guarantees that magnetic media cannot be read or recovered.'
  },
  {
    q: 'A user is setting up a home wireless router. To ensure wireless traffic is encrypted with modern enterprise-grade security, which standard should be selected?',
    options: ['WPA3-Personal', 'WEP 64-bit', 'WEP 128-bit', 'Open Authentication'],
    answer: 0,
    exp: 'WPA3 is the current state-of-the-art Wi-Fi security protocol, replacing vulnerable legacy standards like WEP and WPA.'
  },
  {
    q: "Which term describes small text files stored on a user's web browser by websites to remember logins, session states, and site preferences?",
    options: ['Plug-ins', 'Cookies', 'Certificates', 'Extensions'],
    answer: 1,
    exp: 'Browser cookies are small data files placed by web servers on the client browser to track session states, preferences, and identity.'
  },
  {
    q: 'In programming logic, which construct repeatedly executes a block of code as long as a specified condition evaluates to TRUE?',
    options: [
      'Branch / If statement',
      'Loop (e.g., While / For)',
      'Variable declaration',
      'Constant definition'
    ],
    answer: 1,
    exp: "Loops (such as 'while' or 'for') iterate and execute a code block repeatedly until their boolean test condition evaluates to false."
  },
  {
    q: 'Which protocol is utilized by network devices to synchronize their internal system clocks with high precision across the Internet?',
    options: ['DNS', 'NTP', 'SNMP', 'TFTP'],
    answer: 1,
    exp: 'Network Time Protocol (NTP) uses UDP port 123 to synchronize computer clocks with atomic clock time references.'
  },
  {
    q: "What does the abbreviation 'IoT' stand for in modern computing terminology?",
    options: [
      'Internet of Technology',
      'Internet of Things',
      'Integrated Optical Transmission',
      'Internal Operating Thread'
    ],
    answer: 1,
    exp: 'IoT stands for Internet of Things, describing internet-connected smart devices like thermostats, light bulbs, IP cameras, and sensors.'
  },
  {
    q: 'Which type of software installation runs directly within a client web browser without requiring prior local disk installation of the software package?',
    options: [
      'SaaS web application',
      'Native desktop application',
      'Device driver',
      'Kernel module'
    ],
    answer: 0,
    exp: 'Software as a Service (SaaS) web applications (such as Google Docs or Office 365 online) execute via standard web browsers without local installs.'
  },
  {
    q: 'Which peripheral device is classified purely as an INPUT device for a computer?',
    options: ['Flatbed scanner', 'Inkjet printer', 'Computer speaker', 'LCD monitor'],
    answer: 0,
    exp: 'A scanner digitizes physical images or documents into digital data for the computer, functioning strictly as an input peripheral.'
  },
  {
    q: 'What is the primary function of the Address Resolution Protocol (ARP)?',
    options: [
      'To resolve an IP address to a physical MAC address',
      'To resolve a domain name to an IP address',
      'To assign private IP addresses to local clients',
      'To encrypt data packets at the transport layer'
    ],
    answer: 0,
    exp: 'ARP (Address Resolution Protocol) resolves a known IPv4 address into its corresponding Layer 2 hardware MAC address on a local area network.'
  },
  {
    q: 'Which folder path represents the standard root directory in a Linux or UNIX-like operating system?',
    options: ['C:\\', '/ (forward slash)', '\\ (backslash)', 'C:/root/'],
    answer: 1,
    exp: "In Linux and UNIX systems, the file hierarchy begins at the single root directory denoted by a single forward slash ('/')."
  },
  {
    q: 'What is the primary benefit of enabling Multi-Factor Authentication (MFA) on corporate accounts?',
    options: [
      'It prevents brute-force network bandwidth saturation',
      'It ensures account access remains protected even if a password is compromised',
      'It automatically encrypts all outbound email attachments',
      'It boosts network download speeds during authentication'
    ],
    answer: 1,
    exp: 'MFA requires two or more distinct factors (e.g. password + phone code). If a password is stolen, the account remains protected by the second factor.'
  },
  {
    q: 'Which wireless technology operates at very short distances (typically 4 cm or less) and is commonly used for contactless mobile tap payments?',
    options: ['NFC (Near Field Communication)', 'Bluetooth', 'Cellular LTE', 'Satellite'],
    answer: 0,
    exp: 'NFC operates over distances under 4 centimeters, making it ideal for tap-to-pay services (Apple Pay, Google Wallet) and access badges.'
  },
  {
    q: "What is the decimal equivalent of the hexadecimal number '0x1F'?",
    options: ['15', '16', '31', '32'],
    answer: 2,
    exp: 'In hexadecimal, 1 is in the 16s place and F represents 15 in the 1s place: (1 × 16) + (15 × 1) = 16 + 15 = 31.'
  },
  {
    q: 'Which command in Windows command prompt terminates an active process using its process ID (PID) or executable name?',
    options: ['killall', 'taskkill', 'stop-process', 'delprocess'],
    answer: 1,
    exp: "Windows provides the 'taskkill' command (e.g., `taskkill /PID 1234 /F` or `taskkill /IM notepad.exe`) to shut down running processes."
  },
  {
    q: "A developer is writing code and needs to store an employee's salary with decimal points (e.g., 54250.75). Which data type is most appropriate?",
    options: ['Integer', 'Float / Double', 'Boolean', 'Character'],
    answer: 1,
    exp: 'Floating-point numbers (float or double) represent real numbers containing fractional decimal components.'
  },
  {
    q: 'What is the main security purpose of setting up a Virtual Private Network (VPN)?',
    options: [
      'To increase the physical bandwidth of an Internet connection',
      'To establish an encrypted tunnel across untrusted public networks',
      'To permanently block ads and popups on visited websites',
      'To eliminate the need for an Internet Service Provider (ISP)'
    ],
    answer: 1,
    exp: 'A VPN creates an encrypted tunnel across public networks like the Internet, protecting data confidentiality and integrity in transit.'
  },
  {
    q: 'Which motherboard component manages high-speed communications between the CPU, RAM, and PCIe graphics slots in traditional architectures?',
    options: ['Southbridge', 'Northbridge', 'Super I/O controller', 'TPM chip'],
    answer: 1,
    exp: 'In classic motherboard chipsets, the Northbridge handled high-speed communication between the CPU, system memory, and primary expansion graphics slots.'
  },
  {
    q: 'Which type of physical storage drive is most vulnerable to data loss or damage from mechanical physical drops while operating?',
    options: [
      'M.2 NVMe SSD',
      'Solid State Drive (SATA SSD)',
      'Traditional Hard Disk Drive (HDD)',
      'USB Flash Drive'
    ],
    answer: 2,
    exp: 'Traditional HDDs contain mechanical spinning magnetic platters and read/write heads flying nanometers above the surface, making them fragile to physical shock.'
  },
  {
    q: 'Which protocol is responsible for securely and automatically delivering web pages with end-to-end encryption to client browsers?',
    options: ['FTP', 'HTTPS', 'SNMP', 'Telnet'],
    answer: 1,
    exp: 'HTTPS (Hypertext Transfer Protocol Secure) encrypts HTTP web traffic using Transport Layer Security (TLS).'
  },
  {
    q: "What does the abbreviation 'GPU' stand for in computer hardware?",
    options: [
      'General Processing Utility',
      'Graphics Processing Unit',
      'Graphical Power Unit',
      'Gigabit Port Unit'
    ],
    answer: 1,
    exp: 'GPU stands for Graphics Processing Unit, specialized in parallel processing of images, 3D graphics rendering, and mathematical computing.'
  },
  {
    q: 'A user wants to prevent unauthorized incoming network connections to their personal computer. What should be enabled and configured?',
    options: ['Host-based firewall', 'Disk defragmenter', 'Proxy bypass', 'DHCP snooping'],
    answer: 0,
    exp: 'A host-based software firewall (like Windows Defender Firewall) inspects incoming and outgoing network packets to block unauthorized traffic.'
  },
  {
    q: 'Which phase of the software development lifecycle (SDLC) involves finding, tracking, and repairing bugs before releasing software to customers?',
    options: [
      'Requirement gathering',
      'Testing / Quality Assurance',
      'Deployment',
      'Decommissioning'
    ],
    answer: 1,
    exp: 'The testing/QA phase focuses on executing test suites to uncover flaws, errors, and performance bugs prior to production deployment.'
  },
  {
    q: 'Which connector is commonly found on twisted-pair Ethernet patch cables used in local wired networks?',
    options: ['RJ-11', 'RJ-45', 'BNC', 'F-type'],
    answer: 1,
    exp: 'RJ-45 is an 8-position, 8-contact (8P8C) modular plug used universally on twisted-pair Ethernet cables (Cat 5e, Cat 6, Cat 6a).'
  },
  {
    q: 'Which concept refers to preserving intellectual privacy and ensuring personal identifying information (PII) is not improperly disclosed?',
    options: [
      'Data Confidentiality',
      'Data Redundancy',
      'Data Scalability',
      'High Availability'
    ],
    answer: 0,
    exp: 'Data confidentiality safeguards sensitive information from unauthorized access, snooping, or illicit disclosure.'
  },
  {
    q: 'What is the final step in the industry-standard CompTIA 6-step troubleshooting methodology?',
    options: [
      'Document findings, actions, and outcomes',
      'Verify full system functionality',
      'Establish a plan of action',
      'Test the theory to determine cause'
    ],
    answer: 0,
    exp: 'The 6th and final step of the CompTIA troubleshooting process is to document findings, actions taken, and the final outcomes for future reference.'
  }
];

const TECHPLUS_TARGET_SLOTS: number[] = [
  0, 2, 1, 3, 2, 0, 3, 1, 2, 3,
  0, 1, 3, 2, 1, 0, 3, 2, 1, 0,
  3, 2, 0, 1, 3, 2, 0, 1, 2, 3,
  1, 0, 2, 3, 0, 1, 3, 2, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 3, 2,
  1, 0, 3, 2, 0, 1, 2, 3, 1, 0,
  3, 2, 1, 0, 3, 2, 1, 0, 2, 3
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

function selectTechPlusVisual(questionText: string, idx: number): { svg: string; caption: string } {
  const lower = questionText.toLowerCase();
  if (
    (lower.includes('binary') && !lower.includes('executable binary')) ||
    lower.includes('smallest increment of digital data') ||
    lower.includes('hexadecimal')
  ) {
    return {
      svg: COMPTIA_SVG_DIAGRAMS.binaryTable,
      caption: 'Binary & Digital Data Representation (8-Bit Byte)'
    };
  }
  if (lower.includes('monitor') && (lower.includes('hdmi') || lower.includes('video'))) {
    return {
      svg: COMPTIA_SVG_DIAGRAMS.videoPorts,
      caption: 'Display Interfaces Comparison (VGA / HDMI / DisplayPort)'
    };
  }
  if (lower.includes('cmos') || lower.includes('northbridge') || lower.includes('motherboard')) {
    return {
      svg: COMPTIA_SVG_DIAGRAMS.motherboardDiagram,
      caption: 'Motherboard Architecture & Internal Components'
    };
  }
  if (lower.includes('ssd') || lower.includes('hdd') || lower.includes('mechanical physical drops')) {
    return {
      svg: COMPTIA_SVG_DIAGRAMS.ssdVsHdd,
      caption: 'Storage Media Architecture (HDD vs Solid State Drive)'
    };
  }
  if (lower.includes('reversible') || lower.includes('usb')) {
    return {
      svg: COMPTIA_SVG_DIAGRAMS.usbConnectors,
      caption: 'Universal Serial Bus (USB) Connector Types'
    };
  }
  if (lower.includes('rj-45') || lower.includes('twisted-pair ethernet')) {
    return {
      svg: COMPTIA_SVG_DIAGRAMS.rj45VsRj11,
      caption: 'RJ-45 (8P8C) Ethernet vs RJ-11 Connector'
    };
  }
  if (lower.includes('kernel')) {
    return {
      svg: COMPTIA_SVG_DIAGRAMS.osLayers,
      caption: 'Operating System Architecture Layers'
    };
  }
  if (
    lower.includes('primary key') ||
    lower.includes('referential integrity') ||
    lower.includes('uniquely identifies each individual record')
  ) {
    return {
      svg: COMPTIA_SVG_DIAGRAMS.relationalKeys,
      caption: 'Relational Database Schema & Primary/Foreign Keys'
    };
  }
  if (lower.includes('sql') || lower.includes('structured rows and columns')) {
    return {
      svg: COMPTIA_SVG_DIAGRAMS.sqlQueryVisual,
      caption: 'SQL Relational Database Query Structure'
    };
  }
  if (lower.includes('cia triad') || lower.includes('confidentiality')) {
    return {
      svg: COMPTIA_SVG_DIAGRAMS.ciaTriad,
      caption: 'Cybersecurity CIA Triad (Confidentiality, Integrity, Availability)'
    };
  }
  if (lower.includes('firewall')) {
    return {
      svg: COMPTIA_SVG_DIAGRAMS.firewallDiagram,
      caption: 'Network & Host-Based Firewall Packet Filtering'
    };
  }
  if (lower.includes('authentication factor') || lower.includes('multi-factor authentication')) {
    return {
      svg: COMPTIA_SVG_DIAGRAMS.mfaDiagram,
      caption: 'Multi-Factor Authentication (MFA) Categories'
    };
  }
  if (lower.includes('loop') || lower.includes('condition evaluates to true')) {
    return {
      svg: COMPTIA_SVG_DIAGRAMS.flowchartCondition,
      caption: 'Programming Logic & Conditional Loop Flow'
    };
  }

  return generateContextualQuestionSvg(questionText, idx);
}

export const COMPTIA_TECHPLUS_QUESTIONS: QuizQuestion[] = QUESTION_BANK.map((item, idx) => {
  const targetSlot = TECHPLUS_TARGET_SLOTS[idx % TECHPLUS_TARGET_SLOTS.length];
  const balancedOptions = redistributeOptions(item.options, item.answer, targetSlot);
  const visual = selectTechPlusVisual(item.q, idx);

  return {
    id: idx + 1,
    question: item.q,
    svg: visual.svg,
    caption: visual.caption,
    options: balancedOptions,
    correct: targetSlot,
    explanation: item.exp
  };
});

export function buildComptiaTechPlusQuiz(isActive = true): QuizDefinition {
  return {
    id: FOURTH_QUIZ_ID,
    title: 'اختبار CompTIA Tech+ (FC0-U71) التدريبي الشامل (70 سؤالاً)',
    description:
      'CompTIA Tech+ (FC0-U71) Certification Practice Exam — 70 Multiple-Choice Questions covering Hardware, Networking, OS, Databases, Software & Security',
    createdAt: new Date().toISOString(),
    isActive,
    questions: COMPTIA_TECHPLUS_QUESTIONS
  };
}
