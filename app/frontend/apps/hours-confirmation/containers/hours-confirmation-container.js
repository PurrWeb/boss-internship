import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import HoursConfirmation from '../components/hours-confirmation';
import { data, getVenueByIdSelector } from '../selectors';
import {
  unacceptPeriodAction,
  deletePeriodAction,
  updatePeriodData,
  acceptPeriodAction,
  addNewAcceptancePeriodAction,
  clockOutAction,
  handleDonePeriodsAction,
} from '../redux/actions';

const mapStateToProps = state => {
  return {
    clockInOutData: data(state),
    staffMembers: state.get('staffMembers'),
    staffTypes: state.get('staffTypes'),
    hoursAcceptanceBreaks: state.get('hoursAcceptanceBreaks'),
    pageOptions: state.get('pageOptions'),
    venues: state.get('venues'),
    getVenueById: getVenueByIdSelector(state),
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
        clockOutAction,
        handleDonePeriodsAction,
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
