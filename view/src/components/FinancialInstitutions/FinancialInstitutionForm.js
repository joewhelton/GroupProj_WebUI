import React from 'react';
import {Button, Card, CardActions, CardContent, Divider, Grid, TextField} from "@material-ui/core";
import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Collapse from "@material-ui/core/Collapse";

const FinancialInstitutionForm = ({fiState, onChange, onChangePaymentDetails, onSubmit, classes, buttonLoading, uiLoading}) => {
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
                                    <Grid item lg={3} md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            margin="dense"
                                            name="name"
                                            value={!fiState ? '' : fiState.name}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                    <Grid item lg={3} md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address"
                                            margin="dense"
                                            name="address"
                                            value={!fiState ? '' : fiState.address}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                    <Grid item lg={3} md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            margin="dense"
                                            name="email"
                                            value={!fiState ? '' : fiState.email}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                    <Grid item lg={3} md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            margin="dense"
                                            name="phoneNumber"
                                            value={!fiState ? '' : fiState.phoneNumber}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                    <Grid item lg={3} md={4} sm={6} xs={12} className={classes.switchHolder}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={fiState.category === 'BROKER'}
                                                    onChange={onChange}
                                                    name="category"
                                                    color="primary"
                                                />
                                            }
                                            label="Brokerage"
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <Divider />
                            <Collapse in={fiState.category === 'BROKER'} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item lg={3} md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                label="BIC"
                                                margin="dense"
                                                name="bic"
                                                value={!fiState.paymentDetails ? '' : fiState.paymentDetails.bic}
                                                onChange={onChangePaymentDetails}
                                            />
                                        </Grid>
                                        <Grid item lg={3} md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                label="IBAN"
                                                margin="dense"
                                                name="iban"
                                                value={!fiState.paymentDetails ? '' : fiState.paymentDetails.iban}
                                                onChange={onChangePaymentDetails}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Collapse>
                        </form>
                    </Card>
                    <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        className={classes.submitButton}
                        onClick={onSubmit}
                        disabled={
                            buttonLoading ||
                            (!fiState ? true : !fiState.name) ||
                            !fiState.address ||
                            !fiState.phoneNumber ||
                            !fiState.email
                        }
                    >
                        Save details
                        {buttonLoading && <CircularProgress size={30} className={classes.progess} />}
                    </Button>
                </main>
            )}
        </React.Fragment>
    )
}

export default FinancialInstitutionForm;