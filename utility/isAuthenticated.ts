import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import cookies from 'next-cookies';
import jwt from 'jsonwebtoken';

export default function isAuthenticated(
    ctx: GetServerSidePropsContext<ParsedUrlQuery>
) {
    let token = cookies(ctx).ACCESS_TOKEN || '';

    try {
        const isAuth = jwt.verify(token, process.env.JWT_SECRET);
        if (!isAuth) throw new Error('jwt invalid');
        return { props: {} };
    } catch (err) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        };
    }
}
