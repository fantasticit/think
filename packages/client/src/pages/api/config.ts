import { getRuntimeConfig } from '@think/config';

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse<Record<string, unknown>>) {
  res.status(200).json(getRuntimeConfig() as Record<string, unknown>);
}
