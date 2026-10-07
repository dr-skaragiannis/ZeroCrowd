import type { Bi } from "@/data/lessons";
import type { PublicChallenge } from "@/lib/challenges";
import type { Lang } from "@/lib/language";

type ChallengeTranslation = { title: string; summary: string; description: string; objective: string; hints: string[] };
export type ChallengeLearning = { concept: Bi; investigate: Bi; defend: Bi };

const greek: Record<string, ChallengeTranslation> = {
  "ghost-in-the-headers": {
    title: "Φάντασμα στις κεφαλίδες", summary: "Η απόκριση κρύβει πληροφορίες που δεν εμφανίζει η σελίδα.",
    description: "Το Gamehack έστειλε ένα συνηθισμένο αίτημα στον εκπαιδευτικό διακομιστή και έλαβε μια συνηθισμένη σελίδα — τουλάχιστον έτσι νόμιζε ο προγραμματιστής. Εξέτασε ολόκληρη την αποθηκευμένη απόκριση: ο browser λαμβάνει περισσότερα δεδομένα απ’ όσα εμφανίζει.",
    objective: "Βρες το κρυμμένο flag στις κεφαλίδες της απόκρισης HTTP και υπέβαλέ το.",
    hints: ["Το flag δεν βρίσκεται στο HTML. Έλεγξε τις κεφαλίδες HTTP.", "Η τιμή X-Trace-Token είναι κωδικοποιημένη σε Base64. Αποκωδικοποίησέ την."],
  },
  "cipher-shift": {
    title: "Κρυπτογράφημα του Καίσαρα", summary: "Παλιό κρυπτογράφημα, νέο μήνυμα. Βρες τη μετατόπιση.",
    description: "Ένας αναλυτής εντόπισε ένα μήνυμα κρυπτογραφημένο με μέθοδο που θα γνώριζε ο Ιούλιος Καίσαρας. Τα γράμματα έχουν μετατοπιστεί, αλλά οι αριθμοί και τα σημεία στίξης έμειναν ίδια.",
    objective: "Αποκρυπτογράφησε το μήνυμα και βρες το flag.",
    hints: ["Πρόκειται για κρυπτογράφημα του Καίσαρα. Μετακίνησε τα γράμματα προς τα πίσω στο αλφάβητο.", "Μετακίνησε κάθε γράμμα τρεις θέσεις πίσω. Για παράδειγμα, το J γίνεται G."],
  },
  "the-last-packet": {
    title: "Το τελευταίο πακέτο", summary: "Ένα τελευταίο πακέτο έφυγε από το δίκτυο πριν χαθεί το σήμα.",
    description: "Η ομάδα απόκρισης περιστατικών ανέκτησε ένα μικρό αρχείο καταγραφής δικτυακής κίνησης από έναν παραβιασμένο υπολογιστή. Το τελευταίο εξερχόμενο αίτημα περιέχει ύποπτα δεδομένα σε δεκαεξαδική μορφή.",
    objective: "Ανάκτησε το flag από τα δεδομένα του καταγεγραμμένου πακέτου.",
    hints: ["Εστίασε στο σώμα του εξερχόμενου αιτήματος POST.", "Η κεφαλίδα X-Payload-Format δείχνει ότι τα δεκαεξαδικά bytes πρέπει να μετατραπούν σε κείμενο."],
  },
  "robots-never-forget": {
    title: "Τα robots δεν ξεχνούν", summary: "Το robots.txt μπορεί να κρύψει μια διαδρομή από τις μηχανές αναζήτησης, όχι από τους επισκέπτες.",
    description: "Ένας προγραμματιστής νόμιζε ότι, αποκλείοντας έναν φάκελο από τις μηχανές αναζήτησης, τον κρατούσε κρυφό. Το αποθηκευμένο robots.txt αποδεικνύει το αντίθετο.",
    objective: "Εντόπισε το εκτεθειμένο αρχείο και βρες το flag.",
    hints: ["Η διαδρομή δηλώνεται ως αποκλεισμένη, αλλά παραμένει προσβάσιμη στο αποθηκευμένο αρχείο.", "Αποκωδικοποίησε την τιμή ανάκτησης από Base64."],
  },
  "the-hidden-commit": {
    title: "Το μυστικό στο commit", summary: "Αφαιρέθηκε από το αρχείο, όχι όμως από το ιστορικό του Git.",
    description: "Ένα δημόσιο αποθετήριο περιείχε κατά λάθος ένα ευαίσθητο token. Ο συντηρητής το αφαίρεσε από την τρέχουσα έκδοση, όμως παραμένει στο ιστορικό του Git.",
    objective: "Εξέτασε το diff του commit και ανάκτησε την τιμή που αφαιρέθηκε.",
    hints: ["Οι γραμμές που αρχίζουν με - υπήρχαν πριν από το commit.", "Το αφαιρεμένο RECOVERY_TOKEN είναι κωδικοποιημένο σε Base64."],
  },
  "mirror-protocol": {
    title: "Πρωτόκολλο καθρέφτη", summary: "Η απάντηση είναι μπροστά σου — απλώς εμφανίζεται ανάποδα.",
    description: "Ένα παράξενο πρωτόκολλο αντιστρέφει κάθε μήνυμα, χαρακτήρα προς χαρακτήρα, πριν το στείλει. Τα δεδομένα που καταγράφηκαν είναι πλήρη, αλλά ανάποδα.",
    objective: "Αντίστρεψε το μήνυμα και υπέβαλε το αρχικό flag.",
    hints: ["Η κεφαλίδα περιγράφει τον μετασχηματισμό· δεν πρόκειται για κρυπτογράφηση.", "Διάβασε τα δεδομένα από τον τελευταίο χαρακτήρα προς τον πρώτο."],
  },
  "permission-denied": {
    title: "Άρνηση πρόσβασης", summary: "Η κύρια είσοδος είναι κλειδωμένη — όμως ένα αντίγραφο έμεινε εκτεθειμένο.",
    description: "Ο χρήστης δεν έχει άδεια να διαβάσει το προστατευμένο αρχείο. Ωστόσο, μια κακορυθμισμένη διαδικασία αντιγράφων το αποθηκεύει σε τοποθεσία με πιο χαλαρά δικαιώματα.",
    objective: "Βρες το αντίγραφο του προστατευμένου flag που μπορείς να διαβάσεις.",
    hints: ["Στον φάκελο αντιγράφων υπάρχει ένα κρυφό αρχείο με δικαίωμα ανάγνωσης για όλους.", "Αποκωδικοποίησε το .system-flag.bak από Base64."],
  },
  "subdomain-sweep": {
    title: "Σάρωση υποτομέων", summary: "Η χρήσιμη πληροφορία δεν βρίσκεται στην αρχική σελίδα.",
    description: "Στον εκπαιδευτικό τομέα ήταν ενεργή η μεταφορά ζώνης DNS. Ανάμεσα στις εγγραφές TXT υπάρχει μία που αποκαλύπτει περισσότερα απ’ όσα θα έπρεπε.",
    objective: "Βρες την ύποπτη εγγραφή DNS και αποκωδικοποίησε το flag.",
    hints: ["Αναζήτησε μια εγγραφή TXT· μπορεί να περιέχει αυθαίρετο κείμενο.", "Η εγγραφή _vault περιέχει κείμενο Base64."],
  },
  "debug-me": {
    title: "Βρες το σφάλμα", summary: "Ένας απλός έλεγχος κρύβει ένα μυστικό.",
    description: "Ανακτήθηκε ο ψευδοκώδικας ενός προγράμματος επαλήθευσης. Αντί να μαντεύεις κωδικούς, δες πώς σχηματίζεται η αναμενόμενη είσοδος.",
    objective: "Ανασύνθεσε τον πίνακα χαρακτήρων και βρες το flag που γίνεται δεκτό.",
    hints: ["Οι ακέραιοι είναι δεκαδικές τιμές ASCII.", "Μετέτρεψε κάθε αριθμό στον αντίστοιχο χαρακτήρα, διατηρώντας τη σειρά. Για παράδειγμα: 71 = G, 65 = A."],
  },
  "cold-storage": {
    title: "Ψυχρή αποθήκευση", summary: "Ένα αντίγραφο ασφαλείας άφησε ίχνη στον παραβιασμένο host.",
    description: "Ο εισβολέας διέγραψε το ιστορικό εντολών, αλλά η προγραμματισμένη εργασία έχει ξεχωριστά logs. Ακολούθησε τα ίχνη στην έξοδό της.",
    objective: "Βρες τον δείκτη του αρχείου, αποκωδικοποίησέ τον και υπέβαλε το flag.",
    hints: ["Ο δείκτης εμφανίζεται στα logs της αρχειοθέτησης.", "Μετέτρεψε τη δεκαεξαδική τιμή σε αναγνώσιμο κείμενο."],
  },
  "cookie-crumbs": {
    title: "Ίχνη από cookies", summary: "Η συνεδρία είναι κωδικοποιημένη, όχι κρυπτογραφημένη.",
    description: "Ένα cookie αποσφαλμάτωσης αποθηκεύει κάτι παραπάνω από το αναγνωριστικό συνεδρίας. Εξέτασε το καταγεγραμμένο αίτημα και βρες τι πρόσθεσε εκεί ο προγραμματιστής.",
    objective: "Αποκωδικοποίησε το cookie debug_session και βρες το flag.",
    hints: ["Μόνο το cookie debug_session ξεχωρίζει.", "Αποκωδικοποίησέ το από Base64 και εξέτασε το JSON."],
  },
  "silent-signal": {
    title: "Σιωπηλό σήμα", summary: "Ένα σήμα κινδύνου κρυβόταν σε κοινή θέα.",
    description: "Το σημείωμα του αναλυτή είναι γεμάτο θόρυβο, αλλά η κρίσιμη γραμμή ξεχωρίζει. Αποκωδικοποίησε τη μετάδοση πριν χαθεί το ίχνος.",
    objective: "Ανάκτησε το κρυμμένο μήνυμα και υπέβαλε το flag.",
    hints: ["Αγνόησε τις γραμμές noise· η γραμμή signal αποκαλύπτει την κωδικοποίηση.", "Αποκωδικοποίησε το κείμενο μετά το [signal/base64]."],
  },
};

export const CHALLENGE_LEARNING: Record<string, ChallengeLearning> = {
  "ghost-in-the-headers": { concept: { en: "HTTP headers are metadata sent alongside the body. Applications can accidentally expose secrets in custom response headers.", el: "Οι κεφαλίδες HTTP μεταφέρουν μεταδεδομένα μαζί με το σώμα της απόκρισης. Μια εφαρμογή μπορεί κατά λάθος να αποκαλύψει μυστικά σε προσαρμοσμένες κεφαλίδες." }, investigate: { en: "Separate headers from HTML, locate unusual X- fields, then identify whether a value is encoded rather than encrypted.", el: "Χώρισε τις κεφαλίδες από το HTML, έλεγξε τα ασυνήθιστα πεδία X- και δες αν κάποια τιμή είναι κωδικοποιημένη αντί κρυπτογραφημένη." }, defend: { en: "Remove debug headers before deployment. Treat Base64 as representation, never as protection.", el: "Αφαίρεσε τις κεφαλίδες αποσφαλμάτωσης πριν από τη δημοσίευση. Το Base64 αλλάζει τη μορφή των δεδομένων· δεν τα προστατεύει." } },
  "cipher-shift": { concept: { en: "A Caesar cipher substitutes each letter by moving a fixed number of positions through the alphabet.", el: "Το κρυπτογράφημα του Καίσαρα αντικαθιστά κάθε γράμμα με ένα άλλο, μετακινώντας το κατά σταθερό αριθμό θέσεων στο αλφάβητο." }, investigate: { en: "Identify the shift, reverse it for letters, and leave braces and punctuation unchanged.", el: "Βρες τη μετατόπιση και αντιστρέψέ την στα γράμματα. Άφησε άθικτα τα άγκιστρα και τα σημεία στίξης." }, defend: { en: "Classical substitution is not secure encryption; use modern authenticated cryptography for sensitive data.", el: "Η απλή αντικατάσταση γραμμάτων δεν προσφέρει ασφάλεια. Για ευαίσθητα δεδομένα χρησιμοποίησε σύγχρονη κρυπτογράφηση με πιστοποίηση αυθεντικότητας." } },
  "the-last-packet": { concept: { en: "Network captures preserve protocol metadata and sometimes the payload of an outbound request.", el: "Οι καταγραφές δικτύου διατηρούν μεταδεδομένα πρωτοκόλλου και, μερικές φορές, το payload ενός εξερχόμενου αιτήματος." }, investigate: { en: "Follow the outbound request, inspect Content-Type and X-Payload-Format, then decode the body as bytes.", el: "Ακολούθησε το εξερχόμενο αίτημα, έλεγξε τα Content-Type και X-Payload-Format και αποκωδικοποίησε τα bytes του σώματος." }, defend: { en: "Monitor unusual outbound POSTs and retain evidence with a chain of custody before drawing conclusions.", el: "Παρακολούθησε ασυνήθιστα εξερχόμενα αιτήματα POST και διατήρησε την αλυσίδα φύλαξης των τεκμηρίων πριν βγάλεις συμπεράσματα." } },
  "robots-never-forget": { concept: { en: "robots.txt controls crawler behavior, not authorization. Disallowed paths are public instructions.", el: "Το robots.txt δίνει οδηγίες στις μηχανές αναζήτησης· δεν επιβάλλει έλεγχο πρόσβασης. Οι διαδρομές που αποκλείει παραμένουν δημόσιες." }, investigate: { en: "Read the disallowed path, inspect the saved archive response, then decode the note.", el: "Διάβασε τη διαδρομή που αποκλείεται, εξέτασε την αποθηκευμένη απόκριση και αποκωδικοποίησε το σημείωμα." }, defend: { en: "Protect sensitive endpoints with authorization, not crawler directives or obscurity.", el: "Προστάτευσε τα ευαίσθητα σημεία με έλεγχο πρόσβασης — όχι με οδηγίες προς τις μηχανές αναζήτησης ή με απλή απόκρυψη." } },
  "the-hidden-commit": { concept: { en: "Version control history retains removed lines. Deleting a secret from the latest file does not revoke it.", el: "Το ιστορικό του Git διατηρεί ακόμη και γραμμές που έχουν αφαιρεθεί. Αν διαγράψεις ένα μυστικό από την τελευταία έκδοση, δεν παύει να είναι εκτεθειμένο." }, investigate: { en: "Read the diff prefixes, identify the removed configuration value, and decode its format.", el: "Διάβασε τα πρόσημα στο diff, εντόπισε την τιμή που αφαιρέθηκε και αποκωδικοποίησέ την." }, defend: { en: "Rotate exposed credentials, scan repository history, and use a secret manager instead of committing keys.", el: "Ανάκλησε και αντικατάστησε τα εκτεθειμένα διαπιστευτήρια, έλεγξε όλο το ιστορικό και φύλαγε τα μυστικά σε ειδικό διαχειριστή." } },
  "mirror-protocol": { concept: { en: "Reversing a string is an encoding transformation, not cryptography. The protocol itself reveals the operation.", el: "Η αντιστροφή μιας συμβολοσειράς είναι μετασχηματισμός, όχι κρυπτογράφηση. Το ίδιο το πρωτόκολλο αποκαλύπτει τι έχει γίνει." }, investigate: { en: "Read the transform header first; reverse every payload character, including braces and underscores.", el: "Διάβασε πρώτα την κεφαλίδα που περιγράφει τον μετασχηματισμό. Αντίστρεψε όλους τους χαρακτήρες, μαζί με τα άγκιστρα και τις κάτω παύλες." }, defend: { en: "Document data transformations clearly and never confuse obscurity with confidentiality.", el: "Τεκμηρίωνε κάθε μετασχηματισμό δεδομένων. Η απόκρυψη δεν ισοδυναμεί με εμπιστευτικότητα." } },
  "permission-denied": { concept: { en: "The security of a protected file is lost if a copy is written with weaker permissions.", el: "Ένα προστατευμένο αρχείο παύει να είναι ασφαλές αν το αντίγραφό του αποθηκευτεί με πιο χαλαρά δικαιώματα." }, investigate: { en: "Compare file modes, inspect hidden backups, and decode the readable copy without accessing the protected path.", el: "Σύγκρινε τα δικαιώματα πρόσβασης, έλεγξε τα κρυφά αντίγραφα και αποκωδικοποίησε εκείνο που μπορείς να διαβάσεις — χωρίς να παρακάμψεις την προστασία του αρχικού αρχείου." }, defend: { en: "Audit backup permissions, use least privilege, and exclude sensitive files from public paths.", el: "Έλεγχε τα δικαιώματα των αντιγράφων ασφαλείας, δώσε μόνο τα απολύτως απαραίτητα προνόμια και μην αποθηκεύεις ευαίσθητα αρχεία σε δημόσιες διαδρομές." } },
  "subdomain-sweep": { concept: { en: "An open DNS zone transfer can expose the complete hostname and TXT record inventory.", el: "Μια μη εξουσιοδοτημένη μεταφορά ζώνης DNS μπορεί να αποκαλύψει ονόματα υπολογιστών και εγγραφές TXT." }, investigate: { en: "Inspect the AXFR output, locate nonstandard TXT records, and decode the suspicious value.", el: "Έλεγξε την έξοδο AXFR, εντόπισε ασυνήθιστες εγγραφές TXT και αποκωδικοποίησε την ύποπτη τιμή." }, defend: { en: "Restrict zone transfers to authorized secondaries and do not place credentials in DNS records.", el: "Επίτρεψε τη μεταφορά ζώνης μόνο σε εξουσιοδοτημένους δευτερεύοντες διακομιστές DNS και μην αποθηκεύεις διαπιστευτήρια σε εγγραφές DNS." } },
  "debug-me": { concept: { en: "Static analysis studies a program without running it. Character codes in pseudocode reveal expected input.", el: "Με τη στατική ανάλυση εξετάζεις ένα πρόγραμμα χωρίς να το εκτελέσεις. Οι κωδικοί χαρακτήρων στον ψευδοκώδικα αποκαλύπτουν την αναμενόμενη είσοδο." }, investigate: { en: "Translate each decimal ASCII integer into a character, preserving order and the null-terminator check.", el: "Μετέτρεψε κάθε δεκαδική τιμή ASCII στον αντίστοιχο χαρακτήρα, με τη σωστή σειρά. Πρόσεξε και τον έλεγχο τερματισμού." }, defend: { en: "Never hardcode secrets in binaries: strings, constants, and verification logic are recoverable.", el: "Μην ενσωματώνεις μυστικά σε εκτελέσιμα αρχεία: συμβολοσειρές, σταθερές και κώδικας ελέγχου μπορούν να ανακτηθούν." } },
  "cold-storage": { concept: { en: "Clearing shell history does not erase job logs. Independent evidence sources can reconstruct events.", el: "Η διαγραφή του ιστορικού εντολών δεν σβήνει τα logs των προγραμματισμένων εργασιών. Άλλες πηγές στοιχείων μπορούν να σε βοηθήσουν να ανασυνθέσεις τι συνέβη." }, investigate: { en: "Build a timeline from cron and archive entries; identify the marker and convert its hexadecimal bytes.", el: "Συνδύασε τα στοιχεία από το cron και τα logs σε χρονολόγιο. Έπειτα, βρες τον δείκτη και μετέτρεψε τα δεκαεξαδικά bytes." }, defend: { en: "Centralize logs, enforce retention, and correlate scheduler activity with archived artifacts.", el: "Συγκέντρωνε και διατήρησε τα logs, και συσχέτιζε τις προγραμματισμένες εργασίες με τα αντίστοιχα αρχεία." } },
  "cookie-crumbs": { concept: { en: "Browser cookies are visible to the browser and are not secret storage. Base64 does not make their contents private.", el: "Τα cookies είναι προσβάσιμα από τον browser και δεν είναι κατάλληλα για την αποθήκευση μυστικών. Το Base64 δεν κρύβει τα δεδομένα." }, investigate: { en: "Isolate the unusual cookie, decode the Base64, and parse the resulting JSON without changing the request.", el: "Εντόπισε το ασυνήθιστο cookie, αποκωδικοποίησε το Base64 και εξέτασε το JSON χωρίς να τροποποιήσεις το αίτημα." }, defend: { en: "Keep sensitive data server-side, set appropriate cookie attributes, and minimize client-stored state.", el: "Φύλαγε τα ευαίσθητα δεδομένα στον διακομιστή, όρισε σωστά τα χαρακτηριστικά των cookies και μην αποθηκεύεις περισσότερα απ’ όσα χρειάζεται ο browser." } },
  "silent-signal": { concept: { en: "Incident artifacts often mix signal and noise; metadata can tell you which line deserves attention.", el: "Τα τεκμήρια ενός περιστατικού μπορεί να περιέχουν πολύ θόρυβο. Τα μεταδεδομένα σε βοηθούν να ξεχωρίσεις τι χρειάζεται διερεύνηση." }, investigate: { en: "Follow the labeled signal, identify its encoding, then decode only the payload rather than random noise.", el: "Ακολούθησε τη γραμμή με την ένδειξη signal, εντόπισε την κωδικοποίηση και αποκωδικοποίησε μόνο τα σχετικά δεδομένα." }, defend: { en: "Preserve the original artifact, record your extraction method, and validate the decoded result independently.", el: "Κράτησε ανέπαφο το αρχικό τεκμήριο, σημείωσε πώς εξήγαγες τα δεδομένα και επαλήθευσε το αποτέλεσμα με ανεξάρτητο τρόπο." } },
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
