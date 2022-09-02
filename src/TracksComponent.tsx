import AudioEngine, {Position} from './audioEngine/AudioEngine';
import {Track} from './Patterns';
import * as React from 'react';
import {useRef} from 'react';
import {createStyles, SimpleGrid} from '@mantine/core';
import TrackComponent from './TrackComponent';
import {stepStyles} from './StepComponent';

interface TrackStyleProps {
    stepCount: number;
}

const trackStyles = createStyles((theme, {stepCount}: TrackStyleProps) => {
    const stepColumns = `repeat(${stepCount}, minmax(auto, 40px))`;
    return ({
        track: {
            label: 'steps',
            display: 'grid',
            gridColumnGap: '1%',
            marginTop: theme.spacing.sm,
            gridTemplateColumns: `100px ${stepColumns}`,

            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                gridTemplateColumns: stepColumns,
            },
        },
        title: {
            label: 'title',
            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                gridColumn: `1/-1`,
            },
            textTransform: 'capitalize'
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

export const TracksComponent: React.FC<TracksComponentProps> =
    ({
         tracks,
         handleTrackChange,
         audioEngine,
         playing,
         stepCount
     }) => {
        const stepRefs = useRef<Array<Array<HTMLDivElement | null>>>([]);
        const stepActive = stepStyles().classes.stepActive;
        const {classes} = trackStyles({stepCount});

        React.useEffect(() => {
            if (audioEngine) {
                audioEngine.onStep = onStep;
            }
        }, [audioEngine]);

        React.useEffect(() => {
            if (!playing) {
                stepRefs.current.forEach((tracks) => {
                    tracks.forEach(step => step?.classList.remove(stepActive));
                });
            }
        }, [playing]);

        const onStep = (position: Position) => {
            stepRefs.current.forEach((tracks) => {
                tracks.at(position.step - 1)?.classList.remove(stepActive);
                tracks[position.step]?.classList.add(stepActive);
            });
        };

        const mappedTracks = tracks?.map((track: Track, trackIndex: number) => {
            stepRefs.current[trackIndex] = [];
            return <TrackComponent track={track}
                                   trackRefs={stepRefs.current[trackIndex]}
                                   trackChangeHandler={(stepIndex) => handleTrackChange(trackIndex, stepIndex)}
                                   key={trackIndex}
                                   titleClass={classes.title}/>;
        });

        return <SimpleGrid spacing="xs" className={classes.track}>
            {mappedTracks}
        </SimpleGrid>;
    };