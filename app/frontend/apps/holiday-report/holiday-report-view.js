import React from "react"
import { connect } from "react-redux"
import utils from "~lib/utils"
import { appRoutes } from "~lib/routes"
import HolidayReportStaffFinder from "./holiday-report-staff-finder"
import ReportsHeader from "./reports-header"
import ReportsBody from "./reports-body"
import WeekAndVenueSelector from "~components/week-and-venue-selector"

export default class HolidayReportView extends React.Component {
  render() {
    let accessibleVenues = _.pick(this.props.venues, (venue, clientId) => {
      return this.props.pageOptions.accessibleVenueIds.includes(venue.serverId)
    });

    return (
      <main className="boss-page-main">
        <ReportsHeader { ...this.props } />

        <ReportsBody { ...this.props } />
      </main>
    )
  }
}

function mapStateToProps(state){
    return {
        venues: state.venues,
        pageOptions: state.pageOptions,
        holidays: state.holidays,
        staffMembers: state.staffMembers,
        staffTypes: state.staffTypes
    }
}

function csvDownloadButton(props){
  let holidayCount = Object.keys(props.holidays).length;

  if (
      props.pageOptions.displayCsvLink &&
      props.pageOptions.weekStartDate  &&
      (holidayCount > 0)
    ) {
    return <a
        className="boss2-button boss2-button_role_download"
        href={appRoutes.holidaysCsv({
          date: props.pageOptions.weekStartDate,
          venueId: props.pageOptions.venueServerId
        })}>
        Download as CSV
    </a>;
  }
}

export default connect(mapStateToProps)(HolidayReportView)
