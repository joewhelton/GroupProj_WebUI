// import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import home from './pages/home'
// import login from './pages/login';
// import signup from './pages/signup';
//
// function App() {
//   return (
//       <Router>
//         <div>
//           <Switch>
//             <Route exact path="/" component={home}/>
//             <Route exact path="/login" component={login}/>
//             <Route exact path="/signup" component={signup}/>
//           </Switch>
//         </div>
//       </Router>
//   );
// }
// export default App;

import React, {useContext, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as ROUTES from './constants/routes';

import home from './components/Home'
import navigation from './components/Navigation'
import login from './pages/login';
import signup from './pages/signup';
import account from "./components/account";

import {Context as UserContext} from "./store/contexts/user/Store";
import { withFirebase } from './components/Firebase';
import withStyles from "@material-ui/core/styles/withStyles";

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
    toolbar: theme.mixins.toolbar
});


function App( { firebase } ){
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);

    useEffect(() => {
        firebase.auth.onAuthStateChanged(authUser => {
            authUser
                ? userDispatch({
                    type: 'SET_AUTH_USER',
                    payload: {
                        authUser: authUser
                    }
                })
                : userDispatch({
                    type: 'SET_AUTH_USER',
                    payload: {
                        authUser: null
                    }
                });
        });
    }, [firebase.auth, userDispatch]);

    return (
        <Router>
            <div>
                <navigation/>
                <Route exact path={ROUTES.LANDING} component={LandingPage}/>
                <Route path={ROUTES.SIGN_UP} component={signup}/>
                <Route path={ROUTES.LOGIN} component={login}/>
                {/*<Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage}/>*/}
                {/*<Route path={ROUTES.HOME} component={HomePage}/>*/}
                <Route path={ROUTES.HOME} render={(props) => <HomePage {...props} authUser={userState.authUser}/>}/>
                <Route path={ROUTES.ACCOUNT} component={account}/>
                {/*<Route path={ROUTES.ADMIN} component={AdminPage}/>*/}
            </div>
        </Router>
    )
}

export default withFirebase(withStyles(styles)(App));