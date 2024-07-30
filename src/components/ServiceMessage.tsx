'use client';

import { useEffect, useRef, useState } from 'react';

const ServiceMessage = () => {
  const serviceWorkerControllerRef = useRef<ServiceWorker | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!serviceWorkerControllerRef.current) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log(
              'Service Worker registered with scope:',
              registration.scope
            );

            // 서비스 워커가 활성화될 때까지 기다립니다.
            navigator.serviceWorker.ready.then((registration) => {
              if (navigator.serviceWorker.controller) {
                serviceWorkerControllerRef.current =
                  navigator.serviceWorker.controller;
                // 메시지를 서비스 워커에 보냅니다.
                navigator.serviceWorker.controller.postMessage({
                  type: 'INIT',
                  payload: 'Hello from the main script!',
                });
                serviceWorkerControllerRef.current.postMessage({
                  type: 'sync',
                  payload: 'sync!',
                });
              }
            });
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      }
      return;
    }

    serviceWorkerControllerRef.current.postMessage({
      type: 'sync',
      payload: 'sync!',
    });
  }, [isOnline]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
};

export default ServiceMessage;
