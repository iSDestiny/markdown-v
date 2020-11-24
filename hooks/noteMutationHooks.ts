import { useMutation, useQueryCache } from 'react-query';
import { addNote, deleteNote, modifyNote } from '../utility/noteMutations';
import { useDispatch } from 'react-redux';
import { setNoteToSaved } from '../store/slices/editorSlice';

export const useMutateAddNote = () => {
    const queryCache = useQueryCache();
    return useMutation(addNote, {
        onSuccess: ({ data: { note } }) =>
            queryCache.setQueryData('notes', (prev: Note[]) => [...prev, note])
    });
};

export const useMutateDeleteNote = () => {
    const queryCache = useQueryCache();
    return useMutation(deleteNote, {
        onSuccess: ({ data: { id } }) =>
            queryCache.setQueryData('notes', (prev: Note[]) =>
                prev.filter((pNote) => pNote._id !== id)
            )
    });
};

export const useMutateModifyNote = () => {
    const queryCache = useQueryCache();
    return useMutation(modifyNote, {
        onSuccess: ({ data: { note } }) =>
            queryCache.setQueryData('notes', (prev: Note[]) =>
                prev.map((pNote) => (pNote._id === note._id ? note : pNote))
            )
    });
};
