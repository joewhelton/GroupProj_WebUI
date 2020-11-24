import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import {styles} from "../../styles/styles";

import axios from 'axios';
import {authMiddleWare, authorizeMiddleware} from '../../util/auth';
import {Context as UserContext} from "../../store/contexts/user/Store";
import LoanApplicationForm from "./LoanApplicationForm";

const apiUrl = process.env.REACT_APP_API_URL;

const EditLoanApplication = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes} = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [loanApplication, setLoanApplication] = useState({});
    const [errors, setErrors] = useState([]);
    const { apID } = useParams();

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
                    if (error.response.status === 403) {
                        history.push('/login');
                    }
                    console.log(error);
                })
                .finally(() => setUiLoading(false));
        }
    }, [apID, history, userData]);

    const onChange = useCallback((e) => {
        const {target} = e;
        const { name, value } = target;
        setLoanApplication({
            ...loanApplication,
            [name]: value
        });
    }, [loanApplication]);

    const onSubmit = (e) => {
        e.preventDefault();
        setButtonLoading(true);
        authMiddleWare(history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .put(apiUrl + `loanapplication/${apID}`, loanApplication)
            .then(() => {

            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 403) {
                    history.push('/login');
                }
                console.log(error);
                setErrors(error);
            }).finally(() => setButtonLoading(false));
    }

    return (
        <LoanApplicationForm
            laState={loanApplication}
            classes={classes}
            buttonLoading={buttonLoading}
            onChange={onChange}
            onSubmit={onSubmit}
            uiLoading={uiLoading}
            errors={errors}
        />
    )
}

export default withStyles(styles)(EditLoanApplication);