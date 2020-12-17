import mongoose from 'mongoose';

export interface INote extends mongoose.Document {
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    tags: Tag[];
    favorite: boolean;
    userId: mongoose.Schema.Types.ObjectId;
}

const noteSchema = new mongoose.Schema(
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
        tags: [{ tag: { type: String, required: true, unique: true } }],
        favorite: {
            type: Boolean,
            default: false,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    { timestamps: true }
);

export default noteSchema;
