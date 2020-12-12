import nc, { NextHandler } from 'next-connect';
import cors from 'cors';
import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import passport, { PassportExtendedRequest } from 'middleware/passport';
import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import { NextApiResponse } from 'next';
import CustomStatusError from 'utility/CustomStatusError';

const onError = (
    err: any,
    req: ExtendedRequest,
    res: NextApiResponse,
    next: NextHandler
) => {
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
    (req: PassportExtendedRequest, res) => {
        console.log('IN GOOGLE CALLBACK!');
        console.log(req.user);
        if (!req.user) throw new CustomStatusError('Invalid User', 401);
        const token = jwt.sign(
            { email: req.user.email, userId: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        const cookies = new Cookies(req, res);
        cookies.set('ACCESS_TOKEN', token);
        res.status(303).redirect(`${process.env.CLIENT_ORIGIN}`);
    }
);

export default handler;
