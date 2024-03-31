import { PersistenceSessionStorage, PersistenceWindowKey } from './lib/persistence';
import type { PersistenceData } from './types';

export declare global {
  interface Window {
    _card: {
      Sentence: string;
    };
    Persistence: PersistenceSessionStorage<PersistenceData> | PersistenceWindowKey<PersistenceData>;
  }
}
