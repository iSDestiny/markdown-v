import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useQueryCache } from 'react-query';
import { SubmitHandler } from 'react-hook-form';
import { fetchLogin } from '../utility/fetchAuth';

type LoginFormValues = {
    email: string;
    password: string;
};

export default function Login() {
    const queryCache = useQueryCache();
    const [serverError, setServerError] = useState('');

    const login: SubmitHandler<LoginFormValues> = async (
        { email, password },
        event
    ) => {
        event.preventDefault();
        try {
            const data = await queryCache.fetchQuery(
                ['jwtToken', { email, password }],
                fetchLogin
            );
            console.log(data);
        } catch ({
            response: {
                data: { message }
            }
        }) {
            console.log(message);
            setServerError(message);
        }
    };

    return <AuthForm type="login" onSubmit={login} serverError={serverError} />;
}
