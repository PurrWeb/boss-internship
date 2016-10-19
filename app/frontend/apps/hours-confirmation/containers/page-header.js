import React from "react"
import { connect } from "react-redux"
import VenueDropdown from "~components/venue-dropdown"
import { appRoutes } from "~lib/routes"
import DateAndVenueSelector from "~components/date-and-venue-selector"

class PageHeader extends React.Component {
    render(){
        var venueClientId = this.props.pageOptions.venue.clientId;

        var selector;
        var isDailyPage = this.props.pageOptions.date !== undefined;
        if (isDailyPage){
            selector = <div className="column">
                <DateAndVenueSelector
                    date={this.props.pageOptions.date}
                    venueClientId={venueClientId}
                    venues={this.props.venues}
                    onChange={({date, venueClientId}) => {
                        var venue = this.props.venues[venueClientId];
                        location.href = appRoutes.hoursConfirmationDayPage({
                            venueId: venue.serverId,
                            date
                        })
                    }}
                />
            </div>
        } else {
            selector = <div className="shrink column">
                <VenueDropdown
                    selectedVenues={[venueClientId]}
                    venues={this.props.venues}
                    clearable={false}
                    onChange={(venueIds) => {
                        var venue = this.props.venues[venueIds[0]]
                        location.href = appRoutes.hoursConfirmationCurrentPage({
                            venueId: venue.serverId
                        })
                    }}
                />
            </div>
        }

        return <div className="row">
            {selector}
        </div>
    }
}

function mapStateToProps(state){
    return {
        venues: state.venues,
        pageOptions: state.pageOptions
    }
}

export default connect(mapStateToProps)(PageHeader)
