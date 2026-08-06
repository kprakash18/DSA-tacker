const SUBMIT_BUTTON_SELECTOR = '[data-e2e-locator="console-submit-button"]';

let currentSubmitButton: HTMLButtonElement | null = null;
let activeClickListener: (() => void) | null = null;

export function attachSubmitListener(onButtonClick: () => void): void {
  const submitButton = document.querySelector<HTMLButtonElement>(
    SUBMIT_BUTTON_SELECTOR
  );

  if (!submitButton) {
    return;
  }

  // Already attached to this button node
  if (submitButton === currentSubmitButton && activeClickListener === onButtonClick) {
    return;
  }

  detachSubmitListener();

  currentSubmitButton = submitButton;
  activeClickListener = onButtonClick;

  submitButton.addEventListener("click", activeClickListener);
}

export function detachSubmitListener(): void {
  if (currentSubmitButton && activeClickListener) {
    currentSubmitButton.removeEventListener("click", activeClickListener);
  }

  currentSubmitButton = null;
  activeClickListener = null;
}
