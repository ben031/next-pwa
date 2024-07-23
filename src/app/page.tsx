'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            'ServiceWorker registration successful with scope: ',
            registration.scope
          );
        })
        .catch((error) => {
          console.log('ServiceWorker registration failed: ', error);
        });
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      ㅋㅋㅋㅋㅋㅋㅋㅋㅋ
    </main>
  );
}
