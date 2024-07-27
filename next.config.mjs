import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: 'src/worker/sw.ts',
  swDest: 'public/sw.js',
  cacheOnNavigation: true,
  reloadOnOnline: true,
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
      url: '/test2/inner',
      revision: crypto.randomUUID(),
    },
    {
      url: '/test3',
      revision: crypto.randomUUID(),
    },
  ],
});

export default withSerwist({
  // Your Next.js config
});
