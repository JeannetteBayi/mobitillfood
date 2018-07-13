"use strict";

const users = require("./users");
const organizations = require("./organizations");
const devices = require("./devices");
const cashiers = require("./cashiers");
const products = require("./products");
const orders = require("./orders");
const payments = require("./payments");

let methods = {
  createUser: users.createUser,
  loginUser: users.loginUser,
  organizationCreate: organizations.create,
  deviceCreate: devices.create,
  cashierCreate: cashiers.create,
  productCreate: products.create,
  orderCreate: orders.create,
  orderCancel: orders.cancel,
  paymentCreate: payments.create
};

async function loadMethods(querypoint) {
  let names = Object.keys(methods);
  names.forEach(name => {
    if (methods.hasOwnProperty(name)) {
      querypoint.methods.addMethod(name, methods[name]);
    }
  });
}

exports.loadMethods = loadMethods;
