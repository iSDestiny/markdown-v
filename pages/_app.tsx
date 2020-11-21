import { ThemeProvider } from '@material-ui/core';
import type { AppProps } from 'next/app';
import React from 'react';
import '../styles/globals.scss';
import theme from '../styles/muiTheme';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp;
