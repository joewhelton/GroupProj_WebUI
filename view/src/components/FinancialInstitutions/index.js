import React, {useContext, useEffect, useState} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
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
import Grid from "@material-ui/core/Grid";
import {TextField} from "@material-ui/core";

const apiUrl = process.env.REACT_APP_API_URL;

const FinancialInstitutions = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes} = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [financialInstitutions, setFinancialInstitutions] = useState([]);
    const [financialInstitutionsDisplay, setFinancialInstitutionsDisplay] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        if(userData) {
            authMiddleWare(history);
            authorizeMiddleware(history, userData, 'sysAdmin');
            const authToken = localStorage.getItem('AuthToken');
            axios.defaults.headers.common = {Authorization: `${authToken}`};
            axios
                .get(apiUrl + 'financialInstitution')
                .then((data) => {
                    const fiArray = [];
                    const fiData = data.data.fiData;
                    for (const [key, value] of Object.entries(fiData)) {
                        let item = value;
                        item['id'] = key;
                        fiArray.push(item);
                    }
                    console.log(fiArray);
                    setFinancialInstitutions(fiArray);
                    setFinancialInstitutionsDisplay(fiArray);
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
    }, [history, userData]);

    const filterChange = (e) => {
        const {target} = e;
        const { value } = target;
        setFilter(value);
        setFinancialInstitutionsDisplay(financialInstitutions.filter((fi) => {
            return (
                fi.name.toLowerCase().includes(value.toLowerCase())
                || fi.address.toLowerCase().includes(value.toLowerCase())
                || fi.email.toLowerCase().includes(value.toLowerCase())
                || fi.phoneNumber.toLowerCase().includes(value.toLowerCase())
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
                                />
                            </Grid>
                        </Grid>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="Financial Institution table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Address</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Contact Number</TableCell>
                                        <TableCell width={100}/>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {financialInstitutionsDisplay.map((fi) => (
                                        <TableRow key={fi.id}>
                                            <TableCell component="th" scope="row">{fi.name}</TableCell>
                                            <TableCell>{fi.address}</TableCell>
                                            <TableCell>{fi.email}</TableCell>
                                            <TableCell>{fi.phoneNumber}</TableCell>
                                            <TableCell>
                                                <Link to={`${ROUTES.FINANCIALINSTITUTIONS}/${fi.id}`}>
                                                    <EditIcon className={classes.iconLink}/>
                                                </Link>
                                                <DeleteIcon/>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Fab color="primary" aria-label="add" className={classes.fab} href={ROUTES.NEWFINANCIALINSTITUTION}>
                            <AddIcon />
                        </Fab>
                    </main>
                )
            }
        </React.Fragment>
    )


}

export default withStyles(styles)(FinancialInstitutions);