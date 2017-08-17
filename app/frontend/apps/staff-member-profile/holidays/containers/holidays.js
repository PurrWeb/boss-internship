import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import humanize from 'string-humanize';
import pluralize from 'pluralize';

import DashboardWrapper from '~/components/dashboard-wrapper';
import ContentWrapper from '~/components/content-wrapper';
import Dashboard from '../../common/dashboard';
import StaffMemberCard from '../../common/staff-member-card';
import StaffMemberProfileActions from '../../common/staff-member-profile-actions';
import HolidayasMobileItems from '../components/holidays-mobile-items';

import {
  updateAvatarRequest,
  addNewHoliday,
  cancelAddNewHoliday,
  deleteHoliday
} from '../actions';

import Stats from '../components/stats';
import HolidaysHeader from '../components/holidays-header';
import HolidaysFilter from '../components/holidays-filter';
import HolidaysTable from '../components/holidays-table';
import AddNewHoliday from '../components/add-new-holiday';
import ContentModal from '~/components/content-modal';

const mapStateToProps = (state) => {
  return {
    staffMember: state.getIn(['profile','staffMember']),
    holidays: state.getIn(['profile','holidays']),
    paidHolidayDays: state.getIn(['profile','paidHolidayDays']),
    unpaidHolidayDays: state.getIn(['profile','unpaidHolidayDays']),
    estimatedAccruedHolidayDays: state.getIn(['profile','estimatedAccruedHolidayDays']),
    holidayStartDate: state.getIn(['profile', 'holidayStartDate']),
    holidayEndDate: state.getIn(['profile','holidayEndDate']),
    newHoliday: state.getIn(['profile', 'newHoliday']),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      updateAvatarRequest,
      addNewHoliday,
      cancelAddNewHoliday,
      deleteHoliday
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
      actions: {
        updateAvatarRequest,
        addNewHoliday,
        cancelAddNewHoliday,
      }
    } = this.props;

    return (
      <div>
        <DashboardWrapper>
          <Dashboard>
            <StaffMemberCard
              staffMember={staffMember}
              onUpdateAvatar={updateAvatarRequest}
            />
            <StaffMemberProfileActions
              staffMember={staffMember}
            />
          </Dashboard>
        </DashboardWrapper>

        <ContentWrapper>
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
                  <HolidaysFilter startDate={holidayStartDate} endDate={holidayEndDate} />
                  <HolidaysTable holidays={holidays} deleteHoliday={deleteHoliday} />
                  <HolidayasMobileItems holidays={holidays} deleteHoliday={deleteHoliday}/>
                </div>
              </div>
            </div> 
          </section>
        </ContentWrapper>
      </div>
    )
  }
}

export default Holidays;
