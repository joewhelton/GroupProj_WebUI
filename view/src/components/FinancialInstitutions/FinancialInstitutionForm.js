import React from 'react';
import {Button, Card, CardActions, CardContent, Divider, Grid, TextField} from "@material-ui/core";
import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";

const FinancialInstitutionForm = ({fiState, onChange, onSubmit, classes, buttonLoading, uiLoading}) => {
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
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            margin="dense"
                                            name="name"
                                            variant="outlined"
                                            value={!fiState ? '' : fiState.name}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address"
                                            margin="dense"
                                            name="address"
                                            variant="outlined"
                                            value={!fiState ? '' : fiState.address}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            margin="dense"
                                            name="email"
                                            variant="outlined"
                                            value={!fiState ? '' : fiState.email}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            margin="dense"
                                            name="phoneNumber"
                                            variant="outlined"
                                            value={!fiState ? '' : fiState.phoneNumber}
                                            onChange={onChange}
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