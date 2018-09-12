import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import humanize from 'string-humanize';
import pluralize from 'pluralize';
import oFetch from 'o-fetch';

import ContentModal from '~/components/content-modal';
import { getOwedHoursWeeks } from '../selectors';

import {
  updateAvatarRequest,
  addNewOwedHours,
  cancelAddNewOwedHours,
  deleteOwedHours,
  cancelEditOwedHours,
  openEditModal,
  filter,
} from '../actions';

import OwedHoursHeader from '../components/owed-hours-header';
import OwedHoursTable from '../components/owed-hours-table';
import OwedHoursFilter from '../components/owed-hours-filter';
import AddNewOwedHours from '../components/add-new-owed-hours';
import EditOwedHours from '../components/edit-owed-hours';
import ProfileWrapper from '../../profile-wrapper';

const mapStateToProps = state => {
  return {
    staffMember: state.getIn(['profile', 'staffMember']),
    owedHours: getOwedHoursWeeks(state),
    newOwedHour: state.getIn(['owedHours', 'newOwedHour']),
    editOwedHour: state.getIn(['owedHours', 'editOwedHour']),
    editedOwedHours: state.getIn(['owedHours', 'editedOwedHours']),
    disabled: state.getIn(['profile', 'staffMember', 'disabled']),
    startDate: state.getIn(['owedHours', 'startDate']),
    endDate: state.getIn(['owedHours', 'endDate']),
    permissionsData: state.getIn(['owedHours', 'permissionsData']),
    payslipStartDate: state.getIn(['owedHours', 'payslipStartDate']),
    payslipEndDate: state.getIn(['owedHours', 'payslipEndDate']),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        updateAvatarRequest,
        addNewOwedHours,
        cancelAddNewOwedHours,
        deleteOwedHours,
        cancelEditOwedHours,
        openEditModal,
        filter,
      },
      dispatch,
    ),
  };
};

@connect(mapStateToProps, mapDispatchToProps)
class OwedHours extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onAddNew = () => {
    this.props.actions.addNewOwedHours();
  };

  onCancelAddNew = () => {
    this.props.actions.cancelAddNewOwedHours();
  };

  onCanceEdit = () => {
    this.props.actions.cancelEditOwedHours();
  };

  onOpenEdit = () => {
    this.props.actions.openEditModal();
  };

  render() {
    const {
      staffMember,
      newOwedHour,
      editOwedHour,
      owedHours,
      editedOwedHours,
      disabled,
      startDate,
      endDate,
      payslipStartDate,
      payslipEndDate,
      actions: {
        updateAvatarRequest,
        addNewOwedHours,
        cancelAddNewOwedHours,
        cancelEditOwedHours,
        deleteOwedHours,
        openEditModal,
        filter,
      },
    } = this.props;

    const permissionsData = oFetch(this, 'props.permissionsData').toJS();
    const canCreateOwedHours = oFetch(permissionsData, 'canCreateOwedHours');
    const owedHoursPermissions = oFetch(permissionsData, 'owedHoursPermissions');

    return (
      <ProfileWrapper currentPage="owed_hours">
        <section className="boss-board">
          <ContentModal show={newOwedHour} onClose={() => this.onCancelAddNew()} title="Add owed hours">
            <AddNewOwedHours />
          </ContentModal>
          <ContentModal show={editOwedHour} onClose={() => this.onCanceEdit()} title="Edit owed hours">
            <EditOwedHours owedHour={editedOwedHours} />
          </ContentModal>
          <OwedHoursHeader
            canCreateOwedHours={canCreateOwedHours}
            isStaffMemberDisabled={disabled}
            title="Owed hours"
            onAddNew={this.onAddNew}
          />
          <div className="boss-board__main">
            <div className="boss-board__manager">
              <OwedHoursFilter
                startDate={startDate}
                endDate={endDate}
                filter={filter}
                payslipStartDate={payslipStartDate}
                payslipEndDate={payslipEndDate}
              />
              <OwedHoursTable
                isStaffMemberDisabled={disabled}
                owedHours={owedHours}
                deleteOwedHours={deleteOwedHours}
                openEditModal={openEditModal}
                owedHoursPermissions={owedHoursPermissions}
              />
            </div>
          </div>
        </section>
      </ProfileWrapper>
    );
  }
}

export default OwedHours;
