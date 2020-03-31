import {
  checkMicrophone,
  countdown,
  getAudioStream,
  endTracks
} from "../audio-recorder/api";

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("mic_check");
  if (button)
    addEventListener("click", async (e) => {
      try {
        e.preventDefault()
        const stream = await getAudioStream();
        // FIXME: make it so we can cancel the timer if the mic check succeeds (AbortSignal?)
        countdown(
          document.querySelector<HTMLTimeElement>("#countdown"),
          7000
        ).then(() => endTracks(stream));
        await checkMicrophone(stream);
        button.dispatchEvent(
          new CustomEvent("mic_check", { detail: "success" })
        );
      } catch (e) {
        if (e.name === "MicrophoneCheckError") {
          button.dispatchEvent(
            new CustomEvent("mic_check", { detail: "no_sound" })
          );
        } else if (e.name === "NotAllowedError" || e.name === "SecurityError") {
          console.log("no_permission", e)
          button.dispatchEvent(
            new CustomEvent("mic_check", { detail: "no_permission" })
          );
        } else {
          console.error(e);
          button.dispatchEvent(
            new CustomEvent("mic_check", { detail: "no_audio" })
          );
        }
      }
    });
});
