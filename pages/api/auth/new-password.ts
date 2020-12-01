import connect, { handlerType } from '../../../middleware/connect';
import CustomStatusError from '../../../utility/CustomStatusError';
import { postNewPassword } from './../../../controllers/auth';

const newPassword: handlerType = async (req, res, connection, models) => {
    const { method } = req;

    try {
        switch (method) {
            case 'POST':
                console.log('in post new password');
                return await postNewPassword(req, res, models);
            default:
                throw new CustomStatusError('Invalid http method', 405);
        }
    } catch (error) {
        console.log(error);
        if (!error.status) error.status = 500;
        console.log(error.message);
        res.status(error.status).json({ message: error.message });
    } finally {
        connection.close();
    }
};

export default connect(newPassword);

export const config = {
    api: {
        externalResolver: true
    }
};
