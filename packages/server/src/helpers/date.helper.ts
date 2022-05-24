import { format as dateFormatFn } from 'date-fns';

export const dateFormat = (date = null, format = 'yyyy-MM-dd HH:mm:ss') => {
  if (date === null || date === undefined) {
    date = new Date(); // eslint-disable-line no-param-reassign
  }

  const t = date instanceof Date ? date : new Date(date);

  return dateFormatFn(t, format);
};

export const convertDateToMysqlTimestamp = (time) => {
  const date = new Date(time);
  return (
    date.getUTCFullYear() +
    '-' +
    ('00' + (date.getUTCMonth() + 1)).slice(-2) +
    '-' +
    ('00' + date.getUTCDate()).slice(-2) +
    ' ' +
    ('00' + date.getUTCHours()).slice(-2) +
    ':' +
    ('00' + date.getUTCMinutes()).slice(-2) +
    ':' +
    ('00' + date.getUTCSeconds()).slice(-2)
  );
};
