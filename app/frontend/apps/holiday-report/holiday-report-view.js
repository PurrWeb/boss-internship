import React from "react"
import { connect } from "react-redux"
import utils from "~lib/utils"
import HolidayReportStaffFinder from "./holiday-report-staff-finder"
import WeekAndVenueSelector from "~components/week-and-venue-selector"

export default class HolidayReportView extends React.Component {
    render(){
        return <div>
            <WeekAndVenueSelector 
                weekStartDate={utils.parseBackendDateNotTime(this.props.pageOptions.weekStartDate)}
                onChange={(o) => console.log(o)}
                venues={this.props.venues}
                venueId={this.props.pageOptions.venueId}
            />
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