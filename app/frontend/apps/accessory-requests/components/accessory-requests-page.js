import React from 'react';
import {
  SimpleDashboard,
  DashboardActions,
} from '~/components/boss-dashboards';

import VenueSelect from './venue-select';

import AccessoryList from './accessory-list';

class AccessoryRequestsPage extends React.Component {

  handleAcceptRequest = ({requestId, accessoryId}) => {
    return this.props.actions.acceptAccessoryRequest({requestId, accessoryId});
  }

  handleRejectRequest = ({requestId, accessoryId}) => {
    return this.props.actions.rejectAccessoryRequest({requestId, accessoryId});
  }

  handleUndoAcceptedRequest = ({requestId, accessoryId}) => {
    return this.props.actions.undoAcceptedAccessoryRequest({requestId, accessoryId});
  }

  handleUndoRejectedRequest = ({requestId, accessoryId}) => {
    return this.props.actions.undoRejectedAccessoryRequest({requestId, accessoryId});
  }

  handleDoneAcceptedRequest = (requestId) => { return new Promise((resolve, reject) => { setTimeout(() => {resolve(console.log(`done accepted request ${requestId}`))}, 2500) }) }
  // handleUndoAcceptedRequest = (requestId) => { return new Promise((resolve, reject) => { setTimeout(() => {resolve(console.log(`undo accepted request ${requestId}`))}, 2500) }) }
  handleDoneRejectedRequest = (requestId) => { return new Promise((resolve, reject) => { setTimeout(() => {resolve(console.log(`done rejected request ${requestId}`))}, 2500) }) }

  handleVenueChange = (venue) => {
    this.props.actions.changeVenue(venue);
  }

  handleLoadMore = () => {
    this.props.actions.loadMoreClick();
  }

  getAccessories() {
    const {accessories, pagination: {pageNumber, perPage}} = this.props;
    const slice = pageNumber * perPage;
    if (accessories.length) {
      return accessories.slice(0, slice);
    }
    return [];
  }

  render() {
    const accessories = this.getAccessories();
    const isShowLoadMore = accessories.length < this.props.pagination.totalCount;

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
          staffMembers={this.props.staffMembers.toJS()}
          onAcceptRequest={this.handleAcceptRequest}
          onRejectRequest={this.handleRejectRequest}
          onLoadMoreClick={this.handleLoadMore}
          totalCount={this.props.pagination.totalCount}
          isShowLoadMore={isShowLoadMore}
          onDoneAcceptedRequest={this.handleDoneAcceptedRequest}
          onUndoAcceptedRequest={this.handleUndoAcceptedRequest}
          onDoneRejectedRequest={this.handleDoneRejectedRequest}
          onUndoRejectedRequest={this.handleUndoRejectedRequest}
        />
      </div>
    )
  }
}

export default AccessoryRequestsPage;
