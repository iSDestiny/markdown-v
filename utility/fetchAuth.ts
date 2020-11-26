import axios from 'axios';

export const fetchLogin = async (
    key: string,
    { email, password }: { email: string; password: string }
) => {
    const {
        data
    } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/api/auth/login`,
        { email, password }
    );
    return data;
};

export const fetchSignup = async (
    key: string,
    { email, password }: { email: string; password: string }
) => {
    const {
        data
    } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/api/auth/login`,
        { email, password }
    );
    return data;
};
