"use client";

import React, { useState } from 'react';
import { useTabEditorStore } from '@/stores/tab-editor-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function SetupDialog() {
    const isSetup = useTabEditorStore((state) => state.isSetup);
    const setGlobalSettings = useTabEditorStore((state) => state.setGlobalSettings);

    const [bpm, setBpm] = useState(120);
    const [numerator, setNumerator] = useState(4);
    const [denominator, setDenominator] = useState(4);

    const handleStart = () => {
        setGlobalSettings(bpm, [numerator, denominator]);
    };

    return (
        <Dialog open={!isSetup}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Configurar Novo Card</DialogTitle>
                    <DialogDescription>
                        Defina o andamento e compasso base para começar a editar seu card de tablatura.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bpm" className="text-right">
                            BPM
                        </Label>
                        <Input
                            id="bpm"
                            type="number"
                            value={bpm}
                            onChange={(e) => setBpm(parseInt(e.target.value))}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="timeSig" className="text-right">
                            Compasso
                        </Label>
                        <div className="col-span-3 flex items-center gap-2">
                            <Select
                                value={numerator.toString()}
                                onValueChange={(v) => setNumerator(parseInt(v))}
                            >
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue placeholder="4" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[2, 3, 4, 5, 6, 7, 8, 9, 12].map((n) => (
                                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <span className="text-xl">/</span>
                            <Select
                                value={denominator.toString()}
                                onValueChange={(v) => setDenominator(parseInt(v))}
                            >
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue placeholder="4" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[2, 4, 8, 16].map((n) => (
                                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleStart}>Começar Edição</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
