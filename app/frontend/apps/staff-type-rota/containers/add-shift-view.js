import React from "react"
import { connect } from "react-redux"
import AddShiftViewUi from "../components/add-shift-view"
import _ from "underscore"
import RotaDate from "~lib/rota-date"

class AddShiftView extends React.Component {
    static childContextTypes = {
        newShiftSettings: React.PropTypes.object
    }
    getChildContext(){
        var venue = this.props.venues[this.state.venueClientId];
        var {shiftTimes, shiftType} = this.state;
        return {
            newShiftSettings: {
                startsAt: shiftTimes.starts_at,
                endsAt: shiftTimes.ends_at,
                shiftType,
                venueServerId: venue.serverId,
                venueClientId: venue.clientId
            }
        };
    }
    constructor(props){
        super(props);
        this.state = {
            shiftTimes: this.getDefaultShiftTimes(props),
            shiftType: "normal",
            venueClientId: _.values(props.venues)[0].clientId
        }
    }
    render(){
        return <div>
            <AddShiftViewUi
                shiftTimes={this.state.shiftTimes}
                staff={this.props.staff}
                rotaDate={this.props.rotaDate}
                venues={this.props.venues}
                staffTypes={this.props.staffTypes}
                selectedVenueId={this.state.venueClientId}
                onVenueChange={(venue) => this.onVenueChange(venue)}
                onShiftTimesChange={(shiftTimes) => this.onShiftTimesChange(shiftTimes)}
                shiftType={this.state.shiftType}
                onShiftTypeChange={(shiftType) => this.setState({shiftType})} />
        </div>
    }
    getDefaultShiftTimes(props) {
        var starts_at = new Date(new Date(props.dateOfRota).setHours(18));
        var ends_at = new Date(new Date(props.dateOfRota).setHours(20));
        return {starts_at, ends_at};
    }
    onShiftTimesChange(shiftTimes){
        this.setState({shiftTimes});
    }
    onVenueChange(venueClientId){
        this.setState({venueClientId})
    }
}

function mapStateToProps(state){
    var dateOfRota = state.pageOptions.dateOfRota;
    return {
        staff: state.staff,
        staffTypes: state.staffTypes,
        venues: state.venues,
        dateOfRota,
        rotaDate: new RotaDate({dateOfRota: dateOfRota})
    }
}

export default connect(mapStateToProps,null,null,{pure: false})(AddShiftView)