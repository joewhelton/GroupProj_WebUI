import React, {useCallback, useContext, useEffect, useState} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
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

const Feedback = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes} = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [targetID, setTargetID] = useState(null);
    const [feedbackList, setFeedbackList] = useState([]);
    const [feedbackListDisplay, setFeedbackListDisplay] = useState([]);
    const [filter, setFilter] = useState('');

    const updateFromServer = useCallback(() => {
        setUiLoading(true);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        axios
            .get(apiUrl + 'feedback')
            .then((data) => {
                const feedbackArray = [];
                const feedbackData = data.data.feedback;
                for (const [key, value] of Object.entries(feedbackData)) {
                    let item = value;
                    item['id'] = key;
                    feedbackArray.push(item);
                }
                console.log(feedbackArray);
                setFeedbackList(feedbackArray);
                setFeedbackListDisplay(feedbackArray);
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
                .get(apiUrl + 'feedback')
                .then((data) => {
                    const feedbackArray = [];
                    const feedbackData = data.data.feedback;
                    for (const [key, value] of Object.entries(feedbackData)) {
                        let item = value;
                        item['id'] = key;
                        feedbackArray.push(item);
                    }
                    console.log(feedbackArray);
                    setFeedbackList(feedbackArray);
                    setFeedbackListDisplay(feedbackArray);
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
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        axios
            .delete(apiUrl + `feedback/${id}`)
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
        setFeedbackListDisplay(feedbackList.filter((fi) => {
            return (
                fi.userData.firstName.toLowerCase().includes(value.toLowerCase())
                || fi.userData.surname.toLowerCase().includes(value.toLowerCase())
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
                                        <TableCell width={"15%"}className={classes.tableHeadingCell}>User</TableCell>
                                        <TableCell width={"15%"} className={classes.tableHeadingCell}>Date</TableCell>
                                        <TableCell width={130} className={classes.tableHeadingCell}>Rating</TableCell>
                                        <TableCell className={classes.tableHeadingCell}>Message</TableCell>
                                        <TableCell width={130}/>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {feedbackListDisplay.map((fb) => (
                                        <TableRow key={fb.id}>
                                            <TableCell component="th" scope="row">{fb.userData ? (`${fb.userData.firstName} ${fb.userData.surname}`) : ''}</TableCell>
                                            <TableCell>{fb.createdDate}</TableCell>
                                            <TableCell>{fb.rating}</TableCell>
                                            <TableCell style={{position: "relative"}}>
                                                <div
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis",
                                                        overflow: "hidden",
                                                        position: "absolute",
                                                        left: "1rem",
                                                        right: "0"
                                                    }}>
                                                {fb.msg}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {/*<Link to={`${ROUTES.FINANCIALINSTITUTIONS}/${fi.id}`}>*/}
                                                {/*    <EditIcon className={classes.iconLink}/>*/}
                                                {/*</Link>*/}
                                                <IconButton
                                                    component={Link}
                                                    to={`${ROUTES.FEEDBACK}/${fb.id}`}
                                                >
                                                    <EditIcon className={classes.iconLink}/>
                                                </IconButton>
                                                <IconButton onClick={() => {
                                                    setConfirmOpen(true);
                                                    setTargetID(fb.id);
                                                }}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <ConfirmDialog
                            title="Delete Feedback"
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

export default withStyles(styles)(Feedback);