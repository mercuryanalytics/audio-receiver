const chooseModalContent = () => {
  if (Math.random() < 0.5) {
    (document.querySelector(".option-1") as HTMLElement).style.display = "none"
  } else {
    (document.querySelector(".option-2") as HTMLElement).style.display = "none"
  }
}

document.addEventListener("DOMContentLoaded", chooseModalContent)
