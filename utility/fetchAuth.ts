import axios from 'axios';

export const fetchLogin = async (
    key: string,
    { email, password }: { email: string; password: string }
) => {
    await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/api/auth/login`,
        { email, password }
    );
    return true;
};

export const fetchSignup = async (
    key: string,
    { email, password }: { email: string; password: string }
) => {
    await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/api/auth/login`,
        { email, password }
    );
    return true;
};

export const fetchAuthInfo = async () => {
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/api/auth`
    );
    return data;
};
