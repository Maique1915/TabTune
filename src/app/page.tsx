import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white selection:bg-primary/30 flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-background-dark shadow-[0_0_15px_rgba(7,182,213,0.5)]">
              <span className="material-symbols-outlined text-2xl font-bold">
                graphic_eq
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tighter">
              TabTune<span className="text-primary">.</span>
            </h2>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a
              className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
            >
              Features
            </a>
            <a
              className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
            >
              Creators
            </a>
            <a
              className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold hover:text-primary transition-colors">
              Log In
            </button>
            <Link href="/chords">
              <button className="bg-primary text-background-dark px-6 py-2.5 rounded-lg text-sm font-bold shadow-cyan-glow hover:brightness-110 transition-all">
                Start Creating
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative flex-1">
        {/* Background Decor */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(7, 182, 213, 0.1) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-secondary-neon/5 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Hero Section */}
        <section className="relative pt-20 pb-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now with 4K Rendering
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 leading-[1.1]">
              Animated Chords for <br />{" "}
              <span className="text-primary">Guitar Creators</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
              Professional-grade fretboard animations for lessons, social media,
              and courses. Build cinematic chord charts in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/chords">
                <button className="w-full sm:w-auto px-8 py-4 bg-primary text-background-dark rounded-xl font-bold text-lg shadow-cyan-glow hover:scale-105 transition-all">
                  Start Creating Free
                </button>
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">play_circle</span>
                View Demo
              </button>
            </div>
          </div>
        </section>

        {/* Visual Preview / Mockup Section */}
        <section className="relative px-6 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#0e1416] rounded-2xl border border-white/10 p-4 shadow-2xl overflow-hidden relative">
              {/* Dashboard Toolbar Mockup */}
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 px-2">
                <div className="flex gap-2">
                  <div className="size-3 rounded-full bg-red-500/50"></div>
                  <div className="size-3 rounded-full bg-yellow-500/50"></div>
                  <div className="size-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="bg-white/5 px-4 py-1 rounded-md text-[10px] font-mono text-white/40 tracking-widest">
                  TABTUNE_STUDIO_V2.EXE
                </div>
                <div className="w-12"></div>
              </div>
              <div className="relative aspect-video rounded-xl bg-[#050808] border border-white/5 overflow-hidden group">
                {/* Fallback pattern instead of external image to avoid potential CORS/loading issues in preview */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-60"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a), linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 10px 10px",
                  }}
                ></div>

                {/* UI Overlay Elements */}
                <div className="absolute left-6 top-6 flex flex-col gap-3">
                  <div className="p-3 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 w-48">
                    <div className="text-[10px] text-primary font-bold uppercase mb-2">
                      Chord Type
                    </div>
                    <div className="text-sm font-bold">C Major 7 (Add 9)</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 w-48">
                    <div className="text-[10px] text-secondary-neon font-bold uppercase mb-2">
                      Animation State
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-secondary-neon animate-pulse"></div>
                      <div className="text-sm font-bold">Rendering...</div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="size-20 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/50 text-primary flex items-center justify-center hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl fill-1">
                      play_arrow
                    </span>
                  </button>
                </div>
                {/* Progress Bar */}
                <div className="absolute bottom-6 inset-x-6">
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3 shadow-[0_0_10px_#07b6d5]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-bold mb-4">
                  Designed for Excellence
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Experience the future of guitar content creation with tools
                  built for speed, cinematic quality, and absolute precision.
                </p>
              </div>
              <a
                className="text-primary font-bold flex items-center gap-2 hover:underline underline-offset-4 cursor-pointer"
              >
                Explore all tools{" "}
                <span className="material-symbols-outlined">trending_flat</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature Card 1 */}
              <div className="group p-8 rounded-2xl bg-card-dark border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-2">
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all">
                  <span className="material-symbols-outlined text-3xl">
                    precision_manufacturing
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">Studio Precision</h3>
                <p className="text-slate-400 leading-relaxed">
                  Vertical diagrams optimized for traditional high-quality chord
                  charts. Perfect for PDFs and songbooks.
                </p>
              </div>
              {/* Feature Card 2 */}
              <div className="group p-8 rounded-2xl bg-card-dark border border-white/5 hover:border-secondary-neon/30 transition-all hover:-translate-y-2">
                <div className="size-14 rounded-xl bg-secondary-neon/10 flex items-center justify-center text-secondary-neon mb-6 group-hover:bg-secondary-neon group-hover:text-background-dark transition-all">
                  <span className="material-symbols-outlined text-3xl">
                    videocam
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">Cinematic Rendering</h3>
                <p className="text-slate-400 leading-relaxed">
                  Ultra-smooth full-neck views for intricate solos and scale
                  runs. Export in 4K at 60fps for YouTube and TikTok.
                </p>
              </div>
              {/* Feature Card 3 */}
              <div className="group p-8 rounded-2xl bg-card-dark border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-2">
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all">
                  <span className="material-symbols-outlined text-3xl">
                    psychology
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">Smart Transpose</h3>
                <p className="text-slate-400 leading-relaxed">
                  Proprietary AI-assisted positioning for optimal finger
                  placement. No more awkward fingerings for complex jazz chords.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-secondary-neon/10 border border-white/10 p-12 text-center">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(7, 182, 213, 0.1) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            ></div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 relative z-10">
              Ready to transform <br /> your lessons?
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto relative z-10">
              Join over 5,000+ guitar creators making world-class visuals with
              TabTune. No design skills required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/chords">
                <button className="bg-primary text-background-dark px-10 py-4 rounded-xl font-black text-lg shadow-cyan-glow hover:scale-105 transition-all">
                  Get Started For Free
                </button>
              </Link>
              <button className="text-white font-bold hover:text-primary transition-colors">
                View Pricing Plans
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 px-6 bg-background-light dark:bg-background-dark/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary/20 rounded flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl font-bold">
                graphic_eq
              </span>
            </div>
            <span className="text-xl font-bold tracking-tighter">TabTune</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a className="hover:text-white transition-colors cursor-pointer">
              Terms of Service
            </a>
            <a className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </a>
            <a className="hover:text-white transition-colors cursor-pointer">
              Discord Community
            </a>
          </div>
          <p className="text-sm text-slate-600">
            © 2024 TabTune Animator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
