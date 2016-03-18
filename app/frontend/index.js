import React from 'react';
import ReactDOM from 'react-dom'
import _ from "underscore"
import moment from "moment"
window.debug = window.debug || {};
window.debug.React = React;
window.debug.ReactDOM = ReactDOM;
window.debug._ = _;
window.debug.moment = moment;


window.React = React // expose globally because react rails relies on it
import "./lib/load-underscore-mixins"

import "babel-core/polyfill"

import RotaApp from "./apps/rota/rota-app"
registerComponent("RotaApp", RotaApp)

// import StaffTypeRotaApp from "./apps/staff-type-rota/staff-type-rota-app"
// registerComponent("StaffTypeRotaApp", StaffTypeRotaApp);

import ClockInOutApp from "./apps/clock-in-out/clock-in-out-app"
registerComponent("ClockInOutApp", ClockInOutApp)

import RotaOverviewApp from "./apps/rota-overview/rota-overview-app"
registerComponent("RotaOverviewApp", RotaOverviewApp)

import StaffMemberFormAvatarImage from "./apps/staff-member-form/staff-member-form-avatar-image"
registerComponent("StaffMemberFormAvatarImage", StaffMemberFormAvatarImage)

import HolidayReportView from "./apps/holiday-report/holiday-report-app"
registerComponent("HolidayReportApp", HolidayReportView);

import StaffTypeRotaOverviewApp from "./apps/staff-type-rota-overview"
registerComponent("StaffTypeRotaOverviewApp", StaffTypeRotaOverviewApp);