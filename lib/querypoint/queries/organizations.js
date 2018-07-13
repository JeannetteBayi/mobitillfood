"use strict";

const { QueryPointError } = require("querypoint");
const { knex } = require("../database/db");

let organizationsTable = "organizations";

async function fetchOrg(root, args) {
  let org = await knex(organizationsTable).where("id", args.id);
  if (Array.isArray(org)) {
    return org[0];
  }
  return null;
}

async function userOrgs(user) {
  let org = await knex(organizationsTable).where("user_id", user.id);
  return org;
}

module.exports = {
  userOrgs,
  fetchOrg
};
