import axios from 'axios';

export const addNote = (note?: NewNote) => {
    return axios.post('/api/notes', { ...note });
};

export const deleteNote = (id: string) => {
    return axios.delete(`/api/notes/${id}`);
};

export const modifyNote = (note: Note) => {
    return axios.put('/api/notes', { ...note });
};

export const toggleFavorite = (id: string) => {
    return axios.post('/api/notes/toggle-favorite', { id });
};

export const setTags = (note: Note) => {
    return axios.post('/api/notes/set-tags', { ...note });
};

export const addTag = ({ id, tag }: { id: string; tag: string }) => {
    return axios.post('/api/notes/add-tag', { id, tag });
};

export const deleteTag = ({ id, tag }: { id: string; tag: string }) => {
    return axios.post('/api/notes/delete-tag', { id, tag });
};
