import React, { Component } from "react"
import { connect, Provider } from "react-redux"
import { bindActionCreators } from "redux";
import * as actionCreators from "../../redux/actions.js"
import ChartAndFilter from "./chart-and-filter.js"
import staffTypes from "../../data/staff-types.js"
import _ from "underscore"
import AddShiftView from "./add-shift-view"
import store from "../../redux/store.js"

const boundActionCreators = bindActionCreators(actionCreators, store.dispatch.bind(store));

class RotaView extends Component {
    static childContextTypes = {
        staffTypes: React.PropTypes.object,
        boundActionCreators: React.PropTypes.object,
        rotaShifts: React.PropTypes.array,
        dateOfRota: React.PropTypes.instanceOf(Date)
    }
    getChildContext(){
        return {
            staffTypes: this.props.staffTypes,
            boundActionCreators: boundActionCreators,
            rotaShifts: this.props.rotaShifts,
            dateOfRota: this.props.dateOfRota
        }
    }
    componentWillMount(){
        this.props.dispatch(actionCreators.loadInitialRotaAppState())
    }
    render() {
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
                dateOfRota={this.props.dateOfRota}
                staff={this.props.staff} />
        </div>
    }
}

function mapStateToProps(state) {
    var props = _.clone(state);

    var shiftsBeingAdded = props.apiRequestsInProgress.ADD_SHIFT;
    props.staff = _(props.staff).mapValues(function(staff){
        return Object.assign({}, staff, {
            shiftSavingInProgress: _(shiftsBeingAdded).some({staff_id: staff.id})
        })
    });

    var shiftsBeingUpdated = props.apiRequestsInProgress.UPDATE_SHIFT;
    var shiftsBeingDeleted = props.apiRequestsInProgress.DELETE_SHIFT;
    props.rotaShifts = _(props.rotaShifts.items).map(function(shift){
        var isBeingEdited = _(shiftsBeingUpdated).some({shift_id: shift.id})
            || _(shiftsBeingDeleted).some({shift_id: shift.id});
        return Object.assign({}, shift, {
            isBeingEdited: isBeingEdited
        });
    });
    props.staffTypes = staffTypes;
    props.dateOfRota = new Date(2015, 11, 11, 18, 0, 0);

    console.log("PROPS", props)

    return props;
}

export default connect(
    mapStateToProps
)(RotaView);
