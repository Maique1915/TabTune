'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Button } from '@/shared/components/ui/button';
import { Grid, Layout, Music, Clock, MoreVertical, ExternalLink, Trash2 } from 'lucide-react';
import { useUser } from '@/modules/core/presentation/context/user-context';
import { useTranslation } from '@/modules/core/presentation/context/translation-context';
import { Header } from '@/shared/components/layout/Header';
import { MiniChat } from '@/shared/components/layout/MiniChat';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading: userLoading, logout } = useUser();
    const { t } = useTranslation();

    // State for user data
    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState<any[]>([]);
    const [customStyles, setCustomStyles] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('short');

    const fetchProjects = (userId: number) => {
        fetch(`/api/projects?userId=${userId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProjects(data);
                }
            })
            .catch(err => console.error('Error fetching projects:', err));
    };

    const loadStyles = () => {
        const saved = localStorage.getItem('cifrai_custom_styles');
        if (saved) {
            try {
                setCustomStyles(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load styles", e);
            }
        }
    };

    useEffect(() => {
        if (!userLoading) {
            if (!user) {
                router.push('/login');
                return;
            }

            fetchProjects(user.id);
            loadStyles();
            setIsLoading(false);
        }
    }, [user, userLoading, router]);

    const handleOpenProject = (project: any) => {
        router.push(`/${project.screenContext}?id=${project.id}`);
    };

    const handleDeleteProject = async (projectId: number) => {
        if (!window.confirm(t('profile.confirm.delete_project'))) {
            return;
        }

        try {
            const res = await fetch(`/api/projects?id=${projectId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setProjects(prev => prev.filter(p => p.id !== projectId));
                alert(t('profile.messages.project_deleted'));
            } else {
                alert(t('profile.messages.project_delete_error'));
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert(t('profile.messages.project_delete_error'));
        }
    };

    const handleDeleteStyle = (styleId: string) => {
        if (!window.confirm(t('profile.confirm.delete_style'))) return;
        const updated = customStyles.filter(s => s.id !== styleId);
        setCustomStyles(updated);
        localStorage.setItem('cifrai_custom_styles', JSON.stringify(updated));
        alert(t('profile.messages.style_deleted'));
    };

    const getJoinedDate = () => {
        if (!user) return t('profile.recently');
        return user.createdAt
            ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
            : t('profile.recently');
    };

    const formatContext = (ctx: string) => {
        if (ctx === 'short') return t('page.features_section.short_view.title').toUpperCase();
        if (ctx === 'full') return t('page.features_section.full_view.title').toUpperCase();
        if (ctx === 'beats') return t('page.features_section.beats.title').toUpperCase();
        return 'CUSTOM';
    };

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a1214] via-[#0f1c1f] to-[#0a1214] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-zinc-400">{t('page.demo.rendering')}</p>
                </div>
            </div>
        );
    }

    const chordShapes = [
        { name: "Open C Major", frets: "x32010" },
        { name: "Jazz G7 (Shell)", frets: "3x34xx" },
        { name: "Power Chord A5", frets: "577xxx" },
        { name: "Hendrix Chord (E7#9)", frets: "076780" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#0f2023]">
            <Header />

            <div className="flex-1 font-display text-white relative overflow-hidden flex justify-center py-12 px-6">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div
                        className="absolute top-0 right-0 w-[500px] h-[500px] opacity-20 blur-[100px] rounded-full bg-primary/20"
                    />
                    <div
                        className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-20 blur-[100px] rounded-full bg-pink-500/10"
                    />
                </div>

                <div className="relative z-10 w-full max-w-5xl flex flex-col gap-8">

                    {/* Header / Profile Card */}
                    <div
                        className="rounded-2xl p-8 bg-[#162a2d]/80 backdrop-blur-xl border border-white/10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 shadow-2xl"
                    >
                        <div className="size-24 rounded-full bg-gradient-to-br from-primary to-pink-500 p-[2px]">
                            <div className="w-full h-full rounded-full bg-[#0f2023] flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-white">person</span>
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <h1 className="text-3xl font-bold">{user?.name}</h1>
                                {user?.nivel && (
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${user.nivel === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                        user.nivel === 'plus' ? 'bg-primary/20 text-primary border border-primary/30' :
                                            'bg-white/10 text-zinc-400 border border-white/10'
                                        }`}>
                                        {user.nivel === 'admin' ? t('header.levels.admin').toUpperCase() :
                                            user.nivel === 'plus' ? t('header.levels.plus').toUpperCase() :
                                                t('header.levels.free').toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-400 mb-1">{user?.email}</p>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-4 text-xs font-mono uppercase tracking-widest text-[#9bb6bb]/70">
                                <span>{t('profile.lang')}: {(user?.preferredLanguage || 'EN').toUpperCase()}</span>
                                <span>•</span>
                                <span>{t('profile.joined')}: {getJoinedDate()}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 min-w-[140px]">
                            <Link href="/profile/edit">
                                <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold transition-all w-full">
                                    {t('profile.edit_profile')}
                                </button>
                            </Link>
                            <button
                                onClick={logout}
                                className="w-full px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-bold transition-all"
                            >
                                {t('profile.sign_out')}
                            </button>
                        </div>
                    </div>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Projects Section */}
                        <div className="col-span-1 lg:col-span-2 rounded-2xl p-6 bg-[#162a2d]/60 backdrop-blur-md border border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">folder_open</span>
                                    {t('profile.projects')}
                                </h2>
                                <span className="text-xs text-[#9bb6bb] uppercase tracking-wider">{t('profile.saved_cloud')}</span>
                            </div>

                            <Tabs defaultValue="short" value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="bg-black/20 border border-white/5 p-1 mb-6">
                                    <TabsTrigger value="short" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-2 px-4 py-2">
                                        <Grid size={14} />
                                        <span>{t('page.features_section.short_view.title')}</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="full" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-2 px-4 py-2">
                                        <Layout size={14} />
                                        <span>{t('page.features_section.full_view.title')}</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="beats" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-2 px-4 py-2">
                                        <Music size={14} />
                                        <span>{t('page.features_section.beats.title')}</span>
                                    </TabsTrigger>
                                </TabsList>

                                {['short', 'full', 'beats'].map((context) => (
                                    <TabsContent key={context} value={context}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {projects.filter(p => p.screenContext === context).length > 0 ? (
                                                projects.filter(p => p.screenContext === context).map((project) => (
                                                    <div
                                                        key={project.id}
                                                        className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-primary/30 transition-all group relative cursor-pointer"
                                                        onClick={() => handleOpenProject(project)}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="font-bold text-sm text-white group-hover:text-primary transition-colors">{project.name}</h3>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                                    <button className="p-1 rounded-md hover:bg-white/10 text-zinc-600 hover:text-zinc-300">
                                                                        <MoreVertical size={16} />
                                                                    </button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-zinc-300">
                                                                    <DropdownMenuItem
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleOpenProject(project);
                                                                        }}
                                                                        className="hover:bg-white/5 cursor-pointer"
                                                                    >
                                                                        <ExternalLink size={14} className="mr-2" />
                                                                        {t('profile.open_project')}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteProject(project.id);
                                                                        }}
                                                                        className="text-red-400 hover:bg-red-500/10 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
                                                                    >
                                                                        <Trash2 size={14} className="mr-2" />
                                                                        {t('profile.delete_project')}
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                                            <Clock size={12} />
                                                            <span>{t('profile.updated')} {new Date(project.updatedAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-full py-8 text-center bg-black/10 rounded-xl border border-dashed border-white/10">
                                                    <p className="text-slate-500 text-sm italic">{t('profile.empty_projects')}</p>
                                                    <Link href={`/${context}`}>
                                                        <Button className="mt-4 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold uppercase tracking-wider border border-primary/20 rounded-lg">
                                                            {t('profile.create_project')}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>

                        {/* Saved Styles */}
                        <div className="rounded-2xl p-6 bg-[#162a2d]/60 backdrop-blur-md border border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-pink-500">palette</span>
                                    {t('profile.styles')}
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3">
                                {customStyles.length > 0 ? (
                                    customStyles.map((style) => {
                                        const previewColors = [
                                            style.style?.fingers?.color || '#000',
                                            style.style?.global?.backgroundColor || '#000',
                                            style.style?.fretboard?.strings?.color || '#fff'
                                        ];

                                        return (
                                            <div
                                                key={style.id}
                                                className="group flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:border-pink-500/30 transition-all cursor-pointer relative"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="size-10 rounded-lg border border-white/10 shadow-inner"
                                                        style={{ background: `linear-gradient(135deg, ${previewColors[0]} 0%, ${previewColors[1]} 100%)` }}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm text-white group-hover:text-pink-400 transition-colors uppercase tracking-tight">{style.label}</span>
                                                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.15em]">{formatContext(style.context)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteStyle(style.id);
                                                        }}
                                                        className="p-1.5 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <div className="w-5 h-5 rounded-full border-2 border-zinc-800 flex items-center justify-center">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-8 text-center bg-black/10 rounded-xl border border-dashed border-white/10">
                                        <p className="text-slate-500 text-xs italic">{t('profile.empty_styles')}</p>
                                    </div>
                                )}
                                <Link href="/">
                                    <button className="mt-2 w-full py-3 border border-dashed border-white/10 rounded-xl text-[10px] text-zinc-500 hover:text-pink-400 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all font-black uppercase tracking-[0.2em]">
                                        {t('profile.create_style')}
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Chord Library */}
                        <div className="col-span-1 lg:col-span-3 rounded-2xl p-6 bg-[#162a2d]/60 backdrop-blur-md border border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-yellow-500">library_music</span>
                                    {t('profile.chord_library')}
                                </h2>
                                <button className="text-xs font-bold text-primary hover:text-white transition-colors">{t('profile.view_all')}</button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                                {chordShapes.map((chord, idx) => (
                                    <div key={idx} className="aspect-square rounded-xl bg-black/20 border border-white/5 hover:border-yellow-500/30 transition-all p-4 flex flex-col justify-between group cursor-pointer hover:-translate-y-1">
                                        <div className="flex justify-between items-start">
                                            <span className="text-2xl font-black text-white/20 group-hover:text-yellow-500/50 transition-colors">#</span>
                                            <span className="material-symbols-outlined text-slate-600 text-sm hover:text-white">more_horiz</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm leading-tight mb-1">{chord.name}</h4>
                                            <p className="text-[10px] font-mono text-slate-500 tracking-wider group-hover:text-yellow-500 transition-colors">{chord.frets}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-yellow-500/30 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group hover:bg-yellow-500/5">
                                    <span className="material-symbols-outlined text-2xl text-slate-600 group-hover:text-yellow-500 transition-colors">add_circle</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-white transition-colors">{t('profile.add_shape')}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <MiniChat />
        </div>
    );
}
