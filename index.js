"use strict";

const path = require("path");
const LL = require("leafless");
const querypoint = require("querypoint");

const methods = require("./lib/querypoint/methods");
const queries = require("./lib/querypoint/queries");
const { log } = require("./lib/config");
const staticServe = require("./lib/static");

const orderReports = require("./lib/reports/orders");

const app = new LL();
const PORT = 9000;

let spaHandler = {
  async get(ctx) {
    ctx.response.sendFile(path.join(process.cwd(), "dist/index.html"));
  }
};

// =========== querypoint ==============
querypoint.init(app, { apiVersion: 1 });
// load querypoint schemas
querypoint.methods
  .registerSchema(
    path.join(process.cwd(), "lib/querypoint/schemas/mutations.gql")
  )
  .then(() => {
    // add methods
    return methods.loadMethods(querypoint);
  })
  .catch(err => {
    console.error(err);
  });

querypoint.queries.registerSchema(
  path.join(process.cwd(), "lib/querypoint/schemas/queries.gql")
);
queries.load(querypoint);

// =========== querypoint ==============

staticServe("/static", "dist", app);

app.route("/", spaHandler);
app.route("/reports/orders", orderReports);
// app.route("/*", spaHandler);

console.log(`starting on port ${PORT}`);
app.listen(PORT);
