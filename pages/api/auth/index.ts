// import { getAuthInfo } from './../../../controllers/auth';
// import connect from '../../../middleware/connect';
// import { handlerType } from '../../../middleware/connect';
// import CustomStatusError from '../../../utility/CustomStatusError';

// const auth: handlerType = async (req, res, connection, models) => {
//     const { method } = req;

//     try {
//         switch (method) {
//             case 'GET':
//                 console.log('in post login');
//                 return await getAuthInfo(req, res, models);
//             default:
//                 throw new CustomStatusError('Invalid http method', 405);
//         }
//     } catch (error) {
//         console.log(error);
//         if (!error.status) error.status = 500;
//         res.status(error.status).json({ message: error.message });
//     } finally {
//         connection.close();
//     }
// };

// export default connect(auth);

// export const config = {
//     api: {
//         externalResolver: true
//     }
// };

import { ExtendedRequest, nextConnectDB } from 'middleware/connect';
import nc from 'next-connect';
import onError from 'utility/onError';
import authenticate from 'middleware/authenticate';
import { NextApiResponse } from 'next';
import { getAuthInfo } from 'controllers/auth';

const handler = nc<ExtendedRequest, NextApiResponse>({ onError });

handler.use(nextConnectDB);
handler.use(authenticate);

handler.get(getAuthInfo);

export default handler;
