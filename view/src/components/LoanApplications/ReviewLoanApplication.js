import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import {styles} from "../../styles/styles";

import axios from 'axios';
import {authMiddleWare, authorizeMiddleware} from '../../util/auth';
import {Context as UserContext} from "../../store/contexts/user/Store";
import LoanApplicationForm from "./LoanApplicationForm";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Button, Card, CardContent, Grid, TextField} from "@material-ui/core";
import clsx from "clsx";
import SelectLoanOfficer from "../Clients/SelectLoanOfficer";
import * as ROUTES from "../../constants/routes";
import LoanApplications from "./index";

const apiUrl = process.env.REACT_APP_API_URL;

const ReviewLoanApplication = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes, location} = props;
    const {clientData} = location;
    const [uiLoading, setUiLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [buttonLoading, setButtonLoading] = useState(false);
    const [loanApplication, setLoanApplication] = useState({});
    const { apID } = useParams();
    const [successMessage, setSuccessMessage] = useState(false);

    useEffect(() => {
        if(userData) {
            authMiddleWare(history);
            authorizeMiddleware(history, userData, 'loanOfficer');
            const authToken = localStorage.getItem('AuthToken');
            axios.defaults.headers.common = {Authorization: `${authToken}`};
            axios
                .get(apiUrl + `loanapplication/${apID}`)
                .then((data) => {
                    const applicationData = data.data.application;
                    setLoanApplication(applicationData);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 403) {
                        history.push('/login');
                    }
                    console.log(error);
                })
                .finally(() => setUiLoading(false));
        }
    }, [apID, history, userData]);

    const saveDecision = (decision) => {
        const approval = {
            approved: (decision ? 1 : 0)
        }
        setButtonLoading(true);
        authMiddleWare(history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .put(apiUrl + `loanapplication/approve/${apID}`, approval)
            .then(() => {
                setSuccessMessage(decision? "Loan Approved" : "Loan Declined");
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.status === 403) {
                    history.push('/login');
                }
                console.log(error);
            }).finally(() => setButtonLoading(false));
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
                                            value={clientData ? clientData.firstName : ''}
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
                                            value={clientData ? clientData.surname : ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item lg={3} md={4} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Applicant Income"
                                            margin="dense"
                                            variant="standard"
                                            value={loanApplication ? loanApplication.applicantIncome : ''}
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
                                            value={loanApplication ? loanApplication.coappIncome : ''}
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
                                            value={loanApplication ? loanApplication.dependents : ''}
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
                                            value={loanApplication ? loanApplication.dependents : ''}
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
                                            value={loanApplication ? loanApplication.education : ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item lg={3} md={4} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Married"
                                            margin="dense"
                                            variant="standard"
                                            value={loanApplication ? loanApplication.married : ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item lg={3} md={4} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Property Area"
                                            margin="dense"
                                            variant="standard"
                                            value={loanApplication ? loanApplication.propertyArea : ''}
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
                                            value={loanApplication ? loanApplication.propertyArea : ''}
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
                                            value={loanApplication ? loanApplication.selfemployed : ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item lg={3} md={4} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Term"
                                            margin="dense"
                                            variant="standard"
                                            value={loanApplication ? loanApplication.term : ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <Grid
                            justify="space-between"
                            container
                        >
                            <Grid item>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    type="button"
                                    className={classes.submitButton}
                                    onClick={()=>{saveDecision(true)}}
                                    //disabled={client ? (client.profile ? (client.profile.loanOfficerId === selectedLoanOfficer) : true) : true}
                                >
                                    Approve Loan
                                    {buttonLoading && <CircularProgress size={30} className={classes.progess} />}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    type="button"
                                    className={classes.submitButton}
                                    onClick={()=>{saveDecision(false)}}
                                    //disabled={client ? (client.profile ? (client.profile.loanOfficerId === selectedLoanOfficer) : true) : true}
                                >
                                    Decline Loan
                                    {buttonLoading && <CircularProgress size={30} className={classes.progess} />}
                                </Button>
                            </Grid>
                        </Grid>
                        {successMessage ? (
                            <div className={classes.customSuccess}>
                                {successMessage}
                            </div>
                        ) : false}
                    </main>
                )
            }
        </React.Fragment>
    )
}

export default withStyles(styles)(ReviewLoanApplication);
