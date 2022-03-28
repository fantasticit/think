import React, { useEffect, useState } from 'react';

interface INetworkStatus {
  online: boolean;
}

export const useNetwork = () => {
  const [networkState, setNetworkState] = useState<INetworkStatus>({ online: navigator.onLine });

  useEffect(() => {
    const handleOnline = () => {
      setNetworkState((prevState) => ({
        ...prevState,
        online: true,
      }));
    };

    const handleOffline = () => {
      setNetworkState((prevState) => ({
        ...prevState,
        online: false,
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return networkState;
};
