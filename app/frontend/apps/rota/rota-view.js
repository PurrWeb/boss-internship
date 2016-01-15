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

    props.staff = _(props.staff).mapValues(function(staff){
        var listOfShiftsBeingSaved = props.rotaShifts.shiftsBeingSavedByStaffId[staff.id];
        var savingInProgress = listOfShiftsBeingSaved !== undefined && listOfShiftsBeingSaved.length > 0;
        return Object.assign({}, staff, {
            shiftSavingInProgress: savingInProgress
        })
    });

    props.rotaShifts = props.rotaShifts.items
    props.staffTypes = staffTypes;
    props.dateOfRota = new Date(2015, 11, 11, 18, 0, 0);

    return props;
}


function mapDispatchToProps(){
    return {initialLoad}
}

export default connect(
    mapStateToProps
)(RotaView);
