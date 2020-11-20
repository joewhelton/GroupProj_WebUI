import React, {useContext, useEffect, useState} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
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
import DeleteIcon from "@material-ui/icons/Delete";

const apiUrl = process.env.REACT_APP_API_URL;

const Clients = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes} = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [clients, setClients] = useState({});

    useEffect(() => {
        if(userData) {
            authMiddleWare(history);
            authorizeMiddleware(history, userData, 'loanOfficer');
            const authToken = localStorage.getItem('AuthToken');
            axios.defaults.headers.common = {Authorization: `${authToken}`};
            axios
                .get(apiUrl + 'client/own')
                .then((data) => {
                    const clientArray = [];
                    const clientData = data.data.clientData;
                    if ( clientData !== null ) {
                        for (const [key, value] of Object.entries(clientData)) {
                            let item = value;
                            item['id'] = key;
                            clientArray.push(item);
                        }
                    }
                    console.log(clientArray);
                    setClients(clientArray);
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
    }, [history, userData]);

    return(
        <React.Fragment>
            {uiLoading ? (<main className={classes.content}>
                    <div className={classes.toolbar}/>
                    {uiLoading && <CircularProgress size={150} className={classes.uiProgess}/>}
                </main>)
                : (<main className={classes.content}>
                        <div className={classes.toolbar} />
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="Financial Institution table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Contact Number</TableCell>
                                        <TableCell width={100}/>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {clients.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell component="th" scope="row">{`${client.firstName} ${client.surname}`}</TableCell>
                                            <TableCell>{client.email}</TableCell>
                                            <TableCell>{client.profile.mobile}</TableCell>
                                            <TableCell>
                                                <Link to={`${ROUTES.FINANCIALINSTITUTIONS}/${client.id}`}>
                                                    <EditIcon className={classes.iconLink}/>
                                                </Link>
                                                <DeleteIcon/>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </main>
                )
            }
        </React.Fragment>
    )

}

export default withStyles(styles)(Clients);