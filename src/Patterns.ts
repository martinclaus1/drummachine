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

export const patterns: Array<Pattern> = [
    // { "name": "oontza" },
    // { "name": "bossanoopa" },
    {
        name: 'nipnop',
        stepCount: 16,
        beatsPerMinute: 92,
        tracks: [
            {
                instrument: 'snare',
                steps: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            },
            {
                instrument: 'clap',
                steps: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            },
            {
                instrument: 'cowbell',
                steps: [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            },
            {
                instrument: 'kick',
                steps: [1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            },
        ],
    },
    {
        name: 'triplet template',
        stepCount: 12,
        beatsPerMinute: 70,
        tracks: [
            {
                instrument: 'hihat',
                steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                instrument: 'ride',
                steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                instrument: 'snare',
                steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                instrument: 'rim',
                steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                instrument: 'clap',
                steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                instrument: 'cowbell',
                steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                instrument: 'kick',
                steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
        ],
    },
    {
        name: 'shuffle',
        stepCount: 12,
        beatsPerMinute: 80,
        tracks: [
            {
                instrument: 'hihat',
                steps: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
            },
            {
                instrument: 'snare',
                steps: [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
            },
            {
                instrument: 'kick',
                steps: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            },
        ],
    },
    // should be hihat foot machine
    {
        name: 'bossanova',
        stepCount: 16,
        beatsPerMinute: 60,
        tracks: [
            {
                instrument: 'hihat',
                steps: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
            },
            {
                instrument: 'snare',
                steps: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            },
            {
                instrument: 'kick',
                steps: [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
            },
        ],
    },
    // { "name": "botthisway" },
    // { "name": "funkee" },
    // { "name": "shlojam" },
    // { "name": "botorik" },
    // { "name": "swoop" },
    // { "name": "schmaltz" },
    // { "name": "bouncy" }
];
