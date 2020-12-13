import { NextApiRequest, NextApiResponse } from 'next';
import { postLogout } from 'controllers/auth';
import nc from 'next-connect';
import onError from 'utility/onError';

const handler = nc<NextApiRequest, NextApiResponse>({ onError });

handler.post(postLogout);

export default handler;
