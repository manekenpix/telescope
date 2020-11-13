import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useSWR from 'swr';
import { ObserverStateContext } from '../../../contexts/Observer/ObserverContext';

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
  },
  selected: {
    background: 'red',
  }
}));

const PostReference = ({ postUrl }) => {
  const classes = useStyles();
  const inViewPost = useContext(ObserverStateContext);
  const { data: post } = useSWR(postUrl, (url) => fetch(url).then((r) => r.json()));

  useEffect(() => {
    console.log(
      postUrl.substring(postUrl.lastIndexOf('/') + 1) === inViewPost ? 'the same' : 'different'
    );
  }, [inViewPost]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <ListItem
      className={classes.root}
      button
      component="a"
      href={`#${postUrl.substring(postUrl.lastIndexOf('/') + 1)}`}
      primary={`${post.feed.author}`}
      secondary={`${post.title}`}
      selected={postUrl.lastIndexOf('/') + 1 === inViewPost}
      selectedItemStyle={classes.selected}
    ></ListItem>
  );
};

PostReference.propTypes = {
  postUrl: PropTypes.string,
};

export default PostReference;
