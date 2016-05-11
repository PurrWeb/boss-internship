import React from "react"
import { connect } from "react-redux"
import VenueDropdown from "~components/venue-dropdown"
import { appRoutes } from "~lib/routes"

class PageHeader extends React.Component {
    render(){
        return <VenueDropdown
            selectedVenues={[this.props.pageOptions.venue.clientId]}
            venues={this.props.venues}
            clearable={false}
            onChange={(venueIds) => {
                var venue = this.props.venues[venueIds[0]]
                location.href = appRoutes.hoursConfirmationCurrentPage({
                    venueId: venue.serverId
                })
            }}
        />
    }
}

function mapStateToProps(state){
    return {
        venues: state.venues,
        pageOptions: state.pageOptions
    }
}

export default connect(mapStateToProps)(PageHeader)
