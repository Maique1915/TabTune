import Link from "next/link";
import { Music, FileMusic, Guitar } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
            TabTune
          </h1>
          <p className="text-xl text-neutral-400">
            Escolha seu modo de criação
          </p>
        </div>

        <div className="flex justify-center">
          {/* Chords Card */}
          <Link href="/chords" className="group w-full max-w-md">
            <div className="h-80 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 transition-all duration-300 hover:border-blue-500/50 hover:bg-neutral-900/80 hover:scale-[1.02] hover:shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Guitar className="w-12 h-12 text-blue-500" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Editor de Acordes</h2>
                <p className="text-neutral-500 group-hover:text-neutral-400">
                  Crie e visualize acordes no braço do violão com animações dinâmicas.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <footer className="text-center text-neutral-600 text-sm">
          &copy; {new Date().getFullYear()} TabTune Studio
        </footer>
      </div>
    </div>
  );
}
