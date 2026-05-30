import type { Point } from "./types";


export type PatternGenerator = (
    width: number,
    height: number
) => Point[];

export const shatterPatterns = {
    radial(width: number, height: number): Point[] {
        return [
            [0, 0],
            [width * 0.5, 0],
            [width, 0],
            [width, height * 0.5],
            [width, height],
            [width * 0.5, height],
            [0, height],
            [0, height * 0.5],
        ];
    },

    irregular(width: number, height: number): Point[] {
        return [
            [0, 0],

            [width * 0.22, height * 0.05],
            [width * 0.48, 0],
            [width * 0.75, height * 0.08],

            [width, 0],
            [width * 0.92, height * 0.32],
            [width, height * 0.55],

            [width * 0.88, height * 0.82],
            [width, height],

            [width * 0.68, height * 0.92],
            [width * 0.42, height],

            [width * 0.18, height * 0.9],
            [0, height],

            [width * 0.06, height * 0.65],
            [0, height * 0.38],
        ];
    },

    diagonal(width: number, height: number): Point[] {
        return [
            [0, 0],

            [width * 0.35, 0],
            [width * 0.6, height * 0.05],

            [width, 0],
            [width, height * 0.25],

            [width * 0.85, height * 0.45],
            [width, height * 0.7],

            [width * 0.7, height],
            [width * 0.4, height],

            [width * 0.15, height * 0.9],
            [0, height],

            [0, height * 0.6],
            [width * 0.12, height * 0.3],
        ];
    },
};