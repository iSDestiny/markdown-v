import nc from 'next-connect';
import onError from 'utility/onError';
import authenticate from 'middleware/authenticate';
import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import { NextApiResponse } from 'next';
import { deleteTag } from 'controllers/notes';

const handler = nc<ExtendedRequest, NextApiResponse>({ onError });

handler.use(nextConnectDB);
handler.use(authenticate);

handler.post(deleteTag);

export default handler;
