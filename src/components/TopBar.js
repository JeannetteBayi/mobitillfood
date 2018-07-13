// @flow

import React from "react";
import { redirect } from "../routing/Router";

export default class TopBar extends React.PureComponent {
  logout() {
    localStorage.removeItem("loggedin");
    localStorage.removeItem("loggedin-email");
    location.href = "";
  }
  loggedInEmail() {
    let email = localStorage.getItem("loggedin-email");
    return email || "";
  }
  render() {
    return (
      <div className="top-bar">
        <div className="title">
          {this.props.title}
        </div>
        <div className="email">
          {this.loggedInEmail()}

          <div className="logout" onClick={this.logout}><a>logout</a></div>
        </div>
        <style jsx>{`
          .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100vw;
            height: 57px;
            box-shadow: 1px 1px 1px rgba(180, 180, 180, .4);
            margin-bottom: 10px;
          }

          .email {
            margin-right: 10px;
          }
          
          .logout {
            cursor: pointer;
          }

          .title {
            font-weight: bold;
            margin-left: 25px;
            color: #4a148c;
          }
        `}</style>
      </div>
    );
  }
}
