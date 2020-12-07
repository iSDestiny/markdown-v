import fuzzysort from 'fuzzysort';
import { createSlice } from '@reduxjs/toolkit';
import markdownToTxt from 'markdown-to-txt';
interface stateTypes {
    editor: {
        current: string;
        canEdit: boolean;
        canPreview: boolean;
        isFullScreen: boolean;
        notes: Note[];
        nonFilteredNotes: Note[];
        nonSearchedNotes: Note[];
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
        searchQuery: '';
    };
}
// sort type: 0 is ascending, 1 is descending
const byTitle = (first: Note, second: Note, sortType: 0 | 1) => {
    const base = sortType ? -1 : 1;
    if (first.title.toLowerCase() < second.title.toLowerCase()) return -base;
    if (first.title.toLowerCase() > second.title.toLowerCase()) return base;
    return 0;
};

const byDateUpdated = (first: Note, second: Note, sortType: 0 | 1) => {
    const base = sortType ? -1 : 1;
    const { updatedAt: firstUpdate } = first;
    const { updatedAt: secondUpdate } = second;
    const firstUpdateDate = new Date(firstUpdate);
    const secondUpdateDate = new Date(secondUpdate);
    if (firstUpdateDate.getTime() < secondUpdateDate.getTime()) return -base;
    if (firstUpdateDate.getTime() > secondUpdateDate.getTime()) return base;
    return 0;
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
        isFullScreen: false,
        nonFilteredNotes: [],
        nonSearchedNotes: [],
        notes: [],
        loaders: {},
        // sorts notes by title ascending as default
        sortType: 'titleAsc',
        filter: { name: 'All Notes', type: 'nonTag' },
        searchQuery: ''
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

        toggleFullScreen: (state) => {
            state.isFullScreen = !state.isFullScreen;
        },

        toggleFavorite: (state) => {
            const { current, notes } = state;
            const index = state.notes.findIndex((note) => note._id === current);
            if (index >= 0)
                state.notes[index].favorite = !notes[index].favorite;
        },

        addTag: (state, action) => {
            const { current } = state;
            const { tag } = action.payload;
            const index = state.notes.findIndex((note) => note._id === current);
            if (index >= 0) state.notes[index].tags.push({ tag });
        },

        deleteTag: (state, action) => {
            const { current, notes } = state;
            const { tagToDelete } = action.payload;
            const index = state.notes.findIndex((note) => note._id === current);
            if (index >= 0)
                state.notes[index].tags = notes[index].tags.filter(
                    ({ tag }) => tag !== tagToDelete
                );
        },

        setNotesFromOriginal: (state, action) => {
            const { notes: prev, current, filter } = state;
            const { originalNotes }: { originalNotes: Note[] } = action.payload;
            const toKeep = prev.filter((pNote) => pNote.isTemp);
            const toKeepDict = {};
            const prevIds = new Set(prev.map((pNote) => pNote._id));
            const prevIndex = prev.findIndex((pNote) => pNote._id === current);

            if (!originalNotes) return;

            toKeep.forEach((keepNote) => {
                toKeepDict[keepNote._id] = keepNote;
            });
            let newNotes: Note[] = originalNotes.map((note: Note) => {
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

            state.nonSearchedNotes = state.notes;
            console.log(state.nonSearchedNotes);
            if (state.searchQuery.trim()) {
                const result = fuzzysort.go(
                    state.searchQuery,
                    state.nonSearchedNotes,
                    { key: 'title' }
                );
                state.notes = result.map((res) => res.obj);
            }

            state.notes.forEach((note) => {
                if (!prevIds.has(note._id)) state.current = note._id;
            });

            if (state.notes.length > 0 && !current) {
                state.current = state.notes[0]._id;
            } else if (
                state.notes.length > 0 &&
                !state.notes.find((note) => note._id === current)
            ) {
                if (prevIndex >= 0 && prevIndex < state.notes.length)
                    state.current = state.notes[prevIndex]._id;
                else state.current = state.notes[state.notes.length - 1]._id;
            }
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
            const { nonFilteredNotes, searchQuery, current } = state;
            const { newFilter, type } = action.payload;
            state.filter.name = newFilter;
            state.filter.type = type;

            if (type === 'nonTag') {
                state.nonSearchedNotes = nonFilteredNotes.filter(
                    nonTagNoteFilters[newFilter]
                );
            } else {
                state.nonSearchedNotes = nonFilteredNotes.filter(
                    (note: Note) =>
                        note.tags.filter(({ tag }) => tag === newFilter)
                            .length > 0
                );
            }

            state.notes = state.nonSearchedNotes;
            if (searchQuery.trim()) {
                const result = fuzzysort.go(
                    searchQuery,
                    state.nonSearchedNotes,
                    { key: 'title' }
                );
                state.notes = result.map((res) => res.obj);
            }

            if (
                state.notes.length > 0 &&
                !state.notes.find((note) => note._id === current)
            )
                state.current = state.notes[0]._id;
        },

        setSearchQuery: (state, action) => {
            const { query } = action.payload;
            state.searchQuery = query;
            if (state.searchQuery.trim()) {
                const result = fuzzysort.go(
                    state.searchQuery,
                    state.nonSearchedNotes,
                    { key: 'title' }
                );
                state.notes = result.map((res) => res.obj);
                if (
                    state.notes.length > 0 &&
                    !state.notes.find((note) => note._id === state.current)
                )
                    state.current = state.notes[0]._id;
            } else {
                state.notes = state.nonSearchedNotes;
            }
        }
    }
});

export const selectEditor = (state: stateTypes) => state.editor;
export const {
    setCurrent,
    toggleEdit,
    togglePreview,
    toggleFullScreen,
    toggleFavorite,
    setNotesFromOriginal,
    setNotesFromEdit,
    setLoader,
    setNoteToSaved,
    setSort,
    setSearchQuery,
    setFilter,
    addTag,
    deleteTag
} = editorSlice.actions;
export default editorSlice.reducer;
