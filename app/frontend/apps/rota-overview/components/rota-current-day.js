import React from 'react';
import PropTypes from 'prop-types';
import VenueRotaOverviewChart from "../venue-rota-overview-chart";
import RotaForecast from "../containers/rota-forecast";

export default class RotaCurrentDay extends React.Component {
  constructor (props) {
    super(props);
    
    this.state = {
      hoverData: null,
      selectionData: null
    }
  }

  render() {
    return (
      <div className="boss-rotas__days-item">
        <section className="boss-board">
          <header className="boss-board__header boss-board__header_adjust_rotas-weekly">
            <h2 className="boss-board__title boss-board__title_size_small">
              <p className="boss-board__title-link boss-board__title-link_role_date"> Monday, 14 November 2016 </p>
              <p className="boss-button boss-button_type_small boss-button_role_edit-light boss-board__title-action"> Edit </p>
            </h2>
            <div className="boss-board__button-group">
              <p className="boss-button boss-button_role_published boss-button_type_small boss-button_type_no-behavior boss-board__button">
                Published
              </p>
            </div>
          </header>
          <div className="boss-board__main">
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
                  rotaClientId={this.props.rota.clientId}
                  canEditForecastedTake={true} />
                </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

