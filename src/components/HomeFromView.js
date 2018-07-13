"use strict";

import React from "react";
import ArrowLeft from "../svg/left-arrow.svg";

import { Link, redirect } from "../routing/Router";

export default class HomeFromView extends React.Component {
  go() {
    redirect("/");
  }
  render() {
    return (
      <div className="wrapper" onClick={this.go}>
        <ArrowLeft width={26} height={26} />

        <style jsx>
          {`
            .wrapper {
              display: inline-block;
              margin-right: 15px;
              cursor: pointer;
            }
          `}
        </style>
      </div>
    );
  }
}
