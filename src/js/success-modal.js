const dialog = document.querySelector('.success-modal');
const closeButton = dialog?.querySelector('.success-modal__close');
const form = document.querySelector('.contacts-form');
let previousFocus = null;
let ownsScrollLock = false;
let isProgrammaticClose = false;

function getFocusableElements() {
  if (!dialog) return [];

  return [
    ...dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ),
  ].filter(element => !element.disabled && !element.hasAttribute('hidden'));
}

function restoreFocus() {
  if (previousFocus instanceof HTMLElement) previousFocus.focus();
  previousFocus = null;
}

function finalizeClose() {
  if (ownsScrollLock) document.documentElement.classList.remove('modal-open');
  ownsScrollLock = false;
  restoreFocus();
}

export function openSuccessModal() {
  if (!dialog) return;

  if (dialog.open) {
    closeButton?.focus();
    return;
  }

  previousFocus =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
  ownsScrollLock = !document.documentElement.classList.contains('modal-open');
  document.documentElement.classList.add('modal-open');
  dialog.showModal();
  closeButton?.focus();
}

export function closeSuccessModal() {
  if (!dialog?.open) return;

  isProgrammaticClose = true;
  finalizeClose();
  dialog.close();
}

if (form && dialog && closeButton) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    openSuccessModal();
  });

  closeButton.addEventListener('click', closeSuccessModal);

  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeSuccessModal();
  });

  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  dialog.addEventListener('close', () => {
    if (isProgrammaticClose) {
      isProgrammaticClose = false;
      return;
    }

    finalizeClose();
  });
}
