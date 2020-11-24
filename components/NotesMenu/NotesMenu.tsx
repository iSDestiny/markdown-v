import {
    Chip,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Tooltip
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutateAddNote } from '../../hooks/noteMutationHooks';
import useLoader from '../../hooks/useLoader';
import { selectEditor, setCurrent } from '../../store/slices/editorSlice';
import classes from './NotesMenu.module.scss';

const NotesMenu = () => {
    const [mutateAddNote, { isLoading }] = useMutateAddNote();
    const { current, notes } = useSelector(selectEditor);
    const dispatch = useDispatch();
    useLoader('add', isLoading);

    const addNoteHandler = () => {
        dispatch(setCurrent({ current: notes.length }));
        mutateAddNote();
    };

    const noteSelectionHandler = (index: number) => {
        dispatch(setCurrent({ current: index }));
    };

    return (
        <section className={classes['notes-menu']}>
            <header>
                <h3>All Notes</h3>
                <Tooltip title="New Note">
                    <IconButton
                        color="primary"
                        onClick={() => addNoteHandler()}
                    >
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </header>
            <List style={{ padding: 0 }}>
                {notes.length > 0 ? (
                    notes.map((note: Note, index: number) => (
                        <ListItem
                            button
                            key={note._id}
                            selected={index === current}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                            onClick={() => noteSelectionHandler(index)}
                        >
                            <ListItemText primary={note.title} />
                            {note.isTemp && (
                                <Chip
                                    label="unsaved"
                                    color="primary"
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </ListItem>
                    ))
                ) : (
                    <ListItemText
                        primary={'No notes available'}
                        style={{ textAlign: 'center' }}
                    />
                )}
            </List>
        </section>
    );
};

export default NotesMenu;
