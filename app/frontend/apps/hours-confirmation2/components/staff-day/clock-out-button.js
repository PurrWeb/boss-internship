import React from "react"
import Spinner from "~/components/spinner"

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
        return <div className="boss-hrc__action">
            <button type="button"
                data-test-marker-force-clock-out
                className="boss-button boss-button_type_small boss-button_role_exclamation boss-hrc__action-btn"
                onClick={this.props.clockOut}
                >
                Clock Out
            </button>
            <div className="boss-hrc__action-text">
                Clock out to edit hours.
            </div>
        </div>
    }
}
