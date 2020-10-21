import React, {useCallback, useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios';

const styles = (theme) => ({
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
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    progess: {
        position: 'absolute'
    }
});

const apiUrl = process.env.REACT_APP_API_URL;

const Signup = (props) => {
    const [newAccount, setNewAccount] = useState({});
    const [errors, setErrors] = useState('');
    const [loading, setLoading ] = useState(false);

    const { classes, } = props;

    const updateAccount = useCallback((e) => {
        const {target} = e;
        const { name, value } = target;
        setNewAccount({
            ...newAccount,
            [name]: value
        });
    }, [newAccount]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const newUserData = {
            firstName: newAccount.firstName,
            lastName: newAccount.lastName,
            phoneNumber: newAccount.phoneNumber,
            country: newAccount.country,
            username: newAccount.username,
            email: newAccount.email,
            password: newAccount.password,
            confirmPassword: newAccount.confirmPassword
        };
        axios
            .post(apiUrl + 'signup', newUserData)
            .then((response) => {
                localStorage.setItem('AuthToken', `${response.data.token}`);
                setLoading(false);
                this.props.history.push('/');
            })
            .catch((error) => {
                setLoading(false);
                setErrors(error.response.data);
            });
    };

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    name="firstName"
                                    autoComplete="firstName"
                                    helperText={errors.firstName}
                                    error={errors.firstName ? true : false}
                                    onChange={updateAccount}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="lastName"
                                    helperText={errors.lastName}
                                    error={errors.lastName ? true : false}
                                    onChange={updateAccount}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="username"
                                    label="User Name"
                                    name="username"
                                    autoComplete="username"
                                    helperText={errors.username}
                                    error={errors.username ? true : false}
                                    onChange={updateAccount}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="phoneNumber"
                                    label="Phone Number"
                                    name="phoneNumber"
                                    autoComplete="phoneNumber"
                                    pattern="[7-9]{1}[0-9]{9}"
                                    helperText={errors.phoneNumber}
                                    error={errors.phoneNumber ? true : false}
                                    onChange={updateAccount}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    helperText={errors.email}
                                    error={errors.email ? true : false}
                                    onChange={updateAccount}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="country"
                                    label="Country"
                                    name="country"
                                    autoComplete="country"
                                    helperText={errors.country}
                                    error={errors.country ? true : false}
                                    onChange={updateAccount}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    helperText={errors.password}
                                    error={errors.password ? true : false}
                                    onChange={updateAccount}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="current-password"
                                    onChange={updateAccount}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleSubmit}
                            disabled={loading ||
                            !newAccount.email ||
                            !newAccount.password ||
                            !newAccount.firstName ||
                            !newAccount.lastName ||
                            !newAccount.country ||
                            !newAccount.username ||
                            !newAccount.phoneNumber}
                        >
                            Sign Up
                            {loading && <CircularProgress size={30} className={classes.progess} />}
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link href="login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );
}

export default withStyles(styles)(Signup);