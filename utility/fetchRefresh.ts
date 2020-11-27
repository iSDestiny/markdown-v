import axios from 'axios';

export default async function fetchRefresh(refresh: string) {
    return axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/api/auth/refresh`,
        {},
        { headers: { Cookie: `REFRESH_TOKEN=${refresh};` } }
    );
}
