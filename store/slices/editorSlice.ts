import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootState } from 'react-redux';

const editorSlice = createSlice({
    name: 'editor',
    initialState: {
        current: 0,
        canEdit: true,
        canPreview: false
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
        }
    }
});

interface stateTypes {
    editor: {
        current: number;
        canEdit: boolean;
        canPreview: boolean;
    };
}

export const selectEditor = (state: stateTypes) => state.editor;
export const { setCurrent, toggleEdit, togglePreview } = editorSlice.actions;
export default editorSlice.reducer;
