import {
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Dispatch, SetStateAction } from 'react';
import { DeepMap, FieldError } from 'react-hook-form';

interface PasswordFieldProps {
    label: string;
    name: string;
    register: any;
    showPassword: boolean;
    setShowPassword: Dispatch<SetStateAction<boolean>>;
    errors: DeepMap<any, FieldError>;
    labelWidth: number;
}

const PasswordField = ({
    label,
    name,
    register,
    showPassword,
    setShowPassword,
    errors,
    labelWidth
}: PasswordFieldProps) => {
    return (
        <FormControl variant="outlined" fullWidth required>
            <InputLabel htmlFor={`outlined-adornment-${name}`}>
                {label}
            </InputLabel>
            <OutlinedInput
                name={name}
                inputRef={register}
                required
                fullWidth
                id={`outlined-adornment-${name}`}
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
                labelWidth={labelWidth}
            />
            {errors[name] && (
                <FormHelperText
                    variant="outlined"
                    required
                    error={Boolean(errors[name])}
                    id="password-helper-text"
                >
                    {errors[name].message}
                </FormHelperText>
            )}
        </FormControl>
    );
};

export default PasswordField;
