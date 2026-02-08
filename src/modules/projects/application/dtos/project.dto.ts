import { z } from "zod";

export const TabNoteSchema = z.object({
    string: z.number().min(1).max(6),
    fret: z.number().min(0).max(24),
    position: z.number(),
    duration: z.string().optional(),
    technique: z.string().optional(),
});

export const ProjectDataSchema = z.object({
    bpm: z.number().min(1).max(999).default(120),
    timeSignature: z.tuple([z.number(), z.number()]).default([4, 4]),
    notes: z.array(TabNoteSchema).default([]),
    settings: z.object({
        showFingering: z.boolean().optional(),
        showRhythm: z.boolean().optional(),
    }).optional(),
    theme: z.object({
        neckColor: z.string().optional(),
        fingerColor: z.string().optional(),
    }).optional(),
});

export const CreateProjectSchema = z.object({
    userId: z.number(),
    name: z.string().min(1).max(255),
    data: ProjectDataSchema,
});

export const UpdateProjectSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    data: ProjectDataSchema.optional(),
});

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof UpdateProjectSchema>;
export type ProjectDataDTO = z.infer<typeof ProjectDataSchema>;
