import React from 'react';
import ProfileWrapper from '../../profile-wrapper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AccessoriesPage from '../components/accessories-page';

import {
  newAccessory
} from '../redux/actions';

const mapStateToProps = (state) => {
  return {
    accessories: state.getIn(['accessoriesPage', 'accessories']),
    accessoryRequests: state.getIn(['accessoriesPage', 'accessoryRequests']),
    staffMember: state.getIn(['profile', 'staffMember'])
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      newAccessory,
    }, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class AccessoriesContainer extends React.Component {
  render() {
    return (
      <ProfileWrapper currentPage="accessories">
        <AccessoriesPage {...this.props}/>
      </ProfileWrapper>
    )
  }
}

export default AccessoriesContainer;
