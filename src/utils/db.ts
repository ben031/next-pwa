// lib/indexedDB.ts

interface MyData {
  id: number | string;
  name: string;
  age: number;
}

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('myDatabase', 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore('myObjectStore', { keyPath: 'id' });
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject(
        'Database failed to open: ' +
          (event.target as IDBOpenDBRequest).error?.message
      );
    };
  });
}

export function getData(
  db: IDBDatabase,
  storeName: string,
  id: string
): Promise<MyData | undefined> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(id);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as MyData);
    };

    request.onerror = (event) => {
      reject(
        'Error in retrieving data: ' +
          (event.target as IDBRequest).error?.message
      );
    };
  });
}

export function addData(
  db: IDBDatabase,
  storeName: string,
  data: MyData
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.add(data);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(
        'Error in adding data: ' + (event.target as IDBRequest).error?.message
      );
    };
  });
}
