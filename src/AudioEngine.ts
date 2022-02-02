import { Pattern } from './Patterns';
import SoundPlayer from './SoundPlayer';

export interface Position {
  absolute: number;
  measure: number;
  step: number;
  time?: number;
  timing?: number;
}

const defaultPosition: Position = {
  absolute: -1,
  measure: -1,
  step: -1,
  time: -1,
};

const WebAudioCtor = window.AudioContext || window.webkitAudioContext;

const initializeFirstContext = (): AudioContext => {
  const desiredSampleRate = 44100;

  const context = new WebAudioCtor();

  // in iOS, need to set the sample rate after initializing a context
  // SEE: https://stackoverflow.com/questions/29901577/distorted-audio-in-ios-7-1-with-webaudio-api
  if (/(iPhone|iPad)/i.test(navigator.userAgent) && context.sampleRate !== desiredSampleRate) {
    const buffer = context.createBuffer(1, 1, desiredSampleRate);
    const dummy = context.createBufferSource();
    dummy.buffer = buffer;
    dummy.connect(context.destination);
    dummy.start(0);
    dummy.disconnect();

    context.close(); // dispose old context
    return new WebAudioCtor();
  }

  return context;
};

const leaderTime = 0.25;

export const browserSupportsWebAudio = () => !!WebAudioCtor;

type OnStep = (arg0: Position) => void;

export default class AudioEngine {
  position: Position;
  context: AudioContext;
  onStep: OnStep;
  soundPlayer: SoundPlayer;
  stepsPerSecond = 0;
  pattern?: Pattern;
  playing?: boolean;

  constructor(onStep: OnStep) {
    this.onStep = onStep;
    this.position = defaultPosition;
    this.context = initializeFirstContext();
    this.soundPlayer = new SoundPlayer();
  }

  prepare = () => this.soundPlayer.prepare(this.context);

  setPattern(pattern: Pattern) {
    this.pattern = pattern;
  }

  startClock = (beatsPerMinute: number) => {
    this.stepsPerSecond = (beatsPerMinute / 60) * 4;
    this.context = new WebAudioCtor();

    this.playing = true;
    this.scheduleSounds(this.getPosition(0));
    this.context.resume();

    this.onTick();
  };

  stopClock = () => {
    this.playing = false;
    this.position = defaultPosition;

    this.context.suspend();
    this.context.close();
  };

  onTick = () => {
    const currentStepAbsolute = this.getStepAbsolute(this.context.currentTime);
    if (currentStepAbsolute !== this.position.absolute) {
      this.setCurrentStepAbsolute(currentStepAbsolute);
    }
    if (this.playing) {
      requestAnimationFrame(this.onTick);
    } else {
      this.position = defaultPosition;
      this.onStep(this.position);
    }
  };

  getStepAbsolute(timing: number) {
    return Math.floor((timing - leaderTime) * this.stepsPerSecond);
  }

  setCurrentStepAbsolute(absoluteStepCount: number) {
    this.onStep(this.getPosition(absoluteStepCount));

    // schedule the sounds one beat ahead so the timing is exact
    this.scheduleSounds(this.getPosition(absoluteStepCount + 1));
  }

  getPosition(absoluteStepCount: number) {
    const stepCount = this.pattern?.stepCount ?? 0;
    return {
      measure: Math.floor(absoluteStepCount / stepCount),
      step: absoluteStepCount % stepCount,
      timing: absoluteStepCount / this.stepsPerSecond + leaderTime,
      absolute: absoluteStepCount,
    };
  }

  scheduleSounds = (position: Position) => {
    if (!this.playing) return;
    this.pattern?.tracks.forEach((track) => {
      if (track.steps[position.step]) {
        this.soundPlayer.play(this.context, track.instrument, position.timing ?? 0);
      }
    });
  };
}
