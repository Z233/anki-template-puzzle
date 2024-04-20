import { PersistenceSessionStorage, PersistenceWindowKey } from './lib/persistence';
import type { PersistenceData } from './types';

export declare global {
  interface Window {
    Persistence: PersistenceSessionStorage<PersistenceData> | PersistenceWindowKey<PersistenceData>;
    _card: {
      Sentence: string;
      Info: string;
    };
    _IS_BACK_SIDE?: boolean;
  }
}
