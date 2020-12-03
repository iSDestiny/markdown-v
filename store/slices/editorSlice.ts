import { createSlice } from '@reduxjs/toolkit';
import markdownToTxt from 'markdown-to-txt';
interface stateTypes {
    editor: {
        current: string;
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
        filter: {
            name: string;
            type: 'nonTag' | 'tag';
        };
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

const nonTagNoteFilters = {
    ['All Notes']: () => true,
    Favorites: (note: Note) => note.favorite
};

const editorSlice = createSlice({
    name: 'editor',
    initialState: {
        current: '',
        canEdit: true,
        canPreview: false,
        nonFilteredNotes: [],
        notes: [],
        loaders: {},
        // sorts notes by title ascending as default
        sortType: 'titleAsc',
        filter: { name: 'All Notes', type: 'nonTag' }
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

        toggleFavorite: (state) => {
            const { current, notes } = state;
            const index = state.notes.findIndex((note) => note._id === current);
            if (index >= 0)
                state.notes[index].favorite = !notes[index].favorite;
        },

        setNotesFromOriginal: (state, action) => {
            const { notes: prev, current, filter } = state;
            const { originalNotes }: { originalNotes: Note[] } = action.payload;
            const toKeep = prev.filter((pNote) => pNote.isTemp);
            const toKeepDict = {};
            const prevIds = new Set(prev.map((pNote) => pNote._id));

            if (!originalNotes) return;

            toKeep.forEach((keepNote) => {
                toKeepDict[keepNote._id] = keepNote;
            });
            let newNotes: Note[] = originalNotes.map((note: Note) => {
                if (!prevIds.has(note._id)) state.current = note._id;
                return note._id in toKeepDict ? toKeepDict[note._id] : note;
            });
            newNotes.sort(sortFuncs[state.sortType]);
            state.nonFilteredNotes = newNotes;
            if (filter.type === 'nonTag')
                state.notes = newNotes.filter(nonTagNoteFilters[filter.name]);
            else
                state.notes = newNotes.filter(
                    (note: Note) =>
                        note.tags.filter(({ tag }) => tag === filter.name)
                            .length > 0
                );

            if (
                state.notes.length > 0 &&
                !state.notes.find((note) => note._id === current)
            )
                state.current = state.notes[0]._id;
        },

        setNotesFromEdit: (state, action) => {
            const newNotes = [...state.notes];
            const current = state.current;
            const { content: newContent } = action.payload;
            const firstLine = newContent.trim().split('\n')[0];
            const newTitle = markdownToTxt(firstLine).trim();

            const index = newNotes.findIndex((note) => note._id === current);
            if (index >= 0) {
                newNotes[index].title = newTitle ? newTitle : 'Untitled';
                newNotes[index].content = newContent;
                newNotes[index].isTemp = true;
            }
            newNotes.sort(sortFuncs[state.sortType]);
            state.notes = newNotes;
        },

        setNoteToSaved: (state) => {
            const { current } = state;
            const index = state.notes.findIndex((note) => note._id === current);
            if (index >= 0) state.notes[index].isTemp = false;
        },

        setSort: (state, action) => {
            const { sortType } = action.payload;
            console.log(sortType);
            state.sortType = sortType;
            state.notes.sort(sortFuncs[state.sortType]);
        },

        setLoader: (state, action) => {
            const { name, isLoading } = action.payload;
            state.loaders[name] = isLoading;
        },

        setFilter: (state, action) => {
            const { nonFilteredNotes } = state;
            const { newFilter, type } = action.payload;
            state.filter.name = newFilter;
            state.filter.type = type;

            if (type === 'nonTag')
                state.notes = nonFilteredNotes.filter(
                    nonTagNoteFilters[newFilter]
                );
            else
                state.notes = nonFilteredNotes.filter(
                    (note: Note) =>
                        note.tags.filter(({ tag }) => tag === newFilter)
                            .length > 0
                );
            if (state.notes.length > 0) state.current = state.notes[0]._id;
        }
    }
});

export const selectEditor = (state: stateTypes) => state.editor;
export const {
    setCurrent,
    toggleEdit,
    togglePreview,
    toggleFavorite,
    setNotesFromOriginal,
    setNotesFromEdit,
    setLoader,
    setNoteToSaved,
    setSort,
    setFilter
} = editorSlice.actions;
export default editorSlice.reducer;
