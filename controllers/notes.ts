import { IUser } from './../models/User';
import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import { INote } from '../models/Note';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import CustomStatusError from '../utility/CustomStatusError';
import authenticate from '../middleware/authenticate';

type noteParamTypes = (
    req: NextApiRequest,
    res: NextApiResponse,
    models: {
        Note: mongoose.Model<INote, {}>;
        User: mongoose.Model<IUser, {}>;
    }
) => Promise<void>;

export const getNotes: noteParamTypes = async (req, res, models) => {
    const { User } = models;
    const userId = authenticate(req, res);
    // const notes = await Note.find();
    const user = await User.findById(userId);
    const userNotes = await user.getNotes();
    console.log(userNotes);
    return res.json(userNotes);
};

export const postNotes: noteParamTypes = async (req, res, models) => {
    const { Note, User } = models;
    const userId = authenticate(req, res);
    // const note = new Note({ userId });
    // await note.save();
    const user = await User.findById(userId);
    const note = await user.addNote();
    return res
        .status(201)
        .json({ message: 'Added note successfully', note: note });
};

export const deleteNote: noteParamTypes = async (req, res, models) => {
    const { id } = req.query;
    const { Note, User } = models;
    const userId = authenticate(req, res);
    const user = await User.findById(userId);
    const deleted = await user.deleteNote(id);
    // const deleted = await Note.findOneAndDelete({ _id: id, userId });
    if (!deleted)
        throw new CustomStatusError(
            'Tried to delete something that does not exist',
            404
        );

    return res.status(200).json({
        message: `Deleted note with id ${id} successfully`,
        id: id
    });
};

export const modifyNote: noteParamTypes = async (req, res, models) => {
    const { _id: id, content, title } = req.body;
    const { Note, User } = models;
    // const note = await Note.findById(id);
    const userId = authenticate(req, res);
    const user = await User.findById(userId);
    // const note = user.getNote(id);
    const note = await user.modifyNote(id, content, title);

    // if (!note)
    //     throw new CustomStatusError('Tried to modify a nonexistent note', 404);

    // note.content = content;
    // note.title = title;
    // await note.save();

    console.log('modified');
    return res.status(200).json({
        message: `Modified note with id ${note._id} successfully`,
        note
    });
};
