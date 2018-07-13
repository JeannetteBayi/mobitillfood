// @flow

import React from "react";
import { observer } from "mobx-react";
import SectionHeader from "./SectionHeader";
import { redirect } from "../routing/Router";

import Form from "../components/FormFromObject";
import AutoTable from "../components/Table";

import HomeFromView from "../components/HomeFromView";

@observer
class NewOrg extends React.PureComponent {
  async submitted(data) {
    await this.props.store.createNew(data);
    redirect("/organizations");
  }
  stub() {
    return { name: "org" };
  }
  render() {
    return (
      <div className="create">
        {Form(this.stub(), this.submitted.bind(this))}

        <style jsx>{`
          .create {
            width: 80%;
            margin: auto;
          }
        `}</style>
      </div>
    );
  }
}

@observer
class OrgList extends React.PureComponent {
  rowClick(e: Event, data) {
    localStorage.setItem("active-org", data.id);
    localStorage.setItem("active-org-meta", JSON.stringify(data));
    redirect("/home");
  }
  render() {
    return (
      <div className="list">
        <AutoTable
          onRowClick={this.rowClick.bind(this)}
          headers={["id", "name"]}
          list={this.props.store.all}
        />
        <style jsx>{`
          .list {
            margin: auto;
          }
        `}</style>
      </div>
    );
  }
}

@observer
export default class Org extends React.Component {
  constructor(props) {
    super(props);

    this.onAdd = this.onAdd.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }
  onHome(e: Event) {
    redirect("/organizations");
  }
  onAdd(e: Event) {
    redirect("/organizations/create");
  }
  onEdit(e: Event) {}
  onDelete(e: Event) {}
  renderPage() {
    let o = this.props.params.option;
    switch (o) {
      case "create":
        return <NewOrg store={this.props.store} />;
      default:
        return <OrgList store={this.props.store} />;
    }
    return null;
  }
  render() {
    return (
      <div className="page">
        <header>
          <HomeFromView />{" "}
          <div style={{ display: "inline-block", padding:5 }}>
            Organizations
          </div>
        </header>
        <SectionHeader
          onHome={this.onHome}
          onDelete={this.onDelete}
          onAdd={this.onAdd}
          onEdit={this.onEdit}
        />
        {this.renderPage()}
        <style jsx>{`
          .page {
            width: 100vw;
          }
          .page header {
            padding-left: 50px;
            font-weight: 400;
            font-size: 1.4em;
            padding-bottom: 29px;
            border-bottom: 1px solid #efefef;
          }
        `}</style>
      </div>
    );
  }
}
