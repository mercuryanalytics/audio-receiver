type MicEventDetail = "success" | "no_sound" | "no_permission" | "no_audio"
type MicEvent = CustomEvent<MicEventDetail>

const micCheckUi = () => {
  const micButton = document.querySelector<HTMLLinkElement>("#mic_check")

  if (micButton) {
    micButton.addEventListener("mic_check", (event: MicEvent) => {
      console.log("event", event.detail)
      let target: string = event.detail
      if (target === "success") target = micButton.href
      window.location.href = target
    })
  }
}

document.addEventListener("DOMContentLoaded", micCheckUi)
