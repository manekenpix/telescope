import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import useSWR from 'swr';

const useStyles = makeStyles(() => ({
  root: {
    color: '#000',
  },
}));

const PostReference = ({ postUrl }) => {
  const classes = useStyles();
  const { data: post } = useSWR(postUrl, (url) => fetch(url).then((r) => r.json()));
  if (!post) {
    return <div className={classes.root}>Loading...</div>;
  }
  return (
    <li key={post.id} className={classes.root}>
      <a className="" href={`#${post.id}`}>{`${post.feed.author} ${post.title}`}</a>
    </li>
  );
};

PostReference.propTypes = {
  postUrl: PropTypes.string,
};

export default PostReference;
