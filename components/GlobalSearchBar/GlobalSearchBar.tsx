import classes from './GlobalSearchBar.module.scss';
import fuzzysort from 'fuzzysort';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectEditor,
    setCurrent,
    setIsGlobalSearchOpen
} from '../../store/slices/editorSlice';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
const ScrollIntoViewIfNeeded = dynamic(
    () => import('react-scroll-into-view-if-needed'),
    {
        ssr: false
    }
);

interface SearchResult extends Note {
    indexes?: number[];
}

const GlobalSearchBar = () => {
    const { nonFilteredNotes, isGlobalSearchOpen } = useSelector(selectEditor);
    const dispatch = useDispatch();
    const [selected, setSelected] = useState(0);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
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
        const searchResults = getSearchResults();
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

    type getSearch = () => SearchResult[];

    const getSearchResults: getSearch = () => {
        return !searchQuery.trim() ? nonFilteredNotes : searchResults;
    };

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
        console.log('on change');
        setSearchQuery(event.target.value);
        const result = fuzzysort.go(event.target.value, nonFilteredNotes, {
            key: 'title'
        });
        const newNotes = result.map((res) => {
            let newResult: SearchResult = { ...res.obj, indexes: res.indexes };
            return newResult;
        });
        setSearchResults(newNotes);
        setSelected(0);
    };

    const highlightMatch = (id: string, title: string, indexes: number[]) => {
        let highlightedText = [];
        let indexSet = new Set(indexes);
        [...title].forEach((char, index) => {
            const highlightedChar = indexSet.has(index) ? (
                <mark key={`${id}-${index}`}>{char}</mark>
            ) : (
                <span key={`${id}-${index}`}>{char}</span>
            );
            highlightedText.push(highlightedChar);
        });
        return highlightedText;
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
                        onChange={(event) => onSearch(event)}
                        value={searchQuery}
                        type="text"
                        className={classes['search-input']}
                    />
                    <ul className={classes.results}>
                        {getSearchResults().map(
                            ({ _id, title, indexes }, index) => (
                                <ScrollIntoViewIfNeeded
                                    key={_id}
                                    active={index === selected}
                                >
                                    <li
                                        onClick={() => onClickNote(_id)}
                                        ref={
                                            index === selected
                                                ? selectedRef
                                                : null
                                        }
                                        className={classNames(classes.item, {
                                            [classes.active]: index === selected
                                        })}
                                    >
                                        {typeof indexes === 'undefined'
                                            ? title
                                            : highlightMatch(
                                                  _id,
                                                  title,
                                                  indexes
                                              )}
                                    </li>
                                </ScrollIntoViewIfNeeded>
                            )
                        )}
                    </ul>
                </div>
            </div>
        );
    else return null;
};

export default GlobalSearchBar;
