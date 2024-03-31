import { PersistenceKey, type CheckableWord, type Word } from 'src/types';
import { writable } from 'svelte/store';

export function createWordStore(initial: Word[]) {
  let uid = 1;

  let initialWords: CheckableWord[] = [];
  const persistenceData = window.Persistence.getItem();

  if (persistenceData && persistenceData[PersistenceKey.Words]) {
    initialWords = JSON.parse(persistenceData[PersistenceKey.Words]);
  }

  if (initialWords.length === 0) {
    initialWords = initial.map(({ checked, word }) => {
      return {
        id: uid++,
        checked,
        word,
      };
    });
  }

  const { subscribe, update } = writable(initialWords);

  subscribe((value) => {
    const data = window.Persistence.getItem();
    window.Persistence.setItem(undefined, { ...data, [PersistenceKey.Words]: JSON.stringify(value) });
  });

  return {
    subscribe,
    check: (word: CheckableWord, checked: boolean) => {
      update(($words) => [...$words.filter((w) => w !== word), { ...word, checked }]);
    },
    reset: () => {
      update(($words) => [...$words.map((w) => ({ ...w, checked: false }))]);
    },
  };
}

export type WordStore = ReturnType<typeof createWordStore>;
