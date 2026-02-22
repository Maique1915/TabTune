// import { db } from "@/lib/db";
// import { chordShapes } from "@/lib/db/schema";
// import { eq, and, ilike } from "drizzle-orm";
import { CreateChordShapeDTO, UpdateChordShapeDTO } from "../application/dtos/chord.dto";

export class ChordShapeService {
    async saveShape(data: CreateChordShapeDTO) {
        console.log("Database disabled: saveShape", data);
        return null;
    }

    async findByName(name: string, userId: number) {
        console.log("Database disabled: findByName", name, userId);
        return null;
    }

    async searchShapes(query: string, userId: number) {
        console.log("Database disabled: searchShapes", query, userId);
        return [];
    }

    async deleteShape(id: number, userId: number) {
        console.log("Database disabled: deleteShape", id, userId);
        return null;
    }
}
