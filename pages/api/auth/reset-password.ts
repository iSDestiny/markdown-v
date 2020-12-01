import connect, { handlerType } from '../../../middleware/connect';
import CustomStatusError from '../../../utility/CustomStatusError';
import { postResetPassword } from './../../../controllers/auth';

const changePassword: handlerType = async (req, res, connection, models) => {
    const { method } = req;

    try {
        switch (method) {
            case 'POST':
                console.log('in post reset password');
                return await postResetPassword(req, res, models);
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

export default connect(changePassword);

export const config = {
    api: {
        externalResolver: true
    }
};
