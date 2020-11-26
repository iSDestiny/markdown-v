import React from 'react';
import classes from './LoadingScreen.module.scss';

const LoadingScreen = () => {
    return (
        <div className={classes.container}>
            <div className={classes.loader}>
                <div className={classes.bar}></div>
                <div className={classes.bar}></div>
                <div className={classes.bar}></div>
                <div className={classes.bar}></div>
                <div className={classes.bar}></div>
                <div className={classes.ball}></div>
            </div>
        </div>
    );
};

export default LoadingScreen;
