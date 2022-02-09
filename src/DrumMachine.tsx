import * as React from 'react';
import AudioEngine, {browserSupportsWebAudio, Position} from './AudioEngine';
import {Pattern, patterns, Track} from './Patterns';
import {useStateIfMounted} from './UseStateIfMounted';
import {Card, Container, createStyles, LoadingOverlay, SimpleGrid} from '@mantine/core';
import {useAsyncEffect} from './Async';
import {TopPanel} from './TopPanel';
import TrackComponent from './TrackComponent';

const useStyles = createStyles((theme, _params, getRef) => {
    const stepOn = getRef('stepOn');

    return ({
        drumMachine: {
            position: 'relative',
            '@media (min-width: 600px)': {
                minHeight: '600px',
            }
        },
        topPanel: {
            '& > *': {
                marginRight: theme.spacing.sm,
            },
            padding: 0,
            marginBottom: theme.spacing.md,
            display: 'flex',
            alignItems: 'flex-end',
        }
    });
});

export interface SelectablePattern {
    value: string;
    label: string;
}

const DrumMachine: React.FC = () => {
    const {classes} = useStyles();
    const [loading, setLoading] = useStateIfMounted<boolean>(true);
    const [playing, setPlaying] = useStateIfMounted<boolean>(false);
    const [position, setPosition] = useStateIfMounted<Position>();
    const [error, setError] = useStateIfMounted<any>();
    const [audioEngine, setAudioEngine] = useStateIfMounted<AudioEngine>();
    const [pattern, setPattern] = useStateIfMounted<Pattern>();

    useAsyncEffect(async () => {
        if (!browserSupportsWebAudio()) {
            setLoading(false);
            setError('This browser does not support WebAudio. Try Edge, Firefox, Chrome or Safari.');
        }

        const audioEngine = new AudioEngine(onStep);
        setAudioEngine(audioEngine);
        try {
            await audioEngine?.prepare();
        } catch (error) {
            setError(true);
        }

        setLoading(false);
    }, []);

    React.useEffect(() => {
        if (audioEngine) {
            handlePatternSelection(patterns[0]);
        }
    }, [audioEngine]);

    const handlePatternSelection = (pattern: Pattern) => {
        if (playing) {
            stopClock();
        }
        const clonedPattern = JSON.parse(JSON.stringify(pattern)) as Pattern;
        setPattern(clonedPattern);
        audioEngine?.setPattern(clonedPattern);
    };

    const handleBeatsPerMinuteChange = (beatsPerMinute: number) => {
        audioEngine?.setBeatsPerMinute(beatsPerMinute)
    }

    const startClock = () => {
        audioEngine?.startClock();
        setPlaying(true);
    };

    const stopClock = () => {
        audioEngine?.stopClock();
        setPlaying(false);
    };

    const onStep = (position: Position) => {
        setPosition(position);
    };

    if (error) {
        return <div>{error}</div>;
    }

    const handleTrackChange = (trackIndex: number, stepIndex: number) => {
        if (pattern) {
            const newPattern = {...pattern};
            newPattern.tracks[trackIndex].steps[stepIndex] = newPattern.tracks[trackIndex].steps[stepIndex] === 0 ? 1 : 0;
            audioEngine?.setPattern(pattern);
            setPattern(newPattern);
        }
    };

    const tracks = pattern?.tracks.map((track: Track, trackIndex: number) => (
            <TrackComponent track={track}
                            currentStep={position?.step}
                            trackChangeHandler={(stepIndex) => handleTrackChange(trackIndex, stepIndex)}
                            key={trackIndex}/>));
    return (
            <Container padding={0}>
                <Card shadow="sm" padding="sm" className={classes.drumMachine}>
                    <LoadingOverlay visible={loading}/>
                    {!loading && pattern && (
                            <>
                                <TopPanel
                                        playing={playing}
                                        startClickHandler={startClock}
                                        stopClickHandler={stopClock}
                                        patternChangeHandler={handlePatternSelection}
                                        beatsPerMinuteChangeHandler={handleBeatsPerMinuteChange}
                                        pattern={pattern}
                                        patterns={patterns}/>
                                <SimpleGrid spacing="xs">
                                    {tracks}
                                </SimpleGrid>
                            </>
                    )}
                </Card>
            </Container>
    );
};

export default DrumMachine;
