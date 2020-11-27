import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import cookies from 'next-cookies';
import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import fetchRefresh from '../utility/fetchRefresh';

export default async function isAuthenticated(
    ctx: GetServerSidePropsContext<ParsedUrlQuery>
) {
    let token = cookies(ctx).ACCESS_TOKEN || '';
    let refresh = cookies(ctx).REFRESH_TOKEN || '';
    // console.log(Boolean(token), Boolean(refresh));
    const newCookies = new Cookies(ctx.req, ctx.res);

    try {
        if (!refresh) throw new Error('Refresh token does not exist');
        if (!token) {
            const {
                data: { token: accessToken }
            } = await fetchRefresh(refresh);
            token = accessToken;
            return newCookies.set('ACCESS_TOKEN', token);
        } else {
            const isAuth = jwt.verify(token, process.env.JWT_SECRET);
            if (!isAuth) throw new Error('jwt invalid');
            return isAuth;
        }
    } catch (err) {
        if (err?.name === 'TokenExpiredError') {
            try {
                const {
                    data: { token: accessToken }
                } = await fetchRefresh(refresh);
                token = accessToken;
                newCookies.set('ACCESS_TOKEN', token);
            } catch (err) {
                ctx.res.writeHead(302, { Location: '/login' });
                return ctx.res.end();
            }
        } else {
            ctx.res.writeHead(302, { Location: '/login' });
            return ctx.res.end();
        }
    }
}
