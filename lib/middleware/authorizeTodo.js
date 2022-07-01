const Todo = require('../models/Todo');

module.exports = async (req, res, next) => {
  try {
    const todo = await Todo.getById(req.params.id);
    console.log('todo', todo);
    // console.log('user', req.user.id);
    if (!todo || todo.user_id !== req.user.id) {
      throw new Error('You cannot view this page');
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
