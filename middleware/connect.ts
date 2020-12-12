import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import NoteSchema, { INote } from 'models/Note';
import RefreshSchema, { IRefresh } from 'models/Refresh';
import UserSchema, { IUser } from 'models/User';
import { NextHandler } from 'next-connect';

export const connect = async () => {
    const connection = await mongoose.createConnection(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const Note = connection.model<INote>('Note', NoteSchema);
    const User = connection.model<IUser>('User', UserSchema);
    const Refresh = connection.model<IRefresh>('Refresh', RefreshSchema);
    return { connection, models: { Note, User, Refresh } };
};

export type handlerType = (
    req: NextApiRequest,
    res: NextApiResponse,
    connection: mongoose.Connection,
    models: {
        Note: mongoose.Model<INote, {}>;
        User: mongoose.Model<IUser, {}>;
        Refresh: mongoose.Model<IRefresh, {}>;
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

export interface ExtendedRequest extends NextApiRequest {
    dbConnection: mongoose.Connection;
    models: {
        User: mongoose.Model<IUser, {}>;
    };
}

export const nextConnectDB = async (
    req: ExtendedRequest,
    res: NextApiResponse,
    next: NextHandler
) => {
    const { connection, models } = await connect();
    req.dbConnection = connection;
    req.models = models;
    return next();
};
