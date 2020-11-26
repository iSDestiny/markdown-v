import React from 'react';
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
    const login: SubmitHandler<LoginFormValues> = async (
        { email, password },
        event
    ) => {
        event.preventDefault();
        const data = await queryCache.fetchQuery(
            ['jwtToken', { email, password }],
            fetchLogin
        );
        console.log(data);
    };

    return <AuthForm type="login" onSubmit={login} />;
}
