import React, { Component } from 'react'
import { connect } from "react-redux"
import { Provider} from "react-redux"
import * as actionCreators from "../redux/actions.js"
import ChartAndFilter from "./chart-and-filter.js"
import staffTypes from "../data/staff-types.js"
import _ from 'underscore'
import AddShiftView from "./add-shift-view"


class RotaView extends Component {
    static childContextTypes = {
        staffTypes: React.PropTypes.object
    }
    getChildContext(){
        return {
            // staff: this.props.staff,
            staffTypes: this.props.staffTypes,
            // rotaShifts: this.props.rotaShifts
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
                staff={this.props.staff}/>
            <hr />
            <AddShiftView 
                dateOfRota={dateOfRota}
                staff={this.props.staff}
                rotaShifts={this.props.rotaShifts}/>
        </div>
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
