import React, { Component } from "react"
import RotaOverviewView from "./rota-overview-view"
import {appRoutes} from "~/lib/routes"
import {connect} from "react-redux"
import moment from "moment"
import _ from "underscore"
import utils from "~/lib/utils"
import rotaStatusTitles from "~/lib/rota-status-titles"
import { selectStaffTypesWithShifts } from "~/redux/selectors"
import PublishRotaWeekButtonContainer from "./publish-rota-week-button-container"
import WeekAndVenueSelector from "~/components/week-and-venue-selector"
import WeeklyRotaForecast from "./containers/weekly-rota-forecast"
import WeekPicker from "~/components/week-picker"
import VenueDropdown from "~/components/venue-dropdown"
import RotaHeader from "./components/rota-header";
import RotaCurrentDay from "./components/rota-current-day"
import VenuesSelect from '~/components/select-venue';

class RotaOverviewPage extends Component {
    static propTypes = {
        rotaDetailsObject: React.PropTypes.object.isRequired
    }
    render() {
        // const overviewViews = this.getOverviewViews();

        const storeRota = this.props.storeRotas;

        const pdfHref = appRoutes.rotaPdfDownload({
          venueId: this.props.storeRotas.venue.serverId,
          startDate: this.props.startDate,
          endDate: this.props.endDate
        });
      
        var rotaDetails = _.find(this.props.rotaDetailsObject, function(obj){
          var venuesAreEqual = obj.venue.clientId === storeRota.venue.clientId;
          var datesAreEqual = utils.datesAreEqual(new Date(obj.date), storeRota.date);
          return venuesAreEqual && datesAreEqual;
        });

        var staffTypesWithShifts = selectStaffTypesWithShifts({
            staffTypes: utils.indexByClientId(rotaDetails.staff_types),
            rotaShifts: utils.indexByClientId(rotaDetails.rota_shifts),
            staff: utils.indexByClientId(rotaDetails.staff_members)
        });

        return <div className="boss-page-main">
          <RotaHeader startDate={this.props.startDate} endDate={this.props.endDate} pdfHref={pdfHref}/>
          <div className="boss-page-main__content">
            <div className="boss-page-main__inner">
                <div className="boss-rotas">
                  <div className="boss-rotas__filter">
                    <div className="boss-form">
                      <div className="boss-form__row boss-form__row_position_last">
                        <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min">
                          <p className="boss-form__label boss-form__label_type_icon-venue">
                            <span className="boss-form__label-text"> Venue </span>
                          </p>
                          <div className="boss-form__select">
                            {/* <VenuesSelect options={this.props.venues} selected={this.props.currentVenue} onSelect={this.props.changeVenue} /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="boss-rotas__summary">
                    <section className="boss-board boss-board_layout_double">
                      <div className="boss-board__calendar">
                        <div className="boss-board__calendar-inner">
                          <WeekPicker
                            selectionStartDate={this.props.storeRotas.date}
                            onChange={(selection) => {
                              this.goToOverviewPage({
                                startDate: selection.startDate,
                                endDate: selection.endDate,
                                venueClientId: this.props.venueClientId
                              });
                            }}
                          />
                        </div>
                        <div className="boss-board__calendar-note">
                          <div className="boss-message boss-message_role_calendar-note">
                            <p className="boss-message__text"> Simple text </p>
                            <p className="boss-message__text"> Simple text </p>
                          </div>
                        </div>
                      </div>
                      <div className="boss-board__info">
                        <header className="boss-board__header">
                          <h2 className="boss-board__title"> Weekly Forecast </h2>
                        </header>
                        <div className="boss-board__main">
                          <WeeklyRotaForecast
                            serverVenueId={this.props.storeRotas.venue.serverId}
                            startOfWeek={utils.getWeekStartDate(this.props.storeRotas.date)}
                          />
                        </div>
                      </div>
                    </section>
                  </div>

                </div>
                <div className="boss-rotas__days">
                  <div className="boss-rotas__days-nav">
                    <nav className="boss-paginator boss-paginator_size_full">
                      <a className="boss-paginator__action boss-paginator__action_type_light boss-paginator__action_state_active">14</a>
                    </nav>
                  </div>
                  <RotaCurrentDay 
                    staff={this.props.rotaDetailsObject.staff_members }
                    shifts={ this.props.rotaDetailsObject.rota_shifts }
                    rota={this.props.rotaDetailsObject}
                    dateOfRota={ this.props.rotaDetailsObject.date }
                    staffTypesWithShifts={staffTypesWithShifts}
                  />
                </div>
            </div>
        </div>
      </div>
    }
    goToOverviewPage({startDate, endDate, venueClientId}){
        location.href = appRoutes.rotaOverview({
            venueId: this.props.venues[venueClientId].serverId,
            startDate,
            endDate
        });
    }
}

function mapStateToProps(state){
    return {
        storeRotas: state.rotas,
        endDate: state.pageOptions.endDate,
        startDate: state.pageOptions.startDate,
        venues: state.venues
    };
}

export default connect(mapStateToProps)(RotaOverviewPage)
