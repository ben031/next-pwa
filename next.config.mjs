import crypto from 'crypto';
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'src/worker/sw.ts',
  swDest: 'public/sw.js',
  cacheOnNavigation: true,
  reloadOnOnline: false,
  additionalPrecacheEntries: [
    {
      url: '/',
      revision: crypto.randomUUID(),
    },
    {
      url: '/test1',
      revision: crypto.randomUUID(),
    },
    {
      url: '/test2',
      revision: crypto.randomUUID(),
    },
    {
      url: '/test4',
      revision: crypto.randomUUID(),
    },
    {
      url: '/test2/inner',
      revision: crypto.randomUUID(),
    },
  ],
});

export default withSerwist({
  // Your Next.js config
});
