'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setManualStatus } from '@/stores/networkSlice';
import { RootState } from '@/stores/store';

export default function Home() {
  const dispatch = useDispatch();
  const manualStatus = useSelector(
    (state: RootState) => state.network.manualStatus
  );

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

    window.addEventListener('offline', offlineEventListener);
    window.addEventListener('online', onlineEventListener);

    navigator.serviceWorker.addEventListener(
      'message',
      handleServiceWorkerMessage
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        'message',
        handleServiceWorkerMessage
      );
      window.removeEventListener('offline', offlineEventListener);
      window.removeEventListener('offline', onlineEventListener);
    };
  }, [dispatch]);

  const getButtonClass = (status: string) => {
    const baseClass = 'px-4 py-2 rounded font-semibold ';
    if (manualStatus === status) {
      return `${baseClass} bg-blue-500 text-white`;
    } else {
      return `${baseClass} bg-gray-300 text-gray-700 hover:bg-gray-400`;
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
            href="/test4"
            className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
          >
            Page4
          </Link>
          <Link
            href="/web-serial"
            className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
          >
            web-serial
          </Link>
        </div>
      </div>

      <div className="text-xl font-semibold pt-2">
        현재 상태 : {manualStatus}
      </div>

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
    </main>
  );
}
