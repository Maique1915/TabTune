import { create } from 'zustand';
import { ProjectData } from '../../domain/types';

interface ProjectState {
    project: ProjectData;
    isPlaying: boolean;
    currentTime: number; // in seconds
    zoomLevel: number; // timeline zoom

    // Actions
    setProject: (project: ProjectData) => void;
    togglePlay: () => void;
    setTime: (time: number) => void;
    setZoom: (zoom: number) => void;
}

const defaultProject: ProjectData = {
    id: 'new-project',
    name: 'Untitled Project',
    bpm: 120,
    timeSignature: [4, 4],
    tracks: [],
    duration: 300
};

export const useProjectStore = create<ProjectState>((set) => ({
    project: defaultProject,
    isPlaying: false,
    currentTime: 0,
    zoomLevel: 100,

    setProject: (project) => set({ project }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setTime: (time) => set({ currentTime: time }),
    setZoom: (zoom) => set({ zoomLevel: zoom }),
}));
