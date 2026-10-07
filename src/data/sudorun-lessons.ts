import type { Module } from "./lessons";
import { usedCmd } from "../lib/terminal";
import { SUDO_RUN_MODULES_B } from "./sudorun-lessons-b";
import { SUDO_RUN_MODULES_C } from "./sudorun-lessons-c";

const lab = "sudorun" as const;

function shot(cmd: string, lines: string[]): { cmd: string; lines: string[] } {
  return { cmd, lines };
}

export const SUDO_RUN_MODULES: Module[] = [
  {
    id: "sr-intro",
    order: 1,
    icon: "terminal",
    color: "from-lime-500 to-emerald-800",
    difficulty: 1,
    scenario: lab,
    title: { en: "Sudo_Run — Why Linux?", el: "Sudo_Run — Γιατί Linux;" },
    subtitle: { en: "Pentesting OS, pwd, whoami, cd, ls", el: "Linux και βασικές εντολές: pwd, whoami, cd και ls" },
    badge: { en: "Sudo Initiate", el: "Μύηση Sudo" },
    theory: [
      {
        heading: { en: "Why use Linux for pentesting?", el: "Γιατί Linux στο pentest;" },
        body: {
          en: "Certain operating systems get tied to certain tasks. For penetration testing, Linux is the default map. Linux offers far higher control of the OS, and it is open source — which makes it transparent and easier to understand. Before you try to “hack” anything, you must know how it works; transparency is a huge plus. Because Linux is popular in the community, most pentesting tools and frameworks are built for it. Maintenance is easy (packages come from a repository) and it is very stable compared to traditional desktop OS like Windows. This campaign is Sudo_Run: Linux for Beginners, inside Gamehack — a sandbox, never a live network you do not own.",
          el: "Το Linux είναι από τις πιο διαδεδομένες επιλογές για δοκιμές διείσδυσης. Ως λογισμικό ανοικτού κώδικα, προσφέρει μεγάλο έλεγχο του λειτουργικού και σου επιτρέπει να κατανοήσεις καλύτερα πώς λειτουργεί. Τα περισσότερα εργαλεία και frameworks του χώρου υποστηρίζουν Linux, ενώ τα πακέτα εγκαθίστανται εύκολα από αποθετήρια και το σύστημα είναι ιδιαίτερα σταθερό. Το Sudo_Run είναι η εισαγωγική διαδρομή Linux του Gamehack και εκτελείται αποκλειστικά σε ασφαλή προσομοίωση — ποτέ σε πραγματικό δίκτυο χωρίς άδεια.",
        },
      },
      {
        heading: { en: "The terminal", el: "Το τερματικό" },
        body: {
          en: "Just like everyday Windows work (folders, copy, move), we do those operations on Linux — mostly in the terminal, the command-line interface. You type a command, press Enter, the shell runs it. You are root in this lab (administrator). That is a lot of power: stay inside Gamehack.",
          el: "Όπως στα Windows, μπορείς να δημιουργείς φακέλους, να αντιγράφεις και να μετακινείς αρχεία. Στο Linux οι περισσότερες από αυτές τις εργασίες γίνονται από το τερματικό: πληκτρολογείς μια εντολή, πατάς Enter και το shell την εκτελεί. Σε αυτό το εργαστήριο έχεις δικαιώματα root (διαχειριστή), οπότε μπορείς να κάνεις σημαντικές αλλαγές· περιόρισέ τες όμως στην προσομοίωση του Gamehack.",
        },
      },
      {
        heading: { en: "pwd — where am I?", el: "pwd — πού είμαι;" },
        body: {
          en: "Before you begin, know which directory you are in. pwd prints the working directory. In Sudo_Run you start in /root (the root user's home).",
          el: "Πριν ξεκινήσεις, έλεγξε σε ποιον φάκελο βρίσκεσαι. Η pwd εμφανίζει τον τρέχοντα φάκελο εργασίας. Στο Sudo_Run ξεκινάς στο /root, τον προσωπικό φάκελο του χρήστη root.",
        },
        shots: [shot("pwd", ["/root"])],
      },
      {
        heading: { en: "whoami — who am I?", el: "whoami — ποιος είμαι;" },
        body: {
          en: "whoami shows the logged-in user. Here you are root (the Windows equivalent of a full administrator).",
          el: "Η whoami εμφανίζει το όνομα του συνδεδεμένου χρήστη. Εδώ είσαι root, δηλαδή έχεις δικαιώματα διαχειριστή μέσα στην προσομοίωση.",
        },
        shots: [shot("whoami", ["root"])],
      },
      {
        heading: { en: "cd — change directory", el: "cd — αλλαγή φακέλου" },
        body: {
          en: "cd moves you. Change into Desktop with: cd Desktop/",
          el: "Η cd αλλάζει τον τρέχοντα φάκελο. Για να μεταβείς στην Επιφάνεια εργασίας, γράψε cd Desktop/.",
        },
        shots: [shot("cd Desktop/", ["root@kali:~/Desktop#"])],
      },
      {
        heading: { en: "ls — list contents", el: "ls — λίστα" },
        body: {
          en: "ls lists a directory (like dir on Windows). Run it after you cd into Desktop.",
          el: "Η ls εμφανίζει τα περιεχόμενα ενός φακέλου, όπως η dir στα Windows. Αφού μεταβείς στο Desktop με cd, τρέξε την ls για να δεις τα αρχεία του.",
        },
        shots: [shot("ls", ["CTF-notes.txt  todo.txt"])],
      },
    ],
    cheats: [
      { cmd: "pwd", desc: { en: "print working directory", el: "τρέχων φάκελος" } },
      { cmd: "whoami", desc: { en: "current user", el: "τρέχων χρήστης" } },
      { cmd: "cd Desktop/", desc: { en: "enter Desktop", el: "μπες στο Desktop" } },
      { cmd: "ls", desc: { en: "list files", el: "λίστα αρχείων" } },
    ],
    tasks: [
      {
        id: "pwd",
        instruction: { en: "Run pwd — you should see /root.", el: "Τρέξε pwd και επιβεβαίωσε ότι εμφανίζεται ο φάκελος /root." },
        hint: { en: "pwd", el: "pwd" },
        explain: { en: "WHY: orientation. HOW: pwd", el: "ΓΙΑΤΙ: Πριν εκτελέσεις εντολές, έλεγξε πού βρίσκεσαι. ΠΩΣ: η pwd εμφανίζει τον τρέχοντα φάκελο." },
        check: (t) => t.flags.has("pwd") || usedCmd(t, /^\s*pwd\b/),
      },
      {
        id: "whoami",
        instruction: { en: "Run whoami and confirm you are root.", el: "Τρέξε whoami και επιβεβαίωσε ότι ο συνδεδεμένος χρήστης είναι root." },
        hint: { en: "whoami", el: "whoami" },
        explain: { en: "Root is all-powerful. That is why the ethics oath exists.", el: "Ο root έχει πλήρη δικαιώματα διαχειριστή· γι’ αυτό χρησιμοποίησέ τα υπεύθυνα και μόνο στο εργαστήριο." },
        check: (t) => t.flags.has("whoami"),
      },
      {
        id: "cd",
        instruction: { en: "cd into Desktop.", el: "Μετακινήσου στον φάκελο Desktop με την εντολή cd." },
        hint: { en: "cd Desktop", el: "cd Desktop" },
        explain: { en: "cd Desktop/ or cd Desktop", el: "Γράψε cd Desktop/ ή cd Desktop." },
        check: (t) => t.flags.has("cd-desktop") || usedCmd(t, /^\s*cd\s+Desktop/),
      },
      {
        id: "ls",
        instruction: { en: "List the Desktop with ls.", el: "Εμφάνισε τα περιεχόμενα του Desktop με την εντολή ls." },
        hint: { en: "ls", el: "ls" },
        explain: { en: "ls is your dir.", el: "Η ls εμφανίζει τα περιεχόμενα ενός φακέλου, όπως η dir στα Windows." },
        check: (t) => t.flags.has("ls"),
      },
    ],
    challenges: [
      {
        title: { en: "Home again", el: "Επιστροφή στον προσωπικό φάκελο" },
        brief: { en: "cd ~ or cd /root and pwd again.", el: "Επέστρεψε στο /root με cd ~ ή cd /root και έλεγξε ξανά τη θέση σου με pwd." },
        success: { en: "You can move and know where you landed.", el: "Μπορείς πλέον να αλλάζεις φάκελο και να επιβεβαιώνεις πού βρίσκεσαι." },
        check: (t) => usedCmd(t, /^\s*cd\s+(\/root|~)\s*$/) || t.cwd === "/root",
      },
      {
        title: { en: "Read the desktop CTF note", el: "Διάβασε τη σημείωση CTF στην Επιφάνεια εργασίας" },
        brief: { en: "cat Desktop/CTF-notes.txt from /root (or cat CTF-notes.txt if you are already in Desktop).", el: "Από το /root, διάβασε το CTF-notes.txt με την εντολή cat Desktop/CTF-notes.txt. Αν βρίσκεσαι ήδη στο Desktop, αρκεί η εντολή cat CTF-notes.txt." },
        success: { en: "You found a Sudo_Run flag on the desktop.", el: "Βρήκες ένα flag του Sudo_Run στην Επιφάνεια εργασίας." },
        check: (t) => t.filesRead.some((p) => p.includes("CTF-notes")),
      },
    ],
  },
  {
    id: "sr-help",
    order: 2,
    icon: "book",
    color: "from-sky-400 to-indigo-800",
    difficulty: 1,
    scenario: lab,
    title: { en: "Help, man, locate, whereis, which", el: "Βοήθεια, εγχειρίδια και εντοπισμός εντολών: help, man, locate, whereis, which" },
    subtitle: { en: "How operators look things up", el: "Πώς βρίσκεις πληροφορίες για εντολές" },
    badge: { en: "Page Turner", el: "Ερευνητής εντολών" },
    theory: [
      {
        heading: { en: "help / --help", el: "Εντολές βοήθειας: help / --help" },
        body: {
          en: "Nearly every command, application or utility on Linux has a dedicated help file. If you are stuck, -h / --help is your friend. Example: volatility --help (Volatility is a memory-forensics framework). In Gamehack the same pattern applies to every tool.",
          el: "Σχεδόν κάθε εντολή και εργαλείο του Linux διαθέτει οδηγίες χρήσης. Αν κολλήσεις, δοκίμασε τις επιλογές -h ή --help. Για παράδειγμα, η εντολή volatility --help εμφανίζει βοήθεια για το Volatility, ένα framework ανάλυσης μνήμης. Στο Gamehack, η ίδια λογική ισχύει για όλα τα εργαλεία.",
        },
        shots: [shot("volatility --help", ["Volatility Foundation Volatility Framework", "-h, --help   show help message and exit", "Plugins: pslist, netscan, filescan (lab stub)"])],
      },
      {
        heading: { en: "man — manual pages", el: "man — εγχειρίδια" },
        body: {
          en: "In addition to --help, most commands have a manual page: man COMMAND. man ls describes ls and its flags (-a, -l, …).",
          el: "Εκτός από το --help, οι περισσότερες εντολές έχουν εγχειρίδιο: γράψε man ΕΝΤΟΛΗ. Για παράδειγμα, το man ls εξηγεί τη χρήση της ls και επιλογές όπως -a και -l.",
        },
        shots: [shot("man ls", ["LS(1)  ls - list directory contents", "-a  do not ignore entries starting with .", "-l  use a long listing format"])],
      },
      {
        heading: { en: "locate — keyword search", el: "locate — αναζήτηση" },
        body: {
          en: "locate KEYWORD searches a database of the filesystem. Drawbacks: it can dump too much, and the database is typically updated once a day — so brand-new files may be missing. Pipe through more to page: locate CTF | more",
          el: "Η locate αναζητά λέξεις-κλειδιά σε ευρετήριο του συστήματος αρχείων. Μπορεί να εμφανίσει πολλά αποτελέσματα, ενώ το ευρετήριο ανανεώνεται συνήθως περιοδικά· έτσι, πολύ πρόσφατα αρχεία μπορεί να λείπουν. Για να διαβάσεις τα αποτελέσματα σε σελίδες, χρησιμοποίησε locate CTF | more.",
        },
        shots: [shot("locate CTF | more", ["/root/Desktop/CTF-notes.txt", "/opt/CTF/readme", "/usr/share/wordlists/CTF.txt"])],
      },
      {
        heading: { en: "Binaries, whereis, which", el: "Εκτελέσιμα και εντοπισμός εντολών: whereis, which" },
        body: {
          en: "Files you can execute (like .exe on Windows) are binaries. They usually live in /usr/bin or /usr/sbin. ls, cd, cat, ps live there too. whereis NAME returns the binary path AND its man page. which NAME is stricter: only the binary on your PATH. Try both on git.",
          el: "Τα εκτελέσιμα αρχεία λέγονται binaries και συνήθως βρίσκονται στους φακέλους /usr/bin ή /usr/sbin. Η whereis ΟΝΟΜΑ εμφανίζει τη διαδρομή του εκτελέσιμου και του εγχειριδίου του, ενώ η which ΟΝΟΜΑ εντοπίζει μόνο το εκτελέσιμο που βρίσκεται στο PATH. Δοκίμασε και τις δύο εντολές με το git.",
        },
        shots: [
          shot("whereis git", ["git: /usr/bin/git /usr/share/man/man1/git.1"]),
          shot("which git", ["/usr/bin/git"]),
        ],
      },
    ],
    cheats: [
      { cmd: "volatility --help", desc: { en: "tool help", el: "βοήθεια εργαλείου" } },
      { cmd: "man ls", desc: { en: "manual for ls", el: "εγχειρίδιο ls" } },
      { cmd: "locate CTF | more", desc: { en: "search names", el: "αναζήτηση ονομάτων" } },
      { cmd: "whereis git", desc: { en: "binary + man", el: "Εκτελέσιμο αρχείο και εγχειρίδιο χρήσης" } },
      { cmd: "which git", desc: { en: "PATH binary only", el: "μόνο PATH" } },
    ],
    tasks: [
      {
        id: "vol",
        instruction: { en: "Run volatility --help", el: "Τρέξε volatility --help" },
        hint: { en: "volatility --help", el: "volatility --help" },
        explain: { en: "WHY: every tool documents itself.", el: "ΓΙΑΤΙ: κάθε εργαλείο αυτοπεριγράφεται." },
        check: (t) => t.flags.has("volatility-help") || usedCmd(t, /volatility/),
      },
      {
        id: "man",
        instruction: { en: "Open the manual for ls: man ls", el: "man ls" },
        hint: { en: "man ls", el: "man ls" },
        explain: { en: "man is deeper than --help.", el: "Το man είναι βαθύτερο από --help." },
        check: (t) => t.flags.has("man-ls") || usedCmd(t, /man\s+ls/),
      },
      {
        id: "locate",
        instruction: { en: "locate CTF (optionally | more)", el: "locate CTF" },
        hint: { en: "locate CTF | more", el: "locate CTF | more" },
        explain: { en: "locate walks a name index.", el: "Το locate ψάχνει ευρετήριο ονομάτων." },
        check: (t) => t.flags.has("locate") || t.flags.has("locate-ctf") || usedCmd(t, /locate\s+CTF/),
      },
      {
        id: "whereis",
        instruction: { en: "whereis git", el: "whereis git" },
        hint: { en: "whereis git", el: "whereis git" },
        explain: { en: "Binary plus man page.", el: "Το εκτελέσιμο αρχείο και η διαδρομή του εγχειριδίου." },
        check: (t) => t.flags.has("whereis-git") || usedCmd(t, /whereis\s+git/),
      },
      {
        id: "which",
        instruction: { en: "which git", el: "which git" },
        hint: { en: "which git", el: "which git" },
        explain: { en: "Only PATH.", el: "Μόνο PATH." },
        check: (t) => t.flags.has("which-git") || usedCmd(t, /which\s+git/),
      },
    ],
    challenges: [
      {
        title: { en: "Page the locate dump", el: "Περιηγήσου στα αποτελέσματα της locate με το more" },
        brief: { en: "Run locate CTF | more (pipe).", el: "locate CTF | more" },
        success: { en: "You combined locate with a pager.", el: "Συνδύασες την αναζήτηση με locate και την προβολή σελίδων με more." },
        check: (t) => usedCmd(t, /locate.*\|/) || t.flags.has("pipe"),
      },
      {
        title: { en: "Read git's man file path", el: "Βρες τη διαδρομή του εγχειριδίου του git" },
        brief: { en: "cat /usr/share/man/man1/git.1", el: "cat /usr/share/man/man1/git.1" },
        success: { en: "whereis told you where the page lives.", el: "Η whereis σού έδειξε πού βρίσκεται το εγχειρίδιο." },
        check: (t) => t.filesRead.some((p) => p.includes("git.1")) || t.flags.has("whereis-git"),
      },
    ],
  },
  {
    id: "sr-search",
    order: 3,
    icon: "scan",
    color: "from-cyan-500 to-teal-900",
    difficulty: 2,
    scenario: lab,
    title: { en: "grep & find", el: "Αναζήτηση με grep και find" },
    subtitle: { en: "Filter output and hunt files", el: "Φίλτραρε αποτελέσματα και εντόπισε αρχεία" },
    badge: { en: "Needle Finder", el: "Ευρετής" },
    theory: [
      {
        heading: { en: "grep a file", el: "grep σε αρχείο" },
        body: {
          en: "grep searches for a keyword. Search for echo inside simple_bash.sh: grep -I \"echo\" simple_bash.sh  (from /root).",
          el: "Η grep αναζητά λέξεις ή μοτίβα μέσα σε αρχεία. Για να εντοπίσεις το echo στο simple_bash.sh από το /root, τρέξε grep -I \"echo\" simple_bash.sh.",
        },
        shots: [shot('grep -I "echo" simple_bash.sh', ['echo "Gamehack scanner starting"', 'echo "Sudo_Run lab — simulated only"', "# echo is here so grep can find it"])],
      },
      {
        heading: { en: "Piping into grep", el: "Pipe στο grep" },
        body: {
          en: "The most common use of grep is to filter another command. ifconfig dumps a lot; keep only inet lines: ifconfig | grep inet",
          el: "Μια συνηθισμένη χρήση της grep είναι να φιλτράρει την έξοδο άλλης εντολής. Η ifconfig εμφανίζει πολλές πληροφορίες· με την εντολή ifconfig | grep inet κρατάς μόνο τις γραμμές που περιέχουν inet.",
        },
        shots: [shot("ifconfig | grep inet", ["        inet 10.10.10.2  netmask 255.255.255.0  broadcast 10.10.10.255", "        inet6 fe80::a00:27ff:fe12:3456  prefixlen 64", "        inet 127.0.0.1  netmask 255.0.0.0"])],
      },
      {
        heading: { en: "find — the flexible hunter", el: "find — ευέλικτη αναζήτηση" },
        body: {
          en: "find is the most powerful search: name, type, owner, size, mtime… find / -type f -name gamehack starts at / (root of the tree), looking for a regular file named gamehack. (In this lab the marker file is named gamehack.) Permission denied noise: append 2>&1 | grep -v \"Permission Denied\" to hide errors you cannot read.",
          el: "Η find μπορεί να αναζητήσει αρχεία με βάση το όνομα, τον τύπο, τον ιδιοκτήτη, το μέγεθος ή τον χρόνο τροποποίησης. Η εντολή find / -type f -name gamehack ξεκινά από τη ρίζα / και εντοπίζει κανονικά αρχεία με όνομα gamehack — όπως το αρχείο-δείκτη του εργαστηρίου. Για να κρύψεις τα μηνύματα Permission denied για φακέλους που δεν μπορείς να διαβάσεις, πρόσθεσε στο τέλος: 2>&1 | grep -v \"Permission Denied\".",
        },
        shots: [
          shot("find / -type f -name gamehack", ["/opt/labs/gamehack"]),
          shot('find / -type f -name gamehack 2>&1 | grep -v "Permission Denied"', ["/opt/labs/gamehack"]),
        ],
      },
    ],
    cheats: [
      { cmd: 'grep -I "echo" simple_bash.sh', desc: { en: "search a file", el: "αναζήτηση αρχείου" } },
      { cmd: "ifconfig | grep inet", desc: { en: "filter command output", el: "φιλτράρισμα εξόδου εντολής" } },
      { cmd: "find / -type f -name gamehack", desc: { en: "hunt by name", el: "αναζήτηση με βάση το όνομα" } },
    ],
    tasks: [
      {
        id: "grep-file",
        instruction: { en: 'grep for echo in simple_bash.sh', el: "grep echo στο simple_bash.sh" },
        hint: { en: 'grep -I "echo" simple_bash.sh', el: 'grep echo simple_bash.sh' },
        explain: { en: "grep PATTERN FILE", el: "grep PATTERN FILE" },
        check: (t) => t.flags.has("grep-echo") || usedCmd(t, /grep.*echo/),
      },
      {
        id: "grep-pipe",
        instruction: { en: "ifconfig | grep inet", el: "ifconfig | grep inet" },
        hint: { en: "ifconfig | grep inet", el: "ifconfig | grep inet" },
        explain: { en: "Pipe stdout into grep.", el: "Πέρασε την έξοδο της εντολής στην grep με το σύμβολο pipe (|)." },
        check: (t) => t.flags.has("grep-inet") || usedCmd(t, /ifconfig\s*\|\s*grep/),
      },
      {
        id: "find",
        instruction: { en: "find / -type f -name gamehack", el: "find / -type f -name gamehack" },
        hint: { en: "find / -type f -name gamehack", el: "find / -type f -name gamehack" },
        explain: { en: "/ is the tree root. -type f means regular file.", el: "Η / είναι η ρίζα του συστήματος αρχείων. Η επιλογή -type f περιορίζει την αναζήτηση σε κανονικά αρχεία." },
        check: (t) => t.flags.has("find-hf") || t.flags.has("find") || usedCmd(t, /find\s+\/.*gamehack/),
      },
    ],
    challenges: [
      {
        title: { en: "Silence permission denied", el: "Απόκρυψη μηνυμάτων Permission denied" },
        brief: { en: 'find / -type f -name gamehack 2>&1 | grep -v "Permission Denied"', el: "find … 2>&1 | grep -v" },
        success: { en: "You redirected stderr and filtered it.", el: "Ανακατεύθυνες το stderr και φιλτράρισες τα μηνύματα σφάλματος." },
        check: (t) => usedCmd(t, /2>&1/) || t.flags.has("find-hf"),
      },
      {
        title: { en: "Read the marker", el: "Διάβασε τον δείκτη" },
        brief: { en: "cat /opt/labs/gamehack", el: "cat /opt/labs/gamehack" },
        success: { en: "find led you to a Gamehack flag.", el: "Η find σε οδήγησε σε ένα flag του Gamehack." },
        check: (t) => t.filesRead.some((p) => p.includes("/opt/labs/gamehack")),
      },
    ],
  },
  {
    id: "sr-files",
    order: 4,
    icon: "folder",
    color: "from-amber-400 to-orange-800",
    difficulty: 2,
    scenario: lab,
    title: { en: "Files & directories", el: "Αρχεία και φάκελοι" },
    subtitle: { en: "cat, touch, mkdir, cp, mv, rm, rmdir", el: "cat, touch, mkdir, cp, mv, rm, rmdir" },
    badge: { en: "File Clerk", el: "Οργανωτής αρχείων" },
    theory: [
      {
        heading: { en: "cat", el: "cat" },
        body: {
          en: "cat prints a file on the terminal. From /root: cat gamehack.txt  (the lab notes are stored in gamehack.txt).",
          el: "Η cat εμφανίζει το περιεχόμενο ενός αρχείου στο τερματικό. Από το /root, διάβασε τις σημειώσεις του εργαστηρίου με cat gamehack.txt.",
        },
        shots: [shot("cat gamehack.txt", ["Welcome to Gamehack — Linux for Beginners (Sudo_Run).", "Keep notes here. Practice every command in the lab, not on the internet."])],
      },
      {
        heading: { en: "touch — create a file", el: "touch — δημιουργία αρχείου" },
        body: {
          en: "touch NAME creates an empty file. Create gamehack-2.txt",
          el: "Η touch δημιουργεί ένα κενό αρχείο αν δεν υπάρχει ήδη. Δημιούργησε το gamehack-2.txt με την εντολή touch gamehack-2.txt.",
        },
        shots: [shot("touch gamehack-2.txt", ["root@kali:~# ls", "gamehack.txt  gamehack-2.txt  simple_bash.sh  ..."])],
      },
      {
        heading: { en: "mkdir", el: "mkdir" },
        body: {
          en: "mkdir creates a directory. Create Documents/ignite (a shared folder for the simulated ignite team).",
          el: "Η mkdir δημιουργεί φάκελο. Φτιάξε τον Documents/ignite, έναν κοινόχρηστο φάκελο για την εικονική ομάδα ignite.",
        },
        shots: [shot("mkdir Documents/ignite", [""])],
      },
      {
        heading: { en: "cp, mv, rm, rmdir", el: "Αντιγραφή, μετακίνηση και διαγραφή αρχείων και φακέλων" },
        body: {
          en: "cp SRC DEST copies. mv SRC DEST moves OR renames. rm FILE deletes a file. rmdir DIR removes an empty directory (use rm -r if it has contents). Walkthrough: cp gamehack-2.txt Documents/ignite   then   mv Documents/ignite/gamehack-2.txt /root/Documents/   then   rm /root/Documents/gamehack-2.txt   then   rmdir ignite_screenshots/",
          el: "Η cp αντιγράφει το SRC στο DEST, η mv μετακινεί ή μετονομάζει αρχεία, η rm διαγράφει αρχεία και η rmdir αφαιρεί μόνο άδειους φακέλους. Αν ένας φάκελος έχει περιεχόμενο, η rm -r διαγράφει και τον φάκελο και τα αρχεία του — χρησιμοποίησέ την με προσοχή. Δοκίμασε τη σειρά: cp gamehack-2.txt Documents/ignite, μετά mv Documents/ignite/gamehack-2.txt /root/Documents/, έπειτα rm /root/Documents/gamehack-2.txt και τέλος rmdir ignite_screenshots/.",
        },
        shots: [
          shot("cp gamehack-2.txt Documents/ignite", [""]),
          shot("rmdir ignite_screenshots/", [""]),
        ],
        tip: { en: "rm -r deletes a directory AND its contents. Be careful even in a lab.", el: "Η rm -r διαγράφει έναν φάκελο μαζί με όλα τα περιεχόμενά του. Έλεγξε προσεκτικά τη διαδρομή πριν την εκτελέσεις, ακόμη και στο εργαστήριο." },
      },
    ],
    cheats: [
      { cmd: "cat gamehack.txt", desc: { en: "print file", el: "εκτύπωση" } },
      { cmd: "touch gamehack-2.txt", desc: { en: "create empty file", el: "κενό αρχείο" } },
      { cmd: "mkdir Documents/ignite", desc: { en: "make directory", el: "φάκελος" } },
      { cmd: "cp FILE DIR", desc: { en: "copy", el: "αντιγραφή" } },
      { cmd: "mv SRC DEST", desc: { en: "move/rename", el: "μετακίνηση" } },
      { cmd: "rm FILE", desc: { en: "delete file", el: "διαγραφή" } },
      { cmd: "rmdir DIR", desc: { en: "delete empty dir", el: "διαγραφή κενού φακέλου" } },
    ],
    tasks: [
      {
        id: "cat",
        instruction: { en: "cat gamehack.txt", el: "cat gamehack.txt" },
        hint: { en: "cat /root/gamehack.txt", el: "cat /root/gamehack.txt" },
        explain: { en: "cat concatenates to stdout.", el: "cat στην έξοδο." },
        check: (t) => t.flags.has("cat-hf") || usedCmd(t, /cat\s+.*gamehack\.txt/),
      },
      {
        id: "touch",
        instruction: { en: "touch gamehack-2.txt", el: "touch gamehack-2.txt" },
        hint: { en: "touch gamehack-2.txt", el: "touch gamehack-2.txt" },
        explain: { en: "Creates an empty file in the current directory.", el: "Δημιουργεί ένα κενό αρχείο στον τρέχοντα φάκελο." },
        check: (t) => t.flags.has("touch-hf2") || usedCmd(t, /touch\s+.*gamehack-2/),
      },
      {
        id: "mkdir",
        instruction: { en: "mkdir Documents/ignite", el: "mkdir Documents/ignite" },
        hint: { en: "mkdir Documents/ignite", el: "mkdir Documents/ignite" },
        explain: { en: "Parent Documents already exists in the VFS.", el: "Ο γονικός φάκελος Documents υπάρχει ήδη στο εικονικό σύστημα αρχείων." },
        check: (t) => t.flags.has("mkdir-ignite") || usedCmd(t, /mkdir\s+.*ignite/),
      },
      {
        id: "cp",
        instruction: { en: "cp gamehack-2.txt Documents/ignite", el: "cp gamehack-2.txt Documents/ignite" },
        hint: { en: "cp gamehack-2.txt Documents/ignite", el: "cp …" },
        explain: { en: "cp <file> <destination>", el: "cp ΑΡΧΕΙΟ ΠΡΟΟΡΙΣΜΟΣ" },
        check: (t) => t.flags.has("cp") || usedCmd(t, /^\s*cp\b/),
      },
      {
        id: "mv",
        instruction: { en: "Move the copy with mv into /root/Documents/ (from the ignite folder or by path).", el: "Μετέφερε το αντίγραφο στον φάκελο /root/Documents/ με mv — είτε από τον φάκελο ignite είτε δίνοντας ολόκληρη τη διαδρομή." },
        hint: { en: "mv Documents/ignite/gamehack-2.txt /root/Documents/", el: "mv … /root/Documents/" },
        explain: { en: "mv moves or renames.", el: "Η mv μετακινεί ένα αρχείο ή αλλάζει το όνομά του." },
        check: (t) => t.flags.has("mv") || usedCmd(t, /^\s*mv\b/),
      },
      {
        id: "rm",
        instruction: { en: "rm the leftover gamehack-2.txt (in Documents or home).", el: "Διέγραψε με rm το gamehack-2.txt που έμεινε στο Documents ή στον προσωπικό σου φάκελο." },
        hint: { en: "rm Documents/gamehack-2.txt", el: "rm …" },
        explain: { en: "rm deletes files.", el: "Η rm διαγράφει αρχεία." },
        check: (t) => t.flags.has("rm") || usedCmd(t, /^\s*rm\b/),
      },
      {
        id: "rmdir",
        instruction: { en: "rmdir ignite_screenshots/", el: "rmdir ignite_screenshots/" },
        hint: { en: "rmdir ignite_screenshots", el: "rmdir ignite_screenshots" },
        explain: { en: "Empty dirs only. Otherwise rm -r.", el: "Η rmdir αφαιρεί μόνο άδειους φακέλους. Για φάκελο με περιεχόμενο χρειάζεται η rm -r — χρησιμοποίησέ την με ιδιαίτερη προσοχή." },
        check: (t) => t.flags.has("rmdir") || usedCmd(t, /rmdir/),
      },
    ],
    challenges: [
      {
        title: { en: "Rebuild ignite", el: "Δημιούργησε ξανά τον φάκελο ignite" },
        brief: { en: "If you removed Documents/ignite, mkdir it again. ls Documents to prove it.", el: "Αν διέγραψες τον φάκελο Documents/ignite, δημιούργησέ τον ξανά με mkdir και έλεγξε με ls Documents ότι εμφανίζεται." },
        success: { en: "You can create on demand.", el: "Μπορείς να δημιουργείς έναν φάκελο όποτε τον χρειάζεσαι." },
        check: (t) => t.flags.has("mkdir-ignite") || usedCmd(t, /ls\s+.*Documents/),
      },
      {
        title: { en: "Recursive reminder", el: "Προσοχή στην αναδρομική διαγραφή (-r)" },
        brief: { en: "Read the tip: run ls ignite_screenshots or confirm rmdir already succeeded.", el: "Έλεγξε το αποτέλεσμα με ls ignite_screenshots ή επιβεβαίωσε ότι η rmdir αφαίρεσε ήδη τον φάκελο." },
        success: { en: "Empty directory gone.", el: "Ο άδειος φάκελος αφαιρέθηκε." },
        check: (t) => t.flags.has("rmdir") || usedCmd(t, /rm\s+-r/),
      },
    ],
  },
  {
    id: "sr-text",
    order: 5,
    icon: "book",
    color: "from-fuchsia-400 to-purple-900",
    difficulty: 2,
    scenario: lab,
    title: { en: "Text manipulation", el: "Επεξεργασία κειμένου" },
    subtitle: { en: "head, tail, nl, sed, more, less", el: "head, tail, nl, sed, more, less" },
    badge: { en: "Text Smith", el: "Τεχνίτης κειμένου" },
    theory: [
      {
        heading: { en: "Almost everything is a file", el: "Σχεδόν όλα είναι αρχεία" },
        body: {
          en: "On Linux you live in text files — especially configuration. Learning to slice text is how you manage the OS. We use /etc/ettercap/etter.dns (a DNS-spoof config example from a lab tool called Ettercap). This is a FILE in the sandbox so you can practise. Using spoofing on a network you do not own is illegal.",
          el: "Στο Linux, πολλές ρυθμίσεις βρίσκονται σε αρχεία κειμένου, γι’ αυτό είναι χρήσιμο να ξέρεις να τα εξετάζεις και να τα επεξεργάζεσαι. Θα χρησιμοποιήσουμε το /etc/ettercap/etter.dns, ένα παράδειγμα ρύθμισης DNS spoofing από το εργαλείο Ettercap. Πρόκειται για αρχείο μέσα στο sandbox, για εξάσκηση μόνο. Η χρήση spoofing σε δίκτυο χωρίς άδεια είναι παράνομη.",
        },
      },
      {
        heading: { en: "head & tail", el: "Εμφάνιση αρχής και τέλους αρχείου: head και tail" },
        body: {
          en: "head FILE shows the first 10 lines by default. tail FILE shows the last 10. Try both on /etc/ettercap/etter.dns (also at /etc/Ettercap/etter.dns).",
          el: "Η head εμφανίζει τις πρώτες 10 γραμμές ενός αρχείου και η tail τις τελευταίες 10, από προεπιλογή. Δοκίμασέ τες στο /etc/ettercap/etter.dns (υπάρχει και διαδρομή με κεφαλαίο E: /etc/Ettercap/etter.dns).",
        },
        shots: [
          shot("head /etc/ettercap/etter.dns", ["# etter.dns — Gamehack lab copy of a DNS spoof config (educational)", "# This file is a TEXT example. Never use spoofing outside a lab you own.", "microsoft.com A 10.10.10.8"]),
          shot("tail /etc/ettercap/etter.dns", ["# operator workstation", "192.168.1.13 ptr kali.gamehack.lab"]),
        ],
      },
      {
        heading: { en: "nl — number lines", el: "nl — αρίθμηση γραμμών" },
        body: {
          en: "nl FILE prints the file with line numbers. nl /etc/ettercap/etter.dns",
          el: "Η nl εμφανίζει το αρχείο με αριθμημένες γραμμές. Δοκίμασέ την με nl /etc/ettercap/etter.dns.",
        },
        shots: [shot("nl /etc/ettercap/etter.dns", ["     1  # etter.dns — Gamehack lab copy of a DNS spoof config (educational)"])],
      },
      {
        heading: { en: "sed — find & replace", el: "sed — αναζήτηση και αντικατάσταση" },
        body: {
          en: "sed can search a pattern and act on it. s/WWW/www/g means substitute WWW with www, globally. Run: sed s/WWW/www/g gamehack.in",
          el: "Η sed αναζητά ένα μοτίβο και εφαρμόζει αλλαγή στο κείμενο. Η έκφραση s/WWW/www/g αντικαθιστά κάθε εμφάνιση του WWW με www· το g σημαίνει ότι η αλλαγή εφαρμόζεται σε όλη τη γραμμή. Δοκίμασε: sed s/WWW/www/g gamehack.in.",
        },
        shots: [shot("sed s/WWW/www/g gamehack.in", ["Visit www.GAMEHACK.LAB for the lab portal.", "www banners should be rewritten to www with sed.", "Linux training portal (simulated)."])],
      },
      {
        heading: { en: "more and less", el: "more και less" },
        body: {
          en: "more FILE shows one page at a time (Enter to scroll). less FILE is similar and lets you search with /keyword (in a real terminal). Here they print the file so you can practise the commands. more /etc/ettercap/etter.dns   and   less /etc/ettercap/etter.dns",
          el: "Οι more και less εμφανίζουν ένα αρχείο σε σελίδες. Σε πραγματικό τερματικό, πατάς Enter για να προχωρήσεις και q για έξοδο· με την less μπορείς επίσης να αναζητήσεις κείμενο γράφοντας /λέξη. Εδώ ο προσομοιωτής εμφανίζει προεπισκόπηση, ώστε να εξασκηθείς στις εντολές more /etc/ettercap/etter.dns και less /etc/ettercap/etter.dns.",
        },
        shots: [shot("more /etc/ettercap/etter.dns", ["# etter.dns — Gamehack lab copy …", "(page 1 — Enter would continue on a TTY)"])],
      },
    ],
    cheats: [
      { cmd: "head FILE", desc: { en: "first 10 lines", el: "πρώτες 10" } },
      { cmd: "tail FILE", desc: { en: "last 10 lines", el: "τελευταίες 10" } },
      { cmd: "nl FILE", desc: { en: "number lines", el: "αρίθμηση" } },
      { cmd: "sed s/A/B/g FILE", desc: { en: "replace A with B", el: "αντικατάσταση" } },
      { cmd: "more FILE", desc: { en: "page through", el: "σελίδες" } },
      { cmd: "less FILE", desc: { en: "page + search", el: "σελίδες + αναζήτηση" } },
    ],
    tasks: [
      {
        id: "head",
        instruction: { en: "head /etc/ettercap/etter.dns", el: "head /etc/ettercap/etter.dns" },
        hint: { en: "head /etc/ettercap/etter.dns", el: "head …" },
        explain: { en: "First ten lines.", el: "Εμφανίζει τις πρώτες δέκα γραμμές." },
        check: (t) => usedCmd(t, /^\s*head\b/) || t.flags.has("etter"),
      },
      {
        id: "tail",
        instruction: { en: "tail /etc/ettercap/etter.dns", el: "tail /etc/ettercap/etter.dns" },
        hint: { en: "tail /etc/ettercap/etter.dns", el: "tail …" },
        explain: { en: "Last ten lines.", el: "Εμφανίζει τις τελευταίες δέκα γραμμές." },
        check: (t) => usedCmd(t, /^\s*tail\b/),
      },
      {
        id: "nl",
        instruction: { en: "nl /etc/ettercap/etter.dns", el: "nl /etc/ettercap/etter.dns" },
        hint: { en: "nl /etc/ettercap/etter.dns", el: "nl …" },
        explain: { en: "Numbers every line.", el: "Αριθμεί κάθε γραμμή του αρχείου." },
        check: (t) => t.flags.has("nl") || usedCmd(t, /^\s*nl\b/),
      },
      {
        id: "sed",
        instruction: { en: "sed s/WWW/www/g gamehack.in", el: "sed s/WWW/www/g gamehack.in" },
        hint: { en: "sed s/WWW/www/g /root/gamehack.in", el: "sed s/WWW/www/g /root/gamehack.in" },
        explain: { en: "/g = replace every occurrence.", el: "Η επιλογή /g αντικαθιστά κάθε εμφάνιση στη γραμμή." },
        check: (t) => t.flags.has("sed-www") || usedCmd(t, /sed\s+s\/WWW\/www/),
      },
      {
        id: "more",
        instruction: { en: "more /etc/ettercap/etter.dns", el: "more /etc/ettercap/etter.dns" },
        hint: { en: "more /etc/ettercap/etter.dns", el: "more …" },
        explain: { en: "Pager.", el: "Εργαλείο προβολής αρχείων σε σελίδες." },
        check: (t) => usedCmd(t, /^\s*more\b/),
      },
      {
        id: "less",
        instruction: { en: "less /etc/ettercap/etter.dns", el: "less /etc/ettercap/etter.dns" },
        hint: { en: "less /etc/ettercap/etter.dns", el: "less …" },
        explain: { en: "less can search with / in a real TTY.", el: "Σε πραγματικό τερματικό, μπορείς να αναζητήσεις κείμενο στην less πληκτρολογώντας / και τη λέξη που ψάχνεις." },
        check: (t) => usedCmd(t, /^\s*less\b/),
      },
    ],
    challenges: [
      {
        title: { en: "Both etter paths", el: "Έλεγξε και τις δύο διαδρομές του etter.dns" },
        brief: { en: "head /etc/Ettercap/etter.dns  (capital E, as in some installs)", el: "head /etc/Ettercap/etter.dns" },
        success: { en: "Linux paths are case-sensitive. We aliased both.", el: "Στο Linux, τα ονόματα διαδρομών κάνουν διάκριση πεζών και κεφαλαίων. Στο εργαστήριο υποστηρίζονται και οι δύο μορφές." },
        check: (t) => usedCmd(t, /Ettercap/) || t.flags.has("etter"),
      },
      {
        title: { en: "Prove sed", el: "Επιβεβαίωσε την αντικατάσταση με sed" },
        brief: { en: "Re-run sed so WWW becomes www on gamehack.in", el: "Τρέξε ξανά τη sed για να αντικαταστήσεις το WWW με www στο gamehack.in." },
        success: { en: "Substitution is non-destructive unless you redirect.", el: "Χωρίς ανακατεύθυνση εξόδου, η sed εμφανίζει το τροποποιημένο κείμενο αλλά δεν αλλάζει το αρχικό αρχείο." },
        check: (t) => t.flags.has("sed"),
      },
    ],
  },
];

export const SUDO_RUN_ALL: Module[] = [...SUDO_RUN_MODULES, ...SUDO_RUN_MODULES_B, ...SUDO_RUN_MODULES_C];
