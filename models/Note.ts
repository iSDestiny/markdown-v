import mongoose from 'mongoose';

export interface INote extends mongoose.Document {
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    { timestamps: true }
);

export default noteSchema;
