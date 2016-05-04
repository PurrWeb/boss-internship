import React from "react"
import HoursChart from "./hours-chart"
import _ from "underscore"

export default class StaffDay extends React.Component {
    render(){
        var proposedClockIns = _.pluck(this.props.acceptedHours, "clockInHours");

        return <div className="row">
            <div className="col-md-2">
                name/picture
            </div>
            <div className="col-md-10">
                <div className="row">
                    <div className="col-md-9">
                        <HoursChart
                            rotaDate={this.props.rotaDate}
                            rotaedShifts={this.props.rotaedShifts}
                            acceptedHours={this.props.acceptedHours}
                            proposedAcceptedClockIns={proposedClockIns}
                            clockedClockIns={this.props.clockedClockIns}/>
                            (todo: stats)
                    </div>
                    <div className="col-md-3">
                        notes
                    </div>
                </div>
                <AcceptedHoursList
                    acceptedHours={this.props.acceptedHours}
                    onChange={(acceptedHoursList) => this.props.onAcceptedHoursChanged(acceptedHoursList)} />
            </div>
        </div>
    }
}

class AcceptedHoursListItem extends React.Component {
    render(){
        return <div className="row">
            <div className="col-md-9">
                <div className="col-md-3">
                    from/to
                </div>
                <div className="col-md-3">
                    breaks
                </div>
                <div className="col-md-3">
                    reason
                </div>
            </div>
            <div className="col-md-3">
                Accept/Save
            </div>
        </div>
    }
}

class AcceptedHoursList extends React.Component {
    render(){
        return <div>
            {this.props.acceptedHours.map(
                (acceptedHours) =>
                    <AcceptedHoursListItem acceptedHours={acceptedHours} />
            )}
        </div>
    }
}
