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
import actionCreators from "~/redux/actions";
import { processVenueRotaOverviewObject } from "~/lib/backend-data/process-backend-objects"

const ROTA_PUBLISHED_STATUS = "published"

class RotaOverviewPage extends Component {
    static propTypes = {
      rotaDetailsObject: React.PropTypes.object.isRequired
    }
    
    constructor(props) {
      super(props);

      this.state = {
        highlightDate: this.props.storeRotas.date,
        selectedIndex: 0,
        venue: this.props.venue,
        venues: this.props.venues
      };

    }
    
    changeVenue = (venue) => {
      location.href = appRoutes.rotaOverview({
        venueId: venue.value,
        startDate: this.state.highlightDate
      })
    }
    
    render() {
        const storeRota = this.props.storeRotas;
        const venues = this.state.venues;
        const rotaDetailsObject = this.props.rotaDetailsObject;
        
        const pdfHref = appRoutes.rotaOverviewPdfDownload({
          startDate: this.props.startDate,
          endDate: this.props.endDate
        });
      
        var rotaDetails = storeRota;

        var staffTypesWithShifts = selectStaffTypesWithShifts({
            staffTypes: utils.indexByClientId(rotaDetailsObject.staff_types),
            rotaShifts: utils.indexByClientId(rotaDetailsObject.rota_shifts),
            staff: utils.indexByClientId(rotaDetailsObject.staff_members)
        });

        let currentWeek = this.generateWeek(rotaDetails.date);

        return <div className="boss-page-main">
          <RotaHeader startDate={this.props.startDate} venue={this.props.venue} rota={this.props.storeRotas} endDate={this.props.endDate} pdfHref={pdfHref}/>
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
                            <VenuesSelect options={this.props.venues} selected={this.props.venue} onSelect={this.changeVenue.bind(this)} clientId/>
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
                    isLoading={this.props.requestsInProgress}
                    staff={rotaDetailsObject.staff_members }
                    shifts={rotaDetailsObject.rota_shifts}
                    rota={rotaDetailsObject.rota}
                    dateOfRota={rotaDetailsObject.rota.date}
                    staffTypesWithShifts={utils.indexByClientId(staffTypesWithShifts)}
                    rotaForecast={this.props.rotaForecasts}
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
      return <div className="boss-paginator boss-paginator_size_full" >
          {this.renderTabList(week)}
        </div>
    }
    renderTabList(week){
      const highlightDate = moment(this.state.highlightDate, 'YYYY-MM-DD');
      return week.map((item, index) => {
        const modifiedItem = moment(item,'YYYY-MM-DD');
        const tabClassName = highlightDate.isSame(modifiedItem, 'days') ? 'boss-paginator__action_state_active' : '';
        const formatedDate = highlightDate.isSame(modifiedItem, 'days') ? moment(item).format('D MMMM') : moment(item).format('D');

        return <button key={index} onClick={() => (this.loadDayRota(index, week))} className={`boss-paginator__action boss-paginator__action_type_light ${tabClassName}`}>{formatedDate}</button>      
      })
    }
    loadDayRota = (index, week) => {
      const date = week[index];
      const formatedDate = moment(date).format('DD-MM-YYYY');
      const venueId = this.state.venue.id
      this.setState({
        highlightDate: date,
      })
      this.props.getRotaWeeklyDay(formatedDate, venueId);
    }
}

function mapDispatchToProps(dispatch, ownProps){
  return {
    getRotaWeeklyDay: function(date, venueId){
      dispatch(actionCreators.getRotaWeeklyDay({
        serverVenueId: venueId,
        date: date
      }))
    }
  }
}

function mapStateToProps(state){
  return {
    storeRotas: state.rotaWeeklyDay.rota,
    rotaDetailsObject: state.rotaWeeklyDay,
    endDate: state.pageOptions.endDate,
    startDate: state.pageOptions.startDate,
    venues: state.venues,
    rotaForecasts: state.rotaWeeklyDay.rota_forecast,
    requestsInProgress: _.some(state.apiRequestsInProgress.GET_ROTA_WEEKLY_DAY)
  };
}


export default connect(mapStateToProps,mapDispatchToProps)(RotaOverviewPage)
