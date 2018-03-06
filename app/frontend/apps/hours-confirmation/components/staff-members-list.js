import React, { Component } from 'react';
import ContentWrapper from '~/components/content-wrapper';
import _ from 'lodash';

class StaffMembersList extends Component {
  renderStaffMembers(clockInOutData) {
    const childrens = [];
    clockInOutData.forEach((dateStaffMembers, date) => {
      dateStaffMembers.forEach((periods, staffMemberId) => {
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
      });
    });
    return childrens;
  }

  render() {
    const { clockInOutData } = this.props;
    return (
      <ContentWrapper>{this.renderStaffMembers(clockInOutData)}</ContentWrapper>
    );
  }
}

export default StaffMembersList;
