import { Button, Container } from '@material-ui/core';
import Navbar from 'components/Navbar/Navbar';
import ReactPlayer from 'react-player/lazy';
import classes from 'styles/Landing.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import classNames from 'classnames';
import Copyright from 'components/Copyright';
import { useRouter } from 'next/router';
import { Element } from 'react-scroll';

const LandingPage = () => {
    const router = useRouter();

    return (
        <>
            <Navbar />
            <main>
                <section id="showcase" className={classes.showcase}>
                    <Container maxWidth="lg">
                        <header className={classes.header}>
                            <div className={classes.brand}>
                                <Image
                                    width={70}
                                    height={70}
                                    src="/markdownv.svg"
                                    alt="MarkdownV logo"
                                />
                                <h1>MarkdownV</h1>
                            </div>
                            <p>
                                Write github flavored markdown notes with vim or
                                vscode keybindings
                            </p>
                        </header>
                        <div className={classes['auth-container']}>
                            <Button
                                onClick={() => router.push('/signup')}
                                variant="contained"
                                color="primary"
                            >
                                Sign Up For Free
                            </Button>
                            <Link href="/login">
                                Already have an account? Login
                            </Link>
                        </div>
                        <div className={classes['player-wrapper']}>
                            <ReactPlayer
                                className={classes['react-player']}
                                url="/showcase.mp4"
                                controls={true}
                                width="100%"
                                height="100%"
                            />
                        </div>
                    </Container>
                </section>
                <section id="features" className={classes.features}>
                    <Element name="featureElement">
                        <h1 className={classes['section-heading']}>Features</h1>
                        <Container
                            maxWidth="lg"
                            classes={{ root: classes['feature-grid'] }}
                        >
                            <div
                                className={classNames(
                                    classes.info,
                                    classes.left
                                )}
                            >
                                <h1>Markdown-Based</h1>
                                <p>
                                    <a
                                        href="https://github.github.com/gfm/"
                                        target="_blank"
                                    >
                                        Github flavored markdown
                                    </a>{' '}
                                    is the format that notes are written in. You
                                    can also write math with{' '}
                                    <a
                                        href="https://katex.org/"
                                        target="_blank"
                                    >
                                        Katex
                                    </a>{' '}
                                    expressions.
                                </p>
                            </div>
                            <div className={classes['feature-video-wrapper']}>
                                <ReactPlayer
                                    className={classes['feature-video']}
                                    url="/markdown-showcase.mp4"
                                    controls={true}
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                            <div
                                className={classNames(
                                    classes.info,
                                    classes.right
                                )}
                            >
                                <h1>Vim and VSCode Keybindings</h1>
                                <p>
                                    MarkdownV has two editor modes,{' '}
                                    <a
                                        href="https://www.vim.org/docs.php"
                                        target="_blank"
                                    >
                                        Vim
                                    </a>{' '}
                                    and{' '}
                                    <a
                                        href="https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf"
                                        target="_blank"
                                    >
                                        VSCode
                                    </a>
                                    . Please note that there are some
                                    restrictions since MarkdownV is web-based
                                    and not actually a full fledged code editor
                                    like the real vim and vscode. MarkdownV is
                                    using{' '}
                                    <a
                                        href="https://ace.c9.io/"
                                        target="_blank"
                                    >
                                        Ace Editor
                                    </a>{' '}
                                    under the hood
                                </p>
                            </div>
                            <div className={classes['feature-video-wrapper']}>
                                <ReactPlayer
                                    className={classes['feature-video']}
                                    url="/editor-showcase.mp4"
                                    controls={true}
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                            <div
                                className={classNames(
                                    classes.info,
                                    classes.left
                                )}
                            >
                                <h1>Fuzzy Searching</h1>
                                <p>
                                    MarkdownV uses fuzzy search for it's
                                    searching algorithm. You can search while
                                    respecting current filters or globally just
                                    like in vscode by using Ctrl-P to bring up
                                    the global search menu. When you are
                                    searching the text in the results will be
                                    highlighted appropriately to reflect the
                                    current query
                                </p>
                            </div>
                            <div className={classes['feature-video-wrapper']}>
                                <ReactPlayer
                                    className={classes['feature-video']}
                                    url="/search-showcase.mp4"
                                    controls={true}
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                            <div
                                className={classNames(
                                    classes.info,
                                    classes.right
                                )}
                            >
                                <h1>Preview Mode</h1>
                                <p>
                                    MarkdownV lets you preview your markdown
                                    while you are writing it with the use of a
                                    split window that is adjustable
                                </p>
                            </div>
                            <div className={classes['feature-video-wrapper']}>
                                <ReactPlayer
                                    className={classes['feature-video']}
                                    url="/preview-showcase.mp4"
                                    controls={true}
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                            <div
                                className={classNames(
                                    classes.info,
                                    classes.left
                                )}
                            >
                                <h1>Sorting</h1>
                                <p>
                                    MarkdownV allows you to sort your notes
                                    ascending or descending by title, date
                                    created, and date updated
                                </p>
                            </div>
                            <div className={classes['feature-video-wrapper']}>
                                <ReactPlayer
                                    className={classes['feature-video']}
                                    url="/sorting-showcase.mp4"
                                    controls={true}
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                            <div
                                className={classNames(
                                    classes.info,
                                    classes.right
                                )}
                            >
                                <h1>Tagging and Favorites</h1>
                                <p>
                                    MarkdownV allows you to organize your notes
                                    with the use of case insensitive tags. You
                                    can also star your favorite notes in order
                                    for it to appear in the favorites tab
                                </p>
                            </div>
                            <div className={classes['feature-video-wrapper']}>
                                <ReactPlayer
                                    className={classes['feature-video']}
                                    url="/tagging-showcase.mp4"
                                    controls={true}
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                            <div
                                className={classNames(
                                    classes.info,
                                    classes.left
                                )}
                            >
                                <h1>Full Screen Mode</h1>
                                <p>
                                    You can hide the side menus by utilizing
                                    full screen mode. During this mode only your
                                    editor, top menu, and preview screen (if
                                    enabled) will be shown. To navigate to other
                                    notes in fullscreen mode, the global search
                                    functionality (Ctrl+P) will be very useful
                                    here
                                </p>
                            </div>
                            <div className={classes['feature-video-wrapper']}>
                                <ReactPlayer
                                    className={classes['feature-video']}
                                    url="/fullscreen-showcase.mp4"
                                    controls={true}
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                        </Container>
                    </Element>
                </section>
            </main>
            <footer className={classes.footer}>
                <Copyright />
            </footer>
        </>
    );
};

export default LandingPage;
