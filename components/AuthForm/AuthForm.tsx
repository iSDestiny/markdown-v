import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import {
    Backdrop,
    Box,
    Button,
    Container,
    Fade,
    Grid,
    LinearProgress,
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
    isLoading: boolean;
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
    email,
    isLoading
}: AuthFormProps<T>) {
    const [sentOpenType, setSentOpenType] = useState<'success' | 'failed' | ''>(
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

    const onCloseConfirmationModal = () => {
        setSentOpenType('');
    };

    const onConfirmModal = () => {
        router.push('login');
    };

    const sendEmail = async () => {
        try {
            await axios.post('api/auth/send-verification', { email });
            setSentOpenType('success');
        } catch ({ response }) {
            setSentOpenType('failed');
        }
    };

    const sendEmailLink = (
        <a className={classes.email} onClick={sendEmail}>
            here
        </a>
    );

    return (
        <>
            {isLoading && <LinearProgress classes={{ root: classes.loader }} />}
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
                            One last step! Confirm your email address!
                        </h2>
                        <p id="transition-modal-description">
                            In order to use markdownv we require users to verify
                            their email in order to prevent people from using
                            emails that they do not own. Please follow the
                            instructions sent to your email to verify your email
                            address.
                        </p>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onConfirmModal()}
                        >
                            Login
                        </Button>
                    </div>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={Boolean(sentOpenType)}
                onClose={() => onCloseConfirmationModal()}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
            >
                <Fade in={Boolean(sentOpenType)}>
                    <div className={classes['modal-content']}>
                        <h2
                            id="transition-modal-title"
                            className={classes.success}
                        >
                            {sentOpenType === 'success' &&
                                'Verification email sent'}
                            {sentOpenType === 'failed' &&
                                'Verification email failed to send'}
                        </h2>
                        <p id="transition-modal-description">
                            {sentOpenType === 'success' &&
                                `Verification email was sent to the appropriate email,
                                please follow the instructions on the email to verify your account`}
                            {sentOpenType === 'failed' &&
                                `Verification email failed to send, please try again, if it keeps
                                failing then there is something wrong with the server or it is down`}
                        </p>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onCloseConfirmationModal()}
                        >
                            Close
                        </Button>
                    </div>
                </Fade>
            </Modal>
        </>
    );
}
