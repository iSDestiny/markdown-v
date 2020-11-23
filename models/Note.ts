import mongoose from 'mongoose';

export interface INote extends mongoose.Document {
    title: string;
    content: string;
}

const noteSchema = new mongoose.Schema({
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
});

export default noteSchema;
