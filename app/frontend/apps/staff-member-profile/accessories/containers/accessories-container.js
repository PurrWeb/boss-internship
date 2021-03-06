import React from 'react';
import ProfileWrapper from '../../profile-wrapper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AccessoriesPage from '../components/accessories-page';
import { canCreateAccessoryRequest, getAccessoryRequestPermission } from '../selectors';

import {
  newAccessory,
  cancelAccessory,
  refundAccessory,
  filter,
  editAccessoryRequestPayslipDate,
  editAccessoryRefundRequestPayslipDate
} from '../redux/actions';

const mapStateToProps = state => {
  return {
    accessories: state.getIn(['accessoriesPage', 'accessories']),
    accessoryRequests: state.getIn(['accessoriesPage', 'accessoryRequests']),
    staffMember: state.getIn(['profile', 'staffMember']),
    mPayslipStartDate: state.getIn(['accessoriesPage', 'mPayslipStartDate']),
    mPayslipEndDate: state.getIn(['accessoriesPage', 'mPayslipEndDate']),
    getAccessoryRequestPermission: getAccessoryRequestPermission(state),
    canCreateAccessoryRequest: canCreateAccessoryRequest(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        newAccessory,
        cancelAccessory,
        refundAccessory,
        filter,
        editAccessoryRequestPayslipDate,
        editAccessoryRefundRequestPayslipDate
      },
      dispatch,
    ),
  };
};

@connect(mapStateToProps, mapDispatchToProps)
class AccessoriesContainer extends React.Component {
  render() {
    return (
      <ProfileWrapper currentPage="accessories">
        <AccessoriesPage {...this.props} />
      </ProfileWrapper>
    );
  }
}

export default AccessoriesContainer;
