const recordSoundUi = () => {
  const recordButton = document.getElementById("record")

  if (recordButton) {
    recordButton.addEventListener("completed", () => window.location.href = "thankyou")
  }
}

document.addEventListener("DOMContentLoaded", recordSoundUi)
