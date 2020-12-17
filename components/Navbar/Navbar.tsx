import classes from './Navbar.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@material-ui/core';
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
        <nav id="navbar" className={classes.navbar}>
            <a href="/" className={classes.logo}>
                <Image
                    src="/markdownv.svg"
                    alt="MarkdownV logo"
                    width={50}
                    height={50}
                />
                <span>MarkdownV</span>
            </a>
            <ul className={classes.content}>
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
                                <li>
                                    <Link href="/login">Login</Link>
                                </li>
                                <li>
                                    <Link href="/signup">Sign up</Link>
                                </li>
                            </>
                        )}
                        {isSuccess && (
                            <li>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => router.push('/app')}
                                >
                                    Launch App
                                </Button>
                            </li>
                        )}
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
