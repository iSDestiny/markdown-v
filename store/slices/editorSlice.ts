import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootState } from 'react-redux';

const editorSlice = createSlice({
    name: 'editor',
    initialState: {
        current: 0,
        canEdit: true,
        canPreview: false,
        notes: []
    },
    reducers: {
        setCurrent: (state, action) => {
            const { current } = action.payload;
            state.current = current;
        },

        toggleEdit: (state) => {
            state.canEdit = !state.canEdit;
        },

        togglePreview: (state) => {
            state.canPreview = !state.canPreview;
        },

        setNotesFromOriginal: (state, action) => {
            const prev = state.notes;
            const { originalNotes } = action.payload;
            const toKeep = prev.filter((pNote) => pNote.isTemp);
            const toKeepDict = {};
            toKeep.forEach((keepNote) => {
                toKeepDict[keepNote._id] = keepNote;
            });
            state.notes = originalNotes.map((note: Note) =>
                note._id in toKeepDict ? toKeepDict[note._id] : note
            );
        },

        setNotesFromEdit: (state, action) => {
            const newNotes = [...state.notes];
            const current = state.current;
            const { content: newContent } = action.payload;
            const firstLine = newContent.trim().split('\n')[0];
            const newTitle = firstLine.replace(/[^\w\s]/gi, '');
            newNotes[current].title = newTitle ? newTitle : 'Untitled';
            newNotes[current].content = newContent;
            newNotes[current].isTemp = true;
            state.notes = newNotes;
        }
    }
});

interface stateTypes {
    editor: {
        current: number;
        canEdit: boolean;
        canPreview: boolean;
        notes: Note[];
    };
}

export const selectEditor = (state: stateTypes) => state.editor;
export const {
    setCurrent,
    toggleEdit,
    togglePreview,
    setNotesFromOriginal,
    setNotesFromEdit
} = editorSlice.actions;
export default editorSlice.reducer;
