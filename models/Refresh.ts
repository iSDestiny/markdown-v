import mongoose from 'mongoose';

export interface IRefresh extends mongoose.Document {
    token: string;
}

const refreshSchema = new mongoose.Schema({
    token: String
});

export default refreshSchema;
