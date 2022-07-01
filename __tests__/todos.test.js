const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Todo = require('../lib/models/Todo');

const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '123456',
};
const mockUser2 = {
  firstName: 'Test',
  lastName: 'User 2',
  email: 'test2@example.com',
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

describe('todos routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('GET /api/v1/todos returns all todos associated with specific authenticated User', async () => {
    const [agent, user] = await SignUpAndLogin();
    const user2 = await UserService.create(mockUser2);
    const user1Todo = await Todo.insert({
      task_name: 'make breakfast',
      completed: true,
      user_id: user.id,
    });
    await Todo.insert({
      task_name: 'do laundry',
      completed: false,
      user_id: user2.id,
    });
    const resp = await agent.get('/api/v1/todos');
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual([user1Todo]);
  });

  it('GET /api/v1/todos should return a 401 if not the user is not authenticated', async () => {
    const resp = await request(app).get('/api/v1/todos');
    expect(resp.status).toEqual(401);
  });

  it('POST /api/v1/todos creates a new todo for the current user', async () => {
    const [agent, user] = await SignUpAndLogin();
    const newTodo = { task_name: 'cook', completed: false };
    const resp = await agent.post('/api/v1/todos').send(newTodo);
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      task_name: newTodo.task_name,
      completed: false,
      user_id: user.id,
    });
  });

  it('PUT /api/v1/todos/:id should update a todo', async () => {
    const [agent, user] = await SignUpAndLogin();
    const todo = await Todo.insert({
      task_name: 'brush teeth',
      user_id: user.id,
      completed: false,
    });
    const resp = await agent
      .put(`/api/v1/todos/${todo.id}`)
      .send({ completed: true });
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({ ...todo, completed: true });
  });

  it('PUT /api/v1/todos/:id should 403 for invalid users', async () => {
    const [agent] = await SignUpAndLogin();
    const user2 = await UserService.create(mockUser2);
    const todo = await Todo.insert({
      task_name: 'go exercise',
      completed: false,
      user_id: user2.id,
    });
    const resp = await agent
      .put(`/api/v1/todos/${todo.id}`)
      .send({ completed: true });
    expect(resp.status).toBe(403);
  });
});
