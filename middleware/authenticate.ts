import { NextHandler } from 'next-connect';
import { NextApiResponse } from 'next';
import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import CustomStatusError from '../utility/CustomStatusError';
import { ExtendedRequest } from './connect';

const authenticate = async (
    req: ExtendedRequest,
    res: NextApiResponse,
    next: NextHandler
) => {
    const cookies = new Cookies(req, res);
    const token = cookies.get('ACCESS_TOKEN');
    const { User } = req.models;
    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new CustomStatusError(err.message, 401);
    }
    req.user = await User.findById(decoded.userId);
    if (!req.user) throw new CustomStatusError('user does not exist!', 404);
    return next();
};

export default authenticate;
