"use strict";

import { request, wrapError } from "./backend";

const orderReportURL = "/reports/orders";

async function ordersReport(query = {}) {
  let organization_id = localStorage.getItem("active-org");
  query = Object.assign(query, { organization_id });

  try {
    let req = request(orderReportURL, "POST", query);
    let data = await wrapError(req);
    return data;
  } catch (err) {
    console.log(err);
  }
}

export { ordersReport };
