import { Mp3Encoder } from "lamejs";

export class MP3Transformer implements Transformer {
  private mp3encoder: Mp3Encoder;

  constructor(sampleRate: number, bitRate: number) {
    this.mp3encoder = new Mp3Encoder(1, sampleRate, bitRate);
  }

  // start(controller: TransformStreamDefaultController<O>): void | PromiseLike<void> {}

  transform(
    chunk: Int16Array,
    controller: TransformStreamDefaultController<Int8Array>
  ) {
    controller.enqueue(this.mp3encoder.encodeBuffer(chunk));
  }

  flush(controller: TransformStreamDefaultController<Int8Array>) {
    const fin = this.mp3encoder.flush();
    if (fin.length > 0) controller.enqueue(fin);
  }
}

export default class TransformMP3Stream extends TransformStream {
  constructor(sampleRate: number, bitRate: number) {
    super(new MP3Transformer(sampleRate, bitRate));
  }
}
