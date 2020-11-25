import { INote } from './../models/Note';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

type noteParamTypes = (
    req: NextApiRequest,
    res: NextApiResponse,
    models: {
        Note: mongoose.Model<INote, {}>;
    }
) => Promise<void>;

export const postSignup: noteParamTypes = async (req, res, models) => {
    const { email, password }: { email: string; password: string } = req.body;
};
