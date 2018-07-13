"use strict";

const crypto = require("crypto");

let container = {};

exports.generate = async function generate(user) {
  let key = [
    crypto.randomBytes(32).toString("hex"),
    user.id,
    new Date().getTime()
  ];
  let str = JSON.stringify(key);
  container[str] = user;
  return { key: str };
};

exports.get = async function get(key) {
  return container[key];
};
