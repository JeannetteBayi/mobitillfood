// @flow

import React from "react";
import { observer } from "mobx-react";
import SectionHeader from "./SectionHeader";
import { redirect } from "../routing/Router";

import Form from "../components/FormFromObject";
import AutoTable from "../components/Table";

import HomeFromView from "../components/HomeFromView";

@observer class NewProduct extends React.PureComponent {
  async submitted(data) {
    await this.props.store.createNew(data);
    redirect("/products");
  }
  stub() {
    let s = {
      sku: 10,
      description: "String",
      location: "String",
      price: 100.23
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

@observer class ProductList extends React.PureComponent {
  rowClick(e: Event, data) {}
  render() {
    return (
      <div className="list">
        <AutoTable
          onRowClick={this.rowClick.bind(this)}
          headers={["sku", "description", "category"]}
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
export default class Product extends React.Component {
  constructor(props) {
    super(props);

    this.onAdd = this.onAdd.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }
  onHome(e: Event) {
    redirect("/products");
  }
  onAdd(e: Event) {
    redirect("/products/create");
  }
  onEdit(e: Event) {}
  onDelete(e: Event) {}
  renderPage() {
    let o = this.props.params.option;
    switch (o) {
      case "create":
        return <NewProduct store={this.props.store} />;
      default:
        return <ProductList store={this.props.store} />;
    }
    return null;
  }
  render() {
    return (
      <div className="page">
        <header>
          <HomeFromView />{" "}
          <div style={{ display: "inline-block", padding:5 }}>
            Products - {this.props.store.org.name}
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
