import React from 'react';
import {
  SimpleDashboard,
  DashboardActions,
} from '~/components/boss-dashboards';

import VenueSelect from './venue-select';

import AccessoryList from './accessory-list';
import AccessoryListItem from './accessory-list-item';
class AccessoryRequestsPage extends React.Component {
  handleVenueChange = venue => {
    this.props.actions.changeVenue(venue);
  };

  handleLoadMore = () => {
    this.props.actions.loadMoreClick();
  };

  getAccessories() {
    const { accessories, pagination: { pageNumber, perPage } } = this.props;
    const slice = pageNumber * perPage;
    if (accessories.length) {
      return accessories.slice(0, slice);
    }
    return [];
  }

  render() {
    const accessories = this.getAccessories();
    const isShowLoadMore =
      accessories.length < this.props.pagination.totalCount;

    return (
      <div>
        <SimpleDashboard title="Accessory Requests">
          <DashboardActions>
            <VenueSelect
              venues={this.props.venues.toJS()}
              selected={this.props.currentVenue}
              onChange={this.handleVenueChange}
            />
          </DashboardActions>
        </SimpleDashboard>
        <AccessoryList
          accessories={this.getAccessories()}
          accessoryRequests={this.props.accessoryRequests.toJS()}
          accessoryRefundRequests={this.props.accessoryRefundRequests.toJS()}
          staffMembers={this.props.staffMembers.toJS()}
          onLoadMoreClick={this.handleLoadMore}
          totalCount={this.props.pagination.totalCount}
          isShowLoadMore={isShowLoadMore}
          accessoryItemRenderer={data => (
            <AccessoryListItem actions={this.props.actions} data={data} />
          )}
        />
      </div>
    );
  }
}

export default AccessoryRequestsPage;
