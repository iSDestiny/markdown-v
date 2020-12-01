import { Container, Box, Button, Paper, Typography } from '@material-ui/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import addServerErrors from '../../utility/addServerErrors';
import classes from '../../styles/ForgotPassword.module.scss';
import Link from 'next/link';
import Copyright from '../../components/Copyright';
import PasswordField from '../../components/PasswordField';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface FormInput {
    password: string;
    'confirm-password': string;
}

const schema = yup.object().shape({
    password: yup.string().min(5, 'Must be at least 5 characters long!'),
    ['confirm-password']: yup
        .string()
        .min(5, 'Must be at least 5 characters long!')
        .oneOf([yup.ref('password'), null], 'Passwords do not match!')
});

const ResetPasswordNew = () => {
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState('');
    const [tokenError, setTokenError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { handleSubmit, register, clearErrors, errors, setError } = useForm({
        resolver: yupResolver(schema)
    });

    const { token } = router.query;

    const onSubmit: SubmitHandler<FormInput> = async (
        { password, 'confirm-password': confirmPassword },
        event
    ) => {
        event.preventDefault();
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/api/auth/new-password`,
                { password, ['confirm-password']: confirmPassword, token }
            );
            clearErrors();
            setTokenError('');
            setSuccessMessage(
                'Password successfully reset to provided password, you can now login'
            );
        } catch ({ response }) {
            const { data, status } = response;
            clearErrors();
            setSuccessMessage('');
            setTokenError('');
            console.log(response);
            if (status === 422) addServerErrors(data.errors, setError);
            if (status === 404) setTokenError(data.message);
        }
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <div className="auth-container">
                    <Paper className="auth-container paper">
                        <Typography component="h1" variant="h5">
                            Reset Password
                        </Typography>
                        {tokenError && (
                            <Typography
                                variant="body1"
                                style={{
                                    color: '#F44336',
                                    marginBottom: '-1rem',
                                    margin: '0.5rem 0',
                                    textAlign: 'center'
                                }}
                            >
                                {tokenError}
                            </Typography>
                        )}
                        {successMessage && (
                            <Typography
                                variant="body1"
                                style={{
                                    color: '#6bbc65',
                                    marginBottom: '-1rem',
                                    margin: '0.5rem 0',
                                    textAlign: 'center'
                                }}
                            >
                                {successMessage}
                            </Typography>
                        )}
                        <form
                            className="auth-form"
                            noValidate
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <PasswordField
                                name="password"
                                label="Password"
                                register={register}
                                errors={errors}
                                labelWidth={85}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                style={{ marginBottom: '0.7rem' }}
                            />
                            <PasswordField
                                name="confirm-password"
                                label="Confirm Password"
                                register={register}
                                errors={errors}
                                labelWidth={148}
                                showPassword={showConfirmPassword}
                                setShowPassword={setShowConfirmPassword}
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
                                Remember password or reset successfully? Sign in
                            </Link>
                        </div>
                    </Paper>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
};

export default ResetPasswordNew;
