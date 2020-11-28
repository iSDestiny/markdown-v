import React, { useState } from 'react';
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
    TextField,
    Paper,
    InputLabel,
    Input,
    InputAdornment,
    IconButton,
    FormControl,
    OutlinedInput,
    FormHelperText
} from '@material-ui/core';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TreeItem } from '@material-ui/lab';
import { Visibility, VisibilityOff } from '@material-ui/icons';

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
    serverError: string;
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
    serverError
}: AuthFormProps<T>) {
    const { register, handleSubmit, errors } = useForm<FormInputs>({
        resolver: yupResolver(schema)
    });

    const [showPassword, setShowPassword] = useState(false);

    return (
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
                        <FormControl variant="outlined" fullWidth required>
                            <InputLabel htmlFor="standard-adornment-password">
                                Password
                            </InputLabel>
                            <OutlinedInput
                                name="password"
                                inputRef={register}
                                required
                                fullWidth
                                id="password"
                                autoComplete="current-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                        >
                                            {showPassword ? (
                                                <Visibility />
                                            ) : (
                                                <VisibilityOff />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {errors.password && (
                                <FormHelperText
                                    variant="outlined"
                                    required
                                    error={Boolean(errors.password)}
                                    id="password-helper-text"
                                >
                                    {errors.password.message}
                                </FormHelperText>
                            )}
                        </FormControl>
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
                                <Link href="/signup">Forgot password?</Link>
                            </Grid>
                            <Grid item>
                                <Link
                                    href={
                                        type === 'login' ? '/signup' : '/login'
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
    );
}
