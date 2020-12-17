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
    // const userNotes = await req.user.getNotes();
    // res.status(200).json(userNotes);
    const { Note } = req.models;
    const notes = await Note.find({ userId: req.user._id });
    res.status(200).json(notes);
};

export const postNotes = async (req: ExtendedRequest, res: NextApiResponse) => {
    const { favorite, tags }: { favorite: boolean; tags: Tag[] } = req.body;
    const { Note } = req.models;
    // const note = await req.user.addNote(tags, favorite);
    let note = new Note({ favorite, tags, userId: req.user._id });
    note = await note.save();
    res.status(201).json({ message: 'Added note successfully', note });
};

export const deleteNote = async (
    req: ExtendedRequest,
    res: NextApiResponse
) => {
    const { id } = req.query;
    const { Note } = req.models;
    // const deleted = await req.user.deleteNote(id);
    const deleted = await Note.findOneAndDelete({
        userId: req.user._id,
        _id: id
    });
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
    const { Note } = req.models;
    // const note = await req.user.modifyNote(id, content, title);
    let note = await Note.findOne({ _id: id, userId: req.user._id });
    if (!note)
        throw new CustomStatusError('Tried to modify a nonexistent note', 404);
    note.content = content;
    note.title = title;
    note = await note.save();
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
    const { Note } = req.models;
    // const note = await req.user.toggleFavorite(id);
    let note = await Note.findOne({ _id: id, userId: req.user.id });
    if (!note)
        throw new CustomStatusError('Tried to modify a nonexistent note', 404);
    note.favorite = !note.favorite;
    note = await note.save();
    console.log('toggled favorite!');
    return res.status(200).json({ note });
};

export const setTags = async (req: ExtendedRequest, res: NextApiResponse) => {
    const { _id: id, tags }: NoteRequestBodyI = req.body;
    const { Note } = req.models;
    // const note = await req.user.setTags(id, tags);
    let note = await Note.findOne({ _id: id, userId: req.user.id });
    if (!note)
        throw new CustomStatusError('Tried to modify a nonexistent note', 404);
    note.tags = tags;
    note = await note.save();
    console.log('set tags!');
    return res.status(200).json({ note });
};

export const addTag = async (req: ExtendedRequest, res: NextApiResponse) => {
    const { id, tag: newTag }: { id: string; tag: string } = req.body;
    const { Note } = req.models;
    // const note = await req.user.addTag(id, tag);
    let note = await Note.findOne({ _id: id, userId: req.user.id });
    if (!note)
        throw new CustomStatusError('Tried to modify a nonexistent note', 404);
    if (note.tags.find(({ tag }) => tag === newTag))
        throw new CustomStatusError('Tried to add a duplicate tag', 406);
    note.tags.push({ tag: newTag });
    note = await note.save();
    res.status(200).json({ note });
};

export const deleteTag = async (req: ExtendedRequest, res: NextApiResponse) => {
    const { id, tag: toDelete }: { id: string; tag: string } = req.body;
    const { Note } = req.models;
    // const note = await req.user.deleteTag(id, tag);
    let note = await Note.findOne({ _id: id, userId: req.user.id });
    if (!note)
        throw new CustomStatusError('Tried to modify a nonexistent note', 404);
    note.tags = note.tags.filter(({ tag }) => tag !== toDelete);
    note = await note.save();
    console.log('deleted tag!');
    res.status(200).json({ note });
};
