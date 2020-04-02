import {
  countdown,
  recordSample,
  getAudioStream,
  endTracks
} from "../audio-recorder/api";

const duration: number = 30_000; //5 * 60_000;

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("record");
  const rid =
    document.querySelector<HTMLMetaElement>("meta[name=rid]").content || "test";
  if (button)
    button.addEventListener("click", async () => {
      const stream = await getAudioStream();
      countdown(
        document.querySelector<HTMLTimeElement>("#countdown"),
        duration
      ).then(() => endTracks(stream));
      await recordSample(stream, rid);
      button.dispatchEvent(new CustomEvent("completed"));
    });
});
