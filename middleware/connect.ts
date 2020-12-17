import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import NoteSchema, { INote } from 'models/Note';
import UserSchema, { IUser } from 'models/User';
import { NextHandler } from 'next-connect';

export const connect = async () => {
    const connection = await mongoose.createConnection(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const Note = connection.model<INote>('Note', NoteSchema);
    const User = connection.model<IUser>('User', UserSchema);
    return { connection, models: { Note, User } };
};

export interface ExtendedRequest extends NextApiRequest {
    dbConnection: mongoose.Connection;
    models: {
        User: mongoose.Model<IUser, {}>;
        Note: mongoose.Model<INote, {}>;
    };
    user: IUser;
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
