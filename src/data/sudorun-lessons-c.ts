import type { Module } from "./lessons";
import { usedCmd } from "../lib/terminal";

const lab = "sudorun" as const;
const shot = (cmd: string, lines: string[]) => ({ cmd, lines });

export const SUDO_RUN_MODULES_C: Module[] = [
  {
    id: "sr-bash",
    order: 11,
    icon: "terminal",
    color: "from-emerald-400 to-green-900",
    difficulty: 3,
    scenario: lab,
    title: { en: "Bash scripting basics", el: "Βασικές αρχές σεναρίων Bash" },
    subtitle: { en: "shebang, echo, chmod +x, read, scanner", el: "shebang, echo, chmod +x, read, scanner" },
    badge: { en: "Scripter", el: "Δημιουργός σεναρίων" },
    theory: [
      {
        heading: { en: "The shell is bash", el: "Το Bash ως shell" },
        body: {
          en: "Operators automate commands — sometimes from several tools — by writing small programs. A shell is the interface to the OS. We use bash. You only need a text editor (nano, vim). Scripts in this lab already live in /root so you can chmod and run them; the lesson is still: write the shebang yourself on real boxes.",
          el: "Με μικρά προγράμματα, οι διαχειριστές αυτοματοποιούν εντολές — ακόμη κι όταν συνδυάζουν διαφορετικά εργαλεία. Το shell είναι η διεπαφή με το λειτουργικό σύστημα· εδώ θα χρησιμοποιήσεις το Bash. Για να γράψεις script χρειάζεσαι μόνο έναν επεξεργαστή κειμένου, όπως το nano ή το vim. Τα scripts του εργαστηρίου βρίσκονται ήδη στο /root, ώστε να εξασκηθείς με chmod και να τα εκτελέσεις. Σε πραγματικό σύστημα, μάθε να γράφεις μόνος σου και τη γραμμή shebang.",
        },
      },
      {
        heading: { en: "Shebang #!", el: "Η γραμμή shebang: #!" },
        body: {
          en: "First line of a script tells the kernel which interpreter: #!/bin/bash . File: first_script",
          el: "Η πρώτη γραμμή ενός script δηλώνει στον πυρήνα ποιος interpreter θα το εκτελέσει. Σε αυτό το παράδειγμα, η γραμμή είναι #!/bin/bash και το αρχείο λέγεται first_script.",
        },
        shots: [shot("cat first_script", ["#!/bin/bash", 'echo "Hello World"'])],
      },
      {
        heading: { en: "echo Hello World", el: "Εμφάνισε το Hello World με echo" },
        body: {
          en: "echo prints a line. After chmod +x first_script run it with ./first_script  (the ./ means 'in this directory').",
          el: "Η echo εμφανίζει μια γραμμή κειμένου. Αφού δώσεις στο first_script δικαίωμα εκτέλεσης με chmod +x, τρέξ' το με ./first_script. Το πρόθεμα ./ δηλώνει ότι το αρχείο βρίσκεται στον τρέχοντα φάκελο.",
        },
        shots: [
          shot("chmod +x first_script", [""]),
          shot("./first_script", ["Hello World"]),
        ],
      },
      {
        heading: { en: "read — user input", el: "read — είσοδος χρήστη" },
        body: {
          en: 'A variable is a bucket. welcome.sh does: echo "What is your name?" ; read name ; echo "Welcome, $name". chmod +x welcome.sh && ./welcome.sh — the sandbox greets you as operator.',
          el: "Μια μεταβλητή αποθηκεύει μια τιμή. Το welcome.sh εμφανίζει την ερώτηση με echo, διαβάζει την απάντηση στη μεταβλητή name με read και έπειτα εμφανίζει το Welcome, $name. Τρέξε chmod +x welcome.sh && ./welcome.sh· στο sandbox, το όνομα δείγματος είναι operator.",
        },
        shots: [shot("./welcome.sh", ["What is your name?", "Welcome, operator"])],
      },
      {
        heading: { en: "A tiny scanner", el: "Ένα απλό εργαλείο σάρωσης" },
        body: {
          en: "nmap <scan type> <target>. -sn (modern name of -sP) is a ping sweep: who is alive on the /24. scanner wraps that. chmod +x scanner && ./scanner   (or bash scanner). Output is a simulated list of lab hosts. Only scan networks you are allowed to.",
          el: "Η βασική σύνταξη του Nmap είναι nmap <τύπος σάρωσης> <στόχος>. Η επιλογή -sn (σύγχρονη ονομασία της -sP) εκτελεί ping sweep για να εντοπίσει ενεργούς υπολογιστές σε ένα /24. Το script scanner αυτοματοποιεί αυτή τη διαδικασία. Δώσε του δικαίωμα εκτέλεσης με chmod +x scanner και τρέξ' το με ./scanner (ή με bash scanner). Εδώ εμφανίζονται μόνο εικονικοί υπολογιστές του εργαστηρίου· σε πραγματικό δίκτυο σάρωσε μόνο συστήματα για τα οποία έχεις άδεια.",
        },
        shots: [
          shot("./scanner", ["Enter the ip address", "Nmap scan report for 10.10.10.1", "Nmap scan report for 10.10.10.5", "Nmap scan report for 10.10.10.8"]),
        ],
        tip: { en: "The published snippet had typos (nma -sp). In Gamehack the script calls nmap -sn correctly.", el: "Το αρχικό απόσπασμα είχε τυπογραφικά λάθη (nma -sp). Στο Gamehack, το script εκτελεί σωστά την εντολή nmap -sn." },
      },
    ],
    cheats: [
      { cmd: "#!/bin/bash", desc: { en: "shebang", el: "shebang" } },
      { cmd: "chmod +x FILE", desc: { en: "make executable", el: "προσθήκη δικαιώματος εκτέλεσης" } },
      { cmd: "./first_script", desc: { en: "run in cwd", el: "εκτέλεση στον τρέχοντα φάκελο" } },
      { cmd: "./welcome.sh", desc: { en: "read + echo", el: "ανάγνωση εισόδου και εμφάνιση κειμένου" } },
      { cmd: "./scanner", desc: { en: "wrapped nmap -sn", el: "εκτέλεση του nmap -sn μέσω script" } },
    ],
    tasks: [
      { id: "cat1", instruction: { en: "cat first_script  — see the shebang and Hello World", el: "Διάβασε το first_script και έλεγξε τη γραμμή shebang και την εντολή Hello World." }, hint: { en: "cat /root/first_script", el: "cat first_script" }, explain: { en: "Always read before you run.", el: "Διάβασε το script πριν το εκτελέσεις." }, check: (t) => t.filesRead.some((p) => p.includes("first_script")) || usedCmd(t, /cat\s+.*first_script/) },
      { id: "x1", instruction: { en: "chmod +x first_script", el: "chmod +x first_script" }, hint: { en: "chmod +x first_script", el: "chmod +x first_script" }, explain: { en: "Without +x, ./ fails.", el: "Χωρίς το δικαίωμα +x, η απευθείας εκτέλεση με ./ αποτυγχάνει." }, check: (t) => usedCmd(t, /chmod\s+\+x\s+.*first_script/) || t.flags.has("chmod-x") },
      { id: "run1", instruction: { en: "./first_script   (or bash first_script)", el: "./first_script" }, hint: { en: "./first_script", el: "./first_script" }, explain: { en: "./ means this folder.", el: "Το ./ δηλώνει τον τρέχοντα φάκελο." }, check: (t) => t.flags.has("hello-script") || usedCmd(t, /\.\/first_script|bash\s+first_script/) },
      { id: "welcome", instruction: { en: "./welcome.sh  after chmod +x if needed", el: "./welcome.sh" }, hint: { en: "chmod +x welcome.sh\n./welcome.sh", el: "chmod +x welcome.sh\n./welcome.sh" }, explain: { en: "read name into a variable.", el: "Αποθήκευσε την είσοδο της read στη μεταβλητή name." }, check: (t) => t.flags.has("read-script") || usedCmd(t, /welcome\.sh/) },
      { id: "scan", instruction: { en: "./scanner  (ping sweep wrapper)", el: "./scanner" }, hint: { en: "./scanner", el: "./scanner" }, explain: { en: "-sn ping scan of the lab /24.", el: "Η επιλογή -sn εκτελεί ping sweep στο εικονικό υποδίκτυο /24 του εργαστηρίου." }, check: (t) => t.flags.has("run-scanner") || usedCmd(t, /scanner/) },
    ],
    challenges: [
      {
        title: { en: "Raw nmap -sn", el: "Εκτέλεσε απευθείας το nmap -sn" },
        brief: { en: "nmap -sn 10.10.10.0/24", el: "nmap -sn 10.10.10.0/24" },
        success: { en: "You don't need a wrapper once you know the flag.", el: "Τώρα μπορείς να εκτελέσεις την εντολή απευθείας, χωρίς το script-περίβλημα." },
        check: (t) => t.flags.has("nmap-sn") || t.flags.has("nmap-sweep") || usedCmd(t, /nmap\s+-s[nP]/),
      },
      {
        title: { en: "nano your own copy", el: "Δημιούργησε το δικό σου script με nano" },
        brief: { en: "nano ~/my_hello.sh  (creates/opens). Optional: put the same shebang in it.", el: "Άνοιξε ή δημιούργησε το αρχείο ~/my_hello.sh με nano. Προαιρετικά, πρόσθεσε την ίδια γραμμή shebang στην αρχή." },
        success: { en: "You used an editor on a new script.", el: "Επεξεργάστηκες ένα νέο script με editor." },
        check: (t) => t.flags.has("nano") || usedCmd(t, /nano\s+/),
      },
    ],
  },
  {
    id: "sr-cron",
    order: 12,
    icon: "settings",
    color: "from-amber-300 to-stone-800",
    difficulty: 3,
    scenario: lab,
    title: { en: "Scheduling & rc scripts", el: "Προγραμματισμένες εργασίες και σενάρια εκκίνησης" },
    subtitle: { en: "cron, crontab -e, update-rc.d", el: "cron, crontab -e, update-rc.d" },
    badge: { en: "Clockwork", el: "Προγραμματιστής εργασιών" },
    theory: [
      {
        heading: { en: "cron table fields", el: "Τα πεδία του πίνακα cron" },
        body: {
          en: "crond reads a table (/etc/crontab and per-user tables) for commands to fire. Seven fields in the system file: minute (0-59), hour (0-23), day-of-month (1-31), month (1-12), day-of-week (0-7), user, command. * means every.",
          el: "Η υπηρεσία crond διαβάζει πίνακες εργασιών από το /etc/crontab και από τους λογαριασμούς χρηστών. Το αρχείο συστήματος έχει επτά πεδία: λεπτό (0–59), ώρα (0–23), ημέρα του μήνα (1–31), μήνα (1–12), ημέρα εβδομάδας (0–7), χρήστη και εντολή. Ο αστερίσκος * σημαίνει «κάθε».",
        },
      },
      {
        heading: { en: "Start cron, edit crontab", el: "Εκκίνησε το cron και επεξεργάσου το crontab" },
        body: {
          en: "service cron status  (may be inactive). service cron start. crontab -e  opens your user table. Schedule the scanner every night at 23:55:  55 23 * * * /root/scanner",
          el: "Έλεγξε αν το cron εκτελείται με service cron status και, αν χρειάζεται, ξεκίνησέ το με service cron start. Η crontab -e ανοίγει τον προσωπικό σου πίνακα εργασιών. Για να εκτελείται το scanner κάθε βράδυ στις 23:55, πρόσθεσε τη γραμμή 55 23 * * * /root/scanner.",
        },
        shots: [
          shot("service cron status", ["● cron.service — inactive", "   Active: inactive"]),
          shot("service cron start", ["starting cron (simulated)."]),
          shot("crontab -e", ["# add a line like:", "# 55 23 * * * /root/scanner"]),
        ],
      },
      {
        heading: { en: "rc scripts & runlevels", el: "Σενάρια rc και επίπεδα εκκίνησης" },
        body: {
          en: "At boot, init.d runs rc scripts that build your environment. Runlevels: 0 halt, 1 single-user, 2–5 multiuser, 6 reboot. update-rc.d SERVICE defaults  adds a service to boot (remove|defaults|disable|enable). update-rc.d mysql defaults  — then a reboot would start MySQL. Check with ps aux | grep mysql on a real box.",
          el: "Κατά την εκκίνηση, το init.d εκτελεί scripts rc για να προετοιμάσει το σύστημα. Τα runlevels είναι: 0 για τερματισμό, 1 για έναν χρήστη, 2–5 για λειτουργία πολλών χρηστών και 6 για επανεκκίνηση. Η update-rc.d SERVICE defaults ορίζει ότι μια υπηρεσία θα ξεκινά αυτόματα· για παράδειγμα, η update-rc.d mysql defaults θα ενεργοποιούσε την εκκίνηση της MySQL μετά από επανεκκίνηση. Σε πραγματικό σύστημα, έλεγξε την κατάσταση με ps aux | grep mysql.",
        },
        shots: [shot("update-rc.d mysql defaults", ["update-rc.d: enabling mysql defaults (simulated)"])],
      },
    ],
    cheats: [
      { cmd: "service cron status", desc: { en: "is cron up?", el: "τρέχει το cron;" } },
      { cmd: "service cron start", desc: { en: "start cron", el: "εκκίνηση cron" } },
      { cmd: "crontab -e", desc: { en: "edit user table", el: "επεξεργασία του πίνακα εργασιών χρήστη" } },
      { cmd: "55 23 * * * /root/scanner", desc: { en: "23:55 daily", el: "23:55 κάθε μέρα" } },
      { cmd: "update-rc.d mysql defaults", desc: { en: "start at boot", el: "αυτόματη εκκίνηση κατά την εκκίνηση του συστήματος" } },
    ],
    tasks: [
      { id: "st", instruction: { en: "service cron status", el: "service cron status" }, hint: { en: "service cron status", el: "service cron status" }, explain: { en: "Is the daemon up?", el: "Είναι ενεργή η υπηρεσία cron;" }, check: (t) => t.flags.has("service-cron-status") || usedCmd(t, /service\s+cron\s+status/) },
      { id: "start", instruction: { en: "service cron start", el: "service cron start" }, hint: { en: "service cron start", el: "service cron start" }, explain: { en: "Bring it up.", el: "Ξεκίνησε την υπηρεσία cron." }, check: (t) => t.flags.has("service-cron-start") || usedCmd(t, /service\s+cron\s+start/) },
      { id: "cte", instruction: { en: "crontab -e", el: "crontab -e" }, hint: { en: "crontab -e", el: "crontab -e" }, explain: { en: "User crontab editor.", el: "Άνοιξε τον editor του προσωπικού crontab." }, check: (t) => t.flags.has("crontab-e") || usedCmd(t, /crontab\s+-e/) },
      { id: "line", instruction: { en: 'Add the night scan: echo "55 23 * * * /root/scanner" >> /etc/crontab   (or type it after crontab -e)', el: "Πρόσθεσε τη γραμμή 55 23 * * * /root/scanner για να προγραμματίσεις καθημερινή εκτέλεση στις 23:55. Μπορείς να τη γράψεις στο /etc/crontab ή μετά την εντολή crontab -e." }, hint: { en: 'echo "55 23 * * * /root/scanner" >> /etc/crontab', el: 'echo "55 23 * * * /root/scanner" >> /etc/crontab' }, explain: { en: "23:55 every day.", el: "Η εργασία εκτελείται κάθε μέρα στις 23:55." }, check: (t) => t.flags.has("cron-line") || t.flags.has("crontab-e") || usedCmd(t, /55\s+23/) },
      { id: "rc", instruction: { en: "update-rc.d mysql defaults", el: "update-rc.d mysql defaults" }, hint: { en: "update-rc.d mysql defaults", el: "update-rc.d mysql defaults" }, explain: { en: "Enable at boot.", el: "Ενεργοποίησε την υπηρεσία για αυτόματη εκκίνηση." }, check: (t) => t.flags.has("rc-mysql") || usedCmd(t, /update-rc\.d\s+mysql/) },
    ],
    challenges: [
      {
        title: { en: "Read /etc/crontab", el: "Διάβασε το αρχείο /etc/crontab" },
        brief: { en: "cat /etc/crontab — seven fields.", el: "Διάβασε το /etc/crontab και εντόπισε τα επτά πεδία της εγγραφής." },
        success: { en: "You saw the system table.", el: "Εξέτασες τον πίνακα εργασιών του συστήματος." },
        check: (t) => t.filesRead.some((p) => p.includes("crontab")) || t.flags.has("crontab-e"),
      },
      {
        title: { en: "Cron is running", el: "Το cron τρέχει" },
        brief: { en: "service cron status after start.", el: "Έλεγξε την κατάσταση του cron με service cron status αφού το ξεκινήσεις." },
        success: { en: "Active (running).", el: "Η υπηρεσία εμφανίζεται ως ενεργή (running)." },
        check: (t) => t.flags.has("service-cron-start"),
      },
    ],
  },
  {
    id: "sr-svc",
    order: 13,
    icon: "globe",
    color: "from-ember-400 to-rose-900",
    difficulty: 4,
    scenario: lab,
    title: { en: "Linux services — Apache, SSH, FTP", el: "Υπηρεσίες Linux: Apache, SSH και FTP" },
    subtitle: { en: "start/stop/status + a tiny web, ssh, ftp get", el: "Εκκίνηση, διακοπή και έλεγχος υπηρεσιών· δοκιμή web, SSH και FTP" },
    badge: { en: "Sudo_Run Complete", el: "Ολοκλήρωση Sudo_Run" },
    theory: [
      {
        heading: { en: "service NAME ACTION", el: "Εντολή service: όνομα και ενέργεια" },
        body: {
          en: "A service is an application running in the background. Syntax: service <name> <start|stop|restart|status>. Walk apache2 through start, status, stop, restart so you see each state.",
          el: "Μια υπηρεσία είναι εφαρμογή που εκτελείται στο παρασκήνιο. Η σύνταξη είναι service <όνομα> <start|stop|restart|status>. Δοκίμασε διαδοχικά start, status, stop και restart στην apache2 για να δεις πώς αλλάζει η κατάστασή της.",
        },
        shots: [
          shot("service apache2 start", ["starting apache2 (simulated)."]),
          shot("service apache2 status", ["● apache2.service — running", "   Active: active (running)"]),
          shot("service apache2 stop", ["stopping apache2 (simulated)."]),
        ],
      },
      {
        heading: { en: "Apache default page", el: "Η προεπιλεγμένη σελίδα του Apache" },
        body: {
          en: "Over 60% of web servers historically ran Apache — know it as a defender. Default page: /var/www/html/index.html . nano it, then curl http://localhost  (a browser would open the same). Start apache2 first.",
          el: "Ο Apache χρησιμοποιείται ευρέως σε web servers, γι’ αυτό αξίζει να γνωρίζεις πώς λειτουργεί και πώς να τον ελέγχεις. Η προεπιλεγμένη σελίδα βρίσκεται στο /var/www/html/index.html. Άνοιξέ την με nano και, αφού ξεκινήσεις την apache2, δες την απόκριση με curl http://localhost — όπως θα έκανες και από browser.",
        },
        shots: [
          shot("nano /var/www/html/index.html", ["<h1>Apache2 Debian Default Page</h1>", "<p>It works! This is the Gamehack Sudo_Run web root …</p>"]),
          shot("curl http://localhost", ["<h1>Apache2 Debian Default Page</h1>"]),
        ],
      },
      {
        heading: { en: "OpenSSH", el: "OpenSSH για ασφαλή απομακρυσμένη σύνδεση" },
        body: {
          en: "SSH is encrypted remote shell (telnet was the insecure ancestor). service ssh start  then  ssh ignite@192.168.0.11  — the lab hostname and account are fictional fixtures; no external SSH server is contacted.",
          el: "Το SSH παρέχει κρυπτογραφημένο απομακρυσμένο τερματικό· το παλαιότερο telnet δεν κρυπτογραφούσε την επικοινωνία. Ξεκίνησε την υπηρεσία με service ssh start και συνδέσου με ssh ignite@192.168.0.11. Ο host και ο λογαριασμός είναι φανταστικά δεδομένα του εργαστηρίου· δεν γίνεται σύνδεση σε εξωτερικό διακομιστή SSH.",
        },
        shots: [
          shot("service ssh start", ["starting ssh (simulated)."]),
          shot("ssh ignite@192.168.0.11", ["Welcome to ubuntu (Gamehack lab host)", "ignite@ubuntu:~$"]),
        ],
      },
      {
        heading: { en: "FTP", el: "Μεταφορά αρχείων μέσω FTP" },
        body: {
          en: "File Transfer Protocol moves files over the command line. ftp ftp.forge.lab  (the lab FTP service is a local simulation with fictional files). Name: anonymous  Password: anonymous  then ls, cd into a folder, get favicon.ico, bye, then ls locally to see the download.",
          el: "Το FTP (File Transfer Protocol) μεταφέρει αρχεία από τη γραμμή εντολών. Συνδέσου με ftp ftp.forge.lab και χρησιμοποίησε anonymous ως όνομα χρήστη και κωδικό. Έπειτα, δες τα αρχεία με ls, μπες σε έναν φάκελο με cd, κατέβασε το favicon.ico με get και αποσυνδέσου με bye. Τέλος, τρέξε ls τοπικά για να επιβεβαιώσεις ότι έγινε η λήψη. Η υπηρεσία και τα αρχεία είναι εικονικά.",
        },
        shots: [
          shot("ftp ftp.forge.lab", ["Connected to ftp.forge.lab.", "Name (ftp.forge.lab:root):"]),
          shot("anonymous", ["331 Please specify the password."]),
          shot("anonymous", ["230 Login successful."]),
          shot("get favicon.ico", ["226 Transfer complete."]),
          shot("bye", ["221 Goodbye."]),
        ],
        tip: { en: "Anonymous FTP on the public internet is rare and often out of scope. This is a fake server.", el: "Η ανώνυμη πρόσβαση FTP στο δημόσιο Internet είναι σπάνια και συχνά εκτός του επιτρεπόμενου πεδίου μιας δοκιμής. Εδώ συνδέεσαι σε εικονικό διακομιστή." },
      },
    ],
    cheats: [
      { cmd: "service apache2 start", desc: { en: "start www", el: "εκκίνηση του web server" } },
      { cmd: "curl http://localhost", desc: { en: "fetch default page", el: "προβολή της προεπιλεγμένης σελίδας" } },
      { cmd: "nano /var/www/html/index.html", desc: { en: "edit site", el: "επεξεργασία της τοπικής ιστοσελίδας" } },
      { cmd: "service ssh start", desc: { en: "start sshd", el: "sshd" } },
      { cmd: "ssh ignite@192.168.0.11", desc: { en: "remote shell (sim)", el: "εικονική απομακρυσμένη συνεδρία shell" } },
      { cmd: "ftp ftp.forge.lab", desc: { en: "open ftp (sim)", el: "ftp" } },
      { cmd: "get favicon.ico", desc: { en: "download", el: "λήψη" } },
    ],
    tasks: [
      { id: "a1", instruction: { en: "service apache2 start", el: "service apache2 start" }, hint: { en: "service apache2 start", el: "service apache2 start" }, explain: { en: "Bring the web server up.", el: "Εκκίνησε την υπηρεσία web server." }, check: (t) => t.flags.has("service-apache2-start") },
      { id: "a2", instruction: { en: "service apache2 status", el: "service apache2 status" }, hint: { en: "service apache2 status", el: "service apache2 status" }, explain: { en: "Confirm running.", el: "Επιβεβαίωσε ότι η υπηρεσία λειτουργεί." }, check: (t) => t.flags.has("service-apache2-status") },
      { id: "a3", instruction: { en: "service apache2 stop   then   service apache2 restart", el: "Σταμάτησε την υπηρεσία Apache και έπειτα εκκίνησέ την ξανά." }, hint: { en: "service apache2 stop", el: "service apache2 stop" }, explain: { en: "Stop and restart after config changes.", el: "Μετά από αλλαγή ρυθμίσεων, σταμάτησε και επανεκκίνησε την υπηρεσία." }, check: (t) => t.flags.has("service-apache2-stop") || t.flags.has("service-apache2-restart") || usedCmd(t, /apache2\s+restart/) },
      { id: "idx", instruction: { en: "nano /var/www/html/index.html", el: "nano /var/www/html/index.html" }, hint: { en: "nano /var/www/html/index.html", el: "nano /var/www/html/index.html" }, explain: { en: "Default document root.", el: "Ορίστηκε ο βασικός φάκελος των ιστοσελίδων." }, check: (t) => t.flags.has("nano-index") || usedCmd(t, /index\.html/) },
      { id: "curl", instruction: { en: "curl http://localhost", el: "curl http://localhost" }, hint: { en: "curl http://localhost", el: "curl http://localhost" }, explain: { en: "Same as browsing http://localhost", el: "Το curl εμφανίζει την ίδια τοπική σελίδα που θα έβλεπες ανοίγοντας το http://localhost σε browser." }, check: (t) => t.flags.has("curl-local") || usedCmd(t, /localhost/) },
      { id: "sshst", instruction: { en: "service ssh start", el: "service ssh start" }, hint: { en: "service ssh start", el: "service ssh start" }, explain: { en: "sshd must listen first.", el: "Ξεκίνησε πρώτα το sshd για να δέχεται συνδέσεις SSH." }, check: (t) => t.flags.has("service-ssh-start") || usedCmd(t, /service\s+ssh\s+start/) },
      { id: "sshi", instruction: { en: "ssh ignite@192.168.0.11", el: "ssh ignite@192.168.0.11" }, hint: { en: "ssh ignite@192.168.0.11", el: "ssh ignite@192.168.0.11" }, explain: { en: "Simulated ubuntu host.", el: "Συνδέθηκες σε εικονικό host με Ubuntu." }, check: (t) => t.flags.has("ssh-ignite") },
      { id: "ftp", instruction: { en: "ftp ftp.forge.lab  then login anonymous / anonymous", el: "Συνδέσου στο ftp.forge.lab και κάνε είσοδο με όνομα χρήστη και κωδικό anonymous." }, hint: { en: "ftp ftp.forge.lab", el: "ftp ftp.forge.lab" }, explain: { en: "Then type anonymous twice.", el: "Πληκτρολόγησε anonymous ως όνομα χρήστη και ξανά ως κωδικό." }, check: (t) => t.flags.has("ftp") || t.flags.has("ftp-user") },
      { id: "get", instruction: { en: "In FTP: ls  then  get favicon.ico  then  bye", el: "Στο FTP, εμφάνισε τη λίστα με ls, κατέβασε το favicon.ico με get και αποσυνδέσου με bye." }, hint: { en: "get favicon.ico", el: "get favicon.ico" }, explain: { en: "Download and quit.", el: "Κατέβασε το αρχείο και αποσυνδέσου." }, check: (t) => t.flags.has("ftp-get") || t.flags.has("ftp-bye") },
    ],
    challenges: [
      {
        title: { en: "Local souvenir", el: "Βρες το αρχείο που κατέβασες" },
        brief: { en: "After bye, ls /root and look for favicon.ico", el: "Μετά την αποσύνδεση με bye, τρέξε ls /root και αναζήτησε το favicon.ico." },
        success: { en: "FTP get dropped a file in your home.", el: "Η εντολή get αποθήκευσε το αρχείο στον προσωπικό σου φάκελο." },
        check: (t) => t.flags.has("ftp-get") || usedCmd(t, /favicon/),
      },
      {
        title: { en: "Submit the forge", el: "Ολοκλήρωσε το εργαστήριο" },
        brief: { en: "submit FLAG{sudo_run_complete} when you have walked Apache, SSH and FTP.", el: "Αφού εξασκηθείς με Apache, SSH και FTP, υπέβαλε το FLAG{sudo_run_complete}." },
        success: { en: "Sudo_Run (Linux for Beginners) is complete. You are dangerous — stay ethical.", el: "Ολοκλήρωσες το Sudo_Run: Linux για αρχάριους. Έχεις αποκτήσει ισχυρές δυνατότητες — χρησιμοποίησέ τες υπεύθυνα." },
        check: (t) => t.flags.has("submit:FLAG{sudo_run_complete}") || (t.flags.has("ssh-ignite") && t.flags.has("curl-local")),
      },
    ],
  },
];
