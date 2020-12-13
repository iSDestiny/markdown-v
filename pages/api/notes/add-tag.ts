import nc from 'next-connect';
import onError from 'utility/onError';
import authenticate from 'middleware/authenticate';
import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import { NextApiResponse } from 'next';
import { addTag } from 'controllers/notes';

const handler = nc<ExtendedRequest, NextApiResponse>({ onError });

handler.use(nextConnectDB);
handler.use(authenticate);

handler.post(addTag);

export default handler;
