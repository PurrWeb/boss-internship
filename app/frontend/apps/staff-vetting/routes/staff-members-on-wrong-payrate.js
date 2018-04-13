import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import TabFilter from '../components/tab-filter';
import StaffMemberList from '../components/staff-member-list';
import { getStaffMembersOnWrongPayrate } from '../requests';
import Page from '../components/page';

class StaffMembersOnWrongPayrate extends Component {
  state = {
    staffMembers: Immutable.List([]),
    staffMembersWronglyOn18To20Payrate: Immutable.List([]),
    staffMembersWronglyOn21To24Payrate: Immutable.List([]),
    staffMembersWronglyOn25PlusPayrate: Immutable.List([]),
    isLoaded: false,
  };

  componentDidMount() {
    if (this.props.count > 0) {
      getStaffMembersOnWrongPayrate().then(res => {
        const imStaffMembersWronglyOn18To20Payrate = Immutable.fromJS(
          res.data.staffWronglyOn18To20Payrate.map(staffMember => ({
            ...staffMember,
            fullName: `${staffMember.firstName} ${staffMember.surname}`,
          })),
        );
        const imStaffMembersWronglyOn21To24Payrate = Immutable.fromJS(
          res.data.staffWronglyOn21To24Payrate.map(staffMember => ({
            ...staffMember,
            fullName: `${staffMember.firstName} ${staffMember.surname}`,
          })),
        );
        const imStaffMembersWronglyOn25PlusPayrate = Immutable.fromJS(
          res.data.staffWronglyOn25PlusPayrate.map(staffMember => ({
            ...staffMember,
            fullName: `${staffMember.firstName} ${staffMember.surname}`,
          })),
        );
        const staffMembers = imStaffMembersWronglyOn18To20Payrate
          .concat(imStaffMembersWronglyOn21To24Payrate)
          .concat(imStaffMembersWronglyOn25PlusPayrate);
        this.setState({
          staffMembersWronglyOn18To20Payrate: imStaffMembersWronglyOn18To20Payrate,
          staffMembersWronglyOn21To24Payrate: imStaffMembersWronglyOn21To24Payrate,
          staffMembersWronglyOn25PlusPayrate: imStaffMembersWronglyOn25PlusPayrate,
          staffMembers,
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
    const {
      staffMembersWronglyOn18To20Payrate,
      staffMembersWronglyOn21To24Payrate,
      staffMembersWronglyOn25PlusPayrate,
    } = this.state;
    return (
      <Page
        title={this.props.title}
        venues={this.props.venues}
        count={this.props.count}
        staffMembers={this.state.staffMembers}
        staffTypes={this.props.staffTypes}
        tabsFilterRenderer={() => (
          <TabFilter
            showPayRates
            payRates={{
              staffMembersWronglyOn18To20Payrate,
              staffMembersWronglyOn21To24Payrate,
              staffMembersWronglyOn25PlusPayrate,
            }}
          />
        )}
        staffMemberListRenderer={staffMembers => (
          <StaffMemberList staffMembers={staffMembers} withAge />
        )}
      />
    );
  }
}

StaffMembersOnWrongPayrate.propTypes = {
  count: PropTypes.number.isRequired,
  venues: ImmutablePropTypes.list,
  staffTypes: ImmutablePropTypes.list,
  title: PropTypes.string.isRequired,
};

export default StaffMembersOnWrongPayrate;
