'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDatasets, updateDatasets } from '@/apis/datasets';
import { setManualStatus } from '@/stores/networkSlice';
import { RootState } from '@/stores/store';
import { cacheData, getCachedData } from '@/utils/cache';

const DATASETS = ['a', 'b', 'c', 'd', 'e', 'f'];

const Test4 = () => {
  const dispatch = useDispatch();
  const manualStatus = useSelector(
    (state: RootState) => state.network.manualStatus
  );

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

  const handleManualStatusChange = (status: 'online' | 'offline') => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SET_MANUAL_STATUS',
        payload: status,
      });
    }
  };

  const getButtonClass = (status: string) => {
    const baseClass = 'px-4 py-2 rounded font-semibold ';
    if (manualStatus === status) {
      return `${baseClass} bg-blue-500 text-white`;
    } else {
      return `${baseClass} bg-gray-300 text-gray-700 hover:bg-gray-400`;
    }
  };

  useEffect(() => {
    // 오프라인인 경우 캐시 데이터 불러오기(저장 및 수정 메서드에서 캐시 업데이트 진행중)
    if (manualStatus === 'offline') {
      const syncOfflineCacheData = async () => {
        const data = await getCachedData('selected-datasets');
        setDownloadDatasetsRenderer((data?.[0] as any) || []);
      };
      syncOfflineCacheData();
    }
  }, [manualStatus]);

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

  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data) {
        switch (event.data.type) {
          case 'MANUAL_STATUS_UPDATED':
            dispatch(
              setManualStatus(
                (event.data.payload as boolean) ? 'offline' : 'online'
              )
            );
            break;
          default:
            break;
        }
      }
    };
    const offlineEventListener = () => {
      navigator.serviceWorker.controller?.postMessage({ payload: 'offline' });
    };
    const onlineEventListener = () => {
      navigator.serviceWorker.controller?.postMessage({ payload: 'online' });
    };

    window.addEventListener('online', onlineEventListener);
    window.addEventListener('offline', offlineEventListener);
    navigator.serviceWorker.addEventListener(
      'message',
      handleServiceWorkerMessage
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        'message',
        handleServiceWorkerMessage
      );
      window.removeEventListener('online', onlineEventListener);
      window.removeEventListener('offline', offlineEventListener);
    };
  }, [dispatch]);

  return (
    <div className="p-5 flex flex-col gap-3">
      <h2 className="mb-3">MODE : manualStatus</h2>

      <div className="text-xl font-semibold pt-2">
        현재 상태 : {manualStatus}
      </div>

      <div>
        <button
          className={getButtonClass('offline')}
          onClick={() => handleManualStatusChange('offline')}
        >
          OFFLINE
        </button>
        <button
          className={getButtonClass('online')}
          onClick={() => navigator.onLine && handleManualStatusChange('online')}
        >
          ONLINE
        </button>
      </div>
      {manualStatus !== 'offline' && (
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
