import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import TabFilter from '../components/tab-filter';
import StaffMemberList from '../components/staff-member-list';
import Page from '../components/page';
import { getStaffMembersWithoutEmail } from '../requests';

class StaffWithoutEmailAddress extends Component {
  state = {
    staffMembers: Immutable.List([]),
    isLoaded: false,
  };

  componentDidMount() {
    if (this.props.count > 0) {
      getStaffMembersWithoutEmail().then(res => {
        const imStaffMembers = Immutable.fromJS(
          res.data.staffWithoutEmail.map(staffMember => ({
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
        tabsFilterRenderer={() => <TabFilter showVenues showSecurity />}
        staffMemberListRenderer={staffMembers => (
          <StaffMemberList staffMembers={staffMembers} />
        )}
      />
    );
  }
}

StaffWithoutEmailAddress.propTypes = {
  count: PropTypes.number.isRequired,
  venues: ImmutablePropTypes.list,
  staffTypes: ImmutablePropTypes.list,
  title: PropTypes.string.isRequired,
};

export default StaffWithoutEmailAddress;
