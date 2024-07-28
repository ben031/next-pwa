'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cacheData, getCachedData } from '@/utils/cache';
import { addData, openDB } from '@/utils/db';
import { getAllCachedData, saveData } from '@/utils/indexedDB';

interface Dataset {
  name: string;
  data: any;
}

export default function Home() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // 네트워크 상태 감지
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      // 온라인 상태에서 모든 데이터 로드
      fetchAllData();
    } else {
      // 오프라인 상태에서 캐싱된 데이터 로드
      loadCachedData();
    }
  }, [isOnline]);

  const fetchAllData = async () => {
    const response = await fetch('/api/all-data');
    const data = await response.json();
    setDatasets(data);
  };

  const loadCachedData = async () => {
    const data = await getAllCachedData();
    setDatasets(data.map((d) => ({ name: d.name, data: d.data })));
  };

  const downloadData = async (datasetName: string) => {
    const response = await fetch(`/api/data/${datasetName}`);
    const data = await response.json();
    await saveData({ name: datasetName, data });
    alert(`${datasetName} has been downloaded and cached.`);
    if (!isOnline) {
      loadCachedData(); // 오프라인 상태라면 캐싱된 데이터 다시 로드
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Navigate to Pages</h2>
        <div className="flex space-x-4">
          <Link
            href="/test1"
            className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
          >
            Page1
          </Link>
          <Link
            href="/test2"
            className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
          >
            Page2
          </Link>
          <Link
            href="/test3"
            className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
          >
            Page3
          </Link>
          <Link
            href="/data-download"
            className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
          >
            Data-Download
          </Link>
        </div>
      </div>
      <button
        onClick={async () => {
          const db = await openDB();
          console.log(db);
          await addData(db, 'myObjectStore', {
            id: 'dataA',
            name: 'namve',
            age: 12,
          });
        }}
      >
        add data
      </button>
      <h1 className="text-2xl font-bold mb-4">Select Data Sets to Download</h1>
      {/* {dataSets.map((data) => (
        <div key={data.id} className="mb-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              value={data.id}
              onChange={() => handleSelect(data.id)}
            />
            <span className="ml-2 text-gray-700">Data Set {data.id}</span>
          </label>
        </div>
      ))} */}
      <button
        onClick={() => downloadData('datasetA')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
      >
        데이터A 다운로드
      </button>
      <button
        onClick={() => downloadData('datasetB')}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2"
      >
        데이터B 다운로드
      </button>
      <button onClick={loadCachedData}>캐싱 데이터</button>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Cached Data</h2>
        {datasets.map((dataset, index) => (
          <li key={index}>{dataset.name}</li>
        ))}
      </div>
    </main>
  );
}
