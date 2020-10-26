import React, {useCallback, useContext, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Card, CardActions, CardContent, Divider, Button, Grid, TextField } from '@material-ui/core';

import clsx from 'clsx';

import axios from 'axios';
import { authMiddleWare } from '../../util/auth';
import {Context as UserContext} from "../../store/contexts/user/Store";

const styles = (theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar,
    root: {},
    details: {
        display: 'flex'
    },
    avatar: {
        height: 110,
        width: 100,
        flexShrink: 0,
        flexGrow: 0
    },
    locationText: {
        paddingLeft: '15px'
    },
    buttonProperty: {
        position: 'absolute',
        top: '50%'
    },
    uiProgess: {
        position: 'fixed',
        zIndex: '1000',
        height: '31px',
        width: '31px',
        left: '50%',
        top: '35%'
    },
    progess: {
        position: 'absolute'
    },
    uploadButton: {
        marginLeft: '8px',
        margin: theme.spacing(1)
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
    },
    submitButton: {
        marginTop: '10px'
    }
});

const apiUrl = process.env.REACT_APP_API_URL;

const Account = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const { authUser, userData } = userState;
    const [accountDetails, setAccountDetails] = useState(null);
    const [newPhoto, setNewPhoto] = useState('');
    const [uiLoading, setUiLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [imageError, setImageError] = useState('');

    const { profileId } = useParams();
    const { history, classes, ...rest } = props;

    useEffect(() => {
        authMiddleWare(history);
        setAccountDetails(userData);
        setUiLoading(false);
    }, [history, userData]);

    const updateAccount = useCallback((e) => {
        const {target} = e;
        const { name, value } = target;
        setAccountDetails({
            ...accountDetails,
            [name]: value
        });
    }, [accountDetails]);

    const updateProfile = useCallback((e)=>{
        const {target} = e;
        const { name, value } = target;
        const newProfile = {...accountDetails.profile, [name]: value};

        setAccountDetails({
            ...accountDetails,
            profile: newProfile
        });
    }, [accountDetails]);

    const updatePhoto = (e) => {
        setNewPhoto(e.target.files[0]);
    };

    const submitPhoto = (e) => {
        e.preventDefault();
        setUiLoading(true);
        const authToken = localStorage.getItem('AuthToken');
        let form_data = new FormData();
        form_data.append('image', newPhoto);
        axios.defaults.headers.common = { Authorization: `${authToken}` };

        axios
            .post(apiUrl + 'loanofficer/image', form_data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    history.push('/login');
                }
                console.log(error);
                setUiLoading(false);
                setImageError('Error in posting the data');
            });
    }

    const submitDetails = (e) => {
        e.preventDefault();
        setButtonLoading(true);
        authMiddleWare(history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        const formRequest = accountDetails;
        axios
            .put(apiUrl + 'loanOfficer', formRequest)
            .then(() => {
                setButtonLoading(false);
                userDispatch({
                    type: 'SET_USER_DATA',
                    payload: {
                        userData: accountDetails
                    }
                });
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 403) {
                    history.push('/login');
                }
                console.log(error);
                setButtonLoading(false);
            });
    };

    return (
        <React.Fragment>
        { uiLoading ? (<main className={classes.content}>
                <div className={classes.toolbar} />
                {uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
            </main>)
            : (<main className={classes.content}>
                <div className={classes.toolbar} />
                <Card {...rest} className={clsx(classes.root, classes)}>
                    <CardContent>
                        <div className={classes.details}>
                            <div>
                                <Typography className={classes.locationText} gutterBottom variant="h4">
                                    {!accountDetails ? '' : accountDetails.firstName} {!accountDetails ? '' : accountDetails.surname} {profileId}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    type="submit"
                                    size="small"
                                    startIcon={<CloudUploadIcon />}
                                    className={classes.uploadButton}
                                    onClick={submitPhoto}
                                >
                                    Upload Photo
                                </Button>
                                <input type="file" onChange={updatePhoto} />

                                {imageError ? (
                                    <div className={classes.customError}>
                                        {' '}
                                        Wrong Image Format || Supported Format are PNG and JPG
                                    </div>
                                ) : (
                                    false
                                )}
                            </div>
                        </div>
                        <div className={classes.progress} />
                    </CardContent>
                    <Divider />
                </Card>
                <br />
                <Card {...rest} className={clsx(classes.root, classes)}>
                    <form autoComplete="off" noValidate>
                        <Divider />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="First name"
                                        margin="dense"
                                        name="firstName"
                                        variant="outlined"
                                        value={!accountDetails ? '' : accountDetails.firstName}
                                        onChange={updateAccount}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Last name"
                                        margin="dense"
                                        name="surname"
                                        variant="outlined"
                                        value={!accountDetails ? '' : accountDetails.surname}
                                        onChange={updateAccount}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        margin="dense"
                                        name="email"
                                        variant="outlined"
                                        disabled={true}
                                        value={!accountDetails ? '' : accountDetails.email}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        margin="dense"
                                        name="phoneNumber"
                                        variant="outlined"
                                        value={!accountDetails ? '' : !accountDetails.profile ? '' : accountDetails.profile.phoneNumber}
                                        onChange={updateProfile}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Description"
                                        margin="dense"
                                        name="description"
                                        variant="outlined"
                                        value={!accountDetails ? '' : !accountDetails.profile ? '' : accountDetails.profile.description}
                                        onChange={updateProfile}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider />
                        <CardActions />
                    </form>
                </Card>
                <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    className={classes.submitButton}
                    onClick={submitDetails}
                    disabled={
                        buttonLoading ||
                        (!accountDetails ? true : !accountDetails.firstName) ||
                        !accountDetails.surname ||
                        (!accountDetails.profile && !accountDetails.profile.phoneNumber)
                    }
                >
                    Save details
                    {buttonLoading && <CircularProgress size={30} className={classes.progess} />}
                </Button>
            </main>)
        }
        </React.Fragment>
    )
}


//     render() {
//         const { classes, ...rest } = this.props;
//         if (this.state.uiLoading === true) {
//             return (
//                 <main className={classes.content}>
//                     <div className={classes.toolbar} />
//                     {this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
//                 </main>
//             );
//         } else {
//             return (
//                 <main className={classes.content}>
//                     <div className={classes.toolbar} />
//                     <Card {...rest} className={clsx(classes.root, classes)}>
//                         <CardContent>
//                             <div className={classes.details}>
//                                 <div>
//                                     <Typography className={classes.locationText} gutterBottom variant="h4">
//                                         {this.state.firstName} {this.state.lastName}
//                                     </Typography>
//                                     <Button
//                                         variant="outlined"
//                                         color="primary"
//                                         type="submit"
//                                         size="small"
//                                         startIcon={<CloudUploadIcon />}
//                                         className={classes.uploadButton}
//                                         onClick={this.profilePictureHandler}
//                                     >
//                                         Upload Photo
//                                     </Button>
//                                     <input type="file" onChange={this.handleImageChange} />
//
//                                     {this.state.imageError ? (
//                                         <div className={classes.customError}>
//                                             {' '}
//                                             Wrong Image Format || Supported Format are PNG and JPG
//                                         </div>
//                                     ) : (
//                                         false
//                                     )}
//                                 </div>
//                             </div>
//                             <div className={classes.progress} />
//                         </CardContent>
//                         <Divider />
//                     </Card>
//

//                 </main>
//             );
//         }
//     }
// }

export default withStyles(styles)(Account);