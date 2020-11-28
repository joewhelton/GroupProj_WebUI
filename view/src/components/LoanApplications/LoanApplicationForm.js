import React from 'react';
import {Button, Card, CardActions, CardContent, Divider, Grid, TextField} from "@material-ui/core";
import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";

const LoanApplicationForm = ({laState, onChange, onSubmit, classes, buttonLoading, uiLoading, errors}) => {
    return (
        <React.Fragment>
            { uiLoading || !laState
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
                                                type="number"
                                                label="Loan Amount"
                                                margin="dense"
                                                name="amount"
                                                value={laState.amount}
                                                onChange={onChange}
                                                helperText={errors.amount}
                                                error={!!errors.amount}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Loan Term"
                                                margin="dense"
                                                name="term"
                                                value={laState.term}
                                                onChange={onChange}
                                                helperText={errors.term}
                                                error={!!errors.term}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Property Area"
                                                margin="dense"
                                                name="propertyArea"
                                                value={laState.propertyArea}
                                                onChange={onChange}
                                                helperText={errors.propertyArea}
                                                error={!!errors.propertyArea}
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
                                (!laState ? true : !laState.amount) ||
                                !laState.term ||
                                !laState.propertyArea
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

export default LoanApplicationForm;