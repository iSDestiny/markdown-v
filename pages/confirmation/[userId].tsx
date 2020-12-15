import { GetServerSideProps, NextApiResponse } from 'next';
import nc from 'next-connect';
import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import { Box, Button, Container, Paper, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import Copyright from 'components/Copyright';

const Confirmation = () => {
    const router = useRouter();
    return (
        <Container component="main" maxWidth="xs">
            <div className="auth-container">
                <Paper className="auth-container paper">
                    <Typography component="h1" variant="h5">
                        Confirm Successful
                    </Typography>
                    <Typography variant="body1">
                        Your email has ben successfully verified. You can now
                        login, please press the button below to navigate to the
                        login page.
                    </Typography>
                    <Button
                        type="submit"
                        onClick={() => router.push('/login')}
                        fullWidth
                        variant="contained"
                        style={{ margin: '1rem 0' }}
                    >
                        Login
                    </Button>
                </Paper>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
};

export default Confirmation;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { userId } = ctx.query;
    const handler = nc<ExtendedRequest, NextApiResponse>();
    let isConfirmed = false;
    handler.use(nextConnectDB);
    handler.post(async (req, res) => {
        const { User } = req.models;
        const user = await User.findById(userId);
        if (user) {
            user.isConfirmed = true;
            await user.save();
            isConfirmed = user.isConfirmed;
        }
    });
    return { props: { isConfirmed } };
};
