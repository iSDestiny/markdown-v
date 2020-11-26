import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import NoteSchema, { INote } from '../models/Note';
import UserSchema, { IUser } from '../models/User';

export const connect = async () => {
    const connection = await mongoose.createConnection(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const Note = connection.model<INote>('Note', NoteSchema);
    const User = connection.model<IUser>('User', UserSchema);
    return { connection, models: { Note, User } };
};

export type handlerType = (
    req: NextApiRequest,
    res: NextApiResponse,
    connection: mongoose.Connection,
    models: {
        Note: mongoose.Model<INote, {}>;
        User: mongoose.Model<IUser, {}>;
    }
) => void;

export default (handler: handlerType) => async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const { connection, models } = await connect();
    try {
        handler(req, res, connection, models);
    } catch (error) {
        connection.close();
        error.status = error.status || 500;
        res.status(error.status).json({
            error: error.message || 'something went wrong'
        });
    }
};
