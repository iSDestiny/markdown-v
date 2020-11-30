import { NextApiRequest, NextApiResponse } from 'next';

export default function validateMiddleware(
    validations: any,
    validationResult: any
) {
    return async (req: NextApiRequest, res: NextApiResponse, next: any) => {
        await Promise.all(
            validations.map((validation: any) => validation.run(req))
        );

        const errors = validationResult(req);
        if (errors.isEmpty()) return next();

        res.status(422).json({ errors: errors.array() });
    };
}
