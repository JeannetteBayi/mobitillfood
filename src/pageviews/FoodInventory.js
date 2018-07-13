// @flow

import React from "react";
import { observer } from "mobx-react";
import SectionHeader from "./SectionHeader";
import { redirect } from "../routing/Router";

import Form from "../components/FormFromObject";
import AutoTable from "../components/Table";

@observer
class NewCashier extends React.PureComponent {
  async submitted(data) {
    let d = await this.props.store.createNew(data);
    if (d) {
      redirect("/cashiers");
    }
  }
  stub() {
    let s = {
      name: "String",
      phone: "String",
      password: "String",
      roles: "String"
    };
    return s;
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
class CashierList extends React.PureComponent {
  rowClick(e: Event, data) {}
  render() {
    return (
      <div className="list">
        <AutoTable
          onRowClick={this.rowClick.bind(this)}
          headers={["product", "quantity" ]}
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
export default class Cashier extends React.Component {
  constructor(props) {
    super(props);

    this.onAdd = this.onAdd.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }
  onHome(e: Event) {
    redirect("/cashiers");
  }
  onAdd(e: Event) {
    redirect("/cashiers/create");
  }
  onEdit(e: Event) {}
  onDelete(e: Event) {}
  renderPage() {
    let o = this.props.params.option;
    switch (o) {
      case "create":
        return <NewCashier store={this.props.store} />;
      default:
        return <CashierList store={this.props.store} />;
    }
    return null;
  }
  render() {
    return (
      <div className="page">
        <header>Food Inventory - {this.props.store.org.name}</header>
        <div></div>
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
