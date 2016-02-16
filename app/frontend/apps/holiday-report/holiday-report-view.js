import React from "react"
import { connect } from "react-redux"
import utils from "~lib/utils"
import { appRoutes } from "~lib/routes"
import HolidayReportStaffFinder from "./holiday-report-staff-finder"
import WeekAndVenueSelector from "~components/week-and-venue-selector"

export default class HolidayReportView extends React.Component {
    render(){
        return <div>
            <WeekAndVenueSelector 
                weekStartDate={utils.parseBackendDateNotTime(this.props.pageOptions.weekStartDate)}
                onChange={({startDate, endDate, venueId}) =>
                        location.href = appRoutes.holidayReportsIndex({
                            date: startDate,
                            venueId
                        })
                }
                venues={this.props.venues}
                venueId={this.props.pageOptions.venueId}
            />
            <hr/>
            { csvDownloadButton(this.props) }
            <h2 style={{fontSize: 20}}>Find Staff</h2>
            <HolidayReportStaffFinder />
        </div>
    }
}

function mapStateToProps(state){
    return {
        venues: state.venues,
        pageOptions: state.pageOptions,
        holidays: state.holidays
    }
}

function csvDownloadButton(props){
  let holidayCount = Object.keys(props.holidays).length;

  if (props.pageOptions.venueId && props.pageOptions.weekStartDate && (holidayCount > 0)) {
    return <a className="btn btn-default"
        style={{float: "right"}}
        href={appRoutes.holidayReportsCsv({
          date: props.pageOptions.weekStartDate,
          venueId: props.pageOptions.venueId
        })}>
        Download as CSV
    </a>;
  }
}

export default connect(mapStateToProps)(HolidayReportView)
