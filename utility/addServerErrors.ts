import { ErrorOption } from 'react-hook-form';
interface ValidationErrorI {
    location: string;
    msg: string;
    param: string;
    value: string;
}

const addServerErrors = (
    errors: ValidationErrorI[],
    setError: (fieldName: string, error: ErrorOption) => void
) => {
    errors.forEach(({ param, msg }) => {
        setError(param, { type: 'manual', message: msg });
    });
};

export default addServerErrors;
