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
        return <button
            data-test-marker-force-clock-out
            className="btn btn-warning"
            onClick={this.props.clockOut}
            style={{marginTop: 4, marginLeft: 4}}>
            Clock Out
        </button>
    }
}
