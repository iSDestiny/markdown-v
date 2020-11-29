import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import CustomStatusError from '../utility/CustomStatusError';

export default (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = new Cookies(req, res);
    const token = cookies.get('ACCESS_TOKEN');
    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new CustomStatusError(err.message, 401);
    }
    return decoded.userId;
};
