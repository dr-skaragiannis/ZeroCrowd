"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, RotateCcw, Terminal } from "lucide-react";
import { T } from "@/components/LanguageProvider";

type LineKind = "in" | "out" | "err" | "ok" | "sys";
type TerminalLine = { text: string; kind: LineKind };

const DEMO_COMMAND = "nmap 192.0.2.42";
const INTRO_LINES: TerminalLine[] = [
  { kind: "sys", text: "GAMEHACK RANGE // INTERACTIVE PREVIEW" },
  { kind: "sys", text: "Local simulation only. No network requests are made." },
];
const DEMO_OUTPUT: TerminalLine[] = [
  { kind: "sys", text: "[simulation] target: training-lab.test (192.0.2.42)" },
  { kind: "out", text: "PORT     STATE    SERVICE" },
  { kind: "ok", text: "22/tcp   open     ssh       // training host" },
  { kind: "ok", text: "80/tcp   open     http      // web challenge" },
  { kind: "out", text: "443/tcp  filtered https" },
  { kind: "sys", text: "Tip: try `help`, `ls`, or `cat evidence/flag.txt`." },
];

function responseFor(command: string): TerminalLine[] {
  const [verb = "", ...parts] = command.trim().split(/\s+/);
  const args = parts.join(" ");
  const cmd = verb.toLowerCase();
  const argument = args.toLowerCase();
  const out = (text: string): TerminalLine => ({ kind: "out", text });
  const ok = (text: string): TerminalLine => ({ kind: "ok", text });
  const sys = (text: string): TerminalLine => ({ kind: "sys", text });

  if (cmd === "help" || cmd === "?") return [
    sys("AVAILABLE SIMULATION COMMANDS"),
    out("help                         show this list"),
    out("whoami                       view your training identity"),
    out("pwd / ls                     explore the fictional workspace"),
    out("cat <file>                   read a practice artifact"),
    out("scan [host] / nmap [host]    view simulated service results"),
    out("clear                        clear the terminal"),
  ];
  if (cmd === "whoami") return [ok("operator@gamehack  ·  trainee access")];
  if (cmd === "pwd") return [out("/home/operator/mission")];
  if (cmd === "ls" || cmd === "dir") return [
    out("mission.md   scope.txt   evidence/   tools/") ,
    sys("All files belong to this fictional training environment."),
  ];
  if (cmd === "cat" || cmd === "type") {
    if (argument.includes("flag") || argument.includes("evidence")) return [
      out("evidence/flag.txt"),
      ok("GH{learn_by_doing}"),
      sys("Practice flag only — nothing was submitted or saved."),
    ];
    if (argument.includes("scope")) return [
      out("SCOPE: training-lab.test (documentation-only address 192.0.2.42)"),
      sys("AUTHORIZED: this local simulation. EXTERNAL TARGETS: out of scope."),
    ];
    if (argument.includes("mission") || argument.includes("readme")) return [
      out("MISSION: Inspect a fictional service, read the supplied artifacts, and find the practice flag."),
      sys("Hint: start with `scan`, then inspect `evidence/flag.txt`."),
    ];
    return [{ kind: "err", text: "File not found. Try `ls` to list the practice workspace." }];
  }
  if (cmd === "scan" || cmd === "nmap") return [
    sys(`[simulation] target: ${args || "training-lab.test (192.0.2.42)"}`),
    out("PORT     STATE    SERVICE"),
    ok("22/tcp   open     ssh       // training host"),
    ok("80/tcp   open     http      // web challenge"),
    out("443/tcp  filtered https"),
    sys("No packets were sent. This result is generated inside the demo."),
  ];
  if (cmd === "clear" || cmd === "cls") return [];
  if (cmd === "exit" || cmd === "quit") return [sys("Session remains open. Explore another simulated command anytime.")];
  return [{ kind: "err", text: `Unknown command: ${verb}. Type \`help\` to see what this demo supports.` }];
}

export default function LandingTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>(INTRO_LINES);
  const [demoText, setDemoText] = useState("");
  const [command, setCommand] = useState("");
  const [demoComplete, setDemoComplete] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const demoCancelled = useRef(false);
  const demoInterval = useRef<number | null>(null);
  const demoTimeouts = useRef<number[]>([]);

  const cancelDemo = () => {
    demoCancelled.current = true;
    if (demoInterval.current !== null) window.clearInterval(demoInterval.current);
    demoTimeouts.current.forEach(window.clearTimeout);
    demoTimeouts.current = [];
    demoInterval.current = null;
    setDemoText("");
    setDemoComplete(true);
  };

  useEffect(() => {
    demoCancelled.current = false;
    const initialDelay = window.setTimeout(() => {
      let position = 0;
      demoInterval.current = window.setInterval(() => {
        if (demoCancelled.current) return;
        position += 1;
        setDemoText(DEMO_COMMAND.slice(0, position));
        if (position >= DEMO_COMMAND.length) {
          if (demoInterval.current !== null) window.clearInterval(demoInterval.current);
          demoInterval.current = null;
          const reveal = window.setTimeout(() => {
            if (demoCancelled.current) return;
            setLines(current => [...current, { kind: "in", text: `$ ${DEMO_COMMAND}` }, ...DEMO_OUTPUT]);
            setDemoText("");
            setDemoComplete(true);
          }, 380);
          demoTimeouts.current.push(reveal);
        }
      }, 38);
    }, 550);
    demoTimeouts.current.push(initialDelay);
    return () => {
      demoCancelled.current = true;
      window.clearTimeout(initialDelay);
      if (demoInterval.current !== null) window.clearInterval(demoInterval.current);
      demoTimeouts.current.forEach(window.clearTimeout);
      demoTimeouts.current = [];
      demoInterval.current = null;
    };
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines, demoText]);

  const runCommand = (raw: string) => {
    const value = raw.trim().slice(0, 100);
    if (!value) return;
    if (!demoComplete) cancelDemo();
    const result = responseFor(value);
    const isClear = value.toLowerCase() === "clear" || value.toLowerCase() === "cls";
    const inputLine: TerminalLine = { kind: "in", text: `$ ${value}` };
    setLines(current => isClear ? [] : [...current, inputLine, ...result].slice(-55));
    setCommand("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    runCommand(command);
    inputRef.current?.focus();
  };

  const setSuggestion = (value: string) => {
    setCommand(value);
    inputRef.current?.focus();
  };

  return <div className="terminal-window landing-terminal" aria-label="Interactive simulated command-line demo">
    <div className="terminal-bar"><span className="terminal-dot !bg-[#f87975]" /><span className="terminal-dot !bg-[#f2c96d]" /><span className="terminal-dot !bg-[#70cf83]" /><span className="ml-2 inline-flex items-center gap-1.5 text-[#92a69a]"><Terminal size={12} /> gamehack-range — local demo</span><span className="ml-auto rounded border border-[#395043] bg-[#1a2b21] px-1.5 py-0.5 text-[8px] font-bold tracking-[.13em] text-lime">SAFE MODE</span></div>
    <div ref={bodyRef} className="terminal-body landing-terminal-body" role="log" aria-live="polite" aria-label="Simulated terminal output">
      {lines.map((line, index) => <div className={`terminal-line ${line.kind}`} key={`${index}-${line.text}`}>{line.text}</div>)}
      {!demoComplete && <div className="terminal-line in"><span className="terminal-prompt">$ </span>{demoText}<span className="landing-cursor" aria-hidden="true" /></div>}
      {demoComplete && <div className="terminal-line sys landing-ready"><span className="status-dot !h-[5px] !w-[5px] !shadow-none" /><span><T en="Demo ready — type a command below." el="Η επίδειξη είναι έτοιμη — γράψε μια εντολή παρακάτω." /></span></div>}
    </div>
    <form className="landing-terminal-input-row" onSubmit={submit} aria-label="Enter a simulated command">
      <span className="terminal-prompt" aria-hidden="true">operator@gamehack:~$</span>
      <input ref={inputRef} className="terminal-input" value={command} onChange={event => setCommand(event.target.value)} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-label="Simulated command" placeholder="try ‘help’" maxLength={100} />
      <button type="submit" disabled={!command.trim()} className="terminal-run" aria-label="Run simulated command"><ArrowUpRight size={16} /></button>
    </form>
    <div className="landing-terminal-footer"><span><T en="Only whitelisted demo commands run here." el="Εκτελούνται μόνο οι εντολές της επίδειξης." /></span><button type="button" className="landing-reset" onClick={() => { cancelDemo(); setLines(INTRO_LINES); setCommand(""); }}><RotateCcw size={11} /><T en="Reset" el="Επαναφορά" /></button></div>
    <div className="landing-suggestions"><span className="text-[#75867f]"><T en="TRY" el="ΔΟΚΙΜΑΣΕ" /></span>{["help", "scan", "cat evidence/flag.txt"].map(item => <button key={item} type="button" onClick={() => setSuggestion(item)}>{item}</button>)}</div>
  </div>;
}
