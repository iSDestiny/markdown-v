export default {
    // Uncomment the line below to enable basePath, pages and
    // redirects will then have a path prefix (`/app` in this case)
    //
    // basePath: '/app',

    async redirects() {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: false
            },
            // Path Matching - will match `/old-blog/a`, but not `/old-blog/a/b`
            {
                source: '/login',
                destination: '/',
                permanent: false
            },
            // Wildcard Path Matching - will match `/blog/a` and `/blog/a/b`
            {
                source: '/signup',
                destination: '/',
                permanent: false
            }
        ];
    }
};
