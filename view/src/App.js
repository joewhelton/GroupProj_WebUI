import React, {useCallback, useContext, useEffect} from 'react';
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import history from './util/history';

import Home from './components/Home'
import Landing from './components/Landing'
import Navigation from './components/Navigation'
import login from './pages/login';
import signup from './pages/signup';
import Account from './components/Account';
import FinancialInstitutions from "./components/FinancialInstitutions";
import EditFinancialInstitution from "./components/FinancialInstitutions/EditFinancialInstitution";
import HousePrices from "./components/HousePrices";
import UploadHousePriceModel from './components/HousePrices/UploadHousePriceModel';
import Clients from './components/Clients/index';
import ViewClient from "./components/Clients/ViewClient";
import NewLoanApplication from './components/LoanApplications/NewLoanApplication';
import NewFinancialInstitution from "./components/FinancialInstitutions/NewFinancialInstitution";
import EditLoanApplication from "./components/LoanApplications/EditLoanApplication";

import {Context as UserContext} from "./store/contexts/user/Store";
import { withFirebase } from './components/Firebase';
import withStyles from "@material-ui/core/styles/withStyles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import axios from "axios";
import theme from "./theme";
import {ThemeProvider} from "@material-ui/core/styles";
import UploadLoanApplicationModel from "./components/LoanApplications/UploadLoanApplicationModel";
import Feedback from "./components/Feedback";
import EditFeedback from "./components/Feedback/EditFeedback";

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
    let {authUser, userData} = userState;
    const routerHistory = useHistory();

    const logout = useCallback(() => {
        localStorage.removeItem('AuthToken');
        userDispatch({
            type: 'LOG_OUT_USER'
        });
        console.log("Logged out");
        window.location.replace(ROUTES.LOGIN);
        history.push(ROUTES.LOGIN);
    });

    const authorisationCheck = (level) => {
        if(userData) {
            if (!userData.userRoles[level]) {
                logout();
            }
        }
    }

    useEffect(()=>{
        const authToken = localStorage.getItem('AuthToken');
        if (authToken && !authUser) {
            userDispatch({
                type: 'SET_AUTH_USER',
                payload: {
                    authUser: authToken.substring(7)
                }
            });
        }
        if(authUser && !userData){
            axios.defaults.headers.common = { Authorization: authToken };
            axios
                .get(process.env.REACT_APP_API_URL + 'user')
                .then((response) => {
                    const userData = response.data;
                    userDispatch({
                        type: 'SET_USER_DATA',
                        payload: {
                            userData
                        }
                    });
                })
                .catch((error) => {
                    console.log(error);
                    if (error.response.status === 403) {
                        logout();
                    }
                });
        }
    },[authUser, logout, routerHistory, userData, userDispatch]);

    return (
        <Router>
            <ThemeProvider theme={theme}>
                <Container width={1} maxWidth={false} component="main" className={classes.root}>
                    <CssBaseline />
                    <Navigation logout={logout} />
                    <Switch>
                        <Route exact path={ROUTES.LANDING} component={Landing}/>
                        <Route path={ROUTES.SIGN_UP} component={signup}/>
                        <Route path={ROUTES.LOGIN} component={login}/>
                        {/*<Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage}/>*/}
                        {/*<Route path={ROUTES.HOME} component={HomePage}/>*/}
                        <Route path={ROUTES.HOME} render={(props) => <Home {...props} authUser={userState.authUser}/>}/>
                        {/*<Route path={ROUTES.FINANCIALINSTITUTIONS} render={(props) => <FinancialInstitutions {...props} authorisationCheck={authorisationCheck}/>}/>*/}
                        <Route path={`${ROUTES.FEEDBACK}/:feedbackID`} component={EditFeedback}/>
                        <Route path={ROUTES.FEEDBACK} component={Feedback}/>
                        <Route path={`${ROUTES.FINANCIALINSTITUTIONS}/:fiID`} component={EditFinancialInstitution}/>
                        <Route path={ROUTES.FINANCIALINSTITUTIONS} component={FinancialInstitutions}/>
                        <Route path={ROUTES.NEWFINANCIALINSTITUTION} component={NewFinancialInstitution}/>
                        <Route path={`${ROUTES.ACCOUNT}/:profileId`} component={Account}/>
                        <Route path={ROUTES.HOUSEPRICEQUERY} component={HousePrices}/>
                        <Route path={ROUTES.HOUSEPRICEUPLOAD} component={UploadHousePriceModel}/>
                        <Route path={ROUTES.ACCOUNT} component={Account}/>
                        <Route path={`${ROUTES.CLIENTS}/:clID`} component={ViewClient}/>
                        <Route path={ROUTES.CLIENTS} component={Clients}/>
                        <Route path={`${ROUTES.NEWLOANAPPLICATION}/:clID`} component={NewLoanApplication}/>
                        <Route path={ROUTES.LOANAPPLICATIONUPLOAD} component={UploadLoanApplicationModel}/>
                        <Route path={`${ROUTES.APPLICATION}/:apID`} component={EditLoanApplication}/>
                        <Route path={ROUTES.ALLCLIENTS} render={(props) => <Clients {...props} mode={'all'}/>}/>
                        {/*<Route path={ROUTES.TODOS} component={todo}/>*/}
                        {/*<Route path={ROUTES.ADMIN} component={AdminPage}/>*/}
                    </Switch>
                </Container>
            </ThemeProvider>
        </Router>
    )
}

export default withStyles(styles)(withFirebase(App));