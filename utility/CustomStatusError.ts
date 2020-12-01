class CustomStatusError extends Error {
    status: number;

    constructor(message = 'error occurred', status?: number) {
        super(message);
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
        this.status = status;
        this.message = message;
    }
}

export default CustomStatusError;
