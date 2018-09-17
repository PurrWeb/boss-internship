import React, { Component } from 'react';
import oFetch from 'o-fetch';

import { BossTable } from '~/components/boss-table';

class AccessoryRequestsList extends Component {
  static defaultProps = {
    pageSize: 5,
    accessoryRequests: [],
    paginate: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      requests: props.paginate ? props.accessoryRequests.slice(0, props.pageSize) : props.accessoryRequests,
    };
  }

  renderAccessoryRequests(accessoryRequests, accessory, staffMembers) {
    const accessoryId = oFetch(accessory, 'id');

    return accessoryRequests.map(request => {
      const staffMember = staffMembers.find(
        staffMember => oFetch(staffMember, 'id') === oFetch(request, 'staffMemberId'),
      );
      if (!staffMember) {
        throw new Error('Something went wrong, staff member must present');
      }

      const avatarUrl = oFetch(staffMember, 'avatarUrl');
      const fullName = oFetch(staffMember, 'fullName');

      const accessorySize = oFetch(request, 'size') || 'N/A';
      const requestId = oFetch(request, 'id');
      const accessoryId = oFetch(accessory, 'id');
      const requestStatus = oFetch(request, 'status');
      const frozen = oFetch(request, 'frozen');

      const requestData = {
        avatarUrl,
        fullName,
        accessorySize,
        requestId,
        accessoryId,
        staffMember,
        requestStatus,
        frozen,
      };

      return React.cloneElement(this.props.requestItemRenderer(requestData), {
        key: requestId,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(state => ({
      requests: nextProps.accessoryRequests.slice(0, state.requests.length),
    }));
  }

  onLoadMoreClick = () => {
    this.setState(state => ({
      requests: this.props.accessoryRequests.slice(0, state.requests.length + this.props.pageSize),
    }));
  };

  renderLoadMore() {
    return (
      <div className="boss-page-main__actions boss-page-main__actions_position_last">
        <button
          onClick={this.onLoadMoreClick}
          className="boss-button boss-button_role_load-more boss-button_adjust_full-mobile"
        >
          Load more
        </button>
      </div>
    );
  }

  render() {
    const { accessory, staffMembers } = this.props;
    const showLoadMore =
      this.props.paginate &&
      this.state.requests.length > 0 &&
      this.state.requests.length < this.props.accessoryRequests.length;
    return (
      <BossTable className="boss-table_page_accessory-requests-card">
        {this.renderAccessoryRequests(this.state.requests, accessory, staffMembers)}
        {showLoadMore && this.renderLoadMore()}
      </BossTable>
    );
  }
}

AccessoryRequestsList.defaultProps = {
  accessoryRequests: [],
};

export default AccessoryRequestsList;
