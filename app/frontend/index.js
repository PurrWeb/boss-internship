import errorHandler from '~/lib/error-handlers';
import { rollbarPresent, getRollbarPayload } from '~/lib/rollbar-helpers';
import './polyfills';
import 'whatwg-fetch';

window.addEventListener('unhandledrejection', e => {
  if (rollbarPresent()) {
    Rollbar.error(e, null, getRollbarPayload());
  }
  errorHandler.throwErrorPage();
});

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import moment from 'moment';
import 'react-dates/initialize'

import $ from 'jquery';
import * as selectors from '~/redux/selectors';
import '~/lib/global-try-catch';
import Bowser from 'bowser';
import Spinner from 'react-spinner';
import 'react-spinner/react-spinner.css';
import BouncedEmailModal from '~/components/bounced-email-modal';
import './bounced-emails';
import initMobileMenu from '~/components/mobile-menu';

window.Spinner = Spinner;
window.boss = window.boss || {};
window.boss.currentLayout = window.boss.currentLayout || 'oldLayout';
window.debug = window.debug || {};
window.debug.React = React;
window.debug.ReactDOM = ReactDOM;
window.debug._ = _;
window.debug.moment = moment;
window.debug.selectors = selectors;
// Expose these globally because react rails relies on them
window.React = React;
window.ReactDOM = ReactDOM;

require('react-dates/lib/css/_datepicker.css');

// ToDo: Need to remove this condition, after fix old layout issues
if (window.boss.currentLayout !== 'oldLayout') {
  // Import all sass from submodule(boss-css repo)
  require('./assets/sass/index.sass');
} else {
  require('./assets/sass/quick-menu.sass');
}

import './vendors/owl.carousel';
import 'react-tippy/dist/tippy.css';
import './lib/load-underscore-mixins';

import WelcomeToLiverpoolClients from './apps/welcome-to-liverpool-clients';
registerComponent('WelcomeToLiverpoolClients', WelcomeToLiverpoolClients);

import WelcomeToLiverpoolCards from './apps/welcome-to-liverpool-cards';
registerComponent('WelcomeToLiverpoolCards', WelcomeToLiverpoolCards);

import PayrollReportsApp from './apps/payroll-reports';
registerComponent('PayrollReportsApp', PayrollReportsApp);

import OpsDiaryApp from './apps/ops-diary';
registerComponent('OpsDiaryApp', OpsDiaryApp);

import SecurityVenuesApp from './apps/security-venues';
registerComponent('SecurityVenuesApp', SecurityVenuesApp);

import SecurityShiftRequestsApp from './apps/security-shift-requests';
registerComponent('SecurityShiftRequestsApp', SecurityShiftRequestsApp);

import SecurityShiftRequestReviewsApp from './apps/security-shift-request-reviews';
registerComponent('SecurityShiftRequestReviewsApp', SecurityShiftRequestReviewsApp);

import DevsApp from './apps/devs';
registerComponent('DevsApp', DevsApp);

import InvitesAcceptPage from './components/invites/invites-accept';
registerComponent('InvitesAcceptPage', InvitesAcceptPage);

import InvitesApp from './apps/invites';
registerComponent('InvitesApp', InvitesApp);

import AccessoriesApp from './apps/accessories';
registerComponent('AccessoriesApp', AccessoriesApp);

import AccessoryRequestsApp from './apps/accessory-requests';
registerComponent('AccessoryRequestsApp', AccessoryRequestsApp);

import StaffMemberPasswordReset from './apps/staff-member-password-reset';
registerComponent('StaffMemberPasswordReset', StaffMemberPasswordReset);

import RotaDailyApp from './apps/rota-daily';
registerComponent('RotaDailyApp', RotaDailyApp);

import CheckListsApp from './apps/check-list';
registerComponent('CheckListsApp', CheckListsApp);

import Submissions from './apps/submissions';
registerComponent('Submissions', Submissions);

import { MachinesIndexApp } from './apps/machines';
registerComponent('MachinesIndexApp', MachinesIndexApp);

import MachinesRefloatsApp from './apps/machines-refloats';
registerComponent('MachinesRefloatsApp', MachinesRefloatsApp);

import { IncidentReportsIndexApp } from './apps/incident-reports';
registerComponent('IncidentReportsIndexApp', IncidentReportsIndexApp);

import { IncidentReportsShowApp } from './apps/incident-reports';
registerComponent('IncidentReportsShowApp', IncidentReportsShowApp);

import { StaffMemberProfileDetailsApp } from './apps/staff-member-profile';
registerComponent('StaffMemberProfileDetailsApp', StaffMemberProfileDetailsApp);

import { StaffMemberProfilePaymentsApp } from './apps/staff-member-profile';
registerComponent('StaffMemberProfilePaymentsApp', StaffMemberProfilePaymentsApp);

import { StaffMemberHolidaysApp } from './apps/staff-member-profile';
registerComponent('StaffMemberHolidaysApp', StaffMemberHolidaysApp);

import { StaffMemberOwedHoursApp } from './apps/staff-member-profile';
registerComponent('StaffMemberOwedHoursApp', StaffMemberOwedHoursApp);

import { StaffMemberShiftsApp } from './apps/staff-member-profile';
registerComponent('StaffMemberShiftsApp', StaffMemberShiftsApp);

import { StaffMemberAccessoriesApp } from './apps/staff-member-profile';
registerComponent('StaffMemberAccessoriesApp', StaffMemberAccessoriesApp);

import { StaffMemberProfileDisciplinaryApp } from './apps/staff-member-profile';
registerComponent('StaffMemberProfileDisciplinaryApp', StaffMemberProfileDisciplinaryApp);

import StaffTypeRotaApp from './apps/staff-type-rota/staff-type-rota-app';
registerComponent('StaffTypeRotaApp', StaffTypeRotaApp);

import AddStaffMemberPageComponent from './apps/add-staff-member/index';
registerComponent('AddStaffMemberPageComponent', AddStaffMemberPageComponent);

import ClockInOutApp from './apps/clock-in-out/clock-in-out-app';
registerComponent('ClockInOutApp', ClockInOutApp);

import RotaOverviewApp from './apps/rota-overview/rota-overview-app';
registerComponent('RotaOverviewApp', RotaOverviewApp);

import SecurityRotaOverviewApp from './apps/security-rota-overview';
registerComponent('SecurityRotaOverviewApp', SecurityRotaOverviewApp);

import SecurityRotaDailyApp from './apps/security-rota-daily';
registerComponent('SecurityRotaDailyApp', SecurityRotaDailyApp);

import SecurityRotaShiftRequestsApp from './apps/security-rota-shift-requests';
registerComponent('SecurityRotaShiftRequestsApp', SecurityRotaShiftRequestsApp);

import FinanceReportsApp from './apps/finance-reports';
registerComponent('FinanceReportsApp', FinanceReportsApp);

import StaffMemberFormAvatarImage from './apps/staff-member-form/staff-member-form-avatar-image';
registerComponent('StaffMemberFormAvatarImage', StaffMemberFormAvatarImage);

import ColorPicker from './apps/staff-types/color-picker.js';
registerComponent('ColorPicker', ColorPicker);

import HolidayReportView from './apps/holiday-report/holiday-report-app';
registerComponent('HolidayReportApp', HolidayReportView);

import StaffTypeRotaOverviewApp from './apps/staff-type-rota-overview';
registerComponent('StaffTypeRotaOverviewApp', StaffTypeRotaOverviewApp);

import StaffMembersFilterForm from './apps/staff-members/components/staff-members-filter-form.js';
registerComponent('StaffMembersFilterForm', StaffMembersFilterForm);

import StaffVettingApp from './apps/staff-vetting';
registerComponent('StaffVettingApp', StaffVettingApp);

import HoursConfirmationApp from './apps/hours-confirmation';
registerComponent('HoursConfirmationApp', HoursConfirmationApp);

import StaffHoursOverviewApp from './apps/staff-hours-overview';
registerComponent('StaffHoursOverviewApp', StaffHoursOverviewApp);

import RollbarErrorTestApp from './apps/rollbar-error-test/rollbar-error-test-app';
registerComponent('RollbarErrorTestApp', RollbarErrorTestApp);

// import VenueFinder from "./components/shared/venue-finder"
// registerComponent("VenueFinder", VenueFinder);

import HolidayRequestsApp from './apps/holiday-requests';
registerComponent('HolidayRequestsApp', HolidayRequestsApp);

import FruitPopover from './components/shared/fruit-popover';
registerComponent('FruitPopover', FruitPopover);

import { EmptyHeader } from './components/containers/header/header.js';
registerComponent('EmptyHeader', EmptyHeader);

import VenueHealthCheckApp from './apps/venue-health-check-app';
registerComponent('VenueHealthCheckApp', VenueHealthCheckApp);

import Header from './components/containers/header/header.js';
registerComponent('Header', Header);

import DetailsModal from './components/safe-checks/details-modal';
registerComponent('DetailsModal', DetailsModal);

import VenueHealthCheckReportApp from './apps/venue-health-check-report-app';
registerComponent('VenueHealthCheckReportApp', VenueHealthCheckReportApp);

import MaintenanceApp from './apps/maintenance-app';
registerComponent('MaintenanceApp', MaintenanceApp);

import MarketingTasksApp from "./apps/marketing-tasks-app"
registerComponent("MarketingTasksApp", MarketingTasksApp)

import VenueDashboardApp from './apps/venue-dashboard-app';
registerComponent('VenueDashboardApp', VenueDashboardApp);

import MessageBoardApp from './apps/message-board-app';
registerComponent('MessageBoardApp', MessageBoardApp);

import WeekPicker from '~/components/week-picker';

import DailyReportsApp from './apps/daily-reports';
registerComponent('DailyReportsApp', DailyReportsApp);

import AppVersionChecker from '~/components/app-version-checker';

import VouchersApp from './apps/vouchers';
registerComponent('VouchersApp', VouchersApp);

import VouchersUsageApp from './apps/vouchers-usage';
registerComponent('VouchersUsageApp', VouchersUsageApp);

import VouchersRedeemApp from './apps/vouchers-redeem';
registerComponent('VouchersRedeemApp', VouchersRedeemApp);

import PaymentUploadApp from './apps/payment-upload-app';
registerComponent('PaymentUploadApp', PaymentUploadApp);

$(document).ready(function() {
  if (window.boss.currentLayout !== 'oldLayout') {
    initMobileMenu();
  }
  let versionCheckerEl = document.createElement('div');
  document.body.appendChild(versionCheckerEl);
  let fiveMinutes = 5 * 60 * 1000;
  let countDown = 5 * 60; // In seconds
  ReactDOM.render(
    <AppVersionChecker countdown={countDown} checkEvery={fiveMinutes} />,
    versionCheckerEl,
  );

  $('.static-week-picker').each(function() {
    var input = this;

    var el = document.createElement('div');
    input.parentNode.insertBefore(el, input);
    $(input).hide();

    ReactDOM.render(
      <WeekPicker
        onChange={({ startDate }) =>
          (input.value = moment(startDate).format('DD-MM-YYYY'))
        }
        selectionStartDate={debug.moment(input.value, 'DD-MM-YYYY').toDate()}
      />,
      el,
    );
  });

  if (Bowser.ios) {
    document.querySelector('html').classList.add('is-ios');
  }
});
