import { PassportExtendedRequest } from 'middleware/passport';
import Cookies from 'cookies';
import { INote } from './../models/Note';
import { IUser } from './../models/User';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CustomStatusError from '../utility/CustomStatusError';
import authenticate from '../middleware/authenticate';
import { body, validationResult } from 'express-validator';
import runMiddleware from '../middleware/runMiddleware';
import validateMiddleware from '../middleware/validateMiddleware';
import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';
import { ExtendedRequest } from 'middleware/connect';

let transport = nodemailer.createTransport(
    nodemailerSendgrid({ apiKey: process.env.SENDGRID_API_KEY })
);

type noteParamTypes = (
    req: NextApiRequest,
    res: NextApiResponse,
    models: {
        Note: mongoose.Model<INote, {}>;
        User: mongoose.Model<IUser, {}>;
    }
) => Promise<void>;

export const getAuthInfo = (req: ExtendedRequest, res: NextApiResponse) => {
    return res
        .status(200)
        .json({ email: req.user.email, displayName: req.user.displayName });
};

export const postSignup = async (
    req: ExtendedRequest,
    res: NextApiResponse
) => {
    const { User } = req.models;
    const { email, password }: { email: string; password: string } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
    const encryptedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
        email: email.toLowerCase(),
        password: encryptedPassword,
        notes: []
    });
    await newUser.save();
    res.status(201).end();
};

export const postLogin = async (req: ExtendedRequest, res: NextApiResponse) => {
    const { User } = req.models;
    const { email, password }: { email: string; password: string } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new CustomStatusError('Invalid email or password', 403);
    if (!user.password)
        throw new CustomStatusError('Invalid email or password', 403);
    const didMatch = await bcrypt.compare(password, user.password);
    if (!didMatch)
        throw new CustomStatusError('Invalid email or password', 403);
    const token = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    const cookies = new Cookies(req, res);
    cookies.set('ACCESS_TOKEN', token);
    res.status(200).json({ message: 'success' });
};

export const postLogout = async (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = new Cookies(req, res);
    cookies.set('ACCESS_TOKEN');
    res.status(200).end();
};

export const putChangePassword = async (
    req: ExtendedRequest,
    res: NextApiResponse
) => {
    const {
        'new-password': newPassword
    }: { 'new-password': string } = req.body;
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
    const encryptedPassword = await bcrypt.hash(newPassword, 12);
    await req.user.changePassword(encryptedPassword);
    res.status(204).end();
};

export const postResetPassword: noteParamTypes = async (req, res, models) => {
    const { User } = models;
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new CustomStatusError('Email does not exist!', 404);
    const token = jwt.sign(
        { email, userId: user._id },
        process.env.RESET_SECRET,
        { expiresIn: '30m' }
    );

    transport.sendMail({
        to: email,
        from: 'markdownvapp@gmail.com',
        subject: 'Password Reset',
        html: `
            <h1>MarkdownV Password Reset</h1>
            <p>Greetings from MarkdownV! According to our records you have requested for a password reset.
            Please click this <a href="${process.env.CLIENT_ORIGIN}/reset/${token}">link</a> to set up a
            new password. This link is only valid for <strong>30 minutes</strong>, please reset your password
            within this time.</p>
        `
    });

    return res.status(200).json({
        message: 'password reset email was sent to the provided email'
    });
};

// export const postNewPassword: noteParamTypes = async (req, res, models) => {
//     const { User } = models;
//     const { password, token }: { password: string; token: string } = req.body;
//     const validateBody = runMiddleware(
//         validateMiddleware(
//             [
//                 body('password', 'Invalid password')
//                     .isLength({ min: 5 })
//                     .withMessage('Password must be at least 5 characters'),
//                 body('confirm-password', 'Invalid confirm password').custom(
//                     (value, { req }) => {
//                         if (value !== req.body.password)
//                             throw new Error('Passwords did not match!');
//                         return true;
//                     }
//                 )
//             ],
//             validationResult
//         )
//     );
//     await validateBody(req, res);
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//         return res.status(422).json({ errors: errors.array() });

//     let decoded: any;
//     try {
//         decoded = jwt.verify(token, process.env.RESET_SECRET);
//     } catch (err) {
//         throw new CustomStatusError(
//             'Provided token was invalid or has expired, please request another reset',
//             404
//         );
//     }
//     const { userId } = decoded;
//     const user = await User.findById(userId);
//     if (!user)
//         throw new CustomStatusError(
//             'Invalid token, return a nonexistent user',
//             404
//         );

//     const encryptedPassword = await bcrypt.hash(password, 12);
//     await user.changePassword(encryptedPassword);

//     res.status(204).send('successfully changed password');
//     return res.end();
// };

export const postNewPassword = async (
    req: ExtendedRequest,
    res: NextApiResponse
) => {
    const { User } = req.models;
    const { password, token }: { password: string; token: string } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.RESET_SECRET);
    } catch (err) {
        throw new CustomStatusError(
            'Provided token was invalid or has expired, please request another reset',
            404
        );
    }
    const { userId } = decoded;
    const user = await User.findById(userId);
    if (!user)
        throw new CustomStatusError(
            'Invalid token, return a nonexistent user',
            404
        );

    const encryptedPassword = await bcrypt.hash(password, 12);
    await user.changePassword(encryptedPassword);

    res.status(204).send('successfully changed password');
};

export const oauthLogin = (
    req: PassportExtendedRequest,
    res: NextApiResponse
) => {
    console.log('in oauth');
    if (!req.user) throw new CustomStatusError('Invalid User', 401);
    const token = jwt.sign(
        { email: req.user.email, userId: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    const cookies = new Cookies(req, res);
    cookies.set('ACCESS_TOKEN', token);
    res.status(303).redirect(`${process.env.CLIENT_ORIGIN}`);
};
