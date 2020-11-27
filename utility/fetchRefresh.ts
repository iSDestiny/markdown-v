import axios from 'axios';

export async function fetchRefreshSSR(refresh: string) {
    return axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/api/auth/refresh`,
        {},
        { headers: { Cookie: `REFRESH_TOKEN=${refresh};` } }
    );
}

export async function fetchRefresh() {
    return axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/api/auth/refresh`,
        {}
    );
}

export async function fetchRefreshQuery() {
    await fetchRefresh();
    return true;
}
