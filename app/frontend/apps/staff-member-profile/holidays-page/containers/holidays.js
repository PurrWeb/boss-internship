import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import humanize from 'string-humanize';
import pluralize from 'pluralize';
import { SubmissionError } from 'redux-form/immutable';
import oFetch from 'o-fetch';
import { staffMemberProfileHolidaysPermissions } from '~/lib/permissions';

import notify from '~/components/global-notification';
import { HOLIDAY_TYPE, HOLIDAY_REQUEST_TYPE } from '../selectors';
import ProfileWrapper from '../../profile-wrapper';
import HolidayMobileItems from '../components/holiday-mobile-items';

import {
  updateAvatarRequest,
  addNewHoliday,
  cancelAddNewHoliday,
  deleteHoliday,
  openEditModal,
  closeEditModal,
  filter,
  addHolidayRequest,
  addHoliday,
  deleteHolidayRequest,
  editHolidayRequest,
  editHoliady,
} from '../actions';

import { getHolidaysData } from '../selectors';

import Stats from '../components/stats';
import HolidaysHeader from '../components/holidays-header';
import HolidaysFilter from '../components/holidays-filter';
import HolidaysTable from '../components/holidays-table';
import AddNewHoliday from '../components/add-new-holiday';
import ContentModal from '~/components/content-modal';
import EditHoliday from '../components/edit-holiday';

const mapStateToProps = state => {
  return {
    staffMember: state.getIn(['profile', 'staffMember']),
    isStaffMemberWeeklyPayrate: state.getIn(['profile', 'staffMember', 'is_weekly_payrate']),
    holidays: getHolidaysData(state),
    paidHolidayDays: state.getIn(['holidays', 'paidHolidayDays']),
    unpaidHolidayDays: state.getIn(['holidays', 'unpaidHolidayDays']),
    estimatedAccruedHolidayDays: state.getIn(['holidays', 'estimatedAccruedHolidayDays']),
    holidayStartDate: state.getIn(['holidays', 'holidayStartDate']),
    holidayEndDate: state.getIn(['holidays', 'holidayEndDate']),
    startPayslipDate: state.getIn(['holidays', 'startPayslipDate']),
    endPayslipDate: state.getIn(['holidays', 'endPayslipDate']),
    newHoliday: state.getIn(['holidays', 'newHoliday']),
    editHoliday: state.getIn(['holidays', 'editHoliday']),
    editedHoliday: state.getIn(['holidays', 'editedHoliday']),
    disabled: state.getIn(['profile', 'staffMember', 'disabled']),
    isAdminPlus: state.getIn(['holidays', 'isAdminPlus']),
    permissionsData: state.getIn(['holidays', 'permissionsData'])
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        updateAvatarRequest,
        addNewHoliday,
        addHoliday,
        cancelAddNewHoliday,
        deleteHoliday,
        openEditModal,
        closeEditModal,
        filter,
        addHolidayRequest,
        deleteHolidayRequest,
        editHolidayRequest,
        editHoliady,
      },
      dispatch,
    ),
  };
};

@connect(mapStateToProps, mapDispatchToProps)
class Holidays extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onAddNew = () => {
    this.props.actions.addNewHoliday();
  };

  onAddNewRequest = () => {
    this.props.actions.addNewHoliday();
  };

  onCancelAddNew = () => {
    this.props.actions.cancelAddNewHoliday();
  };

  onOpenEdit = () => {
    this.props.actions.openEditModal();
  };

  onCloseEdit = () => {
    this.props.actions.closeEditModal();
  };

  handleNewHolidaySubmit = (values, dispatch) => {
    return this.props.actions.addHoliday(values.toJS()).catch(resp => {
      notify('Adding Staff Member Holiday Failed', {
        interval: 5000,
        status: 'error',
      });

      const errors = resp.response.data.errors;
      if (errors) {
        let base = {};

        if (errors.base) {
          base = {
            _error: errors.base,
          };
        }
        throw new SubmissionError({ ...errors, ...base });
      }
    });
  };

  handleNewHolidayRequestSubmit = (values, dispatch) => {
    return this.props.actions.addHolidayRequest(values.toJS()).catch(resp => {
      notify('Adding Staff Member Holiday Failed', {
        interval: 5000,
        status: 'error',
      });

      const errors = resp.response.data.errors;
      if (errors) {
        let base = {};

        if (errors.base) {
          base = {
            _error: errors.base,
          };
        }
        throw new SubmissionError({ ...errors, ...base });
      }
    });
  };

  handleEditHolidayRequestSubmit = (values, dispatch) => {
    return this.props.actions.editHolidayRequest(values.toJS()).catch(resp => {
      notify('Updating Staff Member Holiday request Failed', {
        interval: 5000,
        status: 'error',
      });

      const errors = resp.response.data.errors;
      if (errors) {
        let base = {};

        if (errors.base) {
          base = {
            _error: errors.base,
          };
        }
        throw new SubmissionError({ ...errors, ...base });
      }
    });
  };

  handleEditHolidaySubmit = (values, dispatch) => {
    return this.props.actions.editHoliady(values.toJS()).catch(resp => {
      notify('Updating Staff Member Holiday Failed', {
        interval: 5000,
        status: 'error',
      });

      const errors = resp.response.data.errors;
      if (errors) {
        let base = {};

        if (errors.base) {
          base = {
            _error: errors.base,
          };
        }
        throw new SubmissionError({ ...errors, ...base });
      }
    });
  };

  handleEditSubmit = (values, dispatch) => {
    const type = this.props.editedHoliday.get('type');
    if (type === HOLIDAY_TYPE) {
      return this.handleEditHolidaySubmit(values, dispatch);
    } else {
      return this.handleEditHolidayRequestSubmit(values, dispatch);
    }
  };

  handleDeleteHoliday = holiday => {
    const type = holiday.get('type');
    const id = holiday.get('id');

    if (type === HOLIDAY_TYPE) {
      return this.props.actions.deleteHoliday(id);
    } else {
      return this.props.actions.deleteHolidayRequest(id);
    }
  };

  render() {
    const {
      staffMember,
      paidHolidayDays,
      unpaidHolidayDays,
      estimatedAccruedHolidayDays,
      holidayStartDate,
      holidayEndDate,
      holidays,
      newHoliday,
      editHoliday,
      editedHoliday,
      disabled,
      startPayslipDate,
      endPayslipDate,
      actions: {
        updateAvatarRequest,
        addNewHoliday,
        cancelAddNewHoliday,
        deleteHoliday,
        openEditModal,
        closeEditModal,
        filter,
      },
    } = this.props;

    const permissionsData = oFetch(this.props, 'permissionsData');
    const canCreateHolidays = oFetch(staffMemberProfileHolidaysPermissions, 'canCreateHolidays')({ permissionsData: permissionsData });
    const hasHolidays = !!holidays.size;

    return (
      <ProfileWrapper currentPage="holidays">
        <section className="boss-board">
          <ContentModal
            show={newHoliday}
            onClose={() => this.onCancelAddNew()}
            title={canCreateHolidays ? 'Add holiday' : 'Request holiday'}
          >
            <AddNewHoliday
              buttonTitle={canCreateHolidays ? 'Add holiday' : 'Request holiday'}
              onSubmit={canCreateHolidays ? this.handleNewHolidaySubmit : this.handleNewHolidayRequestSubmit}
              startDate={holidayStartDate}
              endDate={holidayEndDate}
            />
          </ContentModal>
          <ContentModal
            show={editHoliday}
            onClose={() => this.onCloseEdit()}
            title={editedHoliday.get('type') === HOLIDAY_TYPE ? 'Edit holiday' : 'Edit holiday request'}
          >
            <EditHoliday
              buttonTitle={editedHoliday.get('type') === HOLIDAY_TYPE ? 'Update holiday' : 'Update holiday request'}
              onSubmit={this.handleEditSubmit}
              holiday={editedHoliday}
            />
          </ContentModal>

          { canCreateHolidays && (
            <HolidaysHeader
              isStaffMemberDisabled={disabled}
              buttonText="Add Holiday"
              title="Holidays and holiday requests"
              onAddNew={this.onAddNew}
            />
          )}
          { !canCreateHolidays && (
              <HolidaysHeader
                isStaffMemberDisabled={disabled}
                buttonText="Request Holiday"
                title="Holidays and holiday requests"
                onAddNew={this.onAddNewRequest}
              />
            )}

          <div className="boss-board__main">
            <div className="boss-board__manager">
              <div className="boss-board__manager-stats boss-board__manager-stats_layout_row">
                <Stats
                  value={estimatedAccruedHolidayDays}
                  label={`${pluralize('Day', estimatedAccruedHolidayDays)} accrued in current tax year (Estimated)`}
                />
                <Stats
                  value={paidHolidayDays}
                  label={`Paid ${pluralize('day', paidHolidayDays)} logged in current tax year`}
                />
                <Stats
                  value={unpaidHolidayDays}
                  label={`Unpaid ${pluralize('day', unpaidHolidayDays)} logged in current tax year`}
                />
              </div>
              <div className="boss-board__manager-group boss-board__manager-group_role_data">
                <HolidaysFilter 
                  startDate={holidayStartDate} 
                  endDate={holidayEndDate} 
                  filter={filter}
                  startPayslipDate={startPayslipDate}
                  endPayslipDate={endPayslipDate} 
                />
                {hasHolidays ? (
                  [
                    <HolidaysTable
                      key="desktop"
                      isStaffMemberDisabled={disabled}
                      holidays={holidays}
                      deleteHoliday={this.handleDeleteHoliday}
                      onEditHoliday={openEditModal}
                      permissionsData={permissionsData}
                    />,
                    <HolidayMobileItems
                      key="mobile"
                      isStaffMemberDisabled={disabled}
                      holidays={holidays}
                      deleteHoliday={this.handleDeleteHoliday}
                      onEditHoliday={openEditModal}
                      permissionsData={permissionsData}
                    />,
                  ]
                ) : (
                  <h1 className="boss-table__cell boss-table__cell_role_header">NO HOLIDAYS FOUND</h1>
                )}
              </div>
            </div>
          </div>
        </section>
      </ProfileWrapper>
    );
  }
}

export default Holidays;
