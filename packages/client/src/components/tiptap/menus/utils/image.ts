export function getImageOriginSize(
  src: string
): Promise<{ width: number | string; height: number | string }> {
  return new Promise((resolve) => {
    const image = document.createElement('img');
    image.onload = function () {
      console.log(image.width, image.height);
      resolve({ width: image.width, height: image.height });
    };
    image.onerror = function () {
      resolve({ width: 'auto', height: 'auto' });
    };
    image.src = src;
  });
}
