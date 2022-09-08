import * as React from 'react';
import AudioEngine, {browserSupportsWebAudio} from './audioEngine/AudioEngine';
import {Pattern, patterns, Track} from './Patterns';
import {useStateIfMounted} from './helpers/UseStateIfMounted';
import {Card, Container, createStyles, LoadingOverlay, Stack} from '@mantine/core';
import {useAsyncEffect} from './helpers/Async';
import {TopPanel} from './TopPanel';
import {TracksComponent} from './TracksComponent';

const useStyles = createStyles(() => {
    return ({
        drumMachine: {
            position: 'relative',
        }
    });
});

const DrumMachine: React.FC = () => {
    const {classes} = useStyles();
    const [loading, setLoading] = useStateIfMounted<boolean>(true);
    const [error, setError] = useStateIfMounted<any>();

    const [audioEngine, setAudioEngine] = useStateIfMounted<AudioEngine>();
    const [playing, setPlaying] = useStateIfMounted<boolean>(false);
    const [selectedPattern, setSelectedPattern] = useStateIfMounted<string>();
    const [stepCount, setStepCount] = useStateIfMounted<number>(0);
    const [beatsPerMinute, setBeatsPerMinute] = useStateIfMounted<number>();
    const [tracks, setTracks] = useStateIfMounted<Track[]>();

    useAsyncEffect(async () => {
        if (!browserSupportsWebAudio()) {
            setLoading(false);
            setError('This browser does not support WebAudio. Try Edge, Firefox, Chrome or Safari.');
        }

        const audioEngine = new AudioEngine();
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

    const startClock = () => {
        audioEngine?.startClock();
        setPlaying(true);
    };

    const stopClock = () => {
        audioEngine?.stopClock();
        setPlaying(false);
    };

    const handlePatternSelection = (value: string) => {
        const pattern = patterns.find((pattern) => pattern.name === value);
        if (pattern) {
            const clonedPattern = JSON.parse(JSON.stringify(pattern)) as Pattern;

            if (playing) {
                stopClock();
            }

            setBeatsPerMinute(clonedPattern.beatsPerMinute);
            setStepCount(clonedPattern.stepCount);
            setSelectedPattern(value);
            setTracks(clonedPattern.tracks);
            audioEngine?.initialize(pattern);
        }
    };

    const handleBeatsPerMinuteChange = (beatsPerMinute: number) => {
        setBeatsPerMinute(beatsPerMinute);
        if (audioEngine) {
            audioEngine.beatsPerMinute = beatsPerMinute;
        }
    };

    const handleTrackChange = (trackIndex: number, newSteps: number[]) => {
        if (tracks) {
            const newTracks = [...tracks];
            newTracks[trackIndex].steps = newSteps;
            setTracks(newTracks);

            if (audioEngine) {
                audioEngine.tracks = newTracks;
            }
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return <Container p={0}>
        <LoadingOverlay visible={loading} />
        <Stack>
            <Card shadow="xs" p="sm" withBorder>
                <TopPanel
                    playing={playing}
                    selectedPattern={selectedPattern}
                    beatsPerMinute={beatsPerMinute}
                    startClickHandler={startClock}
                    stopClickHandler={stopClock}
                    patternChangeHandler={handlePatternSelection}
                    beatsPerMinuteChangeHandler={handleBeatsPerMinuteChange}/>
            </Card>
            <Card shadow="xs" p="sm" className={classes.drumMachine} withBorder>
                <TracksComponent playing={playing}
                                 tracks={tracks}
                                 handleTrackChange={handleTrackChange}
                                 audioEngine={audioEngine}
                                 stepCount={stepCount}/>
            </Card>
        </Stack>
    </Container>;
};

export default DrumMachine;
