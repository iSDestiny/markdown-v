import { GetServerSideProps } from 'next';
import axios from 'axios';
import { Box, Button, Container, Paper, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import Copyright from 'components/Copyright';

const Confirmation = ({ isConfirmed }: { isConfirmed: boolean }) => {
    const router = useRouter();
    return (
        <Container component="main" maxWidth="xs">
            <div className="auth-container">
                <Paper className="auth-container paper">
                    <Typography
                        component="h1"
                        variant="h5"
                        style={{ marginBottom: '1rem' }}
                    >
                        {isConfirmed
                            ? 'Success!'
                            : 'Failed to confirm your email'}
                    </Typography>
                    <Typography variant="body1">
                        {isConfirmed
                            ? `Your email has ben successfully verified. You can now
                            login, please press the button below to navigate to the
                            login page.`
                            : `Failed to verify your email, either the link has expired or something is wrong with the server`}
                    </Typography>
                    <Button
                        type="submit"
                        onClick={() => router.push('/login')}
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '1rem' }}
                    >
                        To Login
                    </Button>
                    <Button
                        type="submit"
                        onClick={() => router.push('/signup')}
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ margin: '0.5rem 0' }}
                    >
                        To Sign Up
                    </Button>
                </Paper>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    console.log('in server confirm');
    const { userId } = ctx.query;
    let isConfirmed = false;
    try {
        await axios.post(`${process.env.CLIENT_ORIGIN}/api/auth/verify`, {
            id: userId
        });
        isConfirmed = true;
    } catch (err) {
        console.log(err);
        isConfirmed = false;
    }
    return { props: { isConfirmed } };
};

export default Confirmation;
