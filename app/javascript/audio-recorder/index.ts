import { checkMicrophone, countdown, recordSample } from "./api";

const withButton = (
  button: HTMLButtonElement | null,
  cb: (this: HTMLButtonElement, ev: MouseEvent) => Promise<any>
) => {
  if (!button) return;
  button.addEventListener("click", async e => {
    button.disabled = true;
    await cb.call(button, e);
    button.disabled = false;
  });
};

const getAudioStream = () =>
  navigator.mediaDevices.getUserMedia({
    video: false,
    audio: { channelCount: { exact: 1 } }
  });

const endTracks = (stream: MediaStream) =>
  stream.getTracks().forEach(track => {
    track.stop();
    track.dispatchEvent(new MediaStreamTrackEvent("ended", { track }));
  });

const duration: number = 30_000; //5 * 60_000;

withButton(document.querySelector<HTMLButtonElement>("#record"), async () => {
  const stream = await getAudioStream();
  countdown(
    document.querySelector<HTMLTimeElement>("#countdown"),
    duration
  ).then(() => endTracks(stream));
  return recordSample(stream);
});
