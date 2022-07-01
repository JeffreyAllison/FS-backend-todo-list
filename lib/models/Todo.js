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

  static async updateById(id, attrs) {
    const todo = await Todo.getById(id);
    if (!todo) return null;
    const { task_name, completed } = { ...todo, ...attrs };
    const { rows } = await pool.query(
      `
      UPDATE todos 
      SET task_name=$2, completed=$3
      WHERE id=$1 RETURNING *`,
      [id, task_name, completed]
    );
    return new Todo(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM todos
      WHERE id=$1
      `,
      [id]
    );
    if (!rows[0]) {
      return null;
    }
    return new Todo(rows[0]);
  }

  static async insert({ task_name, completed, user_id }) {
    const { rows } = await pool.query(
      `
      INSERT INTO todos (task_name, completed, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [task_name, completed, user_id]
    );

    return new Todo(rows[0]);
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      'SELECT * from todos where user_id = $1',
      [user_id]
    );
    return rows.map((todo) => new Todo(todo));
  }
};
