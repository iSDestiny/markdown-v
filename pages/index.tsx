import Head from 'next/head';
import React, { useState } from 'react';
import classes from '../styles/Home.module.scss';
import TopMenu from '../components/TopMenu';
import Preview from '../components/Preview';
import Editor from '../components/Editor';
import AddIcon from '@material-ui/icons/Add';
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    Tooltip
} from '@material-ui/core';

const useListItemStyles = makeStyles((theme) => ({
    root: {
        backngroundColor: 'transparent',
        '&:hover': {
            backgroundColor: '#292D3E'
        }
    },
    selected: {
        backgroundColor: '#292D3E'
    }
}));

export default function Home() {
    const listItemClasses = useListItemStyles();
    const [notes, setNotes] = useState([
        { id: 1, title: 'note1', content: '' },
        { id: 2, title: 'note2', content: '' },
        { id: 3, title: 'note3', content: '' },
        { id: 4, title: 'note4', content: '' },
        { id: 5, title: 'note5', content: '' },
        { id: 6, title: 'note6', content: '' },
        { id: 7, title: 'note7', content: '' },
        { id: 8, title: 'note8', content: '' },
        { id: 9, title: 'note9', content: '' },
        { id: 10, title: 'note10', content: '' },
        { id: 11, title: 'note11', content: '' },
        { id: 12, title: 'note12', content: '' },
        { id: 13, title: 'note13', content: '' }
    ]);
    const [current, setCurrent] = useState(0);
    const [canEdit, setCanEdit] = useState(false);
    const [preview, setPreview] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const setNoteContent = (index: number, newContent: string) => {
        setNotes((prev) => {
            const newNotes = [...prev];
            newNotes[index].content = newContent;
            return newNotes;
        });
    };

    const noteSelectionHandler = (index: number) => {
        setCurrent(index);
    };

    return (
        <main className={classes.container}>
            <Head>
                <title>Markdown Notes</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <section className={classes['side-menu']}>
                <header>
                    <h3>All Notes</h3>
                    <Tooltip title="New Note">
                        <IconButton color="inherit">
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </header>
                <List style={{ padding: 0 }}>
                    {notes.map((note, index) => (
                        <ListItem
                            button
                            classes={{
                                root: listItemClasses.root,
                                selected: listItemClasses.selected
                            }}
                            key={note.id}
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
                    canEdit={canEdit}
                    setCanEdit={setCanEdit}
                    preview={preview}
                    setPreview={setPreview}
                    isFavorite={isFavorite}
                    setIsFavorite={setIsFavorite}
                />
                <div className={classes['editor-main']}>
                    {canEdit ? (
                        <Editor
                            current={current}
                            value={notes[current].content}
                            setValue={setNoteContent}
                            preview={preview}
                        />
                    ) : (
                        <Preview value={notes[current].content} />
                    )}
                    {preview && (
                        <Preview value={notes[current].content} isResizable />
                    )}
                </div>
            </section>
        </main>
    );
}
