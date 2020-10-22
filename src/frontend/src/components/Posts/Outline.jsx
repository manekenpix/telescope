import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    color: '#000',
  },
}));

const Outline = () => {
  const classes = useStyles();

  return (
    <Typography className={classes.root} variant="h2">
      Text with good width
    </Typography>
  );
};

export default Outline;
