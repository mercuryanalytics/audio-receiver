const modal = document.querySelector('.modal') as HTMLElement

const closeModal = () => {
  modal.style.display = 'none'
  modal.querySelector('.close').removeEventListener('click', closeModal)
  modal.querySelector('.overlay').removeEventListener('click', closeModal)
}

modal.querySelector('.close').addEventListener('click', closeModal)
modal.querySelector('.overlay').addEventListener('click', closeModal)
