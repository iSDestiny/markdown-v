import axios from 'axios';
import Router from 'next/router';
import { ListItemText, Menu, MenuItem } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { useState } from 'react';
import AccountInfoModal from './AccountInfoModal';
import { useQueryCache } from 'react-query';
import classes from './SideMenu.module.scss';

interface AccountOptionsProps {
    anchorEl: Element;
    setAnchorEl: React.Dispatch<React.SetStateAction<Element>>;
}

const AccountOptions = ({ anchorEl, setAnchorEl }: AccountOptionsProps) => {
    const [accountInfoOpen, setAccountInfoOpen] = useState(false);
    const queryCache = useQueryCache();
    const { email } = queryCache.getQueryData<{ email: string }>('authInfo');

    const accountInfoHandler = () => {
        setAnchorEl(null);
        setAccountInfoOpen(true);
    };

    const logout = async () => {
        setAnchorEl(null);
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
        <>
            <Menu
                color="secondary"
                id="account-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {/* <ListItemText
                    primary="Account"
                    style={{ paddingLeft: '1rem' }}
                /> */}
                <h1 className={classes['account-heading']}>Account</h1>
                <MenuItem onClick={accountInfoHandler}>
                    <AccountCircle
                        fontSize="large"
                        style={{ margin: 'auto 0' }}
                    />
                    <ListItemText
                        // primary="Jason Bugallon"
                        secondary={email}
                        style={{ paddingLeft: 9 }}
                    />
                </MenuItem>
                <MenuItem onClick={() => logout()}>
                    <ListItemText primary="Logout" />
                </MenuItem>
            </Menu>
            <AccountInfoModal
                isOpen={accountInfoOpen}
                setIsOpen={setAccountInfoOpen}
            />
        </>
    );
};

export default AccountOptions;
