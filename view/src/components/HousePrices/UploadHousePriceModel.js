import React, {useContext, useEffect, useState} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Context as UserContext} from "../../store/contexts/user/Store";
import {styles} from "../../styles/styles";
import {authMiddleWare, authorizeMiddleware} from "../../util/auth";
import {Button, Card, CardContent, Divider, Grid} from "@material-ui/core";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import axios from "axios";

const UploadHousePriceModel = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes, ...rest} = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [fileError, setFileError] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [newModel, setNewModel] = useState('');
    const [newWeights, setNewWeights] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
        if (userData) {
            authMiddleWare(history);
            authorizeMiddleware(history, userData, 'sysAdmin');
        }
        setUiLoading(false);
    },[history, userData]);

    const updateModel = (e) => {
        setFileError(false);
        setSuccessMessage(false);
        setNewModel(e.target.files[0]);
    };

    const updateWeights = (e) => {
        setFileError(false);
        setSuccessMessage(false);
        setNewWeights(e.target.files[0]);
    };

    const uploadFiles = (e) => {
        e.preventDefault();
        setButtonLoading(true);
        authMiddleWare(history);
        authorizeMiddleware(history, userData, 'sysAdmin');
        const authToken = localStorage.getItem('AuthToken');
        let form_data = new FormData();
        form_data.append('modelFile', newModel);
        form_data.append('weightsFile', newWeights);
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        const apiUrl = process.env.REACT_APP_API_URL;
        axios
            .post(apiUrl + 'houseprice/upload', form_data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            .then(() => {
                console.log('success');
                setSuccessMessage('Files uploaded successfully');
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    history.push('/login');
                }
                console.log(error.response.data.error);
                setFileError(error.response.data.error);
            })
            .finally(() =>
                setButtonLoading(false)
        );

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
                        <CardContent>
                            Upload the .JSON model file and the .bin weights file.
                            <Divider style={{marginBottom: '2rem'}}/>
                            <Grid container spacing={3}>
                                <Grid item lg={3} md={6} sm={12}>
                                    <Typography id="modelLabel" className={classes.rangeLabel}>
                                        Model File
                                    </Typography>
                                    <input
                                        className={classes.input}
                                        id="modelFile"
                                        type="file"
                                        onChange={updateModel}
                                    />
                                </Grid>
                                <Grid item lg={3} md={6} sm={12}>
                                    <Typography id="weightLabel" className={classes.rangeLabel}>
                                        Weights File
                                    </Typography>
                                    <input
                                        className={classes.input}
                                        id="raised-button-file"
                                        type="file"
                                        onChange={updateWeights}
                                    />
                                </Grid>
                            </Grid>
                            {fileError ? (
                                <div className={classes.customError}>
                                    {fileError}
                                </div>
                            ) : false}
                            {successMessage ? (
                                <div className={classes.customSuccess}>
                                    {successMessage}
                                </div>
                            ) : false}
                            <div className={classes.progress} />
                        </CardContent>
                        <Divider />
                        <Button
                            variant="outlined"
                            color="primary"
                            type="submit"
                            size="small"
                            startIcon={<CloudUploadIcon />}
                            className={classes.uploadButton}
                            onClick={uploadFiles}
                        >
                            Upload Files {buttonLoading && <CircularProgress size={30} className={classes.progess} />}
                        </Button>
                    </Card>
                </main>
                )}
        </React.Fragment>
    )
};

export default withStyles(styles)(UploadHousePriceModel);