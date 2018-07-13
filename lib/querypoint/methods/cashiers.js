"use strict";

const { QueryPointError } = require("querypoint");
const { knex, stampTime } = require("../database/db");
const { randomBigInt } = require("../../util");
const { userExists } = require("./users");

const orgTable = "organizations";
const cashiersTable = "cashiers";

// check if an organization cashier exists
async function cashierExists(organization_id, id) {
  let s = await knex(cashiersTable).where({ organization_id, id });
  if (s.length === 0) return false;
  return true;
}

// check if an organization cashier exists
async function cashierExistsPhone(organization_id, phone) {
  let s = await knex(cashiersTable).where({ organization_id, phone });
  if (s.length === 0) return false;
  return true;
}

// create a new device
async function create(cashier) {
  cashier.id = randomBigInt();
  let de = await cashierExistsPhone(cashier.organization_id, cashier.phone);
  if (de)
    throw new QueryPointError(`cashier with ${cashier.phone} already exists`);
  
  let n = await knex(cashiersTable).insert(stampTime(cashier, true));
  return cashier;
}


//deleting a cashier
async function deleteCashier(cashier) {
  let cashierDta =await knex(cashiersTable).where({ organization_id: cashier.organization_id, id: cashier.id });
  if (cashierData[0]!= undefined) {
    let delTime = await knex(cashiersTable).where({ organization_id: cashier.organization_id, id: cashier.id })
      .select('deleted_at');
    if (delTime[0].deleted_at == null) {
      let cash = await knex(cashiersTable).where({ organization_id: cashier.organization_id, id: cashier.id })
        .update({ deleted_at:  new Date() });
    }
    else throw new QueryPointError(`cashier with ${cashier.id} has been already deleted`);
  }
  else throw new QueryPointError(`cashier with ${cashier.id}  for organization ${cashier.organization_id} does not exists`);

}

//updating cashier
async function updateCashier(cashier) {
  let cashierData = await knex(cashiersTable).where({ organization_id: cashier.organization_id, id: cashier.id })
  if (cashierData[0] != undefined) {
    let cash = await knex(cashiersTable).where({ organization_id: cashier.organization_id, id: cashier.id })
      .update({
        name: cashier.name, phone: cashier.phone, password: cashier.password, roles: cashier.roles,
        deleted_at: cashier.deleted_at


      });
  }
  else throw new QueryPointError(`cashier with  Id ${cashier.id} for organization ${cashier.organization_id} does not exists`);
}



module.exports = {
  cashierExists,
  create, 
  deleteCashier,
  updateCashier
};
