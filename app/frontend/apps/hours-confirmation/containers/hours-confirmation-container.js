import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import HoursConfirmation from '../components/hours-confirmation';
import { data } from '../selectors';

const mapStateToProps = state => {
  return {
    clockInOutData: data(state),
    staffMembers: state.get('staffMembers'),
    staffTypes: state.get('staffTypes'),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({}, dispatch),
  };
};

@connect(mapStateToProps, mapDispatchToProps)
class HoursConfirmationContainer extends Component {
  render() {
    return <HoursConfirmation {...this.props} />;
  }
}

export default HoursConfirmationContainer;
