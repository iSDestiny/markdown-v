import nc, { NextHandler } from 'next-connect';
import cors from 'cors';
import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import passport, { PassportExtendedRequest } from 'middleware/passport';
import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import { NextApiResponse } from 'next';
import CustomStatusError from 'utility/CustomStatusError';
import { oauthLogin } from 'controllers/auth';

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

handler.use(cors());
handler.use(nextConnectDB);
handler.use(passport.initialize());

handler.get(
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_ORIGIN}/login`
    }),
    oauthLogin
);

export default handler;
