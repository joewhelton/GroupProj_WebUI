import React, {useCallback, useContext, useEffect, useState} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import axios from 'axios';
import { authMiddleWare, authorizeMiddleware } from '../../util/auth';
import {Context as UserContext} from "../../store/contexts/user/Store";
import FinancialInstitutionForm from "./FinancialInstitutionForm";
import {styles} from "../../styles/styles";

const apiUrl = process.env.REACT_APP_API_URL;

const NewFinancialInstitution = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes} = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [financialInstitution, setFinancialInstitution] = useState({
        name: '',
        address: '',
        email: '',
        phoneNumber: '',
        category: 'BANK',
        paymentDetails: {}
    });

    useEffect(() => {
        if(userData) {
            authMiddleWare(history);
            authorizeMiddleware(history, userData, 'sysAdmin');
            setUiLoading(false);
        }
    }, [ history, userData]);

    const onChange = useCallback((e) => {
        const {target} = e;
        let { name, value, checked } = target;
        if(name === 'category'){
            value = checked ? 'BROKER' : 'BANK'
        }
        setFinancialInstitution({
            ...financialInstitution,
            [name]: value
        });
    }, [financialInstitution]);

    const onChangePaymentDetails = useCallback((e) => {
        const {target} = e;
        let { name, value } = target;
        const newPaymentDetails = {...financialInstitution.paymentDetails, [name]: value};

        setFinancialInstitution({
            ...financialInstitution,
            paymentDetails: newPaymentDetails
        });
    }, [financialInstitution]);

    const onSubmit = (e) => {
        e.preventDefault();
        setButtonLoading(true);
        authMiddleWare(history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        const formRequest = financialInstitution;
        axios
            .post(apiUrl + 'financialinstitution', formRequest)
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
        <FinancialInstitutionForm
            fiState={financialInstitution}
            classes={classes}
            buttonLoading={buttonLoading}
            onChange={onChange}
            onChangePaymentDetails={onChangePaymentDetails}
            onSubmit={onSubmit}
            uiLoading={uiLoading}
        />
    )
}

export default withStyles(styles)(NewFinancialInstitution);