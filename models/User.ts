import mongoose from 'mongoose';
export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    displayName: string;
    googleId: string;
    githubId: string;
    isConfirmed: boolean;
    changePassword: (newPassword: string) => any;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    displayName: String,
    googleId: {
        type: String,
        unique: true
    },
    githubId: {
        type: String,
        unique: true
    },
    isConfirmed: Boolean
});

userSchema.methods.changePassword = async function (newPassword: string) {
    this.password = newPassword;
    return this.save();
};

export default userSchema;
