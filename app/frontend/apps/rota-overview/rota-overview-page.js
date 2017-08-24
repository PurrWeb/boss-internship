import React, { Component } from "react"
import RotaOverviewView from "./rota-overview-view"
import {appRoutes} from "~/lib/routes"
import {connect} from "react-redux"
import moment from "moment"
import _ from "underscore"
import utils from "~/lib/utils"
import rotaStatusTitles from "~/lib/rota-status-titles"
import { selectStaffTypesWithShifts } from "~/redux/selectors"
import WeeklyRotaForecast from "./containers/weekly-rota-forecast"
import WeekPicker from "~/components/week-picker"
import VenueDropdown from "~/components/venue-dropdown"
import RotaHeader from "./components/rota-header";
import RotaCurrentDay from "./components/rota-current-day"
import VenuesSelect from '~/components/select-venue';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const ROTA_PUBLISHED_STATUS = "published"

class RotaOverviewPage extends Component {
    static propTypes = {
        rotaDetailsObject: React.PropTypes.object.isRequired
    }
    render() {
        const storeRota = this.props.storeRotas;
        const venues = this.props.venues;

        const pdfHref = appRoutes.rotaOverviewPdfDownload({
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
            staffTypes: utils.indexByClientId(this.props.rotaDetailsObject.staff_types),
            rotaShifts: utils.indexByClientId(this.props.rotaDetailsObject.rota_shifts),
            staff: utils.indexByClientId(this.props.rotaDetailsObject.staff_members)
        });

        let currentWeek = this.generateWeek(rotaDetails.date);

        return <div className="boss-page-main">
          <RotaHeader startDate={this.props.startDate} venue={this.props.venue} endDate={this.props.endDate} pdfHref={pdfHref}/>
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
                            <VenuesSelect options={this.props.venues} selected={this.props.venue} onSelect={this.changeVenue} clientId/>
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
                            selectionStartDate={rotaDetails.date}
                            onChange={(selection) => {
                              this.goToOverviewPage({
                                startDate: selection.startDate,
                                venueClientId: this.props.venue.id
                              });
                            }}
                          />
                        </div>
                        { storeRota.status === ROTA_PUBLISHED_STATUS &&
                          <div className="boss-board__calendar-note">
                            <div className="boss-message boss-message_role_calendar-note">
                              <p className="boss-message__text"> This week's rotas have been published.</p>
                              <p className="boss-message__text"> Changes to them will send out email notifications. </p>
                            </div>
                          </div>
                        }
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
                    {this.renderDays(currentWeek)}
                  </div>
                  <RotaCurrentDay 
                    staff={this.props.rotaDetailsObject.staff_members }
                    shifts={this.props.rotaDetailsObject.rota_shifts}
                    rota={rotaDetails}
                    dateOfRota={rotaDetails.date}
                    staffTypesWithShifts={utils.indexByClientId(staffTypesWithShifts)}
                    rotaForecast={this.props.rotaForecast}
                  />
                </div>
            </div>
        </div>
      </div>
    }
    goToOverviewPage({startDate, endDate, venueClientId}){
        location.href = appRoutes.rotaOverview({
            venueId: venueClientId,
            startDate
        });
    }
    changeVenue(venue){

    }
    generateWeek(startDate){
      let startOfWeek = moment(startDate).startOf('isoweek');
      let endOfWeek = moment(startDate).endOf('isoweek');
      
      let days = [];
      let day = startOfWeek;
      
      while (day <= endOfWeek) {
        days.push(day.toDate());
        day = day.clone().add(1, 'd');
      }
      return days;
    }
    renderDays(week){
      return <Tabs>
        <TabList className="boss-paginator boss-paginator_size_full" onSelect={() => (console.log('selected tab'))} >
          {this.renderTabList(week)}
        </TabList>
        <TabPanel></TabPanel>
      </Tabs>
    }
    renderTabList(week){
      return week.map((item, index) => {
        const tabClassName = index === 0 ? 'boss-paginator__action_state_active' : '';
        const formatedDate = index === 0 ? moment(item).format('D MMMM') : moment(item).format('D');

        return <Tab className={`boss-paginator__action boss-paginator__action_type_light ${tabClassName}`}>{formatedDate}</Tab>      
      })
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
