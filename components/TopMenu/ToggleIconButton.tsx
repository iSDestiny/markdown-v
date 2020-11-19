import React, { useState } from 'react';
import { Tooltip } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import classes from './TopMenu.module.scss';

interface toggleProps {
    children: JSX.Element;
    value: string;
    selectedTitle?: string;
    deselectedTitle?: string;
}

const ToggleIconButton = ({
    value,
    selectedTitle,
    deselectedTitle,
    children
}: toggleProps) => {
    const [toggle, setToggle] = useState(false);

    return (
        <Tooltip title={toggle ? deselectedTitle : selectedTitle}>
            <ToggleButton
                value={value}
                selected={toggle}
                classes={{
                    root: classes['toggle-button'],
                    selected: classes['toggle-button-selected']
                }}
                onChange={() => setToggle((prev) => !prev)}
            >
                {children}
            </ToggleButton>
        </Tooltip>
    );
};

export default ToggleIconButton;
