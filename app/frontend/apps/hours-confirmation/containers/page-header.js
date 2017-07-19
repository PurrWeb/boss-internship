import React from "react"
import { connect } from "react-redux"
import VenueDropdown from "~/components/venue-dropdown"
import { appRoutes } from "~/lib/routes"
import DateAndVenueSelector from "~/components/date-and-venue-selector"

class PageHeader extends React.Component {
    render(){
        var venueClientId = this.props.pageOptions.venue.clientId;

        var selector;
        var isDailyPage = this.props.pageOptions.date !== undefined;
        if (isDailyPage){
            selector = <div className="">
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

          selector = 
          <div className="boss-page-main__dashboard">
            <div className="boss-page-main__inner">
              <div className="boss-page-dashboard boss-page-dashboard_updated">
                <h1 className="boss-page-dashboard__title">{this.props.pageOptions.pageName}</h1>
                <div className="boss-page-dashboard__group">
                  <div className="boss-page-dashboard__controls-group">
                    <div className="boss-form boss-form_page_hrc">
                      <div className="boss-form__field">
                        <div className="boss-form__select boss-form__select_size_small">
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
                      </div>
                    </div>
                  </div>
                  <div className="boss-page-dashboard__buttons-group boss-page-dashboard__buttons-group_position_last">
                    <a href={`/hours_confirmation?date=${this.props.pageOptions.pageDateFormat.date}&venue_id=${this.props.pageOptions.venue.serverId}`} className="boss-button boss-button_role_calendar boss-page-dashboard__button">View by date </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        return <div>
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
