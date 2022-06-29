const pool = require('../utils/pool');

module.exports = class Todo {
  id;
  task_name;
  completed;
  user_id;

  constructor(row) {
    this.id = row.id;
    this.task_name = row.task_name;
    this.user_id = row.user_id;
    this.completed = row.completed;
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      'SELECT * from todos where user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    return rows.map((todo) => new Todo(todo));
  }
};
