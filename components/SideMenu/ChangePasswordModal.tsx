import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@material-ui/core';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import PasswordField from '../PasswordField';
import classes from './SideMenu.module.scss';

interface FormInputs {
    ['current-password']: string;
    ['new-password']: string;
    ['confirm-password']: string;
}

const schema = yup.object().shape({
    ['current-password']: yup
        .string()
        .required('current password is a required field'),
    ['new-password']: yup
        .string()
        .min(5, 'password must be at least 5 characters'),
    ['confirm-password']: yup
        .string()
        .min(5, 'password must be at least 5 characters')
});

const ChangePasswordModal = ({ isOpen, setIsOpen }) => {
    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(schema)
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit: SubmitHandler<FormInputs> = async (
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
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_ORIGIN}/api/auth/change-password`,
                { currentPassword, newPassword, confirmPassword }
            );
        } catch ({ response }) {
            const { status, data } = response;
            if (status === 422) {
                console.log(data);
            }
        }
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
                    noValidate
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
