import React, {useCallback, useContext, useState} from 'react';
import {Context as UserContext} from "../store/contexts/user/Store";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as ROUTES from "../constants/routes";

import Logo from '../assets/images/mrtg-transp.svg';

import axios from 'axios';

const styles = (theme) => ({
    flexCenter:{
        display: 'flex',
        justifyContent: 'center',
        flexGrow: 1
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    logo: {
        width: 300,
        [theme.breakpoints.down("sm")]: {
            width: 200,
        }
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
    },
    progess: {
        position: 'absolute'
    }
});

const Login = ({history, firebase, classes}) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const { authUser, userDetails } = userState;

    const [accountDetails, setAccountDetails] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading ] = useState(false);

    const handleChange = useCallback((e) => {
        const {target} = e;
        const { name, value } = target;
        setAccountDetails({
            ...accountDetails,
            [name]: value
        });
    }, [accountDetails]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const apiUrl = process.env.REACT_APP_API_URL;
        setLoading(true );
        const userData = accountDetails;
        axios
            .post(apiUrl + 'login', userData)
            .then((response) => {
                localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
                userDispatch({
                    type: 'SET_AUTH_USER',
                    payload: {
                        authUser: response.data.token
                    }
                });
                setLoading(false );
                history.push(ROUTES.HOME);
            })
            .catch((error) => {
                setLoading(false );
                setErrors(error.response.data);
            });
    };

    return (
            <div className={classes.flexCenter}>
                <div className={classes.paper} maxWidth="xs">
                    <img className={classes.logo} src={Logo} alt="Logo" />
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            helperText={errors.email}
                            error={errors.email ? true : false}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            helperText={errors.password}
                            error={errors.password ? true : false}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleSubmit}
                            disabled={loading || !accountDetails.email || !accountDetails.password}
                        >
                            Sign In
                            {loading && <CircularProgress size={30} className={classes.progess} />}
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                    </form>
                </div>
            </div>
    );
}

export default withStyles(styles)(Login);