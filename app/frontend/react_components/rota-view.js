import React, { Component } from 'react'
import { connect } from "react-redux"
import { Provider} from "react-redux"
import { bindActionCreators } from "redux";
import * as actionCreators from "../redux/actions.js"
import ChartAndFilter from "./chart-and-filter.js"
import staffTypes from "../data/staff-types.js"
import _ from 'underscore'
import AddShiftView from "./add-shift-view"
import store from "../redux/store.js"

const boundActionCreators = bindActionCreators(actionCreators, store.dispatch.bind(store));

class RotaView extends Component {
    static childContextTypes = {
        staffTypes: React.PropTypes.object,
        boundActionCreators: React.PropTypes.object,
        rotaShifts: React.PropTypes.array
    }
    getChildContext(){
        return {
            staffTypes: this.props.staffTypes,
            boundActionCreators: boundActionCreators,
            rotaShifts: this.props.rotaShifts
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
                staff={this.props.staff} />
            <hr />
            <AddShiftView 
                dateOfRota={dateOfRota}
                staff={this.props.staff} />
        </div>
    }
}

function mapStateToProps(state) {
    var props = _.clone(state);

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
