import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import cookies from 'next-cookies';
import jwt from 'jsonwebtoken';
import { fetchRefreshSSR as fetchRefresh } from '../utility/fetchRefresh';

export default function isUnauthenticated(
    ctx: GetServerSidePropsContext<ParsedUrlQuery>
) {
    let token = cookies(ctx).ACCESS_TOKEN || '';
    // let refresh = cookies(ctx).REFRESH_TOKEN || '';
    try {
        const isAuth = jwt.verify(token, process.env.JWT_SECRET);
        if (!isAuth) throw new Error('jwt invalid');
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        };
    } catch (err) {
        return { props: {} };
    }

    // try {
    //     // if (!refresh) throw new Error('Refresh token does not exist');
    //     if (!token) {
    //         const {
    //             data: { token: accessToken }
    //         } = await fetchRefresh(refresh);
    //         token = accessToken;
    //         newCookies.set('ACCESS_TOKEN', token);
    //     } else {
    //         const isAuth = jwt.verify(token, process.env.JWT_SECRET);
    //         if (!isAuth) throw new Error('jwt invalid');
    //     }
    //     ctx.res.writeHead(302, { Location: '/' });
    //     return ctx.res.end();
    // } catch (err) {
    //     if (err?.name === 'TokenExpiredError') {
    //         try {
    //             const {
    //                 data: { token: accessToken }
    //             } = await fetchRefresh(refresh);
    //             token = accessToken;
    //             newCookies.set('ACCESS_TOKEN', token);
    //             ctx.res.writeHead(302, { Location: '/' });
    //             return ctx.res.end();
    //         } catch (err) {
    //             return;
    //         }
    //     }
    // }
}
