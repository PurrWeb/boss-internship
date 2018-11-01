import React from 'react';
import oFetch from 'o-fetch';

import ContentWrapper from '~/components/content-wrapper';

class AccessoryList extends React.Component {
  renderAccessories() {
    const [accessories, accessoryRequests, accessoryRefundRequests, staffMembers] = oFetch(
      this.props,
      'accessories',
      'accessoryRequests',
      'accessoryRefundRequests',
      'staffMembers',
    );

    return accessories.map((accessory, index) => {
      const name = oFetch(accessory, 'name');
      const freeItems = oFetch(accessory, 'freeItems');
      const accessoryId = oFetch(accessory, 'id');
      const requests = accessoryRequests.filter(item => oFetch(item, 'accessoryId') === oFetch(accessory, 'id'));
      const refundRequests = accessoryRefundRequests.filter(
        item => oFetch(item, 'accessoryId') === oFetch(accessory, 'id'),
      );
      const requestsCount = requests.length;
      const refundRequestsCount = refundRequests.length;

      const accessoryData = {
        name,
        requests,
        refundRequests,
        requestsCount,
        refundRequestsCount,
        staffMembers,
        accessory,
        freeItems,
        venue: this.props.venue,
      };

      if (requestsCount === 0 && refundRequestsCount === 0) {
        return null;
      }

      return React.cloneElement(this.props.accessoryItemRenderer(accessoryData), {
        key: accessoryId,
      });
    });
  }

  render() {
    const showAccessoryList = !!this.props.accessories.length;
    return (
      <ContentWrapper>
        {this.renderAccessories()}
        {showAccessoryList && (
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
