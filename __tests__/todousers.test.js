const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

const SignUpAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  const agent = request.agent(app);

  const user = await UserService.create({ ...mockUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('users routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  it('signs in a user and creates cookie', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send(mockUser);
    expect(res.body.message).toEqual('Signed In!');
  });

  it('returns an authenticated user', async () => {
    const [agent, user] = await SignUpAndLogin();
    const me = await agent.get('/api/v1/users/me');
    expect(me.body).toEqual;
    ({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });
});
