import React from 'react';
import ToggleIconButton from './ToggleIconButton';
import classes from './TopMenu.module.scss';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import StarIcon from '@material-ui/icons/Star';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { Button, ButtonGroup, IconButton, Tooltip } from '@material-ui/core';

interface TopMenuProps {
    canEdit: boolean;
    setCanEdit: React.Dispatch<React.SetStateAction<boolean>>;
    preview: boolean;
    setPreview: React.Dispatch<React.SetStateAction<boolean>>;
    isFavorite: boolean;
    setIsFavorite: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopMenu = (props: TopMenuProps) => {
    const {
        canEdit,
        setCanEdit,
        preview,
        setPreview,
        isFavorite,
        setIsFavorite
    } = props;
    return (
        <div className={classes['top-menu']}>
            <ToggleIconButton
                toggle={canEdit}
                setToggle={setCanEdit}
                value="edit"
                selectedTitle="Edit"
                deselectedTitle="Stop Editing"
            >
                <EditIcon fontSize="small" />
            </ToggleIconButton>
            <ToggleIconButton
                toggle={preview}
                setToggle={setPreview}
                value="split"
                selectedTitle="Open Preview"
                deselectedTitle="Close Preview"
            >
                <VerticalSplitIcon fontSize="small" />
            </ToggleIconButton>
            <ToggleIconButton
                toggle={isFavorite}
                setToggle={setIsFavorite}
                value="favorite"
                selectedTitle="Favorite"
                deselectedTitle="Unfavorite"
            >
                <StarIcon fontSize="small" />
            </ToggleIconButton>
            <ButtonGroup>
                <Tooltip title="Save">
                    <Button
                        variant="outlined"
                        size="small"
                        style={{
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            minWidth: '44px',
                            marginLeft: '1rem',
                            color: '#d6d7d9',
                            border: '1px solid rgba(0, 0, 0, 0.12)'
                        }}
                    >
                        <SaveIcon fontSize="small" />
                    </Button>
                </Tooltip>
                <Tooltip title="Delete">
                    <Button
                        variant="outlined"
                        size="small"
                        style={{
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            minWidth: '44px',
                            color: '#d6d7d9',
                            border: '1px solid rgba(0, 0, 0, 0.12)'
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </Button>
                </Tooltip>
            </ButtonGroup>
        </div>
    );
};

export default TopMenu;
