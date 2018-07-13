// @flow

import React from "react";
import { observable, computed } from "mobx";

import { redirect } from "../routing/Router";
import { request, wrapError, exec } from "../util/backend";
import { singleNote } from "../stores/Notifications";

class UserStore {
  @observable session: ?string;
  // @observable selectedOrg: ?string;

  constructor() {
    this.session = null;
    this.checkUser();
  }
  @computed
  get selectedOrg() {
    let org = localStorage.getItem("active-org");
    return org ? org : null;
  }
  @computed
  get selectedOrgData() {
    let data = localStorage.getItem("active-org-meta") || "{}";
    return JSON.parse(data);
  }
  @computed
  get userID() {
    if (typeof this.session === "string") {
      return JSON.parse(this.session)[1];
    }
  }
  checkUser() {
    let v = localStorage.getItem("loggedin");
    if (v) {
      this.session = v;
    }
  }
  async loginUser(email: string, password: string) {
    let res = await exec("loginUser")({ email, password });
    if (res) {
      localStorage.setItem("loggedin", res.data.key);
      localStorage.setItem("loggedin-email", email);
      this.checkUser();
      redirect("/");
    }
  }

  async createUser(email: string, password: string) {
    await exec("createUser")({ email, password });
    redirect("/accounts/login");
  }

  async logout() {
    localStorage.setItem("loggedin", JSON.stringify(null));
    redirect("/accounts/login");
  }
}

var store = new UserStore();

export default store;
export { UserStore };
