import Head from 'next/head';
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
import { QueryCache, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';
import NotesMenu from '../components/NotesMenu';
import useLoader from '../hooks/useLoader';
import LoadingScreen from '../components/LoadingScreen';
import { GetServerSideProps } from 'next';
import { dehydrate } from 'react-query/hydration';
import cookies from 'next-cookies';

export default function Notes() {
    const { data: originalNotes, isLoading: isNotesLoading } = useQuery(
        'notes',
        fetchNotes,
        { staleTime: Infinity }
    );
    const { canEdit, canPreview, notes } = useSelector(selectEditor);
    const dispatch = useDispatch();
    const isLoading = useLoader('notes', false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        dispatch(setNotesFromOriginal({ originalNotes }));
    }, [originalNotes]);

    if (isNotesLoading) return <LoadingScreen />;

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
                <NotesMenu />
                <section className={classes['editor-container']}>
                    <TopMenu
                        notes={notes}
                        isFavorite={isFavorite}
                        setIsFavorite={setIsFavorite}
                    />
                    <div className={classes['editor-main']}>
                        {canEdit ? <Editor /> : <Preview />}
                        {canPreview && <Preview isResizable />}
                    </div>
                </section>
            </main>
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const queryCache = new QueryCache();
    // await queryCache.prefetchQuery('notes', fetchNotes);
    const token = cookies(ctx).ACCESS_TOKEN || '';
    let isAuth: any;
    console.log(token);
    try {
        isAuth = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        ctx.res.writeHead(302, { Location: '/login' });
        ctx.res.end();
        return { props: {} };
    }

    if (!isAuth) {
        ctx.res.writeHead(302, { Location: '/login' });
        ctx.res.end();
        return { props: {} };
    }

    queryCache.setQueryData('accessToken', { token });
    return { props: { dehydratedState: dehydrate(queryCache) } };
};
