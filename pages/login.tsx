import AuthForm from 'components/AuthForm';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useQueryCache } from 'react-query';
import { fetchLogin } from 'utility/fetchAuth';
import isUnauthenticated from 'utility/isUnauthenticated';

type LoginFormValues = {
    email: string;
    password: string;
};

export default function Login() {
    const queryCache = useQueryCache();
    const [isLoading, setIsLoading] = useState(false);
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
            setIsLoading(true);
            await queryCache.fetchQuery(
                ['isAuth', { email, password }],
                fetchLogin
            );
            setIsLoading(false);
            Router.push('/app');
        } catch ({ response }) {
            const { status, data } = response;
            setIsLoading(false);
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
            isLoading={isLoading}
        />
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return isUnauthenticated(ctx);
};
