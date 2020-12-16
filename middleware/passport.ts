import { IUser } from './../models/User';
import passport from 'passport';
import {
    Strategy as GoogleStrategy,
    VerifyCallback
} from 'passport-google-oauth2';
import { Strategy as GithubStrategy } from 'passport-github2';
import { ExtendedRequest } from './connect';
import mongoose from 'mongoose';

export interface PassportExtendedRequest extends ExtendedRequest {
    user: IUser;
}

interface GoogleProfile {
    provider: 'google';
    id: string;
    name: string;
    displayName: string;
    email: string;
}

const googleCallback = async function (
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback
) {
    console.log('IN PASSPORT CALLBACK!');
    // console.log(profile);
    try {
        const { User }: { User: mongoose.Model<IUser, {}> } = req.models;
        const user = await User.findOne({ email: profile.email.toLowerCase() });
        if (!user) {
            const newUser = new User({
                email: profile.email.toLowerCase(),
                googleId: profile.id,
                displayName: profile.displayName,
                isConfirmed: true
            });
            await newUser.save();
            done(null, newUser);
        } else done(null, user);
    } catch (err) {
        done(err, null);
    }
};

const githubCallback = async function (
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
) {
    console.log(profile);
    try {
        const { User }: { User: mongoose.Model<IUser, {}> } = req.models;
        const newEmail =
            profile.emails && profile.emails.length > 0
                ? profile.emails[0].value.toLowerCase()
                : '';
        const user = await User.findOne({
            $or: [{ email: newEmail }, { githubId: profile.id }]
        });
        if (!user) {
            const newUser = new User({
                email: newEmail,
                githubId: profile.id,
                displayName: profile.displayName,
                isConfirmed: true
            });
            await newUser.save();
            done(null, newUser);
        } else done(null, user);
    } catch (err) {
        done(err, null);
    }
};

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.CLIENT_ORIGIN}/api/auth/google/callback`,
            passReqToCallback: true
        },
        googleCallback
    )
);

passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.CLIENT_ORIGIN}/api/auth/github/callback`,
            passReqToCallback: true
        },
        githubCallback
    )
);

passport.serializeUser<IUser, string>((user, done) => done(null, user.id));

passport.deserializeUser<IUser, string, ExtendedRequest>((req, id, done) => {
    const { User } = req.models;
    User.findById(id, (err, user) => done(err, user));
});

export default passport;
