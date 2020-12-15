import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import {
    Backdrop,
    Box,
    Button,
    Container,
    Fade,
    Grid,
    Modal,
    Paper,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core';
import { useRouter } from 'next/router';
import Copyright from '../Copyright';
import classNames from 'classnames';
import Link from 'next/link';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import PasswordField from '../PasswordField';
import classes from './AuthForm.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';

interface AuthFormProps<T> {
    type: String;
    onSubmit: SubmitHandler<T>;
    serverError: {
        type: 'verification' | 'invalidCredentials';
        message: string;
    };
    signupSuccess?: boolean;
    setSignupSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
    email?: string;
}

interface FormInputs {
    email: string;
    password: string;
}

const schema = yup.object().shape({
    email: yup.string().email('must be an email address').required(),
    password: yup.string().min(5, 'password must be at least 5 characters')
});

export default function AuthForm<T>({
    type,
    onSubmit,
    serverError,
    signupSuccess = false,
    setSignupSuccess,
    email
}: AuthFormProps<T>) {
    const [sentOpenType, setSendOpenType] = useState<'success' | 'failed' | ''>(
        ''
    );
    const { register, handleSubmit, errors, reset } = useForm<FormInputs>({
        resolver: yupResolver(schema)
    });
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const onCloseModal = () => {
        setSignupSuccess(false);
        reset();
    };

    const onConfirmModal = () => {
        router.push('login');
    };

    const sendEmail = async () => {
        try {
            await axios.post('api/auth/verification', { email });
            setSendOpenType('success');
        } catch ({ response }) {
            setSendOpenType('failed');
        }
    };

    const sendEmailLink = (
        <a className={classes.email} onClick={sendEmail}>
            here
        </a>
    );

    return (
        <>
            <Container component="main" maxWidth="xs">
                <div className="auth-container">
                    <Paper className="auth-container paper">
                        <div className={classes.header}>
                            <Image
                                src="/markdownv.svg"
                                alt="MarkdownV logo"
                                width={70}
                                height={70}
                            />
                            <h1>MarkdownV</h1>
                        </div>
                        {serverError && (
                            <Typography
                                variant="body1"
                                style={{
                                    color: '#F44336',
                                    marginBottom: '-1rem',
                                    marginTop: '0.5rem'
                                }}
                            >
                                {serverError.type === 'invalidCredentials' ? (
                                    serverError.message
                                ) : (
                                    <>
                                        <span>
                                            Your email has not been verified
                                            yet, click
                                        </span>
                                        {sendEmailLink}
                                        <span>to send again</span>
                                    </>
                                )}
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
                        <p className={classes.alternative}>
                            or you can sign in with
                        </p>
                        <div className={classes.oauth}>
                            <Tooltip title="Sign in with Google">
                                <a
                                    className={classes.google}
                                    href="/api/auth/google"
                                >
                                    <FontAwesomeIcon icon={faGoogle} />
                                </a>
                            </Tooltip>
                            <Tooltip title="Sign in with Github">
                                <a
                                    className={classes.github}
                                    href="/api/auth/github"
                                >
                                    <FontAwesomeIcon icon={faGithub} />
                                </a>
                            </Tooltip>
                        </div>
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
                onClose={onCloseModal}
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
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onConfirmModal}
                        >
                            Login
                        </Button>
                    </div>
                </Fade>
            </Modal>
        </>
    );
}
