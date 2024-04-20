type PersistenceKey = 'py' | 'qt';

export class PersistenceSessionStorage<T> {
  private readonly _persistenceKey = 'github.com/SimonLammer/anki-persistence/';
  private readonly _defaultKey = '_default';
  public isAvailable: boolean = false;

  constructor() {
    try {
      if (typeof window.sessionStorage === 'object') {
        this.isAvailable = true;
      }
    } catch (err) {
      console.error(err);
    }
  }

  clear(): void {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(this._persistenceKey)) {
        sessionStorage.removeItem(key);
        i--;
      }
    }
  }

  setItem<K extends string = typeof this._defaultKey>(key: K = this._defaultKey as K, value: T): void {
    sessionStorage.setItem(this._persistenceKey + key, JSON.stringify(value));
  }

  getItem<K extends string = typeof this._defaultKey>(key: K = this._defaultKey as K): T | null {
    const item = sessionStorage.getItem(this._persistenceKey + key);
    return item ? JSON.parse(item) : null;
  }

  removeItem<K extends string = typeof this._defaultKey>(key: K = this._defaultKey as K): void {
    sessionStorage.removeItem(this._persistenceKey + key);
  }

  getAllKeys(): string[] {
    return Object.keys(sessionStorage)
      .filter((key) => key.startsWith(this._persistenceKey))
      .map((key) => key.substring(this._persistenceKey.length))
      .sort();
  }
}

export class PersistenceWindowKey<T> {
  private readonly _persistenceKey = 'github.com/SimonLammer/anki-persistence/';
  private readonly _defaultKey = '_default';
  public isAvailable: boolean = false;

  constructor(private persistentKey: PersistenceKey) {
    const obj = window[this.persistentKey as keyof Window] as
      | { [_persistenceKey: string]: { [key: string]: T } }
      | undefined;
    if (typeof obj === 'object' && obj !== null) {
      this.isAvailable = true;
      if (obj[this._persistenceKey] === undefined) {
        this.clear();
      }
    }
  }

  clear(): void {
    const obj = window[this.persistentKey as keyof Window] as any;
    obj[this._persistenceKey] = {};
  }

  setItem<K extends string = typeof this._defaultKey>(key: K = this._defaultKey as K, value: T): void {
    const obj = window[this.persistentKey as keyof Window] as any;
    if (!obj[this._persistenceKey]) obj[this._persistenceKey] = {};
    obj[this._persistenceKey][key] = value;
  }

  getItem<K extends string = typeof this._defaultKey>(key: K = this._defaultKey as K): T | null {
    const obj = window[this.persistentKey as keyof Window] as any;
    return obj && obj[this._persistenceKey] && obj[this._persistenceKey][key] !== undefined
      ? obj[this._persistenceKey][key]
      : null;
  }

  removeItem<K extends string = typeof this._defaultKey>(key: K = this._defaultKey as K): void {
    const obj = window[this.persistentKey as keyof Window] as any;
    if (obj && obj[this._persistenceKey]) {
      delete obj[this._persistenceKey][key];
    }
  }

  getAllKeys(): string[] {
    const obj = window[this.persistentKey as keyof Window] as any;
    return obj && obj[this._persistenceKey] ? Object.keys(obj[this._persistenceKey]) : [];
  }
}

function initializePersistence() {
  let persistence: PersistenceSessionStorage<any> | PersistenceWindowKey<any> = new PersistenceSessionStorage<any>();
  if (!persistence.isAvailable) {
    persistence = new PersistenceWindowKey<any>('py'); // windows, mac (2.0)
  }
  if (!persistence.isAvailable) {
    const titleStartIndex = window.location.toString().indexOf('title');
    const titleContentIndex = window.location.toString().indexOf('main', titleStartIndex);
    if (titleStartIndex > 0 && titleContentIndex > 0 && titleContentIndex - titleStartIndex < 10) {
      persistence = new PersistenceWindowKey<any>('qt'); // linux, mac (2.1)
    }
  }
  
  window.Persistence = persistence;
}

if (typeof window.Persistence === 'undefined') {
  initializePersistence();
}
