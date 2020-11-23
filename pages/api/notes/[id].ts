import { deleteNote } from '../../../controllers/notes';
import connect from '../../../middleware/connect';

export default connect(async (req, res, connection, models) => {
    const { method } = req;

    try {
        switch (method) {
            case 'DELETE':
                console.log('in delete');
                return await deleteNote(req, res, models);
            default:
                throw new Error('Invalid http method');
        }
    } catch (error) {
        console.log(error);
        error.status = error.status || 500;
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
