import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MachinesIndexDashboard from '../components/machines-index-dashboard';
import ContentWrapper from '~/components/content-wrapper';
import MachinesFilter from '../components/machines-filter';
import MachinesIndexBoard from '../components/machines-index-board';
import AddNewMachine from '../components/add-new-machine';
import RestoreMachine from '../components/restore-machine';
import ContentModal from '~/components/content-modal';
import EditMachine from '../components/edit-machine';
import confirm from '~/lib/confirm-utils';
import Pagination from '~/components/pagination';

import {
  showEditMachine,
  hideEditMachine,
  disableMachine,
  showRestoreMachine,
  hideRestoreMachine,
  showAddNewMachine,
  hideAddNewMachine,
} from '../actions';

const mapStateToProps = (state) => {
  return {
    machines: state.getIn(['page', 'machines']),
    machinesCreators: state.getIn(['page', 'machinesCreators']),
    editMachine: state.getIn(['page', 'editMachine']),
    restoreMachine: state.getIn(['page', 'restoreMachine']),
    filter: state.getIn(['page', 'filter']),
    accessibleVenues: state.getIn(['page', 'accessibleVenues']),
    currentVenueId: state.getIn(['page', 'currentVenueId']),
    addingMachine: state.getIn(['page', 'addingMachine']),
    pageCount: state.getIn(['page', 'pagination', 'pageCount']),
    currentPage: state.getIn(['page', 'pagination', 'currentPage']),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      showEditMachine,
      hideEditMachine,
      disableMachine,
      showRestoreMachine,
      hideRestoreMachine,
      showAddNewMachine,
      hideAddNewMachine,
    }, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MachinesIndexPage extends React.Component {
  onDisable = (machineId) => {
    confirm('Are you sure ?', {
      title: 'Disable machine',
      actionButtonText: 'Disable',
    }).then(() => {
      this.props.actions.disableMachine(machineId);
    });
  }

  onRestoreMachine = (machine) => {
    this.props.actions.showRestoreMachine(machine);
  }

  renderMachinesList(machines, machinesCreators) {
    return machines.map((machine, index) => {
      const creator = machinesCreators.find(creator => creator.get('id') === machine.get('creatorId'));
      return(
        <MachinesIndexBoard
          key={index}
          onEdit={(machine) => this.openEditModal(machine)}
          onDisable={(machineId) => this.onDisable(machineId)}
          onRestore={(machine) => this.onRestoreMachine(machine)}
          creator={creator}
          machine={machine}
        />
      ) 
    });
  }
  
  handleCancel = () => {
    this.props.actions.hideAddNewMachine();
    this.props.actions.hideRestoreMachine();
  }
  
  onAddNewClick = () => {
    this.props.actions.showAddNewMachine();
  }

  openEditModal = (machine) => {
    this.props.actions.showEditMachine(machine);
  }

  closeEditModal = () => {
    this.props.actions.hideEditMachine();
  }

  handleChangePage = (value) => {
    let queryParams = new URLSearchParams(window.location.search);
    queryParams.set('page', value);
    const link = `${window.location.href.split('?')[0]}?${queryParams.toString()}`
    window.location.href = link;
  }

  render() {
    const {
      machines,
      machinesCreators,
      editMachine,
      restoreMachine,
      filter,
      addingMachine,
      pageCount,
      currentPage,
      accessibleVenues,
      currentVenueId,
    } = this.props;

    return (
      <div>
        <ContentModal
          show={!!editMachine}
          onClose={this.closeEditModal}
          title="Edit Machine"
        >
          <EditMachine machine={editMachine} />
        </ContentModal>
        <MachinesIndexDashboard
          title="Machines"
          venues={accessibleVenues.toJS()}
          selectedVenueId={currentVenueId}
          showCancelButton={addingMachine || !!restoreMachine}
          addNewClick={this.onAddNewClick}
          cancelAction={this.handleCancel}
        />
        <ContentWrapper>
          { addingMachine && <AddNewMachine />}
          { !!restoreMachine && <RestoreMachine machine={restoreMachine} />}
          { (!addingMachine && !restoreMachine) &&
            [
              <MachinesFilter selectedFilter={filter} key="machineFilter" />,
              this.renderMachinesList(machines, machinesCreators),
              pageCount > 1 && <Pagination key="pagination" pageCount={pageCount} initialPage={currentPage} onPageChange={this.handleChangePage} />
            ]
          }
        </ContentWrapper>
      </div>
    )
  }
}
