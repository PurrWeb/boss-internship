import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AccessoryRequestsPage from '../components/accessory-requests-page';
import { getAccessoryRefundRequestPermission, getAccessoryRequestPermission } from '../selectors';

import {
  changeVenue,
  loadInitialData,
  loadMoreClick,
  acceptAccessoryRequest,
  rejectAccessoryRequest,
  acceptAccessoryRefundRequest,
  rejectAccessoryRefundRequest,
  undoAccessoryRequest,
  undoAccessoryRefundRequest,
  completeAccessoryRequest,
  completeAccessoryRefundRequest,
} from '../redux/actions';

const mapStateToProps = state => {
  return {
    venues: state.getIn(['accessoryRequestsPage', 'venues']),
    currentVenue: state.getIn(['accessoryRequestsPage', 'currentVenue']),
    accessories: state.getIn(['accessoryRequestsPage', 'accessories']),
    accessoryRequests: state.getIn(['accessoryRequestsPage', 'accessoryRequests']),
    accessoryRefundRequests: state.getIn(['accessoryRequestsPage', 'accessoryRefundRequests']),
    staffMembers: state.getIn(['accessoryRequestsPage', 'staffMembers']),
    pagination: state.getIn(['accessoryRequestsPage', 'pagination']),
    getAccessoryRequestPermission: getAccessoryRequestPermission(state),
    getAccessoryRefundRequestPermission: getAccessoryRefundRequestPermission(state),
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
        acceptAccessoryRefundRequest,
        rejectAccessoryRefundRequest,
        undoAccessoryRequest,
        undoAccessoryRefundRequest,
        completeAccessoryRequest,
        completeAccessoryRefundRequest,
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
