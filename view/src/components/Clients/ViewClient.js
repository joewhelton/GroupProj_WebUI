import React, { useContext, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import {styles} from "../../styles/styles";

import axios from 'axios';
import { authMiddleWare, authorizeMiddleware } from '../../util/auth';
import {Context as UserContext} from "../../store/contexts/user/Store";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Button, Card, CardContent, Grid, TextField} from "@material-ui/core";
import clsx from "clsx";
import LoanApplications from "../LoanApplications";
import SelectLoanOfficer from "./SelectLoanOfficer";
import * as ROUTES from '../../constants/routes';

const apiUrl = process.env.REACT_APP_API_URL;

const ViewClient = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const { history, classes, ...rest } = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [client, setClient] = useState({});
    const [loanOfficers, setLoanOfficers] = useState([]);
    const [selectedLoanOfficer, setSelectedLoanOfficer] = useState([]);
    const { clID } = useParams();


    useEffect(() => {
        if(userData && userData.userRoles.sysAdmin){
            axios
                .get(apiUrl + 'loanofficer')
                .then((data) => {
                    const loArray = [];
                    const loData = data.data;
                    for (const [key, value] of Object.entries(loData)) {
                        let item = value;
                        item['userId'] = key;
                        loArray.push(item);
                    }
                    setLoanOfficers(loArray);
                    if(client.profile && client.profile.loanOfficerId) {
                        setSelectedLoanOfficer(client.profile.loanOfficerId);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    if (error.response && error.response.status === 403) {
                        history.push('/login');
                    }
                })
        }
    }, [client]);

    useEffect(() => {
        if(userData) {
            authMiddleWare(history);
            const authToken = localStorage.getItem('AuthToken');
            axios.defaults.headers.common = {Authorization: `${authToken}`};
            axios
                .get(apiUrl + `client/${clID}`)
                .then((data) => {
                    const clData = data.data;
                    setClient(clData);
                    setUiLoading(false);
                    //getLoanOfficers();
                })
                .catch((error) => {
                    if (error.response && error.response.status === 403) {
                        history.push('/login');
                    }
                    console.log(error);
                    setUiLoading(false);
                });

        }
    }, [clID, history, userData])

    const onChangeLoanOfficer = (e) => {
        setSelectedLoanOfficer(e.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setButtonLoading(true);
        const updateClient = {loanOfficerId: selectedLoanOfficer};
        authMiddleWare(history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .put(apiUrl + `client/${clID}/setloanofficer`, updateClient)
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
    }

    return (
        <React.Fragment>
            { uiLoading ? (<main className={classes.content}>
                    <div className={classes.toolbar} />
                    {uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
                </main>)
                : (<main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Card className={clsx(classes.root, classes)}>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? client.firstName : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Surname"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? client.surname : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Gender"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? ( client.profile ? client.profile.gender : '' ) : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? client.email : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Mobile Number"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? ( client.profile ? client.profile.mobile : '' ) : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Address 1"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? ( client.profile ? client.profile.address1 : '' ) : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Address 2"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? ( client.profile ? client.profile.address2 : '' ) : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="City"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? ( client.profile ? client.profile.city : '' ) : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="State"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? ( client.profile ? client.profile.state : '' ) : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Date Of Birth"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? ( client.profile ? client.profile.dob : '' ) : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Dependents"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? ( client.profile ? client.profile.dependents : '' ) : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Marital Status"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? ( client.profile ? client.profile.marital : '' ) : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Income"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? ( client.profile ? client.profile.applicantincome : '' ) : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Co-Applicant Income"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? ( client.profile ? client.profile.coapplicantincome : '' ) : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Credit History"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? ( client.profile ? client.profile.credithistory : '' ) : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Education"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? ( client.profile ? client.profile.education : '' ) : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Self Employed"
                                        margin="dense"
                                        variant="standard"
                                        value={client ? ( client.profile ? client.profile.selfemployed : '' ) : ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={3} md={4} sm={12} xs={12}>
                                    {userData && userData.userRoles.sysAdmin ?
                                        <SelectLoanOfficer margin="dense" loanOfficers={loanOfficers} classes={classes} onChange={onChangeLoanOfficer} selectedLoanOfficer={selectedLoanOfficer}/>
                                        :
                                        <TextField
                                            fullWidth
                                            label="Loan Officer"
                                            margin="dense"
                                            variant="standard"
                                            value={client ? (client.profile ? `${client.profile.loanOfficer.firstName} ${client.profile.loanOfficer.surname}` : '') : ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    }
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Grid
                        justify="space-between"
                        container
                    >
                        <Grid item>
                            {userData && userData.userRoles.sysAdmin ?
                                <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                    className={classes.submitButton}
                                    onClick={onSubmit}
                                    disabled={client ? (client.profile ? (client.profile.loanOfficerId === selectedLoanOfficer) : true) : true}
                                >
                                    Save details
                                    {buttonLoading && <CircularProgress size={30} className={classes.progess} />}
                                </Button>
                                : <div/>}
                        </Grid>
                        <Grid item>
                            <Button
                                component={Link}
                                color="primary"
                                variant="outlined"
                                className={classes.submitButton}
                                to={{
                                    pathname: ROUTES.HOUSEPRICEQUERY,
                                    clientData: {
                                        uid: clID,
                                        firstName: client.firstName,
                                        surname: client.surname,
                                        gender: client.profile ? client.profile.gender : ''
                                    }
                                }}
                                params={{ clientData: {
                                        uid: clID,
                                        firstName: client.firstName,
                                        surname: client.surname
                                    } }}
                            >
                                House Price Query
                            </Button>
                        </Grid>
                    </Grid>
                    <LoanApplications history={history} classes={classes} clID={clID} clientData={{
                        firstName: client.firstName,
                        surname: client.surname,
                        gender: (client.profile ? client.profile.gender : '')
                    }}/>
                    </main>
                )
            }
        </React.Fragment>
    )
}

export default withStyles(styles)(ViewClient);