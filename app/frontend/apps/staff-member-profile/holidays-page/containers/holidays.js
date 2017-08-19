import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import humanize from 'string-humanize';
import pluralize from 'pluralize';

import ProfileWrapper from '../../profile-wrapper';
import HolidayasMobileItems from '../components/holidays-mobile-items';

import {
  updateAvatarRequest,
  addNewHoliday,
  cancelAddNewHoliday,
  deleteHoliday,
  openEditModal,
  closeEditModal,
  filter
} from '../actions';

import Stats from '../components/stats';
import HolidaysHeader from '../components/holidays-header';
import HolidaysFilter from '../components/holidays-filter';
import HolidaysTable from '../components/holidays-table';
import AddNewHoliday from '../components/add-new-holiday';
import ContentModal from '~/components/content-modal';
import EditHoliday from '../components/edit-holiday';

const mapStateToProps = (state) => {
  return {
    staffMember: state.getIn(['holidays','staffMember']),
    holidays: state.getIn(['holidays','holidays']),
    paidHolidayDays: state.getIn(['holidays','paidHolidayDays']),
    unpaidHolidayDays: state.getIn(['holidays','unpaidHolidayDays']),
    estimatedAccruedHolidayDays: state.getIn(['holidays','estimatedAccruedHolidayDays']),
    holidayStartDate: state.getIn(['holidays', 'holidayStartDate']),
    holidayEndDate: state.getIn(['holidays','holidayEndDate']),
    newHoliday: state.getIn(['holidays', 'newHoliday']),
    editHoliday: state.getIn(['holidays', 'editHoliday']),
    editedHoliday: state.getIn(['holidays', 'editedHoliday'])
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      updateAvatarRequest,
      addNewHoliday,
      cancelAddNewHoliday,
      deleteHoliday,
      openEditModal,
      closeEditModal,
      filter
    }, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class Holidays extends React.PureComponent {

  constructor(props){
    super(props);
  }
  
  onAddNew = () => {
    this.props.actions.addNewHoliday();
  }

  onCancelAddNew = () => {
    this.props.actions.cancelAddNewHoliday();
  }

  onOpenEdit = () => {
    this.props.actions.openEditModal();
  }

  onCloseEdit = () => {
    this.props.actions.closeEditModal();
  }

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
      actions: {
        updateAvatarRequest,
        addNewHoliday,
        cancelAddNewHoliday,
        deleteHoliday,
        openEditModal,
        closeEditModal,
        filter
      }
    } = this.props;

    return (
      <ProfileWrapper>
        <ContentModal
            show={newHoliday}
            onClose={() => this.onCancelAddNew()}
            title="Add holiday"
          >
          <AddNewHoliday
            title="Add Holiday"
            startDate={holidayStartDate}
            endDate={holidayEndDate}
            />
        </ContentModal>
        <ContentModal
          show={editHoliday}
          onClose={() => this.onCloseEdit()}
          title="Edit holiday"
        >
          <EditHoliday holiday={editedHoliday}/>
        </ContentModal>
        <section className="boss-board">
          <HolidaysHeader title="Holidays" onAddNew={this.onAddNew} />
          <div className="boss-board__main">
            <div className="boss-board__manager">
              <div className="boss-board__manager-stats boss-board__manager-stats_layout_row">
                <Stats value={estimatedAccruedHolidayDays} label={`${pluralize('Day', estimatedAccruedHolidayDays)} accured current tax year (Estimated)`} />
                <Stats value={paidHolidayDays} label={`Paid ${pluralize('day', paidHolidayDays)} logged in current tax year`} />
                <Stats value={unpaidHolidayDays} label={`Unpaid ${pluralize('day', unpaidHolidayDays)} logged in current tax year`} />
              </div>
              <div className="boss-board__manager-data">
                <HolidaysFilter startDate={holidayStartDate} endDate={holidayEndDate} filter={filter} />
                <HolidaysTable holidays={holidays} deleteHoliday={deleteHoliday} onEditHoliday={openEditModal}/>
                <HolidayasMobileItems holidays={holidays} deleteHoliday={deleteHoliday} onEditHoliday={openEditModal}/>
              </div>
            </div>
          </div> 
        </section>
      </ProfileWrapper>
    )
  }
}

export default Holidays;
