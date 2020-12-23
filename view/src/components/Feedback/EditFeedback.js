import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import {styles} from "../../styles/styles";

import axios from 'axios';
import {authMiddleWare, authorizeMiddleware} from '../../util/auth';
import {Context as UserContext} from "../../store/contexts/user/Store";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Button, Card, CardContent, Divider, Grid, TextField} from "@material-ui/core";
import clsx from "clsx";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

const apiUrl = process.env.REACT_APP_API_URL;

const EditFeedback = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes} = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [feedback, setFeedback] = useState({});
    const { feedbackID } = useParams();

    useEffect(() => {
        if(userData) {
            authMiddleWare(history);
            authorizeMiddleware(history, userData, 'sysAdmin');
            const authToken = localStorage.getItem('AuthToken');
            axios.defaults.headers.common = {Authorization: `${authToken}`};
            axios
                .get(apiUrl + `feedback/${feedbackID}`)
                .then((data) => {
                    const feedbackData = data.data.feedback;
                    setFeedback(feedbackData);
                    setUiLoading(false);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 403) {
                        history.push('/login');
                    }
                    console.log(error);
                    setUiLoading(false);
                });
        }
    }, [feedbackID, history, userData]);

    const onChange = useCallback((e) => {
        const {target} = e;
        let { name, value } = target;
        setFeedback({
            ...feedback,
            [name]: value
        });
    }, [feedback]);

    const handleViewSliderChange = ((e, newValue) => {
        setFeedback({ ...feedback, rating: newValue });
    })

    const onSubmit = (e) => {
        e.preventDefault();
        setButtonLoading(true);
        authMiddleWare(history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .put(apiUrl + `feedback/${feedbackID}`, feedback)
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
            { uiLoading
                ? (
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        {uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
                    </main>)
                : (
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        <Card className={clsx(classes.root, classes)}>
                            <form autoComplete="off" noValidate>
                                <Divider />
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item lg={3} md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Name"
                                                margin="dense"
                                                name="name"
                                                value={!feedback ? '' : ( feedback.userData ? (`${feedback.userData.firstName} ${feedback.userData.surname}`) : '' )}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                onChange={onChange}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={6} xs={12}>
                                            <Typography id="discrete-slider" className={classes.rangeLabel}>
                                                Rating (1-5)
                                            </Typography>
                                            <Slider
                                                value={feedback.rating}
                                                className={classes.rangeSlider}
                                                aria-labelledby="discrete-slider"
                                                valueLabelDisplay="auto"
                                                onChange={handleViewSliderChange}
                                                name="rating"
                                                step={1}
                                                marks
                                                min={1}
                                                max={5}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Message"
                                                margin="dense"
                                                name="msg"
                                                multiline
                                                rows={4}
                                                value={!feedback ? '' : feedback.msg}
                                                onChange={onChange}
                                            />
                                        </Grid>

                                    </Grid>
                                </CardContent>
                            </form>
                        </Card>
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            className={classes.submitButton}
                            onClick={onSubmit}
                        >
                            Save details
                            {buttonLoading && <CircularProgress size={30} className={classes.progess} />}
                        </Button>
                    </main>
                )}
        </React.Fragment>
    )
}

export default withStyles(styles)(EditFeedback);