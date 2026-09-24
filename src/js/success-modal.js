const backdrop = document.querySelector('#modal');
const modal = backdrop?.querySelector('.modal');
const closeButton = backdrop?.querySelector('.modal-close');
let previousFocus = null;

export function openSuccessModal() {
  if (!backdrop || !modal || backdrop.classList.contains('is-open')) return;

  previousFocus = document.activeElement;
  backdrop.classList.add('is-open');
  document.body.classList.add('modal-open');
  closeButton?.focus({ preventScroll: true });
  document.addEventListener('keydown', handleKeydown);
}

export function closeSuccessModal() {
  if (!backdrop?.classList.contains('is-open')) return;

  backdrop.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', handleKeydown);
  if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  previousFocus = null;
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeSuccessModal();
  }
  // The close button is currently the dialog's only interactive element.
  if (event.key === 'Tab') {
    event.preventDefault();
    closeButton?.focus({ preventScroll: true });
  }
}

closeButton?.addEventListener('click', closeSuccessModal);
backdrop?.addEventListener('click', event => {
  if (event.target === event.currentTarget) closeSuccessModal();
});
