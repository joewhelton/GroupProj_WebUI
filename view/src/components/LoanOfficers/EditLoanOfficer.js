import React, {useCallback, useContext, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Card, CardActions, CardContent, Divider, Button, Grid, TextField } from '@material-ui/core';
import { styles }  from '../../styles/styles';
import clsx from 'clsx';

import axios from 'axios';
import { authMiddleWare } from '../../util/auth';
import {Context as UserContext} from "../../store/contexts/user/Store";
import SelectFinancialInstitution from "../FinancialInstitutions/SelectFinancialInstitution";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const apiUrl = process.env.REACT_APP_API_URL;

const Account = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const { authUser, userData } = userState;
    const [accountDetails, setAccountDetails] = useState(null);
    const [uiLoading, setUiLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [financialInstitutions, setFinancialInstitutions] = useState([]);
    const [selectedFI, setSelectedFI] = useState('');
    const { history, classes, ...rest } = props;
    const { loID } = useParams();
    const [fetchFI, setFetchFI] = useState(false);

    useEffect(() => {
        if(userData) {
            authMiddleWare(history);
            const authToken = localStorage.getItem('AuthToken');
            axios.defaults.headers.common = {Authorization: `${authToken}`};
            axios
                .get(apiUrl + `loanofficer/${loID}`)
                .then((data) => {
                    const clData = data.data.data;
                    setAccountDetails(clData);
                    setUiLoading(false);
                    if(clData && clData.profile && clData.profile.financialInstitutionID){
                        setSelectedFI(clData.profile.financialInstitutionID);
                    }
                    setFetchFI(true);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 403) {
                        history.push('/login');
                    }
                    console.log(error);
                    setUiLoading(false);
                });

        }
    }, [loID, history, userData])

    useEffect(()=>{
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        axios
            .get(apiUrl + 'financialInstitution')
            .then((data) => {
                const fiArray = [];
                const fiData = data.data.fiData;
                for (const [key, value] of Object.entries(fiData)) {
                    let item = value;
                    item['id'] = key;
                    fiArray.push(item);
                }
                console.log(fiArray);
                setFinancialInstitutions(fiArray);
            })
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    history.push('/login');
                }
                console.log(error);
            });

    }, [fetchFI]);

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

    const submitDetails = (e) => {
        e.preventDefault();
        setButtonLoading(true);
        authMiddleWare(history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        const formRequest = accountDetails;
        formRequest.profile.financialInstitutionID = selectedFI;
        axios
            .put(apiUrl + `loanOfficer/${loID}`, formRequest)
            .then(() => {
                setButtonLoading(false);
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.status === 403) {
                    history.push('/login');
                }
                console.log(error);
                setButtonLoading(false);
            });
    };

    const onChangeSysadmin = (e) =>{
        const {target} = e;
        const {name, checked} = target;
        console.log(checked);
        const newUserRoles = {...accountDetails.userRoles, sysAdmin: checked}
        setAccountDetails({
            ...accountDetails,
            userRoles: newUserRoles
        });
    }

    const onChangeFI = (e) => {
        setSelectedFI(e.target.value);
    }

    return (
        <React.Fragment>
            { uiLoading ? (<main className={classes.content}>
                    <div className={classes.toolbar} />
                    {uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
                </main>)
                : (<main className={classes.content}>
                    <div className={classes.toolbar} />
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
                                            disabled={true}
                                            value={!accountDetails ? '' : accountDetails.email}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            margin="dense"
                                            name="mobile"
                                            value={!accountDetails ? '' : !accountDetails.profile ? '' : accountDetails.profile.mobile}
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
                                    {financialInstitutions.length > 0
                                        ? (
                                            <Grid item md={6} xs={12}>
                                                <SelectFinancialInstitution
                                                    financialInstitutions={financialInstitutions}
                                                    classes={classes}
                                                    selectedFI={selectedFI}
                                                    onChange={onChangeFI}/>
                                            </Grid>
                                        ) : (
                                            ''
                                        )
                                    }
                                    <Grid item md={6} xs={12} className={classes.switchHolder}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={accountDetails.userRoles && accountDetails.userRoles.sysAdmin}
                                                    onChange={onChangeSysadmin}
                                                    name="sysAdmin"
                                                    color="primary"
                                                />
                                            }
                                            label="System Administrator"
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
                            (!accountDetails.profile && !accountDetails.profile.mobile)
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

export default withStyles(styles)(Account);