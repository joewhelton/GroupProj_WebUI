import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { Context as UserContext } from '../../store/contexts/user/Store'
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import NotesIcon from "@material-ui/icons/Notes";
import ListItemText from "@material-ui/core/ListItemText";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import PublishIcon from '@material-ui/icons/Publish';
import Feedback from '@material-ui/icons/Feedback';
import withStyles from "@material-ui/core/styles/withStyles";

import * as ROUTES from '../../constants/routes';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";

import Logo from '../../assets/images/mrtg-white.svg';
import {withFirebase} from "../Firebase";

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
        marginRight: 20,
    },
    userAvatar:{
        marginTop: 20,
        height: 80,
        width: 80
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

const Navigation = ({firebase, classes, logout}) => {
    //let history = useHistory();
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    let {authUser, userData} = userState;

    return (
        <React.Fragment>
            {authUser === null ? '' :
                <React.Fragment>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Avatar className={classes.avatar} src={Logo}></Avatar>
                        <Typography variant="h6" noWrap>
                            FinAI Web App
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper
                    }}
                >
                    <div className={classes.toolbar}/>
                    <Divider/>
                        <center>
                            <Avatar src={userData === null ? '' : userData.profile.photo} className={classes.userAvatar}/>
                            <p>
                                {' '}
                                {userData === null ? '' : userData.firstName} {userData === null ? '' : userData.surname}
                            </p>
                        </center>
                    <Divider/>
                    <List>
                        <ListItem button component={Link} to={ROUTES.HOUSEPRICEQUERY}>
                            <ListItemIcon>
                                {' '}
                                <NotesIcon/>{' '}
                            </ListItemIcon>
                            <ListItemText primary="House Prices"/>
                        </ListItem>
                        <ListItem button component={Link} to={ROUTES.CLIENTS}>
                            <ListItemIcon>
                                {' '}
                                <SupervisedUserCircleIcon/>{' '}
                            </ListItemIcon>
                            <ListItemText primary="My Clients"/>
                        </ListItem>
                        <ListItem button component={Link} to={ROUTES.ACCOUNT}>
                            <ListItemIcon>
                                {' '}
                                <AccountBoxIcon/>{' '}
                            </ListItemIcon>
                            <ListItemText primary="My Profile"/>
                        </ListItem>

                        <ListItem button key="Logout" onClick={logout}>
                            <ListItemIcon>
                                {' '}
                                <ExitToAppIcon/>{' '}
                            </ListItemIcon>
                            <ListItemText primary="Logout"/>
                        </ListItem>
                    </List>
                    {userData && userData.userRoles.sysAdmin ?
                        <React.Fragment>
                            <Divider/>
                            <List>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Typography style={{fontWeight: 'bold'}}>Admin Menu</Typography>
                                        }
                                    />
                                </ListItem>
                                <ListItem button component={Link} to={ROUTES.LOANOFFICERS}>
                                    <ListItemIcon>
                                        {' '}
                                        <SupervisedUserCircleIcon/>{' '}
                                    </ListItemIcon>
                                    <ListItemText primary="Loan Officers"/>
                                </ListItem>
                                <ListItem button component={Link} to={ROUTES.FINANCIALINSTITUTIONS}>
                                    <ListItemIcon>
                                        {' '}
                                        <AccountBalanceIcon/>{' '}
                                    </ListItemIcon>
                                    <ListItemText primary="Financial Institutions"/>
                                </ListItem>
                                <ListItem button component={Link} to={ROUTES.HOUSEPRICEUPLOAD}>
                                    <ListItemIcon>
                                        {' '}
                                        <PublishIcon/>{' '}
                                    </ListItemIcon>
                                    <ListItemText primary="House Price Upload"/>
                                </ListItem>
                                <ListItem button component={Link} to={ROUTES.LOANAPPLICATIONUPLOAD}>
                                    <ListItemIcon>
                                        {' '}
                                        <PublishIcon/>{' '}
                                    </ListItemIcon>
                                    <ListItemText primary="Loan Application Upload"/>
                                </ListItem>
                                <ListItem button component={Link} to={ROUTES.HOUSEPRICEDOWNLOAD}>
                                    <ListItemIcon>
                                        {' '}
                                        <CloudDownloadIcon/>{' '}
                                    </ListItemIcon>
                                    <ListItemText primary="Export House Price Dataset"/>
                                </ListItem>
                                <ListItem button component={Link} to={ROUTES.LOANINFODOWNLOAD}>
                                    <ListItemIcon>
                                        {' '}
                                        <CloudDownloadIcon/>{' '}
                                    </ListItemIcon>
                                    <ListItemText primary="Export Loan Dataset"/>
                                </ListItem>

                                <ListItem button component={Link} to={ROUTES.ALLCLIENTS}>
                                    <ListItemIcon>
                                        {' '}
                                        <SupervisedUserCircleIcon/>{' '}
                                    </ListItemIcon>
                                    <ListItemText primary="All Clients"/>
                                </ListItem>
                                <ListItem button component={Link} to={ROUTES.FEEDBACK}>
                                    <ListItemIcon>
                                        {' '}
                                        <Feedback/>{' '}
                                    </ListItemIcon>
                                    <ListItemText primary="Manage Feedback"/>
                                </ListItem>
                            </List>
                        </React.Fragment>
                    : ''
                    }
                </Drawer>
            </React.Fragment>
            }
        </React.Fragment>
    )
}

export default withStyles(styles)(withFirebase(Navigation));