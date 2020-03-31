import "./getusermedia-polyfill";

if (!window.AudioContext)
  window.AudioContext = (window as any).webkitAudioContext;

class DeadmanSwitch {
  private timer: number;

  constructor(duration: number, callback: () => void) {
    this.timer = window.setTimeout(callback, duration);
  }

  heartbeat() {
    if (!this.timer) return;
    clearTimeout(this.timer);
    this.timer = 0;
  }
}

class MediaStreamSource implements UnderlyingSource<Float32Array> {
  private stream: MediaStream;
  private context: AudioContext;
  private mic: MediaStreamAudioSourceNode;
  private script: ScriptProcessorNode;
  private live: boolean = true;

  constructor(stream: MediaStream, bufferSize?: number) {
    this.stream = stream;

    this.context = new AudioContext();
    this.mic = this.context.createMediaStreamSource(this.stream);
    this.script = this.context.createScriptProcessor(bufferSize);
  }

  start(controller: ReadableStreamDefaultController<Float32Array>) {
    this.stream.getTracks()[0].addEventListener("ended", () => {
      this.cancel();
      controller.close();
      this.live = false;
    });
    // TODO: use new AudioWorklet api if available
    const deadman = new DeadmanSwitch(1000, () => controller.error(Error("broken audio subsystem")));
    this.script.addEventListener("audioprocess", ({ inputBuffer }) => {
      deadman.heartbeat();
      if (!this.live) return;
      controller.enqueue(inputBuffer.getChannelData(0));
    });
    this.mic.connect(this.script);
    this.script.connect(this.context.destination);
  }

  cancel(_reason?: any) {
    this.script.disconnect(this.context.destination);
    this.mic.disconnect(this.script);
    this.context.close();
  }
}

export default class ReadableAudioStream extends ReadableStream<Float32Array> {
  constructor(stream: MediaStream, bufferSize?: number) {
    super(new MediaStreamSource(stream, bufferSize));
  }
}

/* Note:
-- getUserMedia used to be on navigator, and took callbacks instead of returning a promise
-- this should work everywhere, but doesn't give the promise-based version:
  getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
*/

/* Note:
-- context.createScriptProcessor is deprecated in favor of AudioWorklet
  context.audioWorklet.addModule("worklet.js").then(() => {
    const script = new AudioWorkletNode(context, "hgrecorder-processor")
    script.connect(context.destination)
  })
*/

/* Note:
chrome supported constraints = {
   "groupId" : true, "facingMode" : true, "focusMode" : true, "channelCount" : true,
   "deviceId" : true, "height" : true, "sharpness" : true, "exposureMode" : true,
   "autoGainControl" : true, "zoom" : true, "torch" : true, "sampleSize" : true,
   "pointsOfInterest" : true, "colorTemperature" : true, "sampleRate" : true,
   "frameRate" : true, "echoCancellation" : true, "brightness" : true,
   "saturation" : true, "noiseSuppression" : true, "aspectRatio" : true, "width" : true,
   "latency" : true, "contrast" : true, "exposureCompensation" : true,
   "focusDistance" : true, "exposureTime" : true, "iso" : true, "whiteBalanceMode" : true,
   "resizeMode" : true
}
*/
