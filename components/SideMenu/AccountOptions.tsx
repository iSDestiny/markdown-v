import axios from 'axios';
import Router from 'next/router';
import { ListItemText, Menu, MenuItem } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';

interface AccountOptionsProps {
    anchorEl: Element;
    setAnchorEl: React.Dispatch<React.SetStateAction<Element>>;
}

const AccountOptions = ({ anchorEl, setAnchorEl }: AccountOptionsProps) => {
    const logout = async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/api/auth/logout`,
                {}
            );
            Router.push('/login');
        } catch (err) {
            Router.push('/500');
        }
    };

    return (
        <Menu
            color="secondary"
            id="account-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
        >
            <ListItemText primary="Account" style={{ paddingLeft: '1rem' }} />
            <MenuItem>
                <AccountCircle fontSize="large" style={{ margin: 'auto 0' }} />
                <ListItemText
                    primary="Jason Bugallon"
                    secondary="Jasonbugallon@gmail.com"
                    style={{ paddingLeft: 9 }}
                />
            </MenuItem>
            <MenuItem onClick={() => logout()}>
                <ListItemText primary="Logout" />
            </MenuItem>
        </Menu>
    );
};

export default AccountOptions;
