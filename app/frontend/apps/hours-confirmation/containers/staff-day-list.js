import React from "react"
import StaffDay from "./staff-day"
import { connect } from "react-redux"
import _ from "underscore"

class StaffDayList extends React.Component {
    render(){
        var clockInDays = this.props.clockInDays;
        var readOnlyclockInDays = this.props.readonlyClockInDays;

        if (_.values(clockInDays).length === 0 && _.values(readOnlyclockInDays).length === 0) {
          if (_.values(this.props.hoursAcceptancePeriods).length === 0) {
            return <div className="boss-page-main__inner boss-page-main__inner_space_regular boss-page-main__inner_opaque">
              <p className="boss-page-main__text-placeholder">There are no hours to confirm.</p>
            </div>;
          }
        }

        return <div className="boss-page-main__inner">
            {_.values(clockInDays).map(clockInDay =>
                <StaffDay
                    displayVenue={this.props.displayVenues}
                    displayDate={this.props.displayDates}
                    key={clockInDay.clientId}
                    readonly={false}
                    clockInDay={clockInDay} />
            )}
            {_.values(readOnlyclockInDays).map(clockInDay =>
                <StaffDay
                    displayVenue={this.props.displayVenues}
                    displayDate={this.props.displayDates}
                    key={clockInDay.clientId}
                    readonly={true}
                    clockInDay={clockInDay} />
            )}
        </div>
    }
}

function mapStateToProps(state){
    return {
        clockInDays: state.clockInDays,
        readonlyClockInDays: state.readonlyClockInDays,
    }
}

export default connect(mapStateToProps)(StaffDayList)
