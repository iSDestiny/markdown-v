import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import AuthForm from '../components/AuthForm';
import { useQueryCache, useQuery } from 'react-query';
import { SubmitHandler } from 'react-hook-form';
import { fetchLogin } from '../utility/fetchAuth';
import { GetServerSideProps } from 'next';
import isUnauthenticated from '../utility/isUnauthenticated';
// import { GetServerSideProps } from 'next';
// import isUnauthenticated from '../utility/isUnauthenticated';

type LoginFormValues = {
    email: string;
    password: string;
};

export default function Login() {
    const queryCache = useQueryCache();
    const [serverError, setServerError] = useState('');

    // const { isSuccess } = useQuery('isAuthenticated', fetchRefresh, {
    //     staleTime: Infinity
    // });

    const login: SubmitHandler<LoginFormValues> = async (
        { email, password },
        event
    ) => {
        event.preventDefault();
        try {
            const data = await queryCache.fetchQuery(
                ['tokens', { email, password }],
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return isUnauthenticated(ctx);
};
