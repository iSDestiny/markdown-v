import { Backdrop, Button, Fade, Modal } from '@material-ui/core';
import { Dispatch, SetStateAction } from 'react';
import classes from './InfoModal.module.scss';

interface SuccessModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    heading: string;
    description: string;
}

const InfoModal = ({
    isOpen,
    setIsOpen,
    heading,
    description
}: SuccessModalProps) => {
    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
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
                <div className={classes['modal-content']}>
                    <h1 id="modal-title" className={classes['success']}>
                        {heading}
                    </h1>
                    <p
                        id="modal-description"
                        className={classes['description']}
                    >
                        {description}
                    </p>
                    <div id="modal-actions" className={classes['actions']}>
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

export default InfoModal;
