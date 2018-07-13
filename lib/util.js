"use strict";

const crypto = require("crypto");

exports.hashPassword = function hashPassword(obj = {}, salt) {
  if (typeof obj.password !== "string") {
    throw new Error("object must have a password field of type String");
  }
  let one = crypto.createHash("sha1").update(obj.password).digest("hex");
  let two = salt || crypto.randomBytes(20).toString("hex");

  let hash = crypto.createHmac("sha256", one).update(two).digest("hex");

  let arr = `${two},${hash}`;
  obj.password = Buffer.from(arr).toString("hex");
  return obj;
};

exports.extractPasswordSalt = function extractPasswordSalt(pass) {
  let b = Buffer.from(pass, "hex").toString();
  let a = b.split(",");
  return a[0];
}

exports.randomBigInt = function randomBigInt() {
  let len = 15;
  let rn = crypto.randomBytes(15);
  let arr = [];
  for (let i = 0; i < rn.length; i++) {
    arr[i] = rn[i] % 10;
  }
  return Number(arr.join(""));
};
