import { postNewPassword } from 'controllers/auth';
import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import onError from 'utility/onError';
import { body } from 'express-validator';

const handler = nc<ExtendedRequest, NextApiResponse>({ onError });

handler.use(nextConnectDB);

const validateMiddleware = [
    body('password', 'Invalid password')
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters'),
    body('confirm-password', 'Invalid confirm password').custom(
        (value, { req }) => {
            if (value !== req.body.password)
                throw new Error('Passwords did not match!');
            return true;
        }
    )
];

handler.post(...validateMiddleware, postNewPassword);

export default handler;
