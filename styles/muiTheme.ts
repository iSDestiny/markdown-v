import { createMuiTheme } from '@material-ui/core';

// Material UI overrides
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#7cbfaf'
        }
    },
    overrides: {
        MuiLinearProgress: {
            colorPrimary: {
                backgroundColor: 'transparent'
            }
        },
        MuiListItem: {
            root: {
                backgroundColor: 'transparent',
                '&:hover': {
                    backgroundColor: '#292D3E !important'
                },
                '&$selected': {
                    backgroundColor: '#292D3E'
                }
            }
        },
        MuiMenu: {
            paper: {
                backgroundColor: '#292D3E',
                color: '#8e94b2'
            }
        },
        MuiMenuItem: {
            root: {
                '&:hover': {
                    backgroundColor: '#1B1E2B !important'
                },
                '&$selected': {
                    backgroundColor: '#292D3E',
                    color: '#7cbfaf'
                }
            }
        }
    }
});

export default theme;
