import React, { Component } from 'react';
import {
  BossCheckCard,
  BossCheckRow,
  BossCheckCardCollapsibleGroup,
} from '~/components/boss-check-card';

import { BossTable, BossTableRow, BossTableCell } from '~/components/boss-table';

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
        undoAccessoryRequest,
        undoAccessoryRefundRequest,
        completeAccessoryRequest,
        completeAccessoryRefundRequest,
      },
    } = this.props;

    return (
      <BossCheckCard title={name} className="boss-check__title_role_accessory">
        <BossCheckCardCollapsibleGroup
          title="Requests"
          text={requestsCount}
          showCaret={requestsCount !== 0}
        >
          <AccessoryRequestsList
            accessory={accessory}
            accessoryRequests={requests}
            staffMembers={staffMembers}
            paginate
            pageSize={5}
            requestItemRenderer={data => (
              <AccessoryRequestItem
                onRejectRequest={rejectAccessoryRequest}
                onAcceptRequest={acceptAccessoryRequest}
                onUndoRequest={undoAccessoryRequest}
                onCompleteRequest={completeAccessoryRequest}
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
              paginate
              pageSize={5}
              requestItemRenderer={data => (
                <AccessoryRequestItem
                  onAcceptRequest={acceptAccessoryRefundRequest}
                  onRejectRequest={rejectAccessoryRefundRequest}
                  onUndoRequest={undoAccessoryRefundRequest}
                  onCompleteRequest={completeAccessoryRefundRequest}
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