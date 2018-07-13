// @flow

import { request, host, wrapError, query, exec } from "../util/backend";
import { observable, computed } from "mobx";

import { singleNote } from "./Notifications";
import userStore from "./users";

class CashierStore {
  // @observable all: Array<Object>
  @observable data: Object;
  constructor() {
    this.userid = userStore.userID;
    this.list();
  }
  @computed
  get org() {
    return userStore.selectedOrgData;
  }
  async createNew(data) {
    data.organization_id = userStore.selectedOrg;
    let d = await exec("cashierCreate")(data);
    if (d) {
      singleNote.new("info", "cashier was created.");
      await this.list();
    }
    return d;
  }
  queryString() {
    let q = `query { organization (id: "${userStore.selectedOrg}") { id, cashiers { id, name, phone } } }`;
    return q;
  }
  @computed
  get all() {
    if (!this.data) return [];
    return this.data.organization ? this.data.organization.cashiers : [];
  }
  async list() {
    let data = await query(this.queryString());
    this.data = data.data;
  }
}

let store = new CashierStore();
export default store;
export { CashierStore };
