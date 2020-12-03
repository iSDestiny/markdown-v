import { IUser } from './../models/User';
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

interface NoteRequestBodyI {
    _id: string;
    title: string;
    content: string;
    favorite: boolean;
    tags: any[];
}

export const getNotes: noteParamTypes = async (req, res, models) => {
    const { User } = models;
    const userId = authenticate(req, res);
    const user = await User.findById(userId);
    const userNotes = await user.getNotes();
    console.log(userNotes);
    return res.json(userNotes);
};

export const postNotes: noteParamTypes = async (req, res, models) => {
    const { User } = models;
    const userId = authenticate(req, res);
    const user = await User.findById(userId);
    const note = await user.addNote();
    return res
        .status(201)
        .json({ message: 'Added note successfully', note: note });
};

export const deleteNote: noteParamTypes = async (req, res, models) => {
    const { id } = req.query;
    const { User } = models;
    const userId = authenticate(req, res);
    const user = await User.findById(userId);
    const deleted = await user.deleteNote(id);
    if (!deleted)
        throw new CustomStatusError(
            'Tried to delete something that does not exist',
            404
        );

    return res.status(200).json({
        message: `Deleted note with id ${id} successfully`,
        id
    });
};

export const modifyNote: noteParamTypes = async (req, res, models) => {
    const { _id: id, content, title }: NoteRequestBodyI = req.body;
    const { User } = models;
    const userId = authenticate(req, res);
    const user = await User.findById(userId);
    const note = await user.modifyNote(id, content, title);

    console.log('modified');
    return res.status(200).json({
        message: `Modified note with id ${note._id} successfully`,
        note
    });
};

export const toggleFavorite: noteParamTypes = async (req, res, models) => {
    const { _id: id }: NoteRequestBodyI = req.body;
    const { User } = models;
    const userId = authenticate(req, res);
    const user = await User.findById(userId);
    const toggled = user.toggleFavorite(id);
    console.log('toggled favorite!');
    return res.status(200).json({ id: toggled });
};
