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
            display: 'grid',
            gridAutoFlow: 'column',
            gridColumnGap: '1%'
        },
        step: {
            aspectRatio: '1',
            label: 'step',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.colors.gray[5],
            borderRadius: '20%',
            background: theme.colors.gray[4],
            transition: 'border-color 950ms ease-out, background-color 400ms ease-out',
        },
        stepOn: {
            label: 'stepOn',
            ref: stepOn,
            background: theme.colors.blue[4],
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.colors.gray[5],
            transition: 'background-color 500ms ease-out',
        },
        stepActive: {
            label: 'stepActive',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme.colors.red[5],
            background: theme.colors.gray[6],
            [`&.${stepOn}`]: {
                background: theme.colors.yellow[4],
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
            handlePatternSelection(patterns[0].name);
        }
    }, [audioEngine]);

    const handlePatternSelection = (value: string) => {
        const pattern = patterns.find((pattern) => pattern.name === value)!;
        if (playing) {
            stopClock();
        }
        setPattern(JSON.parse(JSON.stringify(pattern)) as Pattern);
        audioEngine?.setPattern(pattern);
    };

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
                    {!loading && (
                            <>
                                <TopPanel
                                        playing={playing}
                                        startClickHandler={startClock}
                                        stopClickHandler={stopClock}
                                        patternChangeHandler={handlePatternSelection}
                                        initialPattern={pattern?.name}
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

interface TrackComponentProps {
    track: Track;
    currentStep?: number;
    trackChangeHandler: (stepIndex: number) => void;
}

const TrackComponent: React.FC<TrackComponentProps> = ({track, currentStep, trackChangeHandler}) => {
    const {classes} = useStyles();
    const steps = track.steps.map((trackStep, index) => (
            <StepComponent currentStep={currentStep}
                           enabled={trackStep !== 0}
                           stepIndex={index}
                           stepChangeHandler={() => trackChangeHandler(index)}
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
    stepChangeHandler: () => void,
}

const StepComponent: React.FC<StepComponentProps> = ({enabled, currentStep, stepIndex, stepChangeHandler}) => {
    const {classes} = useStyles();

    const className = `${classes.step} ${currentStep === stepIndex ? classes.stepActive : 'Inactive'} ${
            enabled ? classes.stepOn : 'Off'
    }`;

    return <div className={className} onClick={stepChangeHandler}/>;
};

export default DrumMachine;
