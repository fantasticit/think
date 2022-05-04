export function isIOS() {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
}

export function isAndroid() {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return /android/i.test(userAgent);
}
