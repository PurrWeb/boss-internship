import React, { Component } from "react"
import { connect, Provider } from "react-redux"
import _ from "underscore"
import store from "~redux/store"
import staffTypes from "~data/staff-types"
import staffStatusOptions from "~data/staff-status-options"
import moment from "moment"
import ClockInOutStaffFinder from "./staff-finder/staff-finder"

window.store = store;

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
        console.log(this.props)
        window.moment = moment;
        return <div className="container">
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

    props.staffTypes = staffTypes;
    props.venue = "The Rocket Bar";
    props.dateOfRota = new Date(2015, 11, 11, 18, 0, 0);
    props.staffStatusOptions = staffStatusOptions;

    return props;
}

export default connect(
    mapStateToProps
)(ClockInOutView);
