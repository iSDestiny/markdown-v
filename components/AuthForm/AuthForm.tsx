import { yupResolver } from '@hookform/resolvers/yup';
import {
    Avatar,
    Backdrop,
    Box,
    Button,
    Container,
    Fade,
    Grid,
    Modal,
    Paper,
    TextField,
    Typography
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Copyright from '../Copyright';
import classNames from 'classnames';
import Link from 'next/link';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import PasswordField from '../PasswordField';
import classes from './AuthForm.module.scss';

interface AuthFormProps<T> {
    type: String;
    onSubmit: SubmitHandler<T>;
    serverError: string;
    signupSuccess?: boolean;
    setSignupSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormInputs {
    email: string;
    password: string;
}

const schema = yup.object().shape({
    email: yup.string().email('must be an email address').required(),
    password: yup
        .string()
        .min(5, 'password must be at least 5 characters')
        .required()
});

export default function AuthForm<T>({
    type,
    onSubmit,
    serverError,
    signupSuccess = false,
    setSignupSuccess
}: AuthFormProps<T>) {
    const { register, handleSubmit, errors } = useForm<FormInputs>({
        resolver: yupResolver(schema)
    });

    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Container component="main" maxWidth="xs">
                <div className="auth-container">
                    <Paper className="auth-container paper">
                        <Avatar>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            {type === 'login' ? 'Sign In' : 'Sign Up'}
                        </Typography>
                        {serverError && (
                            <Typography
                                variant="body1"
                                style={{
                                    color: '#F44336',
                                    marginBottom: '-1rem',
                                    marginTop: '0.5rem'
                                }}
                            >
                                {serverError}
                            </Typography>
                        )}

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
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                            <PasswordField
                                label="Password"
                                name="password"
                                errors={errors}
                                register={register}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                labelWidth={85}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={{ margin: '1rem 0' }}
                            >
                                {type === 'login' ? 'Sign In' : 'Sign Up'}
                            </Button>
                            <Grid container>
                                <Grid
                                    item
                                    xs
                                    className={classNames({
                                        signup: type !== 'login'
                                    })}
                                >
                                    <Link href="/forgot-password">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link
                                        href={
                                            type === 'login'
                                                ? '/signup'
                                                : '/login'
                                        }
                                    >
                                        {type !== 'login'
                                            ? `Already have an account? Sign In`
                                            : `Don't have an account? Sign Up`}
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={signupSuccess}
                onClose={() => setSignupSuccess(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
            >
                <Fade in={signupSuccess}>
                    <div className={classes['modal-content']}>
                        <h2
                            id="transition-modal-title"
                            className={classes.success}
                        >
                            Thanks! You have been successfully registered.
                        </h2>
                        <p id="transition-modal-description">
                            You can now login with the information you provided
                            in order to start using MarkdownV.
                        </p>
                    </div>
                </Fade>
            </Modal>
        </>
    );
}
