"use strict";

let chrono = require("chrono-node");
let { knex } = require("../querypoint/database/db");

class ReportError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

function handleError(err, ctx) {
  if (err instanceof ReportError) {
    ctx.response.status(err.statusCode);
    ctx.response.json({ error: err.message });
  } else {
    ctx.response.status(500);
    ctx.response.json({ error: "internal server error " });
    console.error(err);
  }
}

// generate reports on orders
let handler = {
  async post(ctx) {
    try {
      let body = await ctx.request.json();
      let p = chrono.parse(body.daterange);
      let p0 = p[0];
      if (!p0.start || !p0.end) {
        throw new ReportError("please enter a valid date range");
      }

      let startDate = p0.start.date();
      let endDate = p0.end.date();

      let range = [new Date(startDate), new Date(endDate)];

      // remove daterange from the object
      delete body.daterange;

      let q = knex("orders").select([
        "orders.id as order_id",
        "orders.timestamp",
        "products.description as product",
        "product_orders.units",
        "product_orders.amount_total",
        "cashiers.name as cashier"
      ]);

      q = q.innerJoin("product_orders", "orders.id", "product_orders.order_id");
      q = q.innerJoin("products", "product_orders.product_id", "products.id");
      q = q.innerJoin("cashiers", "orders.cashier_id", "cashiers.id");

      for (let key in body) {
        let value = body[key];
        if (value !== null) {
          q = q.where(`orders.${key}`, value);
        }
      }

      q = q.whereBetween("timestamp", range);
      q = q.orderBy("timestamp");
      let res = await q;
      ctx.response.json(res);
    } catch (err) {
      handleError(err, ctx);
    }
  }
};

module.exports = handler;
