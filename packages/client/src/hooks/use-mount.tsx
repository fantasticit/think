import { useEffect, useState } from 'react';

export function useMount(): boolean {
  const [value, setValue] = useState(false);

  useEffect(() => {
    setValue(true);

    return () => {
      setValue(false);
    };
  }, []);

  return value;
}
