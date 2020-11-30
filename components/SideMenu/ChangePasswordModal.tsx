import { useState } from 'react';
import {
    Backdrop,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fade,
    Modal
} from '@material-ui/core';
import classes from './SideMenu.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import PasswordField from '../PasswordField';

interface FormInputs {
    ['current-password']: string;
    ['new-password']: string;
    ['confirm-password']: string;
}

const schema = yup.object().shape({
    email: yup.string().email('must be an email address').required(),
    password: yup
        .string()
        .min(5, 'password must be at least 5 characters')
        .required()
});

const ChangePasswordModal = ({ isOpen, setIsOpen }) => {
    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(schema)
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit: SubmitHandler<FormInputs> = (
        {
            'current-password': currentPassword,
            'new-password': newPassword,
            'confirm-password': confirmPassword
        },
        event
    ) => {
        event.preventDefault();
        setIsOpen(false);
        console.log(currentPassword, newPassword, confirmPassword);
    };

    return (
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            aria-labelledby="form-dialog-title"
            classes={{ paper: classes['password-modal-paper'] }}
        >
            <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
            <DialogContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={classes['password-modal-form']}
                >
                    <PasswordField
                        name="current-password"
                        label="Current Password"
                        register={register}
                        errors={errors}
                        labelWidth={140}
                        showPassword={showCurrentPassword}
                        setShowPassword={setShowCurrentPassword}
                    />
                    <PasswordField
                        name="new-password"
                        label="New Password"
                        register={register}
                        errors={errors}
                        labelWidth={120}
                        showPassword={showNewPassword}
                        setShowPassword={setShowNewPassword}
                    />
                    <PasswordField
                        name="confirm-password"
                        label="Confirm New Password"
                        register={register}
                        errors={errors}
                        labelWidth={180}
                        showPassword={showConfirmPassword}
                        setShowPassword={setShowConfirmPassword}
                    />
                    <DialogActions>
                        <Button
                            onClick={() => setIsOpen(false)}
                            color="primary"
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                        >
                            Update
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePasswordModal;
