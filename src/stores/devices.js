// @flow

import { request, host, wrapError, query, exec } from "../util/backend";
import { observable, computed } from "mobx";

import { singleNote } from "./Notifications";
import userStore from "./users";

class DeviceStore {
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
    let d = await exec("deviceCreate")(data);
    if (d) {
      singleNote.new("info", "device was created.");
      await this.list();
    }
    return d;
  }
  queryString() {
    let q = `query { organization (id: "${userStore.selectedOrg}") { id, devices { id, serial, name } } }`;
    return q;
  }
  @computed
  get all() {
    if (!this.data) return [];
    return this.data.organization ? this.data.organization.devices : [];
  }
  async list() {
    let data = await query(this.queryString());
    this.data = data.data;
  }
}

let store = new DeviceStore();
export default store;
export { DeviceStore };
