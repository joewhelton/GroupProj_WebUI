import React, {useCallback, useContext, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import {styles} from "../../styles/styles";

import axios from 'axios';
import { authMiddleWare, authorizeMiddleware } from '../../util/auth';
import {Context as UserContext} from "../../store/contexts/user/Store";
import FinancialInstitutionForm from "./FinancialInstitutionForm";

const apiUrl = process.env.REACT_APP_API_URL;

const EditFinancialInstitution = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes} = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [financialInstitution, setFinancialInstitution] = useState({});
    const { fiID } = useParams();
    
    useEffect(() => {
        if(userData) {
            authMiddleWare(history);
            authorizeMiddleware(history, userData, 'sysAdmin');
            const authToken = localStorage.getItem('AuthToken');
            axios.defaults.headers.common = {Authorization: `${authToken}`};
            axios
                .get(apiUrl + `financialInstitution/${fiID}`)
                .then((data) => {
                    const fiData = data.data.fiData;
                    setFinancialInstitution(fiData);
                    setUiLoading(false);
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        history.push('/login');
                    }
                    console.log(error);
                    setUiLoading(false);
                });
        }
    }, [fiID, history, userData]);

    const onChange = useCallback((e) => {
        const {target} = e;
        const { name, value } = target;
        setFinancialInstitution({
            ...financialInstitution,
            [name]: value
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
            .put(apiUrl + `financialinstitution/${fiID}`, formRequest)
            .then(() => {
                setButtonLoading(false);
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 403) {
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
            onSubmit={onSubmit}
            uiLoading={uiLoading}
        />
    )
}

export default withStyles(styles)(EditFinancialInstitution);