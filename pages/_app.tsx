import { ThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import { ReactQueryCacheProvider, QueryCache } from 'react-query';
import type { AppProps } from 'next/app';
import React from 'react';
import '../styles/globals.scss';
import '../styles/authentication.scss';
import theme from '../styles/muiTheme';
import store from '../store';
import Head from 'next/head';

const queryCache = new QueryCache();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>MarkdownV</title>
            </Head>

            <Provider store={store}>
                <ReactQueryCacheProvider queryCache={queryCache}>
                    <ThemeProvider theme={theme}>
                        <Component {...pageProps} />
                    </ThemeProvider>
                </ReactQueryCacheProvider>
            </Provider>
        </>
    );
}

export default MyApp;
