import type { IUser } from '@think/domains';
import { HttpClient } from './HttpClient';

export const register = (data: Partial<IUser>): Promise<IUser> => {
  return HttpClient.post('/user/register', data);
};
