import axios from 'axios';
import AuthForm from 'components/AuthForm';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import isUnauthenticated from 'utility/isUnauthenticated';

type SignUpFormValues = {
    email: string;
    password: string;
};

export default function SignUp() {
    const [serverError, setServerError] = useState<{
        type: 'verification' | 'invalidCredentials';
        message: string;
    }>();
    const [isLoading, setIsLoading] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const signup: SubmitHandler<SignUpFormValues> = async (
        { email, password },
        event
    ) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/api/auth/signup`,
                { email, password }
            );
            setIsLoading(false);
            setSignupSuccess(true);
            setServerError(null);
        } catch ({
            response: {
                data: { errors }
            }
        }) {
            setIsLoading(false);
            if (errors && errors.length > 0) {
                console.log(errors);
                setServerError({
                    type: 'invalidCredentials',
                    message: errors[0].msg
                });
            } else {
                setServerError({
                    type: 'invalidCredentials',
                    message: 'Something went wrong please try again'
                });
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
            isLoading={isLoading}
        />
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return isUnauthenticated(ctx);
};
