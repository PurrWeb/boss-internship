import React from 'react';
import oFetch from 'o-fetch';
import AsyncButton from 'react-async-button';

import {
  BossCheckCard,
  BossCheckRow,
  BossCheckCardCollapsibleGroup,
} from '~/components/boss-check-card';

import ContentWrapper from '~/components/content-wrapper';

import {
  BossTable,
  BossTableRow,
  BossTableCell,
} from '~/components/boss-table';

import { UserSummary } from '~/components/staff-members';

class AccessoryList extends React.Component {
  renderRequestActions(request, accessoryId) {
    const status = oFetch(request, 'status');
    const requestId = oFetch(request, 'id');

    if (status === 'pending') {
      return (
        <div className="boss-table__actions">
          <AsyncButton
            className="boss-button boss-button_type_small boss-button_role_success boss-table__action"
            text="Accept"
            pendingText="Accepting ..."
            onClick={() =>
              this.props.onAcceptRequest({ requestId, accessoryId })
            }
          />
          <AsyncButton
            className="boss-button boss-button_type_small boss-button_role_cancel boss-table__action"
            text="Reject"
            pendingText="Rejecting ..."
            onClick={() =>
              this.props.onRejectRequest({ requestId, accessoryId })
            }
          />
        </div>
      );
    }
    if (status === 'accepted') {
      return [
        <p
          key="status"
          className="boss-table__text boss-table__text_role_success-status"
        >
          Accepted
        </p>,
        <div key="actions" className="boss-table__actions">
          <AsyncButton
            className="boss-button boss-button_type_extra-small boss-button_role_confirm-light boss-table__action"
            text="Done"
            onClick={() =>
              this.props.onDoneAcceptedRequest(requestId, accessoryId)
            }
          />
          <AsyncButton
            className="boss-button boss-button_type_extra-small boss-button_role_cancel-light boss-table__action"
            text="Undo"
            onClick={() =>
              this.props.onUndoAcceptedRequest({ requestId, accessoryId })
            }
          />
        </div>,
      ];
    }
    if (status === 'rejected') {
      return [
        <p
          key="status"
          className="boss-table__text boss-table__text_role_alert-status"
        >
          Rejected
        </p>,
        <div key="actions" className="boss-table__actions">
          <AsyncButton
            className="boss-button boss-button_type_extra-small boss-button_role_confirm-light boss-table__action"
            text="Done"
            onClick={() => this.props.onDoneRejectedRequest(requestId)}
          />
          <AsyncButton
            className="boss-button boss-button_type_extra-small boss-button_role_cancel-light boss-table__action"
            text="Undo"
            onClick={() =>
              this.props.onUndoRejectedRequest({ requestId, accessoryId })
            }
          />
        </div>,
      ];
    }
    return null;
  }

  renderAccessoryRequests(accessory, accessoryRequests, staffMembers) {
    return accessoryRequests.map((request, index) => {
      const staffMember = staffMembers.find(
        staffMember =>
          oFetch(staffMember, 'id') === oFetch(request, 'staffMemberId'),
      );
      if (!staffMember) {
        throw new Error('Something went wrong, staff member must present');
      }

      const avatarUrl = oFetch(staffMember, 'avatarUrl');
      const fullName = oFetch(staffMember, 'fullName');
      const accessorySize = oFetch(request, 'size') || 'N/A';

      return (
        <BossTableRow key={accessory.id}>
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
            {this.renderRequestActions(request, accessory.id)}
          </BossTableCell>
        </BossTableRow>
      );
    });
  }

  renderAccessories(accessories, accessoryRequests, staffMembers) {
    return accessories.map((accessory, index) => {
      const name = oFetch(accessory, 'name');
      const requests = accessoryRequests.filter(
        item => oFetch(item, 'accessoryId') === oFetch(accessory, 'id'),
      );
      const requestsCount = requests.length;

      return (
        <BossCheckCard
          key={accessory.id}
          title={name}
          className="boss-check__title_role_accessory"
        >
          <BossCheckRow
            title="Black Venue"
            className="boss-check__text boss-check__text_role_venue"
          />
          <BossCheckCardCollapsibleGroup title="Requests" text={requestsCount}>
            <BossTable className="boss-table_page_accessory-requests-card">
              {this.renderAccessoryRequests(accessory, requests, staffMembers)}
            </BossTable>
          </BossCheckCardCollapsibleGroup>
          <BossCheckCardCollapsibleGroup title="Rejects" text="3">
            <BossTable className="boss-table_page_accessory-requests-card">
              <BossTableRow>
                <BossTableCell>
                  <UserSummary
                    className="boss-user-summary_role_review-short"
                    src="http://boss-styles.herokuapp.com/images/avatars/jd.jpg"
                    alt="Igor Pugachev"
                    fullName="Igor Pugachev"
                  />
                </BossTableCell>
                <BossTableCell>
                  <div className="boss-table__actions">
                    <button className="boss-button boss-button_type_extra-small boss-button_role_view-report boss-table__action">
                      History
                    </button>
                  </div>
                </BossTableCell>
                <BossTableCell>
                  <p className="boss-table__text">Size: L</p>
                </BossTableCell>
                <BossTableCell>
                  <div className="boss-table__actions">
                    <button className="boss-button boss-button_type_small boss-button_role_success boss-table__action">
                      Accept
                    </button>
                    <button className="boss-button boss-button_type_small boss-button_role_cancel boss-table__action">
                      Reject
                    </button>
                  </div>
                </BossTableCell>
              </BossTableRow>
            </BossTable>
          </BossCheckCardCollapsibleGroup>
        </BossCheckCard>
      );
    });
  }

  render() {
    const { accessories, accessoryRequests, staffMembers } = this.props;

    return (
      <ContentWrapper>
        {this.renderAccessories(accessories, accessoryRequests, staffMembers)}
        {!!this.props.accessories.length && (
          <div className="boss-page-main__count boss-page-main__count_space_large">
            <span className="boss-page-main__count-text">Showing </span>
            <span className="boss-page-main__count-text boss-page-main__count-text_marked">
              {this.props.accessories.length}
            </span>
            <span className="boss-page-main__count-text"> of </span>
            <span className="boss-page-main__count-text boss-page-main__count-text_marked">
              {this.props.totalCount}
            </span>
          </div>
        )}
        {this.props.isShowLoadMore && (
          <div className="boss-page-main__actions boss-page-main__actions_position_last">
            <button
              onClick={this.props.onLoadMoreClick}
              className="boss-button boss-button_role_load-more boss-button_adjust_full-mobile"
            >
              Load more
            </button>
          </div>
        )}
      </ContentWrapper>
    );
  }
}

export default AccessoryList;
