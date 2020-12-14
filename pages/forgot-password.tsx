import axios from 'axios';
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Container
} from '@material-ui/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import classes from '../styles/ForgotPassword.module.scss';
import Link from 'next/link';
import Copyright from '../components/Copyright';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import InfoModal from '../components/InfoModal';
import isUnauthenticated from 'utility/isUnauthenticated';
import { GetServerSideProps } from 'next';

interface FormInputs {
    email: string;
}

const schema = yup.object().shape({
    email: yup.string().email('must be an email address').required()
});

const forgotPassword = () => {
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const { setError, clearErrors, handleSubmit, errors, register } = useForm({
        resolver: yupResolver(schema)
    });

    const modalHeading = 'Successfully sent password reset to provided email!';
    const modalDescription = `Please check your email and follow the instructions
    in order to reset your password. Be aware that the reset
    will only be valid for 30 mins`;

    const onSubmit: SubmitHandler<FormInputs> = async ({ email }, event) => {
        try {
            event.preventDefault();
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/api/auth/reset-password`,
                { email: email.toLowerCase() }
            );
            clearErrors();
            setIsSuccessOpen(true);
        } catch ({ response }) {
            const {
                data: { message },
                status
            } = response;
            clearErrors();
            if (status === 404) {
                setError('email', { type: 'manual', message });
            }
        }
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <div className="auth-container">
                    <Paper className="auth-container paper">
                        <Typography component="h1" variant="h5">
                            Forgot Password
                        </Typography>
                        <form
                            className="auth-form"
                            noValidate
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <TextField
                                inputRef={register}
                                variant="outlined"
                                margin="normal"
                                helperText={errors.email?.message}
                                error={Boolean(errors.email)}
                                required
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                fullWidth
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={{ margin: '1rem 0' }}
                            >
                                Submit
                            </Button>
                        </form>
                        <div className={classes['form-footer']}>
                            <Link href="/login">
                                Remember password? Sign in
                            </Link>
                        </div>
                    </Paper>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
            <InfoModal
                heading={modalHeading}
                description={modalDescription}
                isOpen={isSuccessOpen}
                setIsOpen={setIsSuccessOpen}
            />
        </>
    );
};

export default forgotPassword;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return isUnauthenticated(ctx);
};
