import React, { Component } from 'react';
import {
  BossCheckCard,
  BossCheckRow,
  BossCheckCardCollapsibleGroup,
} from '~/components/boss-check-card';

import {
  BossTable,
  BossTableRow,
  BossTableCell,
} from '~/components/boss-table';

import AccessoryRequestsList from './accessory-requests-list';
import AccessoryRequestItem from './accessory-request-item';

class AccessoryListItem extends Component {
  render() {
    const {
      data: {
        name,
        requests,
        staffMembers,
        refundRequests,
        accessory,
        requestsCount,
        refundRequestsCount,
      },
      actions: {
        acceptAccessoryRequest,
        rejectAccessoryRequest,
        acceptAccessoryRefundRequest,
        rejectAccessoryRefundRequest,
      },
    } = this.props;

    return (
      <BossCheckCard title={name} className="boss-check__title_role_accessory">
        <BossCheckRow
          title="Black Venue"
          className="boss-check__text boss-check__text_role_venue"
        />
        <BossCheckCardCollapsibleGroup
          title="Requests"
          text={requestsCount}
          showCaret={requestsCount !== 0}
        >
          <AccessoryRequestsList
            accessory={accessory}
            accessoryRequests={requests}
            staffMembers={staffMembers}
            requestItemRenderer={data => (
              <AccessoryRequestItem
                onRejectRequest={rejectAccessoryRequest}
                onAcceptRequest={acceptAccessoryRequest}
                data={data}
              />
            )}
          />
        </BossCheckCardCollapsibleGroup>
        <BossCheckCardCollapsibleGroup
          title="Refunds"
          text={refundRequestsCount}
          showCaret={refundRequestsCount !== 0}
        >
          <BossTable className="boss-table_page_accessory-requests-card">
            <AccessoryRequestsList
              accessory={accessory}
              accessoryRequests={refundRequests}
              staffMembers={staffMembers}
              requestItemRenderer={data => (
                <AccessoryRequestItem
                  onAcceptRequest={acceptAccessoryRefundRequest}
                  onRejectRequest={rejectAccessoryRefundRequest}
                  data={data}
                />
              )}
            />
          </BossTable>
        </BossCheckCardCollapsibleGroup>
      </BossCheckCard>
    );
  }
}

export default AccessoryListItem;
