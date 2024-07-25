'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cacheData } from '@/utils/cache';

const dataSets = [
  { id: 'A', content: 'Data A' },
  { id: 'B', content: 'Data B' },
  { id: 'C', content: 'Data C' },
  { id: 'D', content: 'Data D' },
  { id: 'E', content: 'Data E' },
  { id: 'F', content: 'Data F' },
  { id: 'G', content: 'Data G' },
];

export default function Home() {
  const [selectedDataSets, setSelectedDataSets] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    setSelectedDataSets((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDownload = async () => {
    for (const id of selectedDataSets) {
      const data = dataSets.find((set) => set.id === id);
      if (data) {
        await cacheData(`/data/${id}`, data);
      }
    }
    alert('Selected data sets have been downloaded and cached.');
  };

  useEffect(() => {
    // 모든 페이지를 클릭하여 네비게이션하는 작업
    const pages = [...Array(2).keys()].map((i) => `/test${i + 1}`);
    pages.forEach((page) => {
      fetch(page)
        .then((response) => response.text())
        .then(() => {
          console.log(`Page ${page} fetched and cached.`);
        });
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      landing page
      <Link className="bg-amber-500" href={'/test1'}>
        Page1
      </Link>
      <Link className="bg-amber-500" href={'/test2'}>
        Page2
      </Link>
      <Link className="bg-amber-500" href={'/test3'}>
        Page3
      </Link>
      <h1>Select Data Sets to Download</h1>
      {dataSets.map((data) => (
        <div key={data.id}>
          <label>
            <input
              type="checkbox"
              value={data.id}
              onChange={() => handleSelect(data.id)}
            />
            Data Set {data.id}
          </label>
        </div>
      ))}
      <button onClick={handleDownload}>Download Selected Data</button>
    </main>
  );
}
