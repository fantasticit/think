import { dateFormat } from './date.helper';

describe('date.helper.ts', () => {
  it('dateFormat)', () => {
    const d = dateFormat(1652691643484);
    return expect(d).toBe('2022-05-16 17:00:43');
  });
});
