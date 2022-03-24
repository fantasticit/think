// const provider = new IndexeddbPersistence(docName, ydoc);

// provider.on('synced', () => {
//   console.log('content from the database is loaded');
// });

import { IndexeddbPersistence } from 'y-indexeddb';

const POOL = new Map();

export const getIndexdbProvider = (name, doc) => {
  if (!POOL.has(name)) {
    POOL.set(name, new IndexeddbPersistence(name, doc));
  }

  return POOL.get(name);
};

export const destoryIndexdbProvider = (name) => {
  const provider = POOL.get(name);

  if (!provider) return;

  provider.destroy();
  POOL.delete(name);
};
