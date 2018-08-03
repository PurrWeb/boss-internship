import React, { Component } from 'react';
import oFetch from 'o-fetch';
import { BossTableRow, BossTableCell } from '~/components/boss-table';
import { UserSummary } from '~/components/staff-members';
import AccessoryRequestActions from './accessory-request-actions';

class AccessoryRequestItem extends Component {
  render() {
    const data = oFetch(this.props, 'data');
    const permissions = oFetch(this.props, 'permissions');
    const onRejectRequest = oFetch(this.props, 'onRejectRequest');
    const onAcceptRequest = oFetch(this.props, 'onAcceptRequest');
    const onUndoRequest = oFetch(this.props, 'onUndoRequest');
    const onCompleteRequest = oFetch(this.props, 'onCompleteRequest');

    const [accessoryId, avatarUrl, fullName, accessorySize, staffMember, requestId, requestStatus, frozen] = oFetch(
      data,
      'accessoryId',
      'avatarUrl',
      'fullName',
      'accessorySize',
      'staffMember',
      'requestId',
      'requestStatus',
      'frozen',
    );

    return (
      <BossTableRow>
        <BossTableCell>
          <UserSummary
            className="boss-user-summary_role_review-short"
            src={avatarUrl}
            alt={fullName}
            fullName={fullName}
          />
        </BossTableCell>
        <BossTableCell>
          <div className="boss-table__actions">
            <a
              href={`staff_members/${staffMember.id}/accessories`}
              className="boss-button boss-button_type_extra-small boss-button_role_view-report boss-table__action"
            >
              History
            </a>
          </div>
        </BossTableCell>
        <BossTableCell>
          <p className="boss-table__text">Size: {accessorySize}</p>
        </BossTableCell>
        <BossTableCell>
          {!frozen && (
            <AccessoryRequestActions
              status={requestStatus}
              permissions={permissions}
              onRejectRequest={() =>
                onRejectRequest({
                  requestId: requestId,
                  accessoryId: accessoryId,
                })
              }
              onAcceptRequest={() =>
                onAcceptRequest({
                  requestId: requestId,
                  accessoryId: accessoryId,
                })
              }
              onUndoRequest={() =>
                onUndoRequest({
                  requestId: requestId,
                  accessoryId: accessoryId,
                })
              }
              onCompleteRequest={() =>
                onCompleteRequest({
                  requestId: requestId,
                  accessoryId: accessoryId,
                })
              }
            />
          )}
        </BossTableCell>
      </BossTableRow>
    );
  }
}

export default AccessoryRequestItem;
