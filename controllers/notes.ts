import { IUser } from './../models/User';
import { INote } from '../models/Note';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import CustomStatusError from '../utility/CustomStatusError';
import authenticate from '../middleware/authenticate';
import { ExtendedRequest } from 'middleware/connect';

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
    tags: Tag[];
}

// export const getNotes: noteParamTypes = async (req, res, models) => {
//     const { User } = models;
//     const userId = authenticate(req, res);
//     const user = await User.findById(userId);
//     const userNotes = await user.getNotes();
//     console.log(userNotes);
//     return res.json(userNotes);
// };
export const getNotes = async (req: ExtendedRequest, res: NextApiResponse) => {
    const userNotes = await req.user.getNotes();
    console.log(userNotes);
    res.status(200).json(userNotes);
};

// export const postNotes: noteParamTypes = async (req, res, models) => {
//     const { User } = models;
//     const {
//         favorite,
//         tags
//     }: { favorite: boolean; tags: Array<Tag> } = req.body;
//     const userId = authenticate(req, res);
//     const user = await User.findById(userId);
//     const note = await user.addNote(tags, favorite);
//     return res
//         .status(201)
//         .json({ message: 'Added note successfully', note: note });
// };

export const postNotes = async (req: ExtendedRequest, res: NextApiResponse) => {
    const { favorite, tags }: { favorite: boolean; tags: Tag[] } = req.body;
    const note = await req.user.addNote(tags, favorite);
    res.status(201).json({ message: 'Added note successfully', note });
};

// export const deleteNote: noteParamTypes = async (req, res, models) => {
//     const { id } = req.query;
//     const { User } = models;
//     const userId = authenticate(req, res);
//     const user = await User.findById(userId);
//     const deleted = await user.deleteNote(id);
//     if (!deleted)
//         throw new CustomStatusError(
//             'Tried to delete something that does not exist',
//             404
//         );

//     return res.status(200).json({
//         message: `Deleted note with id ${id} successfully`,
//         id
//     });
// };

export const deleteNote = async (
    req: ExtendedRequest,
    res: NextApiResponse
) => {
    const { id } = req.query;
    const deleted = await req.user.deleteNote(id);
    if (!deleted)
        throw new CustomStatusError(
            'Tried to delete something that does not exist!',
            404
        );
    return res
        .status(200)
        .json({ message: `Deleted note with id ${id} successfully`, id });
};

// export const modifyNote: noteParamTypes = async (req, res, models) => {
//     const { _id: id, content, title }: NoteRequestBodyI = req.body;
//     const { User } = models;
//     const userId = authenticate(req, res);
//     const user = await User.findById(userId);
//     const note = await user.modifyNote(id, content, title);

//     console.log('modified');
//     return res.status(200).json({
//         message: `Modified note with id ${note._id} successfully`,
//         note
//     });
// };

export const modifyNote = async (
    req: ExtendedRequest,
    res: NextApiResponse
) => {
    const { _id: id, content, title }: NoteRequestBodyI = req.body;
    const note = await req.user.modifyNote(id, content, title);
    console.log('modified!');
    res.status(200).json({
        message: `Modified note with id ${id} successfully`,
        note
    });
};

// export const toggleFavorite: noteParamTypes = async (req, res, models) => {
//     const { id }: { id: string } = req.body;
//     const { User } = models;
//     const userId = authenticate(req, res);
//     const user = await User.findById(userId);
//     const note = await user.toggleFavorite(id);
//     console.log('toggled favorite!');
//     return res.status(200).json({ note });
// };

export const toggleFavorite = async (
    req: ExtendedRequest,
    res: NextApiResponse
) => {
    const { id }: { id: string } = req.body;
    const note = await req.user.toggleFavorite(id);
    console.log('toggled favorite!');
    return res.status(200).json({ note });
};

// export const setTags: noteParamTypes = async (req, res, models) => {
//     const { _id: id, tags }: NoteRequestBodyI = req.body;
//     console.log(id, tags);
//     const { User } = models;
//     const userId = authenticate(req, res);
//     const user = await User.findById(userId);
//     const note = await user.setTags(id, tags);
//     console.log('set tags!');
//     return res.status(200).json({ note });
// };

export const setTags = async (req: ExtendedRequest, res: NextApiResponse) => {
    const { _id: id, tags }: NoteRequestBodyI = req.body;
    const note = await req.user.setTags(id, tags);
    console.log('set tags!');
    return res.status(200).json({ note });
};

// export const addTag: noteParamTypes = async (req, res, models) => {
//     const { id, tag }: { id: string; tag: string } = req.body;
//     const { User } = models;
//     const userId = authenticate(req, res);
//     const user = await User.findById(userId);
//     const note = await user.addTag(id, tag);
//     console.log('added tag');
//     return res.status(200).json({ note });
// };

export const addTag = async (req: ExtendedRequest, res: NextApiResponse) => {
    const { id, tag }: { id: string; tag: string } = req.body;
    const note = await req.user.addTag(id, tag);
    res.status(200).json({ note });
};

// export const deleteTag: noteParamTypes = async (req, res, models) => {
//     const { id, tag }: { id: string; tag: string } = req.body;
//     const { User } = models;
//     const userId = authenticate(req, res);
//     const user = await User.findById(userId);
//     const note = await user.deleteTag(id, tag);
//     console.log('deleted tag');
//     return res.status(200).json({ note });
// };

export const deleteTag = async (req: ExtendedRequest, res: NextApiResponse) => {
    const { id, tag }: { id: string; tag: string } = req.body;
    const note = await req.user.deleteTag(id, tag);
    console.log('deleted tag!');
    res.status(200).json({ note });
};
