import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import StaffMemberInfo from './staff-member-info';
import moment from 'moment';
import utils from '~/lib/utils';
import safeMoment from '~/lib/safe-moment';

class StaffMemberList extends Component {
  getStaffMemberAge(staffMember) {
    if (!staffMember.get('dateOfBirth')) {
      return '-';
    }
    return moment().diff(staffMember.get('dateOfBirth'), 'years');
  }

  getStaffMemberSiaBadgeExpiryDate(staffMember) {
    if (!staffMember.get('siaBadgeExpiryDate')) {
      return '-';
    }
    return safeMoment.parse(staffMember.get('siaBadgeExpiryDate'), 'YYYY-MM-DD').format('ddd DD/MM/YYYY');
  }

  render() {
    const { staffMembers, staffTypes, withAge, withSiaBadgeExpiryDate, withBouncedEmail, venues } = this.props;

    if (staffMembers.size === 0) {
      return (
        <div className="boss-users__flow">
          <p className="boss-users__text-placeholder">No staff members found</p>
        </div>
      );
    }
    return (
      <div className="boss-users__flow">
        <div className="boss-users__flow-list">
          {staffMembers.map(staffMember => {
            const bouncedEmailData = staffMember.get('bouncedEmailData');
            const paidHolidays = staffMember.get('paidHolidays');
            const masterVenue = venues
              ? staffMember.get('venueId')
                ? venues.find(venue => venue.get('id') === staffMember.get('venueId')).get('name')
                : null
              : null;

            return (
              <StaffMemberInfo
                key={staffMember.get('id')}
                id={staffMember.get('id')}
                avatarUrl={staffMember.get('avatarUrl')}
                fullName={staffMember.get('fullName')}
                staffType={staffTypes
                  .find(staffType => staffType.get('id') === staffMember.get('staffTypeId'))
                  .get('name')}
                staffColor={staffTypes
                  .find(staffType => staffType.get('id') === staffMember.get('staffTypeId'))
                  .get('color')}
                age={withAge && this.getStaffMemberAge(staffMember)}
                expiredSiaBadge={withSiaBadgeExpiryDate && this.getStaffMemberSiaBadgeExpiryDate(staffMember)}
                bouncedEmailData={withBouncedEmail && bouncedEmailData && bouncedEmailData.toJS()}
                hours={staffMember.get('hours')}
                masterVenue={masterVenue}
                paidHolidays={paidHolidays}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

StaffMemberList.propTypes = {
  staffMembers: ImmutablePropTypes.list,
  staffTypes: ImmutablePropTypes.list,
  withAge: PropTypes.bool,
  withSiaBadgeExpiryDate: PropTypes.bool,
  withBouncedEmail: PropTypes.bool,
  venues: ImmutablePropTypes.list,
};

export default StaffMemberList;
