import mongoose from 'mongoose';
export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    displayName: string;
    isConfirmed: boolean;
    changePassword: (newPassword: string) => any;
}

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    githubId: String,
    googleId: String,
    displayName: String,
    isConfirmed: Boolean
});

userSchema.methods.changePassword = async function (newPassword: string) {
    this.password = newPassword;
    return this.save();
};

export default userSchema;
