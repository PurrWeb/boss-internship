import React, { Component } from 'react';
import oFetch from 'o-fetch';

import { BossTable } from '~/components/boss-table';

class AccessoryRequestsList extends Component {
  renderAccessoryRequests() {
    const accessoryId = oFetch(this.props.accessory, 'id');

    return this.props.accessoryRequests.map(request => {
      const staffMember = this.props.staffMembers.find(
        staffMember => oFetch(staffMember, 'id') === oFetch(request, 'staffMemberId'),
      );
      if (!staffMember) {
        throw new Error('Something went wrong, staff member must present');
      }

      const avatarUrl = oFetch(staffMember, 'avatarUrl');
      const fullName = oFetch(staffMember, 'fullName');

      const accessorySize = oFetch(request, 'size') || 'N/A';
      const requestId = oFetch(request, 'id');
      const accessoryId = oFetch(this.props.accessory, 'id');
      const requestStatus = oFetch(request, 'status');
      const frozen = oFetch(request, 'frozen');

      const requestData = {
        avatarUrl,
        fullName,
        accessorySize,
        requestId,
        accessoryId,
        staffMember,
        requestId,
        requestStatus,
        frozen,
      };
      return React.cloneElement(this.props.requestItemRenderer(requestData), {
        key: requestId,
      });
    });
  }

  render() {
    return (
      <BossTable className="boss-table_page_accessory-requests-card">
        {this.renderAccessoryRequests()}
      </BossTable>
    );
  }
}

AccessoryRequestsList.defaultProps = {
  accessoryRequests: [],
};

export default AccessoryRequestsList;
