import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Slider from '@material-ui/core/Slider';

import axios from 'axios';
import { authMiddleWare } from '../../util/auth';
import {Context as UserContext} from "../../store/contexts/user/Store";
import {styles} from "../../styles/styles";
import {Button, Card, CardActions, CardContent, Divider, Grid, TextField} from "@material-ui/core";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import * as ROUTES from "../../constants/routes";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

const apiUrl = process.env.REACT_APP_API_URL;

const HousePrices = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes, location} = props;
    const {clientData} = location;
    //console.log(clientData);
    const [uiLoading, setUiLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [result, setResult] = useState('');
    const [housePriceQuery, setHousePriceQuery] = useState({
        bedrooms: '',
        sqft_living: '',
        sqft_lot: '',
        grade: 8,
        sqft_above: '',
        sqft_lot15: ''
    });

    const queryResult = useRef('');

    useEffect(() => {
        authMiddleWare(history);
        setUiLoading(false);
    },[history]);

    const handleGradeSliderChange = ((e, newValue) => {
        setHousePriceQuery({ ...housePriceQuery, grade: newValue });
    })

    const onChange = useCallback((e) => {
        const {target} = e;
        const { name, value } = target;
        setHousePriceQuery({
            ...housePriceQuery,
            [name]: value
        });
        if(errors[name]){
            setErrors({
                ...errors,
                [name]: undefined
            })
        }
    }, [errors, housePriceQuery]);

    const onSubmit = (e) => {
        e.preventDefault();
        setButtonLoading(true);
        authMiddleWare(history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        const formRequest = housePriceQuery;
        if(clientData){
            formRequest.userID = clientData.uid;
        }
        axios
            .post(apiUrl + 'houseprice/predict', formRequest)
            .then((data) => {
                setButtonLoading(false);
                console.log(data.data.result);
                setResult(data.data.result);
            })
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    history.push('/login');
                }
                setErrors(error.response.data);
                setButtonLoading(false);
            });
    }

    return (
        <React.Fragment>
            { uiLoading || authUser === null
                ? (
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        {uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
                    </main>)
                : (
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        {
                            clientData ? <Typography>Query on behalf of {clientData.firstName} {clientData.surname}</Typography> : ''
                        }
                        <Card className={clsx(classes.root, classes)}>
                            <form autoComplete="off" noValidate>
                                <Divider />
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Bedrooms"
                                                margin="dense"
                                                name="bedrooms"
                                                variant="standard"
                                                value={housePriceQuery.bedrooms}
                                                onChange={onChange}
                                                helperText={errors.bedrooms}
                                                error={errors.bedrooms ? true : false}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Sq Ft (Living)"
                                                margin="dense"
                                                name="sqft_living"
                                                variant="standard"
                                                value={housePriceQuery.sqft_living}
                                                onChange={onChange}
                                                helperText={errors.bathrooms}
                                                error={errors.bathrooms ? true : false}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Sq Ft (Lot)"
                                                margin="dense"
                                                name="sqft_lot"
                                                variant="standard"
                                                value={housePriceQuery.sqft_lot}
                                                onChange={onChange}
                                                helperText={errors.sqft_lot}
                                                error={errors.sqft_lot ? true : false}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <Typography id="discrete-slider" className={classes.rangeLabel}>
                                                Grade
                                            </Typography>
                                            <InputLabel id="grade-label">Grade</InputLabel>
                                            <Select
                                                labelId="grade-label"
                                                id="grade"
                                                name="grade"
                                                value={housePriceQuery.propertyArea}
                                                onChange={onChange}
                                            >
                                                <MenuItem value={'3'}>Does not meet standards</MenuItem>
                                                <MenuItem value={'4'}>Older low quality</MenuItem>
                                                <MenuItem value={'5'}>Small simple design</MenuItem>
                                                <MenuItem value={'6'}>Low quality, simple design</MenuItem>
                                                <MenuItem value={'7'}>Average</MenuItem>
                                                <MenuItem value={'8'}>Just above average</MenuItem>
                                                <MenuItem value={'9'}>Good design & quality</MenuItem>
                                                <MenuItem value={'10'}>High quality features</MenuItem>
                                                <MenuItem value={'11'}>Custom design high quality</MenuItem>
                                                <MenuItem value={'12'}>Custom design higher quality</MenuItem>
                                                <MenuItem value={'13'}>Highest quality mansion</MenuItem>
                                            </Select>
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Sq Ft (Above)"
                                                margin="dense"
                                                name="sqft_above"
                                                variant="standard"
                                                value={housePriceQuery.sqft_above}
                                                onChange={onChange}
                                                helperText={errors.sqft_above}
                                                error={errors.sqft_above ? true : false}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Sq Ft (Lot 15)"
                                                margin="dense"
                                                name="sqft_lot15"
                                                variant="standard"
                                                value={housePriceQuery.sqft_lot15}
                                                onChange={onChange}
                                                helperText={errors.sqft_lot15}
                                                error={errors.sqft_lot15 ? true : false}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <Divider />
                                <CardActions />
                            </form>
                        </Card>
                        <Grid container justify={"space-between"}>
                            <Grid item>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                    className={classes.submitButton}
                                    onClick={onSubmit}
                                >
                                    Submit Query
                                    {buttonLoading && <CircularProgress size={30} className={classes.progess} />}
                                </Button>
                            </Grid>
                            {result ?
                                <Grid item style={{display: 'flex'}}>
                                    <Card ref={queryResult} style={{
                                        marginTop: '0.4rem',
                                        padding: '0 1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}>Result: <span style={{fontWeight: 'bold'}}>{result}</span><br/>
                                    Mean Absolute Error - <span style={{fontStyle: 'italic'}}>15662</span>
                                    </Card>
                                </Grid>
                                : ''
                            }
                            {
                                result && clientData ?
                                    <Grid item>
                                        <Button
                                            color="primary"
                                            variant="outlined"
                                            type="button"
                                            component={Link}
                                            className={classes.submitButton}
                                            to={{
                                                pathname: `${ROUTES.NEWLOANAPPLICATION}/${clientData.uid}`,
                                                loanInfo: {
                                                    amount: result,
                                                    firstName: clientData.firstName,
                                                    surname: clientData.surname,
                                                    gender: clientData.gender
                                                }
                                            }}
                                        >
                                            Make loan application
                                        </Button>
                                    </Grid>
                                    : ''
                            }
                        </Grid>
                    </main>
                )}
        </React.Fragment>
    )
}

export default withStyles(styles)(HousePrices);
