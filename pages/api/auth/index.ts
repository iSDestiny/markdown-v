import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import nc from 'next-connect';
import onError from 'utility/onError';
import authenticate from 'middleware/authenticate';
import { NextApiResponse } from 'next';
import { getAuthInfo } from 'controllers/auth';

const handler = nc<ExtendedRequest, NextApiResponse>({ onError });

handler.use(nextConnectDB);
handler.use(authenticate);

handler.get(getAuthInfo);

export default handler;
