import type { StandardPosition } from "@/modules/core/domain/types";

export const getFinNum = (f: any) => (f === 'T' ? 0 : Number(f) || 1);

export function areFingersIdentical(a: StandardPosition[], b: StandardPosition[]): boolean {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i].fret !== b[i].fret ||
            a[i].string !== b[i].string ||
            a[i].endString !== b[i].endString) {
            return false;
        }

        const fingerA = a[i].finger === 'T' ? 0 : (Number(a[i].finger) || 1);
        const fingerB = b[i].finger === 'T' ? 0 : (Number(b[i].finger) || 1);
        if (fingerA !== fingerB) return false;
    }

    return true;
}
