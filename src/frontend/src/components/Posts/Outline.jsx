import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import useSWR from 'swr';
import useSiteMetaData from '../../hooks/use-site-metadata';

const useStyles = makeStyles(() => ({
  root: {
    color: '#000',
  },
}));

const ListElement = ({ postUrl }) => {
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

const Outline = ({ posts }) => {
  const { telescopeUrl } = useSiteMetaData();

  if (!posts) return <div>Loading...</div>;

  const postsUrl = posts.map((set) =>
    set.map(({ id, url }) => <ListElement postUrl={`${telescopeUrl}${url}`} key={id} />)
  );

  return <ul>{postsUrl && postsUrl.map((post) => post)}</ul>;
};

Outline.propTypes = {
  posts: PropTypes.array,
};

ListElement.propTypes = {
  postUrl: PropTypes.string,
};

export default Outline;
