import * as _dateFormat from 'date-fns/format';

export const dateFormat = (date = null, format = 'yyyy-MM-dd HH:mm:ss') => {
  if (date === null || date === undefined) {
    date = new Date(); // eslint-disable-line no-param-reassign
  }
  const t = date instanceof Date ? date : new Date(date);
  // @ts-ignore
  return _dateFormat(t, format);
};
