import React from 'react';
import PropTypes from 'prop-types';
import { ListSubheader } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useSiteMetaData from '../../../hooks/use-site-metadata';
import PostReference from './PostReference.jsx';

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.primary.main,
    padding: '2em',
  },
}));

const Outline = ({ posts }) => {
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetaData();

  if (!posts) return <div>Loading...</div>;

  const postsUrl = posts.map((set) =>
    set.map(({ id, url }) => <PostReference postUrl={`${telescopeUrl}${url}`} key={id} />)
  );

  return (
    <ListSubheader className={classes.header} component="nav">
      {postsUrl && postsUrl.map((post) => post)}
    </ListSubheader>
  );
};

Outline.propTypes = {
  posts: PropTypes.array,
};

export default Outline;
