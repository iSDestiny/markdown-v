import { createSlice } from '@reduxjs/toolkit';
import markdownToTxt from 'markdown-to-txt';
interface stateTypes {
    editor: {
        current: number;
        canEdit: boolean;
        canPreview: boolean;
        notes: Note[];
        loaders: {};
        sortType:
            | 'titleAsc'
            | 'titleDesc'
            | 'dateUpdatedAsc'
            | 'dateUpdatedDesc'
            | 'dateCreatedAsc'
            | 'dateCreatedDesc';
    };
}
// sort type: 0 is ascending, 1 is descending
const byTitle = (first: Note, second: Note, sortType: 0 | 1) => {
    const base = sortType ? -1 : 1;
    if (first.title.toLowerCase() < second.title.toLowerCase()) return -base;
    if (first.title.toLowerCase() > second.title.toLowerCase()) return base;
    return 0;
};

// const byDateLogic = (
//     dateType: string,
//     first: Note,
//     second: Note,
//     sortType: 0 | 1
// ) => {
//     const base = sortType ? -1 : 1;
//     const firstDate = new Date(first[dateType]);
//     const secondDate = new Date(second[dateType]);
//     console.log(firstDate.getTime() < secondDate.getTime());
//     if (firstDate.getTime() < secondDate.getTime()) return -base;
//     if (firstDate.getTime() > secondDate.getTime()) return base;
//     return 0;
// };

const byDateUpdated = (first: Note, second: Note, sortType: 0 | 1) => {
    const base = sortType ? -1 : 1;
    const { updatedAt: firstUpdate } = first;
    const { updatedAt: secondUpdate } = second;
    const firstUpdateDate = new Date(firstUpdate);
    const secondUpdateDate = new Date(secondUpdate);
    if (firstUpdateDate.getTime() < secondUpdateDate.getTime()) return -base;
    if (firstUpdateDate.getTime() > secondUpdateDate.getTime()) return base;
    return 0;
    // byDateLogic('updatedAt', first, second, sortType);
};

const byDateCreated = (first: Note, second: Note, sortType: 0 | 1) => {
    const base = sortType ? -1 : 1;
    const { createdAt: firstCreated } = first;
    const { createdAt: secondCreated } = second;
    const firstCreatedDate = new Date(firstCreated);
    const secondCreatedDate = new Date(secondCreated);
    if (firstCreatedDate.getTime() < secondCreatedDate.getTime()) return -base;
    if (firstCreatedDate.getTime() > secondCreatedDate.getTime()) return base;
    return 0;
    // byDateLogic('createdAt', first, second, sortType);
};

const sortFuncs = {
    titleDesc: (first: Note, second: Note) => byTitle(first, second, 1),
    titleAsc: (first: Note, second: Note) => byTitle(first, second, 0),
    dateUpdatedDesc: (first: Note, second: Note) =>
        byDateUpdated(first, second, 1),
    dateUpdatedAsc: (first: Note, second: Note) =>
        byDateUpdated(first, second, 0),
    dateCreatedDesc: (first: Note, second: Note) =>
        byDateCreated(first, second, 1),
    dateCreatedAsc: (first: Note, second: Note) =>
        byDateCreated(first, second, 0)
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
            const { notes: prev, current } = state;
            const { originalNotes }: { originalNotes: Note[] } = action.payload;
            const toKeep = prev.filter((pNote) => pNote.isTemp);
            const toKeepDict = {};
            const prevIds = new Set(prev.map((pNote) => pNote._id));
            const prevCurrId = prev[current] ? prev[current]._id : null;
            let newNoteId: string;

            toKeep.forEach((keepNote) => {
                toKeepDict[keepNote._id] = keepNote;
            });
            let newNotes: Note[] = originalNotes.map((note: Note, index) => {
                if (!prevIds.has(note._id)) newNoteId = note._id;
                return note._id in toKeepDict ? toKeepDict[note._id] : note;
            });
            newNotes.sort(sortFuncs[state.sortType]);
            state.notes = newNotes;

            if (prevCurrId)
                state.current = state.notes.findIndex(
                    (note) => note._id === prevCurrId
                );

            if (newNoteId)
                state.current = state.notes.findIndex(
                    (note) => note._id === newNoteId
                );

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
            console.log(sortType);
            const prevCurrId = state.notes[state.current]._id;
            state.sortType = sortType;
            state.notes.sort(sortFuncs[state.sortType]);
            state.current = state.notes.findIndex(
                (note) => note._id === prevCurrId
            );
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
