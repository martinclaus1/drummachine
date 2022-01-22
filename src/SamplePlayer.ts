// Play a sample loaded from a file
export default class SamplePlayer {
  buffer: any;

  constructor(buffer: any) {
    this.buffer = buffer;
  }

  play({ context, timing, destination }: any) :any {
    const source = context.createBufferSource();

    source.buffer = this.buffer;
    source.connect(destination);
    source.start(timing);
  }
}
