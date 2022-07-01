const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorizeTodo = require('../middleware/authorizeTodo');
const Todo = require('../models/Todo');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const todo = await Todo.insert({ ...req.body, user_id: req.user.id });
      res.json(todo);
    } catch (e) {
      next(e);
    }
  })

  .get('/', authenticate, async (req, res, next) => {
    try {
      const Todos = await Todo.getAll(req.user.id);
      res.json(Todos);
    } catch (e) {
      next(e);
    }
  });
