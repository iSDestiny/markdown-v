import React from 'react';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {
    Typography,
    Avatar,
    Container,
    Box,
    Button,
    Grid,
    Link,
    TextField
} from '@material-ui/core';
import AuthForm from '../components/AuthForm';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © MarkdownV '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function SignUp() {
    return <AuthForm type="signup" />;
}
