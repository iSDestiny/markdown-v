import { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import {
    IconButton,
    ListItemText,
    Menu,
    MenuItem,
    TextField
} from '@material-ui/core';
import classes from './TopMenu.module.scss';

interface EditTagsMenuProps {
    anchorEl: Element;
    setAnchorEl: React.Dispatch<React.SetStateAction<Element>>;
}

const EditTagsMenu = ({ anchorEl, setAnchorEl }: EditTagsMenuProps) => {
    const addTagHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <Menu
            color="secondary"
            id="edit-tags-menu"
            classes={{ paper: classes['tags-menu-paper'] }}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
        >
            <MenuItem>
                <ListItemText primary="React" />
            </MenuItem>
            <MenuItem>
                <ListItemText primary="CSS" />
            </MenuItem>
            <MenuItem>
                <ListItemText primary="Hello" />
            </MenuItem>
            <form
                className={classes['tags-menu-form']}
                onSubmit={(event) => addTagHandler(event)}
            >
                <TextField style={{ borderBottom: 0 }} autoFocus fullWidth />
                <IconButton
                    style={{ marginLeft: 5, padding: 5 }}
                    size="small"
                    type="submit"
                >
                    <AddIcon fontSize="small" />
                </IconButton>
            </form>
        </Menu>
    );
};

export default EditTagsMenu;
