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

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © MarkdownV '}
            {new Date().getFullYear()}
        </Typography>
    );
}

export default function AuthForm({ type }: { type: string }) {
    return (
        <Container component="main" maxWidth="xs">
            <div className="auth-container">
                <Avatar>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {type === 'login' ? 'Sign In' : 'Sign Up'}
                </Typography>
                <form className="auth-form" noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
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
                            <Link href="#">Forgot password?</Link>
                        </Grid>
                        <Grid item>
                            <Link href={type === 'login' ? 'signup' : 'login'}>
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
