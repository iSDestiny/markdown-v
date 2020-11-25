import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    notes?: [
        {
            noteId: mongoose.Schema.Types.ObjectId;
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
            noteId: {
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

export default userSchema;
