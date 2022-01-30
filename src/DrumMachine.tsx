import React from 'react';
import './DrumMachine.scss';
import AudioEngine, { browserSupportsWebAudio, Position } from './AudioEngine';
import { Pattern, patterns, Track } from './Patterns';
import { useStateIfMounted } from './UseStateIfMounted';
import { LoadingOverlay } from '@mantine/core';
import { useAsyncEffect } from './Async';

const DrumMachine: React.FC = () => {
  const [loading, setLoading] = useStateIfMounted<boolean>(true);
  const [playing, setPlaying] = useStateIfMounted<boolean>(true);
  const [position, setPosition] = useStateIfMounted<Position>();
  const [error, setError] = useStateIfMounted<any>();
  const [audioEngine, setAudioEngine] = useStateIfMounted<AudioEngine>();
  const [patternIndex, setPatternIndex] = useStateIfMounted<number>();
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
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (audioEngine) {
      const randomIndex = Math.floor(Math.random() * patterns.length);
      selectPattern(randomIndex);
    }
    setLoading(false);
  }, [audioEngine]);

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

  const selectPattern = (index: number) => {
    if (index < 0) index = patterns.length - 1;
    if (index >= patterns.length) index = 0;
    const pattern = patterns[index];
    if (playing) {
      stopClock();
    }
    setPattern(pattern);
    setPatternIndex(index);
    audioEngine?.setPattern(pattern);
  };

  const nextPattern = () => {
    selectPattern((patternIndex ?? 0) + 1);
  };

  const previousPattern = () => {
    selectPattern((patternIndex ?? 0) - 1);
  };

  if (error) {
    return <div className="drum-machine__Error">{error}</div>;
  }

  return (
    <div className="drum-machine">
      <LoadingOverlay visible={loading} />
      {!loading && (
        <>
          <div className="drum-machine__TopPanel">
            <>
              <div className="drum-machine__PatternSelector">
                <div className="drum-machine__PatternButton">
                  <button onClick={previousPattern}>&lt;</button>
                </div>
                <div className="drum-machine__SelectedPattern">{pattern?.name}</div>
                <div className="drum-machine__PatternButton">
                  <button onClick={nextPattern}>&gt;</button>
                </div>
              </div>
              <div className="drum-machine__Transport">
                <button disabled={playing} className="drum-machine__StartStopButton" onClick={startClock}>
                  Start
                </button>
                <button disabled={!playing} className="drum-machine__StartStopButton" onClick={stopClock}>
                  Stop
                </button>
              </div>
            </>
          </div>

          <div className="drum-machine__Tracks">
            {pattern?.tracks.map((track: Track, trackIndex: number) => (
              <div className="drum-machine__Track" key={trackIndex}>
                <div className="drum-machine__TrackLabel">{track.instrument}</div>
                <div className="drum-machine__TrackSteps">
                  {track.steps.map((trackStep, i) => (
                    <div
                      className={`drum-machine__Step drum-machine__Step--${position?.step === i ? 'Active' : 'Inactive'} drum-machine__Step--${
                        trackStep ? 'On' : 'Off'
                      }`}
                      key={i}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DrumMachine;
