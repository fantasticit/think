import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as timeagojs from 'timeago.js';

type Props = {
  date: string | number | Date;
};

let callbacks: Array<() => void> = [];

setInterval(() => {
  callbacks.forEach((cb) => cb());
}, 1000 * 60);

function eachMinute(fn: () => void) {
  callbacks.push(fn);

  return () => {
    callbacks = callbacks.filter((cb) => cb !== fn);
  };
}

const getTimeago = (date: number | string | Date) => {
  return timeagojs.format(date, 'zh_CN');
};

export const LocaleTime: React.FC<Props> = ({ date }) => {
  const [, setMinutesMounted] = useState(0);
  const callback = useRef<() => void>();
  const formatDate = useMemo(() => new Date(date).toLocaleDateString(), [date]);

  useEffect(() => {
    callback.current = eachMinute(() => {
      setMinutesMounted((state) => ++state);
    });

    return () => {
      if (callback.current) {
        callback.current();
      }
    };
  }, []);

  return <time dateTime={formatDate}>{getTimeago(date)}</time>;
};
