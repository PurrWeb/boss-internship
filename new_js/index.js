import "./load-underscore-mixins"

import React from "react";
import ReactDOM from "react-dom"

import { Provider } from "react-redux"
import store from "./store"
import App from "./app"

// Expose values for debugging
import _ from "underscore"
window._ = _;
window.store = store;
import {boundActionCreators} from "./store"
window.boundActionCreators = boundActionCreators




ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.getElementById("app")
);
