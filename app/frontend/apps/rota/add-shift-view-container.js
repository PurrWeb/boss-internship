import React, { Component } from "react"
import {connect } from "react-redux"
import _ from "underscore"
import AddShiftView from "./add-shift-view/add-shift-view"
import { selectRotaOnVenueRotaPage } from "~redux/selectors"
import RotaDate from "~lib/rota-date"


class AddShiftViewContainer extends Component {
    static childContextTypes = {
        newShiftSettings: React.PropTypes.object
    }
    getChildContext(){
        var venue = this.props.rota.venue;
        return {
            newShiftSettings: {
                startsAt: this.state.shiftTimes.starts_at,
                endsAt: this.state.shiftTimes.ends_at,
                venueServerId: venue.serverId,
                venueClientId: venue.clientId,
                shiftType: this.state.shiftType
            }
        };
    }
    constructor(props){
        super(props);

        var state = {
            shiftTimes: this.getDefaultShiftTimes(props),
            shiftType: "normal"
        };
        this.state = state;
    }
    render() {
        return <AddShiftView
            shiftTimes={this.state.shiftTimes}
            onShiftTimesChange={(shiftTimes) => this.onShiftTimesChange(shiftTimes)}
            staff={this.props.staff}
            rotaDate={this.getRotaDate()}
            staffTypes={this.props.staffTypes}
            shiftType={this.state.shiftType}
            onShiftTypeChange={(shiftType) => this.setState({shiftType})} />
    }
    getDefaultShiftTimes(props) {
        var starts_at = new Date(new Date(props.dateOfRota).setHours(18));
        var ends_at = new Date(new Date(props.dateOfRota).setHours(20));
        return {starts_at, ends_at};
    }
    onShiftTimesChange(shiftTimes){
        this.setState({shiftTimes});
    }
    getRotaDate(){
        return new RotaDate({dateOfRota: this.props.dateOfRota})
    }
}

function mapStateToProps(state, ownProps){
    var rota = selectRotaOnVenueRotaPage(state);
    return {
        staffTypes: state.staffTypes,
        staff: state.staffMembers,
        dateOfRota: ownProps.dateOfRota,
        rota
    }
}

export default connect(mapStateToProps, null, null, {pure: false})(AddShiftViewContainer)
