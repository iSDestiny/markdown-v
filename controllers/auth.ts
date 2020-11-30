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

type noteParamTypes = (
    req: NextApiRequest,
    res: NextApiResponse,
    models: {
        Note: mongoose.Model<INote, {}>;
        User: mongoose.Model<IUser, {}>;
    }
) => Promise<void>;

export const postSignup: noteParamTypes = async (req, res, models) => {
    const { User } = models;
    console.log(req.body);
    const { email, password }: { email: string; password: string } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) throw new CustomStatusError('Email already exists!', 409);
    const encryptedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
        email: email.toLowerCase(),
        password: encryptedPassword,
        notes: []
    });
    await newUser.save();
    return res.status(201).send('success');
};

export const postLogin: noteParamTypes = async (req, res, models) => {
    const { User } = models;
    const { email, password }: { email: string; password: string } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new CustomStatusError('Invalid email or password', 403);
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
    // return res.status(201).json({ message: 'login successful' });
    res.writeHead(302, { Location: '/' });
    return res.end();
};

export const postLogout = async (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = new Cookies(req, res);
    cookies.set('ACCESS_TOKEN');
    res.writeHead(302, { Location: '/login' });
    return res.end();
};

export const putChangePassword: noteParamTypes = async (req, res, models) => {
    const { User } = models;
    const {
        'new-password': newPassword
    }: {
        'new-password': string;
    } = req.body;
    const userId = authenticate(req, res);
    const user = await User.findById(userId);
    if (!user) throw new CustomStatusError('User not found', 404);

    const validateBody = runMiddleware(
        validateMiddleware(
            [
                body('current-password', 'Invalid Password').custom(
                    (value, { req }) => {
                        const userPassword = user.password;
                        const didMatch = bcrypt.compare(value, userPassword);
                        if (!didMatch)
                            throw new Error('Provided password is incorrect');
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
            ],
            validationResult
        )
    );

    await validateBody(req, res);
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

    const encryptedPassword = await bcrypt.hash(newPassword, 12);
    await user.changePassword(encryptedPassword);

    return res.status(204).send('success');
};
