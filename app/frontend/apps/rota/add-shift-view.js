import React, { Component } from "react"
import RotaDate from "~lib/rota-date.js"
import {connect } from "react-redux"
import ShiftTimeSelector from "~components/shift-time-selector"
import StaffFinder from "./staff-finder/staff-finder"
import validation from "~lib/validation"
import _ from "underscore"
import { selectStaffMemberIsOnHolidayOnDate } from "~redux/selectors"


class AddShiftView extends Component {
    static childContextTypes = {
        addShift: React.PropTypes.func,
        canAddShift: React.PropTypes.func
    }
    static contextTypes = {
        boundActionCreators: React.PropTypes.object
    }
    getChildContext(){
        var canAddShift = (staff_id) => {
            var { starts_at, ends_at } = this.state.shiftTimes;
            var datesAreValid = validation.areShiftTimesValid(starts_at, ends_at);
            var isAddingShift = this.props.staff[staff_id].addShiftIsInProgress;
            var isOnHoliday = this.props.staffMemberIsOnHoliday[staff_id];

            return datesAreValid && !isAddingShift && !isOnHoliday; 
        }
        return {
            addShift: (staffId, requestComponent) => this.addShift(staffId, requestComponent),
            canAddShift
        }
    }
    constructor(props){
        super(props)

        var state = {
            shiftTimes: this.getDefaultShiftTimes(props)
        };
        this.state = state;
    }
    render() {
        return (
            <div className="well well-lg">
                <h2 style={{ marginTop: 0 }}>New shift hours</h2>
                <div className="row">
                    <div className="col-md-3">
                        <ShiftTimeSelector
                            defaultShiftTimes={this.getDefaultShiftTimes(this.props)}
                            rotaDate={new RotaDate({dateOfRota: this.props.dateOfRota})}
                            onChange={(shiftTimes) => this.onShiftTimesChange(shiftTimes)}
                            dateOfRota={this.props.dateOfRota} />
                    </div>
                </div>
                <br/>
                <StaffFinder
                    staff={this.props.staff}
                    staffTypes={this.props.staffTypes} />
            </div>
        );
    }
    getDefaultShiftTimes(props) {
        var starts_at = new Date(new Date(props.dateOfRota).setHours(18));
        var ends_at = new Date(new Date(props.dateOfRota).setHours(20));
        return {starts_at, ends_at};
    }
    addShift(staffId, requestComponent){
        this.context.boundActionCreators.addRotaShift({
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
        staffTypes: state.staffTypes
    }
}

export default connect(mapStateToProps)(AddShiftView)
