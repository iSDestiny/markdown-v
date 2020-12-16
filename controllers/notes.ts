import { ExtendedRequest } from 'middleware/connect';
import { NextApiResponse } from 'next';
import CustomStatusError from 'utility/CustomStatusError';

interface NoteRequestBodyI {
    _id: string;
    title: string;
    content: string;
    favorite: boolean;
    tags: Tag[];
}

export const getNotes = async (req: ExtendedRequest, res: NextApiResponse) => {
    const userNotes = await req.user.getNotes();
    res.status(200).json(userNotes);
};

export const postNotes = async (req: ExtendedRequest, res: NextApiResponse) => {
    const { favorite, tags }: { favorite: boolean; tags: Tag[] } = req.body;
    const note = await req.user.addNote(tags, favorite);
    res.status(201).json({ message: 'Added note successfully', note });
};

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

export const toggleFavorite = async (
    req: ExtendedRequest,
    res: NextApiResponse
) => {
    const { id }: { id: string } = req.body;
    const note = await req.user.toggleFavorite(id);
    console.log('toggled favorite!');
    return res.status(200).json({ note });
};

export const setTags = async (req: ExtendedRequest, res: NextApiResponse) => {
    const { _id: id, tags }: NoteRequestBodyI = req.body;
    const note = await req.user.setTags(id, tags);
    console.log('set tags!');
    return res.status(200).json({ note });
};

export const addTag = async (req: ExtendedRequest, res: NextApiResponse) => {
    const { id, tag }: { id: string; tag: string } = req.body;
    const note = await req.user.addTag(id, tag);
    res.status(200).json({ note });
};

export const deleteTag = async (req: ExtendedRequest, res: NextApiResponse) => {
    const { id, tag }: { id: string; tag: string } = req.body;
    const note = await req.user.deleteTag(id, tag);
    console.log('deleted tag!');
    res.status(200).json({ note });
};
