import React from "react"
import { connect } from "react-redux"
import VenueDropdown from "~/components/venue-dropdown"
import { appRoutes } from "~/lib/routes"
import DateAndVenueSelector from "~/components/date-and-venue-selector"
import DashboardCurrentWrapper from '../components/dashboard-current-wrapper';
import DashboardDate from '../components/dashboard-date';
import moment from 'moment';

class PageHeader extends React.Component {

    handleDateChange = ({date, venueClientId}) => {
      var venue = this.props.venues[venueClientId];
      location.href = appRoutes.hoursConfirmationDayPage({
          venueId: venue.serverId,
          date
      })
    }

    render(){
        var venueClientId = this.props.pageOptions.venue.clientId;

        var selector;
        var isDailyPage = this.props.pageOptions.date !== undefined;
        if (isDailyPage){
            const venueName = this.props.venues[venueClientId].name;
            const date = moment(this.props.pageOptions.date).format('DD MMMM YYYY');
            const title = `Hours Confirmations for ${venueName} ${date}`;
            selector = 
              <DashboardDate
                title={title}
                date={this.props.pageOptions.date}
                onChange={({date, venueClientId}) => this.handleDateChange({date, venueClientId})}
                venueClientId={venueClientId}
                venues={this.props.venues}
              />

        } else {
          selector = 
          <DashboardCurrentWrapper title={this.props.pageOptions.pageName}>
            <div className="boss-page-dashboard__controls-group">
              <div className="boss-form boss-form_page_hrc">
                <div className="boss-form__field">
                  <div className="boss-form__select boss-form__select_size_small">
                      
                  </div>
                </div>
              </div>
            </div>
            <div className="boss-page-dashboard__buttons-group boss-page-dashboard__buttons-group_position_last">
              <a href={`/hours_confirmation?date=${this.props.pageOptions.pageDateFormat.date}&venue_id=${this.props.pageOptions.venue.serverId}`} className="boss-button boss-button_role_calendar boss-page-dashboard__button">View by date </a>
            </div>
          </DashboardCurrentWrapper>
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
