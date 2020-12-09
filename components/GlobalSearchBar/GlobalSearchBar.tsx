import classes from './GlobalSearchBar.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectEditor,
    setCurrent,
    setIsGlobalSearchOpen
} from '../../store/slices/editorSlice';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
const ScrollIntoViewIfNeeded = dynamic(
    () => import('react-scroll-into-view-if-needed'),
    {
        ssr: false
    }
);

const GlobalSearchBar = () => {
    const { nonFilteredNotes, isGlobalSearchOpen } = useSelector(selectEditor);
    const dispatch = useDispatch();
    const [selected, setSelected] = useState(0);
    const [searchResults, setSearchResults] = useState<Note[]>(
        nonFilteredNotes
    );
    const searchRef = useRef<HTMLDivElement>();
    const selectedRef = useRef<HTMLLIElement>();

    const handleClickAway = (event: MouseEvent) => {
        const { current } = searchRef;
        if (current && !current.contains(event.target as Node)) {
            dispatch(setIsGlobalSearchOpen({ open: false }));
        }
    };

    const mod = (n: number, m: number) => {
        return ((n % m) + m) % m;
    };

    const onClickNote = (id: string) => {
        if (id) dispatch(setCurrent({ current: id }));
        dispatch(setIsGlobalSearchOpen({ open: false }));
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const current = searchResults[selected]?._id;
            if (current) dispatch(setCurrent({ current }));
            dispatch(setIsGlobalSearchOpen({ open: false }));
        } else if (event.key === 'Escape') {
            dispatch(setIsGlobalSearchOpen({ open: false }));
        } else if (event.key === 'ArrowDown') {
            setSelected((prev) => mod(prev + 1, searchResults.length));
        } else if (event.key === 'ArrowUp') {
            setSelected((prev) => mod(prev - 1, searchResults.length));
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickAway);
        return () => {
            document.removeEventListener('click', handleClickAway);
        };
    }, []);

    if (isGlobalSearchOpen)
        return (
            <div className={classes['search-container']}>
                <div className={classes.search} ref={searchRef}>
                    <input
                        autoFocus
                        placeholder="Search through all notes"
                        onKeyDown={onKeyDown}
                        type="text"
                        className={classes['search-input']}
                    />
                    <ul className={classes.results}>
                        {searchResults.map(({ _id, title }, index) => (
                            <ScrollIntoViewIfNeeded
                                key={_id}
                                active={index === selected}
                            >
                                <li
                                    onClick={() => onClickNote(_id)}
                                    ref={
                                        index === selected ? selectedRef : null
                                    }
                                    className={classNames(classes.item, {
                                        [classes.active]: index === selected
                                    })}
                                >
                                    {title}
                                </li>
                            </ScrollIntoViewIfNeeded>
                        ))}
                    </ul>
                </div>
            </div>
        );
    else return null;
};

export default GlobalSearchBar;
