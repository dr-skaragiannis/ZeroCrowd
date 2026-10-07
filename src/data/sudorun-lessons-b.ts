import type { Module } from "./lessons";
import { usedCmd } from "../lib/terminal";

const lab = "sudorun" as const;
const shot = (cmd: string, lines: string[]) => ({ cmd, lines });

export const SUDO_RUN_MODULES_B: Module[] = [
  {
    id: "sr-apt",
    order: 6,
    icon: "download",
    color: "from-orange-400 to-red-800",
    difficulty: 2,
    scenario: lab,
    title: { en: "Installing & removing software", el: "Εγκατάσταση και αφαίρεση λογισμικού" },
    subtitle: { en: "apt-cache, apt-get, sources.list", el: "Διαχείριση πακέτων: apt-cache, apt-get, sources.list" },
    badge: { en: "Packager", el: "Διαχειριστής πακέτων" },
    theory: [
      {
        heading: { en: "apt and repositories", el: "apt και αποθετήρια" },
        body: {
          en: "Debian-family distros (Kali is one) use APT — Advanced Packaging Tool. Think of a repository as the app store: you search it, install from it, remove from it. Do this in the lab; do not blindly add random repos on a real box.",
          el: "Οι διανομές της οικογένειας Debian, όπως το Kali, χρησιμοποιούν το APT (Advanced Packaging Tool). Σκέψου το αποθετήριο σαν κατάστημα εφαρμογών: εκεί αναζητάς, εγκαθιστάς και αφαιρείς πακέτα. Εξασκήσου στο εργαστήριο και μην προσθέτεις τυχαία αποθετήρια σε πραγματικό σύστημα.",
        },
      },
      {
        heading: { en: "Search", el: "Αναζήτηση" },
        body: {
          en: "apt-cache search hydra   (Hydra is a login-cracking tool — we only search the package name here.)",
          el: "Με την apt-cache search hydra αναζητάς το πακέτο Hydra. Εδώ ελέγχουμε μόνο το όνομα και τη διαθεσιμότητά του· δεν δοκιμάζουμε κωδικούς πρόσβασης.",
        },
        shots: [shot("apt-cache search hydra", ["hydra - very fast network logon cracker", "libhydra - hydra library (lab)", "qhydra - qt frontend"])],
      },
      {
        heading: { en: "Install, remove, purge", el: "Εγκατάσταση, αφαίρεση και εκκαθάριση" },
        body: {
          en: "apt-get install git   pulls git (useful to clone GitHub repos later). apt-get remove git   removes the package but may leave config. apt-get purge git   wipes residual files too. The sandbox stops remove and purge before changing package state, so you can practise the command syntax safely.",
          el: "Η apt-get install git εγκαθιστά το Git, χρήσιμο για τη λήψη αποθετηρίων από το GitHub. Η apt-get remove git αφαιρεί το πακέτο, αλλά μπορεί να αφήσει αρχεία ρυθμίσεων· η apt-get purge git αφαιρεί και αυτά. Στο sandbox, οι εντολές remove και purge σταματούν πριν αλλάξουν την κατάσταση του συστήματος, ώστε να εξασκηθείς με ασφάλεια στη σύνταξή τους.",
        },
        shots: [
          shot("apt-get install git", ["The following NEW packages will be installed:", "  git", "Setting up git (lab) ..."]),
          shot("apt-get remove git", ["The following packages will be REMOVED:", "  git", "Do you want to continue? [Y/n] n", "Abort."]),
        ],
      },
      {
        heading: { en: "update vs upgrade", el: "update και upgrade: ποια είναι η διαφορά;" },
        body: {
          en: "apt-get update   refreshes the list of available packages (downloads index, does not install). apt-get upgrade   applies those updates. Upgrade can take a while on a real machine.",
          el: "Η apt-get update ανανεώνει τον κατάλογο των διαθέσιμων πακέτων· κατεβάζει ευρετήριο, αλλά δεν εγκαθιστά τίποτα. Η apt-get upgrade εγκαθιστά τις διαθέσιμες ενημερώσεις. Σε πραγματικό υπολογιστή, η αναβάθμιση μπορεί να διαρκέσει αρκετή ώρα.",
        },
        shots: [
          shot("apt-get update", ["Hit:1 http://http.kali.org/kali kali-rolling InRelease", "Reading package lists... Done"]),
          shot("apt-get upgrade", ["Calculating upgrade... Done", "0 upgraded, 0 newly installed, 0 to remove."]),
        ],
      },
      {
        heading: { en: "sources.list", el: "sources.list" },
        body: {
          en: "The servers that hold packages are listed in /etc/apt/sources.list. nano /etc/apt/sources.list to read it. Do NOT add experimental repos — they can break a box. Highlighted in a real Kali is the kali-rolling line.",
          el: "Το αρχείο /etc/apt/sources.list περιέχει τις διευθύνσεις των διακομιστών που φιλοξενούν πακέτα. Άνοιξέ το με nano /etc/apt/sources.list για να το διαβάσεις. Μην προσθέτεις πειραματικά αποθετήρια σε πραγματικό σύστημα — μπορεί να το αποσταθεροποιήσουν. Στο Kali, η βασική γραμμή είναι συνήθως η kali-rolling.",
        },
        shots: [shot("nano /etc/apt/sources.list", ["deb http://http.kali.org/kali kali-rolling main contrib non-free non-free-firmware", "# Gamehack lab — do not add experimental repos."])],
      },
    ],
    cheats: [
      { cmd: "apt-cache search hydra", desc: { en: "search repo", el: "αναζήτηση" } },
      { cmd: "apt-get install git", desc: { en: "install", el: "εγκατάσταση" } },
      { cmd: "apt-get remove git", desc: { en: "remove", el: "αφαίρεση" } },
      { cmd: "apt-get purge git", desc: { en: "remove + configs", el: "πλήρης αφαίρεση" } },
      { cmd: "apt-get update", desc: { en: "refresh index", el: "ανανέωση ευρετηρίου" } },
      { cmd: "apt-get upgrade", desc: { en: "apply updates", el: "εφαρμογή" } },
      { cmd: "nano /etc/apt/sources.list", desc: { en: "repo list", el: "λίστα repos" } },
    ],
    tasks: [
      { id: "search", instruction: { en: "apt-cache search hydra", el: "apt-cache search hydra" }, hint: { en: "apt-cache search hydra", el: "apt-cache search hydra" }, explain: { en: "Search before you install.", el: "Αναζήτησε πρώτα το πακέτο και έπειτα εγκατέστησέ το." }, check: (t) => t.flags.has("apt-search") },
      { id: "install", instruction: { en: "apt-get install git", el: "apt-get install git" }, hint: { en: "apt-get install git", el: "apt-get install git" }, explain: { en: "Install from the repo.", el: "Εγκατάστησε το πακέτο από το αποθετήριο." }, check: (t) => t.flags.has("apt-install") },
      { id: "remove", instruction: { en: "apt-get remove git  (sandbox aborts like pressing n)", el: "Εκτέλεσε apt-get remove git. Το sandbox θα ακυρώσει την αφαίρεση, όπως αν απαντούσες n στην επιβεβαίωση." }, hint: { en: "apt-get remove git", el: "apt-get remove git" }, explain: { en: "The sandbox stops before removing the package.", el: "Το sandbox σταματά πριν αφαιρέσει το πακέτο." }, check: (t) => t.flags.has("apt-remove") },
      { id: "purge", instruction: { en: "apt-get purge git", el: "apt-get purge git" }, hint: { en: "apt-get purge git", el: "apt-get purge git" }, explain: { en: "Purge leftover configs.", el: "Η purge αφαιρεί και τα αρχεία ρυθμίσεων που μπορεί να αφήσει η remove." }, check: (t) => t.flags.has("apt-purge") },
      { id: "update", instruction: { en: "apt-get update", el: "apt-get update" }, hint: { en: "apt-get update", el: "apt-get update" }, explain: { en: "Refresh package lists.", el: "Ανανέωσε τον κατάλογο των διαθέσιμων πακέτων." }, check: (t) => t.flags.has("apt-update") },
      { id: "upgrade", instruction: { en: "apt-get upgrade", el: "apt-get upgrade" }, hint: { en: "apt-get upgrade", el: "apt-get upgrade" }, explain: { en: "Apply the index from update.", el: "Εγκατέστησε τις ενημερώσεις που εντοπίστηκαν με την apt-get update." }, check: (t) => t.flags.has("apt-upgrade") },
      { id: "src", instruction: { en: "nano /etc/apt/sources.list", el: "nano /etc/apt/sources.list" }, hint: { en: "nano /etc/apt/sources.list", el: "nano /etc/apt/sources.list" }, explain: { en: "See which repo Kali uses.", el: "Δες ποιο αποθετήριο χρησιμοποιεί το Kali." }, check: (t) => t.flags.has("nano-sources") || t.flags.has("read-sources") || usedCmd(t, /sources\.list/) },
    ],
    challenges: [
      {
        title: { en: "Read sources without nano", el: "Διάβασε το sources.list χωρίς να χρησιμοποιήσεις nano" },
        brief: { en: "cat /etc/apt/sources.list", el: "cat /etc/apt/sources.list" },
        success: { en: "Same file, different tool.", el: "Διάβασες το ίδιο αρχείο χρησιμοποιώντας διαφορετική εντολή." },
        check: (t) => t.filesRead.some((p) => p.includes("sources.list")) || t.flags.has("nano-sources"),
      },
      {
        title: { en: "Search then install", el: "Αναζήτησε και εγκατέστησε ένα πακέτο" },
        brief: { en: "You already searched hydra and installed git — that is the full loop.", el: "Έχεις ήδη αναζητήσει το Hydra και εγκαταστήσει το Git — ολοκλήρωσες τη βασική διαδικασία διαχείρισης πακέτων." },
        success: { en: "Repo workflow complete.", el: "Ολοκλήρωσες τη βασική διαδικασία με το αποθετήριο." },
        check: (t) => t.flags.has("apt-search") && t.flags.has("apt-install"),
      },
    ],
  },
  {
    id: "sr-perms",
    order: 7,
    icon: "lock",
    color: "from-violet-400 to-purple-900",
    difficulty: 3,
    scenario: lab,
    title: { en: "Playing with permissions", el: "Εξερεύνηση δικαιωμάτων αρχείων" },
    subtitle: { en: "ls -l, chown, chgrp, chmod, SUID, SGID", el: "ls -l, chown, chgrp, chmod, SUID, SGID" },
    badge: { en: "Mode Bender", el: "Ρυθμιστής δικαιωμάτων" },
    theory: [
      {
        heading: { en: "Users, groups, rwx", el: "Χρήστες, ομάδες, rwx" },
        body: {
          en: "Root can do anything. Other users are limited and often collected into groups (developers, admins…). Every file has three permission triples: owner, group, others. r = open/view, w = edit, x = execute (x does not imply you can read). ls -l shows: type (- file, d directory), rwxrwxrwx, links, owner, group, size, mtime, name.",
          el: "Ο root έχει πλήρη δικαιώματα, ενώ οι υπόλοιποι χρήστες έχουν περιορισμένη πρόσβαση και συχνά ανήκουν σε ομάδες. Κάθε αρχείο έχει τρεις τριάδες δικαιωμάτων: για τον ιδιοκτήτη, την ομάδα και τους υπόλοιπους. Το r επιτρέπει ανάγνωση, το w εγγραφή και το x εκτέλεση — χωρίς να εγγυάται δικαίωμα ανάγνωσης. Η ls -l εμφανίζει τον τύπο, τα δικαιώματα, τους συνδέσμους, τον ιδιοκτήτη, την ομάδα, το μέγεθος, την ημερομηνία τροποποίησης και το όνομα.",
        },
        shots: [shot("ls -l gamehack.txt", ["-rw-r--r-- 1 root root  142 gamehack.txt"])],
      },
      {
        heading: { en: "chown and chgrp", el: "chown και chgrp" },
        body: {
          en: "chown USER FILE changes the owner. chown Raj gamehack.txt  (Raj is a lab user). chgrp GROUP FILE changes the group. chgrp ignite gamehack.txt  so only the ignite team owns it as a group.",
          el: "Η chown ΧΡΗΣΤΗΣ ΑΡΧΕΙΟ αλλάζει τον ιδιοκτήτη. Για παράδειγμα, η chown Raj gamehack.txt ορίζει ως ιδιοκτήτη τον χρήστη Raj του εργαστηρίου. Η chgrp ΟΜΑΔΑ ΑΡΧΕΙΟ αλλάζει την ομάδα· με chgrp ignite gamehack.txt αναθέτεις το αρχείο στην ομάδα ignite.",
        },
        shots: [
          shot("chown Raj gamehack.txt", [""]),
          shot("chgrp ignite gamehack.txt", [""]),
          shot("ls -l gamehack.txt", ["-rw-r--r-- 1 Raj ignite  142 gamehack.txt"]),
        ],
      },
      {
        heading: { en: "chmod numeric table", el: "Πίνακας chmod" },
        body: {
          en: "0 ---  ·  1 --x  ·  2 -w-  ·  3 -wx  ·  4 r--  ·  5 r-x  ·  6 rw-  ·  7 rwx. chmod 777 FILE gives everyone everything. chmod 111 FILE is execute-only. Symbolic: chmod +x gamehack.txt makes it executable (often shown in a different colour on a real TTY).",
          el: "Οι αριθμητικές τιμές είναι συνδυασμοί των r (4), w (2) και x (1): 0 = ---, 1 = --x, 2 = -w-, 3 = -wx, 4 = r--, 5 = r-x, 6 = rw- και 7 = rwx. Η chmod 777 FILE δίνει όλα τα δικαιώματα σε όλους, ενώ η chmod 111 FILE δίνει μόνο δικαίωμα εκτέλεσης. Η συμβολική μορφή chmod +x gamehack.txt προσθέτει δικαίωμα εκτέλεσης.",
        },
        shots: [shot("chmod +x gamehack.txt", ["-rwxr--r-- 1 Raj ignite  142 gamehack.txt"])],
      },
      {
        heading: { en: "SUID and SGID", el: "SUID και SGID" },
        body: {
          en: "SUID: any user executing the file runs it with the OWNER's permissions, only for that file. Set by prefixing 4: chmod 4644 gamehack.txt (regular 644 + SUID). SGID: same idea for the owner's GROUP, prefix 2: chmod 2466 gamehack.txt. These bits are famous privilege-escalation findings — understand them so you can remove them as a defender.",
          el: "Το SUID κάνει το αρχείο να εκτελείται με τα δικαιώματα του ιδιοκτήτη του, ανεξάρτητα από το ποιος το εκτελεί. Ενεργοποιείται με πρόθεμα 4, π.χ. chmod 4644 gamehack.txt. Το SGID εφαρμόζει την ίδια λογική στην ομάδα του αρχείου και ενεργοποιείται με πρόθεμα 2, π.χ. chmod 2466 gamehack.txt. Αυτά τα ειδικά bits μπορεί να οδηγήσουν σε κλιμάκωση προνομίων· ως αμυντικός, μάθε να τα εντοπίζεις και να τα αφαιρείς όταν δεν χρειάζονται.",
        },
        shots: [
          shot("chmod 4644 gamehack.txt", ["-rw-r--r-- with SUID bit set (rws / 4644)"]),
          shot("chmod 2466 gamehack.txt", ["SGID set (2466)"]),
        ],
      },
    ],
    cheats: [
      { cmd: "ls -l FILE", desc: { en: "long listing", el: "αναλυτικά" } },
      { cmd: "chown Raj gamehack.txt", desc: { en: "change owner", el: "ιδιοκτήτης" } },
      { cmd: "chgrp ignite gamehack.txt", desc: { en: "change group", el: "ομάδα" } },
      { cmd: "chmod +x FILE", desc: { en: "add execute", el: "+x" } },
      { cmd: "chmod 4644 FILE", desc: { en: "SUID + 644", el: "SUID" } },
      { cmd: "chmod 2466 FILE", desc: { en: "SGID + 466", el: "SGID" } },
    ],
    tasks: [
      { id: "lsl", instruction: { en: "ls -l gamehack.txt", el: "ls -l gamehack.txt" }, hint: { en: "ls -l /root/gamehack.txt", el: "ls -l" }, explain: { en: "Read the owner/group columns.", el: "Έλεγξε τις στήλες ιδιοκτήτη και ομάδας." }, check: (t) => t.flags.has("ls-l") || usedCmd(t, /ls\s+-l/) },
      { id: "chown", instruction: { en: "chown Raj gamehack.txt", el: "chown Raj gamehack.txt" }, hint: { en: "chown Raj gamehack.txt", el: "chown Raj gamehack.txt" }, explain: { en: "Owner becomes Raj.", el: "Ο ιδιοκτήτης του αρχείου γίνεται ο Raj." }, check: (t) => t.flags.has("chown-raj") || usedCmd(t, /chown\s+Raj/) },
      { id: "chgrp", instruction: { en: "chgrp ignite gamehack.txt", el: "chgrp ignite gamehack.txt" }, hint: { en: "chgrp ignite gamehack.txt", el: "chgrp ignite gamehack.txt" }, explain: { en: "Group becomes ignite.", el: "Η ομάδα του αρχείου γίνεται η ignite." }, check: (t) => t.flags.has("chgrp-ignite") || usedCmd(t, /chgrp\s+ignite/) },
      { id: "plusx", instruction: { en: "chmod +x gamehack.txt", el: "chmod +x gamehack.txt" }, hint: { en: "chmod +x gamehack.txt", el: "chmod +x gamehack.txt" }, explain: { en: "Execute bit for the owner.", el: "Πρόσθεσε δικαίωμα εκτέλεσης για τον ιδιοκτήτη." }, check: (t) => t.flags.has("chmod-x") || usedCmd(t, /chmod\s+\+x/) },
      { id: "suid", instruction: { en: "chmod 4644 gamehack.txt", el: "chmod 4644 gamehack.txt" }, hint: { en: "chmod 4644 gamehack.txt", el: "chmod 4644" }, explain: { en: "4 prefix = SUID.", el: "Το πρόθεμα 4 ενεργοποιεί το bit SUID." }, check: (t) => t.flags.has("suid") || usedCmd(t, /chmod\s+4644/) },
      { id: "sgid", instruction: { en: "chmod 2466 gamehack.txt", el: "chmod 2466 gamehack.txt" }, hint: { en: "chmod 2466 gamehack.txt", el: "chmod 2466" }, explain: { en: "2 prefix = SGID.", el: "Το πρόθεμα 2 ενεργοποιεί το bit SGID." }, check: (t) => t.flags.has("sgid") || usedCmd(t, /chmod\s+2466/) },
    ],
    challenges: [
      {
        title: { en: "Verify with ls -l", el: "Επιβεβαίωση ls -l" },
        brief: { en: "ls -l gamehack.txt after the chown/chmod chain.", el: "Τρέξε ls -l gamehack.txt μετά τις αλλαγές με chown και chmod." },
        success: { en: "You can read the mode string.", el: "Μπορείς πλέον να ερμηνεύεις τη συμβολοσειρά δικαιωμάτων." },
        check: (t) => t.flags.has("ls-l"),
      },
      {
        title: { en: "Know the table", el: "Ξέρε τον πίνακα" },
        brief: { en: "chmod 755 on any file you created (e.g. gamehack-2.txt if it still exists, or touch one).", el: "Εφάρμοσε chmod 755 σε ένα αρχείο που δημιούργησες, όπως το gamehack-2.txt. Αν δεν υπάρχει, δημιούργησέ το πρώτα με touch." },
        success: { en: "755 = rwxr-xr-x — classic executable.", el: "Η τιμή 755 αντιστοιχεί σε rwxr-xr-x, μια συνηθισμένη ρύθμιση για εκτελέσιμα αρχεία." },
        check: (t) => usedCmd(t, /chmod\s+755/) || t.flags.has("chmod"),
      },
    ],
  },
  {
    id: "sr-net",
    order: 8,
    icon: "wifi",
    color: "from-cyan-400 to-blue-900",
    difficulty: 3,
    scenario: lab,
    title: { en: "Managing networks", el: "Έλεγχος και ρύθμιση δικτύου" },
    subtitle: { en: "ifconfig, iwconfig, DHCP, dig, DNS, hosts", el: "Ρυθμίσεις δικτύου: ifconfig, iwconfig, DHCP, dig, DNS και hosts" },
    badge: { en: "Net Rider", el: "Αναβάτης δικτύου" },
    theory: [
      {
        heading: { en: "ifconfig", el: "ifconfig" },
        body: {
          en: "ifconfig shows active interfaces. You should see eth0 (your NIC) and lo (loopback, always 127.0.0.1) with IP, netmask, broadcast, MAC.",
          el: "Η ifconfig εμφανίζει τις ενεργές διεπαφές δικτύου. Θα δεις την eth0 (ενσύρματη διεπαφή) και τη lo (loopback, πάντα στη διεύθυνση 127.0.0.1), μαζί με τη διεύθυνση IP, τη μάσκα υποδικτύου, τη διεύθυνση broadcast και τη MAC.",
        },
        shots: [shot("ifconfig", ["eth0: flags=4163<UP,BROADCAST,RUNNING> mtu 1500", "        inet 10.10.10.2  netmask 255.255.255.0  broadcast 10.10.10.255", "        ether 08:00:27:12:34:56", "lo: flags=73<UP,LOOPBACK,RUNNING>", "        inet 127.0.0.1  netmask 255.0.0.0"])],
      },
      {
        heading: { en: "iwconfig", el: "iwconfig" },
        body: {
          en: "iwconfig talks to wireless adapters (SSID, mode, MAC…). No wifi in this lab? You still run it — output shows 'no wireless extensions' on eth0/lo.",
          el: "Η iwconfig εμφανίζει πληροφορίες για ασύρματες διεπαφές, όπως SSID, λειτουργία και MAC. Τρέξε την ακόμη κι αν το εργαστήριο δεν έχει Wi-Fi: για τις eth0 και lo θα εμφανιστεί το μήνυμα no wireless extensions.",
        },
        shots: [shot("iwconfig", ["lo        no wireless extensions.", "eth0      no wireless extensions.", "wlan0     IEEE 802.11  ESSID:off/any"])],
      },
      {
        heading: { en: "Change IP", el: "Αλλαγή διεύθυνσης IP" },
        body: {
          en: "ifconfig eth0 10.10.10.13   assigns that address. Run ifconfig again to see it.",
          el: "Η εντολή ifconfig eth0 10.10.10.13 εκχωρεί αυτή τη διεύθυνση στην eth0. Τρέξε ξανά την ifconfig για να επιβεβαιώσεις την αλλαγή.",
        },
        shots: [shot("ifconfig eth0 10.10.10.13", ["eth0 inet 10.10.10.13"])],
      },
      {
        heading: { en: "Spoof MAC (lab only)", el: "Αλλαγή διεύθυνσης MAC (μόνο στο εργαστήριο)" },
        body: {
          en: "A MAC address identifies an interface on its local link; it is not reliable proof of a person's identity. In an authorized lab, the locally administered test value 02:00:00:00:00:13 can be set with ifconfig eth0 down, ifconfig eth0 hw ether 02:00:00:00:00:13, then ifconfig eth0 up. This simulator changes only the fictional interface; never use a MAC change to bypass access controls.",
          el: "Η MAC χαρακτηρίζει διεπαφή στο τοπικό δίκτυο· δεν αποδεικνύει την ταυτότητα ανθρώπου. Σε εξουσιοδοτημένο εργαστήριο μπορείς να ορίσεις τη δοκιμαστική, τοπικά διαχειριζόμενη τιμή 02:00:00:00:00:13 με τη σειρά ifconfig eth0 down, ifconfig eth0 hw ether 02:00:00:00:00:13 και ifconfig eth0 up. Ο προσομοιωτής αλλάζει μόνο την εικονική διεπαφή· μην χρησιμοποιείς αλλαγή MAC για παράκαμψη ελέγχων πρόσβασης."
        },
        shots: [
          shot("ifconfig eth0 down", [""]),
          shot("ifconfig eth0 hw ether 02:00:00:00:00:13", ["ether 02:00:00:00:00:13"]),
          shot("ifconfig eth0 up", [""]),
        ],
      },
      {
        heading: { en: "dhclient", el: "dhclient" },
        body: {
          en: "DHCP assigns addresses automatically. dhclient eth0 asks the (simulated) server for a lease — it will overwrite the IP you set by hand.",
          el: "Το DHCP εκχωρεί αυτόματα διευθύνσεις δικτύου. Η dhclient eth0 ζητά ένα lease από τον εικονικό διακομιστή DHCP και μπορεί να αντικαταστήσει τη διεύθυνση που όρισες χειροκίνητα.",
        },
        shots: [shot("dhclient eth0", ["DHCPREQUEST of 10.10.10.42 on eth0", "bound to 10.10.10.42 -- renewal in 1800 seconds."])],
      },
      {
        heading: { en: "dig — DNS", el: "dig — αναζήτηση εγγραφών DNS" },
        body: {
          en: "DNS maps names to IPs. dig gamehack.lab   (A record). dig gamehack.lab mx   (mail). dig gamehack.lab ns   (nameservers). All answers for gamehack.lab are fictional fixtures served inside the sandbox; no public domain is queried.",
          el: "Το DNS αντιστοιχίζει ονόματα σε διευθύνσεις IP. Η dig gamehack.lab ζητά εγγραφή A, η dig gamehack.lab mx αναζητά τον mail server και η dig gamehack.lab ns τους nameservers. Οι απαντήσεις για το gamehack.lab είναι εικονικά δεδομένα του sandbox· δεν γίνεται ερώτημα σε δημόσιο domain.",
        },
        shots: [
          shot("dig gamehack.lab", ["gamehack.lab.    300 IN A 10.10.10.8"]),
          shot("dig gamehack.lab mx", ["gamehack.lab.    300 IN MX 10 mail.gamehack.lab."]),
          shot("dig gamehack.lab ns", ["gamehack.lab.    300 IN NS ns1.gamehack.lab."]),
        ],
      },
      {
        heading: { en: "resolv.conf and hosts", el: "resolv.conf και hosts" },
        body: {
          en: "The resolver reads DNS server addresses from /etc/resolv.conf. In this isolated lab, echo \"nameserver 10.10.10.53\" > /etc/resolv.conf writes the fictional lab resolver. /etc/hosts is a static name-to-address table for this machine only; it does not publish DNS or redirect another user's traffic. Use nano /etc/hosts to inspect the entries, and add only authorized local training names.",
          el: "Ο resolver διαβάζει διευθύνσεις DNS από το /etc/resolv.conf. Στο απομονωμένο εργαστήριο, η εντολή echo \"nameserver 10.10.10.53\" > /etc/resolv.conf γράφει τον εικονικό resolver. Το /etc/hosts είναι στατικός πίνακας ονομάτων για αυτόν τον υπολογιστή· δεν δημοσιεύει εγγραφή DNS ούτε αλλάζει την κίνηση άλλου χρήστη. Με το nano /etc/hosts ελέγχεις τις εγγραφές και προσθέτεις μόνο εξουσιοδοτημένα ονόματα εκπαίδευσης."
        },
        shots: [
          shot('echo "nameserver 10.10.10.53" > /etc/resolv.conf', [""]),
          shot("cat /etc/resolv.conf", ["nameserver 10.10.10.53"]),
          shot("nano /etc/hosts", ["127.0.0.1 localhost", "10.10.10.8 gamehack.lab www.gamehack.lab"]),
        ],
      },
    ],
    cheats: [
      { cmd: "ifconfig", desc: { en: "interfaces", el: "διεπαφές" } },
      { cmd: "iwconfig", desc: { en: "wifi info", el: "wifi" } },
      { cmd: "ifconfig eth0 10.10.10.13", desc: { en: "set IP", el: "ορισμός IP" } },
      { cmd: "ifconfig eth0 hw ether MAC", desc: { en: "set MAC (lab)", el: "MAC (lab)" } },
      { cmd: "dhclient eth0", desc: { en: "DHCP lease", el: "DHCP" } },
      { cmd: "dig gamehack.lab mx", desc: { en: "DNS MX", el: "DNS MX" } },
      { cmd: "echo nameserver 10.10.10.53 > /etc/resolv.conf", desc: { en: "set DNS", el: "DNS" } },
    ],
    tasks: [
      { id: "ifc", instruction: { en: "ifconfig", el: "ifconfig" }, hint: { en: "ifconfig", el: "ifconfig" }, explain: { en: "See eth0 and lo.", el: "Εντόπισε τις διεπαφές eth0 και lo." }, check: (t) => t.flags.has("ip") || usedCmd(t, /^\s*ifconfig\b/) },
      { id: "iw", instruction: { en: "iwconfig", el: "iwconfig" }, hint: { en: "iwconfig", el: "iwconfig" }, explain: { en: "Wireless info.", el: "Έλεγξε τις διαθέσιμες πληροφορίες για ασύρματες διεπαφές." }, check: (t) => t.flags.has("iwconfig") },
      { id: "ipset", instruction: { en: "ifconfig eth0 10.10.10.13", el: "ifconfig eth0 10.10.10.13" }, hint: { en: "ifconfig eth0 10.10.10.13", el: "ifconfig eth0 10.10.10.13" }, explain: { en: "Static IP in the lab.", el: "Όρισε μια στατική διεύθυνση IP στο εικονικό εργαστήριο." }, check: (t) => t.flags.has("ip-set") || usedCmd(t, /ifconfig\s+eth0\s+10\.10\.10\.13/) },
      { id: "mac", instruction: { en: "ifconfig eth0 down ; ifconfig eth0 hw ether 02:00:00:00:00:13 ; ifconfig eth0 up  (one at a time is fine)", el: "Άλλαξε τη διεύθυνση MAC της εικονικής διεπαφής με τις εντολές ifconfig eth0 down, ifconfig eth0 hw ether 02:00:00:00:00:13 και ifconfig eth0 up. Μπορείς να τις εκτελέσεις μία μία." }, hint: { en: "ifconfig eth0 down\nifconfig eth0 hw ether 02:00:00:00:00:13\nifconfig eth0 up", el: "ifconfig eth0 down\nifconfig eth0 hw ether 02:00:00:00:00:13\nifconfig eth0 up" }, explain: { en: "Lab-only MAC change.", el: "Αλλαγή MAC μόνο lab." }, check: (t) => t.flags.has("mac-spoof") || usedCmd(t, /hw\s+ether/) },
      { id: "dhcp", instruction: { en: "dhclient eth0", el: "dhclient eth0" }, hint: { en: "dhclient eth0", el: "dhclient eth0" }, explain: { en: "Ask DHCP for an address.", el: "Ζήτησε διεύθυνση IP από τον DHCP server." }, check: (t) => t.flags.has("dhclient") },
      { id: "dig", instruction: { en: "dig gamehack.lab", el: "dig gamehack.lab" }, hint: { en: "dig gamehack.lab", el: "dig gamehack.lab" }, explain: { en: "A record.", el: "Εγγραφή A στο DNS." }, check: (t) => t.flags.has("dig-a") || t.flags.has("dig") },
      { id: "digmx", instruction: { en: "dig gamehack.lab mx  AND  dig gamehack.lab ns", el: "Χρησιμοποίησε τις εντολές dig gamehack.lab mx και dig gamehack.lab ns για να δεις τις εγγραφές MX και NS." }, hint: { en: "dig gamehack.lab mx", el: "dig gamehack.lab mx" }, explain: { en: "Mail and nameserver records.", el: "Εμφάνισε εγγραφές αλληλογραφίας MX και nameserver NS." }, check: (t) => t.flags.has("dig-mx") || t.flags.has("dig-ns") || usedCmd(t, /dig\s+.*mx/) },
      { id: "dns", instruction: { en: 'echo "nameserver 10.10.10.53" > /etc/resolv.conf', el: "echo nameserver στο resolv.conf" }, hint: { en: 'echo "nameserver 10.10.10.53" > /etc/resolv.conf', el: "echo … > /etc/resolv.conf" }, explain: { en: "Overwrite resolver.", el: "Η ανακατεύθυνση αντικαθιστά τις ρυθμίσεις του DNS resolver." }, check: (t) => t.flags.has("dns-set") || usedCmd(t, /resolv\.conf/) },
      { id: "hosts", instruction: { en: "nano /etc/hosts  (or cat it)", el: "nano /etc/hosts" }, hint: { en: "nano /etc/hosts", el: "nano /etc/hosts" }, explain: { en: "Static names.", el: "Στατικά ονόματα." }, check: (t) => t.flags.has("nano-hosts") || t.flags.has("read-hosts") || usedCmd(t, /\/etc\/hosts/) },
    ],
    challenges: [
      {
        title: { en: "Prove the new DNS", el: "Επιβεβαίωσε τη νέα ρύθμιση DNS" },
        brief: { en: "cat /etc/resolv.conf after the echo redirect.", el: "Μετά την ανακατεύθυνση της echo, διάβασε το /etc/resolv.conf." },
        success: { en: "10.10.10.53 is in the file.", el: "Επιβεβαίωσε ότι το αρχείο περιέχει τη διεύθυνση 10.10.10.53." },
        check: (t) => t.flags.has("dns-set") || t.filesRead.some((p) => p.includes("resolv")),
      },
      {
        title: { en: "ifconfig after DHCP", el: "ifconfig μετά το DHCP" },
        brief: { en: "ifconfig and notice the lease IP.", el: "Τρέξε ifconfig και εντόπισε τη διεύθυνση IP που εκχωρήθηκε μέσω DHCP." },
        success: { en: "DHCP overwrote your static address.", el: "Το DHCP αντικατέστησε τη στατική διεύθυνση που είχες ορίσει." },
        check: (t) => t.flags.has("dhclient") && t.flags.has("ip"),
      },
    ],
  },
  {
    id: "sr-proc",
    order: 9,
    icon: "cpu",
    color: "from-rose-400 to-red-900",
    difficulty: 3,
    scenario: lab,
    title: { en: "Process management", el: "Διαχείριση διεργασιών" },
    subtitle: { en: "ps, top, nice, kill, jobs, at", el: "ps, top, nice, kill, jobs, at" },
    badge: { en: "Process Whisperer", el: "Ερευνητής διεργασιών" },
    theory: [
      {
        heading: { en: "ps and ps aux", el: "ps και ps aux" },
        body: {
          en: "A process is a running program. ps lists YOUR active processes (PID is unique). ps aux lists ALL users: PID, user, %CPU, %MEM, COMMAND. Filter: ps aux | grep msfconsole",
          el: "Διεργασία είναι ένα πρόγραμμα που εκτελείται. Η ps εμφανίζει τις διεργασίες της τρέχουσας συνεδρίας· κάθε μία έχει μοναδικό PID. Η ps aux εμφανίζει διεργασίες όλων των χρηστών, μαζί με PID, χρήστη, χρήση CPU και μνήμης, και εντολή. Για φιλτράρισμα, δοκίμασε ps aux | grep msfconsole.",
        },
        shots: [
          shot("ps", ["  PID TTY          TIME CMD", "    1 pts/0    00:00:00 init"]),
          shot("ps aux | grep msfconsole", ["root       880 1.2  2.1  msfconsole"]),
        ],
      },
      {
        heading: { en: "top", el: "top" },
        body: {
          en: "top sorts by resource use and refreshes (about every 10s on a real box). Use it to find the greediest process.",
          el: "Η top ταξινομεί τις διεργασίες ανάλογα με τη χρήση πόρων και ανανεώνει την προβολή τακτικά. Σε πραγματικό σύστημα, η ανανέωση γίνεται περίπου κάθε 10 δευτερόλεπτα. Χρησιμοποίησέ την για να εντοπίσεις ποια διεργασία καταναλώνει τους περισσότερους πόρους.",
        },
        shots: [shot("top", ["PID USER      %CPU %MEM COMMAND", "4378 root  8.4  6.2  [zombie-lab]"])],
      },
      {
        heading: { en: "nice / renice", el: "nice / renice" },
        body: {
          en: "nice -n 10 /usr/bin/ssh-agent starts a command with lower scheduling priority. Linux niceness ranges from -20 (highest priority) to 19 (lowest); renice 19 6242 sets the absolute value for PID 6242.",
          el: "Η nice ορίζει την τιμή niceness κατά την εκκίνηση μιας εντολής, ενώ η renice αλλάζει την τιμή σε διεργασία που ήδη εκτελείται. Το εύρος στο Linux είναι από -20 (υψηλότερη προτεραιότητα) έως 19 (χαμηλότερη). Για παράδειγμα, η renice 19 6242 ορίζει την τιμή 19 για το PID 6242.",
        },
        shots: [
          shot("nice -n 10 /usr/bin/ssh-agent", ["would start /usr/bin/ssh-agent with nice 10 (simulated; positive values lower scheduling priority)"]),
          shot("renice 19 6242", ["6242: old priority 0, new priority 19"]),
        ],
      },
      {
        heading: { en: "kill", el: "kill" },
        body: {
          en: "kill sends a signal to a PID. SIGTERM (15) requests a normal stop; SIGHUP (1) reports a hangup and some programs use it to reload configuration, so it is not a universal gentle-stop command. SIGKILL (9) forces termination without cleanup. Verify the PID first; every process here is fictional.",
          el: "Η kill στέλνει σήμα σε ένα PID. Το SIGTERM (15) ζητά από τη διεργασία να τερματιστεί κανονικά. Το SIGHUP (1) δηλώνει αποσύνδεση και ορισμένα προγράμματα το χρησιμοποιούν για να φορτώσουν ξανά τις ρυθμίσεις τους — δεν αποτελεί πάντα ήπιο τρόπο τερματισμού. Το SIGKILL (9) τερματίζει αναγκαστικά τη διεργασία, χωρίς να της δώσει χρόνο για καθαρισμό. Έλεγξε πρώτα το PID· εδώ όλες οι διεργασίες είναι εικονικές.",
        },
        shots: [
          shot("kill -1 6242", ["sent SIGHUP to 6242; outcome depends on the process (simulated)."]),
          shot("kill -9 4378", ["sent SIGKILL to 4378; process stopped (simulated)."]),
        ],
      },
      {
        heading: { en: "Background, fg, jobs, at", el: "Εργασίες παρασκηνίου και προγραμματισμός: fg, jobs, at" },
        body: {
          en: "Append & to run in the background: nano gamehack.txt &  (prints a PID). jobs lists background jobs. fg PID (or fg) brings one back. at 9:00pm  schedules a one-shot job (crond is for repeating). Example: at 9:00pm  then /root/simple_bash.sh",
          el: "Πρόσθεσε το & στο τέλος μιας εντολής για να την εκτελέσεις στο παρασκήνιο· θα εμφανιστεί το PID της. Η jobs εμφανίζει τις εργασίες παρασκηνίου, ενώ η fg PID (ή απλώς fg) επαναφέρει μία στο προσκήνιο. Η at προγραμματίζει μια εργασία για μία φορά· για επαναλαμβανόμενες εργασίες χρησιμοποιείται η cron. Για παράδειγμα: at 9:00pm και έπειτα /root/simple_bash.sh.",
        },
        shots: [
          shot("nano gamehack.txt &", ["[1] 7100"]),
          shot("jobs", ["[1]  Running  nano gamehack.txt"]),
          shot("at 9:00pm", ["at> (type a command then Ctrl-D in a real shell)", "job 1 at 9:00pm"]),
        ],
      },
    ],
    cheats: [
      { cmd: "ps", desc: { en: "your processes", el: "οι διεργασίες σου" } },
      { cmd: "ps aux", desc: { en: "all processes", el: "όλες" } },
      { cmd: "ps aux | grep msfconsole", desc: { en: "filter", el: "φίλτρο" } },
      { cmd: "top", desc: { en: "live resource view", el: "πόροι live" } },
      { cmd: "nice -n 10 CMD", desc: { en: "start at lower priority", el: "εκκίνηση με χαμηλότερη προτεραιότητα" } },
      { cmd: "renice 19 PID", desc: { en: "reprioritise", el: "αλλαγή nice" } },
      { cmd: "kill -9 PID", desc: { en: "force stop", el: "βίαιο stop" } },
      { cmd: "CMD &", desc: { en: "background", el: "παρασκήνιο" } },
      { cmd: "jobs / fg", desc: { en: "job control", el: "jobs" } },
      { cmd: "at 9:00pm", desc: { en: "one-shot schedule", el: "προγραμματισμός μία φορά" } },
    ],
    tasks: [
      { id: "ps", instruction: { en: "ps", el: "ps" }, hint: { en: "ps", el: "ps" }, explain: { en: "Your session's processes.", el: "Οι διεργασίες της τρέχουσας συνεδρίας." }, check: (t) => t.flags.has("ps") },
      { id: "aux", instruction: { en: "ps aux", el: "ps aux" }, hint: { en: "ps aux", el: "ps aux" }, explain: { en: "Everyone's processes.", el: "Οι διεργασίες όλων των χρηστών." }, check: (t) => t.flags.has("ps-aux") || usedCmd(t, /ps\s+aux/) },
      { id: "psg", instruction: { en: "ps aux | grep msfconsole", el: "ps aux | grep msfconsole" }, hint: { en: "ps aux | grep msfconsole", el: "ps aux | grep msfconsole" }, explain: { en: "Filter by name.", el: "Φιλτράρισε τη λίστα με βάση το όνομα της διεργασίας." }, check: (t) => t.flags.has("ps-grep") || usedCmd(t, /ps\s+aux\s*\|/) },
      { id: "top", instruction: { en: "top", el: "top" }, hint: { en: "top", el: "top" }, explain: { en: "Greediest first.", el: "Εντόπισε πρώτα τις διεργασίες που χρησιμοποιούν τους περισσότερους πόρους." }, check: (t) => t.flags.has("top") },
      { id: "nice", instruction: { en: "nice -n 10 /usr/bin/ssh-agent", el: "nice -n 10 /usr/bin/ssh-agent" }, hint: { en: "nice -n 10 /usr/bin/ssh-agent", el: "nice -n 10 /usr/bin/ssh-agent" }, explain: { en: "Start with priority.", el: "Εκκίνησε την εντολή με χαμηλότερη προτεραιότητα προγραμματισμού." }, check: (t) => t.flags.has("nice") || usedCmd(t, /^\s*nice\b/) },
      { id: "renice", instruction: { en: "renice 19 6242", el: "renice 19 6242" }, hint: { en: "renice 19 6242", el: "renice 19 6242" }, explain: { en: "Absolute nice value + PID.", el: "Η renice ορίζει τη νέα τιμή nice για τη διεργασία με το συγκεκριμένο PID." }, check: (t) => t.flags.has("renice") || usedCmd(t, /renice/) },
      { id: "k1", instruction: { en: "kill -1 6242", el: "kill -1 6242" }, hint: { en: "kill -1 6242", el: "kill -1 6242" }, explain: { en: "SIGHUP.", el: "SIGHUP." }, check: (t) => t.flags.has("kill-1") || usedCmd(t, /kill\s+-1/) },
      { id: "k9", instruction: { en: "kill -9 4378", el: "kill -9 4378" }, hint: { en: "kill -9 4378", el: "kill -9 4378" }, explain: { en: "SIGKILL.", el: "SIGKILL." }, check: (t) => t.flags.has("kill-9") || usedCmd(t, /kill\s+-9/) },
      { id: "bg", instruction: { en: "nano gamehack.txt &", el: "nano gamehack.txt &" }, hint: { en: "nano gamehack.txt &", el: "nano gamehack.txt &" }, explain: { en: "& backgrounds.", el: "Το & εκτελεί την εντολή στο παρασκήνιο." }, check: (t) => t.flags.has("bg") || usedCmd(t, /&\s*$/) },
      { id: "jobs", instruction: { en: "jobs   then   fg", el: "jobs και fg" }, hint: { en: "jobs", el: "jobs" }, explain: { en: "Job control.", el: "Έλεγχος εργασιών." }, check: (t) => t.flags.has("jobs") || t.flags.has("fg") || usedCmd(t, /^\s*jobs\b/) },
      { id: "at", instruction: { en: "at 9:00pm", el: "at 9:00pm" }, hint: { en: "at 9:00pm", el: "at 9:00pm" }, explain: { en: "One-shot schedule.", el: "Προγραμμάτισε μια εργασία να εκτελεστεί μία φορά." }, check: (t) => t.flags.has("at") },
    ],
    challenges: [
      {
        title: { en: "Confirm msf is a row", el: "Εντόπισε τη διεργασία msfconsole στη λίστα" },
        brief: { en: "ps aux | grep msfconsole should have shown PID 880.", el: "Η εντολή ps aux | grep msfconsole θα πρέπει να εμφανίσει τη διεργασία με PID 880." },
        success: { en: "You can hunt processes by name.", el: "Μπορείς πλέον να εντοπίζεις διεργασίες αναζητώντας το όνομά τους." },
        check: (t) => t.flags.has("ps-grep") || t.flags.has("ps-aux"),
      },
      {
        title: { en: "Schedule the bash stub", el: "Προγραμμάτισε την εικονική εργασία Bash" },
        brief: { en: "You ran at 9:00pm — in a real shell you would then type /root/simple_bash.sh", el: "Έδωσες στην at την ώρα 9:00 μ.μ.· σε πραγματικό shell, στη συνέχεια θα πληκτρολογούσες /root/simple_bash.sh." },
        success: { en: "Daemon scheduling introduced.", el: "Έκανες τα πρώτα σου βήματα στον προγραμματισμό εργασιών με την at." },
        check: (t) => t.flags.has("at"),
      },
    ],
  },
  {
    id: "sr-env",
    order: 10,
    icon: "settings",
    color: "from-zinc-300 to-slate-800",
    difficulty: 2,
    scenario: lab,
    title: { en: "Environment variables", el: "Μεταβλητές περιβάλλοντος" },
    subtitle: { en: "set, HISTSIZE, export, unset", el: "set, HISTSIZE, export, unset" },
    badge: { en: "Env Smith", el: "Σιδεράς env" },
    theory: [
      {
        heading: { en: "env vs shell", el: "Μεταβλητές shell και περιβάλλοντος" },
        body: {
          en: "Variables are key=value strings. Shell variables last for this session; environment variables are inherited. set | more  dumps them (set is bigger than env).",
          el: "Οι μεταβλητές έχουν τη μορφή κλειδί=τιμή. Οι μεταβλητές shell ισχύουν στην τρέχουσα συνεδρία, ενώ οι μεταβλητές περιβάλλοντος κληρονομούνται από τις διεργασίες-παιδιά. Με set | more εμφανίζεις τις μεταβλητές του shell· η set συνήθως εμφανίζει περισσότερες από την env.",
        },
        shots: [shot("set | more", ["HOME=/root", "USER=root", "HISTSIZE=1000", "PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin"])],
      },
      {
        heading: { en: "Filter HISTSIZE", el: "Έλεγξε την τιμή της HISTSIZE" },
        body: {
          en: "set | grep HISTSIZE   — default history size is 1000 commands.",
          el: "Η εντολή set | grep HISTSIZE εμφανίζει την HISTSIZE· η προεπιλεγμένη τιμή εδώ είναι 1000 εντολές.",
        },
        shots: [shot("set | grep HISTSIZE", ["HISTSIZE=1000"])],
      },
      {
        heading: { en: "Temporary change", el: "Προσωρινή αλλαγή της HISTSIZE" },
        body: {
          en: "HISTSIZE=0   (no spaces around =). Up-arrow history goes quiet for this session. A new terminal would restore the default — unless you export.",
          el: "Όρισε HISTSIZE=0 χωρίς κενά γύρω από το =. Το ιστορικό εντολών με το πάνω βέλος δεν θα εμφανίζεται στην τρέχουσα συνεδρία. Σε νέο τερματικό επανέρχεται η προεπιλεγμένη τιμή, εκτός αν εξαγάγεις τη μεταβλητή.",
        },
        shots: [shot("HISTSIZE=0", [""])],
      },
      {
        heading: { en: "Save then export", el: "Αποθήκευσε την τιμή και έπειτα κάνε export" },
        body: {
          en: "Always stash the old value: echo $HISTSIZE > ~/valueofHISTSIZE.txt   then HISTSIZE=0  and  export HISTSIZE  to make it stick for child processes.",
          el: "Πριν αλλάξεις την τιμή, αποθήκευσέ την: echo $HISTSIZE > ~/valueofHISTSIZE.txt. Έπειτα όρισε HISTSIZE=0 και εκτέλεσε export HISTSIZE, ώστε η νέα τιμή να μεταβιβαστεί στις διεργασίες-παιδιά.",
        },
        shots: [
          shot("echo $HISTSIZE > ~/valueofHISTSIZE.txt", [""]),
          shot("export HISTSIZE", [""]),
        ],
      },
      {
        heading: { en: "User-defined + unset", el: "Δημιούργησε και διέγραψε δική σου μεταβλητή" },
        body: {
          en: 'url_variable="gamehack.lab/"   creates a custom variable. echo $url_variable to read it. unset url_variable deletes it — echo then prints nothing.',
          el: "Η εντολή url_variable=\"gamehack.lab/\" δημιουργεί μια δική σου μεταβλητή. Με echo $url_variable εμφανίζεις την τιμή της, ενώ unset url_variable τη διαγράφει· μετά, η echo δεν εμφανίζει τίποτα.",
        },
        shots: [
          shot('url_variable="gamehack.lab/"', [""]),
          shot("unset url_variable", [""]),
        ],
      },
    ],
    cheats: [
      { cmd: "set | more", desc: { en: "dump variables", el: "dump" } },
      { cmd: "set | grep HISTSIZE", desc: { en: "filter", el: "φίλτρο" } },
      { cmd: "HISTSIZE=0", desc: { en: "session value", el: "τιμή συνεδρίας" } },
      { cmd: "echo $HISTSIZE > ~/valueofHISTSIZE.txt", desc: { en: "backup", el: "αντίγραφο" } },
      { cmd: "export HISTSIZE", desc: { en: "export to env", el: "export" } },
      { cmd: "unset NAME", desc: { en: "delete var", el: "διαγραφή" } },
    ],
    tasks: [
      { id: "set", instruction: { en: "set | more   (or just set)", el: "set | more" }, hint: { en: "set | more", el: "set | more" }, explain: { en: "Dump vars.", el: "Εμφάνισε τις μεταβλητές του shell." }, check: (t) => t.flags.has("set") || usedCmd(t, /^\s*set\b/) },
      { id: "greph", instruction: { en: "set | grep HISTSIZE", el: "set | grep HISTSIZE" }, hint: { en: "set | grep HISTSIZE", el: "set | grep HISTSIZE" }, explain: { en: "Should show 1000 first.", el: "Η αρχική τιμή της HISTSIZE είναι 1000." }, check: (t) => t.flags.has("grep-hist") || usedCmd(t, /grep\s+HISTSIZE/) },
      { id: "zero", instruction: { en: "HISTSIZE=0", el: "HISTSIZE=0" }, hint: { en: "HISTSIZE=0", el: "HISTSIZE=0" }, explain: { en: "No spaces.", el: "Μην αφήσεις κενά γύρω από το σύμβολο =." }, check: (t) => t.flags.has("histsize") || usedCmd(t, /HISTSIZE=0/) },
      { id: "save", instruction: { en: "echo $HISTSIZE > ~/valueofHISTSIZE.txt", el: "echo $HISTSIZE > ~/valueofHISTSIZE.txt" }, hint: { en: "echo $HISTSIZE > ~/valueofHISTSIZE.txt", el: "echo $HISTSIZE > ~/valueofHISTSIZE.txt" }, explain: { en: "Backup before you break history.", el: "Αποθήκευσε την αρχική τιμή πριν αλλάξεις το ιστορικό εντολών." }, check: (t) => t.flags.has("hist-save") || usedCmd(t, /valueofHISTSIZE/) },
      { id: "export", instruction: { en: "export HISTSIZE", el: "export HISTSIZE" }, hint: { en: "export HISTSIZE", el: "export HISTSIZE" }, explain: { en: "Inherit in children.", el: "Η τιμή μεταβιβάζεται στις διεργασίες-παιδιά." }, check: (t) => t.flags.has("export") || usedCmd(t, /export\s+HISTSIZE/) },
      { id: "url", instruction: { en: 'url_variable="gamehack.lab/"', el: "url_variable=gamehack.lab/" }, hint: { en: 'url_variable="gamehack.lab/"', el: "url_variable=…" }, explain: { en: "Custom variable.", el: "Δημιούργησε μια δική σου μεταβλητή." }, check: (t) => t.flags.has("url-var") || usedCmd(t, /url_variable=/) },
      { id: "unset", instruction: { en: "unset url_variable", el: "unset url_variable" }, hint: { en: "unset url_variable", el: "unset url_variable" }, explain: { en: "Delete it.", el: "Διαγραφή." }, check: (t) => t.flags.has("unset") || usedCmd(t, /unset\s+url_variable/) },
    ],
    challenges: [
      {
        title: { en: "Read the backup", el: "Διάβασε το backup" },
        brief: { en: "cat ~/valueofHISTSIZE.txt", el: "cat ~/valueofHISTSIZE.txt" },
        success: { en: "You can undo because you saved.", el: "Μπορείς να επαναφέρεις την αρχική τιμή επειδή την αποθήκευσες." },
        check: (t) => t.filesRead.some((p) => p.includes("valueofHISTSIZE")) || t.flags.has("hist-save"),
      },
      {
        title: { en: "echo the custom var before unset", el: "Εμφάνισε την τιμή της μεταβλητής πριν από την unset" },
        brief: { en: "If you already unset, recreate url_variable then echo $url_variable", el: "Αν έχεις ήδη διαγράψει τη μεταβλητή, δημιούργησε ξανά την url_variable και μετά εμφάνισε την τιμή της με echo $url_variable." },
        success: { en: "$ expands variables.", el: "Το σύμβολο $ αντικαθιστά το όνομα της μεταβλητής με την τιμή της." },
        check: (t) => t.flags.has("url-var") || usedCmd(t, /echo\s+\$url/),
      },
    ],
  },
];
