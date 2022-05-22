const getUserAgent = (ua = null) => {
  if (!ua) {
    if (typeof window !== 'undefined') {
      ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    }
  }
  return ua;
};

export function isIOS(ua = null) {
  const userAgent = getUserAgent(ua);
  return userAgent && /iPad|iPhone|iPod/.test(userAgent);
}

export function isAndroid(ua = null) {
  const userAgent = getUserAgent(ua);
  return userAgent && /Android/i.test(userAgent);
}

export function isMobile(ua = null) {
  const userAgent = getUserAgent(ua);
  return userAgent && /(iPhone|iPod|iPad|Android|BlackBerry)/i.test(userAgent);
}
