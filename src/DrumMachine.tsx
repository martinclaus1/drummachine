import React from 'react';
import './DrumMachine.scss';
import AudioEngine, { browserSupportsWebAudio } from './AudioEngine.js';
import { patterns } from './Patterns';

export default class DrumMachine extends React.Component {
  state: any = {
    poweredOn: false,
    loading: true,
    playing: false,
    startTime: 0,
    position: {},
  };
  audioEngine: AudioEngine | undefined;

  componentDidMount() {
    if (!browserSupportsWebAudio()) {
      return this.setState({
        loading: false,
        error: 'This browser does not support WebAudio. Try Edge, Firefox, Chrome or Safari.',
      });
    }
  }

  powerOn = () => {
    this.audioEngine = new AudioEngine({ onStep: this.onStep });
    this.audioEngine.prepare().then(() => {
      this.setState({ poweredOn: true }, () => {
        const randomIndex = Math.floor(Math.random() * patterns.length);
        this.selectPattern(randomIndex);
      });
    }, (error) => {
      this.setState({ error: true, loading: false });
    });
  };

  startClock = () => {
    this.audioEngine?.startClock(this.state.pattern?.beatsPerMinute);

    this.setState({ playing: true });
  };

  stopClock = () => {
    this.audioEngine?.stopClock();

    this.setState({ playing: false });
  };

  onStep = ({
    position,
  }: any) => {
    this.setState({ position });
  };

  selectPattern(index: number) {
    if (index < 0) index = patterns.length - 1;
    if (index >= patterns.length) index = 0;
    const pattern = patterns[index];
    if (this.state.playing) {
      this.stopClock();
    }
    this.setState({ pattern, patternIndex: index, loading: false });
    this.audioEngine?.setPattern(pattern);
  }

  nextPattern = () => {
    this.selectPattern(this.state.patternIndex! + 1);
  };

  previousPattern = () => {
    this.selectPattern(this.state.patternIndex! - 1);
  };

  render() {
    if (this.state.error) {
      return (
        <div className="DrumMachine__Error">
          {this.state.error}
        </div>
      );
    }

    if (!this.state.poweredOn) {
      return (
        <div className="DrumMachine">
          <div className="DrumMachine__GetStarted">
            <p>Welcome to drumbot</p>
            <button className="DrumMachine__StartStopButton" onClick={this.powerOn}>Start!</button>
          </div>
        </div>
      );
    }

    const { pattern, position } = this.state;

    return (
      <div className="DrumMachine">
        <div className="DrumMachine__TopPanel">
          <div className="DrumMachine__Logo">
            <div className="DrumMachine__Title">
              PR-606
            </div>
            <div className="DrumMachine__SubTitle">
              FORKABLE DRUM COMPUTER
            </div>
          </div>
          {this.state.poweredOn && (
            <>
              <div className="DrumMachine__PatternSelector">
                <div className="DrumMachine__PatternButton">
                  <button onClick={this.previousPattern}>&lt;</button>
                </div>
                <div className="DrumMachine__SelectedPattern">
                  {pattern?.name}
                </div>
                <div className="DrumMachine__PatternButton">
                  <button onClick={this.nextPattern}>&gt;</button>
                </div>
              </div>
              <div className="DrumMachine__Transport">
                <button disabled={this.state.playing} className="DrumMachine__StartStopButton" onClick={this.startClock}>Start</button>
                <button disabled={!this.state.playing} className="DrumMachine__StartStopButton" onClick={this.stopClock}>Stop</button>
              </div>
            </>
          )}
        </div>

        <div className="DrumMachine__Tracks">
          {pattern?.tracks.map((track: any, trackIndex: any) => (
            <div className="DrumMachine__Track" key={trackIndex}>
              <div className="DrumMachine__TrackLabel">{track.instrument}</div>
              <div className="DrumMachine__TrackSteps">
                {track.steps.map((trackStep: any, i: any) => (
                  <div className={`DrumMachine__Step DrumMachine__Step--${position?.step === i ? 'Active' : 'Inactive'} DrumMachine__Step--${trackStep ? 'On' : 'Off'}`} key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="DrumMachine__Footer">
          <div>
            Join the fun at
            {' '}
            <a href="https://noopschallenge.com">noopschallenge.com</a>
          </div>
          <div><a href="https://github.com/noops-challenge/drumbot">Fork me on GitHub</a></div>
        </div>
      </div>
    );
  }
}
