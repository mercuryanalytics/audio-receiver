type MicEventDetail = "success" | "no_sound" | "no_permission" | "no_audio"
type MicEvent = CustomEvent<MicEventDetail>

const micCheckUi = () => {
  const micButton = document.querySelector<HTMLLinkElement>("#mic_check")

  if (micButton) {
    const eventMap: Record<MicEventDetail, () => void> = {
      success: () => window.location.href = micButton.href,
      no_sound: () => window.location.href = "no_permission",
      no_permission: () => window.location.href = "no_sound",
      no_audio: () => window.location.href = "no_sound",
    }

    micButton.addEventListener("mic_check", (event: MicEvent) => eventMap[event.detail]())
  }
}

document.addEventListener("DOMContentLoaded", micCheckUi)
