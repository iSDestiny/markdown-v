import React from 'react';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Link from 'next/link';
// import classes from '../styles/Authentication.module.scss';
import classNames from 'classnames';
import {
    Typography,
    Avatar,
    Container,
    Box,
    Button,
    Grid,
    TextField
} from '@material-ui/core';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TreeItem } from '@material-ui/lab';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © MarkdownV '}
            {new Date().getFullYear()}
        </Typography>
    );
}

interface AuthFormProps<T> {
    type: String;
    onSubmit: SubmitHandler<T>;
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

export default function AuthForm<T>({ type, onSubmit }: AuthFormProps<T>) {
    const { register, handleSubmit, errors } = useForm<FormInputs>({
        resolver: yupResolver(schema)
    });

    return (
        <Container component="main" maxWidth="xs">
            <div className="auth-container">
                <Avatar>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {type === 'login' ? 'Sign In' : 'Sign Up'}
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
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        inputRef={register}
                        variant="outlined"
                        margin="normal"
                        helperText={errors.password?.message}
                        error={Boolean(errors.password)}
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
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
                            className={classNames({ signup: type !== 'login' })}
                        >
                            <Link href="/signup">Forgot password?</Link>
                        </Grid>
                        <Grid item>
                            <Link
                                href={type === 'login' ? '/signup' : '/login'}
                            >
                                {type !== 'login'
                                    ? `Already have an account? Sign In`
                                    : `Don't have an account? Sign Up`}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}
