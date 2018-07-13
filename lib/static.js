"use strict";

const path = require("path");

function routes(str) {
  if (!str || typeof str !== "string")
    throw new Error("expecting route to be a string");
  if (!str.startsWith("/")) str = "/" + str;
  if (!str.endsWith("/")) str = str + "/";

  return [str, `${str}*`];
}

function filenamef(route, dir, pathname) {
  if (pathname === route) {
    pathname = "index.html";
  } else {
    pathname = pathname.split(route)[1];
  }
  let d = path.join(process.cwd(), dir);
  let f = path.join(d, pathname);
  return f;
}

module.exports = function(route, dir, app) {
  let r = routes(route);
  let handler = {
    async get(ctx) {
      let filename = filenamef(route, dir, ctx.parsedUrl.pathname);
      ctx.response.sendFile(filename);
    }
  };

  app.route(r[0], handler);
  app.route(r[1], handler);
};
