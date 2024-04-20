import { type CheckableWord, type Word } from 'src/types';
import { writable } from 'svelte/store';

export function createWordStore(initialWords: Word[]) {
  let uid = 1;

  const words = initialWords.map(({ checked, word }) => {
    return {
      id: uid++,
      checked,
      word,
    };
  });

  const { subscribe, update } = writable(words);

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
