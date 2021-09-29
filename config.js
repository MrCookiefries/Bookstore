/** Common config for bookstore. */

const dbConfig = {
  host: "localhost",
  user: "myuser",
  password: "password",
  database: `bookstore${process.env.NODE_ENV === "test" ? "_test": ""}`
};

module.exports = { dbConfig };
