import React from 'react';
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import NotesIcon from "@material-ui/icons/Notes";
import ListItemText from "@material-ui/core/ListItemText";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import withStyles from "@material-ui/core/styles/withStyles";

import { authMiddleWare } from '../../util/auth'

const drawerWidth = 240;

const styles = (theme) => ({
    root: {
        display: 'flex'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    avatar: {
        height: 110,
        width: 100,
        flexShrink: 0,
        flexGrow: 0,
        marginTop: 20
    },
    uiProgess: {
        position: 'fixed',
        zIndex: '1000',
        height: '31px',
        width: '31px',
        left: '50%',
        top: '35%'
    },
    toolbar: theme.mixins.toolbar
});

const navigation = () => {

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper
            }}
        >
            <div className={classes.toolbar} />
            <Divider />
            <center>
                <Avatar src={this.state.profilePicture} className={classes.avatar} />
                <p>
                    {' '}
                    {this.state.firstName} {this.state.lastName}
                </p>
            </center>
            <Divider />
            <List>
                <ListItem button key="Todo" onClick={this.loadTodoPage}>
                    <ListItemIcon>
                        {' '}
                        <NotesIcon />{' '}
                    </ListItemIcon>
                    <ListItemText primary="Todo" />
                </ListItem>

                <ListItem button key="Account" onClick={this.loadAccountPage}>
                    <ListItemIcon>
                        {' '}
                        <AccountBoxIcon />{' '}
                    </ListItemIcon>
                    <ListItemText primary="Account" />
                </ListItem>

                <ListItem button key="Logout" onClick={this.logoutHandler}>
                    <ListItemIcon>
                        {' '}
                        <ExitToAppIcon />{' '}
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Drawer>
    )
}

export default withStyles(styles)(navigation);