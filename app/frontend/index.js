import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom'
import _ from "underscore"
import moment from "moment"
import $ from "jquery"
import "react-fastclick" // import for side effects
import * as selectors from "~redux/selectors"
import '~lib/global-try-catch';

window.boss = window.boss || {};
window.currentLayout = window.currentLayout || 'oldLayout';
window.debug = window.debug || {};
window.debug.React = React;
window.debug.ReactDOM = ReactDOM;
window.debug._ = _;
window.debug.moment = moment;
window.debug.selectors = selectors;
// Expose these globally because react rails relies on them
window.React = React;
window.ReactDOM = ReactDOM;

// ToDo: Need to remove this condition, after fix old layout issues
if (window.currentLayout !== 'oldLayout') {
    // Import all sass from submodule(boss-css repo)
    require ('./assets/sass/index.sass');
}

import './mobile-menu';
import './vendors/owl.carousel';

import "./lib/load-underscore-mixins"

import "babel-core/polyfill"

import RotaApp from "./apps/rota/rota-app"
registerComponent("RotaApp", RotaApp)

import StaffTypeRotaApp from "./apps/staff-type-rota/staff-type-rota-app"
registerComponent("StaffTypeRotaApp", StaffTypeRotaApp);

import AddStaffMemberPageComponent from "./apps/add-staff-member/index"
registerComponent("AddStaffMemberPageComponent", AddStaffMemberPageComponent);

import ClockInOutApp from "./apps/clock-in-out/clock-in-out-app"
registerComponent("ClockInOutApp", ClockInOutApp)

import RotaOverviewApp from "./apps/rota-overview/rota-overview-app"
registerComponent("RotaOverviewApp", RotaOverviewApp)

import StaffMemberFormAvatarImage from "./apps/staff-member-form/staff-member-form-avatar-image"
registerComponent("StaffMemberFormAvatarImage", StaffMemberFormAvatarImage)

import ColorPicker from "./apps/staff-types/color-picker.js";
registerComponent("ColorPicker", ColorPicker);

import HolidayReportView from "./apps/holiday-report/holiday-report-app"
registerComponent("HolidayReportApp", HolidayReportView);

import StaffTypeRotaOverviewApp from "./apps/staff-type-rota-overview"
registerComponent("StaffTypeRotaOverviewApp", StaffTypeRotaOverviewApp);

import StaffMembersFilterForm from "./apps/staff-members/components/staff-members-filter-form.js"
registerComponent("StaffMembersFilterForm", StaffMembersFilterForm);

import HoursConfirmationApp from "./apps/hours-confirmation"
registerComponent("HoursConfirmationApp", HoursConfirmationApp)

import StaffHoursOverviewApp from "./apps/staff-hours-overview"
registerComponent("StaffHoursOverviewApp", StaffHoursOverviewApp)

import RollbarErrorTestApp from "./apps/rollbar-error-test/rollbar-error-test-app"
registerComponent("RollbarErrorTestApp", RollbarErrorTestApp)

import VenueFinder from "./components/shared/venue-finder"
registerComponent("VenueFinder", VenueFinder)

import FruitPopover from "./components/shared/fruit-popover"
registerComponent("FruitPopover", FruitPopover)

import WeekPicker from "~components/week-picker"

import AppVersionChecker from '~components/app-version-checker';

$(document).ready(function(){
    let versionCheckerEl = document.createElement("div");
    document.body.appendChild(versionCheckerEl);
    let fiveMinutes = 5 * 60 * 1000;
    let countDown = 5 * 60; // In seconds
    ReactDOM.render(<AppVersionChecker countdown={ countDown } checkEvery={ fiveMinutes } />, versionCheckerEl);

    $(".static-week-picker").each(function(){
        var input = this;

        var el = document.createElement("div")
        input.parentNode.insertBefore(el, input)
        $(input).hide();

        ReactDOM.render(<WeekPicker
                onChange={({startDate}) => input.value = moment(startDate).format("DD-MM-YYYY")}
                selectionStartDate={debug.moment(input.value, "DD-MM-YYYY").toDate()} />, el)
    })
})
