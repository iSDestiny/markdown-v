import { postResetPassword } from 'controllers/auth';
import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import onError from 'utility/onError';

const handler = nc<ExtendedRequest, NextApiResponse>({ onError });

handler.use(nextConnectDB);

handler.post(postResetPassword);

export default handler;
