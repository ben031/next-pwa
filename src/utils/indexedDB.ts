interface Dataset {
  name: string;
  data: any;
}

export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((res, rej) => {
    const request = indexedDB.open('dataCacheDB', 1);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      db.createObjectStore('datasets', { keyPath: 'name' });
    };

    request.onsuccess = (e) => {
      res((e.target as IDBOpenDBRequest).result);
    };
    request.onerror = (e) => {
      rej('err: ' + (e.target as IDBOpenDBRequest).error);
    };
  });
};

export async function saveData(dataset: Dataset): Promise<void> {
  const db = await openDatabase();
  const transaction = db.transaction(['datasets'], 'readwrite');
  const store = transaction.objectStore('datasets');

  store.put(dataset);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject('Transaction error: ' + transaction.error);
  });
}

export async function loadData(datasetName: string): Promise<any> {
  const db = await openDatabase();
  const transaction = db.transaction(['datasets'], 'readonly');
  const store = transaction.objectStore('datasets');

  return new Promise((resolve, reject) => {
    const request = store.get(datasetName);

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.data);
      } else {
        reject('No data found');
      }
    };

    request.onerror = () => reject('Transaction error: ' + request.error);
  });
}

export async function getAllCachedData(): Promise<Dataset[]> {
  const db = await openDatabase();
  const transaction = db.transaction(['datasets'], 'readonly');
  const store = transaction.objectStore('datasets');

  return new Promise((resolve, reject) => {
    const datasets: Dataset[] = [];
    store.openCursor().onsuccess = (event) => {
      const cursor = (event.target as IDBRequest)
        .result as IDBCursorWithValue | null;
      if (cursor) {
        datasets.push(cursor.value);
        cursor.continue();
      } else {
        resolve(datasets);
      }
    };

    store.openCursor().onerror = () =>
      reject('Transaction error: ' + transaction.error);
  });
}
