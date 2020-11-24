import React, {useContext, useEffect, useState} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import * as ROUTES from '../../constants/routes';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import axios from 'axios';
import { authMiddleWare, authorizeMiddleware } from '../../util/auth';
import {Context as UserContext} from "../../store/contexts/user/Store";
import {Link} from "react-router-dom";
import {styles} from "../../styles/styles";
import EditIcon from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import {format} from "date-fns";
import clsx from "clsx";
import {Card, CardContent} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";

const apiUrl = process.env.REACT_APP_API_URL;

const LoanApplications = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes, clID} = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        if(userData) {
            authMiddleWare(history);
            authorizeMiddleware(history, userData, 'loanOfficer');
            const authToken = localStorage.getItem('AuthToken');
            axios.defaults.headers.common = {Authorization: `${authToken}`};
            const endpoint = `client/${clID}/loanapplication`;
            axios
                .get(apiUrl + endpoint)
                .then((data) => {
                    const applicationArray = [];
                    const applications = data.data.applications;
                    if ( applications !== null ) {
                        for (const [key, value] of Object.entries(applications)) {
                            let item = value;
                            item['id'] = key;
                            applicationArray.push(item);
                        }
                    }
                    setApplications(applicationArray);
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        history.push('/login');
                    }
                    console.log(error);
                })
                .finally(()=>
                    setUiLoading(false)
                );
        }
    }, [clID, history, userData]);

    return(
        <React.Fragment>
            {uiLoading ?
                ('')
                : (
                    <React.Fragment>
                        <Card mt={"1rem"} className={clsx(classes.root, classes)}>
                            <CardHeader title="Loan Applications">

                            </CardHeader>
                            <CardContent>
                                <TableContainer component={Paper}>
                                    <Table className={classes.table} aria-label="Loan Application table">
                                        <TableHead className={classes.tableHeading}>
                                            <TableRow>
                                                <TableCell className={classes.tableHeadingCell}>Date</TableCell>
                                                <TableCell className={classes.tableHeadingCell}>Amount</TableCell>
                                                <TableCell className={classes.tableHeadingCell}>Term</TableCell>
                                                <TableCell className={classes.tableHeadingCell}>Area</TableCell>
                                                <TableCell width={100}/>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {applications.map((application) => (
                                                <TableRow key={application.id}>
                                                    <TableCell component="th" scope="row">{format(new Date(application.createdDate), 'yyyy-MM-dd')}</TableCell>
                                                    <TableCell>{application.amount}</TableCell>
                                                    <TableCell>{application.term}</TableCell>
                                                    <TableCell>{application.propertyArea}</TableCell>
                                                    <TableCell>
                                                        <IconButton component={Link} to={`${ROUTES.APPLICATION}/${application.id}`}>
                                                            <EditIcon className={classes.iconLink}/>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                        <Fab color="primary" aria-label="add" className={classes.fab} href={`${ROUTES.NEWLOANAPPLICATION}/${clID}`}>
                            <AddIcon />
                        </Fab>
                    </React.Fragment>
                )
            }
        </React.Fragment>
    )

}

export default withStyles(styles)(LoanApplications);