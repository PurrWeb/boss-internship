import React, { Component } from "react"
import { connect, Provider } from "react-redux"
import { bindActionCreators } from "redux";
import * as actionCreators from "../../redux/actions.js"
import ChartAndFilter from "./chart-and-filter.js"
import staffTypes from "../../data/staff-types.js"
import _ from "underscore"
import AddShiftView from "./add-shift-view"
import store from "../../redux/store.js"
import moment from "moment"
import RotaOverviewView from "~apps/rota-overview";

const boundActionCreators = bindActionCreators(actionCreators, store.dispatch.bind(store));

class RotaView extends Component {
    static childContextTypes = {
        staffTypes: React.PropTypes.object,
        boundActionCreators: React.PropTypes.object,
        rotaShifts: React.PropTypes.array,
        dateOfRota: React.PropTypes.instanceOf(Date),
        componentErrors: React.PropTypes.object
    }
    getChildContext(){
        return {
            staffTypes: this.props.staffTypes,
            boundActionCreators: boundActionCreators,
            rotaShifts: this.props.rotaShifts,
            dateOfRota: this.props.dateOfRota,
            componentErrors: this.props.componentErrors
        }
    }
    componentWillMount(){
        var initialPageData = actionCreators.getInitialRotaPageData();
        this.props.dispatch(actionCreators.loadInitialRotaAppState(initialPageData));
    }
    render() {
        if (!this.props.pageOptions) {
            return <div>Data is missing</div>;
        }

        return <div className="container">
            <h1>
                Rota for {this.props.venue.name}: {moment(this.props.dateOfRota).format("ddd D MMMM YYYY")}
            </h1>
            <br/>
            <RotaOverviewView {...this.props} />
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

    try {
        props.shifts = _.values(props.shifts);

        var shiftsBeingAdded = props.apiRequestsInProgress.ADD_SHIFT;
        props.staff = _(props.staff).mapValues(function(staff){
            return Object.assign({}, staff, {
                addShiftIsInProgress: _(shiftsBeingAdded).some((request) => request.shift.staff_id === staff.id)
            })
        });

        var shiftsBeingUpdated = props.apiRequestsInProgress.UPDATE_SHIFT;
        var shiftsBeingDeleted = props.apiRequestsInProgress.DELETE_SHIFT;
        props.rotaShifts = _(props.rotaShifts.items).map(function(shift){
            var isBeingEdited = _(shiftsBeingUpdated).some((request) => request.shift.shift_id === shift.id)
                || _(shiftsBeingDeleted).some({shift_id: shift.id});
            return Object.assign({}, shift, {
                isBeingEdited: isBeingEdited
            });
        });
        props.staffTypes = staffTypes;
        var rota = props.rotas[props.pageOptions.displayedRota];
        props.venue = props.venues[rota.venue];
        props.dateOfRota = rota.date;
    } catch (err) {
        console.log("coulnd't calcualte all props", err)
    }

    return props;
}

export default connect(
    mapStateToProps
)(RotaView);
