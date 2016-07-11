import React from 'react';
import ReactDOM from 'react-dom'
import _ from "underscore"
import moment from "moment"
import $ from "jquery"
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

import StaffTypeRotaApp from "./apps/staff-type-rota/staff-type-rota-app"
registerComponent("StaffTypeRotaApp", StaffTypeRotaApp);

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

import HoursConfirmationApp from "./apps/hours-confirmation"
registerComponent("HoursConfirmationApp", HoursConfirmationApp)

import WeekPicker from "~components/week-picker"
$(document).ready(function(){
    $(".week-picker").each(function(){
        var input = this;

        var el = document.createElement("div")
        input.parentNode.insertBefore(el, input)
        $(input).hide();

        ReactDOM.render(<WeekPicker
                onChange={({startDate}) => input.value = moment(startDate).format("DD-MM-YYYY")}
                selectionStartDate={debug.moment(input.value, "DD-MM-YYYY").toDate()} />, el)
    })
})
