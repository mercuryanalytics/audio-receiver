interface MercurySoundEvent extends Event {
  detail: "pass" | "fail";
}

const soundEvent = () => new Promise((resolve, reject) => {
  document.addEventListener("mercury:sound", (event: MercurySoundEvent) => {
    const test = event.detail
    if (test === "fail") reject(Error("No sound"));
    resolve()
  })
})

const soundCheck = async () => {
  console.log("Awaiting sound check")
  try {
    await soundEvent()
    window.location.href = "/survey/instructions"
  } catch (err) {
    window.location.href = "/survey/no_sound"
  }
}

soundCheck()

document.querySelector("#pass").addEventListener("click", () => document.dispatchEvent(new CustomEvent("mercury:sound", { detail: "pass" })))
document.querySelector("#fail").addEventListener("click", () => document.dispatchEvent(new CustomEvent("mercury:sound", { detail: "fail" })))
