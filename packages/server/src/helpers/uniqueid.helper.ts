import { next } from 'nuid';

export function uniqueid() {
  return next();
}
