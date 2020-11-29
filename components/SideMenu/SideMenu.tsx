import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Description, LocalOffer, Star } from '@material-ui/icons';
import classes from './SideMenu.module.scss';

const SideMenuListItemText = ({ primary }: { primary: string }) => {
    return <ListItemText primary={primary} style={{ marginLeft: 9 }} />;
};

const SideMenu = () => {
    return (
        <div className={classes.root}>
            <header className={classes.header}>
                <h1>Jason Bugallon</h1>
            </header>
            <List>
                <ListItem>
                    <Description fontSize="small" />
                    <SideMenuListItemText primary="All Notes" />
                </ListItem>
                <ListItem>
                    <Star fontSize="small" />
                    <SideMenuListItemText primary="Favorites" />
                </ListItem>
                <ListItem>
                    <LocalOffer fontSize="small" />
                    <SideMenuListItemText primary="Tags" />
                </ListItem>
            </List>
        </div>
    );
};

export default SideMenu;
