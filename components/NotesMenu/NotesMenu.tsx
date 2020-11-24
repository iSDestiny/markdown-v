import {
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
        dispatch(setCurrent({ current: 0 }));
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
    );
};

export default NotesMenu;
