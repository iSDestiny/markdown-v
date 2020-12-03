import axios from 'axios';

export const addNote = (note?: Note) => {
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
