import nc, { NextHandler } from 'next-connect';
import passport from 'middleware/passport';
import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import { NextApiResponse } from 'next';
import cors from 'cors';

const onError = (
    err: any,
    req: ExtendedRequest,
    res: NextApiResponse,
    next: NextHandler
) => {
    console.log(err);
    req.dbConnection.close();
    err.status = err.status || 500;
    res.status(err.status).json({
        error: err.message || 'something went wrong'
    });
};

const handler = nc<ExtendedRequest, NextApiResponse>({ onError });

handler.use(nextConnectDB);
handler.use(cors());
handler.use(passport.initialize());

handler.get(passport.authenticate('google', { scope: ['email', 'profile'] }));

export default handler;
