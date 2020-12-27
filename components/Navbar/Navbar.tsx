import GitHubIcon from '@material-ui/icons/GitHub';
import classes from './Navbar.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Container, IconButton } from '@material-ui/core';
import { useQuery } from 'react-query';
import { fetchAuthInfo } from 'utility/fetchAuth';
import Skeleton from '@material-ui/lab/Skeleton';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useEffect, useRef, useState } from 'react';
import { Link as JumpLink, scroller as scroll } from 'react-scroll';

const Navbar = () => {
    const router = useRouter();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('xs'));
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>();
    const buttonRef = useRef<HTMLButtonElement>();
    const navRef = useRef<HTMLElement>();
    const { isLoading, isError, isSuccess } = useQuery(
        'authInfo',
        fetchAuthInfo,
        {
            staleTime: Infinity,
            retry: false
        }
    );
    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };
    const scrollToFeatures = () => {
        setIsMenuOpen(false);
        scroll.scrollTo('features', { smooth: true });
    };

    const handleClickAway = (event: MouseEvent) => {
        const { current: menuCurrent } = menuRef;
        const { current: navCurrent } = navRef;
        if (
            navCurrent &&
            menuCurrent &&
            isMenuOpen &&
            !navCurrent.contains(event.target as Node) &&
            !menuCurrent.contains(event.target as Node)
        ) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickAway);
        return () => {
            document.removeEventListener('click', handleClickAway);
        };
    }, [isMenuOpen]);

    return (
        <header>
            <nav id="navbar" className={classes['nav-container']} ref={navRef}>
                <Container maxWidth="lg" classes={{ root: classes.navbar }}>
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
                        {!matches && (
                            <ul className={classes.content}>
                                <li>
                                    <JumpLink to="features" smooth>
                                        Features
                                    </JumpLink>
                                </li>
                            </ul>
                        )}
                    </div>
                    {matches && (
                        <IconButton
                            size="medium"
                            onClick={toggleMenu}
                            ref={buttonRef}
                        >
                            {!isMenuOpen ? (
                                <MenuIcon fontSize="inherit" />
                            ) : (
                                <CloseIcon fontSize="inherit" />
                            )}
                        </IconButton>
                    )}
                    {!matches && (
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
                                                <Link href="/signup">
                                                    Sign up
                                                </Link>
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
                                                    onClick={() =>
                                                        router.push('/app')
                                                    }
                                                >
                                                    Launch App
                                                </Button>
                                            </li>
                                        </>
                                    )}
                                </>
                            )}
                        </ul>
                    )}
                </Container>
            </nav>
            {matches && isMenuOpen && (
                <div className={classes['menu']} ref={menuRef}>
                    <ul>
                        <li onClick={scrollToFeatures}>
                            <a>Features</a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/iSDestiny/markdown-v"
                                target="_blank"
                            >
                                Github
                            </a>
                        </li>
                        {isLoading && (
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
                        )}
                        {isError && (
                            <>
                                <li>
                                    <Link href="/login">Login</Link>
                                </li>
                                <li>
                                    <Link href="/signup">Signup</Link>
                                </li>
                            </>
                        )}
                        {isSuccess && (
                            <li>
                                <Link href="/app">Launch App</Link>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </header>
    );
};

export default Navbar;
