import React, { Component } from 'react'
import { connect } from "react-redux"
import { Provider} from "react-redux"
import * as actionCreators from "../redux/actions.js"
import StaffFinder from "./staff-finder.js"
import ChartAndFilter from "./chart-and-filter.js"
import ProposedRotaAssignment from "./proposed-rota-assignment.js"
import RotaDate from "../lib/rota-date.js"
import staffTypes from "../data/staff-types.js"
import _ from 'underscore'

class RotaView extends Component {
    render() {
        return <div className="container">
            <h1>
                Rota: Friday 13th November 2015
            </h1>
            <br/>
            <ChartAndFilter
                rotaShifts={this.props.rotaShifts}
                staff={this.props.staff}
                staffTypes={this.props.staffTypes} />
            <hr />
            <div className="well well-lg">
                <h2 style={{ marginTop: 0 }}>Assign hours</h2>
                <ProposedRotaAssignment
                    staff={this.props.staff}
                    proposedRotaStaff={this.props.proposedRotaStaff}
                    rotaDate={new RotaDate(new Date(2015, 11, 11, 18, 0, 0))}/>
                <hr/>
                <StaffFinder
                    staff={this.props.staff}
                    proposedRotaStaff={this.props.proposedRotaStaff}
                    rotaShifts={this.props.rotaShifts}
                    staffTypes={this.props.staffTypes}
                    />
            </div>


        </div>
    }
}

function mapStateToProps(state) {
    var props = _.clone(state);

    // This needs to be moved into a separate file / folder
    props.staff = _(props.staff).mapValues(function(staff){
        staff = _.clone(staff);
        staff.readable_staff_type = staffTypes[staff.staff_type].title;
        return staff;
    });

    props.staffTypes = staffTypes;

    return props;
}

export default connect(
    mapStateToProps
)(RotaView);
