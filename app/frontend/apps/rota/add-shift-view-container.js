import React, { Component } from "react"
import {connect } from "react-redux"
import validation from "~lib/validation"
import _ from "underscore"
import AddShiftView from "./add-shift-view/add-shift-view"
import { selectStaffMemberIsOnHolidayOnDate, selectAddShiftIsInProgress } from "~redux/selectors"
import * as actionCreators from "~redux/actions"


class AddShiftViewContainer extends Component {
    static childContextTypes = {
        addShift: React.PropTypes.func,
        canAddShift: React.PropTypes.func
    }
    getChildContext(){
        var canAddShift = (staff_id) => {
            var { starts_at, ends_at } = this.state.shiftTimes;
            var datesAreValid = validation.areShiftTimesValid(starts_at, ends_at);
            var isAddingShift = this.props.addShiftIsInProgress[staff_id];
            var isOnHoliday = this.props.staffMemberIsOnHoliday[staff_id];

            return datesAreValid && !isAddingShift && !isOnHoliday; 
        }
        return {
            addShift: (staffId, requestComponent) => this.addShift(staffId, requestComponent),
            canAddShift
        }
    }
    constructor(props){
        super(props);

        var state = {
            shiftTimes: this.getDefaultShiftTimes(props)
        };
        this.state = state;
    }
    render() {
        return <AddShiftView
            shiftTimes={this.state.shiftTimes}
            dateOfRota={this.props.dateOfRota}
            onShiftTimesChange={(shiftTimes) => this.onShiftTimesChange(shiftTimes)}
            staff={this.props.staff} 
            staffTypes={this.props.staffTypes} />
    }
    getDefaultShiftTimes(props) {
        var starts_at = new Date(new Date(props.dateOfRota).setHours(18));
        var ends_at = new Date(new Date(props.dateOfRota).setHours(20));
        return {starts_at, ends_at};
    }
    addShift(staffId, requestComponent){
        this.props.addRotaShift({
            shift: {
                starts_at: this.state.shiftTimes.starts_at,
                ends_at: this.state.shiftTimes.ends_at,
                staff_member_id: staffId
            },
            errorHandlingComponent: requestComponent
        });
    }
    onShiftTimesChange(shiftTimes){
        this.setState({shiftTimes});
    }
}

function mapStateToProps(state, ownProps){
    return {
        staffMemberIsOnHoliday: _.mapObject(ownProps.staff, function(staff, staffId){
            return selectStaffMemberIsOnHolidayOnDate(state, staffId, ownProps.dateOfRota)
        }),
        staffTypes: state.staffTypes,
        staff: state.staff,
        dateOfRota: ownProps.dateOfRota,
        addShiftIsInProgress: _(state.staff).mapObject(
            (staffMember) => {
                console.log("addShiftIsInProgress", staffMember.id, selectAddShiftIsInProgress(state, staffMember.id))
                selectAddShiftIsInProgress(state, staffMember.id)
            }
        )
    }
}

function mapDispatchToProps(dispatch){
    return {
        addRotaShift: function(options){
            dispatch(actionCreators.addRotaShift(options));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(AddShiftViewContainer)
