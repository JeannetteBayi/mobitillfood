"use strict";

const { QueryPointError } = require("querypoint");
const Validator = require("jsonschema").Validator;
const v = new Validator();

const { knex, stampTime } = require("../database/db");
const { randomBigInt } = require("../../util");

const order = require("./orders");

const ordersTable = "orders";
const paymentsTable = "payments";

const paymentSchema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  definitions: {},
  title: "order",
  properties: {
    amount: { type: "number" },
    order_id: { type: "string" },
    timestamp: {
      format: "date-time",
      type: "string"
    },
    mode: {
      enum: ["CASH", "CARD", "MPESA"]
    }
  },
  required: ["amount", "order_id", "timestamp", "mode"],
  type: "object"
};

async function create(payment) {
  return knex.transaction(async function runPayment(trx) {
    let valid = v.validate(payment, paymentSchema);
    if (Array.isArray(valid.errors) && valid.errors.length > 0) {
      throw new QueryPointError(valid.errors[0].stack);
    }
    let instance = valid.instance;
    instance.id = randomBigInt();

    let o_exists = await order.exists(instance.order_id);
    if (o_exists !== true) throw new Error(`that order does not exist`);

    let o = await trx.table(ordersTable).update({ payed: true }).where("id", instance.order_id);
    let t = await trx.insert(stampTime(instance, true)).into(paymentsTable);
    return instance;
  });
}

module.exports = {
  create
};
