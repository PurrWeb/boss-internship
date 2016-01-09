import React, { Component } from "react"
import { connect, Provider } from "react-redux"
import _ from "underscore"
import store from "../../redux/store"
import staffTypes from "../../data/staff-types"
import moment from "moment"
import ClockInOutStaffFinder from "./staff-finder/staff-finder"

class ClockInOutView extends Component {
    static childContextTypes = {
        staffTypes: React.PropTypes.object,
        rotaShifts: React.PropTypes.array
    }
    getChildContext(){
        return {
            staffTypes: this.props.staffTypes,
            rotaShifts: this.props.rotaShifts
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

    props.staffTypes = staffTypes;
    props.venue = "The Rocket Bar";
    props.dateOfRota = new Date(2015, 11, 11, 18, 0, 0);

    return props;
}

export default connect(
    mapStateToProps
)(ClockInOutView);
