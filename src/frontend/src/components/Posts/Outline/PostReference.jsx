import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ListItem } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';
import useSWR from 'swr';
import { ObserverStateContext } from '../../../contexts/Observer/ObserverContext';

// const useStyles = makeStyles((theme) => ({
// }));

const PostReference = ({ postUrl }) => {
  const inViewPost = useContext(ObserverStateContext);
  // const classes = useStyles();
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
      button
      component="a"
      href={`#${postUrl.substring(postUrl.lastIndexOf('/') + 1)}`}
      // className={classes.root}
      primary={`${post.feed.author}`}
      secondary={`${post.title}`}
      selected={postUrl.lastIndexOf('/') + 1 === inViewPost}
    ></ListItem>
  );
};

PostReference.propTypes = {
  postUrl: PropTypes.string,
};

export default PostReference;
