import React from 'react';
import ToggleIconButton from './ToggleIconButton';
import classes from './TopMenu.module.scss';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import StarIcon from '@material-ui/icons/Star';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { Button, ButtonGroup, IconButton, Tooltip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectEditor,
    toggleEdit,
    togglePreview,
    setNoteToSaved
} from '../../store/slices/editorSlice';
import {
    useMutateDeleteNote,
    useMutateModifyNote
} from '../../hooks/noteMutationHooks';
import useLoader from '../../hooks/useLoader';

interface TopMenuProps {
    isFavorite: boolean;
    notes: Note[];
    setIsFavorite: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopMenu = ({ notes, isFavorite, setIsFavorite }: TopMenuProps) => {
    const { canPreview, canEdit, current } = useSelector(selectEditor);
    const dispatch = useDispatch();
    const [
        mutateDeleteNote,
        { isLoading: deleteIsLoading }
    ] = useMutateDeleteNote();
    const [
        mutateModifyNote,
        { isLoading: editIsLoading }
    ] = useMutateModifyNote();

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
            {/* <ToggleIconButton
                toggle={isFavorite}
                setToggle={setIsFavorite}
                value="favorite"
                selectedTitle="Favorite"
                deselectedTitle="Unfavorite"
            >
                <StarIcon fontSize="small" />
            </ToggleIconButton> */}
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
                        onClick={async () => {
                            notes[current] &&
                                (await mutateModifyNote(notes[current]));
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
                        onClick={() =>
                            notes[current] &&
                            mutateDeleteNote(notes[current]._id)
                        }
                    >
                        <DeleteIcon fontSize="small" />
                    </Button>
                </Tooltip>
            </ButtonGroup>
        </div>
    );
};

export default TopMenu;
