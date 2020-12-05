import { FormEvent, MouseEvent, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
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
    const [isMouseInsideDelete, setIsMouseInsideDelete] = useState(false);
    const [isMouseInside, setIsMouseInside] = useState<boolean[]>([
        false,
        false,
        false
    ]);
    const addTagHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const onMouseLeave = (index: number) => {
        setIsMouseInside((prev) => {
            const newEvents = [...prev];
            newEvents[index] = false;
            return newEvents;
        });
    };

    const onMouseEnter = (index: number) => {
        setIsMouseInside((prev) => {
            const newEvents = [...prev];
            newEvents[index] = true;
            return newEvents;
        });
    };

    const onClickTag = () => {
        console.log('tag');
    };

    const onDeleteTag = (
        event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        event.stopPropagation();
        console.log('delete');
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
            <MenuItem
                disableRipple={isMouseInsideDelete}
                onMouseEnter={() => onMouseEnter(0)}
                onMouseLeave={() => onMouseLeave(0)}
                onClick={() => onClickTag()}
            >
                <ListItemText primary="React" />
                {isMouseInside[0] && (
                    <IconButton
                        style={{ marginLeft: 5, padding: 5 }}
                        size="small"
                        type="submit"
                        onMouseEnter={() => setIsMouseInsideDelete(true)}
                        onMouseLeave={() => setIsMouseInsideDelete(false)}
                        onClick={(event) => onDeleteTag(event)}
                    >
                        <ClearIcon fontSize="small" />
                    </IconButton>
                )}
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
