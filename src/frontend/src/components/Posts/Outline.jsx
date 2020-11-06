import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    color: '#000',
  },
}));

const Outline = ({ posts }) => {
  const classes = useStyles();

  return (
    <ul>
      {posts &&
        posts[0].map((post) => {
          console.log(post.id);
          return (
            <li key={post.id}>
              <Typography className={classes.root} variant="span">
                {post.id}
              </Typography>
            </li>
          );
        })}
    </ul>
  );
};

Outline.propTypes = {
  posts: PropTypes.array,
};

export default Outline;
