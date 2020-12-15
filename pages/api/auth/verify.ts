import nc from 'next-connect';
import onError from 'utility/onError';
import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import { NextApiResponse } from 'next';
import { verifyEmail } from 'controllers/auth';

const handler = nc<ExtendedRequest, NextApiResponse>({ onError });

handler.use(nextConnectDB);

handler.post(verifyEmail);

export default handler;
