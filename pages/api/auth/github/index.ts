import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import { NextApiResponse } from 'next';
import passport from 'middleware/passport';
import nc, { NextHandler } from 'next-connect';

const onError = (
    err: any,
    req: ExtendedRequest,
    res: NextApiResponse,
    next: NextHandler
) => {
    console.log(err);
    req.dbConnection.close();
    res.status(303).redirect(`${process.env.CLIENT_ORIGIN}/login`);
};

const handler = nc<ExtendedRequest, NextApiResponse>({ onError });

handler.use(nextConnectDB);
handler.use(passport.initialize());

handler.get(
    passport.authenticate('github', { scope: ['user:email', 'email'] })
);

export default handler;
