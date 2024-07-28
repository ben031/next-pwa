'use client';

import { openDB, DBSchema } from 'idb';
import React, { useState, useEffect, useCallback } from 'react';

interface MyDB extends DBSchema {
  dataSets: {
    key: string;
    value: DataSet;
  };
}

const dbName = 'myDatabase';
const dataSets = [
  'dataA',
  'dataB',
  'dataC',
  'dataD',
  'dataE',
  'dataF',
  'dataG',
  'dataH',
  'dataI',
  'dataJ',
];

const openDatabase = async () => {
  const db = await openDB<MyDB>(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('dataSets')) {
        db.createObjectStore('dataSets', { keyPath: 'id' });
      }
    },
  });
  return db;
};

interface DataSet {
  id: string;
  content: string;
  isModified: boolean;
}

const DataDownload: React.FC = () => {
  const [selectedDataSets, setSelectedDataSets] = useState<string[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [modifiedDataSets, setModifiedDataSets] = useState<DataSet[]>([]);

  //   const openDatabase = async () => {
  //     const db = await openDB<MyDB>('myDatabase', 1, {
  //       upgrade(db) {
  //         if (!db.objectStoreNames.contains('dataSets')) {
  //           db.createObjectStore('dataSets', { keyPath: 'id' });
  //         }
  //       },
  //     });
  //     return db;
  //   };

  //   const handleCheckboxChange = (dataSet: string) => {
  //     setSelectedDataSets((prevState) =>
  //       prevState.includes(dataSet)
  //         ? prevState.filter((item) => item !== dataSet)
  //         : [...prevState, dataSet]
  //     );
  //   };

  //   const handleDownloadClick = async () => {
  //     const db = await openDatabase();
  //     const tx = db.transaction('dataSets', 'readwrite');
  //     const store = tx.objectStore('dataSets');

  //     selectedDataSets.forEach((dataSet) => {
  //       store.put({
  //         id: dataSet,
  //         content: `Content of ${dataSet}`,
  //         isModified: false,
  //       });
  //     });

  //     await tx.done;
  //     alert('Selected data sets have been downloaded.');
  //   };

  //   const checkForUpdates = useCallback(async () => {
  //     const db = await openDatabase();
  //     const tx = db.transaction('dataSets', 'readonly');
  //     const store = tx.objectStore('dataSets');
  //     const allData = await store.getAll();

  //     const modifiedData = allData.filter((data) => data.isModified);
  //     setModifiedDataSets(modifiedData);

  //     if (modifiedData.length > 0) {
  //       alert('There are modified data sets. Please update them.');
  //     }
  //   }, []);

  const handleOfflineClick = () => {
    setIsOfflineMode(true);
  };

  const handleOnlineClick = useCallback(() => {
    setIsOfflineMode(false);
    // checkForUpdates();
  }, []);

  //   const manipulateData = async (dataId: string, newContent: string) => {
  //     const db = await openDatabase();
  //     const tx = db.transaction('dataSets', 'readwrite');
  //     const store = tx.objectStore('dataSets');
  //     store.put({ id: dataId, content: newContent, isModified: true });
  //     await tx.done;
  //   };

  useEffect(() => {
    if (window.navigator.onLine) {
      handleOnlineClick();
    } else {
      handleOfflineClick();
    }
  }, [handleOnlineClick]);

  return (
    <div>
      {!isOfflineMode && (
        <>
          <div>
            <h3>Select Data Sets</h3>
            {dataSets.map((dataSet) => (
              <div key={dataSet}>
                <input
                  type="checkbox"
                  id={dataSet}
                  name={dataSet}
                  value={dataSet}
                  //   onChange={() => handleCheckboxChange(dataSet)}
                  checked={selectedDataSets.includes(dataSet)}
                />
                <label htmlFor={dataSet}>{dataSet}</label>
              </div>
            ))}
            {/* <button onClick={handleDownloadClick}> */}
            Download Selected Data Sets
            {/* </button> */}
          </div>
          <div>
            <button onClick={handleOfflineClick}>Go Offline</button>
            <button onClick={handleOnlineClick}>Go Online</button>
            <p>Mode: {isOfflineMode ? 'Offline' : 'Online'}</p>
          </div>
        </>
      )}
      {isOfflineMode && (
        <div>
          <h3>Manipulate Data (Offline Mode)</h3>
          {selectedDataSets.map((dataSet) => (
            <div key={dataSet}>
              <button
                onClick={
                  () => {}
                  //   manipulateData(dataSet, `Updated content for ${dataSet}`)
                }
              >
                Update {dataSet}
              </button>
            </div>
          ))}
        </div>
      )}
      {!isOfflineMode && modifiedDataSets.length > 0 && (
        <div>
          <h3>Modified Data Sets</h3>
          {modifiedDataSets.map((dataSet) => (
            <div key={dataSet.id}>
              <p>
                {dataSet.id}: {dataSet.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataDownload;
