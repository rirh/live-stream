import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
    }),
);

const DefaultLayout: React.FC = (props) => {
    const classes = useStyles()
    return <>
        <Grid container className={classes.root}>
            <Grid item xs={12}>
                {props.children}
            </Grid>
        </Grid>
    </>
};


export default DefaultLayout