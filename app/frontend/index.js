import React from 'react';
import ReactDOM from 'react-dom'
import _ from "underscore"
window.debug = {}
window.debug.React = React;
window.debug.ReactDOM = ReactDOM;
window.debug._ = _;

import "./lib/load-underscore-mixins"

import RotaApp from "./apps/rota/rota-app"
registerComponent("RotaApp", RotaApp)

import ClockInOutApp from "./apps/clock-in-out/clock-in-out-app"
registerComponent("ClockInOutApp", ClockInOutApp)

import RotaOverviewApp from "./apps/rota-overview/rota-overview-app"
registerComponent("RotaOverviewApp", RotaOverviewApp)

import StaffMemberFormAvatarImage from "./apps/staff-member-form/staff-member-form-avatar-image"
registerComponent("StaffMemberFormAvatarImage", StaffMemberFormAvatarImage)