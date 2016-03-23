import React, { Component } from "react"
import { connect, Provider } from "react-redux"
import _ from "underscore"
import store from "~redux/store"
import moment from "moment"
import ClockInOutStaffFinder from "./staff-finder/staff-finder"
import * as actions from "~redux/actions"
import { selectRotaOnClockInOutPage } from "~redux/selectors"

class ClockInOutView extends Component {
    render() {
        var classes = ["container"];
        if (this.props.clockInOutAppIsInManagerMode) {
            classes.push("managerMode");
        }

        return <div className={classes.join(" ")}>
            <a
                className="btn btn-default show-in-manager-mode"
                style={{float: "right"}}
                onClick={() => this.props.leaveManagerMode()}>
                Leave Manager Mode
            </a>
            <h1>
                {this.props.venue.name} - {moment(this.props.rota.date).format("ddd D MMMM YYYY")}
            </h1>
            <ClockInOutStaffFinder />
        </div>
    }
}

function mapStateToProps(state) {
    var rota = selectRotaOnClockInOutPage(state);
    return {
        clockInOutAppIsInManagerMode: state.clockInOutAppIsInManagerMode,
        rota,
        venue: rota.venue.get(state.venues)
    }
}

function mapDispatchToProps(dispatch){
    return {
        leaveManagerMode: function(){
            dispatch(actions.leaveManagerMode());
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ClockInOutView);
