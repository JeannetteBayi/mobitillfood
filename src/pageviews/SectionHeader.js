// @flow

import React, { Component } from "react";
import { Button } from "semantic-ui-react";

import Trashcan from "../svg/octicons/trashcan.svg";
import Plusicon from "../svg/octicons/plus.svg";
import Pencilicon from "../svg/octicons/pencil.svg";
import ThreeBars from "../svg/octicons/three-bars.svg";

// import Octicon from "react-octicon";

export default class SectionHeader extends Component {
  renderHome() {
    return (
      <div>
        <Button primary onClick={this.props.onHome}>
          <div className="octicon">
            <ThreeBars fill="#fff" name="" />
          </div>
          {``}
        </Button>
      </div>
    );
  }
  renderAdd() {
    return (
      <div>
        <Button primary onClick={this.props.onAdd}>
          <div className="octicon">
            <Plusicon fill="#fff" name="" />
          </div>
          {`Add New`}
        </Button>
      </div>
    );
  }
  renderEdit() {
    return (
      <div>
        <Button primary onClick={this.props.onEdit}>
          <div className="octicon">
            <Pencilicon fill="#fff" name="" />
          </div>
          {`Edit`}
        </Button>
      </div>
    );
  }
  renderDelete() {
    return (
      <div>
        <Button primary onClick={this.props.onDelete}>
          <div className="octicon">
            <Trashcan fill="#fff" name="trashcan" />
          </div>
          {`Delete`}
        </Button>
      </div>
    );
  }
  render() {
    return (
      <div className="wrap">
        <div className="section-header">
          {this.renderHome()}
          {this.renderAdd()}
          {this.renderEdit()}
          {this.renderDelete()}

          <style jsx>{`
          .wrap {
            width: 100vw;
          }
          .section-header {
            display: flex;
            width: 80vw;
            height: 100px;
            margin: auto;
            align-items: center;
          }

          .section-header :global(.octicon) {
            display: inline-block;
            margin-right: 10px;
          }

          .section-header :global(.button) {
            background-color: #fff;
            color: #039BE5;
            text-transform: uppercase;
            font-size: 0.75em;
            border: 2px solid #039BE5;
            margin-right: 25px;
          }

          .section-header :global(.button):hover {
            background-color: #fff;
            color: #9E9E9E;
            border: 2px solid #9E9E9E;
          }

          .section-header :global(.button):focus,
          .section-header :global(.button):active {
            background-color: #fff;
            color: #9E9E9E;
            border: 2px solid #9E9E9E;
          }
        `}</style>
        </div>
      </div>
    );
  }
}
