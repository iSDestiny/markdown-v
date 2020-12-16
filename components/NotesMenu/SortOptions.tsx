import {
    IconButton,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip
} from '@material-ui/core';
import SortIcon from '@material-ui/icons/Sort';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectEditor, setSort } from 'store/slices/editorSlice';
import classes from './NotesMenu.module.scss';
import classNames from 'classnames';

const SortOptions = () => {
    const [anchorEl, setAnchorEl] = useState<Element>(null);
    const { sortType } = useSelector(selectEditor);
    const dispatch = useDispatch();

    const sortHandler = (selectedSortType: string) => {
        setAnchorEl(null);
        let newSortType: string;
        if (sortType.includes(selectedSortType))
            newSortType = sortType.includes('Asc')
                ? selectedSortType + 'Desc'
                : selectedSortType + 'Asc';
        else newSortType = selectedSortType + 'Asc';

        dispatch(setSort({ sortType: newSortType }));
    };

    return (
        <>
            <Tooltip title="Sort Options">
                <IconButton
                    color="inherit"
                    size="small"
                    edge="end"
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                >
                    <SortIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
            <Menu
                color="secondary"
                id="sort options"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <ListItemText
                    primary="Sort By"
                    style={{ paddingLeft: '1rem' }}
                />
                <MenuItem
                    selected={sortType.includes('title')}
                    onClick={() => sortHandler('title')}
                >
                    <div
                        className={classNames(classes['sort-option-type'], {
                            [classes.invisible]: !sortType.includes('title')
                        })}
                    >
                        <ArrowUpwardIcon
                            fontSize="inherit"
                            className={classNames({
                                [classes['not-selected']]:
                                    sortType !== 'titleAsc'
                            })}
                        />
                        <ArrowDownwardIcon
                            fontSize="inherit"
                            className={classNames(classes['descending'], {
                                [classes['not-selected']]:
                                    sortType !== 'titleDesc'
                            })}
                        />
                    </div>
                    Title
                </MenuItem>
                <MenuItem
                    selected={sortType.includes('dateUpdated')}
                    onClick={() => sortHandler('dateUpdated')}
                >
                    <div
                        className={classNames(classes['sort-option-type'], {
                            [classes.invisible]: !sortType.includes(
                                'dateUpdated'
                            )
                        })}
                    >
                        <ArrowUpwardIcon
                            fontSize="inherit"
                            className={classNames({
                                [classes['not-selected']]:
                                    sortType !== 'dateUpdatedAsc'
                            })}
                        />
                        <ArrowDownwardIcon
                            fontSize="inherit"
                            className={classNames(classes['descending'], {
                                [classes['not-selected']]:
                                    sortType !== 'dateUpdatedDesc'
                            })}
                        />
                    </div>
                    Date updated
                </MenuItem>
                <MenuItem
                    selected={sortType.includes('dateCreated')}
                    onClick={() => sortHandler('dateCreated')}
                >
                    <div
                        className={classNames(classes['sort-option-type'], {
                            [classes.invisible]: !sortType.includes(
                                'dateCreated'
                            )
                        })}
                    >
                        <ArrowUpwardIcon
                            fontSize="inherit"
                            className={classNames({
                                [classes['not-selected']]:
                                    sortType !== 'dateCreatedAsc'
                            })}
                        />
                        <ArrowDownwardIcon
                            fontSize="inherit"
                            className={classNames(classes['descending'], {
                                [classes['not-selected']]:
                                    sortType !== 'dateCreatedDesc'
                            })}
                        />
                    </div>
                    Date created
                </MenuItem>
            </Menu>
        </>
    );
};

export default SortOptions;
