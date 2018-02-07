import React, { Component } from 'react';
import { BossTable, BossTableRow, BossTableCell } from '~/components/boss-table';
import { UserSummary } from '~/components/staff-members';
import AccessoryRequestActions from './accessory-request-actions';

class AccessoryRequestItem extends Component {
  render() {
    const {
      accessoryId,
      avatarUrl,
      fullName,
      accessorySize,
      staffMember,
      requestId,
      requestStatus,
      frozen,
    } = this.props.data;

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
              onRejectRequest={() =>
                this.props.onRejectRequest({
                  requestId: requestId,
                  accessoryId: accessoryId,
                })
              }
              onAcceptRequest={() =>
                this.props.onAcceptRequest({
                  requestId: requestId,
                  accessoryId: accessoryId,
                })
              }
              onUndoRequest={() =>
                this.props.onUndoRequest({
                  requestId: requestId,
                  accessoryId: accessoryId,
                })
              }
              onCompleteRequest={() =>
                this.props.onCompleteRequest({
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
