"use strict";

const { QueryPointError } = require("querypoint");
const { knex, stampTime } = require("../database/db");
const { randomBigInt } = require("../../util");
const { userExists } = require("./users");

const orgTable = "organizations";
const deviceTable = "devices";

// check if an organization device exists
async function deviceExists(organization_id, serial) {
  let s = await knex(deviceTable).where({ organization_id, serial });
  if (s.length === 0) return false;
  return true;
}

// create a new device
async function create(device) {
  device.id = randomBigInt();
  let de = await deviceExists(device.organization_id, device.serial);
  if (de)
    throw new QueryPointError(`device serial ${device.serial} already exists`);
  
  let n = await knex(deviceTable).insert(stampTime(device));
  return device;
}

//deleting a device
async function deleteDevice(device) {
  let deviceData = await knex(deviceTable).where({ organization_id: device.organization_id, id: device.id })
  if (deviceData[0] != undefined) {

    let delTime = await knex(deviceTable).where({ organization_id: device.organization_id, id: device.id })
      .select('deleted_at');
    if (delTime[0].deleted_at == null) {
      let del = await knex(deviceTable).where({ organization_id: device.organization_id,  id: device.id })
        .update({ deleted_at: new Date });
    }
    else throw new QueryPointError(`device with ${device.id} has been already deleted`);
  }
  else throw new QueryPointError(`device with ${device.id} does not exist`);
}

//updating device
async function updateDevice(device) {
  let deviceData = await knex(deviceTable).where({ organization_id: device.organization_id, id: device.id })
  if (deviceData[0] != undefined) {
    let up = await knex(deviceTable).where({ organization_id: device.organization_id, id: device.id })
      .update({ serial: device.serial, name: device.name, deleted_at: device.deleted_at });
  }
  else throw new QueryPointError(`device with ${device.id} for organization ${device.organization_id} does not exist`);
}

module.exports = {
  deviceExists,
  create,
  deleteDevice,
  updateDevice
};
