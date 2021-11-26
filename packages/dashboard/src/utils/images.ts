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