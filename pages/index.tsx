import { LinearProgress } from '@material-ui/core';
import Head from 'next/head';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '../components/Editor';
import LoadingScreen from '../components/LoadingScreen';
import NotesMenu from '../components/NotesMenu';
import Preview from '../components/Preview';
import SideMenu from '../components/SideMenu';
import TopMenu from '../components/TopMenu';
import useLoader from '../hooks/useLoader';
import {
    selectEditor,
    setNotesFromOriginal
} from '../store/slices/editorSlice';
import classes from '../styles/Home.module.scss';
import fetchNotes from '../utility/fetchNotes';

export default function Notes() {
    const redirectOnFailedFetch = (err: any) => {
        if (err.response.status === 401) Router.push('/login');
        else Router.push('/500');
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
