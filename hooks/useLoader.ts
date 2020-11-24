import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader, selectEditor } from '../store/slices/editorSlice';

const useLoader = (name: string, isLoading: boolean) => {
    const dispatch = useDispatch();
    const { loaders } = useSelector(selectEditor);

    useEffect(() => {
        dispatch(setLoader({ name, isLoading }));
    }, [isLoading]);

    return Object.keys(loaders).reduce(
        (acc, curr) => acc || loaders[curr],
        false
    );
};

export default useLoader;
