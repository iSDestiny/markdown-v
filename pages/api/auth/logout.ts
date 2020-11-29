import { NextApiRequest, NextApiResponse } from 'next';

import { postLogout } from './../../../controllers/auth';
import CustomStatusError from '../../../utility/CustomStatusError';

const logout = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;

    try {
        switch (method) {
            case 'POST':
                console.log('in post login');
                return await postLogout(req, res);
            default:
                throw new CustomStatusError('Invalid http method', 405);
        }
    } catch (error) {
        console.log(error);
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: error.message });
    }
};

export const config = {
    api: {
        externalResolver: true
    }
};

export default logout;
