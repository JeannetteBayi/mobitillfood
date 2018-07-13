"use strict";

const { QueryPointError } = require("querypoint");
const { knex } = require("../database/db");

let devicesTable = "devices";

async function orgDevices(org) {
  let device = await knex(devicesTable).where("organization_id", org.id);
  return device;
}

module.exports = {
  orgDevices
};
