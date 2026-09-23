const db = require("../config/db");

const findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email=$1", [email]);

  return result.rows;
};

const createUser = async (name, email, password) => {
  await db.query(
    `INSERT INTO users(name,email,password)
        VALUES($1,$2,$3)`,
    [name, email, password],
  );
};

module.exports = {
  findUserByEmail,
  createUser,
};
