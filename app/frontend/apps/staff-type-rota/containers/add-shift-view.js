import React from "react"
import { connect } from "react-redux"
import AddShiftViewUi from "../components/add-shift-view"
import _ from "underscore"
import { addRotaShift } from "~redux/actions"

class AddShiftView extends React.Component {
    static childContextTypes = {
        newShiftTimes: React.PropTypes.object,
        newShiftVenueServerId: React.PropTypes.any,
        newShiftVenueClientId: React.PropTypes.any
    }
    getChildContext(){
        var venue = this.props.venues[this.state.venueClientId];
        return {
            newShiftTimes: this.state.shiftTimes,
            newShiftVenueServerId: venue.serverId,
            newShiftVenueClientId: venue.clientId
        };
    }
    constructor(props){
        super(props);
        this.state = {
            shiftTimes: this.getDefaultShiftTimes(props),
            venueClientId: _.values(props.venues)[0].clientId
        }
    }
    render(){
        return <div>
            <AddShiftViewUi
                shiftTimes={this.state.shiftTimes}
                staff={this.props.staff}
                dateOfRota={this.props.dateOfRota}
                venues={this.props.venues}
                staffTypes={this.props.staffTypes}
                selectedVenueId={this.state.venueClientId}
                onVenueChange={(venue) => this.onVenueChange(venue)}
                onShiftTimesChange={(shiftTimes) => this.onShiftTimesChange(shiftTimes)} />
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
    return {
        staff: state.staff,
        staffTypes: state.staffTypes,
        venues: state.venues,
        dateOfRota: state.pageOptions.dateOfRota
    }
}

export default connect(mapStateToProps,null,null,{pure: false})(AddShiftView)