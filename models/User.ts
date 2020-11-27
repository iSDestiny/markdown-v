import { INote } from './Note';
import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    addNote: (note: INote) => any;
    getNotes: () => any;
    notes?: [
        {
            _id: mongoose.Schema.Types.ObjectId;
            tags: [
                {
                    tag: string;
                }
            ];
            favorite: Boolean;
        }
    ];
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    notes: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Note'
            },
            tags: [
                {
                    tag: {
                        type: String,
                        required: true
                    }
                }
            ],
            favorite: {
                type: Boolean,
                default: false,
                required: true
            }
        }
    ]
});

userSchema.methods.addNote = function (note: INote) {
    this.notes.push({ _id: note, tags: [], favorite: false });
    return this.save();
};

userSchema.methods.getNotes = async function () {
    const user = await this.populate('notes._id').execPopulate();
    const notes = user.notes.map(({ _id: note, favorite, tags }) => {
        const { _id, title, content, createdAt, updatedAt } = note;
        return { _id, title, content, createdAt, updatedAt, favorite, tags };
    });
    return notes;
};

export default userSchema;
