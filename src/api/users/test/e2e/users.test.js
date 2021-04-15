const getUsersResponse = require('./getUsersResponse.json');

const { hash } = require('@senecacdot/satellite');

const {
  getUser,
  getUsersPaginated,
  createUsers,
  postUser,
  postUsers,
  putUser,
  deleteUser,
  deleteUsers,
} = require('./utils');

describe('GET REQUESTS', () => {
  const NUMBER_OF_USERS = 50;
  let allUsers = [];

  beforeAll(async () => {
    allUsers = createUsers(NUMBER_OF_USERS);
    await postUsers(allUsers);
  });

  afterAll(async () => {
    await deleteUsers(allUsers);
  });

  it('should get default number of users, /', async () => {
    // pagination is defaulted to 20 when no query is supplied
    // see models\schema.js
    const response = await getUsersPaginated();
    const users = await response.json();

    expect(response.headers.get('link')).toBe(
      '<http://localhost/v1/users?start_after=71e7a5cacc&per_page=20>; rel=next'
    );

    expect(users).toEqual(getUsersResponse);
    expect(users.length).toBe(20);
    expect(response.status).toBe(200);
  });

  it('should get all users, paginated', async () => {
    // start after user TelescopeUser31, at index 3
    const response = await getUsersPaginated(
      `?per_page=5&start_after=${hash('TelescopeUser31@email.com')}`
    );
    const users = await response.json();

    expect(response.headers.get('link')).toBe(
      `<http://localhost/v1/users?start_after=${hash(
        'TelescopeUser22@email.com'
      )}&per_page=5>; rel=next`
    );
    expect(users).toEqual(getUsersResponse.slice(4, 9));
    expect(users.length).toBe(5);
    expect(response.status).toBe(200);
  });

  it('should return 404 if the user does not exist', async () => {
    const response = await getUser({ email: 'nonexistent@email.com' });
    expect(response.status).toBe(404);
  });

  it('should 400, rejected by negative per_page', async () => {
    // start_after does not matter, middleware should reject regardless
    const response = await getUsersPaginated('?per_page=-5');
    const users = await response.json();
    expect(response.status).toBe(400);
    expect(users.validation.query.message).toBe('"per_page" must be greater than or equal to 1');
  });
});

describe('POST REQUESTS', () => {
  let galileo;

  beforeEach(() => {
    galileo = {
      firstName: 'Galileo',
      lastName: 'Galilei',
      email: 'galileo@email.com',
      displayName: 'Sir Galileo Galilei',
      isAdmin: true,
      isFlagged: true,
      feeds: ['https://dev.to/feed/galileogalilei'],
      github: {
        username: 'GalileoGalilei',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };
  });

  it('should not post a user with missing first name info', async () => {
    delete galileo.firstName;
    const response = await postUser(galileo);
    const parsedResponse = await response.json();

    expect(parsedResponse.statusCode).toBe(400);
    expect(parsedResponse.validation.body.message).toBe('"firstName" is required');

    await deleteUser(galileo);
  });

  it('should not post a user with missing last name info', async () => {
    delete galileo.lastName;
    const response = await postUser(galileo);
    const parsedResponse = await response.json();

    expect(parsedResponse.statusCode).toBe(400);
    expect(parsedResponse.validation.body.message).toBe('"lastName" is required');

    await deleteUser(galileo);
  });

  it('should not allow the same user to be posted twice', async () => {
    await postUser(galileo);
    const response = await postUser(galileo);
    const parsedResponse = await response.text();

    expect(response.status).toBe(400);
    expect(parsedResponse).toBe('<h1>400 Error</h1><p>user with id 33093c53dd already exists.</p>');

    await deleteUser(galileo);
  });

  it('user feed array should only contain URI strings', async () => {
    const response = await postUser({ ...galileo, feeds: [123] });
    const parsedResponse = await response.json();

    expect(parsedResponse.statusCode).toBe(400);
    expect(parsedResponse.validation.body.message).toBe('"feeds[0]" must be a string');

    await deleteUser(galileo);
  });
});

describe('PUT REQUESTS', () => {
  it('should update a single user', async () => {
    const carlSagan = {
      firstName: 'Carl',
      lastName: 'Sagan',
      email: 'carl_sagan@email.com',
      displayName: 'Carl Sagan',
      isAdmin: false,
      isFlagged: false,
      feeds: ['https://dev.to/feed/carlSagan'],
      github: {
        username: 'carlSagan',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };
    await postUser(carlSagan);

    const putResponse = await putUser({ ...carlSagan, firstName: 'Nick' });
    const responseMessage = await putResponse.json();

    expect(putResponse.status).toBe(200);
    expect(responseMessage.msg).toBe(`Updated user ${hash(carlSagan.email)}`);

    const user = await getUser(carlSagan);
    const parsedUser = await user.json();

    expect(parsedUser).toEqual({ ...carlSagan, firstName: 'Nick' });
  });

  it('update a non-existing user', async () => {
    const nonExistingUser = {
      firstName: 'nobody',
      lastName: 'nobody',
      email: 'IdontExist@email.com',
      feeds: ['https://dev.to/feed/nobody'],
    };

    const putResponse = await putUser(nonExistingUser);
    const responseMessage = await putResponse.text();

    expect(putResponse.status).toBe(404);
    expect(responseMessage).toBe(
      `<h1>404 Error</h1><p>user ${hash(nonExistingUser.email)} not found.</p>`
    );
  });
});
