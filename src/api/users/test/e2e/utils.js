const fetch = require('node-fetch');
const { hash, createServiceToken } = require('@senecacdot/satellite');

const USERS_URL = 'http://localhost/v1/users';

// takes a user object, performs GET using the user's email
const getUser = async (user) => {
  const response = await fetch(`${USERS_URL}/${hash(user.email)}`, {
    headers: {
      Authorization: `bearer ${createServiceToken()}`,
      'Content-Type': 'application/json',
    },
  });

  return response;
};

// constructs a paginated query using a passed string
const getUsersPaginated = async (query = '') => {
  const response = await fetch(`${USERS_URL}/${query}`, {
    headers: {
      Authorization: `bearer ${createServiceToken()}`,
      'Content-Type': 'application/json',
    },
  });

  return response;
};

// takes an array of users and sequentially gets them all
// not to be confused with getting users via pagination
const getUsers = async (users) => Promise.all(users.map((user) => getUser(user)));

const createUsers = (numberOfUsers) => {
  return [...Array(numberOfUsers).keys()].map((index) => {
    return {
      firstName: `TelescopeUser${index}`,
      lastName: `TelescopeUser${index}`,
      email: `TelescopeUser${index}@email.com`,
      displayName: `TelescopeUser${index} TelescopeUser${index}`,
      isAdmin: false,
      isFlagged: false,
      feeds: [`https://dev.to/feed/TelescopeUser${index}`],
      github: {
        username: `TelescopeUser${index}`,
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };
  });
};

const postUser = async (user) => {
  const response = await fetch(`${USERS_URL}/${hash(user.email)}`, {
    method: 'post',
    headers: {
      Authorization: `bearer ${createServiceToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  return response;
};

const postUsers = async (users) =>
  Promise.all(
    users.map((user) =>
      postUser(user)
        .then((res) => {
          // We should get a 201 (created), but if the user exists, a 400 (which is fine here)
          if (!(res.status === 201 || res.status === 400)) {
            throw new Error(`got unexpected status ${res.status}`);
          }
        })
        .catch((err) => {
          console.error('Unable to create user with Users service', { err });
        })
    )
  );

// Delete the Telescope users we created in the Users service.
const putUser = async (user) => {
  const response = fetch(`${USERS_URL}/${hash(user.email)}`, {
    method: 'put',
    headers: {
      Authorization: `bearer ${createServiceToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  return response;
};

// Delete the Telescope users we created in the Users service.
const deleteUser = async (user) => {
  const response = fetch(`${USERS_URL}/${hash(user.email)}`, {
    method: 'delete',
    headers: {
      Authorization: `bearer ${createServiceToken()}`,
    },
  });

  return response;
};

// Delete the Telescope users we created in the Users service.
const deleteUsers = async (users) => Promise.all(users.map((user) => deleteUser(user)));

module.exports.USERS_URL = USERS_URL;
module.exports.getUser = getUser;
module.exports.getUsers = getUsers;
module.exports.getUsersPaginated = getUsersPaginated;
module.exports.createUsers = createUsers;
module.exports.postUser = postUser;
module.exports.postUsers = postUsers;
module.exports.putUser = putUser;
module.exports.deleteUser = deleteUser;
module.exports.deleteUsers = deleteUsers;
