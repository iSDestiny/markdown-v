import { ThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import React from 'react';
import '../styles/globals.scss';
import theme from '../styles/muiTheme';
import store from '../store';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </Provider>
    );
}

export default MyApp;
