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
    // load all samples
    return Promise.all(samples.map(sample => this.loadSample(context, sample)))
  }

  // rework to async await
  loadSample = (context: AudioContext, instrument: string) => {
    const url = `./samples/${instrument}.wav`;
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();

      request.open('GET', url, true);

      request.responseType = 'arraybuffer';

      request.onload =  () => {
        const audioData = request.response;

        context.decodeAudioData(audioData, (buffer) => {
          this.instruments[instrument] = new SamplePlayer(buffer);
          resolve(undefined);
        }, reject);
      };

      request.send();
    });
  }

  play({
    context,
    instrument,
    timing
  }: {context: AudioContext, instrument: string, timing: number}) {
    const player = this.instruments[instrument];
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0.1, timing);
    gainNode.connect(context.destination);

    if (player) player.play({context, timing, destination: gainNode});
  }
}
