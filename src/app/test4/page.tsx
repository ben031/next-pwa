'use client';

import { useEffect, useState } from 'react';
import { getDatasets, updateDatasets } from '@/apis/datasets';
import { cacheData, getCachedData } from '@/utils/cache';

const DATASETS = ['a', 'b', 'c', 'd', 'e', 'f'];

const Test4 = () => {
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [downloadDatasets, setDownloadDatasets] = useState<any[]>([]);
  const [downloadDatasetsRenderer, setDownloadDatasetsRenderer] = useState<
    [string, any[]][]
  >([]);

  const handleDatasetCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedDatasets((prev) => [...prev, e.target.value]);
    } else {
      setSelectedDatasets((prev) =>
        prev.filter((item) => item !== e.target.value)
      );
    }
  };

  // 임시 input 데이터 핸들링
  const handleChangeDatasets = (key: string, id: number, title: string) => {
    setDownloadDatasetsRenderer((prev) => {
      return prev.map((item) =>
        item[0] === key
          ? [
              item[0],
              item[1].map((inner) =>
                inner.id === id ? { ...inner, title } : inner
              ),
            ]
          : item
      );
    });
  };

  const handleEdit = async (key: string) => {
    await cacheData('selected-datasets', '/', downloadDatasetsRenderer);
    try {
      await updateDatasets(
        key,
        downloadDatasetsRenderer.find((item) => item[0] === key)?.[1] || []
      );
    } catch (e) {
      // TODO: 에러 핸들링
      console.log('e >>>>', e);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOfflineMode(!window.navigator.onLine);

    // 오프라인인 경우 캐시 데이터 불러오기(저장 및 수정 메서드에서 캐시 업데이트 진행중)
    if (!window.navigator.onLine) {
      const syncOfflineCacheData = async () => {
        const data = await getCachedData('selected-datasets');

        setDownloadDatasetsRenderer((data?.[0] as any) || []);
      };

      syncOfflineCacheData();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!downloadDatasets.length) {
      return;
    }

    const setDownload = async () => {
      let newData: [string, any][] = [];

      for (let i = 0; i < downloadDatasets.length; i++) {
        const key = downloadDatasets[i];

        const data = await getDatasets(key);

        newData.push([key, data]);
      }

      await cacheData('selected-datasets', '/', newData);
      setDownloadDatasetsRenderer(newData);
    };

    setDownload();
  }, [downloadDatasets]);

  return (
    <div className="p-5 flex flex-col gap-3">
      <h2 className="mb-3">MODE : {isOfflineMode ? 'offline' : 'online'}</h2>
      {!isOfflineMode && (
        <form
          className="p-5 border rounded-lg"
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          onSubmit={async (e) => {
            e.preventDefault();

            setDownloadDatasets(selectedDatasets);
          }}
        >
          {DATASETS.map((item) => (
            <label key={item}>
              <input
                name="selectedDataset"
                type="checkbox"
                value={item}
                checked={selectedDatasets.includes(item)}
                onChange={handleDatasetCheck}
              />
              Dataset [{item?.toUpperCase?.()}]
            </label>
          ))}
          <button
            className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded mt-2"
            type="submit"
          >
            다운로드
          </button>
        </form>
      )}
      {downloadDatasetsRenderer.map(([key, value], idx) => (
        <div className="border rounded-lg p-5 flex flex-col gap-2" key={key}>
          <h3 className="mb-4">Dataset[{key?.toUpperCase?.()}] Data</h3>
          {value.map((item: any, itemIdx) => (
            <div key={item.id}>
              <input
                autoFocus={itemIdx === 0 && idx === 0}
                className="border rounded-lg p-2 px-3"
                name="title"
                value={item.title}
                onChange={(e) => {
                  handleChangeDatasets(key, item.id, e.target.value);
                }}
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
            onClick={() => handleEdit(key)}
          >
            수정하기
          </button>
        </div>
      ))}
    </div>
  );
};

export default Test4;
