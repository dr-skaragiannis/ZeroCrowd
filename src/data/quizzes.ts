import type { Bi } from "./lessons";

export type QuizQ = {
  q: Bi;
  choices: Bi[];
  answer: number;
  why: Bi;
};

export const QUIZZES: Record<string, QuizQ[]> = {
  "linux-basics": [
    {
      q: { en: "What does the $ at the end of a bash prompt mean?", el: "Τι δείχνει το σύμβολο $ στο τέλος της γραμμής εντολών του Bash;" },
      choices: [
        { en: "You are root", el: "Είσαι root" },
        { en: "You are a normal user", el: "Είσαι απλός χρήστης" },
        { en: "The disk is full", el: "Ο δίσκος είναι γεμάτος" },
        { en: "SSH is connected", el: "Το SSH είναι συνδεδεμένο" },
      ],
      answer: 1,
      why: { en: "$ = unprivileged user. # = root.", el: "Το $ συνήθως δηλώνει απλό χρήστη χωρίς αυξημένα δικαιώματα· το # δηλώνει συνεδρία root." },
    },
    {
      q: { en: "Which command prints the current directory?", el: "Ποια εντολή εμφανίζει τον τρέχοντα φάκελο;" },
      choices: [
        { en: "whoami", el: "whoami" },
        { en: "ls", el: "ls" },
        { en: "pwd", el: "pwd" },
        { en: "cd", el: "cd" },
      ],
      answer: 2,
      why: { en: "pwd = print working directory.", el: "Η pwd είναι συντομογραφία του print working directory («εμφάνιση του τρέχοντος φακέλου εργασίας»)." },
    },
    {
      q: { en: "How do you list hidden files?", el: "Πώς εμφανίζεις τα κρυφά αρχεία;" },
      choices: [
        { en: "ls -h", el: "ls -h" },
        { en: "ls -a", el: "ls -a" },
        { en: "ls hidden", el: "ls hidden" },
        { en: "cat -a", el: "cat -a" },
      ],
      answer: 1,
      why: { en: "ls -a shows names that start with a dot.", el: "Η ls -a εμφανίζει και τα κρυφά αρχεία, των οποίων τα ονόματα αρχίζουν με τελεία." },
    },
  ],
  files: [
    {
      q: { en: "An absolute path always starts with…", el: "Με ποιο σύμβολο ξεκινά πάντα μια απόλυτη διαδρομή;" },
      choices: [
        { en: "~", el: "~" },
        { en: "/", el: "/" },
        { en: ".", el: "." },
        { en: "$HOME", el: "$HOME" },
      ],
      answer: 1,
      why: { en: "Absolute paths begin at the filesystem root /.", el: "Οι απόλυτες διαδρομές ξεκινούν από τη ρίζα του συστήματος αρχείων, τη /." },
    },
    {
      q: { en: "grep PATTERN file does what?", el: "Τι κάνει η εντολή grep PATTERN file;" },
      choices: [
        { en: "Deletes matching lines", el: "Διαγράφει γραμμές" },
        { en: "Searches file contents for PATTERN", el: "Αναζητά το μοτίβο PATTERN μέσα στο αρχείο." },
        { en: "Renames the file", el: "Μετονομάζει το αρχείο" },
        { en: "Changes permissions", el: "Αλλάζει δικαιώματα" },
      ],
      answer: 1,
      why: { en: "grep filters lines that match a pattern.", el: "Η grep εμφανίζει μόνο τις γραμμές που ταιριάζουν με το συγκεκριμένο μοτίβο." },
    },
    {
      q: { en: "Which file lists local user accounts?", el: "Ποιο αρχείο περιέχει τη λίστα των τοπικών λογαριασμών χρηστών;" },
      choices: [
        { en: "/etc/shadow", el: "/etc/shadow" },
        { en: "/etc/passwd", el: "/etc/passwd" },
        { en: "/etc/group", el: "/etc/group" },
        { en: "/home/users", el: "/home/users" },
      ],
      answer: 1,
      why: { en: "/etc/passwd is world-readable and lists users. /etc/shadow holds hashes and is root-only.", el: "Το /etc/passwd είναι αναγνώσιμο από όλους και περιέχει τους λογαριασμούς χρηστών. Το /etc/shadow αποθηκεύει hashes κωδικών και είναι προσβάσιμο μόνο από τον root." },
    },
  ],
  permissions: [
    {
      q: { en: "In -rwxr-xr--, what can 'others' do?", el: "Τι δικαιώματα έχουν οι υπόλοιποι χρήστες στο -rwxr-xr--;" },
      choices: [
        { en: "read, write, execute", el: "ανάγνωση, εγγραφή, εκτέλεση" },
        { en: "read only", el: "μόνο ανάγνωση" },
        { en: "nothing", el: "τίποτα" },
        { en: "execute only", el: "μόνο εκτέλεση" },
      ],
      answer: 1,
      why: { en: "The last triple is r-- : read only for others.", el: "Η τελευταία τριάδα είναι r--; οι υπόλοιποι χρήστες μπορούν μόνο να διαβάζουν το αρχείο." },
    },
    {
      q: { en: "sudo -l shows…", el: "Τι εμφανίζει η εντολή sudo -l;" },
      choices: [
        { en: "Last logins", el: "Τελευταίες συνδέσεις" },
        { en: "Commands you may run as root", el: "Εντολές που επιτρέπεται να εκτελείς με δικαιώματα root" },
        { en: "Listening ports", el: "Θύρες σε ακρόαση" },
        { en: "Kernel modules", el: "Μονάδες πυρήνα" },
      ],
      answer: 1,
      why: { en: "sudo -l lists your sudo privileges — a key privesc check.", el: "Η εντολή sudo -l εμφανίζει ποιες εντολές επιτρέπεται να εκτελείς μέσω sudo και αποτελεί βασικό έλεγχο για πιθανή κλιμάκωση προνομίων." },
    },
    {
      q: { en: "Why is /etc/shadow not world-readable?", el: "Γιατί το /etc/shadow δεν είναι αναγνώσιμο από όλους;" },
      choices: [
        { en: "It is empty", el: "Είναι άδειο" },
        { en: "It stores password hashes", el: "Αποθηκεύει hashes κωδικών πρόσβασης" },
        { en: "It is a binary", el: "Είναι binary" },
        { en: "SELinux forbids it always", el: "Το SELinux το απαγορεύει πάντα" },
      ],
      answer: 1,
      why: { en: "Hashes can be cracked offline if leaked.", el: "Αν διαρρεύσουν hashes, μπορούν να δοκιμαστούν εκτός σύνδεσης με υποψήφιους κωδικούς." },
    },
  ],
  networking: [
    {
      q: { en: "What does ping test?", el: "Τι ελέγχει η εντολή ping;" },
      choices: [
        { en: "Open TCP ports", el: "Ανοιχτές TCP θύρες" },
        { en: "ICMP echo connectivity", el: "Συνδεσιμότητα μέσω ICMP echo" },
        { en: "DNSSEC", el: "DNSSEC" },
        { en: "TLS certificates", el: "Πιστοποιητικά TLS" },
      ],
      answer: 1,
      why: { en: "Ping sends ICMP echo requests. Hosts may block ICMP and still be up.", el: "Η εντολή ping στέλνει αιτήματα ICMP echo. Ένας υπολογιστής μπορεί να είναι ενεργός ακόμη κι αν τα μπλοκάρει." },
    },
    {
      q: { en: "10.10.10.0/24 contains how many addresses?", el: "Πόσες διευθύνσεις περιλαμβάνει το δίκτυο 10.10.10.0/24;" },
      choices: [
        { en: "24", el: "24" },
        { en: "256", el: "256" },
        { en: "10", el: "10" },
        { en: "65536", el: "65536" },
      ],
      answer: 1,
      why: { en: "/24 means 8 host bits → 256 addresses (254 usable).", el: "Το /24 αφήνει 8 bits για διευθύνσεις host, δηλαδή 256 συνολικά — συνήθως 254 διαθέσιμες για συσκευές." },
    },
    {
      q: { en: "Scanning a network you do not own is…", el: "Τι ισχύει αν σαρώσεις δίκτυο που δεν σου ανήκει;" },
      choices: [
        { en: "Always fine", el: "Πάντα εντάξει" },
        { en: "A crime without permission", el: "Έγκλημα χωρίς άδεια" },
        { en: "Required by ISO", el: "Υποχρεωτική από ISO" },
        { en: "Only illegal on port 22", el: "Παράνομη μόνο στη θύρα 22" },
      ],
      answer: 1,
      why: { en: "Get written permission. GAMEHACK is a sandbox.", el: "Σάρωσε μόνο με γραπτή άδεια. Το Gamehack παρέχει απομονωμένο περιβάλλον εξάσκησης." },
    },
  ],
  recon: [
    {
      q: { en: "Passive recon means…", el: "Τι σημαίνει παθητική αναγνώριση πληροφοριών (passive recon);" },
      choices: [
        { en: "Sending nmap SYN packets", el: "Αποστολή nmap SYN" },
        { en: "Using public data without touching the target", el: "Δημόσια δεδομένα χωρίς επαφή με τον στόχο" },
        { en: "DDoS", el: "DDoS" },
        { en: "Exploiting a CVE", el: "Εκμετάλλευση CVE" },
      ],
      answer: 1,
      why: { en: "Passive = OSINT, DNS, archives. Active = packets to the target.", el: "Η παθητική αναγνώριση βασίζεται σε OSINT, DNS και αρχεία· η ενεργητική αναγνώριση στέλνει πακέτα στον στόχο." },
    },
    {
      q: { en: "nmap 10.10.10.0/24 is primarily a…", el: "Ποιος είναι ο βασικός σκοπός της εντολής nmap 10.10.10.0/24;" },
      choices: [
        { en: "Web exploit", el: "Εκμετάλλευση ευπάθειας σε εφαρμογή ιστού" },
        { en: "Subnet host discovery", el: "Εντοπισμός συστημάτων στο υποδίκτυο" },
        { en: "Password crack", el: "Σπάσιμο κωδικού" },
        { en: "Rootkit", el: "Rootkit" },
      ],
      answer: 1,
      why: { en: "A sweep finds live hosts before you port-scan one of them.", el: "Το ping sweep εντοπίζει ενεργά συστήματα πριν ελέγξεις τις θύρες τους." },
    },
    {
      q: { en: "You should only scan…", el: "Ποια συστήματα επιτρέπεται να σαρώσεις;" },
      choices: [
        { en: "Famous companies", el: "Διάσημες εταιρείες" },
        { en: "In-scope systems you are allowed to test", el: "Συστήματα που περιλαμβάνονται στο πεδίο ελέγχου και για τα οποία έχεις άδεια" },
        { en: "Anything with port 80", el: "Οτιδήποτε με θύρα 80" },
        { en: "Random /8s", el: "Τυχαία /8" },
      ],
      answer: 1,
      why: { en: "Scope and permission are non-negotiable.", el: "Πριν από κάθε έλεγχο, όρισε με σαφήνεια το πεδίο και εξασφάλισε άδεια." },
    },
  ],
  scanning: [
    {
      q: { en: "nmap -sV is used to…", el: "Σε τι χρησιμεύει η επιλογή nmap -sV;" },
      choices: [
        { en: "DDoS a host", el: "DDoS" },
        { en: "Detect service versions", el: "Ανίχνευση εκδόσεων υπηρεσιών" },
        { en: "Disable a firewall", el: "Απενεργοποίηση του τείχους προστασίας" },
        { en: "Crack hashes", el: "Σπάσιμο hashes" },
      ],
      answer: 1,
      why: { en: "-sV probes banners so you know which software (and version) answers.", el: "Η επιλογή -sV εξετάζει τα banners των υπηρεσιών, ώστε να αναγνωρίσεις το λογισμικό και την έκδοσή του." },
    },
    {
      q: { en: "An open port 22 typically means…", el: "Τι υποδηλώνει συνήθως η ανοιχτή θύρα 22;" },
      choices: [
        { en: "HTTP", el: "HTTP" },
        { en: "SSH", el: "SSH" },
        { en: "SMTP", el: "SMTP" },
        { en: "RDP", el: "RDP" },
      ],
      answer: 1,
      why: { en: "22/tcp is the IANA port for SSH.", el: "Η θύρα TCP 22 είναι η καθιερωμένη θύρα του SSH." },
    },
    {
      q: { en: "Why grab HTTP with curl during scanning?", el: "Γιατί χρησιμοποιούμε την curl για να εξετάσουμε HTTP κατά τη σάρωση;" },
      choices: [
        { en: "To mine bitcoin", el: "Για bitcoin" },
        { en: "To read banners, titles, tech stack clues", el: "Για να δεις banners, τίτλους και ενδείξεις για τις τεχνολογίες που χρησιμοποιούνται" },
        { en: "To wipe logs", el: "Για να διαγράψεις τα αρχεία καταγραφής" },
        { en: "It is required by TCP", el: "Απαιτείται από το TCP" },
      ],
      answer: 1,
      why: { en: "A homepage often leaks CMS names and versions.", el: "Η αρχική σελίδα μπορεί να αποκαλύψει το CMS και την έκδοσή του." },
    },
  ],
  bruteforce: [
    {
      q: { en: "A dictionary attack tries…", el: "Τι δοκιμάζει μια επίθεση με λεξικό;" },
      choices: [
        { en: "Every possible byte", el: "Κάθε δυνατή τιμή byte" },
        { en: "Passwords from a list of likely values", el: "Κωδικούς από λίστα πιθανών τιμών" },
        { en: "Only the empty password", el: "Μόνο κενό κωδικό" },
        { en: "TLS session keys", el: "Κλειδιά TLS" },
      ],
      answer: 1,
      why: { en: "Dictionaries are faster than true brute force because humans pick predictable passwords.", el: "Οι επιθέσεις με λεξικό είναι συνήθως ταχύτερες από την πλήρη εξαντλητική δοκιμή, επειδή οι άνθρωποι επιλέγουν συχνά προβλέψιμους κωδικούς." },
    },
    {
      q: { en: "Best defence against SSH password sprays?", el: "Ποια είναι η αποτελεσματικότερη άμυνα απέναντι σε διαδοχικές δοκιμές κωδικών μέσω SSH (password spraying);" },
      choices: [
        { en: "A longer MOTD", el: "Μεγαλύτερο MOTD" },
        { en: "Disable passwords, use keys + MFA, rate-limit", el: "Απενεργοποίησε τη σύνδεση με κωδικό, χρησιμοποίησε κλειδιά και MFA και βάλε όριο στις προσπάθειες" },
        { en: "Open port 22 to the world", el: "Άνοιγμα 22 στον κόσμο" },
        { en: "Use telnet instead", el: "Telnet" },
      ],
      answer: 1,
      why: { en: "Key-only SSH plus monitoring makes hydra-style attacks fail loudly.", el: "Η σύνδεση SSH μόνο με κλειδιά, μαζί με την παρακολούθηση, περιορίζει τις επιθέσεις δοκιμής κωδικών και βοηθά να εντοπίζονται." },
    },
    {
      q: { en: "Running hydra against a random internet host is…", el: "Τι ισχύει αν εκτελέσεις το hydra εναντίον ενός τυχαίου host στο Internet;" },
      choices: [
        { en: "Fine if you are curious", el: "ΟΚ αν είσαι περίεργος" },
        { en: "Illegal without authorisation", el: "Παράνομο χωρίς εξουσιοδότηση" },
        { en: "A NIST requirement", el: "Απαίτηση NIST" },
        { en: "Only rude", el: "Απλώς αγενές" },
      ],
      answer: 1,
      why: { en: "Credential attacks without permission are a crime. Lab only.", el: "Οι επιθέσεις σε διαπιστευτήρια χωρίς άδεια είναι παράνομες. Εξασκήσου μόνο σε εργαστήριο." },
    },
  ],
  sqli: [
    {
      q: { en: "SQL injection happens when…", el: "Πότε προκύπτει SQL injection (SQLi);" },
      choices: [
        { en: "TLS is too new", el: "Το TLS είναι νέο" },
        { en: "Untrusted input is concatenated into a query", el: "Μη έμπιστη είσοδος μπαίνει σε ερώτημα" },
        { en: "The DB is PostgreSQL", el: "Η βάση είναι PostgreSQL" },
        { en: "The server uses IPv6", el: "Ο διακομιστής χρησιμοποιεί IPv6" },
      ],
      answer: 1,
      why: { en: "Fix: parameterised queries / prepared statements, never string concat.", el: "Χρησιμοποίησε παραμετροποιημένα ερωτήματα ή prepared statements· μην κατασκευάζεις SQL ενώνοντας συμβολοσειρές εισόδου." },
    },
    {
      q: { en: "A single quote in an id= parameter is often used to…", el: "Γιατί δοκιμάζουν συχνά ένα μονό εισαγωγικό σε παράμετρο id=;" },
      choices: [
        { en: "Beautify HTML", el: "Ομορφαίνει HTML" },
        { en: "Test if the query syntax breaks", el: "Ελέγχει αν σπάει η σύνταξη" },
        { en: "Enable HTTP/2", el: "Ενεργοποιεί HTTP/2" },
        { en: "Reset a password", el: "Επαναφέρει έναν κωδικό" },
      ],
      answer: 1,
      why: { en: "A syntax error (or odd response) is a detection signal — in a lab.", el: "Ένα σφάλμα σύνταξης ή μια ασυνήθιστη απόκριση μπορεί να αποτελεί ένδειξη ευπάθειας — έλεγξέ το μόνο σε εξουσιοδοτημένο εργαστήριο." },
    },
    {
      q: { en: "The defender's first control against SQLi is…", el: "Ποιο είναι το πρώτο μέτρο άμυνας απέναντι σε SQLi;" },
      choices: [
        { en: "More RAM", el: "Περισσότερη RAM" },
        { en: "Parameterised queries and least-privilege DB users", el: "Παραμετροποιημένα ερωτήματα και λογαριασμοί βάσης με τα ελάχιστα απαραίτητα δικαιώματα" },
        { en: "Disabling HTTPS", el: "Απενεργοποίηση HTTPS" },
        { en: "Using FTP", el: "FTP" },
      ],
      answer: 1,
      why: { en: "ORMs + bound parameters + a DB account that cannot DROP TABLE.", el: "Χρησιμοποίησε ORM και δεσμευμένες παραμέτρους, και περιόρισε τον λογαριασμό βάσης ώστε να μην μπορεί να εκτελέσει DROP TABLE." },
    },
  ],
  privesc: [
    {
      q: { en: "Privilege escalation is…", el: "Τι είναι η κλιμάκωση προνομίων;" },
      choices: [
        { en: "The first packet you send", el: "Το πρώτο πακέτο που στέλνεις" },
        { en: "Moving from a low user to a more powerful one", el: "Μετάβαση από λογαριασμό με περιορισμένα δικαιώματα σε λογαριασμό με περισσότερα" },
        { en: "Buying a bigger NIC", el: "Μεγαλύτερο NIC" },
        { en: "Changing DNS", el: "Αλλαγή DNS" },
      ],
      answer: 1,
      why: { en: "After a foothold, enumerate sudo, SUID, cron, kernel.", el: "Μετά την αρχική πρόσβαση, έλεγξε τα δικαιώματα sudo, τα SUID αρχεία, τις εργασίες cron και την έκδοση του πυρήνα." },
    },
    {
      q: { en: "Why is `sudo find` dangerous?", el: "Γιατί μπορεί να είναι επικίνδυνη η εντολή sudo find;" },
      choices: [
        { en: "find is slow", el: "Το find είναι αργό" },
        { en: "It can execute commands as root (GTFOBins)", el: "Μπορεί να εκτελέσει εντολές ως root" },
        { en: "It deletes /", el: "Διαγράφει το /" },
        { en: "It disables SELinux", el: "Κλείνει SELinux" },
      ],
      answer: 1,
      why: { en: "Many Unix tools have breakout flags. Don't sudo them.", el: "Πολλά εργαλεία Unix επιτρέπουν έξοδο σε shell ή εκτέλεση άλλων εντολών. Μην τους δίνεις άσκοπα δικαιώματα sudo." },
    },
    {
      q: { en: "Least privilege means…", el: "Τι σημαίνει η αρχή των ελάχιστων προνομίων (least privilege);" },
      choices: [
        { en: "Everyone is root", el: "Όλοι είναι root" },
        { en: "Grant only the rights needed to do the job", el: "Δώσε μόνο τα απαραίτητα δικαιώματα" },
        { en: "Disable logging", el: "Κλείσε logging" },
        { en: "Share one password", el: "Ένας κοινός κωδικός" },
      ],
      answer: 1,
      why: { en: "The smaller the sudoers file, the smaller the blast radius.", el: "Όσο λιγότερες εξαιρέσεις περιέχει η ρύθμιση sudoers, τόσο μικρότερη είναι η ζημιά από πιθανή κατάχρηση." },
    },
  ],
  "raven-recon": [
    {
      q: { en: "A boot2root box is designed to be…", el: "Για τι είδους περιβάλλον έχει σχεδιαστεί ένα boot2root μηχάνημα;" },
      choices: [
        { en: "A production bank", el: "Τράπεζα παραγωγής" },
        { en: "A legal playground from scan to root", el: "Νόμιμο εργαστήριο: από την αναγνώριση έως την απόκτηση δικαιωμάτων root" },
        { en: "A CDN", el: "CDN" },
        { en: "An ISP core", el: "Πυρήνας ISP" },
      ],
      answer: 1,
      why: { en: "CTF / lab machines exist so you never touch live systems.", el: "Τα CTF και τα εργαστήρια προσφέρουν ασφαλή χώρο εξάσκησης, χωρίς να χρειάζεται να δοκιμάζεις τεχνικές σε πραγματικά συστήματα." },
    },
    {
      q: { en: "Typical first step on a new box?", el: "Ποιο είναι συνήθως το πρώτο βήμα σε ένα νέο μηχάνημα CTF;" },
      choices: [
        { en: "Format the disk", el: "Format" },
        { en: "Recon / port scan", el: "Αναγνώριση / σάρωση θυρών" },
        { en: "Email the CEO", el: "Email στον CEO" },
        { en: "Buy zero-days", el: "Αγορά 0-days" },
      ],
      answer: 1,
      why: { en: "Don't skip recon. You cannot exploit a service you have not found.", el: "Μην παραλείπεις την αναγνώριση: δεν μπορείς να ελέγξεις μια υπηρεσία που δεν έχεις πρώτα εντοπίσει." },
    },
    {
      q: { en: "Raven in this lab speaks which services?", el: "Ποιες υπηρεσίες είναι διαθέσιμες στον Raven σε αυτό το εργαστήριο;" },
      choices: [
        { en: "Only FTP", el: "Μόνο FTP" },
        { en: "SSH and HTTP", el: "SSH και HTTP" },
        { en: "Only RDP", el: "Μόνο RDP" },
        { en: "SIP", el: "SIP" },
      ],
      answer: 1,
      why: { en: "Your nmap -sV showed 22 and 80.", el: "Η σάρωση με nmap -sV εντόπισε τις θύρες 22 (SSH) και 80 (HTTP)." },
    },
  ],
  "raven-foothold": [
    {
      q: { en: "A foothold is…", el: "Τι σημαίνει αρχική πρόσβαση (foothold) σε μια δοκιμή διείσδυσης;" },
      choices: [
        { en: "Root on day one, always", el: "Απόκτηση root από την πρώτη μέρα" },
        { en: "An initial working access (often a user shell)", el: "Αρχική πρόσβαση που λειτουργεί, συχνά με κέλυφος χρήστη" },
        { en: "A firewall rule", el: "Κανόνας τείχους προστασίας" },
        { en: "A SIEM alert", el: "Ειδοποίηση SIEM" },
      ],
      answer: 1,
      why: { en: "Then you enumerate locally for privesc.", el: "Έπειτα, κάνεις τοπική απαρίθμηση για να εντοπίσεις πιθανές διαδρομές κλιμάκωσης προνομίων." },
    },
    {
      q: { en: "user.txt on a CTF box usually sits in…", el: "Πού βρίσκεται συνήθως το user.txt σε ένα μηχάνημα CTF;" },
      choices: [
        { en: "/proc", el: "/proc" },
        { en: "The low-priv user's home", el: "Το home του χαμηλού χρήστη" },
        { en: "BIOS", el: "BIOS" },
        { en: "The NTP pool", el: "NTP pool" },
      ],
      answer: 1,
      why: { en: "Convention: /home/<user>/user.txt proves foothold.", el: "Στα CTF, το /home/<user>/user.txt συνήθως επιβεβαιώνει ότι απέκτησες αρχική πρόσβαση ως χρήστης." },
    },
    {
      q: { en: "Why do CTF passwords appear in wordlists?", el: "Γιατί εμφανίζονται κωδικοί CTF σε λίστες λέξεων;" },
      choices: [
        { en: "To train the dictionary-attack lesson", el: "Για εξάσκηση στις επιθέσεις λεξικού" },
        { en: "Because AES is broken", el: "Γιατί έσπασε το AES" },
        { en: "Random chance", el: "Τύχη" },
        { en: "IPv4 shortage", el: "Έλλειψη IPv4" },
      ],
      answer: 0,
      why: { en: "They teach a pattern. Real systems must not reuse those words.", el: "Οι λίστες CTF σε βοηθούν να αναγνωρίζεις μοτίβα· οι πραγματικοί κωδικοί δεν πρέπει να επαναχρησιμοποιούνται." },
    },
  ],
  "raven-web": [
    {
      q: { en: "Why loot /var/www/html/config.php?", el: "Γιατί αξίζει να εξετάσεις το /var/www/html/config.php;" },
      choices: [
        { en: "It is pretty", el: "Είναι όμορφο" },
        { en: "App configs often store DB credentials", el: "Συχνά έχει διαπιστευτήρια βάσης" },
        { en: "PHP cannot run without being read", el: "Η PHP δεν τρέχει αλλιώς" },
        { en: "It disables ASLR", el: "Κλείνει ASLR" },
      ],
      answer: 1,
      why: { en: "Secrets in web roots are a classic finding.", el: "Αρχεία ρυθμίσεων σε web root μπορεί να περιέχουν διαπιστευτήρια ή άλλα μυστικά." },
    },
    {
      q: { en: "SQL dumps in /var/backups are dangerous because…", el: "Γιατί είναι επικίνδυνα τα αντίγραφα βάσεων SQL στο /var/backups;" },
      choices: [
        { en: "They slow cron", el: "Αργό cron" },
        { en: "They often contain users, hashes, PII", el: "Συχνά περιέχουν λογαριασμούς, hashes και προσωπικά δεδομένα" },
        { en: "They use UTF-16", el: "UTF-16" },
        { en: "tar is illegal", el: "Το tar είναι παράνομο" },
      ],
      answer: 1,
      why: { en: "Encrypt backups and restrict who can read them.", el: "Κρυπτογράφησε τα αντίγραφα ασφαλείας και περιόρισε την πρόσβαση μόνο σε όσους τη χρειάζονται." },
    },
    {
      q: { en: "crontab running a user-writable script as root is…", el: "Τι κίνδυνο δημιουργεί ένα script εγγράψιμο από χρήστη, αν εκτελείται ως root μέσω crontab;" },
      choices: [
        { en: "A hardening win", el: "Νίκη hardening" },
        { en: "A privilege-escalation footgun", el: "Παγίδα που μπορεί να οδηγήσει σε κλιμάκωση προνομίων" },
        { en: "Required by PCI", el: "Απαίτηση PCI" },
        { en: "Unrelated to security", el: "Άσχετο" },
      ],
      answer: 1,
      why: { en: "If I can edit what root executes, I am root.", el: "Αν ένας χρήστης μπορεί να τροποποιήσει script που εκτελεί ο root, μπορεί να αποκτήσει δικαιώματα root." },
    },
  ],
  "raven-root": [
    {
      q: { en: "World-writable + executed by root equals…", el: "Τι μπορεί να συμβεί αν ο root εκτελέσει αρχείο εγγράψιμο από όλους;" },
      choices: [
        { en: "Secure by default", el: "Ασφάλεια από προεπιλογή" },
        { en: "Game over for the box", el: "Πλήρης έλεγχος του συστήματος" },
        { en: "Faster backups", el: "Ταχύτερα αντίγραφα ασφαλείας" },
        { en: "A SELinux success", el: "Επιτυχής έλεγχος από το SELinux" },
      ],
      answer: 1,
      why: { en: "Lock modes to 750/640 owned by root.", el: "Περιόρισε τα δικαιώματα, για παράδειγμα σε 750 ή 640, και βεβαιώσου ότι ιδιοκτήτης είναι ο root." },
    },
    {
      q: { en: "root.txt conventionally proves…", el: "Τι αποδεικνύει συνήθως το root.txt σε ένα CTF;" },
      choices: [
        { en: "You rebooted", el: "Κάνεις reboot" },
        { en: "You achieved root on the box", el: "Πέτυχες root" },
        { en: "DNS works", el: "Δουλεύει το DNS" },
        { en: "IPv6 is on", el: "IPv6 on" },
      ],
      answer: 1,
      why: { en: "That's the boot2root finish line.", el: "Η ανάγνωση του root.txt σηματοδοτεί την ολοκλήρωση της πρόκλησης boot2root." },
    },
    {
      q: { en: "After rooting a lab, you should…", el: "Τι πρέπει να κάνεις αφού αποκτήσεις δικαιώματα root σε ένα εργαστήριο;" },
      choices: [
        { en: "Attack the next random IP you know", el: "Χτυπήσεις την επόμενη τυχαία IP" },
        { en: "Write notes and stay inside authorised scope", el: "Κράτα σημειώσεις και μείνε εντός του εγκεκριμένου πεδίου" },
        { en: "Post real customer data", el: "Δημοσιεύσεις δεδομένα πελατών" },
        { en: "Disable all logging everywhere", el: "Κλείσεις όλα τα logs" },
      ],
      answer: 1,
      why: { en: "The oath still holds when you are good at this.", el: "Οι κανόνες δεοντολογίας ισχύουν πάντα, όσο έμπειρος κι αν γίνεις." },
    },
  ],
  "ssh-keys": [
    {
      q: { en: "Private SSH keys should be mode…", el: "Τι δικαιώματα πρέπει να έχουν τα ιδιωτικά κλειδιά SSH;" },
      choices: [
        { en: "777", el: "777" },
        { en: "600 (owner read/write only)", el: "600 (μόνο ο ιδιοκτήτης)" },
        { en: "644", el: "644" },
        { en: "000", el: "000" },
      ],
      answer: 1,
      why: { en: "ssh refuses keys that are group/world-readable.", el: "Το SSH απορρίπτει ιδιωτικά κλειδιά που είναι αναγνώσιμα από την ομάδα ή από όλους." },
    },
    {
      q: { en: "~/.ssh/config Host stanzas let you…", el: "Τι σου επιτρέπουν να ορίσεις οι εγγραφές Host στο ~/.ssh/config;" },
      choices: [
        { en: "Mine crypto", el: "Mining" },
        { en: "Alias hostnames, users, keys, ProxyJump", el: "Συντομεύσεις για ονόματα host, χρήστες, κλειδιά και ProxyJump" },
        { en: "Bypass MFA always", el: "Παράκαμψη MFA" },
        { en: "Open SMTP", el: "SMTP" },
      ],
      answer: 1,
      why: { en: "Config turns ugly one-liners into ssh jump.", el: "Με το ~/.ssh/config αποθηκεύεις τις ρυθμίσεις σύνδεσης, ώστε μια περίπλοκη εντολή SSH να γίνεται πιο απλή." },
    },
    {
      q: { en: "ssh -i file specifies…", el: "Τι καθορίζει η επιλογή ssh -i file;" },
      choices: [
        { en: "An identity (private key) file", el: "Αρχείο ταυτότητας (ιδιωτικό κλειδί)" },
        { en: "An iptables rule", el: "Κανόνα iptables" },
        { en: "Idle timeout", el: "Χρονικό όριο αδράνειας" },
        { en: "IPv6 only", el: "Μόνο IPv6" },
      ],
      answer: 0,
      why: { en: "-i identity_file.", el: "Η επιλογή -i ορίζει το αρχείο ταυτότητας (συνήθως το ιδιωτικό κλειδί) που θα χρησιμοποιήσει το SSH." },
    },
  ],
  "ssh-hop": [
    {
      q: { en: "ProxyJump (-J) is used to…", el: "Για ποιον σκοπό χρησιμοποιείται το ProxyJump (-J);" },
      choices: [
        { en: "Jump through a bastion to an internal host", el: "Σύνδεση σε εσωτερικό σύστημα μέσω bastion" },
        { en: "Upgrade RAM", el: "Αναβάθμιση RAM" },
        { en: "Disable keys", el: "Απενεργοποίηση κλειδιών" },
        { en: "Scan /24s faster", el: "Ταχύτερη σάρωση /24" },
      ],
      answer: 0,
      why: { en: "ssh -J bastion user@internal", el: "Με την εντολή ssh -J bastion user@internal, η σύνδεση περνά πρώτα από τον bastion και μετά φτάνει στο εσωτερικό σύστημα." },
    },
    {
      q: { en: "Bastion hosts should have…", el: "Ποια μέτρα προστασίας χρειάζονται οι bastion hosts;" },
      choices: [
        { en: "Wide outbound any/any", el: "Απεριόριστη εξερχόμενη κίνηση προς κάθε προορισμό" },
        { en: "MFA, monitoring, tight egress", el: "MFA, παρακολούθηση και αυστηρός περιορισμός της εξερχόμενης κίνησης" },
        { en: "Telnet enabled", el: "Telnet" },
        { en: "Shared root passwords on sticky notes", el: "Κοινός κωδικός root γραμμένος σε αυτοκόλλητα σημειώματα" },
      ],
      answer: 1,
      why: { en: "A bastion is a high-value choke point. Treat it like one.", el: "Ο bastion είναι κρίσιμο σημείο διέλευσης· προστάτευσέ τον με ισχυρό έλεγχο πρόσβασης και συνεχή παρακολούθηση." },
    },
    {
      q: { en: "Pivoting through SSH is relevant to defenders because…", el: "Γιατί ενδιαφέρει τους αμυνόμενους η μετακίνηση μεταξύ συστημάτων μέσω SSH (pivoting);" },
      choices: [
        { en: "East-west SSH after a phish is a common path", el: "Μετά από phishing, συχνά παρατηρούνται συνδέσεις SSH μεταξύ συστημάτων του εσωτερικού δικτύου" },
        { en: "SSH cannot be logged", el: "Το SSH δεν λογαριάζεται" },
        { en: "Firewalls ignore 22", el: "Τα τείχη προστασίας αγνοούν τη θύρα 22" },
        { en: "It is layer 8 only", el: "Είναι απλώς πρόβλημα «layer 8»" },
      ],
      answer: 0,
      why: { en: "Watch unusual SSH graphs, not just the perimeter.", el: "Παρακολούθησε ασυνήθιστες συνδέσεις SSH και κινήσεις μεταξύ εσωτερικών συστημάτων, όχι μόνο την περίμετρο του δικτύου." },
    },
  ],
  "ssh-tunnel": [
    {
      q: { en: "Network segmentation means…", el: "Τι σημαίνει τμηματοποίηση δικτύου (network segmentation);" },
      choices: [
        { en: "One flat VLAN for all", el: "Ένα VLAN για όλους" },
        { en: "Not every host can reach every other host", el: "Δεν μπορούν όλα τα συστήματα να επικοινωνούν μεταξύ τους" },
        { en: "No logging", el: "Χωρίς logs" },
        { en: "Public IPs on printers", el: "Δημόσιες IP σε εκτυπωτές" },
      ],
      answer: 1,
      why: { en: "db-int was invisible from kali — that's the point.", el: "Το db-int δεν ήταν προσβάσιμο από το kali· αυτή είναι η ουσία της τμηματοποίησης δικτύου." },
    },
    {
      q: { en: "ssh -L is a…", el: "Τι είδους προώθηση παρέχει η ssh -L;" },
      choices: [
        { en: "Local port forward", el: "Τοπική προώθηση θύρας" },
        { en: "Linux kernel module", el: "Μονάδα πυρήνα Linux" },
        { en: "LDAP bind", el: "Σύνδεση μέσω LDAP" },
        { en: "Lost packet counter", el: "Μετρητής χαμένων πακέτων" },
      ],
      answer: 0,
      why: { en: "It maps localhost:port to a remote service through the SSH hop.", el: "Η ssh -L προωθεί μια τοπική θύρα σε απομακρυσμένη υπηρεσία μέσω της σύνδεσης SSH." },
    },
    {
      q: { en: "A dual-homed host is a pivot because…", el: "Γιατί μπορεί ένας υπολογιστής με δύο διεπαφές δικτύου να χρησιμεύσει ως ενδιάμεσος για πρόσβαση σε άλλα δίκτυα;" },
      choices: [
        { en: "It sits on more than one network", el: "Κάθεται σε περισσότερα δίκτυα" },
        { en: "It has two keyboards", el: "Έχει δύο πληκτρολόγια" },
        { en: "It uses RAID 0", el: "RAID 0" },
        { en: "It is always root", el: "Είναι πάντα root" },
      ],
      answer: 0,
      why: { en: "Compromise it and you inherit its routes.", el: "Αν παραβιαστεί ένας υπολογιστής που συνδέει δύο δίκτυα, μπορεί να χρησιμοποιηθεί ως ενδιάμεσος για πρόσβαση και στα δύο." },
    },
  ],
  "sr-intro": [
    { q: { en: "pwd prints…", el: "Τι εμφανίζει η pwd;" }, choices: [{ en: "Users", el: "Χρήστες" }, { en: "Working directory", el: "Τρέχοντα φάκελο" }, { en: "Processes", el: "Διεργασίες" }, { en: "IPs", el: "IP" }], answer: 1, why: { en: "print working directory", el: "Η pwd εμφανίζει τον φάκελο στον οποίο βρίσκεσαι." } },
    { q: { en: "whoami as root means…", el: "Τι σημαίνει όταν η whoami επιστρέφει root;" }, choices: [{ en: "Guest", el: "Επισκέπτης" }, { en: "Full administrator on this box", el: "Πλήρης διαχειριστής" }, { en: "FTP only", el: "Μόνο FTP" }, { en: "No privileges", el: "Χωρίς προνόμια" }], answer: 1, why: { en: "root is the superuser.", el: "Ο root είναι ο υπερχρήστης και διαθέτει αυξημένα δικαιώματα διαχείρισης." } },
    { q: { en: "ls is closest to Windows…", el: "Σε ποια εντολή των Windows μοιάζει περισσότερο η ls;" }, choices: [{ en: "dir", el: "dir" }, { en: "ipconfig", el: "ipconfig" }, { en: "taskmgr", el: "taskmgr" }, { en: "notepad", el: "notepad" }], answer: 0, why: { en: "ls lists directory contents.", el: "Η ls εμφανίζει τα αρχεία και τους υποφακέλους του επιλεγμένου φακέλου." } },
  ],
  "sr-help": [
    { q: { en: "man ls opens…", el: "Τι ανοίγει η εντολή man ls;" }, choices: [{ en: "A movie", el: "Ταινία" }, { en: "The ls manual page", el: "Το εγχειρίδιο ls" }, { en: "A firewall", el: "Firewall" }, { en: "apt", el: "apt" }], answer: 1, why: { en: "man = manual.", el: "Η man ανοίγει το εγχειρίδιο χρήσης μιας εντολής." } },
    { q: { en: "which git returns…", el: "Τι επιστρέφει η εντολή which git;" }, choices: [{ en: "Every file named git", el: "Κάθε αρχείο git" }, { en: "The git binary on PATH", el: "Το εκτελέσιμο αρχείο git που βρίσκεται στο PATH" }, { en: "GitHub", el: "GitHub" }, { en: "Nothing", el: "Τίποτα" }], answer: 1, why: { en: "which is PATH-only.", el: "Η which εντοπίζει το εκτελέσιμο που βρίσκεται σε κάποιον φάκελο του PATH." } },
    { q: { en: "locate's database is typically updated…", el: "Πόσο συχνά ενημερώνεται συνήθως η βάση της locate;" }, choices: [{ en: "Every millisecond", el: "Κάθε ms" }, { en: "About once a day", el: "Περίπου μία φορά τη μέρα" }, { en: "Never", el: "Ποτέ" }, { en: "On SSH login only", el: "Μόνο στο SSH" }], answer: 1, why: { en: "New files can be missing until updatedb.", el: "Πολύ πρόσφατα αρχεία μπορεί να λείπουν από τα αποτελέσματα μέχρι να ανανεωθεί το ευρετήριο με updatedb." } },
  ],
  "sr-search": [
    { q: { en: "ifconfig | grep inet keeps…", el: "Ποιες γραμμές κρατά η εντολή ifconfig | grep inet;" }, choices: [{ en: "All lines", el: "Όλα" }, { en: "Lines containing inet", el: "Γραμμές με inet" }, { en: "Only errors", el: "Μόνο σφάλματα" }, { en: "PIDs", el: "PID" }], answer: 1, why: { en: "grep filters stdin.", el: "Η grep μπορεί να φιλτράρει γραμμές που λαμβάνει από την τυπική είσοδο (stdin)." } },
    { q: { en: "find / -type f -name gamehack starts at…", el: "Από ποιο σημείο ξεκινά η εντολή find / -type f -name gamehack;" }, choices: [{ en: "Your home only", el: "Μόνο home" }, { en: "The filesystem root", el: "Τη ρίζα" }, { en: "RAM", el: "RAM" }, { en: "DNS", el: "DNS" }], answer: 1, why: { en: "/ is the tree root.", el: "Η / είναι η ρίζα του δέντρου του συστήματος αρχείων." } },
    { q: { en: "2>&1 sends…", el: "Πού στέλνει τα μηνύματα η ανακατεύθυνση 2>&1;" }, choices: [{ en: "stdout to a printer", el: "Αποστολή του stdout σε εκτυπωτή" }, { en: "stderr to stdout", el: "stderr στο stdout" }, { en: "root mail", el: "mail root" }, { en: "Nothing", el: "Τίποτα" }], answer: 1, why: { en: "Merge streams so grep can filter errors.", el: "Το 2>&1 στέλνει το stderr στο stdout, ώστε η grep να φιλτράρει και τα μηνύματα σφάλματος." } },
  ],
  "sr-files": [
    { q: { en: "touch creates…", el: "Τι δημιουργεί η εντολή touch;" }, choices: [{ en: "A user", el: "Χρήστη" }, { en: "An empty file", el: "Κενό αρχείο" }, { en: "A RAID", el: "RAID" }, { en: "A VLAN", el: "VLAN" }], answer: 1, why: { en: "touch NAME", el: "Η touch δημιουργεί το αρχείο NAME αν δεν υπάρχει ήδη." } },
    { q: { en: "mv can…", el: "Ποιες λειτουργίες μπορεί να εκτελέσει η mv;" }, choices: [{ en: "Only delete", el: "Μόνο διαγραφή" }, { en: "Move or rename", el: "Μετακίνηση ή μετονομασία" }, { en: "Format disks", el: "Format" }, { en: "Crack wifi", el: "Παραβίαση Wi-Fi" }], answer: 1, why: { en: "mv SRC DEST", el: "Η mv μετακινεί το SRC στο DEST ή, αν αλλάξει το όνομα, το μετονομάζει." } },
    { q: { en: "rmdir fails when…", el: "Πότε αποτυγχάνει η rmdir;" }, choices: [{ en: "The dir has contents", el: "Ο φάκελος έχει περιεχόμενο" }, { en: "You are root", el: "Είσαι root" }, { en: "It is Monday", el: "Δευτέρα" }, { en: "IPv6 is on", el: "IPv6" }], answer: 0, why: { en: "Use rm -r for non-empty dirs.", el: "Η rmdir λειτουργεί μόνο σε άδειους φακέλους· η rm -r αφαιρεί και φακέλους με περιεχόμενο." } },
  ],
  "sr-text": [
    { q: { en: "head shows…", el: "Τι εμφανίζει η head;" }, choices: [{ en: "Last 10 lines by default", el: "Τελευταίες 10" }, { en: "First 10 lines by default", el: "Πρώτες 10" }, { en: "PIDs", el: "PID" }, { en: "MAC", el: "MAC" }], answer: 1, why: { en: "tail is the opposite.", el: "Η head εμφανίζει τις πρώτες γραμμές· η tail εμφανίζει τις τελευταίες." } },
    { q: { en: "sed s/WWW/www/g does…", el: "Τι κάνει η sed s/WWW/www/g;" }, choices: [{ en: "Deletes the file", el: "Σβήνει το αρχείο" }, { en: "Replaces WWW with www globally (on stdout)", el: "Αντικαθιστά κάθε εμφάνιση του WWW με www και εμφανίζει το αποτέλεσμα στο stdout" }, { en: "Starts apache", el: "Ανοίγει apache" }, { en: "Sets SUID", el: "SUID" }], answer: 1, why: { en: "/g = every occurrence. Redirect to write.", el: "Η επιλογή g αντικαθιστά κάθε εμφάνιση του μοτίβου. Για να αποθηκεύσεις το αποτέλεσμα, κάνε ανακατεύθυνση σε αρχείο." } },
    { q: { en: "less vs more: less can…", el: "Ποια δυνατότητα προσφέρει η less σε σχέση με τη more;" }, choices: [{ en: "Format ext4", el: "ext4" }, { en: "Search with / in a real TTY", el: "Αναζήτηση με /" }, { en: "Assign IPs", el: "IP" }, { en: "Compile C", el: "C" }], answer: 1, why: { en: "less is the nicer pager.", el: "Η less επιτρέπει να μετακινείσαι μέσα στο αρχείο και να αναζητάς κείμενο· η more προσφέρει πιο βασική προβολή σελίδων." } },
  ],
  "sr-apt": [
    { q: { en: "apt-get update…", el: "Τι κάνει η apt-get update;" }, choices: [{ en: "Installs every package", el: "Εγκαθιστά όλα" }, { en: "Refreshes package indexes", el: "Ανανεώνει ευρετήρια" }, { en: "Deletes /", el: "Σβήνει /" }, { en: "Starts FTP", el: "FTP" }], answer: 1, why: { en: "upgrade applies the updates.", el: "Η apt-get update εντοπίζει διαθέσιμες ενημερώσεις· στη συνέχεια, η apt-get upgrade τις εγκαθιστά." } },
    { q: { en: "purge vs remove…", el: "Ποια είναι η διαφορά ανάμεσα στις purge και remove;" }, choices: [{ en: "Same always", el: "Ίδια" }, { en: "purge also drops leftover configs", el: "Η εντολή purge αφαιρεί και τα αρχεία ρυθμίσεων που έχουν απομείνει" }, { en: "purge installs more", el: "Εγκαθιστά περισσότερα" }, { en: "remove needs rootless", el: "χωρίς root" }], answer: 1, why: { en: "purge is the thorough uninstall.", el: "Η apt-get purge αφαιρεί το πακέτο μαζί με τα αρχεία ρυθμίσεών του, ενώ η remove μπορεί να τα αφήσει." } },
    { q: { en: "sources.list lists…", el: "Τι περιέχει το sources.list;" }, choices: [{ en: "Users", el: "Χρήστες" }, { en: "Package repositories", el: "Αποθετήρια πακέτων" }, { en: "Cron jobs", el: "Cron" }, { en: "SSH keys", el: "Κλειδιά SSH" }], answer: 1, why: { en: "Don't add random experimental repos.", el: "Μην προσθέτεις τυχαία ή πειραματικά αποθετήρια· μπορεί να προκαλέσουν προβλήματα στο σύστημα." } },
  ],
  "sr-perms": [
    { q: { en: "chmod 7 means…", el: "Τι σημαίνει η τιμή 7 στην chmod;" }, choices: [{ en: "---", el: "---" }, { en: "rwx", el: "rwx" }, { en: "r--", el: "r--" }, { en: "x only", el: "μόνο x" }], answer: 1, why: { en: "4+2+1 = rwx.", el: "Τα δικαιώματα συνδυάζονται αριθμητικά: 4 για ανάγνωση, 2 για εγγραφή και 1 για εκτέλεση· άρα 7 = rwx." } },
    { q: { en: "SUID is set with prefix…", el: "Με ποιο πρόθεμα ενεργοποιείται το SUID;" }, choices: [{ en: "2", el: "2" }, { en: "4", el: "4" }, { en: "7", el: "7" }, { en: "0", el: "0" }], answer: 1, why: { en: "4644 = SUID + 644. 2xxx = SGID.", el: "Το 4644 συνδυάζει SUID με δικαιώματα 644· το πρόθεμα 2xxx ενεργοποιεί το SGID." } },
    { q: { en: "chown Raj file changes…", el: "Τι αλλάζει η εντολή chown Raj file;" }, choices: [{ en: "The group only", el: "Μόνο ομάδα" }, { en: "The owner", el: "Τον ιδιοκτήτη" }, { en: "The kernel", el: "Το kernel" }, { en: "DNS", el: "DNS" }], answer: 1, why: { en: "chgrp changes group.", el: "Η chgrp αλλάζει την ομάδα στην οποία ανήκει ένα αρχείο." } },
  ],
  "sr-net": [
    { q: { en: "lo is always…", el: "Ποια διεύθυνση χρησιμοποιεί πάντα η διεπαφή loopback lo;" }, choices: [{ en: "8.8.8.8", el: "8.8.8.8" }, { en: "127.0.0.1", el: "127.0.0.1" }, { en: "0.0.0.0", el: "0.0.0.0" }, { en: "255.255.255.255", el: "255.255.255.255" }], answer: 1, why: { en: "Loopback.", el: "Η lo είναι η διεπαφή loopback· ο υπολογιστής τη χρησιμοποιεί για να επικοινωνεί με τον εαυτό του στη διεύθυνση 127.0.0.1." } },
    { q: { en: "dhclient asks…", el: "Τι ζητά η dhclient;" }, choices: [{ en: "A TLS cert", el: "Πιστοποιητικό TLS" }, { en: "A DHCP lease / IP", el: "Μίσθωση DHCP / IP" }, { en: "A man page", el: "man" }, { en: "SUID", el: "SUID" }], answer: 1, why: { en: "Dynamic addressing.", el: "Η dhclient ζητά από DHCP server να εκχωρήσει δυναμικά ρυθμίσεις δικτύου, όπως μια διεύθυνση IP." } },
    { q: { en: "Changing MAC to bypass someone else's network control is…", el: "Τι ισχύει για την αλλαγή MAC με σκοπό την παράκαμψη ελέγχων σε ξένο δίκτυο;" }, choices: [{ en: "Fine always", el: "Πάντα ΟΚ" }, { en: "Illegal without authorisation", el: "Παράνομο χωρίς άδεια" }, { en: "Required by HTTP", el: "Απαίτηση HTTP" }, { en: "A DNS standard", el: "Πρότυπο DNS" }], answer: 1, why: { en: "Lab only.", el: "Άλλαξε διεύθυνση MAC μόνο σε εξοπλισμό ή εργαστήριο για το οποίο έχεις ρητή άδεια." } },
  ],
  "sr-proc": [
    { q: { en: "ps aux shows…", el: "Τι εμφανίζει η ps aux;" }, choices: [{ en: "Only cron", el: "Μόνο cron" }, { en: "All users' processes", el: "Διεργασίες όλων" }, { en: "DNS only", el: "Μόνο DNS" }, { en: "Disk partitions", el: "Διαμερίσματα" }], answer: 1, why: { en: "a,u,x flags widen the listing.", el: "Οι επιλογές a, u και x της ps aux εμφανίζουν διεργασίες περισσότερων χρηστών και πρόσθετες πληροφορίες." } },
    { q: { en: "kill -9 is…", el: "Τι κάνει η kill -9;" }, choices: [{ en: "A polite hangup", el: "Ευγενικό hangup" }, { en: "SIGKILL — force stop", el: "SIGKILL — αναγκαστικός τερματισμός" }, { en: "Nice +9", el: "Nice +9" }, { en: "FTP restart", el: "Επανεκκίνηση υπηρεσίας FTP" }], answer: 1, why: { en: "-1 is SIGHUP.", el: "Η επιλογή -1 στέλνει το σήμα SIGHUP· δεν τερματίζει πάντα τη διεργασία με τον ίδιο τρόπο." } },
    { q: { en: "Appending & …", el: "Τι συμβαίνει όταν προσθέσεις & στο τέλος μιας εντολής;" }, choices: [{ en: "Deletes the process", el: "Σβήνει τη διεργασία" }, { en: "Runs it in the background", el: "Τη βάζει στο παρασκήνιο" }, { en: "Formats /tmp", el: "Format /tmp" }, { en: "Opens man", el: "Ανοίγει man" }], answer: 1, why: { en: "jobs / fg manage those jobs.", el: "Η jobs εμφανίζει τις εργασίες παρασκηνίου και η fg επαναφέρει μία στο προσκήνιο." } },
  ],
  "sr-env": [
    { q: { en: "HISTSIZE=0 must have…", el: "Πώς πρέπει να γραφτεί η ανάθεση HISTSIZE=0;" }, choices: [{ en: "Spaces around =", el: "Κενά γύρω από =" }, { en: "No spaces around =", el: "Χωρίς κενά" }, { en: "A comma", el: "Κόμμα" }, { en: "sudo always", el: "πάντα sudo" }], answer: 1, why: { en: "VAR=value syntax.", el: "Γράψε VAR=value χωρίς κενά γύρω από το σύμβολο =." } },
    { q: { en: "export makes a var…", el: "Τι κάνει η export σε μια μεταβλητή;" }, choices: [{ en: "Hidden from ps", el: "Κρυφή από ps" }, { en: "Inherited by child processes", el: "Κληρονομήσιμη στα παιδιά" }, { en: "A firewall rule", el: "Κανόνα firewall" }, { en: "Immutable kernel", el: "Αμετάβλητο kernel" }], answer: 1, why: { en: "Environment vs shell scope.", el: "Μια απλή μεταβλητή ισχύει στο τρέχον shell· με export μεταβιβάζεται και στις διεργασίες-παιδιά." } },
    { q: { en: "unset NAME…", el: "Τι συμβαίνει όταν εκτελείς unset NAME;" }, choices: [{ en: "Creates NAME", el: "Δημιουργεί NAME" }, { en: "Deletes the variable", el: "Διαγράφει τη μεταβλητή" }, { en: "Installs apt", el: "Εγκαθιστά apt" }, { en: "Opens nano", el: "Ανοίγει nano" }], answer: 1, why: { en: "Gone until you set it again.", el: "Η unset αφαιρεί τη μεταβλητή· για να τη χρησιμοποιήσεις ξανά, πρέπει να την ορίσεις πάλι." } },
  ],
  "sr-bash": [
    { q: { en: "#!/bin/bash is the…", el: "Τι δηλώνει η γραμμή #!/bin/bash;" }, choices: [{ en: "SUID bit", el: "SUID" }, { en: "Shebang — interpreter line", el: "Shebang — γραμμή επιλογής διερμηνέα" }, { en: "Cron field", el: "Πεδίο cron" }, { en: "MAC", el: "MAC" }], answer: 1, why: { en: "Tells the kernel to use bash.", el: "Η γραμμή shebang υποδεικνύει στον πυρήνα να εκτελέσει το script με τον διερμηνέα Bash." } },
    { q: { en: "./script means…", el: "Τι σημαίνει το ./script;" }, choices: [{ en: "Run from PATH only", el: "Μόνο PATH" }, { en: "Run the file in the current directory", el: "Τρέξε το αρχείο εδώ" }, { en: "Delete it", el: "Διαγραφή" }, { en: "Compile it", el: "Compile" }], answer: 1, why: { en: "Need +x too.", el: "Για απευθείας εκτέλεση με ./script, το αρχείο πρέπει να έχει δικαίωμα εκτέλεσης (+x)." } },
    { q: { en: "nmap -sn is a…", el: "Τι είδους σάρωση εκτελεί η nmap -sn;" }, choices: [{ en: "OS exploit", el: "Εκμετάλλευση ευπάθειας λειτουργικού συστήματος" }, { en: "Ping / host-discovery sweep", el: "Ping / σάρωση για εντοπισμό ενεργών συστημάτων" }, { en: "Hash crack", el: "Ανάκτηση κωδικού από hash" }, { en: "TLS MITM", el: "TLS MITM" }], answer: 1, why: { en: "Formerly -sP. Lab networks only.", el: "Η -sn είναι η νεότερη ονομασία της -sP. Χρησιμοποίησέ την μόνο σε δίκτυα όπου έχεις άδεια." } },
  ],
  "sr-cron": [
    { q: { en: "Crontab field 1 is…", el: "Τι ορίζει το πρώτο πεδίο μιας εγγραφής crontab;" }, choices: [{ en: "Year", el: "Έτος" }, { en: "Minute 0–59", el: "Λεπτό 0–59" }, { en: "User always", el: "Πάντα χρήστης" }, { en: "Path", el: "Διαδρομή" }], answer: 1, why: { en: "Then hour, dom, month, dow.", el: "Μετά το πεδίο λεπτών ακολουθούν η ώρα, η ημέρα του μήνα, ο μήνας και η ημέρα της εβδομάδας." } },
    { q: { en: "55 23 * * * means…", el: "Τι σημαίνει η cron έκφραση 55 23 * * *;" }, choices: [{ en: "05:23 once", el: "05:23 μία φορά" }, { en: "23:55 every day", el: "23:55 κάθε μέρα" }, { en: "Every 23 seconds", el: "Κάθε 23 δευτ." }, { en: "Never", el: "Ποτέ" }], answer: 1, why: { en: "minute 55, hour 23.", el: "Η εγγραφή ορίζει το 55ο λεπτό της 23ης ώρας, δηλαδή τις 23:55." } },
    { q: { en: "Runlevel 0…", el: "Τι κάνει το runlevel 0;" }, choices: [{ en: "Reboot", el: "Επανεκκίνηση" }, { en: "Halt the system", el: "Τερματισμός λειτουργίας του συστήματος" }, { en: "GUI only", el: "Μόνο GUI" }, { en: "Single-user", el: "Λειτουργία ενός χρήστη" }], answer: 1, why: { en: "6 is reboot, 1 is single-user.", el: "Το runlevel 6 επανεκκινεί το σύστημα, ενώ το runlevel 1 το εκκινεί σε λειτουργία ενός χρήστη." } },
  ],
  "sr-svc": [
    { q: { en: "Apache's default page lives at…", el: "Πού βρίσκεται η προεπιλεγμένη σελίδα του Apache;" }, choices: [{ en: "/etc/passwd", el: "/etc/passwd" }, { en: "/var/www/html/index.html", el: "/var/www/html/index.html" }, { en: "/root/Desktop", el: "/root/Desktop" }, { en: "/proc", el: "/proc" }], answer: 1, why: { en: "Document root.", el: "Η προεπιλεγμένη σελίδα του Apache βρίσκεται στον βασικό φάκελο εγγράφων (document root): /var/www/html/index.html." } },
    { q: { en: "SSH vs telnet…", el: "Ποια είναι η βασική διαφορά ανάμεσα στα SSH και telnet;" }, choices: [{ en: "Same encryption", el: "Ίδια κρυπτογράφηση" }, { en: "SSH encrypts the channel", el: "Το SSH κρυπτογραφεί το κανάλι" }, { en: "Telnet is newer", el: "Το telnet είναι νεότερο" }, { en: "Neither uses TCP", el: "Κανένα TCP" }], answer: 1, why: { en: "Never telnet credentials.", el: "Το telnet δεν κρυπτογραφεί τα δεδομένα· μην το χρησιμοποιείς για αποστολή διαπιστευτηρίων." } },
    { q: { en: "Anonymous FTP login in this lab is…", el: "Τι ισχύει για τη σύνδεση Anonymous FTP σε αυτό το εργαστήριο;" }, choices: [{ en: "A live CESCA server", el: "Ζωντανός CESCA" }, { en: "A simulated Gamehack server", el: "Προσομοιωμένος διακομιστής Gamehack" }, { en: "Required on the internet", el: "Απαραίτητο για σύνδεση στο διαδίκτυο" }, { en: "A kernel module", el: "Κερνελ module" }], answer: 1, why: { en: "ftp.forge.lab is fake. Stay in scope.", el: "Το ftp.forge.lab είναι εικονικός διακομιστής του εργαστηρίου· μην επιχειρείς σύνδεση σε συστήματα εκτός του επιτρεπόμενου πεδίου." } },
  ],
  "dfir-intake": [
    { q: { en: "A matching SHA-256 digest supports…", el: "Τι τεκμηριώνει η ταύτιση δύο SHA-256 digest;" }, choices: [{ en: "The file is harmless", el: "Το αρχείο είναι ακίνδυνο" }, { en: "The compared byte sequences match", el: "Τα bytes που συγκρίθηκαν είναι ίδια" }, { en: "The author is known", el: "Είναι γνωστός ο δημιουργός" }, { en: "The file is original", el: "Είναι πρωτότυπο" }], answer: 1, why: { en: "A digest supports byte identity, not safety or authorship.", el: "Η ταύτιση digest υποστηρίζει ότι δύο αντίγραφα έχουν τα ίδια bytes· δεν αποδεικνύει ότι το αρχείο είναι ασφαλές ή ποιος το δημιούργησε." } },
    { q: { en: "What is chain of custody for?", el: "Ποιος είναι ο σκοπός της αλυσίδας επιτήρησης τεκμηρίων (chain of custody);" }, choices: [{ en: "Provenance and handling record", el: "Καταγραφή προέλευσης και χειρισμού" }, { en: "Running a suspicious file", el: "Εκτέλεση ύποπτου αρχείου" }, { en: "Changing timestamps", el: "Τροποποίηση χρονικών σημάνσεων" }, { en: "Attribution from an IP", el: "Ταυτοποίηση δράστη βάσει διεύθυνσης IP" }], answer: 0, why: { en: "It records who handled evidence, when, how, and why.", el: "Η αλυσίδα επιτήρησης καταγράφει ποιος χειρίστηκε το τεκμήριο, πότε, με ποιον τρόπο και για ποιον σκοπό." } },
    { q: { en: "A file extension is…", el: "Τι πληροφορία παρέχει η κατάληξη ενός αρχείου;" }, choices: [{ en: "Proof of file type", el: "Απόδειξη τύπου" }, { en: "A clue that should be checked against content", el: "Ένδειξη που ελέγχεται με το περιεχόμενο" }, { en: "A cryptographic hash", el: "Κρυπτογραφικό hash" }, { en: "A chain-of-custody log", el: "Αρχείο καταγραφής της αλυσίδας φύλαξης τεκμηρίων" }], answer: 1, why: { en: "Use file signatures and metadata to verify the actual format.", el: "Εξέτασε την υπογραφή και τα μεταδεδομένα με την file για να επαληθεύσεις τον πραγματικό τύπο του αρχείου." } },
  ],
  "dfir-windows": [
    { q: { en: "NTUSER.DAT primarily represents…", el: "Τι αποθηκεύει κυρίως το NTUSER.DAT;" }, choices: [{ en: "A user registry hive", el: "Κυψέλη μητρώου χρήστη" }, { en: "A packet capture", el: "Καταγραφή πακέτων" }, { en: "A disk image", el: "Disk image" }, { en: "A browser executable", el: "Εκτελέσιμο πρόγραμμα περιήγησης" }], answer: 0, why: { en: "Per-user settings are stored in the user's hive.", el: "Οι ρυθμίσεις κάθε χρήστη αποθηκεύονται στη δική του κυψέλη του μητρώου." } },
    { q: { en: "Windows Security event 4625 indicates…", el: "Τι δηλώνει το συμβάν 4625 στο αρχείο καταγραφής ασφαλείας των Windows;" }, choices: [{ en: "Successful login", el: "Επιτυχή σύνδεση" }, { en: "Failed login", el: "Αποτυχημένη σύνδεση" }, { en: "Audit log cleared", el: "Διαγραφή του αρχείου καταγραφής ελέγχου" }, { en: "Account created", el: "Δημιουργία λογαριασμού" }], answer: 1, why: { en: "Correlate event IDs with user, host, time, and nearby events.", el: "Συσχέτισε το ID του συμβάντος με τον χρήστη, τον υπολογιστή, την ώρα και τα γειτονικά συμβάντα." } },
    { q: { en: "A browser history row is strongest when…", el: "Πότε έχει μεγαλύτερη αποδεικτική αξία μια εγγραφή στο ιστορικό του browser;" }, choices: [{ en: "Used alone for attribution", el: "Χρησιμοποιείται μόνη της για την απόδοση ταυτότητας" }, { en: "Correlated with other artifacts and timestamps", el: "Διασταυρώνεται με άλλα τεκμήρια και χρονικές σημάνσεις" }, { en: "Passwords are disclosed", el: "Αποκαλύπτονται κωδικοί" }, { en: "The database is modified", el: "Τροποποιείται η βάση" }], answer: 1, why: { en: "Independent artifacts provide stronger context.", el: "Η συσχέτιση με ανεξάρτητα τεκμήρια και χρονικές σημάνσεις δίνει πιο αξιόπιστο πλαίσιο." } },
  ],
  "dfir-documents": [
    { q: { en: "Modern .docx is commonly…", el: "Σε ποια μορφή είναι συνήθως αποθηκευμένο ένα σύγχρονο αρχείο .docx;" }, choices: [{ en: "A ZIP-based OOXML container", el: "Αρχείο OOXML σε μορφή ZIP" }, { en: "A packet capture", el: "Καταγραφή πακέτων" }, { en: "An NTFS hive", el: "NTFS hive" }, { en: "A plain bitmap", el: "Bitmap" }], answer: 0, why: { en: "OOXML documents package XML, relationships, metadata, and media.", el: "Τα αρχεία OOXML περιέχουν XML, σχέσεις μεταξύ στοιχείων, μεταδεδομένα και πολυμέσα μέσα σε ένα πακέτο ZIP." } },
    { q: { en: "A detected macro means…", el: "Τι σημαίνει ο εντοπισμός μιας μακροεντολής;" }, choices: [{ en: "It definitely executed", el: "Σίγουρα εκτελέστηκε" }, { en: "Perform static inspection; execution still needs evidence", el: "Εξέτασε το αρχείο στατικά· η εκτέλεση χρειάζεται ξεχωριστή επιβεβαίωση" }, { en: "The document is benign", el: "Το έγγραφο είναι ακίνδυνο" }, { en: "The hash is wrong", el: "Λάθος hash" }], answer: 1, why: { en: "Presence is an indicator, not proof of execution.", el: "Η παρουσία μακροεντολής είναι ένδειξη για έλεγχο, όχι απόδειξη ότι εκτελέστηκε." } },
    { q: { en: "A hidden image string is…", el: "Τι μπορεί να είναι μια συμβολοσειρά που εντοπίζεται κρυμμένη σε εικόνα;" }, choices: [{ en: "Always malicious", el: "Πάντα κακόβουλο" }, { en: "A lead to validate and contextualize", el: "Lead προς επαλήθευση και πλαίσιο" }, { en: "A file hash", el: "File hash" }, { en: "A chain-of-custody record", el: "Καταγραφή αλυσίδας φύλαξης τεκμηρίων" }], answer: 1, why: { en: "Steganography findings need independent validation.", el: "Ένα εύρημα στεγανογραφίας χρειάζεται ανεξάρτητη επαλήθευση και συσχέτιση με άλλα στοιχεία." } },
  ],
  "dfir-web": [
    { q: { en: "Apache access logs commonly show…", el: "Τι καταγράφουν συνήθως τα Apache access logs;" }, choices: [{ en: "Request line, status, time, client", el: "Γραμμή αιτήματος, κατάσταση, ώρα και client" }, { en: "Full POST body always", el: "Πάντα ολόκληρο το σώμα του αιτήματος POST" }, { en: "RAM pages", el: "Σελίδες μνήμης RAM" }, { en: "Registry hives", el: "Κυψέλες του μητρώου των Windows" }], answer: 0, why: { en: "POST request bodies may require WAF or application logs.", el: "Τα σώματα των αιτημάτων POST μπορεί να μην υπάρχουν στα access logs· έλεγξε τα logs του WAF ή της εφαρμογής." } },
    { q: { en: "A WAF rule hit is…", el: "Τι σημαίνει ότι ενεργοποιήθηκε ένας κανόνας WAF;" }, choices: [{ en: "An automatic attribution verdict", el: "Αυτόματο συμπέρασμα για την ταυτότητα του δράστη" }, { en: "A detector event to validate with context", el: "Συμβάν ανίχνευσης που χρειάζεται επαλήθευση με βάση το πλαίσιο" }, { en: "A hash mismatch", el: "Hash mismatch" }, { en: "Proof data was exfiltrated", el: "Απόδειξη εξαγωγής δεδομένων" }], answer: 1, why: { en: "Correlate rule, request, response, timestamps, and impact.", el: "Συσχέτισε τον κανόνα WAF με το αίτημα, την απόκριση, τις χρονικές σημάνσεις και την πιθανή επίπτωση." } },
    { q: { en: "An IP address alone proves…", el: "Τι αποδεικνύει από μόνη της μια διεύθυνση IP;" }, choices: [{ en: "A named person", el: "Συγκεκριμένο πρόσωπο" }, { en: "An observed network address", el: "Παρατηρημένη διεύθυνση δικτύου" }, { en: "Intent", el: "Πρόθεση" }, { en: "Malware family", el: "Οικογένεια κακόβουλου λογισμικού" }], answer: 1, why: { en: "NAT, VPNs, proxies, and shared infrastructure limit attribution.", el: "NAT, VPN, proxy και κοινόχρηστες υποδομές δυσκολεύουν την ταυτοποίηση του πραγματικού χρήστη πίσω από μια IP." } },
  ],
  "dfir-network": [
    { q: { en: "A Wireshark display filter…", el: "Τι κάνει ένα φίλτρο προβολής στο Wireshark;" }, choices: [{ en: "Deletes packets from the capture", el: "Διαγράφει πακέτα από την καταγραφή" }, { en: "Narrows the displayed packet view", el: "Περιορίζει τα πακέτα που εμφανίζονται" }, { en: "Rewrites the source PCAP", el: "Αλλάζει το PCAP" }, { en: "Authenticates a user", el: "Ελέγχει χρήστη" }], answer: 1, why: { en: "Filters change the view, not the evidence source.", el: "Τα φίλτρα αλλάζουν όσα βλέπεις, όχι τα πακέτα της αρχικής καταγραφής." } },
    { q: { en: "Follow TCP Stream helps…", el: "Σε τι χρησιμεύει η επιλογή Follow TCP Stream;" }, choices: [{ en: "Reconstruct conversation context", el: "Ανασύνθεση του πλαισίου της επικοινωνίας" }, { en: "Create a hash", el: "Δημιουργία hash" }, { en: "Mount NTFS", el: "Προσάρτηση συστήματος αρχείων NTFS" }, { en: "Decrypt every TLS stream", el: "Αποκρυπτογράφηση TLS" }], answer: 0, why: { en: "It presents packets from one connection as a conversation.", el: "Η επιλογή παρουσιάζει τα πακέτα μιας σύνδεσης ως ενιαία συνομιλία." } },
    { q: { en: "Exported objects should be…", el: "Πώς πρέπει να καταγράφονται τα αντικείμενα που εξάγεις;" }, choices: [{ en: "Treated as original evidence", el: "Θεωρούνται πρωτότυπο" }, { en: "Recorded as derived evidence with source stream", el: "Καταγράφονται ως παράγωγα τεκμήρια μαζί με το αρχικό stream" }, { en: "Uploaded publicly", el: "Ανεβαίνουν δημόσια" }, { en: "Edited in place", el: "Τροποποιούνται επί τόπου" }], answer: 1, why: { en: "Record source capture, frame/stream, export method, and hash.", el: "Κατέγραψε την αρχική καταγραφή, το frame ή stream, τη μέθοδο εξαγωγής και το hash του παράγωγου αρχείου." } },
  ],
  "dfir-disk": [
    { q: { en: "A forensic image should be…", el: "Πώς πρέπει να χειριστείς μια εγκληματολογική εικόνα δίσκου;" }, choices: [{ en: "Acquired read-only and verified", el: "Να αποκτηθεί μόνο για ανάγνωση και να επαληθευτεί" }, { en: "Edited before hashing", el: "Τροποποιηθεί πριν το hash" }, { en: "Mounted read/write", el: "Προσαρτημένο με δικαιώματα ανάγνωσης και εγγραφής" }, { en: "Renamed without notes", el: "Μετονομαστεί χωρίς σημειώσεις" }], answer: 0, why: { en: "Preserve source, document acquisition, and validate the copy.", el: "Διατήρησε το πρωτότυπο, τεκμηρίωσε τη διαδικασία απόκτησης και επαλήθευσε το αντίγραφο πριν από την ανάλυση." } },
    { q: { en: "$MFT primarily stores…", el: "Τι αποθηκεύει κυρίως ο πίνακας $MFT;" }, choices: [{ en: "NTFS file metadata records", el: "Εγγραφές μεταδεδομένων αρχείων NTFS" }, { en: "PCAP streams", el: "Ροές πακέτων PCAP" }, { en: "Passwords in plaintext", el: "Κωδικοί σε απλό κείμενο" }, { en: "Browser cookies only", el: "Μόνο cookies" }], answer: 0, why: { en: "$LogFile records filesystem metadata transactions; the two serve different roles.", el: "Το $MFT περιέχει εγγραφές αρχείων και φακέλων· το $LogFile καταγράφει συναλλαγές μεταδεδομένων του συστήματος αρχείων. Τα δύο εξυπηρετούν διαφορετικό σκοπό." } },
    { q: { en: "A deleted MFT entry proves…", el: "Τι αποδεικνύει μια διαγραμμένη εγγραφή MFT;" }, choices: [{ en: "All file contents are recoverable", el: "Ανακτάται όλο το περιεχόμενο" }, { en: "A metadata record is marked deleted", el: "Η εγγραφή μεταδεδομένων έχει σημειωθεί ως διαγραμμένη" }, { en: "Who deleted the file", el: "Ποιος το διέγραψε" }, { en: "Malware execution", el: "Εκτέλεση κακόβουλου λογισμικού" }], answer: 1, why: { en: "Recovery and attribution require additional evidence.", el: "Μια ένδειξη διαγραφής δεν αποδεικνύει ότι ανακτήθηκε το περιεχόμενο ή ποιος το δημιούργησε· χρειάζονται και άλλα στοιχεία." } },
  ],
  "dfir-malware": [
    { q: { en: "Static analysis means…", el: "Τι περιλαμβάνει η στατική ανάλυση;" }, choices: [{ en: "Inspecting without executing the sample", el: "Εξέταση χωρίς εκτέλεση" }, { en: "Running it on a workstation", el: "Εκτέλεση σε σταθμό εργασίας" }, { en: "Deleting logs", el: "Διαγραφή logs" }, { en: "Hash cracking", el: "Ανάκτηση κωδικού από hash" }], answer: 0, why: { en: "Begin with metadata, hashes, strings, and safe code inspection.", el: "Η στατική ανάλυση εξετάζει μεταδεδομένα, hashes, strings και κώδικα χωρίς να εκτελεί το δείγμα." } },
    { q: { en: "A defanged domain ending .invalid…", el: "Τι σημαίνει ότι ένα domain έχει αδρανοποιηθεί και τελειώνει σε .invalid;" }, choices: [{ en: "Should resolve publicly", el: "Επιλύεται δημόσια" }, { en: "Is a safe, non-routable reporting placeholder", el: "Είναι ασφαλής, μη δρομολογήσιμη διεύθυνση για χρήση σε αναφορές" }, { en: "Proves malware", el: "Αποδεικνύει την παρουσία κακόβουλου λογισμικού" }, { en: "Is an MD5", el: "Είναι MD5" }], answer: 1, why: { en: ".invalid is reserved for examples and prevents accidental live navigation.", el: "Η κατάληξη .invalid προορίζεται για παραδείγματα και δεν οδηγεί σε πραγματικό domain." } },
    { q: { en: "A clean public scanner result proves…", el: "Τι αποδεικνύει ένα καθαρό αποτέλεσμα από δημόσιο scanner;" }, choices: [{ en: "The sample is harmless", el: "Το δείγμα είναι ακίνδυνο" }, { en: "Only that those scanners did not flag it then", el: "Μόνο ότι δεν το επισήμαναν τότε" }, { en: "Its author", el: "Δημιουργό" }, { en: "No behavior", el: "Καμία συμπεριφορά" }], answer: 1, why: { en: "Absence of detections is not proof of benignness; public upload may expose confidential data.", el: "Το ότι ένας scanner δεν εντόπισε απειλές δεν αποδεικνύει ότι το αρχείο είναι ασφαλές. Η μεταφόρτωση σε δημόσια υπηρεσία μπορεί επίσης να εκθέσει εμπιστευτικά δεδομένα." } },
  ],
  "dfir-memory": [
    { q: { en: "Memory evidence is especially valuable because it can preserve…", el: "Γιατί είναι πολύτιμα τα δεδομένα μνήμης σε μια έρευνα;" }, choices: [{ en: "Only old file names", el: "Μόνο ονόματα αρχείων" }, { en: "Volatile processes, sockets, environment, clipboard", el: "Πτητικά τεκμήρια: διεργασίες, sockets, περιβάλλον και πρόχειρο" }, { en: "Only registry backups", el: "Μόνο αντίγραφα ασφαλείας του μητρώου" }, { en: "Static disk sectors only", el: "Μόνο στατικούς τομείς του δίσκου" }], answer: 1, why: { en: "RAM captures a moment-in-time volatile system state.", el: "Η RAM διατηρεί στιγμιότυπο της προσωρινής κατάστασης του συστήματος, όπως διεργασίες, συνδέσεις και ιστορικό εντολών." } },
    { q: { en: "pstree adds which context to a process list?", el: "Ποιο επιπλέον πλαίσιο προσθέτει η pstree σε μια λίστα διεργασιών;" }, choices: [{ en: "Parent-child relationships", el: "Σχέσεις γονικής και θυγατρικής διεργασίας" }, { en: "File hashes", el: "Hashes αρχείων" }, { en: "Partition offsets", el: "Μετατοπίσεις κατατμήσεων" }, { en: "Browser bookmarks", el: "Bookmarks" }], answer: 0, why: { en: "An unusual parent can help explain how a process started.", el: "Η σχέση γονικής και θυγατρικής διεργασίας μπορεί να δείξει πώς ξεκίνησε μια ύποπτη διεργασία." } },
    { q: { en: "A suggested memory profile is…", el: "Τι είναι το προτεινόμενο προφίλ μνήμης;" }, choices: [{ en: "A parsing hypothesis to validate", el: "Υπόθεση ανάλυσης που χρειάζεται επαλήθευση" }, { en: "The user's password", el: "Κωδικός χρήστη" }, { en: "A disk image", el: "Disk image" }, { en: "Always certain", el: "Πάντα βέβαιο" }], answer: 0, why: { en: "Validate profile output with image metadata and other artifacts.", el: "Αντιμετώπισε το προτεινόμενο profile ως υπόθεση και επαλήθευσέ το με τα μεταδεδομένα της εικόνας και άλλα τεκμήρια." } },
  ],
  "dfir-container": [
    { q: { en: "docker diff reports…", el: "Τι εμφανίζει η docker diff;" }, choices: [{ en: "Added, deleted, changed paths", el: "Διαδρομές που προστέθηκαν, διαγράφηκαν ή τροποποιήθηκαν" }, { en: "Only network packets", el: "Μόνο packets" }, { en: "Password hashes", el: "Hashes κωδικών" }, { en: "VBA macros", el: "Μακροεντολές VBA" }], answer: 0, why: { en: "A/C/D changes compare a container's writable layer with its image.", el: "Η docker diff εμφανίζει διαδρομές που προστέθηκαν (A), άλλαξαν (C) ή διαγράφηκαν (D) στο εγγράψιμο επίπεδο του container." } },
    { q: { en: "Deleting a secret in a later image layer…", el: "Τι μπορεί να συμβεί αν διαγράψεις ένα μυστικό σε μεταγενέστερο επίπεδο της εικόνας;" }, choices: [{ en: "Guarantees bytes are erased", el: "Εγγυάται ότι τα bytes διαγράφηκαν" }, { en: "May leave secret bytes in an earlier layer", el: "Μπορεί να αφήσει τα bytes του μυστικού σε προηγούμενο επίπεδο" }, { en: "Changes the host kernel", el: "Τροποποιεί τον πυρήνα του συστήματος" }, { en: "Rewrites all logs", el: "Ξαναγράφει logs" }], answer: 1, why: { en: "Container image layers are immutable; inspect history and rotate exposed secrets.", el: "Η διαγραφή σε νεότερο επίπεδο δεν αφαιρεί απαραίτητα το μυστικό από παλαιότερο επίπεδο της εικόνας. Έλεγξε το ιστορικό και ανανέωσε όσα διαπιστευτήρια εκτέθηκαν." } },
    { q: { en: "docker export typically captures…", el: "Τι περιλαμβάνει συνήθως η docker export;" }, choices: [{ en: "Filesystem snapshot, not full image history", el: "Στιγμιότυπο του συστήματος αρχείων, όχι ολόκληρο το ιστορικό της εικόνας" }, { en: "Only registry keys", el: "Μόνο κλειδιά μητρώου" }, { en: "Every memory page", el: "Κάθε σελίδα μνήμης" }, { en: "No evidence", el: "Κανένα evidence" }], answer: 0, why: { en: "Container filesystem export and image-layer acquisition answer different questions.", el: "Η docker export δίνει στιγμιότυπο του συστήματος αρχείων του container, όχι όλο το ιστορικό και τα μεταδεδομένα της εικόνας." } },
  ],
  "dfir-passwords": [
    { q: { en: "A password hash is…", el: "Τι είναι ένα hash κωδικού πρόσβασης;" }, choices: [{ en: "Encrypted text with a reversible key", el: "Αναστρέψιμο κρυπτογραφημένο κείμενο" }, { en: "A one-way digest commonly checked against candidates", el: "Μονόδρομο αποτύπωμα που συγκρίνεται με υποψήφιους κωδικούς" }, { en: "A username", el: "Username" }, { en: "A packet filter", el: "Φίλτρο πακέτων" }], answer: 1, why: { en: "Candidate hashing and comparison can find weak passwords; the hash is not simply decrypted.", el: "Το password hash δεν αποκρυπτογραφείται απευθείας. Δοκιμάζεις υποψήφιες λέξεις, υπολογίζεις το hash τους και συγκρίνεις τα αποτελέσματα για να εντοπίσεις αδύναμους κωδικούς." } },
    { q: { en: "Why salt stored passwords?", el: "Γιατί προσθέτουμε salt στα αποθηκευμένα hashes κωδικών;" }, choices: [{ en: "To make every account hash distinct and defeat precomputed reuse", el: "Για να έχει κάθε λογαριασμός διαφορετικό hash και να μην επαναχρησιμοποιούνται προϋπολογισμένα αποτελέσματα" }, { en: "To reveal the password", el: "Για αποκάλυψη κωδικού" }, { en: "To speed up MD5", el: "Επιτάχυνση MD5" }, { en: "To encrypt a disk", el: "Κρυπτογράφηση δίσκου" }], answer: 0, why: { en: "Use a unique salt and a slow adaptive KDF such as Argon2id, bcrypt, or scrypt.", el: "Χρησιμοποίησε μοναδικό salt ανά λογαριασμό και αργή, προσαρμοζόμενη συνάρτηση παραγωγής κλειδιού, όπως Argon2id, bcrypt ή scrypt." } },
    { q: { en: "A recovered candidate password proves…", el: "Τι αποδεικνύει ότι ανακτήθηκε ένας πιθανός κωδικός;" }, choices: [{ en: "Which person typed it", el: "Ποιος τον πληκτρολόγησε" }, { en: "The candidate matches the supplied training digest", el: "Ο υποψήφιος κωδικός ταιριάζει με το δοσμένο εκπαιδευτικό digest" }, { en: "The account was used in the incident", el: "Ο λογαριασμός χρησιμοποιήθηκε στο περιστατικό" }, { en: "The evidence is authentic", el: "Τα τεκμήρια είναι αυθεντικά" }], answer: 1, why: { en: "Password recovery and user attribution are separate questions.", el: "Η ανάκτηση ενός πιθανού κωδικού δεν αποδεικνύει ποιος τον χρησιμοποίησε· η απόδοση ταυτότητας είναι ξεχωριστό ερώτημα." } },
  ],
};
