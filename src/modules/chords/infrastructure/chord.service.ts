import { db } from "@/lib/db";
import { chordShapes } from "@/lib/db/schema";
import { eq, and, ilike } from "drizzle-orm";
import { CreateChordShapeDTO, UpdateChordShapeDTO } from "../application/dtos/chord.dto";

export class ChordShapeService {
    async saveShape(data: CreateChordShapeDTO) {
        const [shape] = await db.insert(chordShapes).values({
            userId: data.userId,
            name: data.name,
            chordData: data.chordData,
            tags: data.tags,
        })
            .onConflictDoUpdate({
                target: [chordShapes.userId, chordShapes.name],
                set: {
                    chordData: data.chordData,
                    tags: data.tags,
                }
            })
            .returning();
        return shape;
    }

    async findByName(name: string, userId: number) {
        return await db.query.chordShapes.findFirst({
            where: and(eq(chordShapes.name, name), eq(chordShapes.userId, userId)),
        });
    }

    async searchShapes(query: string, userId: number) {
        return await db.query.chordShapes.findMany({
            where: and(
                eq(chordShapes.userId, userId),
                ilike(chordShapes.name, `%${query}%`)
            ),
        });
    }

    async deleteShape(id: number, userId: number) {
        return await db.delete(chordShapes)
            .where(and(eq(chordShapes.id, id), eq(chordShapes.userId, userId)));
    }
}
