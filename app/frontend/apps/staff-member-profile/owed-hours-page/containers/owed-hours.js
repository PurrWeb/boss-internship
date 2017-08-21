import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import humanize from 'string-humanize';
import pluralize from 'pluralize';

import ContentModal from '~/components/content-modal';

import {
  updateAvatarRequest,
  addNewOwedHours,
  cancelAddNewOwedHours,
  deleteOwedHours,
  cancelEditOwedHours,
  openEditModal,
} from '../actions';

import OwedHoursHeader from '../components/owed-hours-header';
import OwedHoursTable from '../components/owed-hours-table';
import AddNewOwedHours from '../components/add-new-owed-hours';
import EditOwedHours from '../components/edit-owed-hours';
import ProfileWrapper from '../../profile-wrapper';

const mapStateToProps = (state) => {
  return {
    staffMember: state.getIn(['owedHours','staffMember']),
    owedHours: state.getIn(['owedHours','owedHours']),
    newOwedHour: state.getIn(['owedHours', 'newOwedHour']),
    editOwedHour: state.getIn(['owedHours', 'editOwedHour']),
    editedOwedHours: state.getIn(['owedHours', 'editedOwedHours']),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      updateAvatarRequest,
      addNewOwedHours,
      cancelAddNewOwedHours,
      deleteOwedHours,
      cancelEditOwedHours,
      openEditModal,
    }, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class OwedHours extends React.PureComponent {

  constructor(props){
    super(props);
  }
  
  onAddNew = () => {
    this.props.actions.addNewOwedHours();
  }

  onCancelAddNew = () => {
    this.props.actions.cancelAddNewOwedHours();
  }

  onCanceEdit = () => {
    this.props.actions.cancelEditOwedHours();
  }

  onOpenEdit = () => {
    this.props.actions.openEditModal();
  }

  render() {

    const {
      staffMember,
      newOwedHour,
      editOwedHour,
      owedHours,
      editedOwedHours,
      actions: {
        updateAvatarRequest,
        addNewOwedHours,
        cancelAddNewOwedHours,
        cancelEditOwedHours,
        deleteOwedHours,
        openEditModal,
      }
    } = this.props;
    return (
      <ProfileWrapper currentPage="owed_hours">
        <ContentModal
            show={newOwedHour}
            onClose={() => this.onCancelAddNew()}
            title="Add owed hours"
          >
          <AddNewOwedHours
            />
        </ContentModal>
        <ContentModal
          show={editOwedHour}
          onClose={() => this.onCanceEdit()}
          title="Edit owed hours"
        >
          <EditOwedHours owedHour={editedOwedHours}/>
        </ContentModal>
        <section className="boss-board">
          <OwedHoursHeader title="Owed hours" onAddNew={this.onAddNew} />
          <div className="boss-board__main">
            <div className="boss-board__manager">
              <OwedHoursTable owedHours={owedHours} deleteOwedHours={deleteOwedHours} openEditModal={openEditModal} />
            </div>
          </div> 
        </section>
      </ProfileWrapper>
    )
  }
}

export default OwedHours;
