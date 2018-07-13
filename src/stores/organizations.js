// @flow

import { request, host, wrapError, query, exec } from "../util/backend";
import { observable, computed } from "mobx";

import { Link, redirect } from "../routing/Router";

import { singleNote } from "./Notifications";
import userStore from "./users";

class OrgStore {
  // @observable all: Array<Object>
  @observable data: Object;
  constructor() {
    this.userid = userStore.userID;
    this.list();
  }
  async createNew(data) {
    data.user_id = this.userid;
    let d = await exec("organizationCreate")(data);
    if(d) {
      singleNote.new("info", "new organisation created");
      await this.list()
    }
    return d;
  }
  queryString() {
    let q = `query { viewer(id: "${this.userid}") { organizations { id, name } } }`;
    return q;
  }
  @computed get all() {
    if (!this.data) return [];
    return this.data.viewer ? this.data.viewer.organizations : [];
  }
  async list() {
    let data = await query(this.queryString());
    this.data = data.data;
  }
}

let store = new OrgStore();
export default store;
export { OrgStore };
