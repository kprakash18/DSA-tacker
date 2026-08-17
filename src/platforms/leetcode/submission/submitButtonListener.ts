const SUBMIT_BUTTON_SELECTOR = '[data-e2e-locator="console-submit-button"]';

let currentSubmitButton: HTMLButtonElement | null = null;
let activeClickListener: (() => void) | null = null;
let activeKeydownListener: ((e: KeyboardEvent) => void) | null = null;

export function attachSubmitListener(onSubmitTrigger: () => void): void {
  const submitButton = document.querySelector<HTMLButtonElement>(
    SUBMIT_BUTTON_SELECTOR
  );

  if (submitButton && submitButton !== currentSubmitButton) {
    if (currentSubmitButton && activeClickListener) {
      currentSubmitButton.removeEventListener("click", activeClickListener);
    }
    currentSubmitButton = submitButton;
    activeClickListener = onSubmitTrigger;
    submitButton.addEventListener("click", activeClickListener);
  }

  if (!activeKeydownListener) {
    activeKeydownListener = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (location.pathname.startsWith("/problems/")) {
          onSubmitTrigger();
        }
      }
    };
    window.addEventListener("keydown", activeKeydownListener, true);
  }
}

export function detachSubmitListener(): void {
  if (currentSubmitButton && activeClickListener) {
    currentSubmitButton.removeEventListener("click", activeClickListener);
  }
  if (activeKeydownListener) {
    window.removeEventListener("keydown", activeKeydownListener, true);
  }

  currentSubmitButton = null;
  activeClickListener = null;
  activeKeydownListener = null;
}
