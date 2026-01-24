import Link from 'next/link';
import { Camera, Music } from 'lucide-react';

export default function ChordsLandingPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white text-center">
            <h1 className="text-4xl font-black mb-12 tracking-tighter">CHOOSE YOUR EXPERIENCE</h1>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Studio Mode */}
                <Link href="/chords/studio" className="group">
                    <div className="h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all hover:border-cyan-500/50 hover:bg-zinc-800 shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Music className="w-16 h-16 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                        <h2 className="text-2xl font-black uppercase italic">Studio Mode</h2>
                        <p className="text-zinc-400 text-sm max-w-[200px]">Vertical chord diagrams focused on notation and short-neck visualization.</p>
                    </div>
                </Link>

                {/* Cinematic Mode */}
                <Link href="/chords/cinematic" className="group">
                    <div className="h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all hover:border-pink-500/50 hover:bg-zinc-800 shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Camera className="w-16 h-16 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                        <h2 className="text-2xl font-black uppercase italic">Cinematic Mode</h2>
                        <p className="text-zinc-400 text-sm max-w-[200px]">Horizontal full-neck guitar visualizer for high-quality video exports.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
