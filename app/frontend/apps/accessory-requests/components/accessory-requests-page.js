import React from 'react';
import oFetch from 'o-fetch';
import { SimpleDashboard, DashboardActions } from '~/components/boss-dashboards';

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
    const isShowLoadMore = accessories.length < this.props.pagination.totalCount;
    const venuesJs = oFetch(this.props, 'venues').toJS();
    const currentVenue = oFetch(this.props, 'currentVenue');
    const accessoryRequestsJs = oFetch(this.props, 'accessoryRequests').toJS();
    const accessoryRefundRequestsJs = oFetch(this.props, 'accessoryRefundRequests').toJS();
    const staffMembersJs = oFetch(this.props, 'staffMembers').toJS();
    const getAccessoryRequestPermission = oFetch(this.props, 'getAccessoryRequestPermission');
    const getAccessoryRefundRequestPermission = oFetch(this.props, 'getAccessoryRefundRequestPermission');

    return (
      <div>
        <SimpleDashboard title="Accessory Requests">
          <DashboardActions>
            <VenueSelect venues={venuesJs} selected={currentVenue} onChange={this.handleVenueChange} />
          </DashboardActions>
        </SimpleDashboard>
        <AccessoryList
          accessories={this.getAccessories()}
          accessoryRequests={accessoryRequestsJs}
          accessoryRefundRequests={accessoryRefundRequestsJs}
          staffMembers={staffMembersJs}
          onLoadMoreClick={this.handleLoadMore}
          totalCount={this.props.pagination.totalCount}
          isShowLoadMore={isShowLoadMore}
          accessoryItemRenderer={data => (
            <AccessoryListItem
              getAccessoryRequestPermission={getAccessoryRequestPermission}
              getAccessoryRefundRequestPermission={getAccessoryRefundRequestPermission}
              actions={this.props.actions}
              data={data}
            />
          )}
        />
      </div>
    );
  }
}

export default AccessoryRequestsPage;
