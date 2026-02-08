import { z } from "zod";

export const ChordDataSchema = z.object({
    frets: z.array(z.number()),
    fingers: z.array(z.number().or(z.string())),
    barres: z.array(z.any()).optional(),
});

export const CreateChordShapeSchema = z.object({
    userId: z.number(),
    name: z.string().min(1).max(100),
    chordData: ChordDataSchema,
    tags: z.array(z.string()).optional(),
});

export const UpdateChordShapeSchema = CreateChordShapeSchema.partial();

export type CreateChordShapeDTO = z.infer<typeof CreateChordShapeSchema>;
export type UpdateChordShapeDTO = z.infer<typeof UpdateChordShapeSchema>;
