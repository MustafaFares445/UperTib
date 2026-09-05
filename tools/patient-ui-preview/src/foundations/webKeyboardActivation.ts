interface WebKeyboardEvent {
  key?: string;
  nativeEvent?: { key?: string };
  preventDefault?: () => void;
  currentTarget?: HTMLElement;
}

/** Adds the Space activation that React Native Web does not supply for custom radio/checkbox roles. */
export function webSpaceActivationProps(onActivate: () => void) {
  return {
    onKeyDown: (event: WebKeyboardEvent) => {
      const key = event.key ?? event.nativeEvent?.key;
      if (key !== ' ' && key !== 'Spacebar') return;
      event.preventDefault?.();
      onActivate();
    },
  };
}

/** Gives a custom web radio one tab stop plus the WAI-ARIA arrow-key selection model. */
export function webRadioKeyboardProps(onActivate: () => void, tabbable: boolean) {
  return {
    tabIndex: (tabbable ? 0 : -1) as 0 | -1,
    onKeyDown: (event: WebKeyboardEvent) => {
      const key = event.key ?? event.nativeEvent?.key;
      if (key === ' ' || key === 'Spacebar') {
        event.preventDefault?.();
        onActivate();
        return;
      }

      const step = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 0;
      if (!step) return;

      const group = event.currentTarget?.closest('[role="radiogroup"]');
      const radios = Array.from(group?.querySelectorAll<HTMLElement>('[role="radio"]:not([aria-disabled="true"])') ?? []);
      const currentIndex = event.currentTarget ? radios.indexOf(event.currentTarget) : -1;
      if (currentIndex < 0 || radios.length < 2) return;

      event.preventDefault?.();
      const next = radios[(currentIndex + step + radios.length) % radios.length];
      next.focus();
      next.click();
    },
  };
}
