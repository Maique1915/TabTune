"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { VexFlowScoreIcon } from "@/components/tab-editor/VexFlowScoreIcon";
import type { SymbolClip } from "@/modules/studio/domain/types";

interface ScoreEditorProps {
    clip: SymbolClip | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (clipId: string, newVexFlowProps: any) => void;
}

export function ScoreEditor({ clip, open, onOpenChange, onSave }: ScoreEditorProps) {
    const [notes, setNotes] = useState("c/4, d/4, e/4, f/4");
    const [duration, setDuration] = useState("q");
    const [clef, setClef] = useState("treble");
    const [staveWidth, setStaveWidth] = useState(200);

    useEffect(() => {
        if (clip) {
            const props = clip.vexFlowProps || {};
            setNotes(Array.isArray(props.notes) ? props.notes.join(", ") : "c/4, d/4, e/4, f/4");
            setDuration(props.duration || "q");
            setClef(props.clef || "treble");
            setStaveWidth(props.staveWidth || 200);
        }
    }, [clip]);

    const handleSave = () => {
        if (!clip) return;

        // Parse notes string to array
        const notesArray = notes.split(",").map(n => n.trim()).filter(n => n.length > 0);

        const newProps = {
            ...clip.vexFlowProps,
            notes: notesArray,
            duration,
            clef,
            staveWidth,
        };

        onSave(clip.id, newProps);
        onOpenChange(false);
    };

    if (!clip) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-[#1a1b26] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Editar Partitura</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                            Notas
                        </Label>
                        <Input
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="col-span-3 bg-black/20 border-white/10"
                            placeholder="Ex: c/4, d/4, e/4"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">
                            Duração
                        </Label>
                        <Select value={duration} onValueChange={setDuration}>
                            <SelectTrigger className="col-span-3 bg-black/20 border-white/10">
                                <SelectValue placeholder="Selecione a duração" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="w">Semibreve (Whole)</SelectItem>
                                <SelectItem value="h">Mínima (Half)</SelectItem>
                                <SelectItem value="q">Semínima (Quarter)</SelectItem>
                                <SelectItem value="8">Colcheia (8th)</SelectItem>
                                <SelectItem value="16">Semicolcheia (16th)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="clef" className="text-right">
                            Clave
                        </Label>
                        <Select value={clef} onValueChange={setClef}>
                            <SelectTrigger className="col-span-3 bg-black/20 border-white/10">
                                <SelectValue placeholder="Selecione a clave" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="treble">Sol (Treble)</SelectItem>
                                <SelectItem value="bass">Fá (Bass)</SelectItem>
                                <SelectItem value="alto">Dó (Alto)</SelectItem>
                                <SelectItem value="tab">Tablatura</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="width" className="text-right">
                            Largura
                        </Label>
                        <Input
                            id="width"
                            type="number"
                            value={staveWidth}
                            onChange={(e) => setStaveWidth(Number(e.target.value))}
                            className="col-span-3 bg-black/20 border-white/10"
                        />
                    </div>
                </div>

                {/* Preview */}
                <div className="border border-white/10 rounded-md p-4 bg-white/5 flex justify-center min-h-[150px] items-center overflow-auto">
                    <VexFlowScoreIcon
                        width={Math.max(400, staveWidth + 50)}
                        height={150}
                        staveWidth={staveWidth}
                        clef={clef}
                        timeSignature="4/4"
                        notes={notes.split(",").map(n => n.trim()).filter(n => n)}
                        duration={duration}
                        isRest={clef === 'tab'} // Adjusted based on VexFlowScoreIcon props
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700">
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
