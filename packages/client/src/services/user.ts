import type { IPagination, IUser } from '@think/domains';
import { HttpClient } from './http-client';

export const register = (data: Partial<IUser>): Promise<IUser> => {
  return HttpClient.post('/user/register', data);
};

export const getUsers = (): Promise<IUser[]> => {
  return HttpClient.get('/user');
};
