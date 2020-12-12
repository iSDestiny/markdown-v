import { IUser } from './../models/User';
import passport from 'passport';
import {
    Strategy as GoogleStrategy,
    VerifyCallback,
    VerifyFunctionWithRequest
} from 'passport-google-oauth2';
import { ExtendedRequest } from './connect';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

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

const callback = async function (
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
) {
    console.log('IN PASSPORT CALLBACK!');
    console.log(profile);
    const { User } = req.models;
    const user: IUser = await User.findOneAndUpdate(
        { email: profile.email },
        { googleId: profile.id, displayName: profile.displayName },
        { upsert: true, new: true }
    );
    console.log(user);
    if (user) done(null, user);
    else
        done(new Error('User was not created'), false, {
            message: 'Invalid google account'
        });
};

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.CLIENT_ORIGIN}/api/auth/google/callback`,
            passReqToCallback: true
        },
        callback
    )
);

passport.serializeUser<IUser, string>((user, done) => done(null, user.id));

passport.deserializeUser<IUser, string, ExtendedRequest>((req, id, done) => {
    const { User } = req.models;
    User.findById(id, (err, user) => done(err, user));
});

export default passport;
