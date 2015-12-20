import React, { Component } from 'react'
import { connect } from "react-redux"
import { Provider} from "react-redux"
import * as actionCreators from "../redux/actions.js"
import StaffFinder from "./staff-finder.js"
import ChartAndFilter from "./chart-and-filter.js"
import ProposedRotaAssignment from "./proposed-rota-assignment.js"
import RotaDate from "../lib/rota-date.js"
import staffTypes from "../data/staff-types.js"
import ShiftTimeSelector from "./shift-time-selector"
import _ from 'underscore'

import { boundActionCreators } from "../redux/store";

class RotaView extends Component {
    constructor(props){
        super(props)
        this.state = {
            shiftTimes: {
                starts_at: new Date(2015, 11, 11, 18, 0, 0),
                ends_at: new Date(2015, 11, 11, 20, 0, 0)
            }
        }
    }
    render() {
        var dateOfRota = new Date(2015, 11, 11, 18, 0, 0);

        return <div className="container">
            <h1>
                Rota: Friday 11th October 2015
            </h1>
            <br/>
            <ChartAndFilter
                rotaShifts={this.props.rotaShifts}
                staff={this.props.staff}
                staffTypes={this.props.staffTypes} />
            <hr />
            <div className="well well-lg">
                <h2 style={{ marginTop: 0 }}>Assign hours</h2>
                <ShiftTimeSelector
                    defaultShiftTimes={this.state.shiftTimes}
                    rotaDate={new RotaDate(dateOfRota)}
                    onChange={(shiftTimes) => this.onShiftTimesChange(shiftTimes)}
                    dateOfRota={dateOfRota}
                    />


                ---{JSON.stringify(this.state.shiftTimes)}---
                <hr/>
                <StaffFinder
                    staff={this.props.staff}
                    proposedRotaStaff={this.props.proposedRotaStaff}
                    rotaShifts={this.props.rotaShifts}
                    staffTypes={this.props.staffTypes}
                    addShift={(staffId) => this.addShift(staffId)}
                    />
            </div>


        </div>
    }
    addShift(staffId){
        boundActionCreators.addRotaShift({
            starts_at: this.state.shiftTimes.starts_at,
            ends_at: this.state.shiftTimes.ends_at,
            staff_id: staffId
        })
    }
    onShiftTimesChange(shiftTimes){
        this.setState({shiftTimes});
    }
}

function mapStateToProps(state) {
    var props = _.clone(state);

    // This needs to be moved into a separate file / folder
    props.staff = _(props.staff).mapValues(function(staff){
        staff = _.clone(staff);
        staff.readable_staff_type = staffTypes[staff.staff_type].title;
        staff.staff_type_object = staffTypes[staff.staff_type];
        return staff;
    });

    props.staffTypes = staffTypes;

    return props;
}

export default connect(
    mapStateToProps
)(RotaView);
