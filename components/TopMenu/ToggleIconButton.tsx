import React, { useState } from 'react';
import { Tooltip } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import classes from './TopMenu.module.scss';

interface toggleProps {
    children: JSX.Element;
    value: string;
    toggle: boolean;
    setToggle: React.Dispatch<React.SetStateAction<boolean>>;
    disabled?: boolean;
    selectedTitle?: string;
    deselectedTitle?: string;
}

const ToggleIconButton = ({
    value,
    selectedTitle,
    deselectedTitle,
    children,
    toggle,
    setToggle,
    disabled
}: toggleProps) => {
    return (
        <Tooltip title={toggle ? deselectedTitle : selectedTitle}>
            <ToggleButton
                value={value}
                selected={toggle}
                classes={{
                    root: classes['toggle-button'],
                    selected: classes['toggle-button-selected'],
                    disabled: classes['toggle-button-disabled']
                }}
                onChange={() => setToggle((prev) => !prev)}
                disabled={disabled}
            >
                {children}
            </ToggleButton>
        </Tooltip>
    );
};

export default ToggleIconButton;
