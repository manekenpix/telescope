import React, { useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';
// import { useInView } from 'react-intersection-observer';
import 'highlight.js/styles/github.css';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography, ListSubheader } from '@material-ui/core';
import './telescope-post-content.css';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import Spinner from '../Spinner/Spinner.jsx';
import AdminButtons from '../AdminButtons';

import { ObserverDispatchContext } from '../../contexts/Observer/ObserverContext';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    fontSize: '1.5rem',
    marginBottom: '4em',
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.secondary,
    padding: '1.4em',
    lineHeight: '1.3',
    zIndex: 1500,
    [theme.breakpoints.down(1440)]: {
      padding: '.7em',
    },
    [theme.breakpoints.down(1065)]: {
      position: 'static',
    },
  },
  title: {
    fontSize: '3.5em',
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    [theme.breakpoints.between('xs', 'sm')]: {
      fontSize: '2.5em',
    },
  },
  author: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    [theme.breakpoints.between('xs', 'sm')]: {
      fontSize: '1.2em',
    },
  },
  published: {
    fontSize: '1.2em',
    textDecoration: 'none',
    color: theme.palette.text.primary,
    [theme.breakpoints.between('xs', 'sm')]: {
      fontSize: '1em',
    },
  },
  content: {
    overflow: 'auto',
    padding: '2em',
    color: theme.palette.text.default,
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    '&:hover': {
      textDecorationLine: 'underline',
    },
  },
  time: {
    '&:hover': {
      textDecorationLine: 'underline',
    },
  },
  spinner: {
    padding: '20px',
  },
  error: {
    lineHeight: '1.00',
    fontSize: '1em',
  },
}));

const formatPublishedDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const formatted = new Intl.DateTimeFormat('en-CA', options).format(date);
  return `Last Updated ${formatted}`;
};

const Post = ({ postUrl }) => {
  const dispatch = useContext(ObserverDispatchContext);
  const postRef = useRef(null);
  /* const { ref, inView } = useInView({
    rootMargin: '10%',
  }); */

  // id, html, author, url, title, date, link
  const classes = useStyles();
  // We need a ref to our post content, which we inject into a <section> below.
  const sectionEl = useRef(null);
  // Grab the post data from our backend so we can render it
  const { data: post, error } = useSWR(postUrl, (url) => fetch(url).then((r) => r.json()));

  useEffect(() => {
    const options = {
      rootMargin: '10%',
    };

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log(entry.isIntersecting);
            dispatch({
              type: 'SELECT_POST',
              payload: postUrl.substring(postUrl.lastIndexOf('/') + 1),
            });
          }
        }),
      options
    );

    if (post) observer.observe(postRef.current);
    /* if (inView) {
    } */
    return () => {
      observer.unobserve(postRef.current);
    };
  }, []);

  if (error) {
    console.error(`Error loading post at ${postUrl}`, error);
    return (
      <Box className={classes.root} boxShadow={2}>
        <ListSubheader className={classes.header}>
          <AdminButtons />
          <Typography variant="h1" className={classes.title}>
            <Grid container className={classes.error}>
              <Grid item>
                <ErrorRoundedIcon className={classes.error} />
              </Grid>{' '}
              - Post Failed to Load
            </Grid>
          </Typography>
        </ListSubheader>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box className={classes.root} boxShadow={2}>
        <ListSubheader className={classes.header}>
          <AdminButtons />
          <Typography variant="h1" className={classes.title}>
            Loading Blog...
          </Typography>
        </ListSubheader>

        <Grid container justify="center">
          <Grid item className={classes.spinner}>
            <Spinner animation="border" variant="light">
              <span className="sr-only" textAlign="center">
                Loading...
              </span>
            </Spinner>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box className={classes.root} boxShadow={2}>
      <ListSubheader className={classes.header} ref={postRef}>
        <AdminButtons />
        <Typography variant="h1" title={post.title} id={post.id} className={classes.title}>
          {post.title}
        </Typography>
        <Typography variant="h3" className={classes.author}>
          By{' '}
          <a className={classes.link} href={post.feed.link}>
            {post.feed.author}
          </a>
        </Typography>
        <a href={post.url} rel="bookmark" className={classes.published}>
          <time className={classes.time} dateTime={post.updated}>
            {formatPublishedDate(post.updated)}
          </time>
        </a>
      </ListSubheader>

      <Grid container>
        <Grid item xs={12} className={classes.content}>
          <section
            ref={sectionEl}
            className="telescope-post-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

Post.propTypes = {
  postUrl: PropTypes.string,
};

export default Post;
