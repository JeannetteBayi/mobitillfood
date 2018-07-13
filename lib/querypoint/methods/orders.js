"use strict";

const { QueryPointError } = require("querypoint");
const Validator = require("jsonschema").Validator;
const v = new Validator();

const { knex, stampTime } = require("../database/db");
const { randomBigInt } = require("../../util");

const { deviceExists } = require("./devices");
const { userExists } = require("./users");
const { cashierExists } = require("./cashiers");
const { productExists } = require("./products");
const org = require("./organizations");

const orgTable = "organizations";
const productTable = "products";
const ordersTable = "orders";
const productOrdersTable = "product_orders";

const orderSchema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  definitions: {},
  title: "order",
  properties: {
    amount: { type: "number" },
    id: { type: "string" },
    device_serial: { type: "string" },
    cashier_id: { type: "string" },
    organization_id: { type: "string" },
    products: {
      items: {
        properties: {
          amount_per_unit: { type: "number" },
          amount_total: { type: "number" },
          product_id: { type: "string" },
          units: { type: "integer" }
        },
        required: ["units", "amount_per_unit", "product_id", "amount_total"],
        type: "object"
      },
      type: "array"
    },
    timestamp: {
      format: "date-time",
      type: "string"
    }
  },
  required: [
    "timestamp",
    "amount",
    "products",
    "id",
    "device_serial",
    "cashier_id",
    "organization_id"
  ],
  type: "object"
};

async function orderExists(order_id) {
  let s = await knex(ordersTable).where({ id: order_id });
  if (s.length === 0) return false;
  return true;
}

async function prepareProductOrders(orderID, products, transaction) {
  let p = products.map(pr => {
    let product = Object.assign({}, pr);
    product.order_id = orderID;
    product.id = randomBigInt();
    let stamped = stampTime(product, true);
    return stamped;
  });

  return p;
}

async function startOrder(order) {
  return knex.transaction(async function runOrder(trx) {
    let productOrders = await prepareProductOrders(
      order.id,
      order.products,
      trx
    );

    let setOrder = {
      id: order.id,
      organization_id: order.organization_id,
      device_serial: order.device_serial,
      cashier_id: order.cashier_id,
      amount: order.amount,
      timestamp: order.timestamp,
      payed: false,
      cancelled: false
    };

    let ins = await trx.insert(stampTime(setOrder, true)).into(ordersTable);
    let po = await trx.insert(productOrders).into(productOrdersTable);
    return setOrder;
  });
}

async function create(order) {
  let valid = v.validate(order, orderSchema);
  if (Array.isArray(valid.errors) && valid.errors.length > 0) {
    throw new QueryPointError(valid.errors[0].stack);
  }
  let instance = valid.instance;
  // check if organization exists
  let org_exists = await org.exists(instance.organization_id);
  if (org_exists !== true)
    throw new QueryPointError(`organization with that id does not exist`);

  // check if device exists
  let device_exists = await deviceExists(
    instance.organization_id,
    instance.device_serial
  );
  if (device_exists !== true)
    throw new QueryPointError(`device with that serial number does not exist`);

  // check if cashier exists
  let cashier_exists = await cashierExists(
    instance.organization_id,
    instance.cashier_id
  );
  if (cashier_exists !== true)
    throw new QueryPointError(`cashier with that id does not exist`);

  let go;
  try {
    go = await startOrder(instance);
  } catch (err) {
    console.error(err);
    if (err.routine) throw new QueryPointError(err.routine);
    throw err;
  }
  return go;
}

let cRSchema = {
  type: "object",
  properties: {
    order_id: { type: "string" }
  },
  required: ["order_id"]
};

async function cancel(cancelRequest) {
  let valid = v.validate(cancelRequest, cRSchema);
  if (Array.isArray(valid.errors) && valid.errors.length > 0) {
    throw new QueryPointError(valid.errors[0].stack);
  }
  let instance = valid.instance;
  let l = await knex(ordersTable).where("id", instance.order_id);
  if (l.length === 0)
    throw new QueryPointError(`order ${instance.order_id} does not exist`);

  let update = await knex(ordersTable)
    .update({ cancelled: true })
    .where("id", instance.order_id);

  return { order_id: instance.order_id, cancelled: true };
}

module.exports = {
  exists: orderExists,
  create,
  cancel
};
