import mongoose from 'mongoose';

export interface IRefresh extends mongoose.Document {
    token: string;
    accessToken: string;
}

const refreshSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    }
});

export default refreshSchema;
