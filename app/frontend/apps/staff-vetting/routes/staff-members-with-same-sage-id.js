import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { BossCheckCardCollapsibleGroup } from '~/components/boss-check-card';

import TabFilter from '../components/tab-filter';
import StaffMemberList from '../components/staff-member-list';
import Page from '../components/page';
import Collabsible from '../components/collapsible';
import { getStaffMembersWithSameSageId } from '../requests';

class StaffWithSameSageId extends Component {
  state = {
    staffMembers: Immutable.List([]),
    isLoaded: false,
  };

  componentDidMount() {
    if (this.props.count > 0) {
      getStaffMembersWithSameSageId().then(res => {
        const imStaffMembers = Immutable.fromJS(
          res.data.staffMembers.map(staffMember => ({
            ...staffMember,
            fullName: `${staffMember.firstName} ${staffMember.surname}`,
          })),
        );
        const imGrouppedBySageId = Immutable.fromJS(
          res.data.sameSageId.map(sageGroup => {
            const { staffMembersIds } = sageGroup;
            return {
              ...sageGroup,
              staffMembers: imStaffMembers.filter(staffMember => staffMembersIds.includes(staffMember.get('id'))),
            };
          }),
        );
        this.setState({
          staffMembers: imStaffMembers,
          grouppedStaffMembers: imGrouppedBySageId,
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
        count={this.props.count}
        staffMembers={this.state.staffMembers}
        filter={false}
        simpleLayout
        contentRenderer={() => {
          return (
            <div>
              {this.state.grouppedStaffMembers.map((sageGroup, index) => {
                const sageId = sageGroup.get('sageId');
                const staffMembers = sageGroup.get('staffMembers');
                return (
                  <Collabsible text={sageId} count={staffMembers.size} key={index.toString()}>
                    <StaffMemberList
                      venues={this.props.venues}
                      staffTypes={this.props.staffTypes}
                      staffMembers={staffMembers}
                    />
                  </Collabsible>
                );
              })}
            </div>
          );
        }}
      />
    );
  }
}

StaffWithSameSageId.propTypes = {
  count: PropTypes.number.isRequired,
  venues: ImmutablePropTypes.list,
  staffTypes: ImmutablePropTypes.list,
  title: PropTypes.string.isRequired,
};

export default StaffWithSameSageId;
