import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import HoursConfirmation from '../components/hours-confirmation';
import { data } from '../selectors';
import {
  unacceptPeriodAction,
  deletePeriodAction,
  updatePeriodData,
  acceptPeriodAction,
  addNewAcceptancePeriodAction,
} from '../redux/actions';

const mapStateToProps = state => {
  return {
    clockInOutData: data(state),
    staffMembers: state.get('staffMembers'),
    staffTypes: state.get('staffTypes'),
    hoursAcceptanceBreaks: state.get('hoursAcceptanceBreaks'),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        unacceptPeriodAction,
        deletePeriodAction,
        updatePeriodData,
        acceptPeriodAction,
        addNewAcceptancePeriodAction,
      },
      dispatch,
    ),
  };
};

@connect(mapStateToProps, mapDispatchToProps)
class HoursConfirmationContainer extends Component {
  render() {
    return <HoursConfirmation {...this.props} />;
  }
}

export default HoursConfirmationContainer;
