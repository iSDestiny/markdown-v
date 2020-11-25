import { getNotes, modifyNote, postNotes } from '../../../controllers/notes';
import connect from '../../../middleware/connect';
import { handlerType } from '../../../middleware/connect';
import CustomStatusError from '../../../utility/CustomStatusError';

const notes: handlerType = async (req, res, connection, models) => {
    const { method } = req;

    try {
        switch (method) {
            case 'GET':
                console.log('in get');
                return await getNotes(req, res, models);
            case 'POST':
                console.log('in post');
                return await postNotes(req, res, models);
            case 'PUT':
                console.log('in put');
                return await modifyNote(req, res, models);
            default:
                throw new CustomStatusError('Invalid http method', 405);
        }
    } catch (error) {
        console.log(error);
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: error.message });
    } finally {
        connection.close();
    }
};

export default connect(notes);

export const config = {
    api: {
        externalResolver: true
    }
};
