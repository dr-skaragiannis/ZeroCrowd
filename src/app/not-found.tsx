import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return <div className="mx-auto grid min-h-[65vh] max-w-lg place-content-center text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-[#4a6648] bg-[#273b2a] text-lime"><Compass size={30} /></span><span className="mt-6 mono text-[11px] font-bold tracking-widest text-lime">ERROR 404 // SIGNAL LOST</span><h1 className="display-font mt-3 text-[34px] font-bold tracking-[-.05em]">This path goes nowhere.</h1><p className="mt-3 text-[12px] leading-relaxed text-[#91a4ad]">Looks like this mission doesn&apos;t exist, or the trail went cold. Head back to familiar territory.</p><Link href="/" className="btn-primary mx-auto mt-7"><ArrowLeft size={14} /> Return to command center</Link></div>;
}
