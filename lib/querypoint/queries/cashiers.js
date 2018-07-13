"use strict";

const { QueryPointError } = require("querypoint");
const { knex } = require("../database/db");

let cashiersTable = "cashiers";

async function orgCashiers(org) {
  let device = await knex(cashiersTable).where("organization_id", org.id);
  return device;
}

module.exports = {
  orgCashiers
};
