import Rollbar from "../rollbar_config";
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
      try {
        const stream = await getAudioStream();
        console.log("Track settings", stream.getTracks()[0].getSettings());
        countdown(
          document.querySelector<HTMLTimeElement>("#countdown"),
          duration
        ).then(() => endTracks(stream));
        await recordSample(stream, rid);
      } catch (e) {
        Rollbar.error("Recording error", e);
      } finally {
        button.dispatchEvent(new CustomEvent("completed"));
      }
    });
});
