import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import onError from 'utility/onError';
import authenticate from 'middleware/authenticate';
import { getNotes, modifyNote, postNotes } from 'controllers/notes';

const handler = nc<ExtendedRequest, NextApiResponse>({ onError });

handler.use(nextConnectDB);
handler.use(authenticate);

handler.get(getNotes);
handler.post(postNotes);
handler.put(modifyNote);

export default handler;
