import { Backdrop, Button, Fade, Modal } from '@material-ui/core';
import { Dispatch, SetStateAction } from 'react';
import classes from './SideMenu.module.scss';

interface SuccessModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const SuccessModal = ({ isOpen, setIsOpen }: SuccessModalProps) => {
    return (
        <Modal
            aria-labelledby="success-modal-title"
            aria-describedby="success-modal-description"
            className={classes.modal}
            open={isOpen}
            onClose={() => setIsOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
            }}
        >
            <Fade in={isOpen}>
                <div className={classes['success-modal-content']}>
                    <h1 id="success-modal-title" className={classes['success']}>
                        Successfully changed your password!
                    </h1>
                    <p
                        id="success-modal-description"
                        className={classes['success-description']}
                    >
                        You can now login with the new password you provided
                        from now on.
                    </p>
                    <div
                        id="success-modal-actions"
                        className={classes['actions']}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setIsOpen(false)}
                        >
                            OK
                        </Button>
                    </div>
                </div>
            </Fade>
        </Modal>
    );
};

export default SuccessModal;
