"use strict";

const { QueryPointError } = require("querypoint");
const { knex } = require("../database/db");

let usersTable = "users";

async function all() {
  let users = await knex(usersTable).select("id", "email", "created_at");
  return users;
}

async function fromID(root, args) {
  if(!args.id) return null;
  let u = await knex(usersTable).select("id", "email").where("id", args.id);
  return u[0];
}

module.exports = {
  all,
  fromID
}