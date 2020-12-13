import nc from 'next-connect';
import onError from 'utility/onError';
import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import { NextApiResponse } from 'next';
import { postLogin } from 'controllers/auth';

const handler = nc<ExtendedRequest, NextApiResponse>({ onError });

handler.use(nextConnectDB);

handler.post(postLogin);

export default handler;
