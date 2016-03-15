import React, { Component } from "react"
import { connect, Provider } from "react-redux"
import _ from "underscore"
import store from "~redux/store"
import moment from "moment"
import * as actionCreators from "~redux/actions.js"
import { bindActionCreators } from "redux";
import ClockInOutStaffFinder from "./staff-finder/staff-finder"

//const boundActionCreators = bindActionCreators(actionCreators, store.dispatch.bind(store));

class ClockInOutView extends Component {
    static childContextTypes = {
        staffTypes: React.PropTypes.object,
        rotaShifts: React.PropTypes.array,
        staffStatuses: React.PropTypes.object,
        staffStatusOptions: React.PropTypes.object,
        boundActionCreators: React.PropTypes.object
    }
    componentWillMount(){
        this.props.dispatch(actionCreators.loadInitialClockInOutAppState())
    }
    getChildContext(){
        return {
            staffTypes: this.props.staffTypes,
            rotaShifts: this.props.rotaShifts,
            staffStatuses: this.props.staffStatuses,
            staffStatusOptions: this.props.staffStatusOptions,
            boundActionCreators: boundActionCreators
        }
    }
    render() {
        var classes = ["container"];
        if (this.props.appIsInManagerMode) {
            classes.push("managerMode");
        }

        return <div className={classes.join(" ")}>
            <a
                className="btn btn-default show-in-manager-mode"
                style={{float: "right"}}
                onClick={() => boundActionCreators.leaveManagerMode()}>
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

    props.staff = _(props.staff).mapValues(function(staff){
        staff.isManager = staff.staff_type === "manager";
        return staff;
    });

    props.staffTypes = {};
    props.venue = "The Rocket Bar";
    props.dateOfRota = new Date(2015, 11, 11, 18, 0, 0);
    props.staffStatusOptions = {};

    return props;
}

export default connect(
    mapStateToProps
)(ClockInOutView);
