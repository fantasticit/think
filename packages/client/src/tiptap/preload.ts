import { DOCUMENT_COVERS } from '@think/constants';

const preloadImage = (url) => {
  // @ts-ignore
  window.requestIdleCallback =
    window.requestIdleCallback ||
    function (cb) {
      const start = Date.now();
      return setTimeout(function () {
        cb({
          didTimeout: false,
          timeRemaining: function () {
            return Math.max(0, 50 - (Date.now() - start));
          },
        });
      }, 1);
    };

  window.cancelIdleCallback =
    window.cancelIdleCallback ||
    function (id) {
      clearTimeout(id);
    };

  requestIdleCallback(() => {
    const image = document.createElement('img');
    image.src = url;
  });
};

export function preload() {
  if (typeof window === 'undefined') return;
  DOCUMENT_COVERS.forEach(preloadImage);
}
