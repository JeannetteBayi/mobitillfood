"use strict";

let { QueryPointError } = require("querypoint");
let { hashPassword, extractPasswordSalt } = require("../../util");
let { knex, stampTime } = require("../database/db");
let session = require("../database/session");
let { randomBigInt } = require("../../util");

async function userExists(id) {
  let s = await knex("users").where("id", id);
  if (s.length === 0) return false;
  return true;
}

async function createUser(obj) {
  hashPassword(obj);
  obj.id = randomBigInt();

  // check if a user of similar email exists
  let existing = await knex("users").where("email", obj.email);
  if (existing.length !== 0) {
    // shida!!!
    throw new QueryPointError(`oops! user already exists`);
  }
  // save and return
  let model = await knex("users").insert(stampTime(obj, true));

  let r = Object.assign({}, obj);
  r.password = null;
  return r;
}

async function loginUser(obj) {
  // check if a user of similar email exists
  let existing = await knex("users").where("email", obj.email);
  if (existing.length === 0) {
    throw new QueryPointError(`wrong username or password`, 401);
  }
  let u = existing[0];
  let salt = extractPasswordSalt(u.password);

  let received = hashPassword({ password: obj.password }, salt);
  if (received.password === u.password) {
    return await session.generate(Object.assign({}, u, { password: null }));
  } else {
    throw new QueryPointError(`wrong username or password`);
  }
}

module.exports = {
  userExists,
  loginUser,
  createUser
};
