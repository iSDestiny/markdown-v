import { ThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import { ReactQueryCacheProvider, QueryCache } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import type { AppProps } from 'next/app';
import React from 'react';
import '../styles/globals.scss';
import theme from '../styles/muiTheme';
import store from '../store';

const queryCache = new QueryCache();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <ReactQueryCacheProvider queryCache={queryCache}>
                <Hydrate state={pageProps.dehydratedState}>
                    <ThemeProvider theme={theme}>
                        <Component {...pageProps} />
                    </ThemeProvider>
                </Hydrate>
            </ReactQueryCacheProvider>
        </Provider>
    );
}

export default MyApp;
