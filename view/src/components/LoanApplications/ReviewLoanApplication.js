import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import {styles} from "../../styles/styles";

import axios from 'axios';
import {authMiddleWare, authorizeMiddleware} from '../../util/auth';
import {Context as UserContext} from "../../store/contexts/user/Store";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Button, Card, CardContent, Grid, TextField} from "@material-ui/core";
import clsx from "clsx";
import Divider from "@material-ui/core/Divider";
import CardHeader from "@material-ui/core/CardHeader";

const apiUrl = process.env.REACT_APP_API_URL;

const ReviewLoanApplication = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes, location} = props;
    const {clientData} = location;
    const [uiLoading, setUiLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [calculateButtonLoading, setCalculateButtonLoading] = useState(false);
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
                    let applicationData = data.data.application;
                    if(clientData && clientData.gender) {
                        applicationData["gender"] = clientData.gender;
                    }
                    applicationData.loanApplicationID = apID;
                    setLoanApplication(applicationData);
                    console.log(applicationData["Loan Model Answer"]);
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

    const getPrediction = () => {
        setCalculateButtonLoading(true);
        authMiddleWare(history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .post(apiUrl + 'loanapplication/predict', loanApplication)
            .then((data) => {
                const result = data.data.result;
                setLoanApplication({...loanApplication, ["Loan Model Answer"]: result});
            })
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    history.push('/login');
                }
                console.log(error.response.data);
            })
            .finally(() => setCalculateButtonLoading(false));

    }

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
                                            label="Gender"
                                            margin="dense"
                                            variant="standard"
                                            value={loanApplication ? loanApplication.gender : ''}
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
                                            value={loanApplication ? loanApplication.selfemployed : ''}
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
                                            value={loanApplication ? loanApplication.credithistory : ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item lg={3} md={4} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Amount"
                                            margin="dense"
                                            variant="standard"
                                            value={loanApplication ? loanApplication.amount : ''}
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
                        <Divider/>
                        <Card mt={5}>
                            <CardHeader title="Loan Suitability Prediction">
                                Loan Suitability Prediction
                            </CardHeader>
                            <CardContent>
                                <Grid container>
                                    {loanApplication["Loan Model Answer"] ?
                                        ''
                                        :
                                        <Grid item xs={12}>
                                            <div className={classes.customError}>
                                                A prediction from the Loan Modelling Engine is required before a loan can be approved or declined
                                            </div>
                                        </Grid>
                                    }
                                    <Grid item lg={3} md={4} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Loan Model Answer"
                                            margin="dense"
                                            variant="standard"
                                            value={loanApplication ? loanApplication["Loan Model Answer"] ? loanApplication["Loan Model Answer"] : 'None' : 'None'}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={12} xs={12}>
                                        <Button
                                            color="primary"
                                            variant="outlined"
                                            type="button"
                                            className={classes.submitButton}
                                            onClick={getPrediction}
                                        >
                                            (Re)calculate
                                            {calculateButtonLoading && <CircularProgress size={30} className={classes.progess} />}
                                        </Button>

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
                                    disabled={loanApplication["Loan Model Answer"] ? false: true}
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
                                    disabled={loanApplication["Loan Model Answer"] ? false: true}
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
