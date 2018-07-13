"use strict";

let knex;

knex = require("knex")({
  version: "9.4",
  client: "postgres",
 connection: "postgresql://postgres@localhost:5432/mobitillfood?sslmode=disable"
});

function stampTime(o, isNew = false) {
  let obj = Object.assign({}, o); // clone it
  let now = new Date();

  obj.updated_at = now;

  if (isNew) obj.created_at = now;
  return obj;
}

module.exports = {
  knex,
  stampTime
};
