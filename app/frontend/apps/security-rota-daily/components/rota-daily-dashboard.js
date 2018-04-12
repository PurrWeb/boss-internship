import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BossSelect from '~/components/boss-select';
import DashboardWrapper from '~/components/dashboard-wrapper';
import { addNewShift, cancelAddNewShift } from '../actions';

const mapStateToProps = state => {
  return {
    isAddingNewShift: state.getIn(['page', 'isAddingNewShift']),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        addNewShift,
        cancelAddNewShift,
      },
      dispatch,
    ),
  };
};

@connect(mapStateToProps, mapDispatchToProps)
class RotaDailyDashboard extends React.Component {
  render() {
    const { actions: { addNewShift, cancelAddNewShift } } = this.props;
    return (
      <DashboardWrapper>
        <div className="boss-page-dashboard boss-page-dashboard_updated boss-page-dashboard_page_rotas-daily-security">
          <h1 className="boss-page-dashboard__title">Security Rota</h1>
          <div className="boss-page-dashboard__buttons-group">
            {this.props.isAddingNewShift ? (
              <button
                onClick={cancelAddNewShift}
                className="boss-button boss-button_role_cancel boss-page-dashboard__button"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={addNewShift}
                className="boss-button boss-button_role_add boss-page-dashboard__button"
              >
                Add New Shift Hours
              </button>
            )}
          </div>
        </div>
      </DashboardWrapper>
    );
  }
}

export default RotaDailyDashboard;
