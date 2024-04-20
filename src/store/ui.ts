import { writable } from 'svelte/store';

export function createUiStore(initial: { showAnswer: boolean }) {
  const { subscribe, update } = writable({
    showAnswer: false,
  });

  return {
    subscribe,
    toggleAnswer: (override?: boolean) => {
      update((ui) => ({ ...ui, showAnswer: override === undefined ? !ui.showAnswer : override }));
    },
  };
}
