import {
    BaseSyntheticEvent,
    FormEvent,
    KeyboardEvent,
    MouseEvent,
    useEffect,
    useState
} from 'react';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import {
    IconButton,
    List,
    ListItemText,
    Menu,
    MenuItem,
    TextField
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectEditor,
    addTag,
    deleteTag,
    setFilter
} from '../../store/slices/editorSlice';
import {
    useMutateAddTag,
    useMutateDeleteTag,
    useMutateSetTags
} from '../../hooks/noteMutationHooks';
import useLoader from '../../hooks/useLoader';
import classes from './TopMenu.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface EditTagsMenuProps {
    anchorEl: Element;
    setAnchorEl: React.Dispatch<React.SetStateAction<Element>>;
}

const EditTagsMenu = ({ anchorEl, setAnchorEl }: EditTagsMenuProps) => {
    const { notes, current } = useSelector(selectEditor);
    const getCurrentNote = (notes: Note[], current: string) => {
        return notes.find((note) => note._id === current);
    };

    const schema = yup.object().shape({
        tag: yup
            .string()
            .required()
            .test('duplicate', 'Duplicate tags are not allowed', (newTag) => {
                const note = getCurrentNote(notes, current);
                if (note.tags.find(({ tag }) => tag === newTag)) return false;
                return true;
            })
    });

    const { register, handleSubmit, reset, errors } = useForm<{ tag: string }>({
        resolver: yupResolver(schema)
    });
    const dispatch = useDispatch();
    const [mutateAddTag, { isLoading: addTagIsLoading }] = useMutateAddTag();
    const [
        mutateDeleteTag,
        { isLoading: deleteTagIsLoading }
    ] = useMutateDeleteTag();
    const [isMouseInsideDelete, setIsMouseInsideDelete] = useState(false);
    const [isMouseInside, setIsMouseInside] = useState<boolean[]>(
        notes.find((note) => note._id === current)?.tags?.map(() => false)
    );

    useLoader('add-tag', addTagIsLoading);
    useLoader('delete-tag', deleteTagIsLoading);

    const stopPropagation = (event: KeyboardEvent<HTMLDivElement>) => {
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowUp':
            case 'Home':
            case 'End':
                break;
            default:
                event.stopPropagation();
        }
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

    const onClickTag = (tag: string) => {
        dispatch(setFilter({ newFilter: tag, type: 'tag' }));
    };

    const addTagHandler: SubmitHandler<{ tag: string }> = async (
        { tag },
        event
    ) => {
        event.preventDefault();
        await mutateAddTag({ id: current, tag });
        reset();
    };

    const onDeleteTag = (
        event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
        tag: string
    ) => {
        event.stopPropagation();
        mutateDeleteTag({ id: current, tag });
    };

    useEffect(() => {
        setIsMouseInside(
            notes.find((note) => note._id === current)?.tags?.map(() => false)
        );
    }, [notes, current]);

    return (
        <Menu
            color="secondary"
            id="edit-tags-menu"
            classes={{ paper: classes['tags-menu-paper'] }}
            anchorEl={anchorEl}
            variant="menu"
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
        >
            <List className={classes.tags}>
                {getCurrentNote(notes, current)?.tags.map(({ tag }, index) => (
                    <MenuItem
                        key={tag}
                        disableRipple={isMouseInsideDelete}
                        onMouseEnter={() => onMouseEnter(index)}
                        onMouseLeave={() => onMouseLeave(index)}
                        onClick={() => onClickTag(tag)}
                        classes={{ root: classes['select-item-root'] }}
                    >
                        <ListItemText primary={tag} />
                        {isMouseInside[index] && (
                            <IconButton
                                style={{ marginLeft: 5, padding: 5 }}
                                size="small"
                                type="submit"
                                onMouseEnter={() =>
                                    setIsMouseInsideDelete(true)
                                }
                                onMouseLeave={() =>
                                    setIsMouseInsideDelete(false)
                                }
                                onClick={(event) => onDeleteTag(event, tag)}
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        )}
                    </MenuItem>
                ))}
            </List>
            <form
                className={classes['tags-menu-form']}
                onSubmit={handleSubmit(addTagHandler)}
            >
                <TextField
                    inputRef={register}
                    name="tag"
                    helperText={errors.tag?.message}
                    error={Boolean(errors.tag)}
                    style={{ borderBottom: 0 }}
                    onKeyDown={stopPropagation}
                    autoFocus
                    fullWidth
                />
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
