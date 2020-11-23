import { INote } from './../models/Note';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import CustomStatusError from '../utility/CustomStatusError';

export const getNotes = async (
    req: NextApiRequest,
    res: NextApiResponse,
    models: {
        Note: mongoose.Model<INote, {}>;
    }
) => {
    const { Note } = models;
    const notes = await Note.find();
    return res.json(notes);
};

export const postNotes = async (
    req: NextApiRequest,
    res: NextApiResponse,
    models: {
        Note: mongoose.Model<INote, {}>;
    }
) => {
    const { Note } = models;
    const note = new Note({});
    await note.save();
    return res
        .status(201)
        .json({ message: 'Added note successfully', note: note });
};

export const deleteNote = async (
    req: NextApiRequest,
    res: NextApiResponse,
    models: {
        Note: mongoose.Model<INote, {}>;
    }
) => {
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

export const modifyNote = async (
    req: NextApiRequest,
    res: NextApiResponse,
    models: {
        Note: mongoose.Model<INote, {}>;
    }
) => {
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
        ...note
    });
};
