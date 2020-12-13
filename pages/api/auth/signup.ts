import { postSignup } from 'controllers/auth';
import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import onError from 'utility/onError';
import { body } from 'express-validator';

const handler = nc<ExtendedRequest, NextApiResponse>({ onError });

handler.use(nextConnectDB);

const validateMiddleware = [
    body('email')
        .isEmail()
        .withMessage('Field must be an email address')
        .custom(async (value, { req }) => {
            const { User } = req.models;
            const exists = await User.findOne({ email: value.toLowerCase() });
            if (exists) throw new Error('Email already exists!');
            return true;
        }),
    body('password')
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long')
];

handler.post(...validateMiddleware, postSignup);

export default handler;
