import React, { Component } from "react"
import { connect, Provider } from "react-redux"
import _ from "underscore"
import store from "~redux/store"
import moment from "moment"
import { bindActionCreators } from "redux";
import ClockInOutStaffFinder from "./staff-finder/staff-finder"
import * as actions from "~redux/actions"

class ClockInOutView extends Component {
    static childContextTypes = {
        staffTypes: React.PropTypes.object,
        rotaShifts: React.PropTypes.array,
        staffStatuses: React.PropTypes.object,
        staffStatusOptions: React.PropTypes.object
    }
    getChildContext(){
        return {
            staffTypes: this.props.staffTypes,
            rotaShifts: this.props.rotaShifts,
            staffStatuses: this.props.staffStatuses,
            staffStatusOptions: this.props.staffStatusOptions
        }
    }
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
                {this.props.venue} - {moment(this.props.dateOfRota).format("ddd D MMMM YYYY")}
            </h1>
            <ClockInOutStaffFinder
                staff={this.props.staff}
                />
        </div>
    }
}

function mapStateToProps(state) {
    var props = _.clone(state);

    props.clockInOutAppIsInManagerMode = state.clockInOutAppIsInManagerMode;
    props.staffTypes = {};
    props.venue = "The Rocket Bar";
    props.dateOfRota = new Date(2015, 11, 11, 18, 0, 0);
    props.staffStatusOptions = {};

    return props;
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
