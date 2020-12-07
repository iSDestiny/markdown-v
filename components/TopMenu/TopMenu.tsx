import React, { useState } from 'react';
import ToggleIconButton from './ToggleIconButton';
import classes from './TopMenu.module.scss';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import StarIcon from '@material-ui/icons/Star';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import LocalOffer from '@material-ui/icons/LocalOffer';
import SaveIcon from '@material-ui/icons/Save';
import { Button, ButtonGroup, Tooltip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectEditor,
    toggleEdit,
    togglePreview,
    setNoteToSaved,
    toggleFavorite,
    toggleFullScreen
} from '../../store/slices/editorSlice';
import {
    useMutateDeleteNote,
    useMutateModifyNote,
    useMutateToggleFavorite
} from '../../hooks/noteMutationHooks';
import useLoader from '../../hooks/useLoader';
import EditTagsMenu from './EditTagsMenu';

interface TopMenuProps {
    notes: Note[];
}

const TopMenu = ({ notes }: TopMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<Element>(null);
    const { canPreview, canEdit, current, isFullScreen } = useSelector(
        selectEditor
    );
    const dispatch = useDispatch();
    const [
        mutateDeleteNote,
        { isLoading: deleteIsLoading }
    ] = useMutateDeleteNote();
    const [
        mutateModifyNote,
        { isLoading: editIsLoading }
    ] = useMutateModifyNote();

    const [mutateToggleFavorite] = useMutateToggleFavorite();

    useLoader('delete', deleteIsLoading);
    useLoader('modify', editIsLoading);

    return (
        <div className={classes['top-menu']}>
            <ToggleIconButton
                toggle={canEdit}
                setToggle={() => dispatch(toggleEdit())}
                value="edit"
                selectedTitle="Edit"
                deselectedTitle="Stop Editing"
            >
                <EditIcon fontSize="small" />
            </ToggleIconButton>
            <ToggleIconButton
                toggle={canPreview}
                setToggle={() => dispatch(togglePreview())}
                value="split"
                selectedTitle="Open Preview"
                deselectedTitle="Close Preview"
            >
                <VerticalSplitIcon fontSize="small" />
            </ToggleIconButton>
            <ToggleIconButton
                toggle={notes.find((note) => note._id === current).favorite}
                setToggle={async () => {
                    const note = notes.find((note) => note._id === current);
                    dispatch(toggleFavorite());
                    note && mutateToggleFavorite(note._id);
                }}
                value="favorite"
                selectedTitle="Favorite"
                deselectedTitle="Unfavorite"
            >
                <StarIcon fontSize="small" />
            </ToggleIconButton>
            <ButtonGroup>
                <Tooltip title={isFullScreen ? 'Collapse' : 'Expand'}>
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
                        onClick={() => dispatch(toggleFullScreen())}
                    >
                        {isFullScreen ? (
                            <FullscreenExitIcon fontSize="small" />
                        ) : (
                            <FullscreenIcon fontSize="small" />
                        )}
                    </Button>
                </Tooltip>
                <Tooltip title="Edit Tags">
                    <Button
                        variant="outlined"
                        size="small"
                        style={{
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            minWidth: '44px',
                            color: '#d6d7d9',
                            border: '1px solid rgba(0, 0, 0, 0.12)'
                        }}
                        onClick={(event) => setAnchorEl(event.currentTarget)}
                    >
                        <LocalOffer fontSize="small" />
                    </Button>
                </Tooltip>
                <Tooltip title="Save">
                    <Button
                        variant="outlined"
                        size="small"
                        style={{
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            minWidth: '44px',
                            color: '#d6d7d9',
                            border: '1px solid rgba(0, 0, 0, 0.12)'
                        }}
                        onClick={async () => {
                            const note = notes.find(
                                (note) => note._id === current
                            );
                            note && (await mutateModifyNote(note));
                            dispatch(setNoteToSaved());
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
                        onClick={() => {
                            const note = notes.find(
                                (note) => note._id === current
                            );
                            note && mutateDeleteNote(note._id);
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </Button>
                </Tooltip>
            </ButtonGroup>
            <EditTagsMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
        </div>
    );
};

export default TopMenu;
