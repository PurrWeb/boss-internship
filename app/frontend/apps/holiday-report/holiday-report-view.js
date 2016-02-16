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
            <a className="btn btn-default"
                style={{float: "right"}}
                href={appRoutes.holidayReportsCsv({
                date: this.props.pageOptions.weekStartDate,
                venueId: this.props.pageOptions.venueId
            })}>
                Download as CSV
            </a>
            <h2 style={{fontSize: 20}}>Find Staff</h2>
            <HolidayReportStaffFinder />
        </div>
    }
}

function mapStateToProps(state){
    return {
        venues: state.venues,
        pageOptions: state.pageOptions
    }
}

export default connect(mapStateToProps)(HolidayReportView)