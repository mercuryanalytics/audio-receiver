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
  try {
    await soundEvent()
    window.location.href = "/survey/rate"
  } catch (err) {
    window.location.href = "/survey/no_sound"
  }
}
