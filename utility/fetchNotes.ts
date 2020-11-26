import axios from 'axios';

const fetchNotes = async () => {
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/api/notes`
    );
    return data;
};

export default fetchNotes;
