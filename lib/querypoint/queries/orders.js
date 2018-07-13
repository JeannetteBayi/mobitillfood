"use strict";

const { QueryPointError } = require("querypoint");
const { knex } = require("../database/db");

let ordersTable = "orders";
let productOrdersTable = "product_orders";

async function orgOrders(org) {
  let device = await knex(ordersTable).where({
    organization_id: org.id,
    cancelled: false
  });
  return device;
}

async function productOrders(order) {
  let list = await knex(productOrdersTable).where({
    order_id: order.id
  });
  return list;
}

module.exports = {
  orgOrders,
  productOrders
};
