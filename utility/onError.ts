import { ExtendedRequest } from 'middleware/connect';
import { NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

const onError = (
    err: any,
    req: ExtendedRequest,
    res: NextApiResponse,
    next: NextHandler
) => {
    console.log(err);
    req.dbConnection.close();
    err.status = err.status || 500;
    res.status(err.status).json({
        message: err.message || 'something went wrong'
    });
};

export default onError;
