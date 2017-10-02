import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  DashboardWrapper,
  DashboardTitle,
} from "~/components/dashboard";

import MachinesRefloatsFilter from '../components/machines-refloats-filter';

import {
  showRecordRefloat,
  hideRecordRefloat,
  filterMachinesRefloat,
} from '../actions';

const mapStateToProps = (state) => {
  return {
    isRecordRefloat: state.getIn(['page', 'isRecordRefloat']),
    filter: state.getIn(['page', 'filter']),
    machinesRefloatsUsers: state.getIn(['page', 'machinesRefloatsUsers']),
    venueMachines: state.getIn(['page', 'venueMachines']),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      showRecordRefloat,
      hideRecordRefloat,
      filterMachinesRefloat,
    }, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MachhinesRefloatsDashboard extends React.Component {
  handleFilterUpdate = (values) => {
    return this.props.actions.filterMachinesRefloat(values);
  }
  
  render() {
    const {
      isRecordRefloat,
      filter,
      machinesRefloatsUsers,
      venueMachines,
      actions: {
        showRecordRefloat,
        hideRecordRefloat,
      }
    } = this.props;
    console.log(venueMachines.size);
    return (
      <DashboardWrapper classes="boss-page-dashboard_updated">
        <DashboardTitle
          title="Machine Refloats"
        >
          { isRecordRefloat
              ? <button
                  onClick={() => hideRecordRefloat()}
                  className="boss-button boss-button_role_cancel boss-page-dashboard__button"
                >Cancel</button>
              : venueMachines.size !== 0 && <button
                  onClick={() => showRecordRefloat()}
                  className="boss-button boss-button_role_add boss-page-dashboard__button"
                >Record Refloat</button>
          }
        </DashboardTitle>
        {
          !isRecordRefloat && <MachinesRefloatsFilter
            venueMachines={venueMachines.toJS()}
            machinesRefloatsUsers={machinesRefloatsUsers.toJS()}
            filterData={filter.toJS()}
            onFilterUpdate={this.handleFilterUpdate}
          />
        }
      </DashboardWrapper>
    )
  }
}
