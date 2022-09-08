import AudioEngine, {Position} from './audioEngine/AudioEngine';
import {Track} from './Patterns';
import * as React from 'react';
import {RefObject, useRef} from 'react';
import {createStyles} from '@mantine/core';
import TrackComponent from './TrackComponent';
import {stepStyles} from './StepComponent';

interface TrackStyleProps {
    stepCount: number;
}

const trackStyles = createStyles((theme, {stepCount}: TrackStyleProps) => {
    const stepColumns = `repeat(${stepCount}, minmax(auto, 40px))`;
    return ({
        tracks: {
            label: 'tracks',
            display: 'grid',
            gridGap: theme.spacing.xs,
            gridTemplateColumns: `100px ${stepColumns}`,

            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                gridTemplateColumns: stepColumns,
            },
        },
    });
});

interface TracksComponentProps {
    playing: boolean,
    audioEngine: AudioEngine | undefined,
    tracks: Array<Track> | undefined,
    handleTrackChange: (trackIndex: number, newSteps: number[]) => void,
    stepCount: number,
}

export const TracksComponent: React.FC<TracksComponentProps> = props => {
    const {tracks, handleTrackChange, audioEngine, playing, stepCount} = props;

    const trackRefs = useRef<Array<Array<RefObject<HTMLDivElement> | null>>>([]);
    const stepActive = stepStyles().classes.stepActive;
    const {classes} = trackStyles({stepCount});

    React.useEffect(() => {
        if (audioEngine) {
            audioEngine.onStep = onStep;
        }
    }, [audioEngine, stepActive]);

    React.useEffect(() => {
        if (!playing) {
            trackRefs.current.forEach((tracks) => {
                tracks.forEach(step => step?.current?.classList.remove(stepActive));
            });
        }
    }, [playing]);

    const onStep = (position: Position) => {
        trackRefs.current.forEach((tracks) => {
            tracks.at(position.step - 1)?.current?.classList.remove(stepActive);
            tracks[position.step]?.current?.classList.add(stepActive);
        });
    };

    const mappedTracks = tracks?.map((track: Track, trackIndex: number) => {
        trackRefs.current[trackIndex] = [];
        return <TrackComponent key={`track_${trackIndex}`}
                               trackIndex={trackIndex}
                               track={track}
                               stepRefs={trackRefs.current[trackIndex]}
                               trackChangeHandler={(stepIndex) => handleTrackChange(trackIndex, stepIndex)}/>;
    });

    return <div className={classes.tracks}>
        {mappedTracks}
    </div>;
};