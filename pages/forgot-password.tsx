import axios from 'axios';
import { Box, Button, Paper, TextField, Typography } from '@material-ui/core';
import { Container } from 'next/app';
import { SubmitHandler, useForm } from 'react-hook-form';
import addServerErrors from '../utility/addServerErrors';
import classes from '../styles/ForgotPassword.module.scss';
import Link from 'next/link';
import Copyright from '../components/Copyright';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface FormInputs {
    email: string;
}

const schema = yup.object().shape({
    email: yup.string().email('must be an email address').required()
});

const forgotPassword = () => {
    const { setError, clearErrors, handleSubmit, errors, register } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit: SubmitHandler<FormInputs> = async (data, event) => {
        try {
            event.preventDefault();
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/auth/reset`
            );
            clearErrors();
        } catch ({ response }) {
            const {
                data: { errors },
                status
            } = response;
            clearErrors();
            if (status === 422 && errors) {
                console.log(errors);
                addServerErrors(errors, setError);
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
        </>
    );
};

export default forgotPassword;
