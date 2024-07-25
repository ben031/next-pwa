'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cacheData, getCachedData } from '@/utils/cache';

type DataSet = {
  id: string;
  val1: number;
  val2: number;
  val3: string;
  val4: string;
};

const dataSets: DataSet[] = [
  { id: 'A', val1: 1, val2: 2, val3: 'a', val4: 'b' },
  { id: 'B', val1: 3, val2: 4, val3: 'c', val4: 'd' },
  { id: 'C', val1: 5, val2: 6, val3: 'e', val4: 'f' },
  { id: 'D', val1: 7, val2: 8, val3: 'g', val4: 'h' },
  { id: 'E', val1: 9, val2: 10, val3: 'i', val4: 'j' },
  { id: 'F', val1: 11, val2: 12, val3: 'k', val4: 'l' },
  { id: 'G', val1: 13, val2: 14, val3: 'm', val4: 'n' },
];
export default function Home() {
  const [selectedDataSets, setSelectedDataSets] = useState<string[]>([]);
  const [cachedData, setCachedData] = useState<DataSet[]>([]);

  const handleSelect = (id: string) => {
    setSelectedDataSets((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDownload = async () => {
    const cacheName = 'dynamic-data-cache';

    // 선택된 데이터 셋 다운로드 및 캐싱
    for (const id of selectedDataSets) {
      const data = dataSets.find((set) => set.id === id);
      if (data) {
        await cacheData<DataSet>(cacheName, `/data/${id}`, data);
      }
    }
  };

  const handleShowCachedData = async () => {
    const cacheName = 'dynamic-data-cache'; // 캐시 이름을 동적으로 설정 가능
    const cachedData = await getCachedData<DataSet>(cacheName);
    setCachedData(cachedData);
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
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">Select Data Sets to Download</h1>
      {dataSets.map((data) => (
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
      ))}
      <button
        onClick={handleDownload}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
      >
        데이터 다운로드
      </button>
      <button
        onClick={handleShowCachedData}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2"
      >
        캐싱된 데이터 보기
      </button>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Cached Data</h2>
        {cachedData.map((data) => (
          <div key={data.id} className="mt-2 p-2 border rounded">
            <p>
              <strong>Data Set {data.id}</strong>: {JSON.stringify(data)}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
