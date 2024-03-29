import React, {useCallback, useContext, useEffect, useState} from 'react';
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
import IconButton from "@material-ui/core/IconButton";
import ConfirmDialog from "../ConfirmDialog";

const apiUrl = process.env.REACT_APP_API_URL;

const FinancialInstitutions = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes} = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [targetID, setTargetID] = useState(null);
    const [financialInstitutions, setFinancialInstitutions] = useState([]);
    const [financialInstitutionsDisplay, setFinancialInstitutionsDisplay] = useState([]);
    const [filter, setFilter] = useState('');

    const updateFromServer = useCallback(() => {
        setUiLoading(true);
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
            })
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    history.push('/login');
                }
                console.log(error);
            }).finally(() => setUiLoading(false)
        );
    })

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
                })
                .catch((error) => {
                    if (error.response && error.response.status === 403) {
                        history.push('/login');
                    }
                    console.log(error);
                }).finally(() => setUiLoading(false)
            );
        }
    }, [history, userData]);

    const deletePost = (id) => {
        console.log(`Deleting FI #${id}`);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        axios
            .delete(apiUrl + `financialInstitution/${id}`)
            .then((data) => {
                updateFromServer();
            }).catch((error) => {
            if (error.response && error.response.status === 403) {
                history.push('/login');
            }
            console.log(error);
        });
    }

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
                                <TableHead className={classes.tableHeading}>
                                    <TableRow>
                                        <TableCell className={classes.tableHeadingCell}>Name</TableCell>
                                        <TableCell className={classes.tableHeadingCell}>Address</TableCell>
                                        <TableCell className={classes.tableHeadingCell}>Email</TableCell>
                                        <TableCell className={classes.tableHeadingCell}>Contact Number</TableCell>
                                        <TableCell width={130}/>
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
                                                {/*<Link to={`${ROUTES.FINANCIALINSTITUTIONS}/${fi.id}`}>*/}
                                                {/*    <EditIcon className={classes.iconLink}/>*/}
                                                {/*</Link>*/}
                                                <IconButton
                                                    component={Link}
                                                    to={`${ROUTES.FINANCIALINSTITUTIONS}/${fi.id}`}
                                                    >
                                                    <EditIcon className={classes.iconLink}/>
                                                </IconButton>
                                                <IconButton onClick={() => {
                                                    setConfirmOpen(true);
                                                    setTargetID(fi.id);
                                                }}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Fab color="primary" aria-label="add" className={classes.fab} href={ROUTES.NEWFINANCIALINSTITUTION}>
                            <AddIcon />
                        </Fab>
                        <ConfirmDialog
                            title="Delete Financial Institution"
                            open={confirmOpen}
                            setOpen={setConfirmOpen}
                            onConfirm={deletePost}
                            target={targetID}
                        >
                            Are you sure you want to delete this record?
                        </ConfirmDialog>
                    </main>
                )
            }
        </React.Fragment>
    )


}

export default withStyles(styles)(FinancialInstitutions);