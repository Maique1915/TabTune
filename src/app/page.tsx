"use client";

import Link from "next/link";
import { Header } from "@/shared/components/layout/Header";
import { useTranslation } from "@/modules/core/presentation/context/translation-context";

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-mesh font-display text-slate-900 dark:text-white selection:bg-primary/30 flex flex-col relative overflow-hidden">
      <Header />

      <main className="relative flex-1">
        {/* Background Decor */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full animate-pulse-subtle pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-secondary-neon/10 blur-[150px] rounded-full animate-float pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-12 animate-float">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t('page.hero.badge')}
            </div>

            <h1 className="text-7xl md:text-[120px] font-black tracking-tighter mb-8 leading-[0.9] text-white">
              {t('page.hero.title_start')} <br />
              <span className="text-primary italic">{t('page.hero.title_end')}</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-400 mb-14 leading-relaxed font-medium">
              {t('page.hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/short">
                <button className="w-full sm:w-auto px-10 py-5 bg-primary text-background-dark rounded-2xl font-black text-xl shadow-premium-glow hover:scale-105 hover:shadow-cyan-glow transition-all duration-500">
                  {t('page.hero.cta_primary')}
                </button>
              </Link>
              <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl font-black text-xl transition-all duration-500 flex items-center justify-center gap-3 backdrop-blur-md">
                <span className="material-symbols-outlined text-2xl">play_circle</span>
                {t('page.hero.cta_secondary')}
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="relative px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="glassmorphism p-12 md:p-20 rounded-[40px] relative overflow-hidden group">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-700"></div>

              <div className="relative z-10 flex flex-col md:flex-row gap-16 items-center">
                <div className="shrink-0">
                  <div className="size-24 bg-primary rounded-3xl flex items-center justify-center text-background-dark shadow-cyan-glow rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <span className="material-symbols-outlined text-5xl font-black">info</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">
                    {t('page.about.title')}
                  </h2>
                  <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-medium">
                    {t('page.about.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
              <div className="max-w-3xl">
                <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                  {t('page.features_section.title')}
                </h2>
                <p className="text-slate-400 text-xl font-medium leading-relaxed">
                  {t('page.features_section.subtitle')}
                </p>
              </div>
              <a className="text-primary font-black text-lg flex items-center gap-3 hover:translate-x-2 transition-transform cursor-pointer group">
                {t('page.features_section.explore')}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">trending_flat</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Card 1: Short View */}
              <Link href="/short" className="contents">
                <div className="group p-10 rounded-[32px] glassmorphism hover:bg-primary/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-4 cursor-pointer flex flex-col h-full">
                  <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-background-dark transition-all duration-500 shadow-inner-glow">
                    <span className="material-symbols-outlined text-4xl">grid_view</span>
                  </div>
                  <h3 className="text-2xl font-black mb-4">{t('page.features_section.short_view.title')}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    {t('page.features_section.short_view.desc')}
                  </p>
                </div>
              </Link>

              {/* Card 2: Full View */}
              <Link href="/full" className="contents">
                <div className="group p-10 rounded-[32px] glassmorphism hover:bg-secondary-neon/10 hover:border-secondary-neon/30 transition-all duration-500 hover:-translate-y-4 cursor-pointer flex flex-col h-full">
                  <div className="size-20 rounded-2xl bg-secondary-neon/10 flex items-center justify-center text-secondary-neon mb-10 group-hover:bg-secondary-neon group-hover:text-background-dark transition-all duration-500 shadow-inner-glow">
                    <span className="material-symbols-outlined text-4xl">panorama_horizontal</span>
                  </div>
                  <h3 className="text-2xl font-black mb-4">{t('page.features_section.full_view.title')}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    {t('page.features_section.full_view.desc')}
                  </p>
                </div>
              </Link>

              {/* Card 3: Beats System */}
              <Link href="/beats" className="contents">
                <div className="group p-10 rounded-[32px] glassmorphism hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-4 cursor-pointer flex flex-col h-full">
                  <div className="size-20 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-10 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500 shadow-inner-glow">
                    <span className="material-symbols-outlined text-4xl">equalizer</span>
                  </div>
                  <h3 className="text-2xl font-black mb-4">{t('page.features_section.beats.title')}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    {t('page.features_section.beats.desc')}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[48px] glassmorphism-primary p-16 md:p-24 text-center">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <h2 className="text-5xl md:text-7xl font-black mb-10 relative z-10 leading-tight">
              {t('page.cta.title')}
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 mb-14 max-w-2xl mx-auto relative z-10 font-medium">
              {t('page.cta.desc')}
            </p>
            {/*<div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <Link href="/short">
                <button className="bg-primary text-background-dark px-12 py-5 rounded-2xl font-black text-xl shadow-cyan-glow hover:scale-110 hover:shadow-premium-glow transition-all duration-500">
                  {t('page.cta.button_primary')}
                </button>
              </Link>
              <button className="text-white font-black text-xl hover:text-primary transition-colors py-4">
                {t('page.cta.button_secondary')}
              </button>
            </div>*/}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.05] py-20 px-6 bg-background-dark/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner-glow">
              <span className="material-symbols-outlined text-2xl font-black">graphic_eq</span>
            </div>
            <span className="text-2xl font-black tracking-tighter">TabTune</span>
          </div>
          <div className="flex flex-wrap justify-center gap-12 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <a className="hover:text-primary transition-colors cursor-pointer">{t('page.footer.terms')}</a>
            <a className="hover:text-primary transition-colors cursor-pointer">{t('page.footer.privacy')}</a>
            <a className="hover:text-primary transition-colors cursor-pointer">{t('page.footer.discord')}</a>
          </div>
          <p className="text-sm font-medium text-slate-600">
            {t('page.footer.rights')}
          </p>
        </div>
      </footer>
    </div>
  );
}
