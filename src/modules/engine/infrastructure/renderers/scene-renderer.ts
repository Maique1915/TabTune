import { Renderer, SceneObject } from '../../domain/interfaces/renderer';
import { ProjectData } from '@/modules/core/domain/types';

export class SceneRenderer implements Renderer {
    private ctx: CanvasRenderingContext2D | null = null;
    private objects: SceneObject[] = [];
    private project: ProjectData | null = null;
    private animationFrameId: number | null = null;

    initialize(canvas: HTMLCanvasElement): void {
        this.ctx = canvas.getContext('2d');
    }

    loadProject(project: ProjectData): void {
        this.project = project;
    }

    addObject(object: SceneObject): void {
        this.objects.push(object);
    }

    play(): void {
        if (this.animationFrameId) return;

        const renderLoop = (time: number) => {
            this.render(time);
            this.animationFrameId = requestAnimationFrame(renderLoop);
        };
        this.animationFrameId = requestAnimationFrame(renderLoop);
    }

    pause(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    seek(time: number): void {
        this.render(time);
    }

    dispose(): void {
        this.pause();
        this.ctx = null;
    }

    private render(time: number): void {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Render all objects
        for (const obj of this.objects) {
            obj.render(this.ctx, time);
        }
    }
}
