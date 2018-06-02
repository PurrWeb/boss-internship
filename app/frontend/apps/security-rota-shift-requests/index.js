import React, {Component} from "react";
import PropTypes from "prop-types";
import {Provider} from "react-redux";
import configureStore from "~/apps/store";
import Immutable from "immutable";
import Page from "./containers/page";

import reducers from "./redux/reducers";
import {loadInitialData} from "./redux/actions";


class SecurityRotaShiftRequestsApp extends Component {
  componentWillMount() {
    require("./style.css");
    const {accessToken} = this.props;

    if (!accessToken) {
      throw new Error("Access token must be present");
    }
    window.boss.accessToken = accessToken;
    this.store = configureStore(reducers);
    this.store.dispatch(loadInitialData(this.props));
  }

  render() {
    return (
      <Provider store={this.store}>
        <Page />
      </Provider>
    );
  }
}

SecurityRotaShiftRequestsApp.propTypes = {};

export default SecurityRotaShiftRequestsApp;
