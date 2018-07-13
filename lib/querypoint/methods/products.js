"use strict";

const { QueryPointError } = require("querypoint");
const { knex, stampTime } = require("../database/db");
const { randomBigInt } = require("../../util");
const { userExists } = require("./users");
const org = require("./organizations");

const orgTable = "organizations";
const productTable = "products";

async function productExists(organization_id, id) {
  let s = await knex(productTable).where({ organization_id, id });
  if (s.length === 0) return false;
  return true;
}

async function skuExists(organization_id, sku) {
  let s = await knex(productTable).where({ organization_id, sku });
  if (s.length === 0) return false;
  return true;
}

async function create(product) {
  product.id = randomBigInt();
  let exists = await skuExists(product.organization_id, product.sku);
  if (exists) throw new QueryPointError("product sku already exists");
  let orgExists = await org.exists(product.organization_id);
  if (!orgExists) throw new QueryPointError("that organization does not exist");

  let n = await knex(productTable).insert(stampTime(product, true));
  return product;
}

//deleting a product
async function deleteProduct(product) {
  let productData=await knex(productTable).where({ organization_id: product.organization_id, id: product.id })
  if (productData[0] !=undefined) {
    let delTime = await knex(productTable).where({ organization_id: product.organization_id, id: product.id })
      .select('deleted_at');

    if (delTime[0].deleted_at == null) {
      let del = await knex(productTable).where({ organization_id: product.organization_id, id: product.id })
        .update({ deleted_at: new Date });
    }
    else throw new QueryPointError(`product  with ${product.id} has been already deleted before`);
  }
  else throw new QueryPointError(`product  with ${product.id} does not exist`);
}

//updating a product
async function updateProduct(product) {
  let productData = await knex(productTable).where({ organization_id:  product.organization_id, id: product.id })
  if (productData [0] != undefined) {
    let up = await knex(productTable).where({ organization_id: product.organization_id, id: product.id })
      .update({ sku: product.sku,description: product.description, category: product.category, price: product.price, deleted_at: product.deleted_at
      });
  }
  else throw new QueryPointError(`product ${product.id}  for organization  ${product.organization_id} does not exist`);
}

module.exports = {
  productExists,
  skuExists,
  create,
  deleteProduct,
  updateProduct
};
