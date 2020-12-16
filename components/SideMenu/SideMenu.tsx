import { Collapse, List, ListItem, ListItemText } from '@material-ui/core';
import {
    AccountCircle,
    Description,
    ExpandLess,
    ExpandMore,
    LocalOffer,
    LocalOfferOutlined,
    Star
} from '@material-ui/icons';
import { useState } from 'react';
import { useQueryCache } from 'react-query';
import AccountOptions from './AccountOptions';
import { useDispatch, useSelector } from 'react-redux';
import { selectEditor, setFilter } from '../../store/slices/editorSlice';
import classes from './SideMenu.module.scss';

const SideMenu = () => {
    const [tagOpen, setTagOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<Element>(null);
    const queryCache = useQueryCache();
    const { filter, nonFilteredNotes } = useSelector(selectEditor);
    const dispatch = useDispatch();

    const getAllUniqueTags = () => {
        let allUniqueTags: string[] = [];
        nonFilteredNotes.forEach((note) => {
            const tags = note.tags.map(({ tag }) => tag);
            allUniqueTags = [...new Set([...allUniqueTags, ...tags])];
        });
        return allUniqueTags;
    };

    const getDisplayUser = () => {
        const { email, displayName } = queryCache.getQueryData<{
            email: string;
            displayName: string;
        }>('authInfo');
        return displayName ? displayName : email;
    };

    return (
        <>
            <div className={classes.root}>
                <header className={classes.header}>
                    <button
                        className={classes.user}
                        onClick={(event) => setAnchorEl(event.currentTarget)}
                    >
                        <div>
                            <AccountCircle
                                fontSize="large"
                                style={{ margin: 'auto 0' }}
                            />
                            <h1>{getDisplayUser()}</h1>
                        </div>
                        <ExpandMore style={{ margin: 'auto 0' }} />
                    </button>
                </header>
                <List className={classes.content}>
                    <ListItem
                        button
                        selected={filter.name === 'All Notes'}
                        onClick={() =>
                            dispatch(
                                setFilter({
                                    newFilter: 'All Notes',
                                    type: 'nonTag'
                                })
                            )
                        }
                    >
                        <Description fontSize="small" />
                        <ListItemText
                            primary="All Notes"
                            classes={{ primary: classes['item-text'] }}
                        />
                    </ListItem>
                    <ListItem
                        button
                        selected={filter.name === 'Favorites'}
                        onClick={() =>
                            dispatch(
                                setFilter({
                                    newFilter: 'Favorites',
                                    type: 'nonTag'
                                })
                            )
                        }
                    >
                        <Star fontSize="small" />
                        <ListItemText
                            primary="Favorites"
                            classes={{ primary: classes['item-text'] }}
                        />
                    </ListItem>
                    {getAllUniqueTags().length > 0 && (
                        <ListItem
                            button
                            onClick={() => setTagOpen((prev) => !prev)}
                        >
                            <LocalOffer fontSize="small" />
                            <ListItemText
                                primary="Tags"
                                classes={{ primary: classes['item-text'] }}
                            />
                            {tagOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                    )}
                    <Collapse in={tagOpen} timeout="auto" unmountOnExit>
                        <List
                            component="div"
                            disablePadding
                            className={classes.tags}
                        >
                            {getAllUniqueTags().map((tag) => (
                                <ListItem
                                    key={tag}
                                    button
                                    selected={filter.name === tag}
                                    onClick={() =>
                                        dispatch(
                                            setFilter({
                                                newFilter: tag,
                                                type: 'tag'
                                            })
                                        )
                                    }
                                    style={{ paddingLeft: '2.5rem' }}
                                >
                                    <LocalOfferOutlined fontSize="small" />
                                    <ListItemText
                                        primary={tag}
                                        classes={{
                                            primary: classes['item-text']
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>
            </div>
            <AccountOptions anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
        </>
    );
};

export default SideMenu;
