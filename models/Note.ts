import mongoose from 'mongoose';

export interface INote extends mongoose.Document {
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
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
        }
    },
    { timestamps: true }
);

export default noteSchema;
