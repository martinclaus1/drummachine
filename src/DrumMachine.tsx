import * as React from 'react';
import AudioEngine, {browserSupportsWebAudio, Position} from './AudioEngine';
import {Pattern, patterns, Track} from './Patterns';
import {useStateIfMounted} from './UseStateIfMounted';
import {Card, Container, createStyles, LoadingOverlay, SimpleGrid} from '@mantine/core';
import {useAsyncEffect} from './Async';
import {TopPanel} from './TopPanel';
import TrackComponent from './TrackComponent';

const useStyles = createStyles(() => {
    return ({
        drumMachine: {
            position: 'relative',
            '@media (min-width: 600px)': {
                minHeight: '600px',
            }
        }
    });
});

const DrumMachine: React.FC = () => {
    const {classes} = useStyles();
    const [loading, setLoading] = useStateIfMounted<boolean>(true);
    const [error, setError] = useStateIfMounted<any>();

    const [audioEngine, setAudioEngine] = useStateIfMounted<AudioEngine>();
    const [position, setPosition] = useStateIfMounted<Position>();
    const [playing, setPlaying] = useStateIfMounted<boolean>(false);
    const [selectedPattern, setSelectedPattern] = useStateIfMounted<string>();
    const [beatsPerMinute, setBeatsPerMinute] = useStateIfMounted<number>();
    const [tracks, setTracks] = useStateIfMounted<Track[]>();

    const selectablePatterns = patterns.map((pattern) => ({label: pattern.name, value: pattern.name}));

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

    const handlePatternSelection = (value: string) => {
        const pattern = patterns.find((pattern) => pattern.name === value)!;
        const clonedPattern = JSON.parse(JSON.stringify(pattern)) as Pattern;

        if (playing) {
            stopClock();
        }

        setBeatsPerMinute(clonedPattern.beatsPerMinute);
        setSelectedPattern(value);
        setTracks(clonedPattern.tracks);
        audioEngine?.initialize(pattern);
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

    const mappedTracks = tracks?.map((track: Track, trackIndex: number) => (
        <TrackComponent track={track}
                        currentStep={position?.step}
                        trackChangeHandler={(stepIndex) => handleTrackChange(trackIndex, stepIndex)}
                        key={trackIndex}/>));
    return (
        <Container p={0}>
            <Card shadow="sm" p="sm" className={classes.drumMachine}>
                <LoadingOverlay visible={loading}/>
                {!loading && (
                    <>
                        <TopPanel
                            playing={playing}
                            selectedPattern={selectedPattern}
                            selectablePatterns={selectablePatterns}
                            beatsPerMinute={beatsPerMinute}
                            startClickHandler={startClock}
                            stopClickHandler={stopClock}
                            patternChangeHandler={handlePatternSelection}
                            beatsPerMinuteChangeHandler={handleBeatsPerMinuteChange}/>
                        <SimpleGrid spacing="xs">
                            {mappedTracks}
                        </SimpleGrid>
                    </>
                )}
            </Card>
        </Container>
    );
};

export default DrumMachine;
