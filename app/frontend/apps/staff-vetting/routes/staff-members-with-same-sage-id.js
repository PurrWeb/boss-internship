import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import GroupWrapper from '../components/group-wrapper';
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
        const imGrouppedByVenueAndSageId = imStaffMembers
          .groupBy(s => s.get('venueId'))
          .map((staffMembersByVenue, venueId) => staffMembersByVenue.groupBy(s => s.get('sageId')));
        console.log(imGrouppedByVenueAndSageId);
        this.setState({
          staffMembers: imStaffMembers,
          grouppedStaffMembers: imGrouppedByVenueAndSageId,
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
              {this.state.grouppedStaffMembers.entrySeq().map(grouppedStaffMembersEntry => {
                const [venueId, venueAndSageGroup] = grouppedStaffMembersEntry;
                const venue = this.props.venues.find(venue => venue.get('id') === parseInt(venueId));
                const venueName = venue.get('name');
                const staffMembersGroupsTotal = venueAndSageGroup.reduce((acc, group) => {
                  return acc + group.size;
                }, 0);
                return (
                  <Collabsible text={venueName} count={staffMembersGroupsTotal} key={venueId}>
                    {venueAndSageGroup.entrySeq().map(venueAndSageGroupEntry => {
                      const [sageId, staffMembers] = venueAndSageGroupEntry;
                      return (
                        <GroupWrapper groupTitle={sageId} key={sageId}>
                          <StaffMemberList staffTypes={this.props.staffTypes} staffMembers={staffMembers} />
                        </GroupWrapper>
                      )
                    })}
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
