const pool = require('../utils/pool');

module.exports = class TodoUser {
  id;
  email;
  #passwordHash;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.#passwordHash = row.password_hash;
  }

  static async insert({ email, passwordHash }) {
    const { rows } = await pool.query(
      `
      INSERT INTO todo_users (email, password_hash)
      VALUES ($1, $2)
      RETURNING *
    `,
      [email, passwordHash]
    );

    return new TodoUser(rows[0]);
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM todo_users
      WHERE email=$1
      `,
      [email]
    );

    if (!rows[0]) return null;

    return new TodoUser(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};

// static async getAll() {
//   const { rows } = await pool.query('SELECT * FROM todo_users');

//   return rows.map((row) => new TodoUser(row));
// }

// static async getById(id) {
//   const { rows } = await pool.query(
//     `
//     SELECT *
//     FROM todo_users
//     WHERE id=$1
//     `,
//     [id]
//   );
//   return new TodoUser(rows[0]);
// }
