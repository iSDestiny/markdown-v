import { StylesProvider, ThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import { ReactQueryCacheProvider, QueryCache } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import 'styles/globals.scss';
import 'styles/authentication.scss';
import 'katex/dist/katex.min.css';
import theme from 'styles/muiTheme';
import store from 'store';
import Head from 'next/head';

const queryCache = new QueryCache();

function MyApp({ Component, pageProps, router }: AppProps) {
    useEffect(() => {
        if (router.pathname === '/') require('styles/landing.scss');
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <>
            <Head>
                <title>MarkdownV</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Provider store={store}>
                <ReactQueryCacheProvider queryCache={queryCache}>
                    <Hydrate state={pageProps.dehydratedState}>
                        <StylesProvider injectFirst>
                            <ThemeProvider theme={theme}>
                                <Component {...pageProps} />
                            </ThemeProvider>
                        </StylesProvider>
                    </Hydrate>
                </ReactQueryCacheProvider>
            </Provider>
        </>
    );
}

export default MyApp;
