import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AccessoryRequestsPage from '../components/accessory-requests-page';

import {
  changeVenue,
  loadInitialData,
  loadMoreClick,
  acceptAccessoryRequest,
  rejectAccessoryRequest,
  undoAccessoryRequest,
  acceptAccessoryRefundRequest,
  rejectAccessoryRefundRequest,
  undoRefundRequest,
} from '../redux/actions';

const mapStateToProps = state => {
  return {
    venues: state.getIn(['accessoryRequestsPage', 'venues']),
    currentVenue: state.getIn(['accessoryRequestsPage', 'currentVenue']),
    accessories: state.getIn(['accessoryRequestsPage', 'accessories']),
    accessoryRequests: state.getIn([
      'accessoryRequestsPage',
      'accessoryRequests',
    ]),
    accessoryRefundRequests: state.getIn([
      'accessoryRequestsPage',
      'accessoryRefundRequests',
    ]),
    staffMembers: state.getIn(['accessoryRequestsPage', 'staffMembers']),
    pagination: state.getIn(['accessoryRequestsPage', 'pagination']),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        changeVenue,
        loadInitialData,
        loadMoreClick,
        acceptAccessoryRequest,
        rejectAccessoryRequest,
        undoAccessoryRequest,
        acceptAccessoryRefundRequest,
        rejectAccessoryRefundRequest,
        undoRefundRequest,
      },
      dispatch,
    ),
  };
};

@connect(mapStateToProps, mapDispatchToProps)
class AccessoryRequestsContainer extends React.Component {
  componentWillMount() {
    this.props.actions.loadInitialData();
  }

  render() {
    const props = {
      ...this.props,
      accessories: this.props.accessories.toJS(),
      pagination: this.props.pagination.toJS(),
    };
    return <AccessoryRequestsPage {...props} />;
  }
}

export default AccessoryRequestsContainer;
