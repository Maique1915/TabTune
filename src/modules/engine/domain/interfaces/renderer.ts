import { ProjectData } from '@/modules/core/domain/types';

export interface Renderer {
    initialize(canvas: HTMLCanvasElement): void;
    loadProject(project: ProjectData): void;
    play(): void;
    pause(): void;
    seek(time: number): void;
    dispose(): void;
}

export interface SceneObject {
    id: string;
    type: string;
    render(ctx: CanvasRenderingContext2D | any, time: number): void;
}
