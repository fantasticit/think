import { dateFormat } from './date.helper';

export const ONE_DAY = 24 * 60 * 60 * 1000;

export function getLogFileName(date: Date | number, offsetDay = 0) {
  return dateFormat(new Date(new Date(date).valueOf() - offsetDay * ONE_DAY), 'yyyy-MM-dd') + '.log';
}
