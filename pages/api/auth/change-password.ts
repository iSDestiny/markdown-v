import bcrypt from 'bcrypt';
import { putChangePassword } from 'controllers/auth';
import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import authenticate from 'middleware/authenticate';
import onError from 'utility/onError';
import { body } from 'express-validator';

const handler = nc<ExtendedRequest, NextApiResponse>({ onError });

handler.use(nextConnectDB);
handler.use(authenticate);

const validateMiddleware = [
    body('current-password', 'Invalid Password').custom(
        async (value, { req }) => {
            const userPassword = req.user.password;
            const didMatch = await bcrypt.compare(value, userPassword);
            if (!didMatch) throw new Error('Provided password is incorrect');
            return true;
        }
    ),
    body('confirm-password').custom((value, { req }) => {
        if (value !== req.body['new-password'])
            throw new Error('Passwords did not match!');
        return true;
    }),
    body('new-password')
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long')
        .custom((value, { req }) => {
            if (value === req.body['current-password'])
                throw new Error(
                    'New password cannot be the same as the current password!'
                );
            return true;
        })
];

handler.put(...validateMiddleware, putChangePassword);

export default handler;
