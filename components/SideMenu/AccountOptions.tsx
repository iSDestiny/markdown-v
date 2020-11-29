import { ListItem, ListItemText, Menu, MenuItem } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';

interface AccountOptionsProps {
    anchorEl: Element;
    setAnchorEl: React.Dispatch<React.SetStateAction<Element>>;
}

const AccountOptions = ({ anchorEl, setAnchorEl }: AccountOptionsProps) => {
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
            <MenuItem>
                <ListItemText primary="Logout" />
            </MenuItem>
        </Menu>
    );
};

export default AccountOptions;
