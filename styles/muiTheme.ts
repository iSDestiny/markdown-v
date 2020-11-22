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
        }
    }
});

export default theme;
