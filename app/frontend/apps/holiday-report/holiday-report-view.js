import React from "react"
import { connect } from "react-redux"
import { appRoutes } from "~/lib/routes"
import ReportsHeader from "./reports-header"
import ReportsBody from "./reports-body"
import _ from 'lodash';
export class HolidayReportView extends React.Component {
  render() {
    const accessibleVenues = Object.values(this.props.venues).filter((venue, clientId) => {
      return this.props.pageOptions.accessibleVenueIds.includes(venue.serverId)
    });

    return (
      <main className="boss-page-main">
        <ReportsHeader { ...this.props } />

        <ReportsBody accessibleVenues={accessibleVenues} { ...this.props } />
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
        staffTypes: state.staffTypes,
        holidaysCount: state.holidaysCount,
        staffMembersCount: state.staffMembersCount,
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
