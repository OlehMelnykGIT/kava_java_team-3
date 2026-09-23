const dialog = document.querySelector('.success-modal');
const closeButton = dialog?.querySelector('.success-modal__close');
let previousFocus = null;
let ownsScrollLock = false;

// Call only after the Contacts API request has succeeded.
export function openSuccessModal() {
  if (!dialog || dialog.open) return;

  previousFocus = document.activeElement;
  dialog.showModal();
  ownsScrollLock = !document.documentElement.classList.contains('modal-open');
  document.documentElement.classList.add('modal-open');
  dialog.scrollTop = 0;
  closeButton.focus({ preventScroll: true });
}

export function closeSuccessModal() {
  if (!dialog?.open) return;
  dialog.close();
  restorePage();
}

function restorePage() {
  if (ownsScrollLock) {
    document.documentElement.classList.remove('modal-open');
    ownsScrollLock = false;
  }
  if (previousFocus?.isConnected) {
    previousFocus.focus({ preventScroll: true });
  }
  previousFocus = null;
}

closeButton?.addEventListener('click', closeSuccessModal);
dialog?.addEventListener('click', event => {
  if (event.target === dialog) closeSuccessModal();
});
dialog?.addEventListener('cancel', event => {
  event.preventDefault();
  closeSuccessModal();
});
dialog?.addEventListener('close', () => {
  // A queued close event must not unlock a modal reopened in the same task.
  if (!dialog.open) restorePage();
});
