import { createSlice } from '@reduxjs/toolkit';
import markdownToTxt from 'markdown-to-txt';
interface stateTypes {
    editor: {
        current: number;
        canEdit: boolean;
        canPreview: boolean;
        notes: Note[];
        loaders: {};
        sortType: 'titleAsc' | 'titleDesc';
    };
}
// sort type: 0 is ascending, 1 is descending
const byTitle = (first: Note, second: Note, sortType: 0 | 1) => {
    const base = sortType ? -1 : 1;
    if (first.title.toLowerCase() < second.title.toLowerCase()) return -base;
    if (first.title.toLowerCase() > second.title.toLowerCase()) return base;
    return 0;
};

const sortFuncs = {
    titleDesc: (first: Note, second: Note) => byTitle(first, second, 1),
    titleAsc: (first: Note, second: Note) => byTitle(first, second, 0)
};

const editorSlice = createSlice({
    name: 'editor',
    initialState: {
        current: 0,
        canEdit: true,
        canPreview: false,
        notes: [],
        loaders: {},
        // sorts notes by title ascending as default
        sortType: 'titleAsc'
    } as stateTypes['editor'],
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
            const { notes: prev, current } = state;
            const { originalNotes }: { originalNotes: Note[] } = action.payload;
            const toKeep = prev.filter((pNote) => pNote.isTemp);
            const toKeepDict = {};
            const prevIds = new Set(prev.map((pNote) => pNote._id));

            toKeep.forEach((keepNote) => {
                toKeepDict[keepNote._id] = keepNote;
            });
            let newNotes: Note[] = originalNotes.map((note: Note, index) => {
                if (!prevIds.has(note._id)) state.current = index;
                return note._id in toKeepDict ? toKeepDict[note._id] : note;
            });
            newNotes.sort(sortFuncs[state.sortType]);
            state.notes = newNotes;

            if (current >= state.notes.length)
                state.current = state.notes.length - 1;
        },

        setNotesFromEdit: (state, action) => {
            const newNotes = [...state.notes];
            const current = state.current;
            const { content: newContent } = action.payload;
            const firstLine = newContent.trim().split('\n')[0];
            const newTitle = markdownToTxt(firstLine).trim();
            const prevCurrId = newNotes[current] ? newNotes[current]._id : null;

            newNotes[current].title = newTitle ? newTitle : 'Untitled';
            newNotes[current].content = newContent;
            newNotes[current].isTemp = true;
            newNotes.sort(sortFuncs[state.sortType]);
            const newCurr = newNotes.findIndex(
                (note) => note._id === prevCurrId
            );
            state.notes = newNotes;
            state.current = newCurr;
        },

        setNoteToSaved: (state) => {
            const { current } = state;
            if (current < state.notes.length)
                state.notes[current].isTemp = false;
        },

        setSort: (state, action) => {
            const { sortType } = action.payload;
            state.sortType = sortType;
        },

        setLoader: (state, action) => {
            const { name, isLoading } = action.payload;
            state.loaders[name] = isLoading;
        }
    }
});

export const selectEditor = (state: stateTypes) => state.editor;
export const {
    setCurrent,
    toggleEdit,
    togglePreview,
    setNotesFromOriginal,
    setNotesFromEdit,
    setLoader,
    setNoteToSaved,
    setSort
} = editorSlice.actions;
export default editorSlice.reducer;
