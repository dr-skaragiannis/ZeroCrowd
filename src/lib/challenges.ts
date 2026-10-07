export type ChallengeCategory = "Web Exploitation" | "Cryptography" | "Digital Forensics" | "OSINT" | "Reverse Engineering" | "Linux" | "Network Security";
export type ChallengeDifficulty = "Beginner" | "Easy" | "Medium" | "Hard";
export type ChallengeTone = "lime" | "violet" | "cyan" | "orange" | "pink";

export type PublicChallenge = {
  id: string;
  title: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  points: number;
  solves: number;
  time: string;
  tone: ChallengeTone;
  summary: string;
  description: string;
  objective: string;
  tags: string[];
  artifactName: string;
  artifact: string;
  hints: string[];
};

type ChallengeDefinition = PublicChallenge & { flag: string };
const b64 = (text: string) => Buffer.from(text, "utf8").toString("base64");
const hex = (text: string) => Buffer.from(text, "utf8").toString("hex");
const rot = (text: string, shift: number) => text.replace(/[a-z]/gi, (char) => {
  const base = char >= "a" ? 97 : 65;
  return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
});

export const CHALLENGES: ChallengeDefinition[] = [
  {
    id: "ghost-in-the-headers", title: "Ghost in the Headers", category: "Web Exploitation", difficulty: "Easy", points: 100, solves: 1842, time: "10 min", tone: "lime",
    summary: "A response is hiding more than its body lets on.",
    description: "An ordinary request to the Gamehack training server returned an ordinary page. Or so the developer thought. Inspect the captured response carefully; the browser doesn't display everything it receives.",
    objective: "Find the hidden flag in the HTTP response and submit it below.",
    tags: ["HTTP", "Headers", "Encoding"], artifactName: "captured-response.http",
    artifact: `HTTP/1.1 200 OK\nContent-Type: text/html; charset=UTF-8\nServer: gamehack-training/2.1\nCache-Control: no-store\nX-Trace-Token: ${b64("GAMEHACK{headers_dont_lie}")}\nX-Request-ID: 4c2a-91ef\n\n<!doctype html>\n<html><body><h1>Nothing to see here.</h1></body></html>`,
    hints: ["The answer isn't in the HTML body. Look at the response metadata.", "The X-Trace-Token value is Base64 encoded. Decode it."], flag: "GAMEHACK{headers_dont_lie}",
  },
  {
    id: "cipher-shift", title: "Cipher Shift", category: "Cryptography", difficulty: "Beginner", points: 75, solves: 2316, time: "5 min", tone: "violet",
    summary: "An old trick, a new message. Rotate your thinking.",
    description: "A field operative left an intercepted note using a cipher that Julius Caesar would recognize. The alphabet has been shifted, but numbers and punctuation remain untouched.",
    objective: "Decrypt the intercepted message and recover the flag.",
    tags: ["Caesar Cipher", "Classical Crypto"], artifactName: "intercept.txt",
    artifact: `INTERCEPTED TRANSMISSION // CHANNEL 03\n-----------------------------------\n${rot("GAMEHACK{shift_happens}", 3)}\n-----------------------------------\nAnalyst note: all letters moved forward exactly three positions.`,
    hints: ["This is a Caesar cipher. Shift letters backward through the alphabet.", "Rotate each letter back by 3. G becomes D in the encoded text (and J becomes G)."], flag: "GAMEHACK{shift_happens}",
  },
  {
    id: "the-last-packet", title: "The Last Packet", category: "Digital Forensics", difficulty: "Easy", points: 125, solves: 1294, time: "15 min", tone: "cyan",
    summary: "One final packet left the network before it went dark.",
    description: "Incident response recovered a short packet capture from a compromised workstation. The last outbound request contains a suspicious hex-encoded payload. Decode the evidence, don't just trust the endpoint.",
    objective: "Extract the exfiltrated flag from the captured packet payload.",
    tags: ["Packet Analysis", "Hex", "Incident Response"], artifactName: "capture.log",
    artifact: `# PCAP export / 2026-04-09 22:41:07 UTC\n01  10.0.4.12 -> 10.0.4.1     DNS   A update.gamehack.local\n02  10.0.4.12 -> 172.16.9.2   TCP   SYN 443\n03  172.16.9.2 -> 10.0.4.12   TCP   SYN, ACK\n04  10.0.4.12 -> 172.16.9.2   HTTP  POST /collect\n    Content-Type: application/octet-stream\n    X-Payload-Format: hex\n    Body: ${hex("GAMEHACK{packet_trail}")}\n05  172.16.9.2 -> 10.0.4.12   HTTP  204 No Content`,
    hints: ["Focus on the body of the outbound POST request.", "The X-Payload-Format header tells you how to decode the body: hexadecimal bytes to ASCII."], flag: "GAMEHACK{packet_trail}",
  },
  {
    id: "robots-never-forget", title: "Robots Never Forget", category: "Web Exploitation", difficulty: "Easy", points: 100, solves: 1651, time: "10 min", tone: "orange",
    summary: "A disallowed path isn't the same as a protected path.",
    description: "A junior developer assumed that hiding a directory from search engines also hid it from everyone else. Their archived robots file tells a different story.",
    objective: "Identify the exposed archive note and capture its flag.",
    tags: ["Recon", "robots.txt", "Misconfiguration"], artifactName: "web-archive.txt",
    artifact: `GET /robots.txt HTTP/1.1\n\nUser-agent: *\nDisallow: /internal/\nDisallow: /internal/archive-2026/\n\n--- Archived response: GET /internal/archive-2026/ops-note.txt ---\nStatus: 200 OK\nNote: Search indexing disabled. This is not access control.\nRecovery code: ${b64("GAMEHACK{robots_are_not_guards}")}\nEncoding: base64`,
    hints: ["The disallowed path was still accessible in the archive.", "Decode the recovery code from Base64."], flag: "GAMEHACK{robots_are_not_guards}",
  },
  {
    id: "the-hidden-commit", title: "The Hidden Commit", category: "OSINT", difficulty: "Medium", points: 175, solves: 897, time: "20 min", tone: "pink",
    summary: "Deleted from the file. Not deleted from history.",
    description: "A public repository accidentally included a sensitive token. The maintainer removed it in the next commit, but version control has a longer memory than the working tree.",
    objective: "Read the commit diff and recover the value that was removed.",
    tags: ["Git", "History", "OSINT"], artifactName: "git-show-7b3a.patch",
    artifact: `commit 7b3a9c42e1 (HEAD -> main)\nAuthor: devops <devops@gamehack.local>\nDate:   Thu Apr 9 11:42:16 2026 +0000\n\n    remove debug token from config\n\ndiff --git a/config/debug.env b/config/debug.env\n--- a/config/debug.env\n+++ b/config/debug.env\n@@ -1,3 +1,2 @@\n DEBUG=true\n-RECOVERY_TOKEN=${b64("GAMEHACK{history_remembers}")}\n TOKEN_FORMAT=base64\n+# Token removed from the current version`,
    hints: ["Lines prefixed with a minus sign existed before this commit.", "The removed RECOVERY_TOKEN is Base64 encoded."], flag: "GAMEHACK{history_remembers}",
  },
  {
    id: "mirror-protocol", title: "Mirror Protocol", category: "Cryptography", difficulty: "Medium", points: 200, solves: 743, time: "20 min", tone: "violet",
    summary: "The answer is right there, just facing the wrong way.",
    description: "A peculiar protocol reverses every transmitted message character by character before it leaves the wire. The intercepted payload is intact, but backward.",
    objective: "Reverse the intercepted transmission and submit the original flag.",
    tags: ["Transformation", "Strings", "Encoding"], artifactName: "transmission.dat",
    artifact: `PROTOCOL: MIRROR/1.0\nDIRECTION: outbound\nTRANSFORM: reverse entire payload\nPAYLOAD: ${"GAMEHACK{look_behind_you}".split("").reverse().join("")}\nCHECKSUM: verified`,
    hints: ["The transform is described in the header, not encrypted.", "Read the payload from its last character to its first."], flag: "GAMEHACK{look_behind_you}",
  },
  {
    id: "permission-denied", title: "Permission Denied", category: "Linux", difficulty: "Medium", points: 225, solves: 681, time: "25 min", tone: "lime",
    summary: "The obvious door is locked. Another one was left open.",
    description: "An operator cannot read a protected flag file directly, but a badly configured backup process copies it somewhere less protected. Examine the filesystem snapshot.",
    objective: "Find the readable copy of the protected flag.",
    tags: ["Linux", "Permissions", "Enumeration"], artifactName: "filesystem-snapshot.txt",
    artifact: `$ id\nuid=1000(operator) gid=1000(operator)\n$ cat /root/flag.txt\ncat: /root/flag.txt: Permission denied\n$ ls -la /var/backups\n-rw-r--r-- 1 root root 41 Apr 09 08:00 .system-flag.bak\n-rw------- 1 root root 58 Apr 09 08:00 db.key\n$ cat /var/backups/.system-flag.bak\n${b64("GAMEHACK{backups_need_boundaries}")}\n$ file /var/backups/.system-flag.bak\nASCII text, base64 encoded`,
    hints: ["The backup directory has a world-readable hidden file.", "Decode the contents of .system-flag.bak from Base64."], flag: "GAMEHACK{backups_need_boundaries}",
  },
  {
    id: "subdomain-sweep", title: "Subdomain Sweep", category: "Network Security", difficulty: "Medium", points: 200, solves: 594, time: "20 min", tone: "cyan",
    summary: "The interesting host isn't on the homepage.",
    description: "A DNS zone transfer was left enabled on a training domain. Among the records is a TXT value that reveals more than its owner intended.",
    objective: "Find the suspicious DNS record and decode the flag.",
    tags: ["DNS", "Recon", "Zone Transfer"], artifactName: "zone-transfer.axfr",
    artifact: `$ dig axfr gamehack.lab @ns1.gamehack.lab\ngamehack.lab.        IN SOA ns1.gamehack.lab. admin.gamehack.lab.\nwww.gamehack.lab.    IN A   10.10.5.10\napi.gamehack.lab.    IN A   10.10.5.11\nstaging.gamehack.lab.IN A   10.10.5.22\n_vault.gamehack.lab. IN TXT "${b64("GAMEHACK{dns_leaks_secrets}")}"\nmail.gamehack.lab.   IN MX  10 mail.gamehack.lab.`,
    hints: ["Look for a TXT record; they can contain arbitrary text.", "The _vault record is Base64 encoded."], flag: "GAMEHACK{dns_leaks_secrets}",
  },
  {
    id: "debug-me", title: "Debug Me", category: "Reverse Engineering", difficulty: "Medium", points: 250, solves: 486, time: "30 min", tone: "orange",
    summary: "A tiny verifier has a not-so-secret secret.",
    description: "A compiled password checker was partially recovered as pseudocode. Instead of guessing passwords, understand how it constructs the expected input.",
    objective: "Reconstruct the character array to recover the accepted flag.",
    tags: ["Pseudocode", "ASCII", "Static Analysis"], artifactName: "decompiled-checker.c",
    artifact: `int verify(char *input) {\n  int expected[] = {${[..."GAMEHACK{read_the_bytes}"].map(c => c.charCodeAt(0)).join(", ")}};\n  for (int i = 0; i < 24; i++) {\n    if (input[i] != (char)expected[i]) return 0;\n  }\n  return input[24] == '\\0';\n}`, 
    hints: ["The integers are decimal ASCII values.", "Convert each integer to a character in order. 71 = G, 65 = A."], flag: "GAMEHACK{read_the_bytes}",
  },
  {
    id: "cold-storage", title: "Cold Storage", category: "Digital Forensics", difficulty: "Hard", points: 350, solves: 329, time: "40 min", tone: "cyan",
    summary: "A backup left a trail through a compromised host.",
    description: "The attacker cleared shell history but forgot that a scheduled task had its own log. Follow the backup job's output and recover the archived marker.",
    objective: "Identify the archived marker, decode it, and submit the flag.",
    tags: ["Log Analysis", "Persistence", "IR"], artifactName: "cron-and-backup.log",
    artifact: `[02:00:00] cron[1024]: running /opt/jobs/archive.sh\n[02:00:01] archive: source=/srv/internal status=ok\n[02:00:01] archive: marker(hex)=${hex("GAMEHACK{the_logs_remember}")}\n[02:00:02] archive: destination=/mnt/cold/snapshot-0409.tar.gz\n[02:00:03] cron[1024]: job finished (exit 0)`,
    hints: ["The marker is printed by the archive job, not in shell history.", "Convert the hex marker into readable text."], flag: "GAMEHACK{the_logs_remember}",
  },
  {
    id: "cookie-crumbs", title: "Cookie Crumbs", category: "Web Exploitation", difficulty: "Medium", points: 200, solves: 912, time: "20 min", tone: "pink",
    summary: "The session is encoded, not encrypted.",
    description: "A training application's debug cookie stores more than a session identifier. Inspect the captured request and work out what the developer put in the cookie.",
    objective: "Decode the debug cookie and retrieve the embedded flag.",
    tags: ["Cookies", "Base64", "Web"], artifactName: "request.http",
    artifact: `GET /dashboard HTTP/1.1\nHost: training.gamehack.lab\nUser-Agent: Gamehack-Lab/1.0\nCookie: theme=dark; debug_session=${b64(JSON.stringify({ role: "tester", flag: "GAMEHACK{cookies_are_not_vaults}" }))}\nAccept: */*`,
    hints: ["Only the debug_session cookie looks unusual.", "Base64 decode it, then inspect the JSON value."], flag: "GAMEHACK{cookies_are_not_vaults}",
  },
  {
    id: "silent-signal", title: "Silent Signal", category: "OSINT", difficulty: "Hard", points: 400, solves: 211, time: "45 min", tone: "violet",
    summary: "A distress call was hidden in plain sight.",
    description: "The recovered operator note was padded with noise, but the important line is explicitly labeled. Decode the transmission before the signal disappears.",
    objective: "Recover the encoded signal and submit the final flag.",
    tags: ["Encoding", "Investigation", "Analysis"], artifactName: "operator-note.txt",
    artifact: `// emergency relay, channel 9\n[noise] a7f2 b01e cc48 883d\n[signal/base64] ${b64("GAMEHACK{listen_to_the_noise}")}\n[noise] 109c 4dae 2210 08f3\n// end transmission`,
    hints: ["Ignore the lines labeled noise; the signal line specifies its encoding.", "Decode the text after [signal/base64]."], flag: "GAMEHACK{listen_to_the_noise}",
  },
];

export function publicChallenge(challenge: ChallengeDefinition): PublicChallenge {
  const { flag: _flag, ...visible } = challenge;
  void _flag;
  return visible;
}

export function findChallenge(id: string) {
  return CHALLENGES.find((challenge) => challenge.id === id);
}

export const CATEGORIES: ChallengeCategory[] = ["Web Exploitation", "Cryptography", "Digital Forensics", "OSINT", "Reverse Engineering", "Linux", "Network Security"];
