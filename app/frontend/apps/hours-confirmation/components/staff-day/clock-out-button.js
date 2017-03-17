import React from "react"
import Spinner from "~components/spinner"

export default class ClockOutButton extends React.Component {
    render(){
        var status = this.props.clockInDay.status;
        if (this.props.clockInDay.forceClockoutIsInProgress){
            return <div style={{marginTop: 2}}>
                <Spinner/>
            </div>
        }
        if (status === "clocked_out") {
            return null;
        }
        return <div className="row align-middle">
            <div className="shrink column">
                <button
                    data-test-marker-force-clock-out
                    className="boss3-button boss3-button_type_small boss3-button_role_exclamation"
                    onClick={this.props.clockOut}
                    style={{marginTop: 4, marginLeft: 4}}>
                    Clock Out
                </button>
            </div>
            <div className="shrink column">
                Clock out to edit hours.
            </div>
        </div>
    }
}
