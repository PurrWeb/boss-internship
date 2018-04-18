import React, { Component } from 'react';
import oFetch from 'o-fetch';

import loadMore from '~/components/load-more';

class StaffCardList extends Component {
  renderStaffCardList(staffMembers, holidayRequests) {
    return staffMembers.map(staffMember => {
      const jsStaffMember = staffMember.toJS();
      const staffMemberId = oFetch(jsStaffMember, 'id');
      const staffMemberHolidayRequests = holidayRequests.filter(
        holidayRequest => holidayRequest.get('staffMemberId') === staffMemberId,
      );
      return React.cloneElement(this.props.itemRenderer(jsStaffMember, staffMemberHolidayRequests), {
        key: staffMemberId.toString(),
      });
    });
  }

  render() {
    const staffMembers = oFetch(this.props, 'staffMembers');
    const holidayRequests = oFetch(this.props, 'holidayRequests');

    return <div>{this.renderStaffCardList(staffMembers, holidayRequests)}</div>;
  }
}

export default loadMore(StaffCardList);
