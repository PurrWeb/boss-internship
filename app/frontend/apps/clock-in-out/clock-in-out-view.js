import React, { Component } from "react"
import { connect, Provider } from "react-redux"
import _ from "underscore"
import store from "~redux/store"
import moment from "moment"
import ClockInOutStaffFinder from "./staff-finder/staff-finder"
import * as actions from "~redux/actions"
import { selectRotaOnClockInOutPage, selectClockInOutAppIsInManagerMode } from "~redux/selectors"
import ConfirmationModal from "~components/confirmation-modal"
import LargeStaffTypeSelector from "./components/large-staff-type-selector"
import getStaffTypesWithStaffMembers from "~lib/get-staff-types-with-staff-members"

class ClockInOutView extends Component {
    render() {
        var classes = ["container"];
        if (this.props.clockInOutAppIsInManagerMode) {
            classes.push("managerMode");
        }

        var content = null;
        if (this.props.selectedStaffTypeClientId !== null) {
            content = <div>
                {this.getHeader()}
                <ClockInOutStaffFinder
                    selectedStaffTypeClientId={this.props.selectedStaffTypeClientId} />
            </div>
        } else {
            content = <LargeStaffTypeSelector
                staffTypes={this.props.staffTypes}
                onSelect={({staffType}) => this.props.selectStaffType(staffType.clientId)} />
        }

        return <div className={classes.join(" ")}>
            <ConfirmationModal />
            {content}
        </div>
    }
    getHeader(){
        return <div>
            <a
                className="btn btn-default show-in-manager-mode"
                style={{float: "right"}}
                onClick={() => this.props.leaveManagerMode()}>
                Leave Manager Mode
            </a>
            <h1>
                {this.props.venue.name} - {moment(this.props.rota.date).format("ddd D MMMM YYYY")}
            </h1>
        </div>
    }
}

function mapStateToProps(state) {
    var rota = selectRotaOnClockInOutPage(state);
    return {
        clockInOutAppIsInManagerMode: selectClockInOutAppIsInManagerMode(state),
        rota,
        venue: rota.venue.get(state.venues),
        staffTypes: getStaffTypesWithStaffMembers(state.staffTypes, state.staff),
        selectedStaffTypeClientId: state.clockInOutAppSelectedStaffType
    }
}

function mapDispatchToProps(dispatch){
    return {
        leaveManagerMode: function(){
            dispatch(actions.leaveManagerMode());
        },
        selectStaffType: function(selectedStaffTypeClientId){
            dispatch(actions.clockInOutAppSelectStaffType({
                selectedStaffTypeClientId
            }))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ClockInOutView);
