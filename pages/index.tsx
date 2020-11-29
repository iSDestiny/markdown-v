import Head from 'next/head';
import Router from 'next/router';
import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import { useDispatch, useSelector } from 'react-redux';
import fetchNotes from '../utility/fetchNotes';
import React, { useEffect, useState } from 'react';
import classes from '../styles/Home.module.scss';
import TopMenu from '../components/TopMenu';
import Preview from '../components/Preview';
import Editor from '../components/Editor';
import { LinearProgress } from '@material-ui/core';
import {
    selectEditor,
    setNotesFromOriginal
} from '../store/slices/editorSlice';
import { queryCache, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';
import NotesMenu from '../components/NotesMenu';
import useLoader from '../hooks/useLoader';
import LoadingScreen from '../components/LoadingScreen';
import { GetServerSideProps } from 'next';
import { dehydrate } from 'react-query/hydration';
import cookies from 'next-cookies';
// import fetchRefresh from '../utility/fetchRefresh';
import isAuthenticated from '../utility/isAuthenticated';
import { fetchRefreshQuery } from '../utility/fetchRefresh';
import SideMenu from '../components/SideMenu/SideMenu';

export default function Notes() {
    // const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const redirectOnFailedFetch = (err: any) => {
        Router.push('/login');
    };
    const {
        data: originalNotes,
        isLoading: isNotesLoading,
        isSuccess
    } = useQuery('notes', fetchNotes, {
        staleTime: Infinity,
        onError: redirectOnFailedFetch,
        retry: false
    });
    const { canEdit, canPreview, notes } = useSelector(selectEditor);
    const dispatch = useDispatch();
    const isLoading = useLoader('notes', false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        dispatch(setNotesFromOriginal({ originalNotes }));
    }, [originalNotes]);

    if (isNotesLoading || !isSuccess) {
        return <LoadingScreen />;
    }

    return (
        <>
            <main className={classes.container}>
                <Head>
                    <title>Markdown Notes</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                {isLoading && (
                    <LinearProgress
                        style={{ position: 'fixed', width: '100%' }}
                    />
                )}
                <SideMenu />
                <NotesMenu />
                <section className={classes['editor-container']}>
                    {notes.length > 0 && (
                        <>
                            <TopMenu
                                notes={notes}
                                isFavorite={isFavorite}
                                setIsFavorite={setIsFavorite}
                            />
                            <div className={classes['editor-main']}>
                                {canEdit ? <Editor /> : <Preview />}
                                {canPreview && <Preview isResizable />}
                            </div>
                        </>
                    )}
                </section>
            </main>
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </>
    );
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//     const queryCache = new QueryCache();
//     // await queryCache.prefetchQuery('notes', fetchNotes);
//     await isAuthenticated(ctx);
//     // queryCache.setQueryData('tokens', { token, refresh });
//     return { props: { dehydratedState: dehydrate(queryCache) } };
// };
