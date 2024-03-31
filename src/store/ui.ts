import { PersistenceKey } from 'src/types';
import { writable } from 'svelte/store';

export function createUiStore() {
  const persistenceData = window.Persistence.getItem();

  const { subscribe, update } = writable({
    showAnswer:
      persistenceData && persistenceData[PersistenceKey.UI]
        ? Boolean(JSON.parse(persistenceData[PersistenceKey.UI]).showAnswer)
        : false,
  });

  subscribe((value) => {
    const data = window.Persistence.getItem();
    window.Persistence.setItem(undefined, { ...data, [PersistenceKey.UI]: JSON.stringify(value) });
  });

  return {
    subscribe,
    toggleAnswer: (override?: boolean) => {
      update((ui) => ({ ...ui, showAnswer: override === undefined ? !ui.showAnswer : override }));
    },
  };
}
