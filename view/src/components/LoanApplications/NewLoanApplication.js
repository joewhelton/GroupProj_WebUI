import React, {useCallback, useContext, useEffect, useState} from 'react';
import * as ROUTES from '../../constants/routes';
import withStyles from '@material-ui/core/styles/withStyles';

import axios from 'axios';
import { authMiddleWare } from '../../util/auth';
import {Context as UserContext} from "../../store/contexts/user/Store";
import {styles} from "../../styles/styles";
import LoanApplicationForm from "./LoanApplicationForm";
import {useParams} from "react-router-dom";
import {format} from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

const apiUrl = process.env.REACT_APP_API_URL;

const NewLoanApplication = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes, location, clientInfo} = props;
    const {loanInfo} = location;
    const [uiLoading, setUiLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loanApplication, setLoanApplication] = useState({
        amount: null,
        term: null,
        propertyArea: null
    });
    const [clientDetails, setClientDetails] = useState(clientInfo);
    const { clID } = useParams();

    useEffect(() => {
        if(userData) {
            authMiddleWare(history);
            setUiLoading(false);
        }
        if(loanInfo){
            if(loanInfo.amount) {
                setLoanApplication({
                    ...loanApplication,
                    amount: loanInfo.amount
                });
            }
            setClientDetails({
                firstName: loanInfo.firstName,
                surname: loanInfo.surname,
                gender: loanInfo.gender
            })
        }
    }, [ history, userData]);

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
        const formRequest = loanApplication;
        formRequest.clientId = clID;
        axios
            .post(apiUrl + 'loanapplication', formRequest)
            .then((data) => {
                console.log(data.data.key);
                history.push({
                    pathname: `${ROUTES.APPLICATIONREVIEW}/${data.data.key}`,
                    clientData: {
                        firstName: clientDetails.firstName,
                        surname: clientDetails.surname,
                        gender: clientDetails.gender
                    }
                });
                setButtonLoading(false);
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.status === 403) {
                    history.push('/login');
                }
                console.log(error);
                setErrors(error.response.data);
                setButtonLoading(false);
            });
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

export default withStyles(styles)(NewLoanApplication);