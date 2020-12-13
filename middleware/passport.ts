import { IUser } from './../models/User';
import passport from 'passport';
import {
    Strategy as GoogleStrategy,
    VerifyCallback
} from 'passport-google-oauth2';
import { Strategy as GithubStrategy } from 'passport-github2';
import { ExtendedRequest } from './connect';

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
    const { User } = req.models;
    const user: IUser = await User.findOneAndUpdate(
        { email: profile.email, googleId: profile.id },
        { displayName: profile.displayName },
        { upsert: true, new: true }
    );
    console.log(user);
    if (user) done(null, user);
    else done(new Error('User was not created'), false);
};

const githubCallback = async function (
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback
) {
    console.log('IN PASSPORT GITHUB CALLBACK!');
    console.log(profile);
    const { User } = req.models;
    const user: IUser = await User.findOneAndUpdate(
        { email: profile.email, githubId: profile.id },
        { displayName: profile.displayName },
        { upsert: true, new: true }
    );
    console.log(user);
    if (user) done(null, user);
    else done(new Error('User was not created'), false);
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
