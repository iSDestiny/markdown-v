import Cookies from 'cookies';
import { INote } from './../models/Note';
import { IUser } from './../models/User';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CustomStatusError from '../utility/CustomStatusError';
import { IRefresh } from '../models/Refresh';

type noteParamTypes = (
    req: NextApiRequest,
    res: NextApiResponse,
    models: {
        Note: mongoose.Model<INote, {}>;
        User: mongoose.Model<IUser, {}>;
        Refresh: mongoose.Model<IRefresh, {}>;
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
    const { User, Refresh } = models;
    const { email, password }: { email: string; password: string } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new CustomStatusError('Invalid email or password', 403);
    const didMatch = await bcrypt.compare(password, user.password);
    if (!didMatch)
        throw new CustomStatusError('Invalid email or password', 403);
    const token = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '20s' }
    );
    const refresh = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.REFRESH,
        { expiresIn: '7d' }
    );
    const newRefresh = new Refresh({ token: refresh });
    await newRefresh.save();
    const cookies = new Cookies(req, res);
    cookies.set('ACCESS_TOKEN', token);
    cookies.set('REFRESH_TOKEN', refresh);
    return res.status(201).json({ message: 'login successful' });
};

export const postRefresh: noteParamTypes = async (req, res, models) => {
    const { Refresh } = models;
    // const { token } = req.body;
    const cookies = new Cookies(req, res);
    const token = cookies.get('REFRESH_TOKEN');
    // console.log(token);
    const check = await Refresh.findOne({ token: token });
    if (!check) throw new CustomStatusError('refresh token not found');

    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.REFRESH);
    } catch (err) {
        if (err.name === 'TokenExpiredError')
            await Refresh.deleteOne({ token: token });
        throw new CustomStatusError(err.message, 401);
    }
    if (!decoded) throw new CustomStatusError('Not authenticated!', 401);
    const { email, userId } = decoded;
    const accessToken = jwt.sign({ email, userId }, process.env.JWT_SECRET, {
        expiresIn: '20s'
    });
    // return res.status(201).json({ token: accessToken });
    return res.status(201).json({ token: accessToken });
};
