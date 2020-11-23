import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import fetchNotes from '../utility/fetchNotes';
import React, { useEffect, useState } from 'react';
import classes from '../styles/Home.module.scss';
import TopMenu from '../components/TopMenu';
import Preview from '../components/Preview';
import Editor from '../components/Editor';
import AddIcon from '@material-ui/icons/Add';
import {
    LinearProgress,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Tooltip
} from '@material-ui/core';
import {
    selectEditor,
    setCurrent,
    setNotesFromOriginal
} from '../store/slices/editorSlice';
import { GetServerSideProps } from 'next';
import { QueryCache, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { ReactQueryDevtools } from 'react-query-devtools';
import { useMutateAddNote } from '../hooks/noteMutationHooks';

export default function Home() {
    const { data: originalNotes, isLoading: isNotesLoading } = useQuery(
        'notes',
        fetchNotes
    );
    const [mutateAddNote, { isLoading: addIsLoading }] = useMutateAddNote();
    const { current, canEdit, canPreview, notes } = useSelector(selectEditor);
    const dispatch = useDispatch();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        dispatch(setNotesFromOriginal({ originalNotes }));
    }, [originalNotes]);

    const noteSelectionHandler = (index: number) => {
        dispatch(setCurrent({ current: index }));
    };

    const addNoteHandler = () => {
        dispatch(setCurrent({ current: 0 }));
        mutateAddNote();
    };

    return (
        <>
            <main className={classes.container}>
                <Head>
                    <title>Markdown Notes</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                {(isNotesLoading || addIsLoading) && (
                    <LinearProgress
                        style={{ position: 'fixed', width: '100%' }}
                    />
                )}
                <section className={classes['side-menu']}>
                    <header>
                        <h3>All Notes</h3>
                        <Tooltip title="New Note">
                            <IconButton
                                color="inherit"
                                onClick={() => addNoteHandler()}
                            >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    </header>
                    <List style={{ padding: 0 }}>
                        {notes.map((note: Note, index: number) => (
                            <ListItem
                                button
                                key={note._id}
                                selected={index === current}
                                alignItems="flex-start"
                                onClick={() => noteSelectionHandler(index)}
                            >
                                <ListItemText primary={note.title} />
                            </ListItem>
                        ))}
                    </List>
                </section>
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
            <ReactQueryDevtools initialIsOpen={false} />
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const queryCache = new QueryCache();
    await queryCache.prefetchQuery('notes', fetchNotes);
    return { props: { dehydratedState: dehydrate(queryCache) } };
};
