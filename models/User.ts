import mongoose from 'mongoose';
import CustomStatusError from '../utility/CustomStatusError';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export interface INote extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId;
    title: string;
    content: string;
    tags: Array<Tag>;
    favorite: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    displayName: string;
    googleId: string;
    githubId: string;
    addNote: (tags?: INote['tags'], favorite?: INote['favorite']) => any;
    getNotes: () => any;
    deleteNote: (id: any) => any;
    modifyNote: (id: string, content: string, title: string) => any;
    toggleFavorite: (id: string) => any;
    changePassword: (newPassword: string) => any;
    setTags: (id: string, tags: Tag[]) => any;
    addTag: (id: string, tag: string) => any;
    deleteTag: (id: string, tagToDelete: string) => any;
    notes?: INote[];
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    displayName: String,
    googleId: String,
    githubId: String,
    notes: [
        {
            type: new mongoose.Schema(
                {
                    title: {
                        type: String,
                        required: true,
                        default: 'Untitled'
                    },
                    content: {
                        type: String,
                        required: true,
                        default: '# Untitled'
                    },
                    tags: [
                        {
                            tag: {
                                type: String,
                                required: true,
                                unique: true
                            }
                        }
                    ],
                    favorite: {
                        type: Boolean,
                        default: false,
                        required: true
                    }
                },
                { timestamps: true }
            )
        }
    ]
});

userSchema.methods.addNote = async function (
    tags?: INote['tags'],
    favorite?: INote['favorite']
) {
    let note: { tags?: Array<Tag>; favorite?: boolean } = {
        tags: [],
        favorite: false
    };
    if (tags) note.tags = tags;
    if (favorite) note.favorite = favorite;
    this.notes.push(note);
    await this.save();
    return this.notes[this.notes.length - 1];
};

userSchema.methods.getNotes = async function () {
    // const user = await this.populate('notes._id').execPopulate();
    // const notes = user.notes.map(({ _id: note, favorite, tags }) => {
    //     const { _id, title, content, createdAt, updatedAt } = note;
    //     return { _id, title, content, createdAt, updatedAt, favorite, tags };
    // });
    return this.notes;
};

userSchema.methods.modifyNote = async function (
    id: string,
    content: string,
    title: string
) {
    const index = this.notes.findIndex(
        (note: INote) => note._id.toString() === id.toString()
    );
    if (index < 0)
        throw new CustomStatusError('Tried to modify a nonexistent note', 404);
    this.notes[index].content = content;
    this.notes[index].title = title;
    await this.save();
    return this.notes[index];
};

userSchema.methods.deleteNote = async function (id: any) {
    this.notes = this.notes.filter(
        (note: IUser['notes'][0]) => note._id.toString() !== id.toString()
    );
    await this.save();
    return id;
};

userSchema.methods.toggleFavorite = async function (id: string) {
    const index = this.notes.findIndex(
        (note: INote) => note._id.toString() === id.toString()
    );
    if (index < 0)
        throw new CustomStatusError('Tried to modify a nonexistent note', 404);
    this.notes[index].favorite = !this.notes[index].favorite;
    await this.save();
    return this.notes[index];
};

userSchema.methods.setTags = async function (id: string, tags: Tag[]) {
    const index = this.notes.findIndex(
        (note: INote) => note._id.toString() === id.toString()
    );
    if (index < 0)
        throw new CustomStatusError('Tried to modify a nonexistent note', 404);
    this.notes[index].tags = tags;
    await this.save();
    return this.notes[index];
};

userSchema.methods.addTag = async function (id: string, tag: string) {
    const index = this.notes.findIndex(
        (note: INote) => note._id.toString() === id.toString()
    );
    if (index < 0)
        throw new CustomStatusError('Tried to modify a nonexistent note', 404);
    this.notes[index].tags.push({ tag });
    await this.save();
    return this.notes[index];
};

userSchema.methods.deleteTag = async function (
    id: string,
    tagToDelete: string
) {
    const index = this.notes.findIndex(
        (note: INote) => note._id.toString() === id.toString()
    );
    if (index < 0)
        throw new CustomStatusError('Tried to modify a nonexistent note', 404);
    this.notes[index].tags = this.notes[index].tags.filter(
        ({ tag }) => tag !== tagToDelete
    );
    await this.save();
    return this.notes[index];
};

userSchema.methods.changePassword = async function (newPassword: string) {
    this.password = newPassword;
    return this.save();
};

export default userSchema;
