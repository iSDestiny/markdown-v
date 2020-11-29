import Cookies from 'cookies';
import { INote } from './../models/Note';
import { IUser } from './../models/User';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CustomStatusError from '../utility/CustomStatusError';

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
