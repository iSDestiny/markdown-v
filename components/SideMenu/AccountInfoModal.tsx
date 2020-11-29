import { Backdrop, Fade, Modal, Tooltip } from '@material-ui/core';
import classes from './SideMenu.module.scss';

interface AccountInfoProps {
    accountInfoOpen: boolean;
    setAccountInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccountInfoModal = ({
    accountInfoOpen,
    setAccountInfoOpen
}: AccountInfoProps) => {
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={accountInfoOpen}
            onClose={() => setAccountInfoOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
            }}
        >
            <Fade in={accountInfoOpen}>
                <div className={classes['account-modal-content']}>
                    <h1
                        id="transition-modal-title"
                        className={classes['account-modal-title']}
                    >
                        Account Information
                    </h1>
                    <div
                        id="transition-modal-description"
                        className={classes['account-modal-body']}
                    >
                        <div className={classes['account-info-item']}>
                            <h2
                                className={classes['account-info-item-heading']}
                            >
                                Email Address
                            </h2>
                            <div className={classes['account-info-item-body']}>
                                <p>jbugallon@gmail.com</p>
                                <Tooltip title="Not implemented">
                                    <a className={classes['disabled-change']}>
                                        Change Email
                                    </a>
                                </Tooltip>
                            </div>
                        </div>
                        <div className={classes['account-info-item']}>
                            <h2
                                className={classes['account-info-item-heading']}
                            >
                                Password
                            </h2>
                            <div className={classes['account-info-item-body']}>
                                <p>Hidden for security purposes</p>
                                <a>Change Password</a>
                            </div>
                        </div>
                    </div>
                </div>
            </Fade>
        </Modal>
    );
};

export default AccountInfoModal;
