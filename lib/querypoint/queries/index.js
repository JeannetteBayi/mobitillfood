"use strict";

const users = require("./users");
const org = require("./organizations");
const devices = require("./devices");
const cashiers = require("./cashiers");
const products = require("./products");
const orders = require("./orders");

let queries = {
  User: {
    organizations: org.userOrgs
  },
  Organization: {
    devices: devices.orgDevices,
    cashiers: cashiers.orgCashiers,
    products: products.orgProducts,
    orders: orders.orgOrders
  },
  Order:  {
    products: orders.productOrders
  },
  Query: {
    users: users.all,
    viewer: users.fromID,
    organization: org.fetchOrg
  }
};

exports.load = function(querypoint) {
  querypoint.queries.addImplementation(queries);
};
