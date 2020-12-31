import React, {useContext, useEffect, useState} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Context as UserContext} from "../../store/contexts/user/Store";
import {styles} from "../../styles/styles";
import {authMiddleWare, authorizeMiddleware} from "../../util/auth";
import {Card, CardContent, Divider} from "@material-ui/core";
import clsx from "clsx";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const ExportLoanData = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes, ...rest} = props;
    const [uiLoading, setUiLoading] = useState(true);

    useEffect(() => {
        if (userData) {
            authMiddleWare(history);
            authorizeMiddleware(history, userData, 'sysAdmin');
        }
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = {Authorization: `${authToken}`};

        axios({
            url: apiUrl + 'exportloandata',
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'loanData.csv'); //or any other extension
            document.getElementById("linkHolder").appendChild(link);
            link.click();
        });

        setUiLoading(false);
    },[history, userData]);

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
                                Download CSV file of Loan Application Data
                                <Divider style={{marginBottom: '2rem'}}/>
                                <div id="linkHolder"/>
                            </CardContent>
                            <Divider />
                        </Card>
                    </main>
                )}
        </React.Fragment>
    )
}

export default withStyles(styles)(ExportLoanData);