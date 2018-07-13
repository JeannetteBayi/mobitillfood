"use strict";

const { QueryPointError } = require("querypoint");
const { knex } = require("../database/db");

let productsTable = "products";

async function orgProducts(org) {
  let device = await knex(productsTable).where("organization_id", org.id);
  return device;
}

module.exports = {
  orgProducts
};
