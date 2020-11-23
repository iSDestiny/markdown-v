import axios from 'axios';

const fetchNotes = async () => {
    const { data } = await axios.get('http://localhost:3000/api/notes');
    return data;
};

export default fetchNotes;
