import GitHubIcon from '@material-ui/icons/GitHub';
import classes from './Navbar.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Container, IconButton } from '@material-ui/core';
import { useQuery } from 'react-query';
import { fetchAuthInfo } from 'utility/fetchAuth';
import Skeleton from '@material-ui/lab/Skeleton';

const Navbar = () => {
    const router = useRouter();
    const { isLoading, isError, isSuccess } = useQuery(
        'authInfo',
        fetchAuthInfo,
        {
            staleTime: Infinity,
            retry: false
        }
    );

    return (
        <Container maxWidth="lg">
            <nav id="navbar" className={classes.navbar}>
                <div className={classes.left}>
                    <a href="#" className={classes.logo}>
                        <Image
                            src="/markdownv.svg"
                            alt="MarkdownV logo"
                            width={50}
                            height={50}
                        />
                        <span>MarkdownV</span>
                    </a>
                    <ul className={classes.content}>
                        <li>
                            <a href="#features">Features</a>
                        </li>
                    </ul>
                </div>
                <ul className={classes.right}>
                    {isLoading ? (
                        <>
                            <li>
                                <Skeleton
                                    variant="text"
                                    width={70}
                                    height={45}
                                    animation="wave"
                                />
                            </li>
                            <li>
                                <Skeleton
                                    variant="text"
                                    width={70}
                                    height={45}
                                    animation="wave"
                                />
                            </li>
                        </>
                    ) : (
                        <>
                            {isError && (
                                <>
                                    <li style={{ marginRight: 5 }}>
                                        <IconButton
                                            onClick={() =>
                                                window.open(
                                                    'https://github.com/iSDestiny/markdown-v'
                                                )
                                            }
                                            size="medium"
                                        >
                                            <GitHubIcon />
                                        </IconButton>
                                    </li>
                                    <li>
                                        <Link href="/login">Login</Link>
                                    </li>
                                    <li>
                                        <Link href="/signup">Sign up</Link>
                                    </li>
                                </>
                            )}
                            {isSuccess && (
                                <>
                                    <li style={{ marginRight: 0 }}>
                                        <IconButton
                                            onClick={() =>
                                                window.open(
                                                    'https://github.com/iSDestiny/markdown-v'
                                                )
                                            }
                                            size="medium"
                                        >
                                            <GitHubIcon />
                                        </IconButton>
                                    </li>
                                    <li>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => router.push('/app')}
                                        >
                                            Launch App
                                        </Button>
                                    </li>
                                </>
                            )}
                        </>
                    )}
                </ul>
            </nav>
        </Container>
    );
};

export default Navbar;
