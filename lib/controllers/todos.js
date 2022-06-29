const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorizeTodo = require('../middleware/authorizeTodo');
const Todo = require('../models/Todo');

module.exports = Router().get('/', authenticate, async (req, res, next) => {
  try {
    const Todos = await Todo.getAll(req.user.id);
    res.json(Todos);
  } catch (e) {
    next(e);
  }
});
