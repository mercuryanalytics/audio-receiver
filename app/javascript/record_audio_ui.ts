const recordSoundUi = () => {
  const recordButton = document.getElementById("#record")

  if (recordButton) {
    recordButton.addEventListener("complete", () => window.location.href = "thankyou")
  }
}

document.addEventListener("DOMContentLoaded", recordSoundUi)
