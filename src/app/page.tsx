'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
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
