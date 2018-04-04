import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({}, dispatch)
  };
}
@connect(mapStateToProps, mapDispatchToProps)
class HolidayRequestsUI extends React.Component {
  render(){
    return <div>Thank God</div>
  }
}

export default HolidayRequestsUI;
