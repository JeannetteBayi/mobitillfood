// @flow

import React, { Component } from "react";
import { Link, redirect } from "../routing/Router";

import TopBar from "../components/TopBar";
import HeaderBar from "../components/HeaderBar";

// import svg icons
import TaxDeviceIcon from "../svg/taxdevice.svg";
import MerchantsIcon from "../svg/merchants.svg";

import UsersIcon from "../svg/users.svg";

// import page views
import HomeView from "../pageviews/Home";
import OrgView from "../pageviews/Organizations";
import ProductView from "../pageviews/Products";
import CashierView from "../pageviews/Cashiers";
import DeviceView from "../pageviews/Devices";
import FoodInventoryView from "../pageviews/FoodInventory";

// Notification
import { singleNote, Notifier } from "../stores/Notifications";

import userStore from "../stores/users";
import orgStore from "../stores/organizations";
import productStore from "../stores/products";
import cashierStore from "../stores/cashiers";
import deviceStore from "../stores/devices";
import foodInventoryStore from "../stores/foodinventory";

type HomeProps = {
  match: { params: Array<string> }
};

export default class Home extends Component {
  state: {
    urlMatch: { page: string, option: string }
  };
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      urlMatch: { page: "", option: "" }
    };
  }
  componentWillMount() {
    this.checkLogin();
  }
  checkLogin() {
    if (!userStore.session) {
      redirect("/accounts/login");
    } else {
      redirect("/");
    }
  }
  componentDidMount() {
    this.urlMatch();
  }
  componentWillReceiveProps(props: HomeProps) {
    this.urlMatch(props);
  }
  urlMatch(props: ?HomeProps) {
    let p = props || this.props;
    let [page, option, id] = p.match.params;
    this.setState({ urlMatch: { page, option, id } });
  }
  renderPage() {
    let params = this.state.urlMatch;
    let page = params.page || "";

    switch (page) {
      case "":
      case "home": {
        return <HomeView params={params} />;
      }
      case "organizations": {
        return <OrgView params={params} store={orgStore} />;
      }
      case "products": {
        return <ProductView params={params} store={productStore} />;
      }
      case "cashiers": {
        return <CashierView params={params} store={cashierStore} />;
      }
      case "devices": {
        return <DeviceView params={params} store={deviceStore} />;
      }
      case "foodinventory": {
        return <FoodInventoryView params={params} store={foodInventoryStore} />;
      }
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="home">
        <Notifier singleNote={singleNote} />
        <TopBar title="Mobitill Eats" />

        <div className="home-content">
          {this.renderPage()}{" "}
        </div>

        <style jsx>{`
          .home-content {
            display: flex;
            width: 100vw;
            min-height: 100px;
            margin-top: 30px;
          }
        `}</style>
      </div>
    );
  }
}
