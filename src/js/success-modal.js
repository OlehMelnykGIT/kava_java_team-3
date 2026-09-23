const dialog = document.querySelector('.success-modal');
const closeButton = dialog?.querySelector('.success-modal__close');
let previousFocus = null;
let ownsScrollLock = false;

// Call only after the Contacts API request has succeeded.
