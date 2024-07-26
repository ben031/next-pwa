import fs from 'fs';
import path from 'path';
import withSerwistInit from '@serwist/next';

function getPages(dir, basePath = '', pages = []) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      getPages(fullPath, path.join(basePath, file), pages);
    } else if (
      (file.endsWith('.js') ||
        file.endsWith('.jsx') ||
        file.endsWith('.ts') ||
        file.endsWith('.tsx')) &&
      !file.includes('layout')
    ) {
      let pagePath = path.join(
        basePath,
        file.replace(/\.(js|jsx|ts|tsx)$/, '')
      );
      if (pagePath.endsWith('/page')) {
        pagePath = pagePath.replace('/page', '');
      }
      pages.push(pagePath === '/index' ? '/' : pagePath);
    }
  });
  return pages;
}

const pages = getPages(path.join(process.cwd(), 'src/app'));

console.log(pages);

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: 'src/worker/sw.ts',
  swDest: 'public/sw.js',
  cacheOnNavigation: true,
  reloadOnOnline: true,
  additionalPrecacheEntries: pages,
});

export default withSerwist({
  // Your Next.js config
});
