import "web-streams-polyfill";

import ReadableAudioStream from "./capture_audio";
import TransformMP3Stream from "./record_audio";
import { TransformFloatToIntegerStream } from "./util";
import StreamToServer from "./stream_to_server";

export const getAudioStream = () =>
  navigator.mediaDevices.getUserMedia({
    video: false,
    audio: { channelCount: { exact: 1 } }
  });

export const endTracks = (stream: MediaStream) =>
  stream.getTracks().forEach(track => {
    track.stop();
    track.dispatchEvent(new MediaStreamTrackEvent("ended", { track }));
  });

export const checkMicrophone = async (stream: MediaStream) => {
  const reader = new ReadableAudioStream(stream).getReader();
  const finish = Date.now() + 15000;
  while (Date.now() < finish) {
    const { done, value } = await reader.read();
    if (done) break;

    if (value.some(x => Math.abs(x) > 0.05)) return;
  }
  reader.cancel("silence");
  throw new Error("No audio");
};

export const recordSample = (stream: MediaStream, rid: string) => {
  const { sampleRate } = stream.getTracks()[0].getSettings();
  if (!sampleRate) throw Error("Audio sample rate is undefined");

  return new ReadableAudioStream(stream, 16384)
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
