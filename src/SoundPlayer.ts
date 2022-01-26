import SamplePlayer from './SamplePlayer';

const samples = [
  'clap',
  'cowbell',
  'kick',
  'snare',
  'hihat',
  'ride',
  'rim'
];

export default class SoundPlayer {
  instruments: Record<string, SamplePlayer>;
  constructor() {
    this.instruments = {};
  }

  prepare = (context: AudioContext) => {
    return Promise.all(samples.map(sample => this.loadSample(context, sample)))
  }

  // rework to async await
  loadSample = async (context: AudioContext, instrument: string) => {
    const url = `./samples/${instrument}.wav`;
    const data = await fetch(url).then(response => response.arrayBuffer());
    const decodedAudio = await context.decodeAudioData(data);
    this.instruments[instrument] = new SamplePlayer(decodedAudio);
  }

  play(context: AudioContext, instrument: string, timing: number) {
    const player = this.instruments[instrument];
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0.1, timing);
    gainNode.connect(context.destination);

    if (player) player.play(context, timing, gainNode);
  }
}
