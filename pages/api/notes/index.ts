import { getNotes, modifyNote, postNotes } from '../../../controllers/notes';
import connect from '../../../middleware/connect';

export default connect(async (req, res, connection, models) => {
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
                throw new Error('Invalid http method');
        }
    } catch (error) {
        console.log(error);
        if (!error.status) error.status = 500;
        res.status(error.status).json({ message: error.message });
    } finally {
        connection.close();
    }
});

export const config = {
    api: {
        externalResolver: true
    }
};
