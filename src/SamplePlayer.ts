export default class SamplePlayer {
    buffer: AudioBuffer;

    constructor(buffer: AudioBuffer) {
        this.buffer = buffer;
    }

    play(context: AudioContext, timing: number, destination: AudioNode) {
        const source = context.createBufferSource();

        source.buffer = this.buffer;
        source.connect(destination);
        source.start(timing);
    }
}
