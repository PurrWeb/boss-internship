import React, { Component } from 'react';
import ContentWrapper from '~/components/content-wrapper';
import _ from 'lodash';
import StaffFilter from './filter';
import utils from '~/lib/utils';

class StaffMembersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredStaffMemberIds: props.staffMembers
        .map(staffMember => staffMember.get('id'))
        .toJS(),
    };
  }

  renderStaffMembers(clockInOutData) {
    const childrens = [];
    clockInOutData.forEach((dateVenues, date) => {
      dateVenues.forEach((venueStaffMember, venueId) => {
        venueStaffMember.forEach((periods, staffMemberId) => {
          if (this.state.filteredStaffMemberIds.includes(staffMemberId)) {
            childrens.push(
              React.cloneElement(
                this.props.itemRenderer({
                  date,
                  periods: periods.toJS(),
                }),
                {
                  key: `${date}${staffMemberId}`,
                },
              ),
            );
          }
        });
      });
    });
    return childrens;
  }

  onStaffFilterChange = filterData => {
    this.setState({ filteredStaffMemberIds: filterData });
  };

  render() {
    const { clockInOutData, pageType } = this.props;

    return (
      <ContentWrapper>
        {pageType !== 'overview' && (
          <StaffFilter
            clockInDays={this.props.clockInDays}
            onFilterChange={this.onStaffFilterChange}
          />
        )}
        {this.renderStaffMembers(clockInOutData)}
      </ContentWrapper>
    );
  }
}

export default StaffMembersList;
