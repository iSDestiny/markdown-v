import {
    Button,
    ButtonGroup,
    Chip,
    MenuItem,
    Select,
    Tooltip
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import LocalOffer from '@material-ui/icons/LocalOffer';
import SaveIcon from '@material-ui/icons/Save';
import StarIcon from '@material-ui/icons/Star';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    useMutateDeleteNote,
    useMutateModifyNote,
    useMutateToggleFavorite
} from '../../hooks/noteMutationHooks';
import useLoader from '../../hooks/useLoader';
import {
    selectEditor,
    setEditorType,
    setNoteToSaved,
    toggleEdit,
    toggleFavorite,
    toggleFullScreen,
    togglePreview
} from '../../store/slices/editorSlice';
import EditTagsMenu from './EditTagsMenu';
import ToggleIconButton from './ToggleIconButton';
import classes from './TopMenu.module.scss';

interface TopMenuProps {
    notes: Note[];
}

const TopMenu = ({ notes }: TopMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<Element>(null);
    const {
        canPreview,
        canEdit,
        current,
        isFullScreen,
        editorType
    } = useSelector(selectEditor);
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

    const onToggleEdit = () => {
        dispatch(toggleEdit());
    };

    return (
        <>
            <div className={classes['top-menu']}>
                <div className={classes.left}>
                    <ToggleIconButton
                        toggle={canEdit}
                        setToggle={onToggleEdit}
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
                        toggle={
                            notes.find((note) => note._id === current).favorite
                        }
                        setToggle={async () => {
                            const note = notes.find(
                                (note) => note._id === current
                            );
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
                                onClick={(event) =>
                                    setAnchorEl(event.currentTarget)
                                }
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
                </div>
                <div className={classes.right}>
                    {notes.find((note) => note._id === current)?.isTemp && (
                        <Chip
                            style={{ marginRight: '1rem' }}
                            label="unsaved"
                            color="primary"
                            size="small"
                            variant="outlined"
                        />
                    )}
                    <Select
                        displayEmpty
                        labelId="editor-select-label"
                        id="editor-select"
                        variant="outlined"
                        color="primary"
                        value={editorType}
                        onChange={(event) =>
                            dispatch(
                                setEditorType({ type: event.target.value })
                            )
                        }
                        classes={{
                            root: classes['select-root']
                        }}
                        MenuProps={{
                            classes: {
                                paper: classes['select-paper']
                            }
                        }}
                    >
                        <MenuItem
                            value="vim"
                            classes={{
                                selected: classes['select-item-selected'],
                                root: classes['select-item-root']
                            }}
                        >
                            vim
                        </MenuItem>
                        <MenuItem
                            value="vscode"
                            classes={{
                                selected: classes['select-item-selected'],
                                root: classes['select-item-root']
                            }}
                        >
                            vscode
                        </MenuItem>
                    </Select>
                </div>
            </div>
            <EditTagsMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
        </>
    );
};

export default TopMenu;
