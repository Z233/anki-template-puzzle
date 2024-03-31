export type Word = {
  checked: boolean;
  word: string;
};

export type CheckableWord = { id: number } & Word;

export enum PersistenceKey {
  Words = 'WORDS',
  UI = 'UI',
}

export interface PersistenceData {
  [PersistenceKey.Words]?: string;
  [PersistenceKey.UI]?: string;
}
