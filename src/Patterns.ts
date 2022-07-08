import rawPatterns from './rawPatterns.json';

export type Instrument = 'snare' | 'clap' | 'cowbell' | 'kick' | 'hihat' | 'ride' | 'rim';

export interface Track {
    instrument: Instrument;
    steps: Array<number>;
}

export interface Pattern {
    name: string;
    stepCount: number;
    beatsPerMinute: number;
    tracks: Track[];
}

export const patterns = rawPatterns.items as Array<Pattern>;
