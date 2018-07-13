"use strict";

const { QueryPointError } = require("querypoint");
const { knex, stampTime } = require("../database/db");
const { randomBigInt } = require("../../util");
const { userExists } = require("./users");

const orgTable = "organizations";

async function exists(id) {
  let s = await knex(orgTable).where("id", id);
  if (s.length === 0) return false;
  return true;
}

async function create(dat) {
  dat.id = randomBigInt(); // add ID;
  let uexists = await userExists(dat.user_id);
  if (!uexists)
    throw new QueryPointError(`user id ${dat.user_id} does not exist`);

  let c = await knex(orgTable).insert(stampTime(dat));
  return dat;
}

module.exports = {
  exists,
  create
}
