import mongoose from 'mongoose';
import CustomStatusError from '../utility/CustomStatusError';
export interface INote extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId;
    title: string;
    content: string;
    tags: [
        {
            tag: string;
        }
    ];
    favorite: Boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    addNote: () => any;
    getNotes: () => any;
    deleteNote: (id: any) => any;
    modifyNote: (id: string, content: string, title: string) => any;
    toggleFavorite: (id: string) => any;
    changePassword: (newPassword: string) => any;
    notes?: INote[];
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
            type: new mongoose.Schema(
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
                },
                { timestamps: true }
            )
        }
    ]
});

userSchema.methods.addNote = async function () {
    this.notes.push({ tags: [] });
    await this.save();
    return this.notes[this.notes.length - 1];
};

userSchema.methods.getNotes = async function () {
    // const user = await this.populate('notes._id').execPopulate();
    // const notes = user.notes.map(({ _id: note, favorite, tags }) => {
    //     const { _id, title, content, createdAt, updatedAt } = note;
    //     return { _id, title, content, createdAt, updatedAt, favorite, tags };
    // });
    return this.notes;
};

userSchema.methods.modifyNote = async function (
    id: string,
    content: string,
    title: string
) {
    const index = this.notes.findIndex(
        (note: INote) => note._id.toString() === id.toString()
    );
    if (index < 0)
        throw new CustomStatusError('Tried to modify a nonexistent note', 404);
    this.notes[index].content = content;
    this.notes[index].title = title;
    await this.save();
    return this.notes[index];
};

userSchema.methods.deleteNote = async function (id: any) {
    this.notes = this.notes.filter(
        (note: IUser['notes'][0]) => note._id.toString() !== id.toString()
    );
    await this.save();
    return id;
};

userSchema.methods.toggleFavorite = async function (id: string) {
    const index = this.notes.findIndex(
        (note: INote) => note._id.toString() === id.toString()
    );
    if (index < 0)
        throw new CustomStatusError('Tried to modify a nonexistent note', 404);
    this.notes[index].favorite = !this.notes[index].favorite;
    await this.save();
    return id;
};

userSchema.methods.changePassword = async function (newPassword: string) {
    this.password = newPassword;
    return this.save();
};

export default userSchema;
