import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import AuthForm from '../components/AuthForm';
import { useQueryCache, useQuery } from 'react-query';
import { SubmitHandler } from 'react-hook-form';
import { fetchLogin } from '../utility/fetchAuth';
import { GetServerSideProps } from 'next';
import isUnauthenticated from '../utility/isUnauthenticated';

type LoginFormValues = {
    email: string;
    password: string;
};

export default function Login() {
    const queryCache = useQueryCache();
    const [email, setEmail] = useState('');
    const [serverError, setServerError] = useState<{
        type: 'verification' | 'invalidCredentials';
        message: string;
    }>();

    const login: SubmitHandler<LoginFormValues> = async (
        { email, password },
        event
    ) => {
        event.preventDefault();
        try {
            await queryCache.fetchQuery(
                ['isAuth', { email, password }],
                fetchLogin
            );
            Router.push('/');
        } catch ({ response }) {
            const { status, data } = response;
            if (status === 401)
                setServerError({
                    type: 'invalidCredentials',
                    message: data.message
                });
            else if (status === 403) {
                setServerError({ type: 'verification', message: data.message });
                setEmail(email);
            }
            queryCache.setQueryData('isAuth', false);
        }
    };

    return (
        <AuthForm
            type="login"
            onSubmit={login}
            serverError={serverError}
            email={email}
        />
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return isUnauthenticated(ctx);
};
