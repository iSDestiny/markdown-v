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
import classes from './SideMenu.module.scss';

const SideMenu = () => {
    const [tagOpen, setTagOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<Element>(null);
    const queryCache = useQueryCache();

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
                            <h1>
                                {
                                    queryCache.getQueryData<{ email: string }>(
                                        'authInfo'
                                    )?.email
                                }
                            </h1>
                        </div>
                        <ExpandMore style={{ margin: 'auto 0' }} />
                    </button>
                </header>
                <List>
                    <ListItem button>
                        <Description fontSize="small" />
                        <ListItemText
                            primary="All Notes"
                            classes={{ primary: classes['item-text'] }}
                        />
                    </ListItem>
                    <ListItem button>
                        <Star fontSize="small" />
                        <ListItemText
                            primary="Favorites"
                            classes={{ primary: classes['item-text'] }}
                        />
                    </ListItem>
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
                    <Collapse in={tagOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button style={{ paddingLeft: '2.5rem' }}>
                                <LocalOfferOutlined fontSize="small" />
                                <ListItemText
                                    primary="Tag 1"
                                    classes={{ primary: classes['item-text'] }}
                                />
                            </ListItem>
                            <ListItem
                                button
                                style={{
                                    paddingLeft: '2.5rem',
                                    paddingRight: '2rem'
                                }}
                            >
                                <LocalOfferOutlined fontSize="small" />
                                <ListItemText
                                    primary="asdfasff"
                                    classes={{ primary: classes['item-text'] }}
                                />
                            </ListItem>
                            <ListItem button style={{ paddingLeft: '2.5rem' }}>
                                <LocalOfferOutlined fontSize="small" />
                                <ListItemText
                                    primary="Tag 1"
                                    classes={{ primary: classes['item-text'] }}
                                />
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
            </div>
            <AccountOptions anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
        </>
    );
};

export default SideMenu;
