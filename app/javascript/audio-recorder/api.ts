import "web-streams-polyfill";
import "./getusermedia-polyfill";

import Rollbar from "../rollbar_config";
import ReadableAudioStream from "./capture_audio";
import TransformMP3Stream from "./record_audio";
import { TransformFloatToIntegerStream } from "./util";
import StreamToServer from "./stream_to_server";

export const getAudioStream = async () => {
  try {
    const supported = navigator.mediaDevices.getSupportedConstraints();
    const audio: MediaTrackConstraints = { channelCount: { exact: 1 } };
    /* NOTE: This shouldn't be necessary, as `getUserMedia` is supposed to
     * simply ignore any unsupported constraints. For reasons not yet understood,
     * some iPhones return `false` for `supported.echoCancellation`. Yet the
     * specification indicates that, if the constraint isn't supported the
     * key should be absent, and if it's supported the value should be `true`,
     * with no other alternatives.
     *   In this situation, calling `getUserMedia` requesting that echo cancellation
     * be disabled returns a "broken" stream--it reports its sample rate as zero
     * and delivers silence as its audio data.
     *   Here, we avoid requesting features that return `false`.
     */
    if (supported.autoGainControl) audio.autoGainControl = { ideal: false };
    if (supported.echoCancellation) audio.echoCancellation = { ideal: false };
    if (supported.noiseSuppression) audio.noiseSuppression = { ideal: false };
    return await navigator.mediaDevices.getUserMedia({ video: false, audio });
  } catch (e) {
    Rollbar.warning("getUserMedia failed", e);
    throw e;
  }
};

export const endTracks = (stream: MediaStream) =>
  stream.getTracks().forEach(track => {
    track.stop();
    track.dispatchEvent(new MediaStreamTrackEvent("ended", { track }));
  });

class MicrophoneCheckError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MicrophoneCheckError";
  }
}

export const checkMicrophone = async (stream: MediaStream) => {
  const reader = new ReadableAudioStream(stream).getReader();
  const finish = Date.now() + 15000;
  while (Date.now() < finish) {
    const { done, value } = await reader.read();
    if (done) break;

    if (value.some(x => Math.abs(x) > 0.05)) return;
  }
  reader.cancel("silence");
  throw new MicrophoneCheckError("No audio");
};

export const recordSample = (stream: MediaStream, rid: string) => {
  const { sampleRate } = stream.getTracks()[0].getSettings();
  if (sampleRate == null) throw Error("Audio sample rate is undefined");
  if (sampleRate === 0) throw Error("Broken audio subsystem (sampleRate is 0)");

  return new ReadableAudioStream(stream)
    .pipeThrough(new TransformFloatToIntegerStream())
    .pipeThrough(new TransformMP3Stream(sampleRate, 128))
    .pipeTo(new WritableStream(new StreamToServer(`/media/${rid}`, 1)));
};

export const countdown = (target: HTMLTimeElement | null, duration: number) =>
  new Promise(resolve => {
    if (target) {
      const finish = Date.now() + duration;
      const ticker = window.setInterval(() => {
        let interval = finish - Date.now();
        const millis = (interval % 1000).toString().padStart(4, "0");
        interval = Math.floor(interval / 1000);
        const sec = (interval % 60).toString().padStart(2, "0");
        const min = Math.floor(interval / 60);
        if (target) {
          target.textContent = `${min}:${sec}`;
          target.dateTime = `${min}M${sec}.${millis}`;
        }
      }, 250);
      setTimeout(() => {
        if (ticker) clearInterval(ticker);
        target.textContent = "";
        target.dateTime = "0";

        resolve();
      }, duration);
    } else {
      setTimeout(resolve, duration);
    }
  });
