import React from 'react';
import AuthForm from '../components/AuthForm';
import { SubmitHandler } from 'react-hook-form';
import axios from 'axios';

type SignUpFormValues = {
    email: string;
    password: string;
};

export default function SignUp() {
    const signup: SubmitHandler<SignUpFormValues> = async (
        { email, password },
        event
    ) => {
        event.preventDefault();
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/api/auth/signup`,
                { email, password }
            );
            console.log('success signup');
        } catch (err) {
            console.log(err.res);
        }
    };
    return <AuthForm type="signup" onSubmit={signup} />;
}
