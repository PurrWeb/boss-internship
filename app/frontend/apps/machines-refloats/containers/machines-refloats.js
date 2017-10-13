import React from "react"
import { connect } from 'react-redux';

import MachinesRefloatsDashboard from '../components/machines-refloats-dashboard';
import MachinesRefloatsList from '../components/machines-refloats-list';
import RecordRefloat from '../components/record-refloat';

const mapStateToProps = (state) => {
  return {
    isRecordRefloat: state.getIn(['page', 'isRecordRefloat']),
    venueMachines: state.getIn(['page', 'venueMachines']),
    machinesRefloats: state.getIn(['page', 'machinesRefloats']),
    pageCount: state.getIn(['page', 'pagination', 'pageCount']),
    currentPage: state.getIn(['page', 'pagination', 'currentPage']),
  };
}
@connect(mapStateToProps)
export default class MachinesRefloats extends React.Component {
  render() {
    const {
      isRecordRefloat,
      venueMachines,
      machinesRefloats,
      pageCount,
      currentPage,
    } = this.props;

    return (
      <div>
        <MachinesRefloatsDashboard />
        { isRecordRefloat
          ? <RecordRefloat machines={venueMachines} />
          : <MachinesRefloatsList
              key="refloatsList"
              pageCount={pageCount}
              currentPage={currentPage}
              machinesRefloats={machinesRefloats}
              machines={venueMachines}
            />
        }
      </div>
    )
  }
}
