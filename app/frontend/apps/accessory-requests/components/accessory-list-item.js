import React, { Component } from 'react';
import oFetch from 'o-fetch';
import { BossCheckCard, BossCheckCardCollapsibleGroup } from '~/components/boss-check-card';

import { BossTable } from '~/components/boss-table';

import AccessoryRequestsList from './accessory-requests-list';
import AccessoryRequestItem from './accessory-request-item';

class AccessoryListItem extends Component {
  render() {
    const actions = oFetch(this.props, 'actions');
    const data = oFetch(this.props, 'data');
    const getAccessoryRequestPermission = oFetch(this.props, 'getAccessoryRequestPermission');
    const getAccessoryRefundRequestPermission = oFetch(this.props, 'getAccessoryRefundRequestPermission');

    const [name, requests, staffMembers, refundRequests, accessory, requestsCount, refundRequestsCount] = oFetch(
      data,
      'name',
      'requests',
      'staffMembers',
      'refundRequests',
      'accessory',
      'requestsCount',
      'refundRequestsCount',
    );

    const [
      acceptAccessoryRequest,
      rejectAccessoryRequest,
      acceptAccessoryRefundRequest,
      rejectAccessoryRefundRequest,
      undoAccessoryRequest,
      undoAccessoryRefundRequest,
      completeAccessoryRequest,
      completeAccessoryRefundRequest,
    ] = oFetch(
      actions,
      'acceptAccessoryRequest',
      'rejectAccessoryRequest',
      'acceptAccessoryRefundRequest',
      'rejectAccessoryRefundRequest',
      'undoAccessoryRequest',
      'undoAccessoryRefundRequest',
      'completeAccessoryRequest',
      'completeAccessoryRefundRequest',
    );

    return (
      <BossCheckCard title={name} className="boss-check__title_role_accessory">
        <BossCheckCardCollapsibleGroup title="Requests" text={requestsCount} showCaret={requestsCount !== 0}>
          <AccessoryRequestsList
            accessory={accessory}
            accessoryRequests={requests}
            staffMembers={staffMembers}
            paginate
            pageSize={5}
            requestItemRenderer={data => {
              const requestId = oFetch(data, 'requestId');
              const permissionsJS = getAccessoryRequestPermission(requestId).toJS();
              return (
                <AccessoryRequestItem
                  onRejectRequest={rejectAccessoryRequest}
                  onAcceptRequest={acceptAccessoryRequest}
                  onUndoRequest={undoAccessoryRequest}
                  onCompleteRequest={completeAccessoryRequest}
                  permissions={permissionsJS}
                  data={data}
                />
              );
            }}
          />
        </BossCheckCardCollapsibleGroup>
        <BossCheckCardCollapsibleGroup title="Refunds" text={refundRequestsCount} showCaret={refundRequestsCount !== 0}>
          <BossTable className="boss-table_page_accessory-requests-card">
            <AccessoryRequestsList
              accessory={accessory}
              accessoryRequests={refundRequests}
              staffMembers={staffMembers}
              paginate
              pageSize={5}
              requestItemRenderer={data => {
                const requestId = oFetch(data, 'requestId');
                const permissionsJS = getAccessoryRefundRequestPermission(requestId).toJS();

                return (
                  <AccessoryRequestItem
                    onAcceptRequest={acceptAccessoryRefundRequest}
                    onRejectRequest={rejectAccessoryRefundRequest}
                    onUndoRequest={undoAccessoryRefundRequest}
                    onCompleteRequest={completeAccessoryRefundRequest}
                    permissions={permissionsJS}
                    data={data}
                  />
                );
              }}
            />
          </BossTable>
        </BossCheckCardCollapsibleGroup>
      </BossCheckCard>
    );
  }
}

export default AccessoryListItem;
