import classes from './GlobalSearchBar.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { selectEditor } from '../../store/slices/editorSlice';

const GlobalSearchBar = () => {
    const { nonFilteredNotes } = useSelector(selectEditor);

    return (
        <div className={classes['search-container']}>
            <div className={classes.search}>
                <input type="text" className={classes['search-input']} />
                <ul className={classes.results}>
                    {nonFilteredNotes.map(({ _id, title }, index) => (
                        <li key={_id} className={index == 3 && classes.active}>
                            {title}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GlobalSearchBar;
