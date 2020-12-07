import React from 'react';
import {
    Chip,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    TextField,
    Tooltip
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch, useSelector } from 'react-redux';
import { useMutateAddNote } from '../../hooks/noteMutationHooks';
import useLoader from '../../hooks/useLoader';
import { selectEditor, setCurrent } from '../../store/slices/editorSlice';
import classes from './NotesMenu.module.scss';
import SortOptions from './SortOptions';

const NotesMenu = () => {
    const [mutateAddNote, { isLoading }] = useMutateAddNote();
    const { current, notes, filter } = useSelector(selectEditor);
    const dispatch = useDispatch();
    useLoader('add', isLoading);

    const addNoteHandler = () => {
        const { type, name } = filter;
        let note: NewNote = {};
        if (type === 'nonTag' && name === 'Favorites') note.favorite = true;
        else if (type === 'tag') note.tags = [{ tag: name }];
        mutateAddNote(note);
    };

    const noteSelectionHandler = (id: string) => {
        dispatch(setCurrent({ current: id }));
    };

    return (
        <section className={classes['notes-menu']}>
            <header>
                <div className={classes.row1}>
                    {/* <h1>
                        {filter.type === 'nonTag'
                            ? filter.name
                            : `Tag: ${filter.name}`}
                    </h1> */}
                    {/* <TextField
                        id="search-bar"
                        variant="outlined"
                        style={{ borderRadius: '50%' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    /> */}
                    <div className={classes['search-bar']}>
                        <span className={classes.icon}>
                            <SearchIcon />
                        </span>
                        <input type="text" placeholder="Search" />
                    </div>
                    <Tooltip title="New Note">
                        <IconButton
                            color="primary"
                            size="medium"
                            edge="end"
                            onClick={() => addNoteHandler()}
                        >
                            <AddIcon fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className={classes.row2}>
                    <p>{notes.length} notes</p>
                    <SortOptions />
                </div>
            </header>
            <List style={{ padding: 0 }}>
                {notes.length > 0 ? (
                    notes.map((note: Note, index: number) => (
                        <ListItem
                            button
                            key={note._id}
                            selected={note._id === current}
                            style={{
                                display: 'flex'
                            }}
                            onClick={() => noteSelectionHandler(note._id)}
                        >
                            <ListItemText
                                primary={note.title}
                                classes={{ primary: classes['menu-item-text'] }}
                            />
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
                        style={{ textAlign: 'center', marginTop: '1rem' }}
                    />
                )}
            </List>
        </section>
    );
};

export default NotesMenu;
