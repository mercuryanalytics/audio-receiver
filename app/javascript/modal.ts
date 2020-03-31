const initModal = () => {
  const modal = document.querySelector('.modal') as HTMLElement
  if (modal) {
    const chooseModalContent = () => {
      if (Math.random() < 0.5) {
        (document.querySelector(".modal .option-1") as HTMLElement).style.display = "none"
      } else {
        (document.querySelector(".modal .option-2") as HTMLElement).style.display = "none"
      }
    }

    const closeModal = () => {
      modal.style.display = 'none'
      modal.querySelector('.close').removeEventListener('click', closeModal)
    }

    chooseModalContent()
    modal.querySelector('.close').addEventListener('click', closeModal)
  }
}

document.addEventListener("DOMContentLoaded", initModal)
