type MicEventDetail = "working" | "permission" | "equipment" | "sound"
type MicEvent = CustomEvent<MicEventDetail>

const micCheckUi = () => {
  const micButton = document.querySelector<HTMLLinkElement>("#mic_check")

  if (micButton) {
    const eventMap = {
      working: () => window.location.href = micButton.href,
      permission: () => window.location.href = "no_permission",
      equipment: () => window.location.href = "no_sound",
      sound: () => window.location.href = "no_sound",
    }

    micButton.addEventListener("mic_check", (event: MicEvent) => eventMap[event.detail]())

    const getAudioStream = () =>
    navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { channelCount: { exact: 1 } }
    });

    micButton.addEventListener("click", async (e) => {
      e.preventDefault()
      await getAudioStream()
      micButton.dispatchEvent(new CustomEvent("mic_check", {detail: "working"}))
    })
  }
}

document.addEventListener("DOMContentLoaded", micCheckUi)
