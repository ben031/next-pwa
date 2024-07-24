'use client';

import Link from 'next/link';
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
    </main>
  );
}
