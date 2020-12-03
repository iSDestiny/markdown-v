import { useMutation, useQueryCache } from 'react-query';
import { addNote, deleteNote, modifyNote } from '../utility/noteMutations';
import { NextRouter, useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setNoteToSaved } from '../store/slices/editorSlice';

export const useMutateAddNote = () => {
    const router = useRouter();
    const queryCache = useQueryCache();
    return useMutation(addNote, {
        onSuccess: ({ data: { note } }) =>
            queryCache.setQueryData('notes', (prev: Note[]) => [...prev, note]),
        onError: ({ response }) => {
            const { status } = response;
            if (status === 401) router.push('/login');
            else router.push('/500');
        }
    });
};

export const useMutateDeleteNote = () => {
    const router = useRouter();
    const queryCache = useQueryCache();
    return useMutation(deleteNote, {
        onSuccess: ({ data: { id } }) =>
            queryCache.setQueryData('notes', (prev: Note[]) =>
                prev.filter((pNote) => pNote._id !== id)
            ),
        onError: ({ response }) => {
            const { status } = response;
            if (status === 401) router.push('/login');
            else router.push('/500');
        }
    });
};

export const useMutateModifyNote = () => {
    const router = useRouter();
    const queryCache = useQueryCache();
    return useMutation(modifyNote, {
        onSuccess: ({ data: { note } }) =>
            queryCache.setQueryData('notes', (prev: Note[]) =>
                prev.map((pNote) => (pNote._id === note._id ? note : pNote))
            ),
        onError: ({ response }) => {
            const { status } = response;
            if (status === 401) router.push('/login');
            else router.push('/500');
        }
    });
};
