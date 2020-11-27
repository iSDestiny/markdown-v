import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import { INote } from '../models/Note';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import CustomStatusError from '../utility/CustomStatusError';

type noteParamTypes = (
    req: NextApiRequest,
    res: NextApiResponse,
    models: {
        Note: mongoose.Model<INote, {}>;
    }
) => Promise<void>;

export const getNotes: noteParamTypes = async (req, res, models) => {
    const { Note } = models;
    const cookies = new Cookies(req, res);
    const token = cookies.get('ACCESS_TOKEN');
    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError')
            throw new CustomStatusError(err.message, 401);
        throw err;
    }
    const notes = await Note.find();
    return res.json(notes);
};

export const postNotes: noteParamTypes = async (req, res, models) => {
    const { Note } = models;
    const note = new Note({});
    await note.save();
    return res
        .status(201)
        .json({ message: 'Added note successfully', note: note });
};

export const deleteNote: noteParamTypes = async (req, res, models) => {
    const { id } = req.query;
    const { Note } = models;
    const deleted = await Note.findOneAndDelete({ _id: id });
    if (!deleted)
        throw new CustomStatusError(
            'Tried to delete something that does not exist',
            404
        );

    return res.status(200).json({
        message: `Deleted note with id ${deleted._id} successfully`,
        id: deleted._id
    });
};

export const modifyNote: noteParamTypes = async (req, res, models) => {
    const { _id: id, content, title } = req.body;
    const { Note } = models;
    const note = await Note.findById(id);
    if (!note)
        throw new CustomStatusError('Tried to modify a nonexistent note', 404);

    note.content = content;
    note.title = title;
    await note.save();

    return res.status(200).json({
        message: `Modified note with id ${note._id} successfully`,
        note
    });
};
