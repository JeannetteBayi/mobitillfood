// @flow

import { request, host, wrapError, query, exec } from "../util/backend";
import { observable, computed } from "mobx";

import { singleNote } from "./Notifications";
import userStore from "./users";

class ProductStore {
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
    let p = await exec("productCreate")(data);
    if (p) {
      singleNote.new("info", "product was created.");
      await this.list();
    }
    return p;
  }
  queryString() {
    let q = `query { organization (id: "${userStore.selectedOrg}") { id, products { id, sku, description, category } } }`;
    return q;
  }
  @computed
  get all() {
    if (!this.data) return [];
    return this.data.organization ? this.data.organization.products : [];
  }
  async list() {
    let data = await query(this.queryString());
    this.data = data.data;
  }
}

let store = new ProductStore();
export default store;
export { ProductStore };
