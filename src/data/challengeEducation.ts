import type { Bi } from "@/data/lessons";
import type { PublicChallenge } from "@/lib/challenges";
import type { Lang } from "@/lib/language";

type ChallengeTranslation = { title: string; summary: string; description: string; objective: string; hints: string[] };
export type ChallengeLearning = { concept: Bi; investigate: Bi; defend: Bi };

const greek: Record<string, ChallengeTranslation> = {
  "ghost-in-the-headers": {
    title: "Το φάντασμα στις κεφαλίδες", summary: "Μια απόκριση κρύβει περισσότερα από όσα δείχνει η σελίδα.",
    description: "Ένα συνηθισμένο αίτημα στον εκπαιδευτικό διακομιστή του Gamehack επέστρεψε μια συνηθισμένη σελίδα. Τουλάχιστον έτσι νόμιζε ο προγραμματιστής. Εξέτασε ολόκληρη την αποθηκευμένη απόκριση: ο φυλλομετρητής δεν εμφανίζει όλα τα δεδομένα που λαμβάνει.",
    objective: "Βρες την κρυμμένη σημαία στην απόκριση HTTP και υπόβαλέ την.",
    hints: ["Η απάντηση δεν βρίσκεται στο HTML. Κοίτα τις κεφαλίδες της απόκρισης.", "Η τιμή X-Trace-Token είναι κωδικοποιημένη σε Base64. Αποκωδικοποίησέ την."],
  },
  "cipher-shift": {
    title: "Μετατόπιση κρυπτογράφησης", summary: "Ένα παλιό τέχνασμα, ένα νέο μήνυμα. Σκέψου με μετατόπιση.",
    description: "Ένας αναλυτής βρήκε ένα μήνυμα κρυπτογραφημένο με μέθοδο που θα αναγνώριζε ο Ιούλιος Καίσαρας. Τα γράμματα μετατοπίστηκαν, ενώ αριθμοί και σημεία στίξης έμειναν ίδια.",
    objective: "Αποκρυπτογράφησε το μήνυμα και εντόπισε τη σημαία.",
    hints: ["Είναι κρυπτογράφηση Καίσαρα. Μετακίνησε τα γράμματα προς τα πίσω στο αλφάβητο.", "Μετακίνησε κάθε γράμμα τρεις θέσεις πίσω. Το κρυπτογραφημένο J αντιστοιχεί στο G."],
  },
  "the-last-packet": {
    title: "Το τελευταίο πακέτο", summary: "Ένα τελευταίο πακέτο έφυγε από το δίκτυο πριν χαθεί το σήμα.",
    description: "Η ομάδα απόκρισης περιστατικών ανέκτησε μια μικρή καταγραφή κυκλοφορίας από έναν παραβιασμένο σταθμό. Το τελευταίο εξερχόμενο αίτημα περιέχει ένα ύποπτο φορτίο σε δεκαεξαδική μορφή.",
    objective: "Ανάκτησε τη σημαία από το φορτίο του καταγεγραμμένου πακέτου.",
    hints: ["Εστίασε στο σώμα του εξερχόμενου αιτήματος POST.", "Η κεφαλίδα X-Payload-Format υποδεικνύει μετατροπή από δεκαεξαδικά bytes σε κείμενο."],
  },
  "robots-never-forget": {
    title: "Τα robots δεν ξεχνούν", summary: "Μια διαδρομή αποκλεισμένη από μηχανές αναζήτησης δεν είναι προστατευμένη.",
    description: "Ένας προγραμματιστής πίστεψε πως ο αποκλεισμός ενός φακέλου από τις μηχανές αναζήτησης αρκεί για να τον κρύψει. Το αρχειοθετημένο robots.txt αποδεικνύει το αντίθετο.",
    objective: "Εντόπισε το εκτεθειμένο αρχείο και βρες τη σημαία.",
    hints: ["Η αποκλεισμένη διαδρομή ήταν ακόμα προσβάσιμη στο αρχείο καταγραφής.", "Αποκωδικοποίησε τον κωδικό ανάκτησης από Base64."],
  },
  "the-hidden-commit": {
    title: "Το κρυμμένο commit", summary: "Διαγράφηκε από το αρχείο, όχι όμως από την ιστορία.",
    description: "Ένα δημόσιο αποθετήριο περιείχε κατά λάθος ένα ευαίσθητο token. Ο συντηρητής το αφαίρεσε από την τρέχουσα έκδοση, αλλά το ιστορικό Git θυμάται.",
    objective: "Εξέτασε τις αλλαγές του commit και ανάκτησε την τιμή που αφαιρέθηκε.",
    hints: ["Οι γραμμές με πρόθεμα μείον υπήρχαν πριν από το commit.", "Το αφαιρεμένο RECOVERY_TOKEN είναι κωδικοποιημένο σε Base64."],
  },
  "mirror-protocol": {
    title: "Πρωτόκολλο καθρέφτη", summary: "Η απάντηση βρίσκεται μπροστά σου, αλλά κοιτάζει ανάποδα.",
    description: "Ένα παράξενο πρωτόκολλο αντιστρέφει κάθε μήνυμα χαρακτήρα προς χαρακτήρα πριν τη μετάδοση. Το υποκλαπέν φορτίο είναι πλήρες, αλλά ανάποδο.",
    objective: "Αντίστρεψε το μήνυμα και υπόβαλε την αρχική σημαία.",
    hints: ["Η μετατροπή περιγράφεται στην κεφαλίδα· δεν πρόκειται για κρυπτογράφηση.", "Διάβασε το payload από τον τελευταίο χαρακτήρα προς τον πρώτο."],
  },
  "permission-denied": {
    title: "Άρνηση πρόσβασης", summary: "Η προφανής πόρτα είναι κλειδωμένη. Μια άλλη έμεινε ανοιχτή.",
    description: "Ένας χειριστής δεν μπορεί να διαβάσει απευθείας ένα προστατευμένο αρχείο, όμως μια λανθασμένα ρυθμισμένη διαδικασία αντιγράφων το μεταφέρει σε λιγότερο προστατευμένη τοποθεσία.",
    objective: "Βρες το αναγνώσιμο αντίγραφο της προστατευμένης σημαίας.",
    hints: ["Ο φάκελος αντιγράφων έχει ένα κρυφό αρχείο που διαβάζεται από όλους.", "Αποκωδικοποίησε το .system-flag.bak από Base64."],
  },
  "subdomain-sweep": {
    title: "Σάρωση υποτομέων", summary: "Ο ενδιαφέρων host δεν βρίσκεται στην αρχική σελίδα.",
    description: "Η μεταφορά ζώνης DNS ήταν ενεργή στον εκπαιδευτικό τομέα. Ανάμεσα στις εγγραφές υπάρχει μία τιμή TXT που αποκαλύπτει περισσότερα από όσα ήθελε ο κάτοχος.",
    objective: "Εντόπισε την ύποπτη εγγραφή DNS και αποκωδικοποίησε τη σημαία.",
    hints: ["Αναζήτησε μια εγγραφή TXT· μπορεί να περιέχει αυθαίρετο κείμενο.", "Η εγγραφή _vault περιέχει κείμενο Base64."],
  },
  "debug-me": {
    title: "Βρες το σφάλμα", summary: "Ένας μικρός έλεγχος κρύβει ένα όχι και τόσο μυστικό μυστικό.",
    description: "Ανακτήθηκε ο ψευδοκώδικας ενός προγράμματος ελέγχου. Αντί να μαντεύεις κωδικούς, κατανόησε πώς κατασκευάζεται η αναμενόμενη είσοδος.",
    objective: "Ανακατασκεύασε τον πίνακα χαρακτήρων και βρες την αποδεκτή σημαία.",
    hints: ["Οι ακέραιοι είναι δεκαδικοί κωδικοί ASCII.", "Μετάτρεψε κάθε αριθμό σε χαρακτήρα με τη σωστή σειρά. 71 = G, 65 = A."],
  },
  "cold-storage": {
    title: "Ψυχρή αποθήκευση", summary: "Ένα αντίγραφο άφησε ίχνη σε παραβιασμένο host.",
    description: "Ο επιτιθέμενος καθάρισε το ιστορικό εντολών, αλλά ξέχασε πως η προγραμματισμένη εργασία έχει δική της καταγραφή. Ακολούθησε την έξοδο της εργασίας.",
    objective: "Εντόπισε τον δείκτη του αρχείου, αποκωδικοποίησέ τον και υπόβαλε τη σημαία.",
    hints: ["Ο δείκτης καταγράφεται από τη διαδικασία αρχειοθέτησης.", "Μετάτρεψε τη δεκαεξαδική τιμή σε αναγνώσιμο κείμενο."],
  },
  "cookie-crumbs": {
    title: "Ψίχουλα cookies", summary: "Η συνεδρία είναι κωδικοποιημένη, όχι κρυπτογραφημένη.",
    description: "Ένα cookie αποσφαλμάτωσης αποθηκεύει περισσότερα από ένα αναγνωριστικό συνεδρίας. Εξέτασε το καταγεγραμμένο αίτημα και βρες τι τοποθέτησε εκεί ο προγραμματιστής.",
    objective: "Αποκωδικοποίησε το debug cookie και βρες τη σημαία.",
    hints: ["Μόνο το cookie debug_session μοιάζει ασυνήθιστο.", "Αποκωδικοποίησέ το από Base64 και εξέτασε το JSON."],
  },
  "silent-signal": {
    title: "Σιωπηλό σήμα", summary: "Ένα σήμα κινδύνου κρυβόταν σε κοινή θέα.",
    description: "Το σημείωμα του χειριστή είχε πολύ θόρυβο, αλλά η σημαντική γραμμή έχει σαφή σήμανση. Αποκωδικοποίησε τη μετάδοση πριν χαθεί το σήμα.",
    objective: "Ανάκτησε το κωδικοποιημένο σήμα και υπόβαλε τη σημαία.",
    hints: ["Αγνόησε τις γραμμές με την ένδειξη noise. Η γραμμή signal δηλώνει την κωδικοποίηση.", "Αποκωδικοποίησε το κείμενο μετά το [signal/base64]."],
  },
};

export const CHALLENGE_LEARNING: Record<string, ChallengeLearning> = {
  "ghost-in-the-headers": { concept: { en: "HTTP headers are metadata sent alongside the body. Applications can accidentally expose secrets in custom response headers.", el: "Οι κεφαλίδες HTTP είναι μεταδεδομένα που συνοδεύουν το σώμα. Μια εφαρμογή μπορεί να διαρρεύσει μυστικά μέσω προσαρμοσμένων κεφαλίδων." }, investigate: { en: "Separate headers from HTML, locate unusual X- fields, then identify whether a value is encoded rather than encrypted.", el: "Ξεχώρισε κεφαλίδες και HTML, βρες ασυνήθιστα πεδία X- και αναγνώρισε αν μια τιμή είναι κωδικοποιημένη, όχι κρυπτογραφημένη." }, defend: { en: "Remove debug headers before deployment. Treat Base64 as representation, never as protection.", el: "Αφαίρεσε τις κεφαλίδες αποσφαλμάτωσης πριν την παραγωγή. Το Base64 είναι αναπαράσταση, όχι προστασία." } },
  "cipher-shift": { concept: { en: "A Caesar cipher substitutes each letter by moving a fixed number of positions through the alphabet.", el: "Η κρυπτογράφηση Καίσαρα αντικαθιστά κάθε γράμμα με ένα άλλο, μετακινώντας το κατά σταθερό αριθμό θέσεων." }, investigate: { en: "Identify the shift, reverse it for letters, and leave braces and punctuation unchanged.", el: "Εντόπισε τη μετατόπιση, αντέστρεψέ την για τα γράμματα και άφησε αγκύλες και σημεία στίξης ανέπαφα." }, defend: { en: "Classical substitution is not secure encryption; use modern authenticated cryptography for sensitive data.", el: "Η κλασική αντικατάσταση δεν είναι ασφαλής κρυπτογράφηση. Χρησιμοποίησε σύγχρονους επαληθευμένους αλγορίθμους." } },
  "the-last-packet": { concept: { en: "Network captures preserve protocol metadata and sometimes the payload of an outbound request.", el: "Οι καταγραφές δικτύου διατηρούν μεταδεδομένα πρωτοκόλλων και, κάποιες φορές, το περιεχόμενο εξερχόμενων αιτημάτων." }, investigate: { en: "Follow the outbound request, inspect Content-Type and X-Payload-Format, then decode the body as bytes.", el: "Ακολούθησε το εξερχόμενο αίτημα, εξέτασε Content-Type και X-Payload-Format και μετέτρεψε το σώμα από bytes." }, defend: { en: "Monitor unusual outbound POSTs and retain evidence with a chain of custody before drawing conclusions.", el: "Παρακολούθησε ασυνήθιστα εξερχόμενα POST και διατήρησε αλυσίδα φύλαξης τεκμηρίων πριν εξάγεις συμπεράσματα." } },
  "robots-never-forget": { concept: { en: "robots.txt controls crawler behavior, not authorization. Disallowed paths are public instructions.", el: "Το robots.txt καθοδηγεί τα προγράμματα ανίχνευσης· δεν παρέχει έλεγχο πρόσβασης. Οι αποκλεισμένες διαδρομές είναι δημόσιες." }, investigate: { en: "Read the disallowed path, inspect the saved archive response, then decode the note.", el: "Διάβασε την αποκλεισμένη διαδρομή, εξέτασε την αποθηκευμένη απόκριση και αποκωδικοποίησε το σημείωμα." }, defend: { en: "Protect sensitive endpoints with authorization, not crawler directives or obscurity.", el: "Προστάτευσε ευαίσθητες διαδρομές με εξουσιοδότηση, όχι με οδηγίες προς crawlers ή απόκρυψη." } },
  "the-hidden-commit": { concept: { en: "Version control history retains removed lines. Deleting a secret from the latest file does not revoke it.", el: "Το ιστορικό εκδόσεων διατηρεί γραμμές που αφαιρέθηκαν. Η διαγραφή ενός μυστικού από το τελευταίο αρχείο δεν το ακυρώνει." }, investigate: { en: "Read the diff prefixes, identify the removed configuration value, and decode its format.", el: "Διάβασε τα πρόσημα του diff, βρες τη ρύθμιση που αφαιρέθηκε και αποκωδικοποίησε τη μορφή της." }, defend: { en: "Rotate exposed credentials, scan repository history, and use a secret manager instead of committing keys.", el: "Ανανέωσε τα εκτεθειμένα διαπιστευτήρια, έλεγξε το ιστορικό και χρησιμοποίησε διαχειριστή μυστικών." } },
  "mirror-protocol": { concept: { en: "Reversing a string is an encoding transformation, not cryptography. The protocol itself reveals the operation.", el: "Η αντιστροφή ενός string είναι μετασχηματισμός, όχι κρυπτογράφηση. Το πρωτόκολλο περιγράφει την πράξη." }, investigate: { en: "Read the transform header first; reverse every payload character, including braces and underscores.", el: "Διάβασε πρώτα την κεφαλίδα μετασχηματισμού. Αντίστρεψε κάθε χαρακτήρα, μαζί με τις αγκύλες και τις κάτω παύλες." }, defend: { en: "Document data transformations clearly and never confuse obscurity with confidentiality.", el: "Τεκμηρίωσε τους μετασχηματισμούς δεδομένων και μη συγχέεις την απόκρυψη με την εμπιστευτικότητα." } },
  "permission-denied": { concept: { en: "The security of a protected file is lost if a copy is written with weaker permissions.", el: "Η προστασία ενός αρχείου χάνεται όταν ένα αντίγραφό του αποθηκεύεται με ασθενέστερα δικαιώματα." }, investigate: { en: "Compare file modes, inspect hidden backups, and decode the readable copy without accessing the protected path.", el: "Σύγκρινε δικαιώματα, εξέτασε κρυφά αντίγραφα και αποκωδικοποίησε το αναγνώσιμο αρχείο χωρίς πρόσβαση στην προστατευμένη διαδρομή." }, defend: { en: "Audit backup permissions, use least privilege, and exclude sensitive files from public paths.", el: "Έλεγξε τα δικαιώματα αντιγράφων, εφάρμοσε ελάχιστα προνόμια και μη βάζεις ευαίσθητα αρχεία σε δημόσιες διαδρομές." } },
  "subdomain-sweep": { concept: { en: "An open DNS zone transfer can expose the complete hostname and TXT record inventory.", el: "Μια ανοικτή μεταφορά ζώνης DNS μπορεί να αποκαλύψει όλους τους hosts και τις εγγραφές TXT." }, investigate: { en: "Inspect the AXFR output, locate nonstandard TXT records, and decode the suspicious value.", el: "Εξέτασε την έξοδο AXFR, εντόπισε ασυνήθιστες εγγραφές TXT και αποκωδικοποίησε την ύποπτη τιμή." }, defend: { en: "Restrict zone transfers to authorized secondaries and do not place credentials in DNS records.", el: "Περιόρισε τις μεταφορές ζώνης στους εξουσιοδοτημένους διακομιστές και μην αποθηκεύεις διαπιστευτήρια σε DNS." } },
  "debug-me": { concept: { en: "Static analysis studies a program without running it. Character codes in pseudocode reveal expected input.", el: "Η στατική ανάλυση εξετάζει πρόγραμμα χωρίς εκτέλεση. Οι κωδικοί χαρακτήρων στον ψευδοκώδικα αποκαλύπτουν την αναμενόμενη είσοδο." }, investigate: { en: "Translate each decimal ASCII integer into a character, preserving order and the null-terminator check.", el: "Μετέτρεψε κάθε δεκαδικό αριθμό ASCII σε χαρακτήρα, διατηρώντας τη σειρά και ελέγχοντας τον τερματισμό." }, defend: { en: "Never hardcode secrets in binaries: strings, constants, and verification logic are recoverable.", el: "Μην ενσωματώνεις μυστικά σε εκτελέσιμα: strings, σταθερές και λογική ελέγχου μπορούν να ανακτηθούν." } },
  "cold-storage": { concept: { en: "Clearing shell history does not erase job logs. Independent evidence sources can reconstruct events.", el: "Η διαγραφή ιστορικού εντολών δεν σβήνει τα αρχεία καταγραφής εργασιών. Ανεξάρτητες πηγές μπορούν να ανασυνθέσουν γεγονότα." }, investigate: { en: "Build a timeline from cron and archive entries; identify the marker and convert its hexadecimal bytes.", el: "Δημιούργησε χρονολόγιο από cron και αρχεία καταγραφής, βρες τον δείκτη και μετάτρεψε τα δεκαεξαδικά bytes." }, defend: { en: "Centralize logs, enforce retention, and correlate scheduler activity with archived artifacts.", el: "Συγκέντρωσε και διατήρησε logs και συσχέτισε προγραμματισμένες εργασίες με τα αντίγραφα." } },
  "cookie-crumbs": { concept: { en: "Browser cookies are visible to the browser and are not secret storage. Base64 does not make their contents private.", el: "Τα cookies είναι ορατά στον φυλλομετρητή και δεν αποτελούν ασφαλή αποθήκη μυστικών. Το Base64 δεν προσφέρει απόρρητο." }, investigate: { en: "Isolate the unusual cookie, decode the Base64, and parse the resulting JSON without changing the request.", el: "Απομόνωσε το ασυνήθιστο cookie, αποκωδικοποίησε το Base64 και διάβασε το JSON χωρίς να αλλάξεις το αίτημα." }, defend: { en: "Keep sensitive data server-side, set appropriate cookie attributes, and minimize client-stored state.", el: "Κράτησε ευαίσθητα δεδομένα στον διακομιστή, όρισε σωστά χαρακτηριστικά cookie και περιόρισε τα δεδομένα στον πελάτη." } },
  "silent-signal": { concept: { en: "Incident artifacts often mix signal and noise; metadata can tell you which line deserves attention.", el: "Τα τεκμήρια περιστατικών συχνά αναμειγνύουν σήμα και θόρυβο· τα μεταδεδομένα δείχνουν τι αξίζει έλεγχο." }, investigate: { en: "Follow the labeled signal, identify its encoding, then decode only the payload rather than random noise.", el: "Ακολούθησε τη γραμμή με σήμανση signal, εντόπισε την κωδικοποίηση και αποκωδικοποίησε μόνο το payload." }, defend: { en: "Preserve the original artifact, record your extraction method, and validate the decoded result independently.", el: "Διατήρησε το αρχικό τεκμήριο, κατέγραψε τη μέθοδο εξαγωγής και επαλήθευσε ανεξάρτητα το αποτέλεσμα." } },
};

export function challengeCopy(challenge: PublicChallenge, lang: Lang) {
  const translated = lang === "el" ? greek[challenge.id] : undefined;
  return {
    title: translated?.title ?? challenge.title,
    summary: translated?.summary ?? challenge.summary,
    description: translated?.description ?? challenge.description,
    objective: translated?.objective ?? challenge.objective,
    hints: translated?.hints ?? challenge.hints,
  };
}
