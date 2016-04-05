import React, { Component } from "react"
import { connect, Provider } from "react-redux"
import _ from "underscore"
import store from "~redux/store"
import moment from "moment"
import ClockInOutStaffFinder from "./staff-finder/staff-finder"
import * as actions from "~redux/actions"
import { selectRotaOnClockInOutPage, selectClockInOutAppIsInManagerMode } from "~redux/selectors"
import ConfirmationModal from "~components/confirmation-modal"
import LargeStaffTypeSelector from "./large-staff-type-selector"

class ClockInOutView extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedStaffType: null
        }
    }
    render() {
        var classes = ["container"];
        if (this.props.clockInOutAppIsInManagerMode) {
            classes.push("managerMode");
        }

        var content = null;
        if (this.state.selectedStaffType !== null) {
            content = <div>
                {this.getHeader()}
                <ClockInOutStaffFinder />
            </div>
        } else {
            content = <LargeStaffTypeSelector
                staffTypes={this.props.staffTypes}
                onSelect={({staffType}) => this.setState({selectedStaffType: staffType})} />
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
        staffTypes: state.staffTypes
    }
}

function mapDispatchToProps(dispatch){
    return {
        leaveManagerMode: function(){
            dispatch(actions.leaveManagerMode());
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ClockInOutView);
