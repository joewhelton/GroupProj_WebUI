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
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import Grid from "@material-ui/core/Grid";
import {TextField} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

const apiUrl = process.env.REACT_APP_API_URL;

const LoanOfficers = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes} = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [loanOfficers, setLoanOfficers] = useState([]);
    const [loanOfficersDisplay, setLoanOfficersDisplay] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        if(userData) {
            authMiddleWare(history);
            authorizeMiddleware(history, userData, 'sysAdmin');
            const authToken = localStorage.getItem('AuthToken');
            axios.defaults.headers.common = {Authorization: `${authToken}`};
            axios
                .get(apiUrl + 'loanofficer')
                .then((data) => {
                    const loArray = [];
                    const loData = data.data.loData;
                    if ( loData !== null ) {
                        for (const [key, value] of Object.entries(loData)) {
                            let item = value;
                            item['id'] = key;
                            loArray.push(item);
                        }
                    }
                    console.log(loArray);
                    setLoanOfficers(loArray);
                    setLoanOfficersDisplay(loArray);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 403) {
                        history.push('/login');
                    }
                    console.log(error);
                })
                .finally(()=>
                    setUiLoading(false)
                );
        }
    }, [history, userData]);

    const filterChange = (e) => {
        const {target} = e;
        const { value } = target;
        setFilter(value);
        setLoanOfficersDisplay(loanOfficers.filter((cl) => {
            return (
                cl.firstName.toLowerCase().includes(value.toLowerCase())
                || cl.surname.toLowerCase().includes(value.toLowerCase())
                || cl.email.toLowerCase().includes(value.toLowerCase())
                || (cl.profile ?
                        cl.profile.mobile.toLowerCase().includes(value.toLowerCase())
                        : false
                )
            )
        }));
    }

    return(
        <React.Fragment>
            {uiLoading ? (<main className={classes.content}>
                    <div className={classes.toolbar}/>
                    {uiLoading && <CircularProgress size={150} className={classes.uiProgess}/>}
                </main>)
                : (<main className={classes.content}>
                        <div className={classes.toolbar} />
                        <Grid container direction={"row-reverse"}>
                            <Grid item sm={6} md={4} lg={3}>
                                <TextField
                                    fullWidth
                                    label="Search"
                                    margin="dense"
                                    name="filter"
                                    variant="outlined"
                                    value={!filter ? '' : filter}
                                    onChange={filterChange}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="Financial Institution table">
                                <TableHead className={classes.tableHeading}>
                                    <TableRow>
                                        <TableCell className={classes.tableHeadingCell}>Name</TableCell>
                                        <TableCell className={classes.tableHeadingCell}>Email</TableCell>
                                        <TableCell className={classes.tableHeadingCell}>Contact Number</TableCell>
                                        <TableCell width={100}/>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loanOfficersDisplay.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell component="th" scope="row">{`${client.firstName} ${client.surname}`}</TableCell>
                                            <TableCell>{client.email}</TableCell>
                                            <TableCell>{client.profile ? client.profile.mobile : ''}</TableCell>
                                            <TableCell>
                                                <IconButton component={Link} to={`${ROUTES.LOANOFFICERS}/${client.id}`}>
                                                    <MenuOpenIcon className={classes.iconLink}/>
                                                </IconButton>
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

export default withStyles(styles)(LoanOfficers);