import * as React from 'react';
import AudioEngine, {browserSupportsWebAudio, Position} from './AudioEngine';
import {Pattern, patterns, Track} from './Patterns';
import {useStateIfMounted} from './UseStateIfMounted';
import {Card, Container, createStyles, LoadingOverlay, SimpleGrid, Title} from '@mantine/core';
import {useAsyncEffect} from './Async';
import {TopPanel} from './TopPanel';

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
        },

        trackSteps: {
            width: '100%',
            maxWidth: '100%',
            display: 'flex',
        },
        step: {
            margin: '1px',
            border: '1px solid #aaa',
            height: '20px',
            borderRadius: '10px',
            flex: '1 0',
            background: '#778ca3',
            transition: 'border-color 950ms ease-out, background-color 400ms ease-out',

            '@media (min-width: 600px)': {
                height: '50px',
                margin: '2px',
            }
        },
        stepOn: {
            ref: stepOn,
            background: '#45aaf2',
            border: '1px solid #bbbbbb',
            transition: 'background-color 500ms ease-out',
        },
        stepActive: {
            border: '1px solid #eb3b5a',
            background: '#a5b1c2',
            [`&.${stepOn}`]: {
                background: '#fed330',
                transition: 'background-color 10ms !important',
            }
        },
        title: {
            textTransform: 'capitalize',
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
    const [playing, setPlaying] = useStateIfMounted<boolean>(true);
    const [position, setPosition] = useStateIfMounted<Position>();
    const [error, setError] = useStateIfMounted<any>();
    const [audioEngine, setAudioEngine] = useStateIfMounted<AudioEngine>();
    const [pattern, setPattern] = useStateIfMounted<Pattern>();
    const [selectedPattern, setSelectedPattern] = useStateIfMounted<string>('');
    const [selectablePatterns, setSelectablePatterns] = useStateIfMounted<SelectablePattern[]>([]);

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
            setLoading(false);
        }

        const selectablePatterns = patterns.map((pattern) => ({label: pattern.name, value: pattern.name}));
        setSelectablePatterns(selectablePatterns);
    }, []);

    React.useEffect(() => {
        if (audioEngine && selectablePatterns.length > 0) {
            const randomIndex = Math.floor(Math.random() * selectablePatterns.length);
            setSelectedPattern(selectablePatterns[randomIndex].value);
        }
        setLoading(false);
    }, [audioEngine, selectablePatterns]);

    React.useEffect(() => {
        if (selectedPattern) {
            const pattern = patterns.find((pattern) => pattern.name === selectedPattern)!;
            if (playing) {
                stopClock();
            }
            setPattern(pattern);
            audioEngine?.setPattern(pattern);
        }
    }, [selectedPattern]);

    const startClock = () => {
        audioEngine?.startClock(pattern?.beatsPerMinute ?? 0);

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
        return <div className="drum-machine__Error">{error}</div>;
    }

    const tracks = pattern?.tracks.map((track: Track, trackIndex: number) => (
            <TrackComponent track={track}
                            currentStep={position?.step}
                            key={trackIndex}/>));
    return (
            <Container>
                <Card shadow="sm" padding="sm" className={classes.drumMachine}>
                    <LoadingOverlay visible={loading}/>
                    {!loading && (
                            <>
                                <TopPanel
                                        playing={playing}
                                        startClock={startClock}
                                        stopClock={stopClock}
                                        onChange={setSelectedPattern}
                                        pattern={selectedPattern}
                                        patterns={selectablePatterns}/>
                                <SimpleGrid spacing="xs">
                                    {tracks}
                                </SimpleGrid>
                            </>
                    )}
                </Card>
            </Container>
    );
};

interface TrackComponentProps {
    track: Track;
    currentStep?: number;
}

const TrackComponent: React.FC<TrackComponentProps> = ({track, currentStep}) => {
    const {classes} = useStyles();
    const steps = track.steps.map((trackStep, index) => (
            <StepComponent currentStep={currentStep}
                           enabled={trackStep !== 0}
                           stepIndex={index}
                           key={index}/>));

    return (
            <Card padding="xs" shadow="sm" withBorder>
                <Title order={3} className={classes.title}>
                    {track.instrument}
                </Title>
                <div className={classes.trackSteps}>
                    {steps}
                </div>
            </Card>
    );
};

interface StepComponentProps {
    enabled: boolean;
    currentStep?: number;
    stepIndex: number;
}

const StepComponent: React.FC<StepComponentProps> = ({enabled, currentStep, stepIndex}) => {
    const {classes} = useStyles();

    return <div
            className={`${classes.step} ${currentStep === stepIndex ? classes.stepActive : 'Inactive'} ${
                    enabled ? classes.stepOn : 'Off'
            }`}
    />;
};

export default DrumMachine;
