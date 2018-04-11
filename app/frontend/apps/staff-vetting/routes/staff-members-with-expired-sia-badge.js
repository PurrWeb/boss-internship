import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { getStaffMembersWithExpiredSIABadge } from '../requests';
import TabFilter from '../components/tab-filter';
import Page from '../components/page';
import StaffMemberList from '../components/staff-member-list';

class StaffWithBouncedEmails extends Component {
  state = {
    staffMembers: Immutable.List([]),
    isLoaded: false,
  };

  componentDidMount() {
    if (this.props.count > 0) {
      getStaffMembersWithExpiredSIABadge().then(res => {
        const imStaffMembers = Immutable.fromJS(
          res.data.staffWithExpiredSiaBadge.map(staffMember => ({
            ...staffMember,
            fullName: `${staffMember.firstName} ${staffMember.surname}`,
          })),
        );
        this.setState({
          staffMembers: imStaffMembers,
          isLoaded: true,
        });
      });
    } else {
      this.setState({
        isLoaded: true,
      });
    }
  }

  render() {
    if (!this.state.isLoaded) {
      return null;
    }

    return (
      <Page
        title={this.props.title}
        venues={this.props.venues}
        count={this.props.count}
        staffMembers={this.state.staffMembers}
        staffTypes={this.props.staffTypes}
        tabsFilterRenderer={() => <TabFilter />}
        staffMemberListRenderer={staffMembers => (
          <StaffMemberList staffMembers={staffMembers} withSiaBadgeExpiryDate />
        )}
      />
    );
  }
}

StaffWithBouncedEmails.propTypes = {
  count: PropTypes.number.isRequired,
  venues: ImmutablePropTypes.list,
  staffTypes: ImmutablePropTypes.list,
  title: PropTypes.string.isRequired,
};

export default StaffWithBouncedEmails;
