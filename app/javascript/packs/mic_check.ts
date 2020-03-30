interface MercuryEvent extends Event {
  detail: "allowed" | "denied";
}

const micButton = document.querySelector("#mic_check") as HTMLLinkElement

// const allowed = document.querySelector("#allowed")
// const denied = document.querySelector("#denied")
// allowed.addEventListener("click", () => micButton.dispatchEvent(new CustomEvent("mercury:permission", { detail: "allowed" })))
// denied.addEventListener("click", () => micButton.dispatchEvent(new CustomEvent("mercury:permission", { detail: "denied" })))

const checkResult = () => new Promise((resolve, reject) => {
  micButton.addEventListener("mercury:permission", (event: MercuryEvent) => {
    const permission = event.detail
    if (permission === "denied") reject(Error("Permission denied"));
    resolve()
  })
})

micButton.addEventListener("click", async (e) => {
  e.preventDefault()
  try {
    await checkResult()
    window.location.href = micButton.href
  } catch (err) {
    window.location.href = "/survey/no_permission"
  }
})
