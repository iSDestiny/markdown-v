import { LinearProgress } from '@material-ui/core';
import Head from 'next/head';
import Router from 'next/router';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';
import { useDispatch, useSelector } from 'react-redux';
import Editor from 'components/Editor';
import LoadingScreen from 'components/LoadingScreen';
import NotesMenu from 'components/NotesMenu';
import Preview from 'components/Preview';
import SideMenu from 'components/SideMenu';
import TopMenu from 'components/TopMenu';
import useLoader from 'hooks/useLoader';
import {
    selectEditor,
    setIsGlobalSearchOpen,
    setNotesFromOriginal,
    setNoteToSaved
} from 'store/slices/editorSlice';
import classes from 'styles/Home.module.scss';
import { fetchAuthInfo } from 'utility/fetchAuth';
import fetchNotes from 'utility/fetchNotes';
import classNames from 'classnames';
import GlobalSearchBar from 'components/GlobalSearchBar';
import { useMutateModifyNote } from 'hooks/noteMutationHooks';

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
    const { isLoading: isAuthLoading } = useQuery('authInfo', fetchAuthInfo, {
        staleTime: Infinity,
        retry: false
    });
    const { canEdit, canPreview, notes, current, isFullScreen } = useSelector(
        selectEditor
    );
    const [
        mutateModifyNote,
        { isLoading: saveIsLoading }
    ] = useMutateModifyNote();
    const dispatch = useDispatch();
    useLoader('save', saveIsLoading);
    const isLoading = useLoader('notes', false);

    const onKeyDown = async (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault();
            dispatch(setIsGlobalSearchOpen({ open: true }));
        } else if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            const note = notes.find((note) => note._id === current);
            if (note) {
                await mutateModifyNote(note);
                dispatch(setNoteToSaved());
            }
        } else if (
            (event.ctrlKey && event.key === 'PageUp') ||
            event.key === 'PageUp'
        ) {
            event.preventDefault();
            console.log('pageup');
        } else if (event.ctrlKey && event.key === 'PageDown') {
            event.preventDefault();
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
    }, []);

    useEffect(() => {
        dispatch(setNotesFromOriginal({ originalNotes }));
    }, [originalNotes]);

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [notes, current]);

    if (isNotesLoading || !isSuccess || isAuthLoading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <GlobalSearchBar />
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
                {!isFullScreen && (
                    <>
                        <SideMenu />
                        <NotesMenu />
                    </>
                )}
                <section
                    className={classNames(classes['editor-container'], {
                        [`${classes['full-screen']}`]: isFullScreen
                    })}
                >
                    {notes.length > 0 &&
                        notes.find((note) => note._id === current) && (
                            <>
                                <TopMenu notes={notes} />
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
