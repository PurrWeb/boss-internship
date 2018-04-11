import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Immutable from 'immutable';

import StaffVetting from './routes/staff-vetting';
import StaffWithoutEmailAddress from './routes/staff-members-without-email-address';
import StaffMembersWithoutNINumber from './routes/staff-members-without-ni-number';
import StaffWithoutAddress from './routes/staff-members-without-address';
import StaffMembersWithoutPhoto from './routes/staff-members-without-photo';
import StaffMembersOnWrongPayrate from './routes/staff-members-on-wrong-payrate';
import StaffMembersWithExpiredSiaBadge from './routes/staff-members-with-expired-sia-badge';
import StaffMembersWithBouncedEmails from './routes/staff-members-with-bounced-emails';

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
      venues,
      staffTypes,
    } = this.props;

    const staffVettingProps = {
      staffWithoutEmailCount,
      staffWithoutNiNumberCount,
      staffWithoutAddressCount,
      staffWithoutPhotoCount,
      staffOnWrongPayrateCount,
      staffWithExpiredSiaBadgeCount,
      staffMembersWithBouncedEmailCount,
    };
    const imVenues = Immutable.fromJS(venues);
    const imStaffTypes = Immutable.fromJS(staffTypes);
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
          <Route
            exact
            path="/staff_members_without_email"
            render={props => (
              <StaffWithoutEmailAddress
                venues={imVenues}
                staffTypes={imStaffTypes}
                count={staffWithoutEmailCount}
                title="Staff Members Without Email"
              />
            )}
          />
          <Route
            exact
            path="/staff_members_without_ni_number"
            render={props => (
              <StaffMembersWithoutNINumber
                venues={imVenues}
                staffTypes={imStaffTypes}
                count={staffWithoutNiNumberCount}
                title="Staff Members Without NI Number"
              />
            )}
          />
          <Route
            exact
            path="/staff_members_without_address"
            render={props => (
              <StaffWithoutAddress
                venues={imVenues}
                staffTypes={imStaffTypes}
                count={staffWithoutAddressCount}
                title="Staff Members Without Address"
              />
            )}
          />
          <Route
            exact
            path="/staff_members_without_photo"
            render={props => (
              <StaffMembersWithoutPhoto
                venues={imVenues}
                staffTypes={imStaffTypes}
                count={staffWithoutPhotoCount}
                title="Staff Members Without Photo"
              />
            )}
          />
          <Route
            exact
            path="/staff_members_on_wrong_payrate"
            render={props => (
              <StaffMembersOnWrongPayrate
                venues={imVenues}
                staffTypes={imStaffTypes}
                count={staffOnWrongPayrateCount}
                title="Staff Members on Wrong Pay Rate"
              />
            )}
          />
          <Route
            exact
            path="/staff_members_with_expired_sia_badge"
            render={props => (
              <StaffMembersWithExpiredSiaBadge
                venues={imVenues}
                staffTypes={imStaffTypes}
                count={staffWithExpiredSiaBadgeCount}
                title="Staff Members with expired SIA badge"
              />
            )}
          />
          <Route
            exact
            path="/staff_members_with_bounced_emails"
            render={props => (
              <StaffMembersWithBouncedEmails
                venues={imVenues}
                staffTypes={imStaffTypes}
                count={staffMembersWithBouncedEmailCount}
                title="Staff Members with Bounced Emails"
              />
            )}
          />
        </div>
      </Router>
    );
  }
}

export default StaffVettingApp;
