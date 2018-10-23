import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Immutable from 'immutable';
import oFetch from 'o-fetch';
import PrivateRoute from './components/private-route';

import StaffVetting from './routes/staff-vetting';
import StaffWithoutEmailAddress from './routes/staff-members-without-email-address';
import StaffMembersWithoutNINumber from './routes/staff-members-without-ni-number';
import StaffWithoutAddress from './routes/staff-members-without-address';
import StaffMembersWithoutPhoto from './routes/staff-members-without-photo';
import StaffMembersOnWrongPayrate from './routes/staff-members-on-wrong-payrate';
import StaffMembersWithExpiredSiaBadge from './routes/staff-members-with-expired-sia-badge';
import StaffMembersWithBouncedEmails from './routes/staff-members-with-bounced-emails';
import StaffMembersWithSameSageId from './routes/staff-members-with-same-sage-id';
import TimeDodges from './routes/time-dodges';

class StaffVettingApp extends React.Component {
  componentWillMount() {
    const { accessToken } = this.props;
    if (!accessToken) {
      throw new Error('Access token must be present');
    }
    window.boss.accessToken = accessToken;
    require('./styles.css');
  }

  render() {
    const {
      staffWithoutEmailCount,
      staffWithoutNiNumberCount,
      staffWithoutAddressCount,
      staffWithoutPhotoCount,
      staffOnWrongPayrateCount,
      staffWithExpiredSiaBadgeCount,
      staffMembersWithBouncedEmailCount,
      staffWithSameSageIdCount,
      venues,
      staffTypes,
    } = this.props;

    const permissions = oFetch(this.props, 'permissions');

    const staffVettingProps = {
      staffWithoutEmailCount,
      staffWithoutNiNumberCount,
      staffWithoutAddressCount,
      staffWithoutPhotoCount,
      staffOnWrongPayrateCount,
      staffWithExpiredSiaBadgeCount,
      staffMembersWithBouncedEmailCount,
      staffWithSameSageIdCount,
      permissions,
    };
    const imVenues = Immutable.fromJS(venues);
    const imStaffTypes = Immutable.fromJS(staffTypes);
    const canViewWithoutAddress = oFetch(permissions, 'staffWithoutAddress.canView');
    const canViewWithoutEmail = oFetch(permissions, 'staffWithoutEmail.canView');
    const canViewWithouNiNumber = oFetch(permissions, 'staffWithoutNiNumber.canView');

    const canViewWithoutPhoto = oFetch(permissions, 'staffWithoutPhoto.canView');
    const canViewOnWrongPayrate = oFetch(permissions, 'staffOnWrongPayrate.canView');
    const canViewWithExpiredSiaBadge = oFetch(permissions, 'staffWithExpiredSiaBadge.canView');
    const canViewWithBouncedEmails = oFetch(permissions, 'staffWithBouncedEmails.canView');
    const canViewWithTimeDodges = oFetch(permissions, 'staffWithWithTimeDodges.canView');

    return (
      <Router>
        <div>
          <Route
            exact
            path="/"
            render={props => {
              return <StaffVetting {...props} {...staffVettingProps} />;
            }}
          />
          <PrivateRoute
            exact
            path="/staff_members_without_email"
            canView={canViewWithoutEmail}
            render={props => (
              <StaffWithoutEmailAddress
                venues={imVenues}
                staffTypes={imStaffTypes}
                count={staffWithoutEmailCount}
                title="Staff Members Without Email"
              />
            )}
          />
          <PrivateRoute
            exact
            path="/staff_members_without_ni_number"
            canView={canViewWithouNiNumber}
            render={props => (
              <StaffMembersWithoutNINumber
                venues={imVenues}
                staffTypes={imStaffTypes}
                count={staffWithoutNiNumberCount}
                title="Staff Members Without NI Number"
              />
            )}
          />
          <PrivateRoute
            exact
            path="/staff_members_without_address"
            canView={canViewWithoutAddress}
            render={props => (
              <StaffWithoutAddress
                venues={imVenues}
                staffTypes={imStaffTypes}
                count={staffWithoutAddressCount}
                title="Staff Members Without Address"
              />
            )}
          />
          <PrivateRoute
            exact
            path="/staff_members_without_photo"
            canView={canViewWithoutPhoto}
            render={props => (
              <StaffMembersWithoutPhoto
                venues={imVenues}
                staffTypes={imStaffTypes}
                count={staffWithoutPhotoCount}
                title="Staff Members Without Photo"
              />
            )}
          />
          <PrivateRoute
            exact
            path="/staff_members_on_wrong_payrate"
            canView={canViewOnWrongPayrate}
            render={props => (
              <StaffMembersOnWrongPayrate
                venues={imVenues}
                staffTypes={imStaffTypes}
                count={staffOnWrongPayrateCount}
                title="Staff Members on Wrong Pay Rate"
              />
            )}
          />
          <PrivateRoute
            exact
            path="/staff_members_with_expired_sia_badge"
            canView={canViewWithExpiredSiaBadge}
            render={props => (
              <StaffMembersWithExpiredSiaBadge
                venues={imVenues}
                staffTypes={imStaffTypes}
                count={staffWithExpiredSiaBadgeCount}
                title="Staff Members with expired SIA badge"
              />
            )}
          />
          <PrivateRoute
            exact
            path="/staff_members_with_bounced_emails"
            canView={canViewWithBouncedEmails}
            render={props => (
              <StaffMembersWithBouncedEmails
                venues={imVenues}
                staffTypes={imStaffTypes}
                count={staffMembersWithBouncedEmailCount}
                title="Staff Members with Bounced Emails"
              />
            )}
          />
          <PrivateRoute
            exact
            path="/time_dodges/:weekStartDate?"
            canView={canViewWithTimeDodges}
            render={props => <TimeDodges venues={imVenues} staffTypes={imStaffTypes} title="Time Dodgers" />}
          />
          <PrivateRoute
            exact
            path="/duplicated_sage_id"
            canView={canViewWithoutAddress}
            render={props => (
              <StaffMembersWithSameSageId
                venues={imVenues}
                staffTypes={imStaffTypes}
                count={staffWithSameSageIdCount}
                title="Staff with Duplicated Sage ID"
              />
            )}
          />
        </div>
      </Router>
    );
  }
}

export default StaffVettingApp;
