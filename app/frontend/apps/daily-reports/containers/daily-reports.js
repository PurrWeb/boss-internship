import oFetch from 'o-fetch';
import React from 'react';
import DailyReportDashboard from './daily-reports-dashboard';
import OverviewBoard from '../components/overview-board';
import StaffTypeBoard from '../components/staff-type-board';

class DailyReports extends React.Component {
  noContentMessage(){
    return <div className="boss-page-main__note">
      <div className="boss-page-main__text-placeholder">
        <p>No report exists for this date.</p>
      </div>
    </div>;
  }

  reportUpdatePendingMessage() {
    return <div className="boss-page-main__note boss-page-main__note_context_stack boss-page-main__note_role_alert">
      <p className="boss-page-main__text-placeholder"></p>
      <p className="boss-page-main__note-text boss-page-main__note-text_role_primary">A report is scheduled to be calculated for this date.</p>
      <p className="boss-page-main__note-text">The updated data should be online within the hour.</p>
    </div>;
  }

  renderStaffTypeSections(staffTypeSections) {
    let index = 0;
    return staffTypeSections.map((staffTypeSection) => {
      const board = <StaffTypeBoard staffTypeSection={staffTypeSection} key={index}/>;
      index = index + 1;
      return board;
    });
  }

  render() {
    let venueId = oFetch(this.props, 'venueId');
    let venueName = oFetch(this.props, 'venueName');
    let dateM = oFetch(this.props, 'dateM');
    let weekStartDateM = oFetch(this.props, 'weekStartDateM');
    const dailyReport = oFetch(this.props, 'dailyReport');
    const reportUpdatePending = dailyReport && dailyReport.isUpdatePending;

    return ( 
      <main className="boss-page-main">
        <DailyReportDashboard venueId={venueId} venueName={venueName} dateM={dateM} weekStartDateM={weekStartDateM} />
        <div className="boss-page-main__content">
          <div className="boss-page-main__inner">
            { !dailyReport && this.noContentMessage() }
            { reportUpdatePending && this.reportUpdatePendingMessage() }
            { dailyReport && <OverviewBoard dailyReport={dailyReport}/> }
            { dailyReport && this.renderStaffTypeSections(oFetch(dailyReport, 'staffTypeSections')) }
          </div>
        </div>
      </main>
    )
  }
}

export default DailyReports;