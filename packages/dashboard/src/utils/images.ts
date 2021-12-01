import { AccountData } from '@components/Tables/AccountsTable';

export default {};

export const preloadImage = (src: string) => {
  let cache = document.createElement('cache');

  cache.setAttribute(
    'style',
    'position: fixed; z-index: -1000; opacity: 0;',
  );

  document.body.appendChild(cache);

  prefetch(src);

  return new Promise((resolve) => {
    const image = new Image();
    // TODO: the images from serve are too big, not optimised
    // should optimise client side? and pass optimised buffer?
    image.onload = () => resolve(image);
    image.onerror = () => {
      console.log(`Oops! Failed to load ${src}`);

      return resolve(false);
    };
    image.src = src;

    cache.appendChild(image);
  })
}


const prefetch = (src: string) => {
  let res = document.createElement('link');
  res.rel = 'preload';
  res.as = 'image';
  res.href = src;

  document.head.appendChild(res);
};

const PRE_FETCH_DAB_INDEX_COUNT = 10;

export const preloadPageDataImages = async ({
  pageData,
}: {
  pageData: AccountData[],
}) => {
  // Preload the first top images
  // controlled by the value set in PRE_FETCH_DAB_INDEX_COUNT
  let promises: any = [];

  for (let i = 0; i < PRE_FETCH_DAB_INDEX_COUNT; i++) {
    const logoUrl = pageData[i]?.dabCanister?.metadata?.logo_url;

    if (!logoUrl) continue;

    promises.push(
      preloadImage(logoUrl)
    );
  }

  const result = await Promise.all(promises);

  console.warn(`Nice! Preloaded ${result.length} images.`);
}
