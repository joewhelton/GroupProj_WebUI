import React, {useCallback, useContext, useEffect, useState} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Slider from '@material-ui/core/Slider';
import {format} from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import axios from 'axios';
import { authMiddleWare } from '../../util/auth';
import {Context as UserContext} from "../../store/contexts/user/Store";
import {styles} from "../../styles/styles";
import {Button, Card, CardActions, CardContent, Divider, Grid, TextField} from "@material-ui/core";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";

const apiUrl = process.env.REACT_APP_API_URL;

const HousePrices = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [userState, userDispatch] = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const {authUser, userData} = userState;
    const {history, classes} = props;
    const [uiLoading, setUiLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [dateOfSale, setDateOfSale] = React.useState(new Date('2014-01-01T00:00:00'));
    const [errors, setErrors] = useState([]);
    const [housePriceQuery, setHousePriceQuery] = useState({
        sale_date: '',
        sale_yr: '',
        sale_month: '',
        sale_day: '',
        bedrooms: '',
        bathrooms: '',
        sqft_living: '',
        sqft_lot: '',
        floors: '',
        waterfrontToggle: false,
        waterfront: 0,
        view: 0,
        condition: 3,
        grade: 8,
        sqft_above: '',
        sqft_basement: '',
        yr_built: '',
        yr_renovated: '',
        zipcode: '',
        lat: '',
        long: '',
        sqft_living15: '',
        sqft_lot15: ''
    });

    useEffect(() => {
        authMiddleWare(history);
        setUiLoading(false);
    },[history]);

    const handleDateChange = (date) => {
        setDateOfSale(date);
        setHousePriceQuery({ ...housePriceQuery,
            sale_yr: format(date, 'yyyy'),
            sale_month: format(date, 'MM'),
            sale_day: format(date, 'dd')
        });
    };

    const handleWaterfrontToggle = ((e)=> {
        setHousePriceQuery({ ...housePriceQuery, [e.target.name]: e.target.checked ? 1 : 0, waterfrontToggle: e.target.checked });
    })

    const handleViewSliderChange = ((e, newValue) => {
        setHousePriceQuery({ ...housePriceQuery, view: newValue });
    })

    const handleConditionSliderChange = ((e, newValue) => {
        setHousePriceQuery({ ...housePriceQuery, condition: newValue });
    })

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
    }, [housePriceQuery]);

    const onSubmit = (e) => {
        e.preventDefault();
        setButtonLoading(true);
        authMiddleWare(history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        const formRequest = housePriceQuery;
        axios
            .post(apiUrl + 'houseprice/predict', formRequest)
            .then((data) => {
                setButtonLoading(false);
                console.log(data);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    history.push('/login');
                }
                setErrors(error.response.data);
                setButtonLoading(false);
            });
    }

    return (
        <React.Fragment>
            { uiLoading
                ? (
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        {uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
                    </main>)
                : (
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        <Card className={clsx(classes.root, classes)}>
                            <form autoComplete="off" noValidate>
                                <Divider />
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid item lg={3} md={4} sm={12} xs={12}>
                                                <KeyboardDatePicker
                                                    fullWidth
                                                    disableToolbar
                                                    label="Sale Date"
                                                    variant="inline"
                                                    format="dd/MM/yyyy"
                                                    margin="dense"
                                                    name="sale_date"
                                                    variant="outlined"
                                                    value={dateOfSale}
                                                    onChange={handleDateChange}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
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
                                                label="Bathrooms"
                                                margin="dense"
                                                name="bathrooms"
                                                variant="standard"
                                                value={housePriceQuery.bathrooms}
                                                onChange={onChange}
                                                helperText={errors.bathrooms}
                                                error={errors.bathrooms ? true : false}
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
                                                helperText={errors.bathrooms}
                                                error={errors.bathrooms ? true : false}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Floors"
                                                margin="dense"
                                                name="floors"
                                                variant="standard"
                                                value={housePriceQuery.floors}
                                                onChange={onChange}
                                                helperText={errors.floors}
                                                error={errors.floors ? true : false}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12} className={classes.switchHolder}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={housePriceQuery.waterfrontToggle}
                                                        onChange={handleWaterfrontToggle}
                                                        name="waterfront"
                                                        color="primary"
                                                    />
                                                }
                                                label="Waterfront"
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <Typography id="discrete-slider" className={classes.rangeLabel}>
                                                View
                                            </Typography>
                                            <Slider
                                                value={housePriceQuery.view}
                                                className={classes.rangeSlider}
                                                aria-labelledby="discrete-slider"
                                                valueLabelDisplay="auto"
                                                onChange={handleViewSliderChange}
                                                name="view"
                                                step={1}
                                                marks
                                                min={0}
                                                max={4}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <Typography id="discrete-slider" className={classes.rangeLabel}>
                                                Condition
                                            </Typography>
                                            <Slider
                                                value={housePriceQuery.condition}
                                                className={classes.rangeSlider}
                                                aria-labelledby="discrete-slider"
                                                valueLabelDisplay="auto"
                                                onChange={handleConditionSliderChange}
                                                name="condition"
                                                step={1}
                                                marks
                                                min={1}
                                                max={5}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <Typography id="discrete-slider" className={classes.rangeLabel}>
                                                Grade
                                            </Typography>
                                            <Slider
                                                value={housePriceQuery.grade}
                                                className={classes.rangeSlider}
                                                aria-labelledby="discrete-slider"
                                                valueLabelDisplay="auto"
                                                onChange={handleGradeSliderChange}
                                                name="grade"
                                                step={1}
                                                marks
                                                min={3}
                                                max={13}
                                            />
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
                                                label="Sq Ft (Basement)"
                                                margin="dense"
                                                name="sqft_basement"
                                                variant="standard"
                                                value={housePriceQuery.sqft_basement}
                                                onChange={onChange}
                                                helperText={errors.sqft_basement}
                                                error={errors.sqft_basement ? true : false}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Year Built"
                                                margin="dense"
                                                name="yr_built"
                                                variant="standard"
                                                value={housePriceQuery.yr_built}
                                                onChange={onChange}
                                                helperText={errors.yr_built}
                                                error={errors.yr_built ? true : false}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Year Renovated"
                                                margin="dense"
                                                name="yr_renovated"
                                                variant="standard"
                                                value={housePriceQuery.yr_renovated}
                                                onChange={onChange}
                                                helperText={errors.yr_renovated}
                                                error={errors.yr_renovated ? true : false}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Zip Code"
                                                margin="dense"
                                                name="zipcode"
                                                variant="standard"
                                                value={housePriceQuery.zipcode}
                                                onChange={onChange}
                                                helperText={errors.zipcode}
                                                error={errors.zipcode ? true : false}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Latitude"
                                                margin="dense"
                                                name="lat"
                                                variant="standard"
                                                value={housePriceQuery.lat}
                                                onChange={onChange}
                                                helperText={errors.lat}
                                                error={errors.lat ? true : false}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Longitude"
                                                margin="dense"
                                                name="long"
                                                variant="standard"
                                                value={housePriceQuery.long}
                                                onChange={onChange}
                                                helperText={errors.long}
                                                error={errors.long ? true : false}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={4} sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Sq Ft (Living 15)"
                                                margin="dense"
                                                name="sqft_living15"
                                                variant="standard"
                                                value={housePriceQuery.sqft_living15}
                                                onChange={onChange}
                                                helperText={errors.sqft_living15}
                                                error={errors.sqft_living15 ? true : false}
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
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            className={classes.submitButton}
                            onClick={onSubmit}
                        >
                            Save details
                            {buttonLoading && <CircularProgress size={30} className={classes.progess} />}
                        </Button>
                    </main>
                )}
        </React.Fragment>
    )
}

export default withStyles(styles)(HousePrices);
