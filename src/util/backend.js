// @flow
"use strict";

import "whatwg-fetch";

import { singleNote } from "../stores/Notifications";

export function host() {
  return window.location.host;
}

export function wrapError(req: Promise<Response>) {
  return req.then(async response => {
    if (response.status >= 200 && response.status < 399) {
      // success ranges
      return await response.json();
    }
    if (response.status === 403) {
      throw new Error("not authenticated");
    }
    if (response.status === 400) {
      let j  = await response.json();
      singleNote.new("error", j.error);
      return;
    }
    let json = await response.json();
    if (json.msg) {
      throw new Error(json.msg);
      // singleNote.new("error", json.msg);
    }
    return null;
  });
}

export function request(
  url: string,
  method: ?string,
  data: ?Object,
  headers: ?Object
) {
  let fetchOptions: Object = {};

  // some default headers
  let defaultHeaders = {
    "Content-Type": "application/json"
  };
  // method
  fetchOptions.method = method || "GET";
  // headers
  fetchOptions.headers = Object.assign(defaultHeaders, headers || {});
  if (data) fetchOptions.body = JSON.stringify(data);
  return fetch(url, fetchOptions);
}

export function exec(name: string) {
  return async function(params: Object) {
    try {
      let res = await wrapError(
        request("/v1/mutations", "POST", { name, params })
      );
      if (res) {
        console.log(res);
        return res;
      }
      return null;
    } catch (err) {
      singleNote.new("error", "could not send request");
    }
  };
}

export async function query(query, params) {
  try {
    let res = await request("/v1/graphql", "POST", { query, params });
    if (res.status === 200) {
      return await res.json();
    }
    let err = await res.json();
    singleNote.new("error", err.error);
    return null;
  } catch (err) {
    singleNote.new("error", "could not send request");
  }
}
