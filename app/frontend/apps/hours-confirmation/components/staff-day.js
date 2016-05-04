import React from "react"
import HoursChart from "./hours-chart"
import _ from "underscore"
import utils from "~lib/utils"
import ShiftTimeSelector from "~components/shift-time-selector"

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
                    rotaDate={this.props.rotaDate}
                    acceptedHours={this.props.acceptedHours}
                    onChange={(acceptedHoursList) => this.props.onAcceptedHoursChanged(acceptedHoursList)} />
            </div>
        </div>
    }
}

class AcceptedHoursListItem extends React.Component {
    render(){
        var clockIn = this.props.acceptedHours.clockInHours
        return <div className="row">
            <div className="col-md-9">
                <div className="col-md-3">
                    <ShiftTimeSelector
                        defaultShiftTimes={{
                            starts_at: clockIn.starts_at,
                            ends_at: clockIn.ends_at
                        }}
                        rotaDate={this.props.rotaDate}
                        onChange={(times) => this.triggerChange({
                            starts_at: times.starts_at,
                            ends_at: times.ends_at
                        })}
                        />
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
    triggerChange(dataToUpdate){
        var acceptedHours = _.clone(this.props.acceptedHours);
        var clockIn = acceptedHours.clockInHours;
        clockIn = _.extend({}, clockIn, dataToUpdate);
        acceptedHours.clockInHours = clockIn;
        this.props.onChange(acceptedHours)
    }
}

class AcceptedHoursList extends React.Component {
    render(){
        return <div>
            {this.props.acceptedHours.map(
                (acceptedHours) =>
                    <AcceptedHoursListItem
                        onChange={(newAcceptedHours) => {
                            var newValue = _.clone(this.props.acceptedHours);
                            newValue = utils.replaceArrayElement(newValue, acceptedHours, newAcceptedHours)
                            this.props.onChange(newValue)
                        }}
                        rotaDate={this.props.rotaDate}
                        acceptedHours={acceptedHours} />
            )}
        </div>
    }
}
