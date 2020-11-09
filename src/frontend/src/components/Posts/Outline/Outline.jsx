import React from 'react';
import PropTypes from 'prop-types';
// import { makeStyles } from '@material-ui/core/styles';
import useSiteMetaData from '../../../hooks/use-site-metadata';
import PostReference from './PostReference.jsx';

const Outline = ({ posts }) => {
  const { telescopeUrl } = useSiteMetaData();

  if (!posts) return <div>Loading...</div>;

  const postsUrl = posts.map((set) =>
    set.map(({ id, url }) => <PostReference postUrl={`${telescopeUrl}${url}`} key={id} />)
  );

  return <ul>{postsUrl && postsUrl.map((post) => post)}</ul>;
};

Outline.propTypes = {
  posts: PropTypes.array,
};

export default Outline;
