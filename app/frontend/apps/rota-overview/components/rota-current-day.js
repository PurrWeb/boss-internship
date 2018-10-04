import React from 'react';
import utils from '~/lib/utils';
import VenueRotaOverviewChart from "../venue-rota-overview-chart";
import RotaForecast from "../containers/rota-forecast";
import safeMoment from "~/lib/safe-moment";
import rotaStatusTitles from "~/lib/rota-status-titles";

export default class RotaCurrentDay extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      hoverData: null,
      selectionData: null
    }
  }

  render() {
    const date = safeMoment.uiDateParse(utils.formatJSDateToUIDate(this.props.rota.date)).format('dddd, D MMMM YYYY');
    const rotaEditUrlDate = safeMoment.uiDateParse(utils.formatJSDateToUIDate(this.props.rota.date)).format('DD-MM-YYYY');
    const status = this.props.rota.status;

    return (
      <div className="boss-rotas__days-item">
        <section className="boss-board">
          { this.props.isLoading
            ? <div className="boss-spinner"></div>
            : [<header key="header" className="boss-board__header boss-board__header_adjust_rotas-weekly">
            <h2 className="boss-board__title boss-board__title_size_small">
              <a
                href={`rotas/${rotaEditUrlDate}`}
                className="boss-board__title-link boss-board__title-link_role_date"
              >&nbsp;{date}&nbsp;</a>
              <a
                href={`rotas/${rotaEditUrlDate}`}
                className="boss-button boss-button_type_small boss-button_role_edit-light boss-board__title-action"
              >&nbsp;Edit&nbsp;</a>
            </h2>
            <div className="boss-board__button-group">
              <p className="boss-button boss-button_role_published boss-button_type_small boss-button_type_no-behavior boss-board__button">
                {rotaStatusTitles[status]}
              </p>
            </div>
          </header>,
          <div key="content" className="boss-board__main">
            <div className="boss-board__rota">
              <div className="boss-board__graph">
                <div className="boss-board__graph-inner">
                  <div className="rota-overview-chart">
                    <div className="rota-overview-chart__inner">
                      <VenueRotaOverviewChart
                          staff={this.props.staff}
                          shifts={this.props.shifts}
                          dateOfRota={this.props.dateOfRota}
                          staffTypes={this.props.staffTypesWithShifts}
                          onHoverShiftsChange={(data) => this.setState({hoverData: data})}
                          onSelectionShiftsChange={(data) => this.setState({selectionData: data})}
                        />
                    </div>
                  </div>
                </div>
              </div>
              <div className="boss-board__forecast">
                <RotaForecast
                  isLoading={this.props.isLoading}
                  rotaClientId={this.props.rota.clientId}
                  forecast={this.props.rotaForecast}
                  canEditForecastedTake={true}
                />
              </div>
            </div>
          </div>]
          }
        </section>
      </div>
    )
  }
}
