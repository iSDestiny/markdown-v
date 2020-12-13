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
    const [signupSuccess, setSignupSuccess] = useState(false);
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
            setSignupSuccess(true);
            setServerError('');
        } catch ({
            response: {
                data: { errors }
            }
        }) {
            if (errors && errors.length > 0) {
                console.log(errors);
                setServerError(errors[0].msg);
            } else {
                setServerError(
                    'Something went wrong with the server, please try again'
                );
            }
            setSignupSuccess(false);
        }
    };
    return (
        <AuthForm
            type="signup"
            onSubmit={signup}
            serverError={serverError}
            signupSuccess={signupSuccess}
            setSignupSuccess={setSignupSuccess}
        />
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return isUnauthenticated(ctx);
};
