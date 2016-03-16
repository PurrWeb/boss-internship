import React, { Component } from "react"
import {connect } from "react-redux"
import _ from "underscore"
import AddShiftView from "./add-shift-view/add-shift-view"
import { selectRotaOnVenueRotaPage } from "~redux/selectors"


class AddShiftViewContainer extends Component {
    static childContextTypes = {
        newShiftTimes: React.PropTypes.object,
        newShiftVenueServerId: React.PropTypes.any
    }
    getChildContext(){
        return {
            newShiftTimes: this.state.shiftTimes,
            newShiftVenueServerId: this.props.rota.venue.serverId
        };
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
    onShiftTimesChange(shiftTimes){
        this.setState({shiftTimes});
    }
}

function mapStateToProps(state, ownProps){
    var rota = selectRotaOnVenueRotaPage(state);
    return {
        staffTypes: state.staffTypes,
        staff: state.staff,
        dateOfRota: ownProps.dateOfRota,
        rota
    }
}

export default connect(mapStateToProps, null, null, {pure: false})(AddShiftViewContainer)
