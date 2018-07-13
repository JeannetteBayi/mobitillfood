// @flow

import React from "react";
import { observer } from "mobx-react";
import { Dropdown, Input, Button } from "semantic-ui-react";

import { Link, redirect } from "../routing/Router";

import HeaderBar from "../components/HeaderBar";
import AutoTable from "../components/Table";

import BoxIcon from "../svg/box.svg";
import PuzzleIcon from "../svg/puzzle.svg";
import DeviceIcon from "../svg/taxdevice.svg";
import PeopleIcon from "../svg/users.svg";

import UserStore from "../stores/users";
import deviceStore from "../stores/devices";
import cashierStore from "../stores/cashiers";
import productStore from "../stores/products";

import { ordersReport } from "../util/reports";

export default class HomeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: {
        cashiers: [],
        devices: [],
        products: []
      },
      search: {
        cashiers: null,
        products: null,
        devices: null,
        daterange: "today from 12am to 12pm"
      },
      searchResponse: []
    };

    this.selectorChange = this.selectorChange.bind(this);
    this.searchReports = this.searchReports.bind(this);
  }
  componentDidMount() {
    this.loadLists();
  }
  componentWillMount() {
    if (UserStore.selectedOrg === null) {
      redirect("/organizations");
    }
  }
  async searchReports() {
    this.setState({ searchResponse: [] });
    let res = await ordersReport(this.state.search);
    let mapped = res.map(item => {
      item.timestamp = new Date(item.timestamp).toLocaleString();
      return item;
    });
    this.setState({ searchResponse: mapped });
  }
  async loadLists() {
    let c = await cashierStore.list();
    let cashiers = cashierStore.all.map(c => {
      return {
        text: c.name,
        value: c.id
      };
    });

    let d = await deviceStore.list();
    let devices = deviceStore.all.map(c => {
      return {
        text: c.name,
        value: c.id
      };
    });

    let p = await productStore.list();

    let products = productStore.all.map(p => {
      return {
        text: p.description,
        value: p.id
      };
    });

    this.setState({ lists: { cashiers, devices, products } });
  }
  selectorChange(e, data) {
    let { name, value } = data,
      delta = {};
    delta[name] = value;
    let newSearch = Object.assign(this.state.search, delta);
    this.setState({ search: newSearch });
  }
  headerCards() {
    return [
      {
        icon: PuzzleIcon,
        content: "My Organizations",
        onClick() {
          redirect("/organizations");
        }
      },
      {
        icon: BoxIcon,
        content: "Products",
        onClick() {
          redirect("/products");
        }
      },
      {
        icon: DeviceIcon,
        content: "Devices",
        onClick() {
          redirect("/devices");
        }
      },
      {
        icon: PeopleIcon,
        content: "Employees",
        onClick() {
          redirect("/cashiers");
        }
      },
      {
        icon: DeviceIcon,
        content: "Product Inventory",
        onClick() {
          redirect("/foodinventory");
        }
      }
    ];
  }
  render() {
    return (
      <div className="home-view">
        <HeaderBar cards={this.headerCards()} />
        <div className="wrapper">
          <div className="title-wrapper">
            <div className="title">
              {UserStore.selectedOrgData.name} - Reports
            </div>
          </div>
          <div className="selections">
            <div className="selector">
              <Dropdown
                selection
                onChange={this.selectorChange}
                name="cashier_id"
                placeholder="cashier"
                options={this.state.lists.cashiers}
              />
            </div>

            <div className="selector">
              <Dropdown
                selection
                onChange={this.selectorChange}
                name="device_serial"
                placeholder="device"
                options={this.state.lists.devices}
              />
            </div>

            <div className="selector">
              <Input
                onChange={e => {
                  let target = e.target;
                  let search = Object.assign(this.state.search, {
                    daterange: target.value
                  });
                  this.setState({ search });
                }}
                name="daterange"
                placeholder="date range"
                defaultValue="today"
                value={this.state.search.daterange}
              />
            </div>

            <div className="selector">
              <Button onClick={this.searchReports}>Search</Button>
            </div>
          </div>

          <div className="list">
            <AutoTable
              headers={[
                "order_id",
                "product",
                "units",
                "amount_total",
                "cashier",
                "timestamp"
              ]}
              list={this.state.searchResponse}
            />
          </div>
        </div>
        <style jsx>{`
          .wrapper {
            margin-top: 40px;
            border-top: 1px solid rgba(200, 200, 200, .5);
          }
          .title-wrapper {
            border-bottom: 1px solid rgba(200, 200, 200, .5);
          }
          .title {
            width: 80%;
            margin: auto;
            padding-top: 20px;
            padding-bottom: 20px;
            font-size: 20px;
          }
          .selections {
            width: 90%;
            margin: auto;
            margin-top: 10px;
          }
          .selector {
            display: inline-block;
            margin-left: 5px;
          }
          .list {
            margin-top: 20px;
          }
        `}</style>
      </div>
    );
  }
}
