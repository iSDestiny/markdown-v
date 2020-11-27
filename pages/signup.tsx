import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import isUnauthenticated from '../utility/isUnauthenticated';
import { GetServerSideProps } from 'next';

type SignUpFormValues = {
    email: string;
    password: string;
};

export default function SignUp() {
    const [serverError, setServerError] = useState('');
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
        } catch ({
            response: {
                data: { message }
            }
        }) {
            console.log(message);
            setServerError(message);
        }
    };
    return (
        <AuthForm type="signup" onSubmit={signup} serverError={serverError} />
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
        await isUnauthenticated(ctx);
    } catch (err) {
        console.log(err);
    }
    return { props: {} };
};
