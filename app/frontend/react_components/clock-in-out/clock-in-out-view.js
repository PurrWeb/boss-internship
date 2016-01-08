import React, { Component } from "react"
import { connect, Provider } from "react-redux"
import _ from "underscore"
import store from "../../redux/store"
import staffTypes from "../../data/staff-types.js"
import { extendStaffTypeInformation } from "../../redux/map-state-to-props-helpers"

class ClockInOutView extends Component {
    render() {
        console.log(this.props)
        return <div className="container">
            {this.props.venue} - {this.props.dateOfRota.toString()}
        </div>
    }
}

function mapStateToProps(state) {
    var props = _.clone(state);

    props.staff = extendStaffTypeInformation(props.staff, staffTypes);

    props.staffTypes = staffTypes;
    props.venue = "The Rocket Bar";
    props.dateOfRota = new Date(2015, 11, 11, 18, 0, 0);

    return props;
}

export default connect(
    mapStateToProps
)(ClockInOutView);
