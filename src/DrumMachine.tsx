import * as React from 'react';
import {useRef} from 'react';
import AudioEngine, {browserSupportsWebAudio, Position} from './audioEngine/AudioEngine';
import {Pattern, patterns, Track} from './Patterns';
import {useStateIfMounted} from './helpers/UseStateIfMounted';
import {Card, Container, createStyles, LoadingOverlay, SimpleGrid} from '@mantine/core';
import {useAsyncEffect} from './helpers/Async';
import {TopPanel} from './TopPanel';
import TrackComponent, {stepStyles} from './TrackComponent';

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
    const stepActive = stepStyles().classes.stepActive;
    const {classes} = useStyles();
    const stepRefs = useRef<Array<Array<HTMLDivElement | null>>>([]);
    const [loading, setLoading] = useStateIfMounted<boolean>(true);
    const [error, setError] = useStateIfMounted<any>();

    const [audioEngine, setAudioEngine] = useStateIfMounted<AudioEngine>();
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

        stepRefs.current.forEach((tracks) => {
            tracks.forEach(step => step?.classList.remove(stepActive));
        });
    };

    const onStep = (position: Position) => {
        stepRefs.current.forEach((tracks) => {
            tracks.at(position.step - 1)?.classList.remove(stepActive);
            tracks[position.step]?.classList.add(stepActive);
        });
    };

    const handlePatternSelection = (value: string) => {
        const pattern = patterns.find((pattern) => pattern.name === value);
        if (pattern) {
            const clonedPattern = JSON.parse(JSON.stringify(pattern)) as Pattern;

            if (playing) {
                stopClock();
            }

            setBeatsPerMinute(clonedPattern.beatsPerMinute);
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

    const mappedTracks = tracks?.map((track: Track, trackIndex: number) => {
        stepRefs.current[trackIndex] = [];
        return <TrackComponent track={track}
                               trackRefs={stepRefs.current[trackIndex]}
                               trackChangeHandler={(stepIndex) => handleTrackChange(trackIndex, stepIndex)}
                               key={trackIndex}/>;
    });

    if (error) {
        return <div>{error}</div>;
    }

    return <Container p={0}>
        <Card shadow="sm" p="sm" className={classes.drumMachine}>
            <LoadingOverlay visible={loading}/>
            {!loading && <>
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
            </>}
        </Card>
    </Container>;
};

export default DrumMachine;
