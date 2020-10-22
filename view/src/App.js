import React, {useContext, useEffect} from 'react';
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Switch, Route, } from 'react-router-dom';
import * as ROUTES from './constants/routes';

import Home from './components/Home'
import Landing from './components/Landing'
import Navigation from './components/Navigation'
import login from './pages/login';
import signup from './pages/signup';
import account from './components/account';
import todo from './components/todo';

import {Context as UserContext} from "./store/contexts/user/Store";
import { withFirebase } from './components/Firebase';
import withStyles from "@material-ui/core/styles/withStyles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import axios from "axios";

const drawerWidth = 240;

const styles = (theme) => ({
    root: {
        display: 'flex'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1
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
    toolbar: theme.mixins.toolbar,

});


function App( { firebase, classes } ){
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    let {authUser, userDetails} = userState;

    // useEffect(() => {
    //     firebase.auth.onAuthStateChanged(authUser => {
    //         if(!authUser){
    //                 userDispatch({
    //                 type: 'LOG_OUT_USER'
    //             });
    //         }
    //     });
    // }, [authUser, firebase.auth, userDispatch]);

    useEffect(()=>{
        const authToken = localStorage.getItem('AuthToken');
        if (authToken && !authUser){
            userDispatch({
                type: 'SET_AUTH_USER',
                payload: {
                    authUser: authToken.substring(7)
                }
            });
            if(!userDetails){
                axios.defaults.headers.common = { Authorization: authToken };
                axios
                    .get(process.env.REACT_APP_API_URL + 'user')
                    .then((response) => {
                        console.log(response.data);
                        const userData = {
                            firstName: response.data.userCredentials.firstName,
                            lastName: response.data.userCredentials.lastName,
                            email: response.data.userCredentials.email,
                            phoneNumber: response.data.userCredentials.phoneNumber,
                            country: response.data.userCredentials.country,
                            username: response.data.userCredentials.username,
                            uiLoading: false,
                            imageUrl: response.data.userCredentials.imageUrl,
                        };
                        userDispatch({
                            type: 'SET_USER_DATA',
                            payload: {
                                userData
                            }
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    },[authUser, userDetails, userDispatch]);

    return (
        <Router>
            <Container width={1} maxWidth={false} component="main" className={classes.root}>
                <CssBaseline />
                <Navigation />
                    <Switch>
                        <Route exact path={ROUTES.LANDING} component={Landing}/>
                        <Route path={ROUTES.SIGN_UP} component={signup}/>
                        <Route path={ROUTES.LOGIN} component={login}/>
                        {/*<Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage}/>*/}
                        {/*<Route path={ROUTES.HOME} component={HomePage}/>*/}
                        <Route path={ROUTES.HOME} render={(props) => <Home {...props} authUser={userState.authUser}/>}/>
                        <Route path={ROUTES.ACCOUNT} component={account}/>
                        <Route path={ROUTES.TODOS} component={todo}/>
                        {/*<Route path={ROUTES.ADMIN} component={AdminPage}/>*/}
                    </Switch>
            </Container>
        </Router>
    )
}

export default withStyles(styles)(withFirebase(App));