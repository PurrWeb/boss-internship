import React from 'react';
import ReactDOM from 'react-dom'
import _ from "underscore"
window.React = React;
window.ReactDOM = ReactDOM;
window._ = _;

window.webpackHotUpdate = function(){}

import "./lib/load-underscore-mixins"

import RotaApp from './apps/rota/rota-app'
registerComponent('RotaApp', RotaApp)

import ClockInOutApp from './apps/clock-in-out/clock-in-out-app'
registerComponent('ClockInOutApp', ClockInOutApp)
